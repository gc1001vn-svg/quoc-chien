#!/usr/bin/env node
/**
 * Ve BAN VE QUY HOACH ca thanh pho ra mot tam anh - moi khu mot mau, vien to den.
 *
 * VI SAO CAN: trong game muc thu nho nhat (0,35x) chi thay 39 o tren 96, khong bao gio
 * nhin duoc ca bo cuc. Suot ngay 10/09 toi sua quy hoach roi chup mot goc man va doan -
 * ba lan chua nham cho. Tam anh nay cho nhin ca ban do mot luc, thay ngay vanh nao lech,
 * cho nao nha don cuc.
 *
 * Dung: node tools/xem_quy_hoach.mjs [ten-file.png]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { TrinhDuyet } from './lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const tenAnh = process.argv[2] ?? 'quy_hoach.png';
const O = 7;

// Lay so lieu tu chinh `src/sim/` - khong ve lai mot ban sao thu hai cua luat quy hoach.
const lieu = JSON.parse(execFileSync('npx', ['tsx', '-e', `
import { ThanhPho } from './src/sim/city/City.ts';
import hang from './data/wares.json' with { type: 'json' };
import nha from './data/buildings.json' with { type: 'json' };
import chuoi from './data/chains.json' with { type: 'json' };
import banDo from './data/thanh_pho_demo.json' with { type: 'json' };
import walker from './data/walkers.json' with { type: 'json' };
import { docQuyHoach, khuCuaO, laVien } from './src/sim/city/QuyHoach.ts';
const tp = new ThanhPho({ hang, nha, chuoi, banDo, walker } as never);
const qh = docQuyHoach((banDo as any).vanh, (banDo as any).canh, (banDo as any).duongCach);
const canh = (banDo as any).canh;
const khu: string[] = [], vien: number[] = [];
for (let a = 0; a < canh; a++) for (let b = 0; b < canh; b++) {
  khu.push(khuCuaO(qh, a, b));
  if (laVien(qh, a, b)) vien.push(a * canh + b);
}
const nhaDs: { a: number; b: number; ten: string }[] = [];
for (const d of (nha as any).nha) for (const o of tp.viTriNha(d.ten)) nhaDs.push({ a: o.a, b: o.b, ten: d.ten });
process.stdout.write(JSON.stringify({ canh, duongCach: (banDo as any).duongCach, khu, vien,
  nha: nhaDs, kho: tp.doiWalker.danhSachKho }));
`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim());

const MAU = {
  do_thi: '#c9a227', san_xuat: '#5b8dd9', cong_nghiep: '#b05a4a',
  nong_nghiep: '#6fa860', quan_su: '#8a7bb8',
};
const canh = lieu.canh;
const rong = canh * O + 260;
const cao = canh * O + 40;
const vienBo = new Set(lieu.vien);

const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#15171a;font:12px system-ui,sans-serif;color:#dfe3e8}
#g{position:absolute;left:20px;top:20px}
#chu{position:absolute;left:${canh * O + 40}px;top:20px;line-height:1.9}
i{display:inline-block;width:12px;height:12px;vertical-align:-2px;margin-right:6px;border-radius:2px}
</style><body><canvas id="g" width="${canh * O}" height="${canh * O}"></canvas>
<div id="chu">${Object.entries(MAU).map(([k, m]) => `<div><i style="background:${m}"></i>${k}</div>`).join('')}
<div style="margin-top:10px"><i style="background:#111"></i>viền giữa hai vành</div>
<div><i style="background:#fff;border-radius:9px"></i>công trình</div>
<div><i style="background:#ff3b30"></i>kho hàng</div></div>
<script>
const L = ${JSON.stringify(lieu)}, MAU = ${JSON.stringify(MAU)}, O = ${O}, canh = ${canh};
const vien = new Set(${JSON.stringify([...vienBo])});
const c = document.getElementById('g').getContext('2d');
for (let a = 0; a < canh; a++) for (let b = 0; b < canh; b++) {
  const i = a * canh + b;
  c.fillStyle = vien.has(i) ? '#111' : MAU[L.khu[i]];
  c.fillRect(b * O, a * O, O, O);
  if (a % L.duongCach === 0 || b % L.duongCach === 0) {
    c.fillStyle = 'rgba(255,255,255,0.13)'; c.fillRect(b * O, a * O, O, O);
  }
}
for (const n of L.nha) {
  c.fillStyle = '#fff'; c.beginPath();
  c.arc(n.b * O + O / 2, n.a * O + O / 2, O * 0.42, 0, 7); c.fill();
}
for (const k of L.kho) {
  c.fillStyle = '#ff3b30'; c.fillRect(k.b * O - O, k.a * O - O, O * 3, O * 3);
}
document.title = 'xong';
</script>`;

const may = createServer((_q, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(html);
});
await new Promise((ok) => may.listen(0, '127.0.0.1', ok));

const td = new TrinhDuyet(CHROMIUM, 9227);
try {
  await td.mo();
  await td.datManHinh(rong, cao, 2);
  await td.moTrang(`http://127.0.0.1:${may.address().port}/`);
  await td.choDen('document.title === "xong"', 20000);
  await new Promise((r) => setTimeout(r, 800));
  mkdirSync('anh_chup', { recursive: true });
  writeFileSync(join('anh_chup', tenAnh), await td.chup());
  console.log(`anh_chup/${tenAnh} - ${lieu.nha.length} cong trinh, ${lieu.kho.length} kho`);
} finally {
  await td.dong();
  may.close();
}
