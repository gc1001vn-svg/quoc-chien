#!/usr/bin/env node
/**
 * Chan lai dung cai loi da an mat mot phien: service worker giu ATLAS CU.
 *
 * Workbox ghi `revision: null` cho moi file nam trong `dist/assets/` - no cho rang ten file
 * o do da co bam noi dung nen khong bao gio can tai lai. Atlas cua ta ten CO DINH
 * (`trung_co_2_2x.json`), nen khi no nam trong `assets/` thi may cua nguoi choi giu ban cu
 * VINH VIEN: code moi + du lieu moi + atlas cu. `datSprite` bo qua ten la khong co, thanh
 * ra gieng, coi xay, mo, xuong bien mat trong khi nha, cay, nguoi van hien.
 *
 * Vi vay atlas doi ve `public/atlas/`. Script nay doi chieu lai sau moi ban build: moi muc
 * atlas trong danh sach nap san PHAI co `revision` that.
 */
import { readFileSync } from 'node:fs';

const sw = readFileSync('dist/sw.js', 'utf8');
const muc = [...sw.matchAll(/\{url:"([^"]*atlas[^"]*)",revision:(null|"[0-9a-f]+")\}/g)];

if (muc.length === 0) {
  console.error('check:sw — khong thay muc atlas nao trong dist/sw.js. Doi cach dat ten?');
  process.exit(1);
}

const hong = muc.filter(([, , rev]) => rev === 'null');
for (const [, url, rev] of muc) {
  console.log(`  ${rev === 'null' ? 'HONG' : 'dat '}  ${url}`);
}
if (hong.length > 0) {
  console.error(
    `check:sw — ${String(hong.length)} file atlas co revision null: may nguoi choi se giu`
    + ' ban cu vinh vien. Dua atlas ra khoi dist/assets/.',
  );
  process.exit(1);
}
console.log(`check:sw — ${String(muc.length)} file atlas deu co bam noi dung.`);
