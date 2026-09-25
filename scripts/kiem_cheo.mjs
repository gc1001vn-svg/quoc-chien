#!/usr/bin/env node
/**
 * Kiem cheo: MAY ghi ket qua, khong ai go tay so lieu.
 *
 *   node scripts/kiem_cheo.mjs [--file a,b,c] [--ra kiem_cheo.json]   chay thuoc, ghi JSON
 *   node scripts/kiem_cheo.mjs --so-sanh <mot.json> <hai.json>          so hai lan chay
 *
 * Vi sao co file nay (25/09): Jules tu bao sai 2/3 lan ("tới đời 5" -> doi 4; "5/5 test đỏ"
 * -> 1 xanh), Claude bao sai 2 so trong mot phien (351 test thay vi 341; "5000 tran" chua do).
 * Ca hai deu la so GO TAY. Nay ben lam chay lenh nay, nop file JSON; ben kiem chay lai tren
 * may minh roi `--so-sanh` - may doi chieu, khong ai phai tin loi ai.
 *
 * `--file` = danh sach file duoc phep sua (muc `## Files` cua de bai). Sua ngoai danh sach
 * la ma thoat 1. `sim:tran` chay voi hat giong co dinh nen so do phai TRUNG khop giua hai may.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

/** Thuoc chay duoc tren may khong co khoa API (khac `npm run do`: bo `do:luat`, `khoi:dong`). */
const THUOC = [
  ['lint', 'npm run lint --silent'],
  ['typecheck', 'npm run typecheck --silent'],
  ['test', 'npx vitest run'],
  ['sim:tran', 'npm run sim:tran --silent'],
];

function chay(lenh) {
  const batDau = Date.now();
  const r = spawnSync(lenh, { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const chu = stripVTControlCharacters(`${r.stdout ?? ''}${r.stderr ?? ''}`);
  return { ma: r.status ?? -1, giay: Math.round((Date.now() - batDau) / 100) / 10, chu };
}

/** Rut so lieu doi chieu duoc tu output tung thuoc. */
function rutSo(ten, chu) {
  if (ten === 'test') {
    // Vitest them `| 1 expected fail`, `| 2 skipped` sau so dat. Bieu thuc cu doi `passed (`
    // lien nhau nen gap `it.fails` la tra `{}` - hai may deu `{}` va so sanh bao KHOP ma khong
    // doi chieu so test nao (do 25/09, lan kiem cheo test DienTran cua Jules).
    const t = chu.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed(?: \| (\d+) expected fail)?(?: \| (\d+) skipped)? \((\d+)\)/);
    return t ? { hong: Number(t[1] ?? 0), dat: Number(t[2]), hongDuKien: Number(t[3] ?? 0), boQua: Number(t[4] ?? 0), tong: Number(t[5]) } : {};
  }
  if (ten === 'sim:tran') {
    const lech = chu.match(/Lech trung binh: ([\d.]+) diem/);
    const khung = chu.match(/trong \d+-\d+ s: ([\d.]+) %/);
    const brier = chu.match(/Brier: ([\d.]+)/);
    return { lech: lech?.[1] ?? null, trongKhung: khung?.[1] ?? null, brier: brier?.[1] ?? null };
  }
  return {};
}

function doiSo() {
  const a = process.argv.slice(2);
  const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  return { file: (lay('--file') ?? '').split(',').filter(Boolean), ra: lay('--ra') ?? 'kiem_cheo.json', soSanh: a.includes('--so-sanh') ? a.slice(a.indexOf('--so-sanh') + 1, a.indexOf('--so-sanh') + 3) : null };
}

function kiem({ file, ra }) {
  // Chi cat duoi: `git status` mo dau bang dau cach (" M a.txt"), cat dau la mat ky tu ten file.
  const git = (l) => chay(`git ${l}`).chu.trimEnd();
  // File da doi so voi commit goc, tru moi file ket qua kiem cheo (cua minh va cua ben kia
  // nam trong patch) - khong thi hai may luon lech o dung dong nay.
  const doi = git('status --porcelain --untracked-files=all').split('\n').filter(Boolean)
    .map((d) => d.slice(3).trim()).filter((f) => f !== ra && !/(^|\/)kiem_cheo[^/]*\.json$/.test(f));
  const ngoai = file.length > 0 ? doi.filter((f) => !file.includes(f)) : [];
  const thuoc = {};
  for (const [ten, lenh] of THUOC) {
    const r = chay(lenh);
    thuoc[ten] = { ma: r.ma, giay: r.giay, so: rutSo(ten, r.chu), duoi: r.chu.trim().split('\n').slice(-12) };
    console.log(`${ten.padEnd(10)} ${r.ma === 0 ? 'DAT ' : 'HONG'} ${String(r.giay)} s`);
  }
  const ketQua = {
    luc: new Date().toISOString(),
    may: { node: process.version, jules: process.env.JULES_SESSION_ID ? 'co' : 'khong' },
    commitGoc: git('rev-parse --short HEAD'),
    fileDoi: doi,
    ngoaiPhamVi: ngoai,
    thuoc,
  };
  writeFileSync(ra, `${JSON.stringify(ketQua, null, 1)}\n`);
  const hong = Object.values(thuoc).filter((t) => t.ma !== 0).length + (ngoai.length > 0 ? 1 : 0);
  if (ngoai.length > 0) console.log(`NGOAI PHAM VI: ${ngoai.join(' ')}`);
  console.log(`So do: ${String(THUOC.length - Object.values(thuoc).filter((t) => t.ma !== 0).length)}/${String(THUOC.length)} thuoc dat · ghi ${ra}`);
  process.exit(hong > 0 ? 1 : 0);
}

/** So hai file ket qua: ma thoat va so lieu phai trung; thoi gian thi bo qua. */
function soSanh([mot, hai]) {
  const a = JSON.parse(readFileSync(mot, 'utf8'));
  const b = JSON.parse(readFileSync(hai, 'utf8'));
  const lech = [];
  if (a.commitGoc !== b.commitGoc) lech.push(`commit goc: ${a.commitGoc} / ${b.commitGoc}`);
  if (JSON.stringify([...a.fileDoi].sort()) !== JSON.stringify([...b.fileDoi].sort())) lech.push(`file doi: ${a.fileDoi.join(',')} / ${b.fileDoi.join(',')}`);
  for (const ten of Object.keys(a.thuoc)) {
    const x = a.thuoc[ten];
    const y = b.thuoc[ten];
    if (!y) { lech.push(`${ten}: chi co o ${mot}`); continue; }
    if (x.ma !== y.ma) lech.push(`${ten} ma thoat: ${String(x.ma)} / ${String(y.ma)}`);
    if (JSON.stringify(x.so) !== JSON.stringify(y.so)) lech.push(`${ten} so lieu: ${JSON.stringify(x.so)} / ${JSON.stringify(y.so)}`);
  }
  console.log(lech.length === 0 ? `KHOP: ${mot} = ${hai}` : `LECH (${String(lech.length)}):\n  ${lech.join('\n  ')}`);
  process.exit(lech.length === 0 ? 0 : 1);
}

const d = doiSo();
if (d.soSanh) soSanh(d.soSanh);
else kiem(d);
