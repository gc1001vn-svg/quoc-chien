#!/usr/bin/env node
/**
 * Moi file trong `public/assets/` phai co ten trong `docs/ASSET_CREDITS.md`.
 *
 * License chi chap nhan CC0, CC-BY, MIT. CC-BY-SA lay license sang ca du an -> cam.
 * Phase 0 chua co asset nao; script van chay de CI bat duoc ngay khi Phase 1 them atlas.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const KHO = 'public/assets';
const SO = 'docs/ASSET_CREDITS.md';

if (!existsSync(KHO)) {
  console.log('check:credits OK - chua co public/assets/, khong co gi de kiem.');
  process.exit(0);
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
