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
const RONG = 874;
const CAO = 402;
const DPR = 2;
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
  // Cho them vai khung hinh de canvas ve xong.
  await new Promise((r) => setTimeout(r, 2500));
  const anh = await td.chup();
  mkdirSync(THU_MUC, { recursive: true });
  const duong = join(THU_MUC, tenFile);
  writeFileSync(duong, anh);
  console.log(`Da chup: ${duong} (${anh.length} byte, ${RONG}x${CAO} @${DPR}x)`);
} finally {
  await td.dong();
}
