/**
 * Nhip cua mo phong.
 *
 * TECH_SPEC muc 2: sim chay **10 Hz**, tach han khoi vong ve 60 fps. Vong ve goi
 * `tien(giaySauKhungTruoc)` roi chay dung so nhip tra ve; phan le duoc giu lai cho khung
 * sau nen khong bao gio troi nhip.
 *
 * File nay la TypeScript thuan (TECH_SPEC muc 1, luat 1): khong cham vao trinh duyet,
 * khong doc gio he thong. Thoi gian di vao tu ben ngoai.
 */

/** So nhip mo phong moi giay game. */
export const NHIP_MOI_GIAY = 10;

/** So nhip trong mot gio game. Dung de chia moc do va de doi ra chu. */
export const NHIP_MOI_GIO = NHIP_MOI_GIAY * 3600;

/** Cac muc toc do nguoi choi bam duoc. GAME_SPEC muc 3. */
export const TOC_DO = [0, 1, 2, 4, 8] as const;

/** Mot muc toc do hop le. */
export type TocDo = (typeof TOC_DO)[number];

/**
 * Tran so nhip tra ve trong mot lan goi `tien`.
 *
 * May treo mot luc roi chay lai thi `giay` co the la vai giay - chay bu ca ngan nhip
 * trong mot khung hinh se lam giat hinh. Tha bo thoi gian con hon.
 */
const TRAN_NHIP_MOI_LAN = 200;

/** Dong ho cua mo phong: dem nhip, giu phan le, doi ra gio game. */
export class DongHo {
  private nhipDaChay = 0;
  private leGiay = 0;
  private tocDoHienTai: TocDo = 1;

  /** So nhip da chay tu dau van. */
  get soNhip(): number {
    return this.nhipDaChay;
  }

  /** So gio game da troi qua, ke ca phan le. */
  get gio(): number {
    return this.nhipDaChay / NHIP_MOI_GIO;
  }

  /** Toc do dang chay. 0 la dung hinh. */
  get tocDo(): TocDo {
    return this.tocDoHienTai;
  }

  set tocDo(muc: TocDo) {
    this.tocDoHienTai = muc;
    // Doi toc do thi bo phan le: giu lai se lam nhip dau tien sau khi doi dai ngan that thuong.
    this.leGiay = 0;
  }

  /**
   * Nap them `giay` thoi gian that, tra ve so nhip can chay ngay bay gio.
   *
   * Nguoi goi phai chay du so nhip do roi moi goi lai - `nhipDaChay` cong san o day.
   */
  tien(giay: number): number {
    if (giay <= 0 || this.tocDoHienTai === 0) return 0;

    this.leGiay += giay * this.tocDoHienTai;
    let so = Math.floor(this.leGiay * NHIP_MOI_GIAY);
    if (so <= 0) return 0;

    this.leGiay -= so / NHIP_MOI_GIAY;
    if (so > TRAN_NHIP_MOI_LAN) {
      so = TRAN_NHIP_MOI_LAN;
      this.leGiay = 0;
    }
    this.nhipDaChay += so;
    return so;
  }

  /** Chay thang `so` nhip, khong qua thoi gian that. Dung cho `npm run sim:thu` va test. */
  chayThang(so: number): void {
    this.nhipDaChay += so;
  }
}

/** Doi so nhip ra chuoi `12h34` de in bang. */
export function chuoiGio(soNhip: number): string {
  const tongPhut = Math.floor(soNhip / (NHIP_MOI_GIAY * 60));
  const gio = Math.floor(tongPhut / 60);
  const phut = tongPhut % 60;
  return `${String(gio)}h${String(phut).padStart(2, '0')}`;
}
