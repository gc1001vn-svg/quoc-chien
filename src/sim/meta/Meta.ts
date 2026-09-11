/**
 * Lop meta cua mot van (Phase 8): cay cong nghe + Eureka + thoi dai + the chinh sach.
 *
 * Day la cho DUY NHAT `Van.ts` goi toi - bon thu tren khong ai tu chay. Gop lai mot cua
 * thi thu tu trong mot gio game la co dinh va test duoc: cham Eureka truoc (de cong nghe
 * dang hoc re ngay gio nay), don diem sau, xet len doi cuoi.
 *
 * TypeScript thuan (luat 1). Khong con so nao nam trong file nay (luat 2).
 */
import type { ThongKe } from '../city/Cham.ts';
import type { ThanhPho } from '../city/City.ts';
import type { Governor } from '../autoplay/Governor.ts';
import type { SoThanhPho } from '../decision/DieuKien.ts';
import { apHauQua } from '../decision/HauQua.ts';
import { layObject, laySoNguyen } from '../city/DocJson.ts';
import { CayCongNghe, docCongNghe, type CongNghe, type DuLieuCongNghe } from './CongNghe.ts';
import { docEureka, SoEureka, type DuLieuEureka } from './Eureka.ts';
import { BoChinhSach, docTheChinhSach, type The } from './TheChinhSach.ts';
import { docThoiDai, ThoiDai, type Doi } from './ThoiDai.ts';

/** Mot viec lop meta vua lam, de ghi vao nhat ky su kien. */
export interface TinMeta {
  readonly loai: 'cong_nghe' | 'eureka' | 'thoi_dai';
  readonly chu: string;
}

/** Moi thu `Meta` can de dung, da doc xong tu JSON. */
export interface DuLieuMeta {
  readonly congNghe: DuLieuCongNghe;
  readonly eureka: DuLieuEureka;
  readonly the: readonly The[];
  readonly doi: readonly Doi[];
  readonly gioChoDoiThe: number;
}

/**
 * Doc bon file JSON thanh `DuLieuMeta`.
 *
 * Mot cua doc duy nhat: `npm run sim:congnghe` doc bang `fs`, trinh duyet doc bang
 * `import` JSON, nhung ca hai di qua ham nay - khong co ban sao thu hai de troi khac.
 */
export function docDuLieuMeta(
  tech: unknown, eureka: unknown, the: unknown, canBang: unknown,
): DuLieuMeta {
  const cb = layObject(canBang, 'balance.json');
  return {
    congNghe: docCongNghe(tech),
    eureka: docEureka(eureka),
    the: docTheChinhSach(the),
    doi: docThoiDai(canBang),
    gioChoDoiThe: laySoNguyen(cb['gioChoDoiThe'], 'balance.json > gioChoDoiThe', 0),
  };
}

export class Meta {
  readonly cay: CayCongNghe;
  readonly eureka: SoEureka;
  readonly chinhSach: BoChinhSach;
  readonly thoiDai: ThoiDai;
  private readonly tp: ThanhPho;
  private readonly td: Governor;
  /**
   * Phan noi tran cua the chinh sach DA cong vao thong doc. Giu lai de moi gio chi cong
   * phan CHENH - khong co no thi lap mot the +25 trong nam gio la tran nha len 125.
   */
  private daApNha = 0;
  private daApKho = 0;
  private gioNay = 0;

  constructor(du: DuLieuMeta, tp: ThanhPho, td: Governor) {
    this.cay = new CayCongNghe(du.congNghe);
    this.eureka = new SoEureka(du.eureka);
    this.chinhSach = new BoChinhSach(du.the, du.gioChoDoiThe);
    this.thoiDai = new ThoiDai(du.doi);
    this.tp = tp;
    this.td = td;
    this.chinhSach.datSoO(this.thoiDai.doi.soO);
  }

  /** Gio game moi nhat lop meta nhin thay. Bang UI can de biet con phai cho bao lau. */
  get gio(): number {
    return this.gioNay;
  }

  /** Gia thuc cua mot cong nghe sau khi tru Eureka da dat. */
  gia(c: CongNghe): number {
    return this.eureka.gia(c.id, c.gia);
  }

  /** Diem nghien cuu mot gio game sinh ra, da tinh the chinh sach. */
  get diemMoiGio(): number {
    return this.cay.diemMoiGio(this.tp.soNha, this.chinhSach.heSoNghienCuu);
  }

  /**
   * Chot mot gio game. Tra ve nhung viec vua xay ra, de `Van.ts` ghi vao nhat ky.
   *
   * Goi moi gio, khong thua gio nao: diem nghien cuu don theo gio, bo mot gio la mat
   * that so diem do.
   */
  moiGio(tk: ThongKe, so: SoThanhPho): TinMeta[] {
    this.gioNay = tk.gio;
    const tin: TinMeta[] = [];
    this.apNoiTranChinhSach();

    for (const m of this.eureka.cham(tk, so, (id) => this.cay.daXong(id))) {
      const c: CongNghe | undefined = this.cay.toanBo.find((x) => x.id === m.congNghe);
      tin.push({ loai: 'eureka', chu: `Eureka! ${c?.hien ?? m.congNghe} rẻ hẳn đi` });
    }

    const xong: CongNghe | undefined = this.cay.don(this.diemMoiGio, (c) => this.gia(c));
    if (xong !== undefined) tin.push(...this.xongCongNghe(xong));

    const moi: Doi | undefined = this.thoiDai.len(this.cay.soXong, so.soNha);
    if (moi !== undefined) {
      this.chinhSach.datSoO(moi.soO);
      tin.push({ loai: 'thoi_dai', chu: `Bước sang thời đại ${moi.hien} — ${String(moi.soO)} ô chính phủ` });
    }
    return tin;
  }

  /**
   * Cong phan CHENH cua noi tran vao thong doc.
   *
   * Goi ca o dau moi gio va ngay sau khi nguoi choi lap/thao the: khong goi ngay thi tran
   * moi phai doi toi gio sau moi co hieu luc, va nguoi choi bam xong khong thay gi doi.
   */
  apNoiTranChinhSach(): void {
    const t = this.chinhSach.tongNoiTran;
    const dNha: number = t.nha - this.daApNha;
    const dKho: number = t.kho - this.daApKho;
    if (dNha === 0 && dKho === 0) return;
    this.td.noiTran(dNha, dKho);
    this.daApNha = t.nha;
    this.daApKho = t.kho;
  }

  /** Lap mot the vao o. Tra ve `false` neu khong lap duoc (xem `BoChinhSach.lap`). */
  lapThe(chiSo: number, id: string): boolean {
    if (!this.chinhSach.lap(chiSo, id, this.gioNay)) return false;
    this.apNoiTranChinhSach();
    return true;
  }

  /** Thao the khoi o. Tra ve `false` neu khong thao duoc. */
  thaoThe(chiSo: number): boolean {
    if (!this.chinhSach.thao(chiSo, this.gioNay)) return false;
    this.apNoiTranChinhSach();
    return true;
  }

  /** Hoc xong mot cong nghe: an phan thuong, mo the, ke lai. */
  private xongCongNghe(c: CongNghe): TinMeta[] {
    const tin: TinMeta[] = [
      { loai: 'cong_nghe', chu: `Nghiên cứu xong ${c.hien}` },
    ];
    // Phan thuong di qua DUNG `apHauQua` cua the quyet dinh - khong co duong thu hai de
    // doi thanh pho, nen cong nghe va the quyet dinh khong bao gio lech luat.
    if (c.thuong !== undefined) apHauQua(c.thuong, this.tp, this.td);
    for (const id of c.moThe) {
      const t: The = this.chinhSach.mo(id);
      tin.push({ loai: 'cong_nghe', chu: `Mở thẻ chính sách ${t.hien}` });
    }
    return tin;
  }
}
