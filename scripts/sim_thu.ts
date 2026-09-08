/**
 * `npm run sim:thu` - chay 10 gio game trong Node, in bang tai nguyen, tu cham diem.
 *
 * Day la thuoc do cua Phase 3 (KE_HOACH.md muc 3). File nay **doc file va in ra man hinh**
 * nen no nam ngoai `src/sim/` - trong do la TypeScript thuan (TECH_SPEC muc 1, luat 1).
 *
 * Chay bang Node tu boc kieu TypeScript: khong can them thu vien nao.
 */
import { readFileSync } from 'node:fs';
import { ThanhPho } from '../src/sim/city/City.ts';
import { chamDiem } from '../src/sim/city/Cham.ts';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { chuoiGio, NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';

const SO_GIO = 10;

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

function cot(chu: string | number, rong: number, trai = false): string {
  const s = String(chu);
  return trai ? s.padEnd(rong) : s.padStart(rong);
}

function inBangHang(tk: ThongKe): void {
  console.log(`\nHANG HOA - gio thu ${String(tk.gio)}`);
  console.log(
    `  ${cot('Mat hang', 14, true)}${cot('Ton', 7)}${cot('Tran', 7)}` +
      `${cot('Lam ra', 9)}${cot('Dung het', 10)}${cot('Hong', 8)}` +
      `${cot('Nhip cho', 10)}${cot('Nhip day', 10)}`,
  );
  for (const h of tk.hang) {
    console.log(
      `  ${cot(h.hien, 14, true)}${cot(h.ton, 7)}${cot(h.tran, 7)}` +
        `${cot(h.lamRa, 9)}${cot(h.dungHet, 10)}${cot(h.hong, 8)}` +
        `${cot(h.cho, 10)}${cot(h.day, 10)}`,
    );
  }
}

function inBangNha(tk: ThongKe): void {
  console.log(`\nTOA NHA - gio thu ${String(tk.gio)}`);
  console.log(
    `  ${cot('Toa nha', 16, true)}${cot('So cai', 8)}${cot('Me xong', 9)}` +
      `${cot('Nhip doi', 10)}${cot('Nhip tac', 10)}`,
  );
  for (const n of tk.nha) {
    console.log(
      `  ${cot(n.hien, 16, true)}${cot(n.so, 8)}${cot(n.me, 9)}` +
        `${cot(n.doi, 10)}${cot(n.tac, 10)}`,
    );
  }
}

const tp = new ThanhPho({
  hang: doc('wares.json'),
  nha: doc('buildings.json'),
  chuoi: doc('chains.json'),
  banDo: doc('thanh_pho_demo.json'),
  walker: doc('walkers.json'),
});

const thongDoc = new Governor(tp, docChinhSach(doc('policy.json')));
tp.datThongDoc(thongDoc);

const nhaDau: number = tp.soNha;
console.log(
  `Thanh pho: ${String(tp.dsHang.length)} mat hang, ${String(tp.dsNha.length)} loai nha ` +
    `(${String(nhaDau)} cai), ${String(tp.dsChuoi.length)} chuoi san xuat.`,
);

const batDau = Date.now();
const loi: string[] = [];
let cuoi: ThongKe | undefined;
for (let gio = 1; gio <= SO_GIO; gio++) {
  tp.chay(NHIP_MOI_GIO);
  cuoi = tp.gioVuaXong();
  if (cuoi === undefined) throw new Error('chua chot duoc gio nao');
  // Bo qua gio dau: luc do chuoi con dang mo may, chua chay deu.
  if (gio > 1) loi.push(...chamDiem(cuoi).map((d) => `gio ${String(gio)}: ${d}`));
}
const giay = (Date.now() - batDau) / 1000;
if (cuoi === undefined) throw new Error('chua chay du mot gio game');

inBangHang(cuoi);
inBangNha(cuoi);
console.log(
  `\nWALKER - gio thu ${String(cuoi.gio)}: ${String(cuoi.walker.chuyen)} chuyen xong · ` +
    `dong nhat ${String(cuoi.walker.dinh)} nguoi cung luc · ` +
    `${String(cuoi.walker.boCuoc)} luot bo cuoc.`,
);
console.log(
  `\nTHONG DOC - cap ${thongDoc.cap.ten}: ${String(nhaDau)} -> ${String(tp.soNha)} nha, ` +
    `${String(tp.doiWalker.soKho)} kho.`,
);
for (const v of thongDoc.daLam) {
  console.log(`  gio ${String(v.gio)}: xay ${v.viec} (cap ${v.cap})`);
}
console.log(
  `Da chay ${chuoiGio(tp.dongHo.soNhip)} gio game trong ${giay.toFixed(2)}s that.`,
);
if (loi.length === 0) {
  console.log('KET QUA: DAT - khong hang am, khong chuoi nao ket vinh vien.');
} else {
  console.log(`KET QUA: HONG - ${String(loi.length)} loi:`);
  for (const d of loi) console.log(`  - ${d}`);
  process.exitCode = 1;
}
