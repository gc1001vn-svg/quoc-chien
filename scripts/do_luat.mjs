#!/usr/bin/env node
// Thuoc: do xem luat trong `AGENTS.md` co that su doi hanh vi khong.
//
// Co che chep tu `Human-Agent-Society/reef` (Apache-2.0),
// `tutorials/evolve-your-harness/harness/evolution.py` — ban that cua ho gon
// dung 64 dong: mot bo de co dinh nho, mot ham cham 1.0/0.0 doc DONG CUOI, va
// luat "chi giu thay doi nao bien cau dang truot thanh dat". Day la ban lam tay
// cua co che do, khong can Reef, khong can GPU.
//
// Moi cau hoi HAI lan: khong kem luat, va co kem `AGENTS.md`. Hieu so giua hai
// lan moi la thu dang doc — mot cau dat ca hai lan nghia la dong luat do THUA.
//
// Nguoi tra loi la Gemini flash, KHONG phai Claude: phep do nay do LOI LUAT co
// tu noi du y khong. Bo de va cach doc ket qua: `docs/BO_DE.md`.
//
//   node scripts/do_luat.mjs            # do ca hai lan
//   node scripts/do_luat.mjs --nhanh    # chi do lan CO luat (re hon mot nua)

import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BO_DE = 'docs/BO_DE.md';
const LUAT = 'AGENTS.md';
const HOI_GEMINI = '/home/user/ghi-nho/cong-cu/hoi_gemini.mjs';
// Tran free tier: 5 request/phut TINH RIENG TUNG MODEL (do 20/09). Nghi giua
// cac lan goi de khoi dot bac model vao 429 — `hoi_gemini.mjs` tut bac duoc
// nhung tut roi la mat bac do cho ca phien.
const NGHI_GIAY = Number(process.env.DO_LUAT_NGHI) || 8;

const nhanh = process.argv.includes('--nhanh');

if (!process.env.GEMINI_API_KEY) {
  console.error('HONG: thieu GEMINI_API_KEY — thuoc nay can mot model de hoi.');
  process.exit(1);
}
for (const p of [BO_DE, LUAT, HOI_GEMINI]) {
  if (!existsSync(p)) {
    console.error(`HONG: thieu ${p}`);
    process.exit(1);
  }
}

/** Doc bo de: moi cau la `## <ma>` roi `HOI:` roi `DAP:`. */
function docBoDe() {
  const de = [];
  let hien = null;
  for (const dong of readFileSync(BO_DE, 'utf8').split('\n')) {
    const dau = dong.match(/^##\s+(\S+)\s*$/);
    if (dau) {
      hien = { ma: dau[1], hoi: '', dap: '' };
      de.push(hien);
      continue;
    }
    if (!hien) continue;
    if (dong.startsWith('HOI:')) hien.hoi = dong.slice(4).trim();
    if (dong.startsWith('DAP:')) hien.dap = dong.slice(4).trim();
  }
  return de.filter((d) => d.hoi && d.dap);
}

/** Bo dau nhay, dau cau, dau tieng Viet — de so sanh dong cuoi cho cong bang. */
function chuanHoa(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[`*_"'.,;:!?()[\]]/g, '')
    .trim()
    .toLowerCase();
}

/** Cham 1 khi DONG CUOI khong rong khop dap an, 0 khi khong. */
function cham(dap, traLoi) {
  if (!traLoi) return 0;
  // `hoi_gemini.mjs` tu 21/09 in them dong `[nguon: …]` cuoi dap (duong ve).
  // Khong bo dong do thi ham nay cham NHAM chinh cai dong ay: do 21/09 ca 10 cau
  // tut ve 0 ngay sau khi them. Bo moi dong `[…]` — chung la sieu du lieu, khong
  // phai dap.
  const dong = traLoi
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d && !(d.startsWith('[') && d.endsWith(']')));
  if (!dong.length) return 0;
  const cuoi = chuanHoa(dong[dong.length - 1]);
  // Dap NHIEU PHAN (`render, ui, bench`): doi du ca ba co mat, khong doi dung thu
  // tu va tu noi. Do 21/09: cung cau nay dat mot luot roi truot luot sau chi vi
  // model viet "render, ui va bench" — do la cham sai, khong phai luat sai.
  const phan = dap.includes(',') ? dap.split(',').map(chuanHoa).filter(Boolean) : null;
  if (phan) return phan.every((x) => cuoi.includes(x)) ? 1 : 0;
  const mong = chuanHoa(dap);
  return cuoi === mong || cuoi.includes(mong) ? 1 : 0;
}

/** Goi Gemini. `kemLuat` quyet dinh co gui `AGENTS.md` theo hay khong. */
function hoi(cauHoi, kemLuat) {
  const dsoi = kemLuat ? [HOI_GEMINI, cauHoi, LUAT] : [HOI_GEMINI, cauHoi];
  const r = spawnSync('node', dsoi, { encoding: 'utf8' });
  if (r.status !== 0) return { loi: (r.stderr || '').trim().split('\n').slice(-1)[0], ra: '' };
  return { loi: '', ra: (r.stdout || '').trim() };
}

const de = docBoDe();
if (!de.length) {
  console.error(`HONG: ${BO_DE} khong co cau nao doc duoc.`);
  process.exit(1);
}

console.log(`${BO_DE}: ${de.length} cau${nhanh ? ' (che do --nhanh: chi do lan CO luat)' : ''}`);

const dem = { 'LUAT AN': 0, THUA: 0, 'CHUA DU': 0, HONG: 0, 'KHONG DO': 0 };
const loi = [];
// Vet truot that: dong cuoi model tra loi o lan CO luat. Nguoi sua luat can doc
// nguyen van, khong doc diem 0/1 — y chep tu Meta-Harness (arXiv 2603.28052).
const vet = [];

/** Dong cuoi cua cau tra loi, bo dong `[…]` nhu `cham()`. */
function dongCuoi(ra) {
  const dong = ra.split('\n').map((x) => x.trim()).filter((x) => x && !(x.startsWith('[') && x.endsWith(']')));
  return dong.length ? dong[dong.length - 1] : '(rong)';
}

for (const d of de) {
  let diemKhong = null;
  let loiGoi = false;
  if (!nhanh) {
    const a = hoi(d.hoi, false);
    if (a.loi) loi.push(`${d.ma} (khong luat): ${a.loi}`);
    loiGoi ||= Boolean(a.loi);
    diemKhong = cham(d.dap, a.ra);
    spawnSync('sleep', [String(NGHI_GIAY)]);
  }
  const b = hoi(d.hoi, true);
  if (b.loi) loi.push(`${d.ma} (co luat): ${b.loi}`);
  loiGoi ||= Boolean(b.loi);
  const diemCo = cham(d.dap, b.ra);
  spawnSync('sleep', [String(NGHI_GIAY)]);

  let ket;
  // Model khong tra loi (503, khoa sai…) thi cau nay KHONG DO duoc — khong duoc
  // tinh la luat truot. Luat Linux `coding-assistants.rst` buoc 8: noi ro phan
  // chua lam duoc.
  if (loiGoi) ket = 'KHONG DO';
  else if (nhanh) ket = diemCo ? 'LUAT AN' : 'HONG';
  else if (!diemKhong && diemCo) ket = 'LUAT AN';
  else if (diemKhong && diemCo) ket = 'THUA';
  else if (diemKhong && !diemCo) ket = 'CHUA DU';
  else ket = 'HONG';
  dem[ket] += 1;

  const cot = nhanh ? `co luat ${diemCo}` : `khong luat ${diemKhong} -> co luat ${diemCo}`;
  console.log(`  ${d.ma.padEnd(14)} ${ket.padEnd(8)}  ${cot}`);
  if (ket === 'CHUA DU' || ket === 'HONG') vet.push(`${d.ma}: can "${d.dap}", model ghi "${dongCuoi(b.ra)}"`);
}

if (loi.length) {
  console.log('Loi goi model:');
  for (const l of loi) console.log(`  ${l}`);
}
if (vet.length) {
  console.log('Vet truot (dong cuoi, lan co luat):');
  for (const v of vet) console.log(`  ${v}`);
}

console.log(
  `Luat an ${dem['LUAT AN']} · thua ${dem.THUA} · chua du ${dem['CHUA DU']} · hong ${dem.HONG}` +
    ` · khong do ${dem['KHONG DO']}`,
);

// Thuoc do khi con cau nao KHONG dat o lan CO luat. Cau `THUA` khong lam do
// thuoc — no la goi y cat bot, khong phai loi.
const truot = dem['CHUA DU'] + dem.HONG;
if (truot) {
  console.error(
    `HONG: ${truot} cau van truot du da kem ${LUAT}.\n` +
      `  Sua LOI LUAT cho ro, dung sua bo de cho vua cau tra loi.\n` +
      `  Chi tiet cach doc bon ket qua: ${BO_DE}`,
  );
}
// Cau KHONG DO van lam do thuoc: chua do tron thi khong duoc bao dat.
if (dem['KHONG DO']) {
  console.error(
    `KHONG DO: ${dem['KHONG DO']} cau — model khong tra loi (xem "Loi goi model").\n` +
      `  Khong phai loi luat. Chay lai sau: node scripts/do_luat.mjs`,
  );
}
if (truot || dem['KHONG DO']) process.exit(1);
