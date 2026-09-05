/**
 * Bo ve sprite bang WebGL - tu viet, khong thu vien (TECH_SPEC muc 4).
 *
 * VI SAO KHONG DUNG CANVAS 2D: WebKit co loi hieu nang da ghi nhan (bug 181244) -
 * goi `drawImage()` hang nghin lan voi anh nho thi Safari cham. Do dung la viec game nay
 * lam moi khung hinh.
 *
 * CACH LAM: mot buffer dinh dong, moi sprite la 2 tam giac. Sprite nao cung atlas thi gom
 * vao mot lenh `drawArrays`. Doi atlas moi phai xa buffer -> canh sprite theo atlas truoc
 * khi nap la giu duoc tran 4 lenh ve moi khung hinh (TECH_SPEC muc 2).
 *
 * Khong dung depth buffer. Thu tu ve quyet dinh cai nao de len tren (painter's algorithm),
 * nen ben goi phai xep sprite theo truc sau isometric truoc khi goi `them`.
 */

/** So float moi dinh: x, y, u, v. */
const FLOAT_MOI_DINH = 4;
/** Sau dinh moi sprite: hai tam giac. */
const DINH_MOI_SPRITE = 6;

const DINH_SHADER = `
attribute vec2 a_pos;
attribute vec2 a_uv;
uniform vec2 u_res;
varying vec2 v_uv;
void main() {
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
}`;

const MANH_SHADER = `
precision mediump float;
uniform sampler2D u_atlas;
varying vec2 v_uv;
void main() {
  vec4 c = texture2D(u_atlas, v_uv);
  if (c.a < 0.01) discard;
  gl_FragColor = c;
}`;

export class Gl {
  private readonly gl: WebGLRenderingContext;
  private readonly buffer: WebGLBuffer;
  private readonly dinh: Float32Array;
  private readonly viTriPos: number;
  private readonly viTriUv: number;
  private readonly viTriRes: WebGLUniformLocation;
  private readonly sucChua: number;

  private tiLeThat = 1;
  private soSprite = 0;
  private atlasHienTai: WebGLTexture | null = null;
  private soLenhVe = 0;

  /**
   * @param canvas The canvas se ve len.
   * @param sucChua So sprite toi da trong mot lenh ve. Tran cua game la 1.500
   *   (TECH_SPEC muc 2); trang do sprite dat cao hon de tim ra tran that cua may.
   */
  constructor(canvas: HTMLCanvasElement, sucChua: number) {
    const ctx: WebGLRenderingContext | null = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      // Trang do can so that: cam trinh duyet gom nhieu khung lam mot.
      preserveDrawingBuffer: false,
    });
    if (ctx === null) throw new Error('May nay khong mo duoc WebGL');
    this.gl = ctx;
    this.sucChua = sucChua;
    this.dinh = new Float32Array(sucChua * DINH_MOI_SPRITE * FLOAT_MOI_DINH);

    const chuongTrinh: WebGLProgram = this.dungChuongTrinh();
    this.gl.useProgram(chuongTrinh);
    this.viTriPos = this.gl.getAttribLocation(chuongTrinh, 'a_pos');
    this.viTriUv = this.gl.getAttribLocation(chuongTrinh, 'a_uv');
    const res: WebGLUniformLocation | null = this.gl.getUniformLocation(chuongTrinh, 'u_res');
    if (res === null) throw new Error('Shader thieu u_res');
    this.viTriRes = res;

    const buf: WebGLBuffer | null = this.gl.createBuffer();
    if (buf === null) throw new Error('Khong xin duoc buffer dinh');
    this.buffer = buf;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.dinh.byteLength, this.gl.DYNAMIC_DRAW);
    this.gl.enableVertexAttribArray(this.viTriPos);
    this.gl.enableVertexAttribArray(this.viTriUv);
    const buoc: number = FLOAT_MOI_DINH * 4;
    this.gl.vertexAttribPointer(this.viTriPos, 2, this.gl.FLOAT, false, buoc, 0);
    this.gl.vertexAttribPointer(this.viTriUv, 2, this.gl.FLOAT, false, buoc, 8);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.DEPTH_TEST);
  }

  /**
   * Dat kich thuoc khung ve.
   *
   * `dpr` chan o 2 theo TECH_SPEC muc 2: iPhone tra dpr 3, de nguyen la gap 2,25 lan
   * cong ve ma mat thuong khong phan biet duoc.
   */
  public datKichThuoc(cssRong: number, cssCao: number, dpr: number): void {
    const tiLe: number = Math.min(dpr, 2);
    this.tiLeThat = tiLe;
    const canvas: HTMLCanvasElement = this.gl.canvas as HTMLCanvasElement;
    canvas.width = Math.round(cssRong * tiLe);
    canvas.height = Math.round(cssCao * tiLe);
    canvas.style.width = `${String(cssRong)}px`;
    canvas.style.height = `${String(cssCao)}px`;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.uniform2f(this.viTriRes, canvas.width, canvas.height);
  }

  /**
   * Ti le diem anh that tren mot CSS px, sau khi da chan o 2.
   *
   * `them` nhan toa do tinh bang diem anh cua khung ve, khong phai CSS px. Nhan voi so
   * nay de doi. Khong tu tinh lai `min(dpr, 2)` o cho khac - lech mot cho la sai het.
   */
  public tiLeDiemAnh(): number {
    return this.tiLeThat;
  }

  /** Nap mot atlas len GPU. Nho `xoaAtlas` khi doi thoi dai, dung giu lai phong khi can. */
  public napAtlas(anh: TexImageSource): WebGLTexture {
    const tex: WebGLTexture | null = this.gl.createTexture();
    if (tex === null) throw new Error('Khong xin duoc texture');
    this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    // Nhan san alpha vao mau: loc anh moi khong vien den quanh cho trong suot.
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, anh,
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return tex;
  }

  /** Tra bo nho GPU. Doi thoi dai thi goi, khong giu atlas cu. */
  public xoaAtlas(tex: WebGLTexture): void {
    if (this.atlasHienTai === tex) this.atlasHienTai = null;
    this.gl.deleteTexture(tex);
  }

  /** Mo mot khung hinh moi. Xoa man va dat lai bo dem lenh ve. */
  public batDauKhung(): void {
    this.gl.clearColor(0.07, 0.06, 0.05, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.soSprite = 0;
    this.soLenhVe = 0;
    this.atlasHienTai = null;
  }

  /**
   * Xep mot sprite vao lo hien tai.
   *
   * Toa do tinh bang diem anh cua khung ve, goc trai tren. `u`/`v` la toa do trong atlas,
   * 0..1. Doi `tex` khac lo dang gom la xa lo cu ngay - vi vay ben goi phai canh sprite
   * theo atlas de giu tran 4 lenh ve.
   */
  public them(
    tex: WebGLTexture,
    x: number, y: number, rong: number, cao: number,
    u0: number, v0: number, u1: number, v1: number,
  ): void {
    if (tex !== this.atlasHienTai || this.soSprite >= this.sucChua) {
      this.xaLo();
      this.atlasHienTai = tex;
    }
    const i: number = this.soSprite * DINH_MOI_SPRITE * FLOAT_MOI_DINH;
    const x1: number = x + rong;
    const y1: number = y + cao;
    const d: Float32Array = this.dinh;
    d[i] = x; d[i + 1] = y; d[i + 2] = u0; d[i + 3] = v0;
    d[i + 4] = x1; d[i + 5] = y; d[i + 6] = u1; d[i + 7] = v0;
    d[i + 8] = x; d[i + 9] = y1; d[i + 10] = u0; d[i + 11] = v1;
    d[i + 12] = x1; d[i + 13] = y; d[i + 14] = u1; d[i + 15] = v0;
    d[i + 16] = x1; d[i + 17] = y1; d[i + 18] = u1; d[i + 19] = v1;
    d[i + 20] = x; d[i + 21] = y1; d[i + 22] = u0; d[i + 23] = v1;
    this.soSprite += 1;
  }

  /**
   * Dong khung hinh, ve not lo cuoi.
   *
   * @returns So lenh ve da dung trong khung nay. Tran la 4 (TECH_SPEC muc 2) - vuot la loi.
   */
  public ketThucKhung(): number {
    this.xaLo();
    return this.soLenhVe;
  }

  private xaLo(): void {
    if (this.soSprite === 0 || this.atlasHienTai === null) {
      this.soSprite = 0;
      return;
    }
    const soFloat: number = this.soSprite * DINH_MOI_SPRITE * FLOAT_MOI_DINH;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.atlasHienTai);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.dinh.subarray(0, soFloat));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.soSprite * DINH_MOI_SPRITE);
    this.soLenhVe += 1;
    this.soSprite = 0;
  }

  private dungChuongTrinh(): WebGLProgram {
    const ct: WebGLProgram | null = this.gl.createProgram();
    if (ct === null) throw new Error('Khong xin duoc chuong trinh shader');
    this.gl.attachShader(ct, this.dichShader(this.gl.VERTEX_SHADER, DINH_SHADER));
    this.gl.attachShader(ct, this.dichShader(this.gl.FRAGMENT_SHADER, MANH_SHADER));
    this.gl.linkProgram(ct);
    if (this.gl.getProgramParameter(ct, this.gl.LINK_STATUS) !== true) {
      throw new Error(`Noi shader hong: ${this.gl.getProgramInfoLog(ct) ?? ''}`);
    }
    return ct;
  }

  private dichShader(loai: number, ma: string): WebGLShader {
    const sh: WebGLShader | null = this.gl.createShader(loai);
    if (sh === null) throw new Error('Khong xin duoc shader');
    this.gl.shaderSource(sh, ma);
    this.gl.compileShader(sh);
    if (this.gl.getShaderParameter(sh, this.gl.COMPILE_STATUS) !== true) {
      throw new Error(`Dich shader hong: ${this.gl.getShaderInfoLog(sh) ?? ''}`);
    }
    return sh;
  }
}
