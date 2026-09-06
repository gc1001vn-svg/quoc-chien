/**
 * Sinh so ngau nhien LAP LAI DUOC tu mot hat giong.
 *
 * TECH_SPEC muc 8 bat buoc: "cung hat giong -> cung ket qua". `Math.random()` khong lam
 * duoc viec do - ban do sinh ra moi lan mot khac thi khong test duoc, va khong luu van
 * choi bang mot con so duoc.
 *
 * Thuat toan mulberry32: mot bien dem 32 bit, tron bit roi tra ve so trong [0, 1).
 * Ngan, khong can thu vien, du tot cho viec rai nha cua va cay coi.
 */

export class Rng {
  private trangThai: number;

  /** @param hatGiong So nguyen bat ky. Cung so nay thi ra cung day so. */
  constructor(hatGiong: number) {
    this.trangThai = hatGiong >>> 0;
  }

  /** So thuc trong [0, 1). */
  public so(): number {
    this.trangThai = (this.trangThai + 0x6d2b79f5) >>> 0;
    let t: number = this.trangThai;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** So nguyen trong [0, tran). `tran` phai lon hon 0. */
  public nguyen(tran: number): number {
    return Math.floor(this.so() * tran);
  }

  /**
   * Chon mot phan tu theo trong so.
   *
   * @param muc Cac lua chon, moi cai mot trong so khong am. Tong trong so phai lon hon 0.
   */
  public theoTrongSo<T>(muc: readonly { readonly gia: T; readonly trong: number }[]): T {
    let tong = 0;
    for (const m of muc) tong += m.trong;
    let r: number = this.so() * tong;
    for (const m of muc) {
      r -= m.trong;
      if (r < 0) return m.gia;
    }
    const cuoi = muc[muc.length - 1];
    if (cuoi === undefined) throw new Error('theoTrongSo goi voi danh sach rong');
    return cuoi.gia;
  }
}
