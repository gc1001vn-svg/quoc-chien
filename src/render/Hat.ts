/**
 * Lo hat cua man thanh pho (Thu 1, 30/09): khoi, chim, bong chim, icon nha tac.
 *
 * MOT lenh ve cho ca lo. Hinh sinh bang so trong shader - khong anh, khong trang atlas
 * nao (chep tu bang thu, `kho-game/docs/DO_HOA.md` muc 1). Rieng icon doc tu mot anh nho
 * 128x64 ve tu hai SVG game-icons.net (CC-BY 3.0, `docs/ASSET_CREDITS.md`).
 *
 * Kieu hinh (so nguyen cua `kieu`): 0 tron mem · 2 chim (phan le = do vo canh) · 4 bong
 * bong nen icon · 6 icon kho day · 7 icon thieu hang · 8 co (phan le = pha phap phoi; Thu 2, man tran)
 * · 9 que go (Buoc 1 xay nha, 04/10: gian giao, vach mong - ve bang `themQue`, xoay theo huong que)
 * · 10 quang cong sang (Buoc 2 ngay/dem, 05/10: den, lua trai).
 *
 * Ngay/dem: moi hat nhan `u_toi` nhu sprite (`datToi`), tru icon, bong bong nen icon, quang sang, va
 * tron/que co phan le >= 0,25 (`GIU_SANG`: loi lua, dom den, chu Zzz - phai sang giua dem).
 */
import khoDaySvg from './icon/kho_day.svg?raw';
import thieuHangSvg from './icon/thieu_hang.svg?raw';
import { dungChuongTrinh } from './HauKy';
import type { Gl } from './Gl';

export const HINH = { tron: 0, chim: 2, bong: 4, khoDay: 6, thieuHang: 7, co: 8, que: 9, sang: 10 } as const;
/** Cong vao kieu `tron`/`que`: hat khong toi theo dem. */
export const GIU_SANG = 0.5;

/** Don vi texture rieng cua anh icon (atlas 0..3, hau ky 6). */
const DON_VI = 7;
/** So float moi dinh: x, y, u, v, r, g, b, a, kieu. */
const F = 9;
const GOC: readonly (readonly [number, number])[] = [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]];

const MA_DINH = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_mau;
attribute float a_kieu;
uniform vec2 u_res;
varying vec2 v_uv; varying vec4 v_mau; varying float v_kieu;
void main() {
  vec2 c = a_pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  v_uv = a_uv; v_mau = a_mau; v_kieu = a_kieu;
}`;

const MA_MANH = `
precision mediump float;
uniform sampler2D u_icon;
uniform vec3 u_toi;
varying vec2 v_uv; varying vec4 v_mau; varying float v_kieu;
void main() {
  float k = floor(v_kieu + 0.001), f = v_kieu - k, d = length(v_uv), a, giu = 0.0;
  vec3 rgb = v_mau.rgb;
  if (k < 0.5) { a = smoothstep(1.0, 0.15, d); a *= a; giu = step(0.25, f); }
  else if (k < 2.5) { float y = -abs(v_uv.x) * (0.15 + 0.9 * f) + 0.3 * f;
    a = smoothstep(0.24, 0.07, abs(v_uv.y - y)) * smoothstep(1.0, 0.8, abs(v_uv.x)); }
  else if (k < 4.5) { a = smoothstep(1.0, 0.9, d); rgb = mix(rgb, vec3(0.97, 0.93, 0.82), smoothstep(0.78, 0.9, d)); giu = 1.0; }
  else if (k > 9.5) {
    // Quang sang: alpha ra 0 - duoi cach tron nhan san (ONE, ONE_MINUS_SRC_ALPHA) la CONG thuan,
    // cung lo, khong doi cach tron, khong them lenh ve. Khong nhan toi: no la anh sang.
    a = smoothstep(1.0, 0.0, d); a *= a;
    gl_FragColor = vec4(rgb * v_mau.a * a, 0.0);
    return;
  }
  else if (k > 8.5) {
    // Que go: v_uv.y chay ngang be day que, mep mem; nua tren sang hon chut cho ra khoi go.
    a = smoothstep(1.0, 0.55, abs(v_uv.y));
    rgb *= 0.88 + 0.12 * v_uv.y;
    giu = step(0.25, f);
  }
  else if (k > 7.5) {
    // Co: can o mep trai, la co tren nua, gon song lan ra phia ngoai.
    float s = sin(v_uv.x * 5.0 - f * 6.2832), y = v_uv.y - s * 0.1 * (v_uv.x + 0.8);
    float can = 1.0 - smoothstep(0.05, 0.09, abs(v_uv.x + 0.84));
    float la = step(-0.8, v_uv.x) * (1.0 - smoothstep(0.88, 0.95, v_uv.x))
      * smoothstep(-0.97, -0.9, y) * (1.0 - smoothstep(-0.2, -0.13, y));
    a = max(can, la);
    rgb = can > la ? vec3(0.28, 0.2, 0.12) : rgb * (0.86 + 0.14 * s);
  }
  else {
    vec2 t = vec2((v_uv.x * 0.5 + 0.5) * 0.5 + (k > 6.5 ? 0.5 : 0.0), v_uv.y * 0.5 + 0.5);
    gl_FragColor = texture2D(u_icon, t) * v_mau.a;
    return;
  }
  gl_FragColor = vec4(rgb * mix(vec3(1.0) - u_toi, vec3(1.0), giu) * v_mau.a * a, v_mau.a * a);
}`;

export class Hat {
  private readonly g: WebGLRenderingContext;
  private readonly ct: WebGLProgram;
  private readonly buf: WebGLBuffer;
  private readonly anh: WebGLTexture;
  private readonly dem: Float32Array;
  private readonly toiDa: number;
  private readonly res: WebGLUniformLocation | null;
  private readonly toiNoi: WebGLUniformLocation | null;
  private toi: readonly [number, number, number] = [0, 0, 0];
  private n = 0;

  constructor(gl: Gl, toiDa: number) {
    this.g = gl.ctx();
    const g = this.g;
    this.toiDa = toiDa;
    this.dem = new Float32Array(toiDa * 6 * F);
    this.ct = dungChuongTrinh(g, MA_DINH, MA_MANH, ['a_pos', 'a_uv', 'a_mau', 'a_kieu']);
    this.res = g.getUniformLocation(this.ct, 'u_res');
    this.toiNoi = g.getUniformLocation(this.ct, 'u_toi');
    const buf = g.createBuffer();
    const anh = g.createTexture();
    if (buf === null || anh === null) throw new Error('Hat: khong xin duoc tai nguyen GPU');
    this.buf = buf;
    this.anh = anh;
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, this.dem.byteLength, g.DYNAMIC_DRAW);
    g.useProgram(this.ct);
    g.uniform1i(g.getUniformLocation(this.ct, 'u_icon'), DON_VI);
    g.activeTexture(g.TEXTURE0 + DON_VI);
    g.bindTexture(g.TEXTURE_2D, anh);
    // Mot diem trong suot cho toi khi SVG ve xong: icon chua kip hien thi chi thay bong bong.
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array(4));
    for (const [k, v] of [
      [g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR],
      [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE],
    ] as const) g.texParameteri(g.TEXTURE_2D, k, v);
    gl.khoiPhuc();
    void this.napIcon(gl);
  }

  /** Phan bot di cua tung kenh cho lo ke tiep (ngay/dem, `NgayDem.ts`); 0 = giu nguyen. */
  public datToi(r: number, g: number, b: number): void {
    this.toi = [r, g, b];
  }

  /** Them mot hinh, toa do diem anh khung ve. `r`,`g`,`b` 0..1; `a` do dac. */
  public them(
    x: number, y: number, rx: number, ry: number,
    r: number, g: number, b: number, a: number, kieu: number,
  ): void {
    if (this.n >= this.toiDa || a <= 0.003) return;
    let o = this.n * 6 * F;
    const d = this.dem;
    for (const [u, v] of GOC) {
      d[o++] = x + u * rx; d[o++] = y + v * ry; d[o++] = u; d[o++] = v;
      d[o++] = r; d[o++] = g; d[o++] = b; d[o++] = a; d[o++] = kieu;
    }
    this.n += 1;
  }

  /**
   * Them mot que thang tu `(x0,y0)` toi `(x1,y1)`, day `day` diem anh khung ve - hinh chu nhat
   * xoay theo huong que (kieu 9). `them` chi ve hop thang dung nen khong ve duoc van cheo iso.
   */
  public themQue(
    x0: number, y0: number, x1: number, y1: number, day: number,
    r: number, g: number, b: number, a: number, kieu: number = HINH.que,
  ): void {
    const dai = Math.hypot(x1 - x0, y1 - y0);
    if (this.n >= this.toiDa || a <= 0.003 || dai < 0.5) return;
    // Nua chieu dai doc que (u) va nua be day vuong goc voi que (v).
    const [ux, uy] = [(x1 - x0) / 2, (y1 - y0) / 2];
    const [vx, vy] = [(-(y1 - y0) / dai) * day / 2, ((x1 - x0) / dai) * day / 2];
    const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2];
    let o = this.n * 6 * F;
    const d = this.dem;
    for (const [u, v] of GOC) {
      d[o++] = mx + u * ux + v * vx; d[o++] = my + u * uy + v * vy; d[o++] = u; d[o++] = v;
      d[o++] = r; d[o++] = g; d[o++] = b; d[o++] = a; d[o++] = kieu;
    }
    this.n += 1;
  }

  /** Ve het lo. Tra ve so lenh ve (0 khi lo rong). Nho `gl.khoiPhuc()` sau do. */
  public xa(): number {
    if (this.n === 0) return 0;
    const g = this.g;
    const cv = g.canvas as HTMLCanvasElement;
    g.useProgram(this.ct);
    g.uniform2f(this.res, cv.width, cv.height);
    g.uniform3f(this.toiNoi, this.toi[0], this.toi[1], this.toi[2]);
    g.activeTexture(g.TEXTURE0 + DON_VI);
    g.bindTexture(g.TEXTURE_2D, this.anh);
    g.bindBuffer(g.ARRAY_BUFFER, this.buf);
    g.bufferSubData(g.ARRAY_BUFFER, 0, this.dem.subarray(0, this.n * 6 * F));
    const b = F * 4;
    g.enableVertexAttribArray(3);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, b, 0);
    g.vertexAttribPointer(1, 2, g.FLOAT, false, b, 8);
    g.vertexAttribPointer(2, 4, g.FLOAT, false, b, 16);
    g.vertexAttribPointer(3, 1, g.FLOAT, false, b, 32);
    g.drawArrays(g.TRIANGLES, 0, this.n * 6);
    g.disableVertexAttribArray(3);
    this.n = 0;
    return 1;
  }

  /** Ve hai SVG vao mot anh 128x64 roi nap len GPU. Hong thi thoi - van con bong bong. */
  private async napIcon(gl: Gl): Promise<void> {
    const cv = document.createElement('canvas');
    cv.width = 128;
    cv.height = 64;
    const c2 = cv.getContext('2d');
    if (c2 === null) return;
    const ve = async (svg: string, x: number): Promise<void> => {
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await img.decode();
      c2.drawImage(img, x + 8, 8, 48, 48);
    };
    try {
      await ve(khoDaySvg, 0);
      await ve(thieuHangSvg, 64);
    } catch { /* trinh duyet khong ve duoc SVG: icon chi con bong bong mau, van doc duoc */ return; }
    const g = this.g;
    g.activeTexture(g.TEXTURE0 + DON_VI);
    g.bindTexture(g.TEXTURE_2D, this.anh);
    g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, cv);
    gl.khoiPhuc();
  }
}
