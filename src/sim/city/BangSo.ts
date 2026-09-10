/**
 * Dung bang so cua mot gio game tu cac bo dem.
 *
 * Tach khoi `City.ts` ngay 10/09 vi file do cham tran 300 dong (TECH_SPEC muc 2). Day la
 * ham THUAN: dua bo dem vao, tra bang so ra, khong doi gi cua thanh pho - test duoc rieng.
 */
import type { ThongKe } from './Cham.ts';
import type { DinhNghiaHang, Kho } from './Wares.ts';
import type { DinhNghiaNha } from './Buildings.ts';

/** Tam bo dem gom lai cho khoi truyen tam bien. Tat ca deu dem tu dau gio. */
export interface BoDemGio {
  readonly me: Map<string, number>;
  readonly doi: Map<string, number>;
  readonly tac: Map<string, number>;
  readonly lamRa: Map<string, number>;
  readonly dungHet: Map<string, number>;
  readonly cho: Map<string, number>;
  readonly day: Map<string, number>;
  readonly hong: Map<string, number>;
}

/** Moi thu can de dung bang so, ngoai bo dem. */
export interface NguonBangSo {
  readonly gio: number;
  readonly dsNha: readonly DinhNghiaNha[];
  readonly dsHang: readonly DinhNghiaHang[];
  readonly kho: Kho;
  readonly walker: ThongKe['walker'];
  /** Thong doc da xay them bao nhieu nha loai `ten`. */
  soDaXay(ten: string): number;
}

/** Dung bang so cua gio vua xong. Khong xoa bo dem - nguoi goi tu xoa. */
export function dungBangSo(n: NguonBangSo, d: BoDemGio): ThongKe {
  return {
    gio: n.gio,
    nha: n.dsNha.map((x) => ({
      ten: x.ten,
      hien: x.hien,
      // So THAT: thong doc xay them thi cot nay phai noi len dieu do.
      so: x.so + n.soDaXay(x.ten),
      me: d.me.get(x.ten) ?? 0,
      doi: d.doi.get(x.ten) ?? 0,
      tac: d.tac.get(x.ten) ?? 0,
    })),
    hang: n.dsHang.map((h) => ({
      ten: h.ten,
      hien: h.hien,
      ton: n.kho.co(h.ten),
      tran: h.tran,
      lamRa: d.lamRa.get(h.ten) ?? 0,
      dungHet: d.dungHet.get(h.ten) ?? 0,
      cho: d.cho.get(h.ten) ?? 0,
      day: d.day.get(h.ten) ?? 0,
      hong: d.hong.get(h.ten) ?? 0,
    })),
    walker: n.walker,
  };
}

/** Xoa het bo dem, chuan bi cho gio moi. */
export function xoaBoDem(d: BoDemGio): void {
  for (const dem of [d.me, d.doi, d.tac, d.lamRa, d.dungHet, d.cho, d.day, d.hong]) {
    dem.clear();
  }
}
