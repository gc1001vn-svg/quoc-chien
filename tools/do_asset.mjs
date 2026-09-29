#!/usr/bin/env node
/**
 * Do asset MOT LENH - thay ba buoc `grep` tay cua luat do asset.
 *
 * VI SAO CAN, ba cho da sap:
 *
 * 1. Tra theo CHU, khong theo nghia. `trai_ga` do het 11 goi khong ra, vi phai doan dung
 *    chuoi `chicken`/`hen`/`coop`. Nay dich qua tu dien cua kho-game (`cong-cu/tu_dien.json`,
 *    khoa co dau: "gà", "hiệu ứng" - go khong dau cung duoc).
 * 2. `grep -i` tran vao `docs/KHO_ASSET.md` la mat ~3.300 token mot dong (dong dai 4.870
 *    ky tu). File nay chi lay TEN MODEL trung, khong bao gio in ca dong.
 * 3. Ba buoc de quen buoc. Day chay ca ba trong mot lenh.
 *
 * 29/09 GON LAI: bo tu dien rieng (`tools/tu_dien_asset.json`) va hai buoc do song Poly Haven,
 * Poly Pizza - trung voi ban ke cua kho-game (`ke/polyhaven.tsv` du 2.378 muc CC0, `ke/poly-
 * pizza.tsv`), lai khong repo game nao khac dung duoc. Mot tu dien, mot lenh do: kho-game.
 *
 * LUAT LICENSE cua repo: CC0 · CC-BY · MIT duoc. **CC-BY-SA CAM.**
 *
 * Dung:
 *   npm run do:asset ga
 *   npm run do:asset "hiệu ứng" lửa
 *   npm run do:asset chicken            # tu tieng Anh cung duoc
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { coKhoGame, KHO_GAME } from './kho_game.mjs';

/** Tran dong in moi buoc. Dai hon la tu khoa qua rong, hep lai con hon do output. */
const TRAN_IN = 40;

const BUOC_LOCAL = [
  { ten: '1. docs/KHO_ASSET.md  (kho da tai ve dia)', duong: 'docs/KHO_ASSET.md' },
  { ten: '1b. docs/KHO_CHUNG.md (kho chung repo tayvuc)', duong: 'docs/KHO_CHUNG.md' },
];

/**
 * Lay TEN MODEL trung tu mot file ke, khong lay ca dong.
 * Dong trong `KHO_ASSET.md` dai toi 4.870 ky tu - in ca dong la dot token.
 */
function doFileKe(duong, tu) {
  if (!existsSync(duong)) return [];
  const chu = readFileSync(duong, 'utf8');
  const ra = new Set();
  for (const t of tu) {
    const mau = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ _-]?');
    for (const m of chu.matchAll(new RegExp(`[A-Za-z0-9_]*${mau}[A-Za-z0-9_]*`, 'gi'))) ra.add(m[0]);
  }
  return [...ra].sort();
}

/** `NGUON_MO.md` nho va la van xuoi - o day lay ca dong moi hieu duoc. */
function doNguonMo(tu) {
  const duong = 'docs/NGUON_MO.md';
  if (!existsSync(duong)) return [];
  const re = new RegExp(tu.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  return readFileSync(duong, 'utf8')
    .split('\n')
    .filter((d) => re.test(d) && d.trim() !== '')
    .map((d) => d.trim());
}

function in_(ten, dong) {
  console.log(`\n--- ${ten} --- ${dong.length} trung`);
  if (dong.length === 0) {
    console.log('  (khong co)');
    return;
  }
  for (const d of dong.slice(0, TRAN_IN)) console.log(`  ${d}`);
  if (dong.length > TRAN_IN) console.log(`  … con ${dong.length - TRAN_IN}, hep tu khoa lai`);
}

const tuKhoa = process.argv.slice(2);
if (tuKhoa.length === 0) {
  console.error('Dung: npm run do:asset <tu khoa>...   vi du: npm run do:asset ga');
  process.exit(1);
}

// Kho-game chua clone thi TU clone. Ban cu chi in dong nhac: 28/09 phien bo qua dong do,
// ket luan sai "khong co ga" trong khi kho-game co. Clone hong thi NOI RO, khong im.
if (!coKhoGame()) {
  console.log('HONG: khong clone duoc kho-game. CHUA do thi CHUA duoc ket luan "khong co model".'
    + '\n  git clone --depth 1 https://github.com/gc1001vn-svg/kho-game /home/user/kho-game');
  process.exit(1);
}
const { dich } = await import(pathToFileURL(`${KHO_GAME}/cong-cu/tim.mjs`).href);
const { tra: tu } = dich(tuKhoa);
console.log(`Tu khoa: ${tuKhoa.join(' ')}\nDo theo: ${tu.join(' ')}`);

for (const b of BUOC_LOCAL) in_(b.ten, doFileKe(b.duong, tu));

// Buoc 1c: kho muc luc chung. Goi lenh cua repo do thay vi chep logic sang day - no doi
// khi nguon moi duoc nap, chep la lech.
console.log('\n--- 1c. kho-game (muc luc chung moi nguon) ---');
try {
  console.log(execFileSync('node', [`${KHO_GAME}/cong-cu/do.mjs`, ...tuKhoa], { encoding: 'utf8' }).trim());
} catch (e) {
  console.log(`  hong: ${String(e.message).slice(0, 80)}`);
}

in_('2. docs/NGUON_MO.md  (nguon da tra, van xuoi)', doNguonMo(tu));

console.log('\nLay ve: node /home/user/kho-game/cong-cu/lay.mjs <nguon> ... (icosa · kenney · itch · polyhaven · quaternius ...)');
console.log('Chua ra thi buoc cuoi la BAO CHU DU AN QUYET - cam tu ve, tu ghep. Tu lam thi khai o docs/TU_LAM.md.');
