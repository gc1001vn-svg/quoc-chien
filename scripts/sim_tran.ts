/**
 * `npm run sim:tran` - chay 1000 tran trong Node, xem % du doan co khop ti le thang that.
 *
 * Thuoc do cua Phase 9 (KE_HOACH.md muc 3). File nay doc file va in ra man hinh nen nam
 * ngoai `src/sim/` (TECH_SPEC muc 1, luat 1). Moi nguong doc tu `data/battle.json`.
 *
 * DAT khi:
 * 1. Moi khoang du doan (0-10 %, ..., 90-100 %) du `mau_toi_thieu` tran thi ti le thang that
 *    lech trung binh du doan khong qua `dung_sai`.
 * 2. Danh can tien trong cung nhom, khong loai doi nao thang qua `tran_thang_mot_loai`.
 */
import { readFileSync } from 'node:fs';
import { Rng } from '../src/core/Rng.ts';
import { docDuLieuTran, duDoan, tinhTran, type DauVaoTran, type DuLieuTran, type LoaiDoi } from '../src/sim/campaign/Battle.ts';

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

/** Cac truong cua thuoc do trong `data/battle.json`. */
interface CauHinhThuoc {
  readonly so_tran: number;
  readonly dung_sai: number;
  readonly mau_toi_thieu: number;
  readonly tran_thang_mot_loai: number;
  readonly so_tran_can_bang: number;
  readonly doi_moi_ben: readonly [number, number];
  readonly ngan_sach: readonly [number, number];
}

const tho = doc('battle.json') as CauHinhThuoc;
const duLieu: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), tho);
const rng = new Rng(20260924);
const nhom = new Map<string, LoaiDoi[]>();
for (const l of duLieu.doi.values()) nhom.set(l.nhom, [...(nhom.get(l.nhom) ?? []), l]);
const dsNhom: LoaiDoi[][] = [...nhom.values()];
const dsDiaHinh: string[] = [...duLieu.diaHinh.keys()];

function chon<T>(ds: readonly T[]): T {
  const x: T | undefined = ds[rng.nguyen(ds.length)];
  if (x === undefined) throw new Error('chon tu danh sach rong');
  return x;
}

function benNgauNhien(cua: readonly LoaiDoi[]): { doi: string[]; tuong: number } {
  const [it, nhieu] = tho.doi_moi_ben;
  const n: number = it + rng.nguyen(nhieu - it + 1);
  return { doi: Array.from({ length: n }, () => chon(cua).id), tuong: rng.nguyen(duLieu.tuongToiDa + 1) };
}

const batDau: number = performance.now();

// 1. Du doan <-> that, chia 10 khoang.
const khoang = Array.from({ length: 10 }, () => ({ n: 0, duDoan: 0, thang: 0 }));
let brier = 0;
for (let i = 0; i < tho.so_tran; i += 1) {
  const cua: LoaiDoi[] = chon(dsNhom);
  const vao: DauVaoTran = { a: benNgauNhien(cua), b: benNgauNhien(cua), diaHinh: chon(dsDiaHinh) };
  const p: number = duDoan(vao, duLieu);
  const thang: number = tinhTran(vao, duLieu, i).thang === 'a' ? 1 : 0;
  const k = khoang[Math.min(9, Math.floor(p * 10))];
  if (k === undefined) continue;
  k.n += 1;
  k.duDoan += p;
  k.thang += thang;
  brier += (p - thang) ** 2;
}

let dat = true;
console.log(`sim:tran - ${String(tho.so_tran)} tran ngau nhien\n`);
console.log('Khoang   | So tran | Du doan | That   | Lech');
for (const [i, k] of khoang.entries()) {
  if (k.n === 0) continue;
  const dd: number = k.duDoan / k.n;
  const that: number = k.thang / k.n;
  const lech: number = Math.abs(that - dd);
  const tinh: boolean = k.n >= tho.mau_toi_thieu;
  const hong: boolean = tinh && lech > tho.dung_sai;
  if (hong) dat = false;
  console.log(
    `${String(i * 10).padStart(3)}-${String(i * 10 + 10).padEnd(3)}% | ${String(k.n).padStart(7)} | ${(dd * 100).toFixed(1).padStart(6)}% | ${(that * 100).toFixed(1).padStart(5)}% | ${(lech * 100).toFixed(1).padStart(4)}${tinh ? '' : ' (it mau, khong tinh)'}${hong ? '  HONG' : ''}`,
  );
}
console.log(`\nBrier: ${(brier / tho.so_tran).toFixed(3)} (0 = doan dung het, 0.25 = tung dong xu)`);

// 2. Can bang: quan THUAN mot loai doi gap quan HON HOP cung nhom, cung ngan sach, doi vai
// ca hai phia. Loai nao thang qua nguong la loai "chi can xay moi no". Ngan sach doi moi tran
// de so doi le (7 hay 8 doi) khong quyet thay can bang (do 24/09: ngan sach co dinh thi ket
// qua nhay 0 % <-> 100 % khi gia doi 5 vang).
const [SACH_IT, SACH_NHIEU] = tho.ngan_sach;
const SO_HAT: number = tho.so_tran_can_bang;
console.log(`\nCan bang - quan thuan gap quan hon hop, ${String(SO_HAT * 2)} tran, ${String(SACH_IT)}-${String(SACH_NHIEU)} vang moi ben:`);

function hopHop(cua: readonly LoaiDoi[], sach: number): { doi: string[]; tuong: number } {
  const doi: string[] = [];
  let con: number = sach;
  for (;;) {
    const vua: LoaiDoi[] = cua.filter((l) => l.gia <= con);
    if (vua.length === 0) break;
    const l: LoaiDoi = chon(vua);
    doi.push(l.id);
    con -= l.gia;
  }
  return { doi, tuong: 1 };
}

for (const [ten, cua] of nhom) {
  for (const x of cua) {
    let thang = 0;
    for (let h = 0; h < SO_HAT; h += 1) {
      const sach: number = SACH_IT + rng.nguyen(SACH_NHIEU - SACH_IT + 1);
      const bx = { doi: Array<string>(Math.max(1, Math.floor(sach / x.gia))).fill(x.id), tuong: 1 };
      const by = hopHop(cua, sach);
      if (tinhTran({ a: bx, b: by, diaHinh: 'dong_bang' }, duLieu, h).thang === 'a') thang += 1;
      if (tinhTran({ a: by, b: bx, diaHinh: 'dong_bang' }, duLieu, h).thang === 'b') thang += 1;
    }
    const tl: number = thang / (SO_HAT * 2);
    const hong: boolean = tl > tho.tran_thang_mot_loai;
    if (hong) dat = false;
    console.log(`  ${ten.padEnd(9)} ${x.id.padEnd(11)} thang ${(tl * 100).toFixed(0).padStart(3)}%${hong ? '  HONG' : ''}`);
  }
}

console.log(`\nThoi gian: ${(performance.now() - batDau).toFixed(0)} ms`);
console.log(dat ? '\nDAT' : '\nHONG');
process.exit(dat ? 0 : 1);
