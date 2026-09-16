#!/usr/bin/env node
/**
 * Do asset MOT LENH - thay ba buoc `grep` tay cua luat do asset.
 *
 * VI SAO CAN, ba cho da sap:
 *
 * 1. Tra theo CHU, khong theo nghia. `trai_ga` do het 11 goi khong ra, vi phai doan dung
 *    chuoi `chicken`/`hen`/`coop`. May khong biet "ga" ≈ `poultry`. Nay co
 *    `tools/tu_dien_asset.json` dich truoc.
 * 2. `grep -i` tran vao `docs/KHO_ASSET.md` la mat ~3.300 token mot dong (dong dai 4.870
 *    ky tu). File nay chi lay TEN MODEL trung, khong bao gio in ca dong.
 * 3. Ba buoc de quen buoc. Day chay ca ba, cong hai nguon xa, trong mot lenh.
 *
 * VI SAO KHONG DUNG MCP. Do 13/09: cho dat nhat la SO LUOT goi model (400.323 token moi
 * luot), khong phai co file. Schema MCP nap vao ngu canh MOI PHIEN du khong goi lan nao;
 * mot lenh CLI ton 0 token khi khong dung. `threenative-asset-mcp` co 40+ tool, khong ghi
 * license, va 2/6 nguon chinh cua no (Fab, Sketchfab) deu `000` o may ao.
 *
 * NGUON XA - do 15/09:
 *   Poly Haven  `api.polyhaven.com`  HTTP 200, KHONG can khoa, 521 model, TOAN BO CC0.
 *               Manh o do dung (props 176 · nature 110 · containers 68), YEU o nha
 *               (structures 26). Do 521 model: KHONG co ga.
 *   Poly Pizza  `api.poly.pizza`     HTTP 401 - thong, thieu khoa. 10.400+ model,
 *               CC0 + CC-BY, loc duoc `licence=CC0`. Can bien moi truong POLY_PIZZA_KEY.
 *               Khoa lay o https://poly.pizza/ muc Settings; `poly.pizza` tra 403 cho
 *               `curl` nen chi chu du an lay duoc bang Safari.
 *
 * LUAT LICENSE cua repo: CC0 · CC-BY · MIT duoc. **CC-BY-SA CAM.** File nay danh dau
 * moi ket qua kem license; thu nao khong ro thi in `?` chu khong doan.
 *
 * Dung:
 *   npm run do:asset ga
 *   npm run do:asset nha hien_dai
 *   npm run do:asset chicken            # tu tieng Anh cung duoc
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TU_DIEN = 'tools/tu_dien_asset.json';
const CACHE = '.cache';
const CACHE_PH = join(CACHE, 'polyhaven_models.json');
/** Cache Poly Haven song 24 gio. Kho do doi vai ngay mot lan, khong can hoi lai moi lenh. */
const CACHE_SONG = 24 * 60 * 60 * 1000;
/** Tran dong in moi nguon. Dai hon la tu khoa qua rong, hep lai con hon do output. */
const TRAN_IN = 40;

const BUOC_LOCAL = [
  { ten: '1. docs/KHO_ASSET.md  (kho da tai ve dia)', duong: 'docs/KHO_ASSET.md' },
  { ten: '1b. docs/KHO_CHUNG.md (kho chung repo tayvuc)', duong: 'docs/KHO_CHUNG.md' },
];

/**
 * Kho muc luc chung `kho-game` - do 16/09: 82.105 dong tren 5 nguon, gap 16 lan hai file
 * ke o tren cong lai. Khong bat buoc phai co: repo do clone rieng, thieu thi bo qua chu
 * khong lam hong lenh.
 */
const KHO_GAME = '/home/user/kho-game/cong-cu/do.mjs';

/**
 * Dich tu khoa tieng Viet sang mang tu khoa tieng Anh.
 *
 * Tu dich duoc thi BO tu goc tieng Viet di: no khong bao gio co trong ten model tieng Anh,
 * ma de lai thi no do trung bay: `ga` trung `garage` `garden`. Tu khong co trong tu dien
 * thi giu nguyen - co the chinh no da la tieng Anh.
 */
function dich(tuKhoa) {
  const bo = JSON.parse(readFileSync(TU_DIEN, 'utf8')).tu;
  const ra = new Set();
  for (const t of tuKhoa) {
    const khoa = t.toLowerCase();
    const dichDuoc = bo[khoa] ?? null;
    if (dichDuoc === null) ra.add(khoa);
    else for (const x of dichDuoc) ra.add(x);
  }
  return [...ra];
}

/**
 * Lay TEN MODEL trung tu mot file ke, khong lay ca dong.
 * Dong trong `KHO_ASSET.md` dai toi 4.870 ky tu - in ca dong la dot token.
 */
function doFileKe(duong, tu) {
  if (!existsSync(duong)) return [];
  const chu = readFileSync(duong, 'utf8');
  const ra = new Set();
  for (const t of tu) {
    for (const m of chu.matchAll(new RegExp(`[A-Za-z0-9_]*${t}[A-Za-z0-9_]*`, 'gi'))) ra.add(m[0]);
  }
  return [...ra].sort();
}

/** `NGUON_MO.md` nho (12 KB) va la van xuoi - o day lay ca dong moi hieu duoc. */
function doNguonMo(tu) {
  const duong = 'docs/NGUON_MO.md';
  if (!existsSync(duong)) return [];
  const re = new RegExp(tu.join('|'), 'i');
  return readFileSync(duong, 'utf8')
    .split('\n')
    .filter((d) => re.test(d) && d.trim() !== '')
    .map((d) => d.trim());
}

async function taiPolyHaven() {
  mkdirSync(CACHE, { recursive: true });
  const con = existsSync(CACHE_PH) && Date.now() - statSync(CACHE_PH).mtimeMs < CACHE_SONG;
  if (con) return JSON.parse(readFileSync(CACHE_PH, 'utf8'));
  const res = await fetch('https://api.polyhaven.com/assets?type=models');
  if (!res.ok) throw new Error(`Poly Haven hong: HTTP ${res.status}`);
  const bo = await res.json();
  writeFileSync(CACHE_PH, JSON.stringify(bo));
  return bo;
}

/**
 * Khop TRON TU, khong khop chuoi con.
 *
 * Ten va the cua nguon xa la tieng Anh that, nen khop chuoi con la do rac: `hen` trung
 * `kitchen`, `ga` trung `garage`. Gach duoi va gach ngang tinh la ranh gioi tu vi ten
 * model hay viet kieu `chicken_coop_01`.
 */
function khopTron(tu) {
  return new RegExp(`(?:^|[^a-z])(?:${tu.join('|')})(?:[^a-z]|$)`, 'i');
}

/** Toan bo kho Poly Haven la CC0: https://polyhaven.com/license */
async function doPolyHaven(tu) {
  const bo = await taiPolyHaven();
  const re = khopTron(tu);
  return Object.keys(bo)
    .filter((ten) => re.test(`${ten} ${(bo[ten].tags ?? []).join(' ')} ${(bo[ten].categories ?? []).join(' ')}`))
    .map((ten) => `${ten}  [CC0]`);
}

/**
 * HAI DUONG CAP KHOA, file nay chiu duoc ca hai:
 *
 *   a) Bien moi truong `POLY_PIZZA_KEY` - file tu dat header `x-auth-token`.
 *   b) API credential cua moi truong dam may - **khoa khong bao gio vao phien**; proxy
 *      cua Anthropic tu gan header sau khi request roi khoi may ao. An toan hon (a).
 *
 * Nen khong co bien moi truong thi VAN GOI, chu khong bo qua: duong (b) khong de lai dau
 * vet nao trong phien de kiem truoc. Gap `401` moi biet la chua co khoa nao ca.
 */
async function doPolyPizza(tu) {
  const khoa = process.env.POLY_PIZZA_KEY;
  const dau = khoa === undefined || khoa === '' ? {} : { 'x-auth-token': khoa };
  const ra = [];
  for (const t of tu.slice(0, 4)) {
    const res = await fetch(`https://api.poly.pizza/v1.1/search/${encodeURIComponent(t)}?limit=12`, {
      headers: dau,
    });
    if (res.status === 401) return null;
    if (!res.ok) {
      ra.push(`(${t}: HTTP ${res.status})`);
      continue;
    }
    const bo = await res.json();
    // Poly Pizza tra khoa kieu PascalCase co dau cach: `Title` `Licence` `Tri Count`.
    for (const m of bo.Results ?? bo.results ?? []) {
      // Khong doan license: khong ro thi in `?`. CC-BY-SA la CAM, phai nhin thay moi loai.
      const lic = m.Licence ?? '?';
      const co = lic.includes('SA') ? '  <-- CAM (SA)' : '';
      const tri = m['Tri Count'] ?? '?';
      ra.push(`${m.Title}  [${lic}]${co}  ${tri} tam  ${m.Category ?? '-'}  ${m.Download ?? m.ID}`);
    }
  }
  return [...new Set(ra)];
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
const tu = dich(tuKhoa);
console.log(`Tu khoa: ${tuKhoa.join(' ')}\nDo theo: ${tu.join(' ')}`);

for (const b of BUOC_LOCAL) in_(b.ten, doFileKe(b.duong, tu));

// Buoc 1c: kho muc luc chung. Goi lenh cua repo do thay vi chep logic sang day - no doi
// khi nguon moi duoc nap, chep la lech.
if (existsSync(KHO_GAME)) {
  console.log('\n--- 1c. kho-game (muc luc chung, 5 nguon) ---');
  try {
    console.log(execFileSync('node', [KHO_GAME, ...tuKhoa], { encoding: 'utf8' }).trim());
  } catch (e) {
    console.log(`  hong: ${String(e.message).slice(0, 80)}`);
  }
} else {
  console.log('\n--- 1c. kho-game --- CHUA CLONE.'
    + '\n  git clone --depth 1 https://github.com/gc1001vn-svg/kho-game /home/user/kho-game');
}

in_('2. docs/NGUON_MO.md  (nguon da tra, van xuoi)', doNguonMo(tu));

try {
  in_('3. Poly Haven  (521 model, toan bo CC0, khong can khoa)', await doPolyHaven(tu));
} catch (e) {
  console.log(`\n--- 3. Poly Haven --- hong: ${e.message}`);
}

const pizza = await doPolyPizza(tu);
if (pizza === null) {
  console.log('\n--- 4. Poly Pizza --- BO QUA: HTTP 401, chua co khoa nao');
  console.log('  Lay khoa: https://poly.pizza/ -> dang nhap -> Settings -> tao app -> copy key');
  console.log('  Roi mot trong hai:');
  console.log('    a) POLY_PIZZA_KEY=<khoa> npm run do:asset ...   (tam, het khi dong phien)');
  console.log('    b) API credential cua moi truong (ben, khoa khong vao phien)');
  console.log('       claude.ai/code -> bo chon moi truong -> Update cloud environment');
  console.log('       -> API credentials -> Add credential -> host api.poly.pizza,');
  console.log('          header x-auth-token, xoa trong o Prefix');
  console.log('  KHOA LA MAT KHAU - repo nay Public, KHONG commit khoa vao git.');
} else {
  in_('4. Poly Pizza  (10.400+ model, CC0 + CC-BY)', pizza);
}

console.log('\nChua ra thi buoc cuoi la BAO CHU DU AN QUYET - cam tu ve, tu ghep.');
