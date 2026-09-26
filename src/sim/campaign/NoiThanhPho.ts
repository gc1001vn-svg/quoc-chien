/**
 * Noi thanh pho vao lop the gioi: doc so that cua `ThanhPho` + `Meta` sau moi gio game,
 * dua thanh `SoNuocTa` cho `TheGioi.gioTiep()`.
 *
 * Day la cho DUY NHAT hai lop gap nhau. Chieu nguoc lai (the gioi tac dong vao thanh pho)
 * chua co - Phase 11A co y de thanh pho chay nhu cu, khong vo can bang da can o Phase 3-8.
 *
 * TypeScript thuan (luat 1).
 */
import type { ThanhPho } from '../city/City.ts';
import type { Meta } from '../meta/Meta.ts';
import type { SoNuocTa } from './TheGioi.ts';

/**
 * Doi lon nhat ma moi cong nghe tu doi 1 toi doi do deu da xong. 0 = doi 1 con thieu.
 * Thang Khoa hoc doc so nay (`victory.json > khoa_hoc.doi`).
 */
export function doiXongHet(meta: Meta): number {
  let doiThieu = Infinity;
  for (const c of meta.cay.toanBo) {
    if (!meta.cay.daXong(c.id)) doiThieu = Math.min(doiThieu, c.thoiDai);
  }
  if (doiThieu === Infinity) return Math.max(...meta.cay.toanBo.map((c) => c.thoiDai));
  return doiThieu - 1;
}

/** Tong ton cac mat hang luong thuc bang 0 thi coi la thieu an trong gio vua qua. */
export function thieuLuongThuc(tp: ThanhPho, hangLuongThuc: readonly string[]): boolean {
  const tk = tp.gioVuaXong();
  if (tk === undefined) return false;
  const ton: number = tk.hang.filter((h) => hangLuongThuc.includes(h.ten)).reduce((s, h) => s + h.ton, 0);
  return ton <= 0;
}

/** So cua nuoc nguoi choi trong gio vua xong. */
export function soNuocTa(tp: ThanhPho, meta: Meta, hangLuongThuc: readonly string[]): SoNuocTa {
  return {
    soNha: tp.soNha,
    doi: meta.thoiDai.doi.so,
    soCongNgheXong: meta.cay.soXong,
    doiXongHet: doiXongHet(meta),
    thieuLuongThuc: thieuLuongThuc(tp, hangLuongThuc),
    theDangLap: meta.chinhSach.dangLap.flatMap((t) => (t === undefined ? [] : [t.id])),
  };
}
