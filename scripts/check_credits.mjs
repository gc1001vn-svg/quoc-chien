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

// Ten file atlas khong doi khi them goi model moi vao me, nen kiem rieng GOI NGUON:
// moi `kit[].duong` trong tools/me/*.json tro toi mot goi duoi assets_source/, ten goi do
// phai co trong so ghi cong. Thieu buoc nay thi them goi CC-BY vao atlas ma khong ai biet.
const ME = 'tools/me';
/** So ghi cong viet ten dep ("Tower Defense Kit"), thu muc viet gach noi. Bo het dau va hoa. */
const gon = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const soGon = gon(so);
const goiThieu = new Set();
if (existsSync(ME)) {
  for (const f of readdirSync(ME).filter((t) => t.endsWith('.json'))) {
    const me = JSON.parse(readFileSync(join(ME, f), 'utf8'));
    for (const kit of Object.values(me.kit ?? {})) {
      const goi = String(kit.duong ?? '').split('/')[1];
      if (goi && !soGon.includes(gon(goi))) goiThieu.add(goi);
    }
  }
}

if (thieu.length > 0 || goiThieu.size > 0) {
  if (thieu.length > 0) {
    console.error(`check:credits HONG - ${thieu.length} file khong co trong ${SO}:`);
    for (const t of thieu) console.error(`  - ${t}`);
  }
  if (goiThieu.size > 0) {
    console.error(`check:credits HONG - ${goiThieu.size} goi nguon khong co trong ${SO}:`);
    for (const g of goiThieu) console.error(`  - ${g}  (khai trong tools/me/*.json)`);
  }
  process.exit(1);
}
console.log('check:credits OK - moi asset va moi goi nguon deu ghi nguon.');
