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
import { dirname, join, relative } from 'node:path';

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

// TU LAM PHAI KHAI (29/09). Sprite KHONG co manh model nao (`m`), khong dan hoa tiet tai ve
// (`phang` + `texture`), khong chep sprite co nguon (`nhu`) - tuc la ve bang so thuan - thi
// phai co dong `<me>:<sprite>` trong `docs/TU_LAM.md`, ghi LENH DO da chay va NGAY ANH DUYET.
// Vi sao: 10/09 cam coi xay gio ghep tay nam luot nuong khi KayKit co san `mill`; 28/09 ket
// luan "khong co ga" khi kho-game co. Luat "do truoc khi tu lam" la chu - day la may giu.
// File trong `public/` ngoai atlas (icon, am thanh...) cung vay: co ten trong so ghi cong,
// hoac khai tu lam.
const TU_LAM = 'docs/TU_LAM.md';
const khai = new Map();
if (existsSync(TU_LAM)) {
  for (const d of readFileSync(TU_LAM, 'utf8').split('\n')) {
    const o = d.split('|').map((x) => x.trim());
    // | ma | vi sao | lenh do | anh duyet |  -> o[1..4]
    if (o.length >= 6 && o[1] && !/^[-: ]+$/.test(o[1]) && o[1] !== 'Mẻ:sprite · file') {
      khai.set(o[1].replace(/`/g, ''), { lenh: o[3], duyet: o[4] });
    }
  }
}
const tuLamThieu = [];
const khaiThieuO = [];
for (const [ma, k] of khai) {
  if (!k.lenh || !k.duyet) khaiThieuO.push(ma);
}
if (existsSync(ME)) {
  for (const f of readdirSync(ME).filter((t) => t.endsWith('.json'))) {
    const me = JSON.parse(readFileSync(join(ME, f), 'utf8'));
    const sp = me.sprite ?? {};
    /** Sprite co nguon: mot manh model, mot hoa tiet tai ve, hay chep mot sprite co nguon. */
    const coNguon = (ten, da = new Set()) => {
      if (da.has(ten) || !sp[ten]) return !sp[ten];
      da.add(ten);
      return [].concat(sp[ten]).some((p) => p.m || (p.phang !== undefined && p.texture) || (p.nhu && coNguon(p.nhu, da)));
    };
    for (const ten of Object.keys(sp)) {
      const ma = `${f.replace(/\.json$/, '')}:${ten}`;
      if (!coNguon(ten) && !khai.has(ma)) tuLamThieu.push(ma);
    }
  }
}
for (const ten of readdirSync('public')) {
  const day = join('public', ten);
  if (ten.startsWith('.') || ten === 'atlas') continue;
  const ds = statSync(day).isDirectory() ? readdirSync(day).map((x) => join(day, x)) : [day];
  for (const p of ds) {
    const r = relative('public', p);
    // So ghi cong co the ghi ca nhom: "`public/icons/*.png` — bieu tuong PWA, tu sinh...".
    const nhom = `public/${dirname(r)}/*`;
    if (!so.includes(r) && !so.includes(nhom) && !khai.has(`public/${r}`) && !khai.has(r)) tuLamThieu.push(`public/${r}`);
  }
}

if (thieu.length > 0 || goiThieu.size > 0 || tuLamThieu.length > 0 || khaiThieuO.length > 0) {
  if (thieu.length > 0) {
    console.error(`check:credits HONG - ${thieu.length} file khong co trong ${SO}:`);
    for (const t of thieu) console.error(`  - ${t}`);
  }
  if (goiThieu.size > 0) {
    console.error(`check:credits HONG - ${goiThieu.size} goi nguon khong co trong ${SO}:`);
    for (const g of goiThieu) console.error(`  - ${g}  (khai trong tools/me/*.json)`);
  }
  if (tuLamThieu.length > 0) {
    console.error(`check:credits HONG - ${tuLamThieu.length} thu TU LAM chua khai o ${TU_LAM}:`);
    for (const t of tuLamThieu) console.error(`  - ${t}`);
    console.error('  Do kho truoc: npm run do:asset <tu khoa>. Van khong co thi hoi anh, roi ghi dong'
      + ` "| ${tuLamThieu[0]} | vi sao | lenh do da chay | ngay anh duyet |".`);
  }
  if (khaiThieuO.length > 0) {
    console.error(`check:credits HONG - ${khaiThieuO.length} dong ${TU_LAM} thieu "lenh do" hay "anh duyet": ${khaiThieuO.join(' ')}`);
  }
  process.exit(1);
}
console.log(`check:credits OK - moi asset va moi goi nguon deu ghi nguon; ${khai.size} thu tu lam da khai.`);
