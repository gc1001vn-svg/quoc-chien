#!/usr/bin/env node
/**
 * Moi file atlas phai co ten trong `docs/ASSET_CREDITS.md`.
 *
 * License chi chap nhan CC0, CC-BY, MIT. CC-BY-SA lay license sang ca du an -> cam.
 *
 * 10/09: atlas doi tu `public/assets/atlas/` ve `public/atlas/` (workbox khong bao gio tai
 * lai file nam trong `assets/`). Script van tro vao duong cu nen no bao "chua co gi de
 * kiem" va DAT rong suot mot buoi - dung cai bay ma chinh no sinh ra de chan. Neu thu muc
 * bien mat thi bao HONG, khong bao DAT.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const KHO = 'public/atlas';
const SO = 'docs/ASSET_CREDITS.md';

if (!existsSync(KHO)) {
  console.error(`check:credits HONG - khong thay ${KHO}. Atlas doi cho ma script khong doi theo?`);
  process.exit(1);
}

const so = existsSync(SO) ? readFileSync(SO, 'utf8') : '';
const thieu = [];

function quet(duong) {
  for (const ten of readdirSync(duong)) {
    const day = join(duong, ten);
    if (statSync(day).isDirectory()) quet(day);
    else if (!so.includes(relative(KHO, day))) thieu.push(relative(KHO, day));
  }
}
quet(KHO);

if (thieu.length > 0) {
  console.error(`check:credits HONG - ${thieu.length} file khong co trong ${SO}:`);
  for (const t of thieu) console.error(`  - ${t}`);
  process.exit(1);
}
console.log('check:credits OK - moi asset deu ghi nguon.');
