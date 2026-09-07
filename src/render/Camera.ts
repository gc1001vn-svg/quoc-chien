/**
 * Camera cua canh thanh pho: keo mot ngon de di, chum hai ngon de thu phong.
 *
 * DON VI: camera giu toa do trong "diem anh cua atlas dang dung" (goi la toa do the gioi).
 * Atlas 2x co `o_px` gap doi atlas 1x, nen chia cho `heSo` la ra don vi CSS px chung cho
 * ca hai bo - nho vay doi bo atlas khong lam thanh pho to nho khac di.
 *
 *     cssTrenWorld = zoom / heSo
 *
 * Zoom bi chan hai dau boi `data/thanh_pho_demo.json`. Chan duoi khong phai cho dep: thu
 * nho ra thi so o phai ve tang theo binh phuong, ha qua thap la vuot tran 1.500 sprite
 * cua TECH_SPEC muc 2.
 */
import type { Khung } from './IsoMath';

/** Hai ngon cach nhau duoi nguong nay thi bo qua, coi nhu nhieu. */
const CHUM_TOI_THIEU = 8;

export class Camera {
  private readonly heSo: number;
  private readonly zoomMin: number;
  private readonly zoomMax: number;
  private readonly nuaRongWorld: number;
  private readonly caoWorld: number;

  private tamX = 0;
  private tamY = 0;
  private phong: number;
  private rongCss = 1;
  private caoCss = 1;

  private readonly ngon = new Map<number, { x: number; y: number }>();
  private chumTruoc = 0;

  /**
   * @param heSo He so co cua bo atlas dang dung: 1 hay 2.
   * @param canh Canh ban do, tinh bang o.
   * @param oPx Be ngang mot o nen trong atlas, tinh bang diem anh.
   */
  constructor(
    heSo: number, canh: number, oPx: number,
    zoomMin: number, zoomMax: number, zoomDau: number,
  ) {
    this.heSo = heSo;
    this.zoomMin = zoomMin;
    this.zoomMax = zoomMax;
    this.phong = Math.min(Math.max(zoomDau, zoomMin), zoomMax);
    this.nuaRongWorld = ((canh - 1) * oPx) / 2;
    this.caoWorld = ((canh - 1) * oPx) / 2;
    // Mo ra o giua ban do.
    this.tamY = this.caoWorld / 2;
  }

  /** CSS px tren mot don vi the gioi. */
  public cssTrenWorld(): number {
    return this.phong / this.heSo;
  }

  public zoom(): number {
    return this.phong;
  }

  public datZoom(z: number): void {
    this.phong = Math.min(Math.max(z, this.zoomMin), this.zoomMax);
    this.keoVeTrong();
  }

  /** Bao cho camera biet khung ve rong bao nhieu CSS px. Goi lai moi lan doi kich thuoc. */
  public datKichThuoc(rongCss: number, caoCss: number): void {
    this.rongCss = rongCss;
    this.caoCss = caoCss;
    this.keoVeTrong();
  }

  /** Dat tam khung nhin, toa do the gioi. Tu kep lai cho khoi loi ra ngoai ban do. */
  public datTam(x: number, y: number): void {
    this.tamX = x;
    this.tamY = y;
    this.keoVeTrong();
  }

  /** Khung nhin hien tai, tinh bang toa do the gioi. */
  public khung(): Khung {
    const nuaX: number = this.rongCss / 2 / this.cssTrenWorld();
    const nuaY: number = this.caoCss / 2 / this.cssTrenWorld();
    return {
      x0: this.tamX - nuaX, x1: this.tamX + nuaX,
      y0: this.tamY - nuaY, y1: this.tamY + nuaY,
    };
  }

  /** Nghe cham va chuot tren `el`. Goi mot lan luc dung canh. */
  public noiVao(el: HTMLElement): void {
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      this.ngon.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.chumTruoc = 0;
    });
    el.addEventListener('pointermove', (e: PointerEvent) => { this.ngonDi(e); });
    const buong = (e: PointerEvent): void => {
      this.ngon.delete(e.pointerId);
      this.chumTruoc = 0;
    };
    el.addEventListener('pointerup', buong);
    el.addEventListener('pointercancel', buong);
    el.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      this.phongQuanh(Math.exp(-e.deltaY / 400), e.clientX, e.clientY);
    }, { passive: false });
  }

  private ngonDi(e: PointerEvent): void {
    const cu = this.ngon.get(e.pointerId);
    if (cu === undefined) return;
    const dx: number = e.clientX - cu.x;
    const dy: number = e.clientY - cu.y;
    cu.x = e.clientX;
    cu.y = e.clientY;

    if (this.ngon.size === 1) {
      const ti: number = this.cssTrenWorld();
      this.tamX -= dx / ti;
      this.tamY -= dy / ti;
      this.keoVeTrong();
      return;
    }
    if (this.ngon.size !== 2) return;

    const hai = [...this.ngon.values()];
    const p = hai[0];
    const q = hai[1];
    if (p === undefined || q === undefined) return;
    const kc: number = Math.hypot(p.x - q.x, p.y - q.y);
    if (kc < CHUM_TOI_THIEU) return;
    if (this.chumTruoc > 0) {
      this.phongQuanh(kc / this.chumTruoc, (p.x + q.x) / 2, (p.y + q.y) / 2);
    }
    this.chumTruoc = kc;
  }

  /** Phong `lan` lan, giu nguyen diem the gioi dang nam duoi `(cssX, cssY)`. */
  private phongQuanh(lan: number, cssX: number, cssY: number): void {
    const truoc: number = this.cssTrenWorld();
    const lechX: number = cssX - this.rongCss / 2;
    const lechY: number = cssY - this.caoCss / 2;
    const diemX: number = this.tamX + lechX / truoc;
    const diemY: number = this.tamY + lechY / truoc;

    this.phong = Math.min(Math.max(this.phong * lan, this.zoomMin), this.zoomMax);

    const sau: number = this.cssTrenWorld();
    this.tamX = diemX - lechX / sau;
    this.tamY = diemY - lechY / sau;
    this.keoVeTrong();
  }

  /**
   * Khong cho camera troi ra ngoai ban do.
   *
   * Ban do o goc cheo la mot HINH THOI, khong phai hinh chu nhat: tam (0, cao/2), ban truc
   * `nuaRongWorld` va `cao/2`. Kep TAM camera vao dung hinh thoi do:
   *
   *     |x| / W + |y - cy| / cy <= 1
   *
   * KEP CAI GI MOI DUNG - da sai mot lan 07/09. Ban dau kep sao cho CA BON GOC khung nhin
   * nam trong hinh thoi, cot cho khong bao gio thay nen den. Nhung nhu the tam chi di duoc
   * trong mot hinh thoi nho hon dung nua khung nhin: o muc 0,35x chi con 21% be ngang ban
   * do, keo mot ti la kep - chu du an bao "keo khong het cac noi, no bi ket". Doi lai thanh
   * kep TAM: moi o cua ban do deu keo toi duoc, doi lai gan mep thi thay mot it nen - dung
   * nhu moi game o goc cheo khac.
   */
  private keoVeTrong(): void {
    const cy: number = this.caoWorld / 2;
    const lechY: number = this.tamY - cy;
    const xa: number = Math.abs(this.tamX) / this.nuaRongWorld + Math.abs(lechY) / cy;
    if (xa <= 1) return;
    const co: number = 1 / xa;
    this.tamX *= co;
    this.tamY = cy + lechY * co;
  }
}
