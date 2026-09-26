/**
 * Ngoai giao giua cac nuoc (GAME_SPEC muc 5, hoc Freeciv): bon trang thai, diem quan he,
 * ba cach tac dong - thuong mai, dam phan, de doa.
 *
 * Lop nay CHI giu quan he va trang thai. Vang, quan, ai duoc gi mat gi la viec cua
 * `TheGioi.ts` - o day khong biet nuoc nao giau hay manh.
 *
 * TypeScript thuan (luat 1). Moi so doc tu `the_gioi.json > ngoai_giao` (luat 2).
 */
import type { DuLieuTheGioi, TrangThaiNG } from './TheGioiData.ts';

type SoNG = DuLieuTheGioi['ngoaiGiao'];

const QUAN_HE_MIN = -100;
const QUAN_HE_MAX = 100;

/** Khoa mot cap nuoc, khong phu thuoc thu tu. */
function cap(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export class NgoaiGiao {
  private readonly so: SoNG;
  private readonly quanHeCap = new Map<string, number>();
  private readonly trangThaiCap = new Map<string, TrangThaiNG>();
  private readonly thuongMaiCap = new Set<string>();

  constructor(so: SoNG) {
    this.so = so;
  }

  public quanHe(a: string, b: string): number {
    return this.quanHeCap.get(cap(a, b)) ?? 0;
  }

  public trangThai(a: string, b: string): TrangThaiNG {
    return this.trangThaiCap.get(cap(a, b)) ?? this.so.trangThaiDau;
  }

  public dangThuongMai(a: string, b: string): boolean {
    return this.thuongMaiCap.has(cap(a, b));
  }

  /** Cong `delta` vao quan he, ghim trong [-100, 100]. */
  public doiQuanHe(a: string, b: string, delta: number): void {
    const moi: number = Math.min(QUAN_HE_MAX, Math.max(QUAN_HE_MIN, this.quanHe(a, b) + delta));
    this.quanHeCap.set(cap(a, b), moi);
  }

  /** Tuyen chien: vao chien tranh, cat thuong mai, quan he tut. */
  public tuyenChien(a: string, b: string): void {
    this.trangThaiCap.set(cap(a, b), 'chien_tranh');
    this.thuongMaiCap.delete(cap(a, b));
    this.doiQuanHe(a, b, this.so.tuyenChienQuanHe);
  }

  /**
   * Dam phan: quan he tang, roi len DUNG MOT bac neu qua nguong cua bac do.
   * Chien tranh -> ngung ban -> hoa binh -> lien minh. Tra ve trang thai sau dam phan.
   */
  public damPhan(a: string, b: string): TrangThaiNG {
    this.doiQuanHe(a, b, this.so.damPhan.quanHe);
    const q: number = this.quanHe(a, b);
    const tt: TrangThaiNG = this.trangThai(a, b);
    const n = this.so.nguong;
    let moi: TrangThaiNG = tt;
    if (tt === 'chien_tranh' && q >= n.ngungBan) moi = 'ngung_ban';
    else if (tt === 'ngung_ban' && q >= n.hoaBinh) moi = 'hoa_binh';
    else if (tt === 'hoa_binh' && q >= n.lienMinh) moi = 'lien_minh';
    this.trangThaiCap.set(cap(a, b), moi);
    return moi;
  }

  /** Mo / dong tuyen thuong mai. Dang chien tranh thi khong mo duoc - tra ve false. */
  public datThuongMai(a: string, b: string, mo: boolean): boolean {
    if (!mo) {
      this.thuongMaiCap.delete(cap(a, b));
      return true;
    }
    if (this.trangThai(a, b) === 'chien_tranh') return false;
    this.thuongMaiCap.add(cap(a, b));
    return true;
  }

  /**
   * De doa: `tiLeSuc` = suc quan ben de doa / suc quan ben bi de doa. Du manh thi doi
   * phuong lui (quan he tut nhe); yeu ma de doa thi phan tac dung (tut manh).
   */
  public deDoa(a: string, b: string, tiLeSuc: number): boolean {
    const thang: boolean = tiLeSuc >= this.so.deDoa.tiLeThang;
    this.doiQuanHe(a, b, thang ? this.so.deDoa.quanHeThang : this.so.deDoa.quanHeThua);
    return thang;
  }

  /** Mot gio troi qua: quan he troi ve 0, tuyen thuong mai keo quan he len. */
  public gio(nuoc: readonly string[]): void {
    for (let i = 0; i < nuoc.length; i++) {
      for (let j = i + 1; j < nuoc.length; j++) {
        const a = nuoc[i] as string;
        const b = nuoc[j] as string;
        const q: number = this.quanHe(a, b);
        const troi: number = Math.min(Math.abs(q), this.so.troiMoiGio) * Math.sign(q);
        this.doiQuanHe(a, b, -troi + (this.dangThuongMai(a, b) ? this.so.thuongMai.quanHeMoiGio : 0));
      }
    }
  }

  /** So nuoc (tru `ung`) bau `ung` lam minh chu: quan he du cao, hoac dang lien minh. */
  public demPhieu(ung: string, conSong: readonly string[]): number {
    let phieu = 0;
    for (const n of conSong) {
      if (n === ung) continue;
      if (this.quanHe(ung, n) >= this.so.bau.quanHeBau || this.trangThai(ung, n) === 'lien_minh') phieu += 1;
    }
    return phieu;
  }
}
