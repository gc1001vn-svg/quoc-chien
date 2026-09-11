/**
 * `npm run sim:bando` - chay lop chien dich trong Node, in bang 28 tinh, tu cham diem.
 *
 * Day la thuoc do cua Phase 7. File nay **doc file va in ra man hinh** nen no nam ngoai
 * `src/sim/` - trong do la TypeScript thuan (TECH_SPEC muc 1, luat 1).
 *
 * Cham diem: lat 28 cum 7 hex phai khit (196 o, khong o nao thuoc hai tinh) · moi tinh
 * 4-6 o xay · chay het `SO_LUOT` luot ma khong o nao xay hai lan, khong lenh nao ket.
 */
import { readFileSync } from 'node:fs';
import { Rng } from '../src/core/Rng.ts';
import { dungBanDoTinh, type BanDoTinh, type CauHinhBanDoTinh, type CauHinhNuoc, type Tinh } from '../src/sim/campaign/BanDoTinh.ts';
import { ChienDich, docCongTrinh, type CauHinhCongTrinh, type CongTrinh } from '../src/sim/campaign/ChienDich.ts';

const SO_LUOT = 200;

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

function cot(chu: string | number, rong: number, trai = false): string {
  const s = String(chu);
  return trai ? s.padEnd(rong) : s.padStart(rong);
}

const banDo: BanDoTinh = dungBanDoTinh(
  doc('provinces.json') as CauHinhBanDoTinh,
  doc('nations.json') as CauHinhNuoc,
);
const congTrinh: readonly CongTrinh[] = docCongTrinh(doc('prov_buildings.json') as CauHinhCongTrinh);
const cd = new ChienDich(banDo, congTrinh);
const loi: string[] = [];

// --- Kiem ban do tinh ---------------------------------------------------------------
const soHex = banDo.theoHex.size;
if (soHex !== banDo.tinh.length * 7) {
  loi.push(`${String(soHex)} hex, doi ${String(banDo.tinh.length * 7)} - co o bi trung hoac thieu`);
}
for (const t of banDo.tinh) {
  if (t.soOXay < 4 || t.soOXay > 6) loi.push(`${t.id}: ${String(t.soOXay)} o xay, phai 4-6`);
  const danhSo = t.o.filter((o) => o.oXay >= 0).map((o) => o.oXay).sort((a, b) => a - b);
  const dung = danhSo.length === t.soOXay && danhSo.every((v, i) => v === i);
  if (!dung) loi.push(`${t.id}: chi so o xay khong lien tuc 0..${String(t.soOXay - 1)}`);
  if (t.o.some((o) => o.oXay >= 0 && o.vat !== '')) loi.push(`${t.id}: o xay dung bi vat che`);
}

// --- Chay SO_LUOT luot, moi luot dat vai lenh xay ------------------------------------
const rng = new Rng(20260911);
const cuaTa: readonly Tinh[] = banDo.tinh.filter((t) => t.nuoc === cd.nuocCuaTa());
const daXayO = new Set<string>();
let nhanLenh = 0;
let tuChoi = 0;

for (let i = 0; i < SO_LUOT; i += 1) {
  const t = cuaTa[rng.nguyen(cuaTa.length)] as Tinh;
  const oXay = rng.nguyen(t.soOXay);
  const chon = cd.xayDuocGi(t.id);
  if (chon.length > 0) {
    const c = chon[rng.nguyen(chon.length)] as CongTrinh;
    const truoc = cd.oCua(t.id, oXay);
    const ly = cd.datLenhXay(t.id, oXay, c.id);
    if (ly === '') {
      nhanLenh += 1;
      const k = `${t.id}#${String(oXay)}`;
      if (daXayO.has(k)) loi.push(`${k}: nhan lenh xay hai lan`);
      daXayO.add(k);
      if (truoc.congTrinh !== '' || truoc.dangXay !== '') loi.push(`${k}: xay de len o da co chu`);
    } else {
      tuChoi += 1;
    }
  }
  cd.nhip();
}

// Khong lenh nao duoc ket lai giua chung: het luot thi phai thanh cong trinh.
for (const t of banDo.tinh) {
  for (let i = 0; i < t.soOXay; i += 1) {
    const o = cd.oCua(t.id, i);
    if (o.dangXay !== '' && o.conLai > 8) loi.push(`${t.id}#${String(i)}: ket voi ${String(o.conLai)} luot con lai`);
  }
}

// --- In bang ------------------------------------------------------------------------
console.log(`BAN DO TINH - ${String(banDo.tinh.length)} tinh, ${String(soHex)} hex, sau ${String(cd.luot())} luot\n`);
console.log(
  `  ${cot('Tinh', 14, true)}${cot('Nuoc', 12, true)}${cot('Dia hinh', 11, true)}` +
    `${cot('O xay', 6)}${cot('Trong', 7)}${cot('Dang xay', 10)}${cot('Da xay', 8)}`,
);
for (const t of banDo.tinh) {
  const d = cd.demTinh(t.id);
  const nuoc = t.nuoc === '' ? '(trung lap)' : t.nuoc;
  console.log(
    `  ${cot(t.hien + (t.thuDo ? ' *' : ''), 14, true)}${cot(nuoc, 12, true)}${cot(t.diaHinh, 11, true)}` +
      `${cot(t.soOXay, 6)}${cot(d.trong, 7)}${cot(d.dangXay, 10)}${cot(d.daXay, 8)}`,
  );
}

const tongO = banDo.tinh.reduce((s, t) => s + t.soOXay, 0);
const tongXay = banDo.tinh.reduce((s, t) => s + cd.demTinh(t.id).daXay, 0);
console.log(
  `\nTONG: ${String(tongO)} o xay dung · ${String(nhanLenh)} lenh nhan · ` +
    `${String(tuChoi)} lenh tu choi · ${String(tongXay)} cong trinh dung xong.`,
);
console.log(`Nuoc cua nguoi choi: ${cd.nuocCuaTa()} - ${String(cuaTa.length)} tinh.`);

if (loi.length === 0) {
  console.log('KET QUA: DAT - lat khit, khong o nao xay hai lan, khong lenh nao ket.');
} else {
  console.log(`KET QUA: HONG - ${String(loi.length)} loi:`);
  for (const d of loi) console.log(`  - ${d}`);
  process.exitCode = 1;
}
