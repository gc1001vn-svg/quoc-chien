#!/usr/bin/env node
/**
 * Dung mot manh thanh pho gia tu atlas da nuong, roi chup lai.
 *
 * Bang sprite roi rac khong noi len duoc thu quan trong nhat: dat canh nhau thi co ra
 * mot thanh pho khong. Trang nay xep sprite len luoi cheo 2:1 that, dung dung diem neo
 * `ox`/`oy` ma Phase 2 se dung, nen no cung la phep thu SOM cho phan toan hoc cua
 * `IsoMath` - sai neo thi nhin la thay ngay, khong phai doi toi Phase 2.
 *
 * Ve bang CSS chu khong phai WebGL: day la trang xem, khong phai game.
 *
 *   node tools/xem_canh.mjs [trung_co_1x] [phong-to] [ten-anh.png]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { TrinhDuyet } from './lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const KHO = 'public/atlas';
const O = 14;

const ten = process.argv[2] ?? 'trung_co_1x';
const phong = Number(process.argv[3] ?? 2);
const tenAnh = process.argv[4] ?? 'canh.png';

const bo = JSON.parse(readFileSync(join(KHO, `${ten}.json`), 'utf8'));
const px = bo.o_px;

/** Mot lang nho: nen truoc, roi duong, roi nha va cay. */
const nen = [];
for (let a = 0; a < O; a += 1) {
  for (let b = 0; b < O; b += 1) {
    const duong = a === 4 || b === 5;
    nen.push({ a, b, ten: duong ? 'o_duong' : ((a * 7 + b * 3) % 11 === 0 ? 'o_dat' : 'o_co') });
  }
}
const vat = [
  { a: 1, b: 1, ten: 'nha_ngoi_do' }, { a: 2, b: 2, ten: 'nha_ngoi_lam' },
  { a: 1, b: 3, ten: 'nha_go' }, { a: 3, b: 1, ten: 'nha_hai_tang' },
  { a: 6, b: 2, ten: 'nha_lon' }, { a: 9, b: 2, ten: 'cho' },
  { a: 6, b: 7, ten: 'lau_dai' }, { a: 2, b: 8, ten: 'coi_xay_gio' },
  { a: 10, b: 6, ten: 'trai_linh' }, { a: 11, b: 10, ten: 'thap_vuong' },
  { a: 0, b: 6, ten: 'cay_thong' }, { a: 1, b: 7, ten: 'cay_ram' },
  { a: 0, b: 9, ten: 'cay_soi_thu' }, { a: 3, b: 11, ten: 'cay_thong_tron' },
  { a: 12, b: 1, ten: 'cay_beo' }, { a: 12, b: 3, ten: 'da_lon' },
  { a: 8, b: 12, ten: 'ruong_lua_lon' }, { a: 5, b: 12, ten: 'lua_chin' },
  { a: 9, b: 9, ten: 'gieng' }, { a: 7, b: 4, ten: 'den_duong' },
  { a: 3, b: 5, ten: 'xe_keo' }, { a: 5, b: 3, ten: 'quay_hang_do' },
  { a: 11, b: 13, ten: 'cay_thong' }, { a: 13, b: 8, ten: 'nui_da' },
];

// Nen ve HET truoc, roi moi toi vat. Tron hai lop lai theo do sau thi o nen phia sau se
// de len bong do cua nha phia truoc, va bong bien mat - dung cai bay nay lan dau.
const sau = (m, n) => (m.a + m.b) - (n.a + n.b);
const tat = [...nen.sort(sau), ...vat.sort(sau)].filter((m) => bo.sprite[m.ten] !== undefined);

const toaDo = tat.map((m) => {
  const s = bo.sprite[m.ten];
  return { s, x: (m.a - m.b) * (px / 2) - s.ox, y: (m.a + m.b) * (px / 4) - s.oy, w: s.w, h: s.h };
});
const x0 = Math.min(...toaDo.map((t) => t.x));
const y0 = Math.min(...toaDo.map((t) => t.y));
const rong = Math.ceil((Math.max(...toaDo.map((t) => t.x + t.w)) - x0) * phong);
const cao = Math.ceil((Math.max(...toaDo.map((t) => t.y + t.h)) - y0) * phong);

const lop = toaDo.map((t) => `<i style="left:${(t.x - x0) * phong}px;top:${(t.y - y0) * phong}px;width:${t.w * phong}px;height:${t.h * phong}px;background-image:url(/trang/${t.s.trang});background-position:${-t.s.x * phong}px ${-t.s.y * phong}px;background-size:${bo.canh * phong}px ${bo.canh * phong}px"></i>`).join('');

const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#6f9a52}
i{position:absolute;display:block;image-rendering:pixelated}
</style><body style="width:${rong}px;height:${cao}px">${lop}`;

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

const td = new TrinhDuyet(CHROMIUM, 9232);
try {
  await td.mo();
  await td.datManHinh(rong, cao, 1);
  await td.moTrang(`http://127.0.0.1:${may.address().port}/`);
  await td.choDen('document.querySelectorAll("i").length > 0', 20000);
  await new Promise((r) => setTimeout(r, 1500));
  mkdirSync('anh_chup', { recursive: true });
  writeFileSync(join('anh_chup', tenAnh), await td.chup());
  console.log(`anh_chup/${tenAnh} - ${tat.length} sprite, ${rong}x${cao}`);
} finally {
  await td.dong();
  may.close();
}
