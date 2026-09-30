#!/usr/bin/env node
/**
 * Chup man hinh game bang Chromium co san trong may ao.
 *
 * VI SAO CAN: may ao bi chan `vercel.app` (403) nen khong xem duoc trang that, nhung
 * Chromium tai cho thi mo duoc `localhost`. Nho vay Claude tu nhin duoc ket qua thay vi
 * bat chu du an mo iPhone ho. Chi fps la khong tu do duoc - may ao ve bang phan mem.
 *
 * Dung:
 *   npm run build && npm run preview &
 *   node scripts/chup_man.mjs [duong-dan-them] [ten-file.png]
 *
 * Vi du: node scripts/chup_man.mjs "?do=sprite" do_sprite.png
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TrinhDuyet } from '../tools/lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const GOC = process.env.DIA_CHI ?? 'http://127.0.0.1:4173/';
// Man hinh tham chieu cua du an: iPhone 16 Pro nam ngang.
// Man hinh tham chieu nam ngang; dat `MAN=doc` de chup dung khung iPhone cam doc, la
// cach chu du an that su cam may. Chup ngang mai thi khong bao gio thay cai anh anh thay.
//
// LUU Y: khung doc la 1179x2556 diem anh that. May ao ve bang phan mem (swiftshader) nen
// tu khi them 25 sprite nha moi, `Page.captureScreenshot` o co do treo qua 120 giay roi
// chet. Khung ngang 1748x804 van chup binh thuong. Can anh doc thi ha `DPR=2`.
const DOC = process.env.MAN === 'doc';
const RONG = Number(process.env.RONG ?? (DOC ? 393 : 874));
const CAO = Number(process.env.CAO ?? (DOC ? 852 : 402));
const DPR = Number(process.env.DPR ?? (DOC ? 3 : 2));
const THU_MUC = 'anh_chup';

const duongThem = process.argv[2] ?? '';
const tenFile = process.argv[3] ?? 'man_hinh.png';

const td = new TrinhDuyet(CHROMIUM, 9223);
try {
  await td.mo();
  await td.datManHinh(RONG, CAO, DPR);
  await td.moTrang(GOC + duongThem);
  const san = await td.choDen("document.querySelector('#app canvas') !== null", 20000);
  if (!san) console.warn('Canh bao: #app van rong sau 20 giay, van chup.');
  // Cho them vai khung hinh de canvas ve xong. `CHO_MS=30000`: cho lau hon cho khoi, chim
  // (Thu 1) kip hien - may ao chi 5 fps, hieu ung chay cham theo.
  await new Promise((r) => setTimeout(r, Number(process.env.CHO_MS ?? 2500)));
  // `AN_SU_KIEN=1`: an hop thoai su kien dau van (khong bam - bam thi camera chay sang nha vua xay).
  // Can cho bang den `docs/ART_BIBLE.md` muc 5: hop thoai che nua duoi man, do mau nham.
  if (process.env.AN_SU_KIEN === '1') {
    await td.doc(`(() => { const b = [...document.querySelectorAll('button')].filter((x) => x.offsetParent && x.innerText.length > 25);
      let e = b[0]; while (e && e.parentElement && e.offsetHeight < 150) e = e.parentElement; if (e) e.style.display = 'none'; })()`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  const anh = await td.chup();
  mkdirSync(THU_MUC, { recursive: true });
  const duong = join(THU_MUC, tenFile);
  writeFileSync(duong, anh);
  console.log(`Da chup: ${duong} (${anh.length} byte, ${RONG}x${CAO} @${DPR}x)`);
} finally {
  await td.dong();
}
