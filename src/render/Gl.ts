/**
 * Bo ve sprite bang WebGL - tu viet, khong thu vien (TECH_SPEC muc 4).
 *
 * VI SAO KHONG DUNG CANVAS 2D: WebKit co loi hieu nang da ghi nhan (bug 181244) -
 * goi `drawImage()` hang nghin lan voi anh nho thi Safari cham. Do dung la viec game nay
 * lam moi khung hinh.
 *
 * CACH LAM: mot buffer dinh dong, moi sprite la 2 tam giac. TAT CA cac trang cua mot atlas
 * duoc nap len GPU cung luc, moi sprite mang theo so hieu trang cua no, nen ca mot lop ve
 * chi ton MOT lenh `drawArrays` du atlas co may trang. Chi tiet vi sao: `Shader.ts`.
 *
 * Khong dung depth buffer. Thu tu ve quyet dinh cai nao de len tren (painter's algorithm),
 * nen ben goi phai xep sprite theo truc sau isometric truoc khi goi `them`.
 */
import { MA_DINH, SO_TRANG_TOI_DA, maManh, tenUniformTrang } from './Shader';

/** So float moi dinh: x, y, u, v, trang. */
const FLOAT_MOI_DINH = 5;
/** Sau dinh moi sprite: hai tam giac. */
const DINH_MOI_SPRITE = 6;

export class Gl {
  private readonly gl: WebGLRenderingContext;
  private readonly buffer: WebGLBuffer;
  private readonly dinh: Float32Array;
  private readonly viTriRes: WebGLUniformLocation;
  private readonly sucChua: number;
  private readonly soTrang: number;

  private tiLeThat = 1;
  private soSprite = 0;
  private soLenhVe = 0;
  private daGanTrang = false;

  /**
   * @param canvas The canvas se ve len.
   * @param sucChua So sprite toi da trong mot lenh ve. Tran cua game la 3.500
   *   (TECH_SPEC muc 2); trang do sprite dat cao hon de tim ra tran that cua may.
   * @param soTrang So trang atlas se nap cung luc. PHAI biet truoc khi dung shader, nen
   *   ben goi nap file JSON cua atlas xong roi moi dung `Gl`.
   */
  constructor(canvas: HTMLCanvasElement, sucChua: number, soTrang = 1) {
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
    this.soTrang = Math.min(Math.max(Math.trunc(soTrang), 1), SO_TRANG_TOI_DA);
    this.dinh = new Float32Array(sucChua * DINH_MOI_SPRITE * FLOAT_MOI_DINH);

    const chuongTrinh: WebGLProgram = this.dungChuongTrinh();
    this.gl.useProgram(chuongTrinh);
    const res: WebGLUniformLocation | null = this.gl.getUniformLocation(chuongTrinh, 'u_res');
    if (res === null) throw new Error('Shader thieu u_res');
    this.viTriRes = res;
    // Trang thu i luon doc tu don vi texture thu i. Gan mot lan, khong doi nua.
    for (let i = 0; i < this.soTrang; i += 1) {
      const noi: WebGLUniformLocation | null =
        this.gl.getUniformLocation(chuongTrinh, tenUniformTrang(i));
      if (noi === null) throw new Error(`Shader thieu ${tenUniformTrang(i)}`);
      this.gl.uniform1i(noi, i);
    }

    const buf: WebGLBuffer | null = this.gl.createBuffer();
    if (buf === null) throw new Error('Khong xin duoc buffer dinh');
    this.buffer = buf;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.dinh.byteLength, this.gl.DYNAMIC_DRAW);
    this.noiThuocTinh(chuongTrinh, 'a_pos', 2, 0);
    this.noiThuocTinh(chuongTrinh, 'a_uv', 2, 8);
    this.noiThuocTinh(chuongTrinh, 'a_trang', 1, 16);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.DEPTH_TEST);
  }

  /** So trang atlas bo ve nay dung duoc. Nap khac so nay la sai shader. */
  public soTrangDungDuoc(): number {
    return this.soTrang;
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

  /** Nap mot trang atlas len GPU. Nho `xoaAtlas` khi doi thoi dai, dung giu lai phong khi can. */
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

  /**
   * Gan ca bo trang cua mot atlas len GPU cung luc.
   *
   * Goi mot lan sau khi nap atlas, khong goi moi khung hinh. Doi bo trang la xa lo dang
   * gom - nen dung goi giua chung mot lop ve.
   *
   * @param trang Cac trang theo dung thu tu `trang` ghi trong file JSON cua atlas.
   */
  public datTrang(trang: readonly WebGLTexture[]): void {
    if (trang.length !== this.soTrang) {
      throw new Error(
        `Bo ve dung cho ${String(this.soTrang)} trang, nhan duoc ${String(trang.length)}`,
      );
    }
    this.xaLo();
    for (let i = 0; i < trang.length; i += 1) {
      const tex: WebGLTexture | undefined = trang[i];
      if (tex === undefined) throw new Error(`Thieu trang atlas thu ${String(i)}`);
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    }
    this.daGanTrang = true;
  }

  /** Tra bo nho GPU. Doi thoi dai thi goi, khong giu atlas cu. */
  public xoaAtlas(tex: WebGLTexture): void {
    this.gl.deleteTexture(tex);
    this.daGanTrang = false;
  }

  /** Mo mot khung hinh moi. Xoa man va dat lai bo dem lenh ve. */
  public batDauKhung(): void {
    this.gl.clearColor(0.07, 0.06, 0.05, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.soSprite = 0;
    this.soLenhVe = 0;
  }

  /**
   * Xep mot sprite vao lo hien tai.
   *
   * Toa do tinh bang diem anh cua khung ve, goc trai tren. `u`/`v` la toa do trong atlas,
   * 0..1. `trang` la so hieu trang atlas cua sprite - doi trang KHONG xa lo, shader tu chon.
   */
  public them(
    trang: number,
    x: number, y: number, rong: number, cao: number,
    u0: number, v0: number, u1: number, v1: number,
  ): void {
    if (this.soSprite >= this.sucChua) this.xaLo();
    const i: number = this.soSprite * DINH_MOI_SPRITE * FLOAT_MOI_DINH;
    const x1: number = x + rong;
    const y1: number = y + cao;
    const p: number = trang;
    const d: Float32Array = this.dinh;
    d[i] = x; d[i + 1] = y; d[i + 2] = u0; d[i + 3] = v0; d[i + 4] = p;
    d[i + 5] = x1; d[i + 6] = y; d[i + 7] = u1; d[i + 8] = v0; d[i + 9] = p;
    d[i + 10] = x; d[i + 11] = y1; d[i + 12] = u0; d[i + 13] = v1; d[i + 14] = p;
    d[i + 15] = x1; d[i + 16] = y; d[i + 17] = u1; d[i + 18] = v0; d[i + 19] = p;
    d[i + 20] = x1; d[i + 21] = y1; d[i + 22] = u1; d[i + 23] = v1; d[i + 24] = p;
    d[i + 25] = x; d[i + 26] = y1; d[i + 27] = u0; d[i + 28] = v1; d[i + 29] = p;
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
    if (this.soSprite === 0 || !this.daGanTrang) {
      this.soSprite = 0;
      return;
    }
    const soFloat: number = this.soSprite * DINH_MOI_SPRITE * FLOAT_MOI_DINH;
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.dinh.subarray(0, soFloat));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.soSprite * DINH_MOI_SPRITE);
    this.soLenhVe += 1;
    this.soSprite = 0;
  }

  /** Noi mot thuoc tinh dinh vao buffer dang gan. `lech` tinh bang byte. */
  private noiThuocTinh(ct: WebGLProgram, ten: string, soFloat: number, lech: number): void {
    const noi: number = this.gl.getAttribLocation(ct, ten);
    if (noi < 0) throw new Error(`Shader thieu thuoc tinh ${ten}`);
    this.gl.enableVertexAttribArray(noi);
    this.gl.vertexAttribPointer(
      noi, soFloat, this.gl.FLOAT, false, FLOAT_MOI_DINH * 4, lech,
    );
  }

  private dungChuongTrinh(): WebGLProgram {
    const ct: WebGLProgram | null = this.gl.createProgram();
    if (ct === null) throw new Error('Khong xin duoc chuong trinh shader');
    this.gl.attachShader(ct, this.dichShader(this.gl.VERTEX_SHADER, MA_DINH));
    this.gl.attachShader(ct, this.dichShader(this.gl.FRAGMENT_SHADER, maManh(this.soTrang)));
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
