#!/usr/bin/env node
/**
 * Bay atlas da nuong ra mot bang de NHIN, roi chup lai thanh anh.
 *
 * Atlas 2048x2048 mo thang ra thi khong nhin duoc gi: sprite nho, nam rai, nen trong suot.
 * Trang nay xep tung sprite vao mot o co nhan ten, phong to len, dat tren nen ca ro de
 * thay duoc vung trong suot. Day la cach Claude tu kiem net ve truoc khi gui anh cho chu
 * du an - TECH_SPEC muc 1, luat 2: may ao khong do duoc fps nhung nhin thi duoc.
 *
 *   node tools/xem_atlas.mjs trung_co_1x [phong-to] [ten-anh.png] [loc-ten]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { TrinhDuyet } from './lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const KHO = 'public/assets/atlas';
const COT = Number(process.env.COT ?? 8);

const ten = process.argv[2] ?? 'trung_co_1x';
const phong = Number(process.argv[3] ?? 2);
const tenAnh = process.argv[4] ?? `${ten}.png`;

const bo = JSON.parse(readFileSync(join(KHO, `${ten}.json`), 'utf8'));
const loc = process.argv[5];
const muc = Object.entries(bo.sprite).filter(([k]) => loc === undefined || new RegExp(loc).test(k));
if (muc.length === 0) throw new Error(`Khong sprite nao khop "${loc}"`);
const oW = Math.max(...muc.map(([, s]) => s.w)) * phong + 16;
const oH = Math.max(...muc.map(([, s]) => s.h)) * phong + 34;
const rong = COT * oW;
const cao = Math.ceil(muc.length / COT) * oH;

const o = muc.map(([k, s], i) => `<div class="o" style="left:${(i % COT) * oW}px;top:${Math.floor(i / COT) * oH}px;width:${oW}px;height:${oH}px">
<div class="a"><i style="width:${s.w * phong}px;height:${s.h * phong}px;background-image:url(/trang/${s.trang});background-position:${-s.x * phong}px ${-s.y * phong}px;background-size:${bo.canh * phong}px ${bo.canh * phong}px"></i></div>
<b>${k}<span> ${s.w}x${s.h}</span></b></div>`).join('');

const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#1b1d21;font:11px system-ui,sans-serif;color:#cdd2d8}
.o{position:absolute;box-sizing:border-box;border:1px solid #2c3038;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:4px}
.a{flex:1;display:flex;align-items:flex-end;justify-content:center;
   background-image:linear-gradient(45deg,#2a2d33 25%,transparent 25%),linear-gradient(-45deg,#2a2d33 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2d33 75%),linear-gradient(-45deg,transparent 75%,#2a2d33 75%);
   background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0}
i{display:block;image-rendering:pixelated}
b{font-weight:600;margin-top:3px;text-align:center;line-height:1.3}
b span{color:#79818c;font-weight:400}
</style><body style="width:${rong}px;height:${cao}px">${o}`;

const may = createServer((req, res) => {
  const d = req.url ?? '/';
  if (d.startsWith('/trang/')) {
    res.setHeader('content-type', 'image/png');
    res.end(readFileSync(join(KHO, bo.trang[Number(d.slice(7))])));
  } else {
    res.setHeader('content-type', 'text/html');
    res.end(html);
  }
});
await new Promise((ok) => may.listen(0, '127.0.0.1', ok));

const td = new TrinhDuyet(CHROMIUM, 9225);
try {
  await td.mo();
  await td.datManHinh(rong, cao, 1);
  await td.moTrang(`http://127.0.0.1:${may.address().port}/`);
  await td.choDen('document.querySelectorAll("i").length > 0', 20000);
  await new Promise((r) => setTimeout(r, 1500));
  mkdirSync('anh_chup', { recursive: true });
  writeFileSync(join('anh_chup', tenAnh), await td.chup());
  console.log(`anh_chup/${tenAnh} - ${muc.length} sprite, ${rong}x${cao}`);
} finally {
  await td.dong();
  may.close();
}
