/**
 * Trat tu cong cong cua nuoc nguoi choi (GAME_SPEC muc 4, hoc Total War).
 *
 * Bat on tang vi thue, thieu luong thuc, chien tranh, mat tinh. Vuot nguong thi mo mot
 * the ba lua chon; ke no du lau thi noi loan (nguoi goi tuoc mot tinh); cham tran thi
 * sup do. Lop nay chi dem so - tinh nao mat, vang tru bao nhieu la viec cua `TheGioi.ts`.
 *
 * TypeScript thuan (luat 1). Moi so doc tu `the_gioi.json > bat_on` (luat 2).
 */
import type { DuLieuTheGioi, LuaChonBatOn } from './TheGioiData.ts';

type SoBatOn = DuLieuTheGioi['batOn'];

/** Dau vao mot gio: nhung thu ben ngoai lam bat on tang giam. */
export interface VaoBatOn {
  readonly thieuLuongThuc: boolean;
  readonly dangChien: boolean;
  /** Khoa cac the chinh sach dang lap. */
  readonly theDangLap: readonly string[];
}

/** Ket qua mot gio. */
export type KetQuaBatOn = 'yen' | 'noi_loan' | 'sup';

export class BatOn {
  private readonly so: SoBatOn;
  private diem = 0;
  private gioKe = 0;
  private gioGiamThueCon = 0;
  private coThe = false;

  constructor(so: SoBatOn) {
    this.so = so;
  }

  /** Chi so bat on hien tai. */
  get chiSo(): number {
    return this.diem;
  }

  /** The bat on dang mo, cho nguoi choi chon. */
  get theMo(): boolean {
    return this.coThe;
  }

  /** So gio con giam thue (sau lua chon "giam thue"). Dang giam thi thu vang tu nha giam. */
  get gioGiamThue(): number {
    return this.gioGiamThueCon;
  }

  get luaChon(): readonly LuaChonBatOn[] {
    return this.so.luaChon;
  }

  /** Mot gio troi qua. */
  public gio(vao: VaoBatOn): KetQuaBatOn {
    let tang: number = this.gioGiamThueCon > 0 ? 0 : this.so.thueMoiGio;
    if (vao.thieuLuongThuc) tang += this.so.thieuLuongThuc;
    if (vao.dangChien) tang += this.so.chienTranhMoiGio;
    tang -= this.so.giamMoiGio;
    for (const id of vao.theDangLap) tang -= this.so.theGiam.get(id) ?? 0;
    this.diem = Math.max(0, this.diem + tang);
    if (this.gioGiamThueCon > 0) this.gioGiamThueCon -= 1;

    if (this.diem >= this.so.nguongSup) return 'sup';
    if (this.diem < this.so.nguongThe) {
      this.coThe = false;
      this.gioKe = 0;
      return 'yen';
    }
    this.coThe = true;
    this.gioKe += 1;
    if (this.gioKe < this.so.gioNoiLoan) return 'yen';
    this.diem = Math.max(0, this.diem - this.so.noiLoanGiam);
    this.gioKe = 0;
    return 'noi_loan';
  }

  /** Vua mat mot tinh (bi chiem hay noi loan). */
  public matTinh(): void {
    this.diem += this.so.matTinh;
  }

  /**
   * Chon mot lua chon cua the. Tra ve lua chon de nguoi goi tru vang, doi, cong van hoa;
   * `undefined` khi khong co the dang mo hay khoa sai.
   */
  public chon(id: string): LuaChonBatOn | undefined {
    if (!this.coThe) return undefined;
    const lc: LuaChonBatOn | undefined = this.so.luaChon.find((l) => l.id === id);
    if (lc === undefined) return undefined;
    this.diem = Math.max(0, this.diem + lc.batOn);
    this.gioGiamThueCon = Math.max(this.gioGiamThueCon, lc.gioGiamThue);
    this.coThe = false;
    this.gioKe = 0;
    return lc;
  }
}
