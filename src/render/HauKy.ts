/**
 * Lop hau ky man thanh pho (Thu 1, 30/09): chinh mau + vien toi + bong may + tilt-shift.
 *
 * Canh ve vao mot FBO co cung co khung ve, roi MOT quad toan man doc FBO do ra man hinh.
 * Them dung mot lenh ve. Shader chep tu bang thu anh da xem (`kho-game/docs/DO_HOA.md`
 * muc 1), gop hai luot "canh" va "hau ky" cua bang thu lam mot, bot bloom/dem/mua.
 *
 * Ba cho khac bang thu, vi day la game chu khong phai anh chup tinh:
 * - may tinh theo toa do THE GIOI (`u_cam`), keo camera thi may dung yen tren dat;
 * - tilt-shift 12 diem thay 24, va manh dan theo zoom - thu nho het co thi tat;
 * - ban kinh nhoe tinh theo chieu cao khung ve that, khong theo anh 1050 px.
 */
import type { Gl } from './Gl';

/** Don vi texture rieng cua lop nay. Atlas dung 0..3 (`SO_TRANG_TOI_DA`), WebGL1 dam bao >= 8. */
const DON_VI = 6;

const MA_DINH = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const MA_MANH = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_canh;
uniform vec2 u_res;
uniform vec2 u_cam;
uniform float u_tiLe, u_time, u_mau, u_vien, u_may, u_mayCo, u_tilt;
uniform vec2 u_mayTroi;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s / 0.875; }
void main() {
  vec2 uv = v_uv;
  vec3 c = texture2D(u_canh, uv).rgb;
  if (u_tilt > 0.001) {
    float r = u_tilt * 8.0 * (u_res.y / 1050.0) * smoothstep(0.2, 0.5, abs(uv.y - 0.5));
    if (r > 0.35) {
      vec3 acc = vec3(0.0); float ws = 0.0;
      for (int i = 0; i < 12; i++) {
        float fi = float(i);
        float th = fi * 2.39996323;
        vec3 s = texture2D(u_canh, uv + vec2(cos(th), sin(th)) * sqrt((fi + 0.5) / 12.0) * r / u_res).rgb;
        float l = dot(s, vec3(0.3333));
        float w = 1.0 + 1.5 * l * l;
        acc += s * w; ws += w;
      }
      c = acc / ws;
    }
  }
  if (u_may > 0.001) {
    // Diem anh -> toa do the gioi: may bam dat, keo camera thi may khong chay theo.
    vec2 px = vec2(uv.x, 1.0 - uv.y) * u_res;
    vec2 w = (px - u_res * 0.5) / u_tiLe + u_cam + u_mayTroi * u_time;
    float n = fbm(w / u_mayCo * vec2(0.75, 1.5));
    c *= 1.0 - smoothstep(0.52, 0.66, n) * u_may;
  }
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  vec3 g = mix(c, c * c * (3.0 - 2.0 * c), 0.3);
  g = mix(vec3(l), g, 1.12);
  g *= mix(vec3(0.93, 0.98, 1.06), vec3(1.05, 1.0, 0.92), smoothstep(0.15, 0.85, l));
  c = mix(c, g, u_mau);
  vec2 q = (uv - 0.5) * vec2(1.0, 1.15);
  float vig = smoothstep(0.85, 0.3, length(q));
  c *= 1.0 - u_vien * (1.0 - vig);
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`;

/** So chinh cua lop hau ky, doc tu `data/hieu_ung.json > hauKy`. */
export interface SoHauKy {
  readonly mau: number;
  readonly vienToi: number;
  readonly may: number;
  readonly mayCo: number;
  readonly mayTroi: readonly number[];
  readonly tilt: number;
}

/** Nhung gi doi moi khung. */
export interface KhungHauKy {
  readonly camX: number;
  readonly camY: number;
  /** Diem anh khung ve tren mot don vi the gioi. */
  readonly tiLe: number;
  readonly giay: number;
  /** Do manh tilt-shift sau khi da nhan theo zoom, 0..1. */
  readonly tilt: number;
  readonly may: boolean;
}

export class HauKy {
  private readonly g: WebGLRenderingContext;
  private readonly so: SoHauKy;
  private readonly ct: WebGLProgram;
  private readonly quad: WebGLBuffer;
  private readonly anh: WebGLTexture;
  private readonly fbo: WebGLFramebuffer;
  private readonly noi = new Map<string, WebGLUniformLocation | null>();
  private rong = 0;
  private cao = 0;

  constructor(gl: Gl, so: SoHauKy) {
    this.g = gl.ctx();
    this.so = so;
    this.ct = dungChuongTrinh(this.g, MA_DINH, MA_MANH, ['a_pos']);
    const g = this.g;
    const quad = g.createBuffer();
    const anh = g.createTexture();
    const fbo = g.createFramebuffer();
    if (quad === null || anh === null || fbo === null) throw new Error('Hau ky: khong xin duoc tai nguyen GPU');
    this.quad = quad;
    this.anh = anh;
    this.fbo = fbo;
    g.bindBuffer(g.ARRAY_BUFFER, quad);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), g.STATIC_DRAW);
    g.activeTexture(g.TEXTURE0 + DON_VI);
    g.bindTexture(g.TEXTURE_2D, anh);
    for (const [k, v] of [
      [g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR],
      [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE],
    ] as const) g.texParameteri(g.TEXTURE_2D, k, v);
    gl.khoiPhuc();
  }

  /** Chuyen dich ve sang FBO. Goi TRUOC `gl.batDauKhung()`. */
  public batDau(): void {
    const g = this.g;
    const cv = g.canvas as HTMLCanvasElement;
    if (cv.width !== this.rong || cv.height !== this.cao) {
      this.rong = cv.width;
      this.cao = cv.height;
      g.activeTexture(g.TEXTURE0 + DON_VI);
      g.bindTexture(g.TEXTURE_2D, this.anh);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.rong, this.cao, 0, g.RGBA, g.UNSIGNED_BYTE, null);
      g.bindFramebuffer(g.FRAMEBUFFER, this.fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.anh, 0);
      g.activeTexture(g.TEXTURE0);
    }
    g.bindFramebuffer(g.FRAMEBUFFER, this.fbo);
  }

  /** Ve FBO ra man hinh qua shader hau ky. Tra ve so lenh ve (1). Nho `gl.khoiPhuc()` sau do. */
  public ketThuc(k: KhungHauKy): number {
    const g = this.g;
    g.bindFramebuffer(g.FRAMEBUFFER, null);
    g.useProgram(this.ct);
    g.activeTexture(g.TEXTURE0 + DON_VI);
    g.bindTexture(g.TEXTURE_2D, this.anh);
    g.uniform1i(this.u('u_canh'), DON_VI);
    g.uniform2f(this.u('u_res'), this.rong, this.cao);
    g.uniform2f(this.u('u_cam'), k.camX, k.camY);
    g.uniform1f(this.u('u_tiLe'), k.tiLe);
    g.uniform1f(this.u('u_time'), k.giay);
    g.uniform1f(this.u('u_mau'), this.so.mau);
    g.uniform1f(this.u('u_vien'), this.so.vienToi);
    g.uniform1f(this.u('u_may'), k.may ? this.so.may : 0);
    g.uniform1f(this.u('u_mayCo'), this.so.mayCo);
    g.uniform2f(this.u('u_mayTroi'), this.so.mayTroi[0] ?? 0, this.so.mayTroi[1] ?? 0);
    g.uniform1f(this.u('u_tilt'), k.tilt);
    g.bindBuffer(g.ARRAY_BUFFER, this.quad);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.disableVertexAttribArray(1);
    g.disableVertexAttribArray(2);
    g.disable(g.BLEND);
    g.drawArrays(g.TRIANGLES, 0, 6);
    g.enable(g.BLEND);
    g.enableVertexAttribArray(1);
    g.enableVertexAttribArray(2);
    return 1;
  }

  private u(ten: string): WebGLUniformLocation | null {
    if (!this.noi.has(ten)) this.noi.set(ten, this.g.getUniformLocation(this.ct, ten));
    return this.noi.get(ten) ?? null;
  }
}

/** Dich va noi mot chuong trinh shader; thuoc tinh ghim vi tri theo thu tu `thuocTinh`. */
export function dungChuongTrinh(
  g: WebGLRenderingContext, dinh: string, manh: string, thuocTinh: readonly string[],
): WebGLProgram {
  const ct = g.createProgram();
  if (ct === null) throw new Error('Khong xin duoc chuong trinh shader');
  for (const [loai, ma] of [[g.VERTEX_SHADER, dinh], [g.FRAGMENT_SHADER, manh]] as const) {
    const sh = g.createShader(loai);
    if (sh === null) throw new Error('Khong xin duoc shader');
    g.shaderSource(sh, ma);
    g.compileShader(sh);
    if (g.getShaderParameter(sh, g.COMPILE_STATUS) !== true) throw new Error(`Dich shader hong: ${g.getShaderInfoLog(sh) ?? ''}`);
    g.attachShader(ct, sh);
  }
  thuocTinh.forEach((ten, i) => { g.bindAttribLocation(ct, i, ten); });
  g.linkProgram(ct);
  if (g.getProgramParameter(ct, g.LINK_STATUS) !== true) throw new Error(`Noi shader hong: ${g.getProgramInfoLog(ct) ?? ''}`);
  return ct;
}
