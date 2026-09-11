/**
 * The chinh sach (GAME_SPEC muc 7, hoc Civilization VI): chinh phu co N o, nguoi choi lap
 * N the trong bo da mo khoa. Lap lai luc nao cung duoc, co thoi gian cho.
 *
 * **Hieu ung phai thao ra duoc dung bang cai da lap vao.** Vi vay chi co hai thu:
 * `heSoNghienCuu` (cong don quanh 100) va `noiTran` (cong don vao tran cua thong doc).
 * Khong co `xay` nhu the quyet dinh - xay roi thi thao the ra khong do nha di duoc.
 *
 * He so cong don chu khong nhan don: hai the +45 % thanh +90 %, khong phai +110 %. Nhan
 * don thi bay o cuoi van co bay the la nghien cuu nhanh gap sau lan, va ca cay cong nghe
 * xong trong vai gio.
 *
 * TypeScript thuan (luat 1). Moi con so nam trong `data/the_chinh_sach.json` (luat 2).
 */
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

/** Tran duoi cua he so nghien cuu: lap day the nang tran cung khong dung han nghien cuu. */
const HE_SO_TOI_THIEU = 10;
/** So am nho nhat mot the duoc phep noi tran. Chan go danh may mot so khong lo. */
const NOI_TRAN_TOI_THIEU = -200;

/** Mot the chinh sach doc tu `data/the_chinh_sach.json`. */
export interface The {
  readonly id: string;
  readonly hien: string;
  /** Mat loi, mot cau cho nguoi choi doc. */
  readonly loi: string;
  /** Mat hai. Moi the phai co danh doi that (GAME_SPEC muc 7). */
  readonly hai: string;
  /** Phan tram. 100 la khong doi, 125 la +25 %. */
  readonly heSoNghienCuu: number;
  readonly noiTran: { readonly nha: number; readonly kho: number };
}

/** Doc `data/the_chinh_sach.json`. Nem `LoiDuLieu` kem duong dan neu sai. */
export function docTheChinhSach(tho: unknown): The[] {
  const goc = layObject(tho, 'the_chinh_sach.json');
  const mang = layMang(goc['the'], 'the_chinh_sach.json > the');
  if (mang.length === 0) throw new LoiDuLieu('the_chinh_sach.json > the', 'khong duoc rong');

  const ds: The[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `the_chinh_sach.json > the[${String(i)}]`;
    const o = layObject(muc, duong);
    const id = layChuoi(o['id'], `${duong}.id`);
    if (daCo.has(id)) throw new LoiDuLieu(`${duong}.id`, `trung id "${id}"`);
    daCo.add(id);
    const nt = layObject(o['noiTran'], `${duong}.noiTran`);
    ds.push({
      id,
      hien: layChuoi(o['hien'], `${duong}.hien`),
      loi: layChuoi(o['loi'], `${duong}.loi`),
      hai: layChuoi(o['hai'], `${duong}.hai`),
      heSoNghienCuu: laySoNguyen(o['heSoNghienCuu'], `${duong}.heSoNghienCuu`, HE_SO_TOI_THIEU),
      noiTran: {
        nha: laySoNguyen(nt['nha'], `${duong}.noiTran.nha`, NOI_TRAN_TOI_THIEU),
        kho: laySoNguyen(nt['kho'], `${duong}.noiTran.kho`, NOI_TRAN_TOI_THIEU),
      },
    });
  }
  return ds;
}

/** Bo the chinh sach cua mot van dang choi: the nao da mo, o nao dang lap cai gi. */
export class BoChinhSach {
  private readonly ds: readonly The[];
  private readonly gioCho: number;
  private readonly moKhoa = new Set<string>();
  /** Mot o mot the. Do dai bang so o cua thoi dai dang o. */
  private o: (The | undefined)[] = [];
  /** Gio game lan doi the gan nhat. `-Infinity` de lan dau khong phai cho. */
  private gioDoiCuoi = Number.NEGATIVE_INFINITY;

  constructor(ds: readonly The[], gioCho: number) {
    this.ds = ds;
    this.gioCho = gioCho;
  }

  /** Doi so o chinh phu (len thoi dai thi tang). O bot di thi the o do bi thao ra. */
  datSoO(n: number): void {
    while (this.o.length < n) this.o.push(undefined);
    this.o = this.o.slice(0, n);
  }

  get soO(): number {
    return this.o.length;
  }

  /** Mo khoa mot the. Cong nghe goi qua `moThe`. Id la, khong co trong bo, thi nem loi. */
  mo(id: string): The {
    const t: The | undefined = this.ds.find((x) => x.id === id);
    // Go sai id trong tech.json thi phai vo NGAY luc hoc xong, khong im lang bo qua roi
    // nguoi choi ngoi doi mot the khong bao gio hien ra.
    if (t === undefined) throw new LoiDuLieu('tech.json > moThe', `khong co the "${id}"`);
    this.moKhoa.add(id);
    return t;
  }

  /** The da mo khoa, ke ca cai dang lap. */
  daMo(): The[] {
    return this.ds.filter((t) => this.moKhoa.has(t.id));
  }

  /** The dang lap, theo tung o. `undefined` la o trong. */
  get dangLap(): readonly (The | undefined)[] {
    return this.o;
  }

  /** Con bao nhieu gio nua moi duoc doi the. 0 la doi duoc ngay. */
  conCho(gio: number): number {
    return Math.max(0, this.gioCho - (gio - this.gioDoiCuoi));
  }

  /**
   * Lap the `id` vao o `chiSo`. Tra ve `false` khi: o khong co that, the chua mo khoa,
   * the dang lap o o khac, hay chua het thoi gian cho.
   *
   * Lap de len mot o dang co the khac la thay - dung mot lan cho, khong phai hai.
   */
  lap(chiSo: number, id: string, gio: number): boolean {
    if (chiSo < 0 || chiSo >= this.o.length) return false;
    if (!this.moKhoa.has(id)) return false;
    if (this.o.some((t, k) => k !== chiSo && t?.id === id)) return false;
    if (this.conCho(gio) > 0) return false;
    const t: The | undefined = this.ds.find((x) => x.id === id);
    if (t === undefined) return false;
    this.o[chiSo] = t;
    this.gioDoiCuoi = gio;
    return true;
  }

  /** Thao the khoi o `chiSo`. Tra ve `false` khi o trong hoac chua het thoi gian cho. */
  thao(chiSo: number, gio: number): boolean {
    if (chiSo < 0 || chiSo >= this.o.length) return false;
    if (this.o[chiSo] === undefined) return false;
    if (this.conCho(gio) > 0) return false;
    this.o[chiSo] = undefined;
    this.gioDoiCuoi = gio;
    return true;
  }

  /** He so nghien cuu dang chay, phan tram. Cong don quanh 100, khong xuong duoi tran duoi. */
  get heSoNghienCuu(): number {
    let ra = 100;
    for (const t of this.o) {
      if (t !== undefined) ra += t.heSoNghienCuu - 100;
    }
    return Math.max(HE_SO_TOI_THIEU, ra);
  }

  /** Tong noi tran cua nhung the DANG lap. Thao the ra la so nay tu tru lai. */
  get tongNoiTran(): { nha: number; kho: number } {
    let nha = 0;
    let kho = 0;
    for (const t of this.o) {
      if (t === undefined) continue;
      nha += t.noiTran.nha;
      kho += t.noiTran.kho;
    }
    return { nha, kho };
  }
}
