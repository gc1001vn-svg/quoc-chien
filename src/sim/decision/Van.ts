/**
 * Mot van dang choi: noi thong doc, dong co the quyet dinh va nhat ky su kien lam mot.
 *
 * Ca `npm run sim:thu` lan game trong trinh duyet deu chay qua day. Khong co no thi hai
 * ben tu noi day lai lay mot, va cai chay trong Node se khac cai chay tren dien thoai -
 * dung cai bay ma `src/sim/` sinh ra de tranh.
 */
import type { ThanhPho, ThongDoc } from '../city/City.ts';
import type { Governor } from '../autoplay/Governor.ts';
import type { Meta } from '../meta/Meta.ts';
import type { SoThanhPho } from './DieuKien.ts';
import type { DongCo, LuaChon, The } from './Engine.ts';
import { chon } from './HauQua.ts';
import type { NhatKy } from './NhatKy.ts';

export class Van implements ThongDoc {
  private readonly tp: ThanhPho;
  private readonly td: Governor;
  private readonly dongCo: DongCo;
  private readonly nhatKy: NhatKy;
  /** Lop meta (Phase 8). Khong co cung chay duoc - `sim:thu` cua Phase 3 khong can no. */
  private readonly meta: Meta | undefined;
  /** Da ghi bao nhieu viec cua thong doc vao nhat ky. */
  private daGhi = 0;
  private cho: The | undefined;
  /** Chua bat thi chi thong doc chay, khong hoi the. */
  private batHoi: boolean;

  constructor(
    tp: ThanhPho, td: Governor, dongCo: DongCo, nhatKy: NhatKy, batHoi = true,
    meta?: Meta,
  ) {
    this.tp = tp;
    this.td = td;
    this.dongCo = dongCo;
    this.nhatKy = nhatKy;
    this.batHoi = batHoi;
    this.meta = meta;
  }

  /**
   * Bat dau hoi the.
   *
   * `ThanhPho.moDau()` chay san mot gio game TRUOC khung hinh dau tien: hoi the trong
   * doan do thi the hien ra truoc ca thanh pho, va dung sim luc chua co gi de nhin.
   */
  batDau(): void {
    this.batHoi = true;
    // Hoi ngay mot the bang bang so cua gio `moDau` vua chay xong. Khong lam vay thi the
    // dau tien phai cho het MOT gio game nua - o toc do 1x la mot gio THAT, va nguoi choi
    // mo game ra ngoi nhin 60 phut khong ai hoi gi.
    this.hoiNgay();
  }

  /** The dang cho nguoi choi tra loi. */
  get the(): The | undefined {
    return this.cho;
  }

  /** `ThanhPho` goi khi chot xong mot gio game. */
  moiGio(): void {
    this.td.moiGio();
    const tk = this.tp.gioVuaXong();
    if (tk === undefined) return;

    for (const v of this.td.daLam.slice(this.daGhi)) {
      this.nhatKy.ghi(v.gio, 'thong_doc', `Thống đốc xây ${this.tenDep(v.viec)}`);
      this.daGhi += 1;
    }
    // Lop meta chay SAU thong doc: no doc so nha cua gio nay, ma thong doc vua xay them.
    for (const t of this.meta?.moiGio(tk, this.soThanhPho) ?? []) {
      this.nhatKy.ghi(tk.gio, 'meta', t.chu);
    }
    this.hoiNgay();
  }

  /** So thanh pho ma `ThongKe` khong mang. Dong co the va lop meta cung nhin vao day. */
  private get soThanhPho(): SoThanhPho {
    return { soNha: this.tp.soNha, soKho: this.tp.doiWalker.soKho };
  }

  /** Hoi mot the bang bang so gan nhat. Con the chua tra loi thi khong hoi chong len. */
  private hoiNgay(): void {
    const tk = this.tp.gioVuaXong();
    if (tk === undefined || !this.batHoi || this.cho !== undefined) return;
    const the = this.dongCo.hoi(tk, this.soThanhPho);
    if (the === undefined) return;
    this.cho = the;
    this.nhatKy.ghi(tk.gio, 'the', the.van);
  }

  /**
   * Ten nha cho nguoi doc: `lo_banh` -> `Lo banh`. Nhat ky hien tren man hinh nen phai
   * doc duoc, khong phai khoa trong `data/buildings.json`.
   */
  private tenDep(ten: string): string {
    return this.tp.dsNha.find((n) => n.ten === ten)?.hien ?? ten;
  }

  /** Nguoi choi bam mot nut. Ap hau qua, ghi nhat ky, xoa the dang cho. */
  traLoi(lc: LuaChon): void {
    const gio: number = this.tp.dongHo.gio;
    this.cho = undefined;
    for (const d of chon(lc, this.tp, this.td)) {
      this.nhatKy.ghi(gio, d.duoc ? 'chon' : 'hong', `${lc.van} -> ${d.viec}`);
    }
  }
}
