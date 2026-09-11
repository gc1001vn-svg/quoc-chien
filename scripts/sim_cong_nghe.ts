/**
 * `npm run sim:congnghe` - chay 120 gio game trong Node, xem cay cong nghe co chay khong.
 *
 * Thuoc do cua Phase 8 (KE_HOACH.md muc 3). File nay **doc file va in ra man hinh** nen no
 * nam ngoai `src/sim/` - trong do la TypeScript thuan (TECH_SPEC muc 1, luat 1).
 *
 * DAT khi: toi duoc thoi dai 3, moi cong nghe deu co duong toi, khong cong nghe nao ket.
 */
import { readFileSync } from 'node:fs';
import { ThanhPho } from '../src/sim/city/City.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { DongCo, docNhipDo, docThe, type LuaChon } from '../src/sim/decision/Engine.ts';
import { NhatKy } from '../src/sim/decision/NhatKy.ts';
import { Van } from '../src/sim/decision/Van.ts';
import { docDuLieuMeta, Meta } from '../src/sim/meta/Meta.ts';
import type { CongNghe } from '../src/sim/meta/CongNghe.ts';

const SO_GIO = 120;
/** Thoi dai toi thieu phai toi duoc trong `SO_GIO` gio thi moi coi la DAT. */
const DOI_PHAI_TOI = 3;

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

function cot(chu: string | number, rong: number, trai = false): string {
  const s = String(chu);
  return trai ? s.padEnd(rong) : s.padStart(rong);
}

const tp = new ThanhPho({
  hang: doc('wares.json'),
  nha: doc('buildings.json'),
  chuoi: doc('chains.json'),
  banDo: doc('thanh_pho_demo.json'),
  walker: doc('walkers.json'),
});
const thongDoc = new Governor(tp, docChinhSach(doc('policy.json')));
const meta = new Meta(
  docDuLieuMeta(doc('tech.json'), doc('eureka.json'), doc('the_chinh_sach.json'), doc('balance.json')),
  tp,
  thongDoc,
);
const nhatKy = new NhatKy(2000);
const van = new Van(
  tp,
  thongDoc,
  new DongCo(docThe(doc('decisions.json')), docNhipDo(doc('balance.json'))),
  nhatKy,
  true,
  meta,
);
tp.datThongDoc(van);

const soCongNghe: number = meta.cay.toanBo.length;
console.log(
  `Cay cong nghe: ${String(soCongNghe)} cong nghe, ` +
    `${String(meta.chinhSach.soO)} o chinh phu o thoi dai "${meta.thoiDai.doi.hien}".`,
);

// Chay khong nguoi bam: khong chon cong nghe (cay tu chon cai re nhat), nhung CO lap the
// chinh sach - lap the la duong duy nhat de biet he so nghien cuu va noi tran co chay
// khong. Lap vao o trong dau tien moi khi het thoi gian cho.
const batDau = Date.now();
for (let gio = 1; gio <= SO_GIO; gio++) {
  tp.chay(NHIP_MOI_GIO);
  const the = van.the;
  if (the !== undefined) van.traLoi(the.chon[0] as LuaChon);
  lapTheNeuDuoc();
}
const giay = (Date.now() - batDau) / 1000;

/** Lap the da mo vao o con trong. Chi lam duoc khi het thoi gian cho. */
function lapTheNeuDuoc(): void {
  const oTrong: number = meta.chinhSach.dangLap.findIndex((t) => t === undefined);
  if (oTrong < 0) return;
  const dangLap = new Set(meta.chinhSach.dangLap.map((t) => t?.id));
  const moi = meta.chinhSach.daMo().find((t) => !dangLap.has(t.id));
  if (moi !== undefined) meta.lapThe(oTrong, moi.id);
}

console.log('\nNHAT KY LOP META');
for (const s of nhatKy.danhSach) {
  if (s.loai !== 'meta') continue;
  console.log(`  gio ${cot(s.gio, 4)} ${s.van}`);
}

console.log('\nCAY CONG NGHE - cuoi van');
console.log(`  ${cot('Cong nghe', 20, true)}${cot('Doi', 5)}${cot('Gia', 6)}${cot('Xong', 6)}`);
for (const c of meta.cay.toanBo) {
  console.log(
    `  ${cot(c.hien, 20, true)}${cot(c.thoiDai, 5)}${cot(meta.gia(c), 6)}` +
      cot(meta.cay.daXong(c.id) ? 'x' : '', 6),
  );
}

const lap: string[] = meta.chinhSach.dangLap.map((t) => t?.hien ?? '(trống)');
console.log(
  `\nTHOI DAI: ${meta.thoiDai.doi.hien} (so ${String(meta.thoiDai.doi.so)}) · ` +
    `${String(meta.cay.soXong)}/${String(soCongNghe)} cong nghe · ` +
    `${String(meta.diemMoiGio)} diem/gio · he so ${String(meta.chinhSach.heSoNghienCuu)} %`,
);
console.log(`O CHINH PHU: ${lap.join(' · ')}`);
console.log(
  `THONG DOC: cap ${thongDoc.cap.ten}, ${String(tp.soNha)} nha / tran ${String(thongDoc.cap.tranNha)}, ` +
    `${String(tp.doiWalker.soKho)} kho / tran ${String(thongDoc.cap.tranKho)}.`,
);
console.log(`Da chay ${String(SO_GIO)} gio game trong ${giay.toFixed(2)}s that.`);

// Cham diem. Ba cau hoi, tra loi bang chinh so vua chay ra.
const loi: string[] = [];
if (meta.thoiDai.doi.so < DOI_PHAI_TOI) {
  loi.push(
    `moi toi thoi dai ${String(meta.thoiDai.doi.so)}, can toi ${String(DOI_PHAI_TOI)} trong ${String(SO_GIO)} gio`,
  );
}
// Ket = co cong nghe khong bao gio hoc duoc vi tien de cua no khong nam trong cay.
const idCo = new Set(meta.cay.toanBo.map((c: CongNghe) => c.id));
for (const c of meta.cay.toanBo) {
  for (const t of c.tienDe) {
    if (!idCo.has(t)) loi.push(`"${c.hien}" can tien de "${t}" khong co trong cay`);
  }
}
if (meta.cay.soXong === 0) loi.push('khong hoc xong cong nghe nao');

if (loi.length === 0) {
  console.log('KET QUA: DAT');
} else {
  console.log(`KET QUA: HONG - ${String(loi.length)} loi:`);
  for (const d of loi) console.log(`  - ${d}`);
  process.exitCode = 1;
}
