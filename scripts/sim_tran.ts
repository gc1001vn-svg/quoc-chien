/**
 * `npm run sim:tran` - chay 1000 tran trong Node, xem % du doan co khop ti le thang that.
 *
 * Thuoc do cua Phase 9 (KE_HOACH.md muc 3). File nay doc file va in ra man hinh nen nam
 * ngoai `src/sim/` (TECH_SPEC muc 1, luat 1). Moi nguong doc tu `data/battle.json`.
 *
 * DAT khi:
 * 1. Lech trung binh co trong so giua du doan va ti le thang that (chia 10 khoang, trong so =
 *    so tran moi khoang) khong qua `lech_tb_toi_da`. Chu du an chot 25/09: bo kiem TUNG
 *    khoang (30 mau thi nhieu ~8 diem, doi hat giong chi 4/10 lan dat).
 * 2. Do dai tran (GAME_SPEC muc 6: 30-60 giay): it nhat `ti_le_trong_khung` so tran ket thuc
 *    trong `khung_giay`, va khong qua `ti_le_het_gio` so tran cham tran giay.
 * 3. Danh can tien trong cung nhom, khong loai doi nao thang qua `tran_thang_mot_loai`.
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
  readonly lech_tb_toi_da: number;
  readonly khung_giay: readonly [number, number];
  readonly ti_le_trong_khung: number;
  readonly ti_le_het_gio: number;
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
const giay: number[] = [];
for (let i = 0; i < tho.so_tran; i += 1) {
  const cua: LoaiDoi[] = chon(dsNhom);
  const vao: DauVaoTran = { a: benNgauNhien(cua), b: benNgauNhien(cua), diaHinh: chon(dsDiaHinh) };
  const p: number = duDoan(vao, duLieu);
  const kq = tinhTran(vao, duLieu, i);
  const thang: number = kq.thang === 'a' ? 1 : 0;
  giay.push(kq.giayKetThuc);
  const k = khoang[Math.min(9, Math.floor(p * 10))];
  if (k === undefined) continue;
  k.n += 1;
  k.duDoan += p;
  k.thang += thang;
  brier += (p - thang) ** 2;
}

let dat = true;
let lechTb = 0;
console.log(`sim:tran - ${String(tho.so_tran)} tran ngau nhien\n`);
console.log('Khoang   | So tran | Du doan | That   | Lech');
for (const [i, k] of khoang.entries()) {
  if (k.n === 0) continue;
  const dd: number = k.duDoan / k.n;
  const that: number = k.thang / k.n;
  const lech: number = Math.abs(that - dd);
  lechTb += (lech * k.n) / tho.so_tran;
  console.log(
    `${String(i * 10).padStart(3)}-${String(i * 10 + 10).padEnd(3)}% | ${String(k.n).padStart(7)} | ${(dd * 100).toFixed(1).padStart(6)}% | ${(that * 100).toFixed(1).padStart(5)}% | ${(lech * 100).toFixed(1).padStart(4)}`,
  );
}
const hongLech: boolean = lechTb > tho.lech_tb_toi_da;
if (hongLech) dat = false;
console.log(
  `\nLech trung binh: ${(lechTb * 100).toFixed(2)} diem (tran ${(tho.lech_tb_toi_da * 100).toFixed(0)})${hongLech ? '  HONG' : ''}`,
);
console.log(`Brier: ${(brier / tho.so_tran).toFixed(3)} (0 = doan dung het, 0.25 = tung dong xu)`);

// Do dai tran.
const [TU, DEN] = tho.khung_giay;
giay.sort((x, y) => x - y);
const phanVi = (p: number): number => giay[Math.floor(p * (giay.length - 1))] ?? 0;
const trongKhung: number = giay.filter((g) => g >= TU && g <= DEN).length / giay.length;
const hetGio: number = giay.filter((g) => g >= duLieu.tranGiay).length / giay.length;
const hongGiay: boolean = trongKhung < tho.ti_le_trong_khung || hetGio > tho.ti_le_het_gio;
if (hongGiay) dat = false;
console.log(
  `\nDo dai tran: p10 ${String(phanVi(0.1))} · p50 ${String(phanVi(0.5))} · p90 ${String(phanVi(0.9))} giay · ` +
    `trong ${String(TU)}-${String(DEN)} s: ${(trongKhung * 100).toFixed(1)} % (can >= ${(tho.ti_le_trong_khung * 100).toFixed(0)}) · ` +
    `het gio: ${(hetGio * 100).toFixed(1)} % (tran ${(tho.ti_le_het_gio * 100).toFixed(0)})${hongGiay ? '  HONG' : ''}`,
);

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
