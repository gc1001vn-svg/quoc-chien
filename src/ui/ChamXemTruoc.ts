/**
 * Cham xem truoc tren the quyet dinh (Thu 3, 30/09 - hoc Reigns): moi lua chon mot hang ba o
 * Nha · Kho · Thong doc; o nao bi dong thi co cham, cham TO = doi nhieu, NHO = doi it.
 * Khong noi tang hay giam - nguoi choi doan, doc chu tren nut neu muon biet het.
 *
 * CHI DOC `HauQua` (khuon cua `src/sim/decision/Engine.ts`). Nguong to/nho o
 * `data/hieu_ung.json > cham` (luat 2). `chamXemTruoc` thuan; `hangCham` dung DOM.
 */
import soTho from '../../data/hieu_ung.json';
import type { HauQua } from '../sim/decision/Engine.ts';

/** 0 khong dong · 1 cham nho · 2 cham to. */
export type CoCham = 0 | 1 | 2;

export interface Cham {
  readonly nha: CoCham;
  readonly kho: CoCham;
  readonly thongDoc: CoCham;
}

export interface SoCham {
  readonly nhaTo: number;
  readonly noiNhaTo: number;
  readonly noiKhoTo: number;
  readonly nguongTo: number;
}

const co = (dong: boolean, to: boolean): CoCham => (!dong ? 0 : to ? 2 : 1);

export function chamXemTruoc(hq: HauQua, so: SoCham = soTho.cham): Cham {
  const soNha = (hq.xay ?? []).reduce((s, m) => s + m.so, 0);
  const noiNha = hq.noiTran?.nha ?? 0;
  const noiKho = hq.noiTran?.kho ?? 0;
  const delta = Object.values(hq.doiNguong ?? {}).map((d) => Math.abs(d));
  const lonNhat = delta.length === 0 ? 0 : Math.max(...delta);
  return {
    nha: co(soNha > 0 || noiNha !== 0, soNha >= so.nhaTo || Math.abs(noiNha) >= so.noiNhaTo),
    kho: co(hq.xayKho === true || noiKho !== 0, Math.abs(noiKho) >= so.noiKhoTo),
    thongDoc: co(delta.length > 0, lonNhat >= so.nguongTo),
  };
}

const O: readonly (readonly [keyof Cham, string, string])[] = [
  ['nha', '🏠', 'Nhà'], ['kho', '📦', 'Kho'], ['thongDoc', '⚙', 'Thống đốc'],
];

/** Hang ba o co cham, dat tren nut lua chon. */
export function hangCham(hq: HauQua): HTMLSpanElement {
  const c = chamXemTruoc(hq);
  const hang: HTMLSpanElement = document.createElement('span');
  hang.className = 'the-cham';
  for (const [khoa, icon, ten] of O) {
    const o: HTMLSpanElement = document.createElement('span');
    o.className = 'the-cham-o';
    o.dataset['co'] = String(c[khoa]);
    o.title = ten;
    o.textContent = icon;
    hang.appendChild(o);
  }
  return hang;
}
