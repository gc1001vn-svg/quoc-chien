/**
 * Ruong lua lon dan (Buoc 3, 12/10): cay -> ma -> lua xanh -> lua vang -> gat, roi lai cay.
 * Ke hoach `docs/ke-hoach/2026-10-12-buoc-3-lua-lon-dan.md`, moi so o `data/tung_buoc.json` muc `lua`.
 *
 * CHI DOI TEN SPRITE cua ruong - sim khong doi, `sim:van` ra y nhu truoc. Tinh theo NHIP mo phong
 * nhu nha moc dan (`TungBuoc.ts`): dung hinh thi lua dung, tua thi lua lon nhanh, cung nhip cung hinh.
 * Mot mua dai hon mot me nhieu lan (me ruong 70 nhip = 0,7 s o 10x - lon theo me thi nhap nhay).
 *
 * Atlas thieu chang nao (me khac co dai, luc doi me) thi ve `sprite` nhu cu. `?tat=lua` tat;
 * `?luaTien=<0..1>` ghim moi ruong vao cung mot phan mua - chi de chup anh.
 */
import soTho from '../../data/tung_buoc.json';
import { bam } from './HieuUngBatOn';
import { docCoTat } from './HieuUngThanhPho';
import type { Ve } from './VeCanh';
import type { OVat } from '../sim/city/BanDo';
import type { ThanhPho } from '../sim/city/City';

export const SO_LUA = soTho.lua;

/** Phan mua (0..1) cua ruong o `(a,b)` tai nhip `nhip`. Moi ruong lech pha theo bam o, khong doi suot van. */
export function phanMua(nhip: number, a: number, b: number, so: typeof SO_LUA = SO_LUA): number {
  const p = nhip / so.chuKyNhip + bam(a * 4099 + b);
  return p - Math.floor(p);
}

/** Sprite cua chang chua phan mua `t`. */
export function spriteChang(t: number, so: typeof SO_LUA = SO_LUA): string {
  for (const g of so.giaiDoan) if (t < g.den) return g.sprite;
  return so.giaiDoan[so.giaiDoan.length - 1]?.sprite ?? so.sprite;
}

interface ThamSoUrl { readonly tat: boolean; readonly tien: number | undefined }
let url: ThamSoUrl | undefined;
const docUrl = (): ThamSoUrl => {
  if (url === undefined) {
    const q = new URLSearchParams(window.location.search);
    const so = Number(q.get('luaTien') ?? Number.NaN);
    url = { tat: docCoTat(q.get('tat')).has('lua'), tien: Number.isFinite(so) ? so : undefined };
  }
  return url;
};

/** Ruong dang tac (kho rieng day) - toi gat thi dung lua vang. Xep lai moi nhip mo phong, khong moi khung. */
let tac: { nhip: number; tp: ThanhPho; o: Set<string> } | undefined;
function dangTac(tp: ThanhPho | undefined, nhip: number, v: OVat): boolean {
  if (tp === undefined) return false;
  if (tac?.nhip !== nhip || tac.tp !== tp) {
    const o = new Set<string>();
    for (const n of tp.dsNhaThat()) {
      if (n.def.sprite === SO_LUA.sprite && n.nhipTac() > 0) o.add(`${String(n.oNha.a)},${String(n.oNha.b)}`);
    }
    tac = { nhip, tp, o };
  }
  return tac.o.has(`${String(v.a)},${String(v.b)}`);
}

/** Ten sprite phai ve cho vat `v` khung nay: ruong thi theo chang lua, vat khac giu nguyen. */
export function spriteVat(ve: Ve, v: OVat, tp: ThanhPho | undefined): string {
  if (v.ten !== SO_LUA.sprite || ve.nhipSim === undefined || docUrl().tat) return v.ten;
  const ghim = docUrl().tien;
  const t = ghim ?? phanMua(ve.nhipSim, v.a, v.b);
  // Kho day chi giu lua chin luc toi gat - ap ca mua thi ruong nhay hinh (`data/tung_buoc.json` `_lua`).
  const ten = ghim === undefined && t >= SO_LUA.gatTu && dangTac(tp, ve.nhipSim, v) ? SO_LUA.spriteTac : spriteChang(t);
  return ve.atlas.co(ten) ? ten : v.ten;
}
