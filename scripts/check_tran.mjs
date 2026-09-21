#!/usr/bin/env node
// Thuoc: tran hieu nang o `docs/TECH_SPEC.md` muc 2 phai co may doc, khong chi nam tren giay.
//
// VI SAO CO FILE NAY: do 21/09, bang tran muc 2 co tam dong so, ma CHI co mot dong
// (co ban build) bi may chan — `ci.yml`. `check:base` doc `dist/`, `khoi:dong` mo
// Chromium xem trang co chay khong; ca hai khong doc tran nao. So co ma khong co may
// bat thi den luc vuot khong ai biet, dung thu skill `constraint-driven-development`
// goi la mui hong: "A dimension was written into CONSTRAINTS.md with a number but no
// tool behind it".
//
// SO LAY TU `docs/TECH_SPEC.md`, khong go cung o day. Sua tran thi sua mot cho, thuoc
// doc lai ngay; go cung vao day la tu tao cho lech thu hai.
//
//   node scripts/check_tran.mjs
//
// Ba dong trong bang KHONG kiem tinh duoc, thuoc khai ra chu khong im:
//   - sprite dong moi khung: phai do tren may that (`?do=sprite`, `src/bench/DoSprite.ts`).
//     May ao ve bang phan mem, 1-5 fps -> so o day vo nghia.
//   - co ban build: `ci.yml` da chan, chay sau khi day.
//   - lenh ve moi khung: dem tinh duoc so LOP, xem muc "lenh ve" ben duoi.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const SPEC = 'docs/TECH_SPEC.md';

if (!existsSync(SPEC)) {
  console.log(`BO QUA: khong co ${SPEC}`);
  process.exit(0);
}

const spec = readFileSync(SPEC, 'utf8');

/**
 * Doc mot so tu bang tran. `nhan` la ten hang muc o cot dau, `mau` bat phan so o cot
 * thu hai. Khong thay thi HONG — bang doi ten ma thuoc im la thuoc vo dung.
 */
function tranTuSpec(nhan, mau) {
  const dong = spec.split('\n').find((d) => d.startsWith('|') && d.includes(nhan));
  if (dong === undefined) return { loi: `khong thay dong "${nhan}" trong bang ${SPEC} muc 2` };
  const khop = mau.exec(dong);
  if (khop === null) return { loi: `dong "${nhan}" co trong ${SPEC} nhung khong doc ra so` };
  return { so: Number(khop[1].replace(/\./g, '')) };
}

const hong = [];
const dat = [];
const boQua = [];

/** Bao mot muc hong, kem so do that de nguoi doc khoi phai tu chay lai. */
const bao = (ten, chiTiet) => hong.push(`${ten}: ${chiTiet}`);

// --- 1. Moi file .ts khong qua N dong ---------------------------------------
{
  const t = tranTuSpec('Mỗi file', /≤\s*([\d.]+)\s*dòng/);
  if (t.loi) bao('dong moi .ts', t.loi);
  else {
    const files = execFileSync('git', ['ls-files', '*.ts'], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
    const vuot = files
      .map((p) => ({ p, n: readFileSync(p, 'utf8').split('\n').length - 1 }))
      .filter((f) => f.n > t.so);
    if (vuot.length) bao('dong moi .ts', `${vuot.length} file vuot tran ${t.so}: ` +
      vuot.map((f) => `${f.p} (${f.n})`).join(', '));
    else dat.push(`moi .ts ≤ ${t.so} dong (${files.length} file)`);
  }
}

// --- 2. Thu vien do hoa ngoai --------------------------------------------------
// TECH_SPEC muc 4: bo ve WebGL tu viet. Tran la 0, nen phep do la `dependencies` rong.
// `devDependencies` khong tinh: vite, eslint, vitest khong di vao ban build.
{
  const t = tranTuSpec('Thư viện đồ hoạ ngoài', /\*\*(\d+)\*\*/);
  if (t.loi) bao('thu vien do hoa', t.loi);
  else {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const co = Object.keys(pkg.dependencies ?? {});
    if (co.length > t.so) bao('thu vien do hoa', `dependencies co ${co.length} muc, tran ${t.so}: ${co.join(', ')}`);
    else dat.push(`thu vien do hoa ngoai = ${co.length}`);
  }
}

// --- 3. Ti le diem anh bi kep ------------------------------------------------
// Tran ghi `min(dpr, 2)`. Kep nam o `Gl.datKichThuoc` — moi duong vao canvas di qua do.
{
  const dong = spec.split('\n').find((d) => d.startsWith('|') && d.includes('setPixelRatio'));
  const khop = dong === undefined ? null : /min\(dpr,\s*(\d+)\)/.exec(dong);
  if (khop === null) bao('ti le diem anh', `khong doc ra min(dpr, N) tu ${SPEC}`);
  else {
    const ma = readFileSync('src/render/Gl.ts', 'utf8');
    const re = new RegExp(`Math\\.min\\(\\s*dpr\\s*,\\s*${khop[1]}\\s*\\)`);
    if (!re.test(ma)) bao('ti le diem anh', `src/render/Gl.ts khong con Math.min(dpr, ${khop[1]})`);
    else dat.push(`ti le diem anh kep o min(dpr, ${khop[1]})`);
  }
}

// --- 4. Nhip mo phong ---------------------------------------------------------
{
  const t = tranTuSpec('Nhịp mô phỏng', /\*\*(\d+)\s*Hz\*\*/);
  if (t.loi) bao('nhip mo phong', t.loi);
  else {
    const ma = readFileSync('src/sim/Clock.ts', 'utf8');
    const khop = /NHIP_MOI_GIAY\s*=\s*(\d+)/.exec(ma);
    if (khop === null) bao('nhip mo phong', 'khong thay NHIP_MOI_GIAY trong src/sim/Clock.ts');
    else if (Number(khop[1]) !== t.so) bao('nhip mo phong', `Clock.ts ${khop[1]} Hz, TECH_SPEC ${t.so} Hz`);
    else dat.push(`nhip mo phong ${t.so} Hz`);
  }
}

// --- 5. Atlas trong bo nho cung luc -------------------------------------------
// Tran `≤ 4 × (2048×2048)`. Moi bo atlas nap nguyen bo, nen phep do la: moi file
// `public/atlas/*.json` khong qua N trang, va canh khong qua C.
{
  const dong = spec.split('\n').find((d) => d.startsWith('|') && d.includes('Atlas trong bộ nhớ'));
  const khop = dong === undefined ? null : /≤\s*(\d+)\s*×\s*\((\d+)×\d+\)/.exec(dong);
  if (khop === null) bao('atlas', `khong doc ra "≤ N × (C×C)" tu ${SPEC}`);
  else {
    const tranTrang = Number(khop[1]);
    const tranCanh = Number(khop[2]);
    const thuMuc = 'public/atlas';
    const ten = existsSync(thuMuc) ? readdirSync(thuMuc).filter((f) => f.endsWith('.json')) : [];
    if (ten.length === 0) boQua.push('atlas: khong co public/atlas/*.json');
    else {
      const xau = [];
      for (const f of ten) {
        const a = JSON.parse(readFileSync(`${thuMuc}/${f}`, 'utf8'));
        const soTrang = Array.isArray(a.trang) ? a.trang.length : 0;
        if (soTrang > tranTrang) xau.push(`${f} ${soTrang} trang`);
        if (Number(a.canh) > tranCanh) xau.push(`${f} canh ${String(a.canh)}`);
      }
      if (xau.length) bao('atlas', `vuot tran ${tranTrang} × (${tranCanh}×${tranCanh}): ${xau.join(', ')}`);
      else dat.push(`atlas ≤ ${tranTrang} × (${tranCanh}×${tranCanh}) (${ten.length} bo)`);
    }
  }
}

// --- 6. Lenh ve moi khung -----------------------------------------------------
// So lenh ve that chi dem duoc luc chay. Phan TINH dem duoc: moi lop ve la mot lan
// gom sprite roi mot `drawArrays`, nen SO LOP trong `Perf.LayerName` la chan tren cua
// so lenh ve. Them mot lop la them mot lenh ve — thuoc bat dung luc do.
{
  const t = tranTuSpec('Lệnh vẽ mỗi khung hình', /\*\*≤\s*(\d+)\*\*/);
  if (t.loi) bao('lenh ve', t.loi);
  else {
    const ma = readFileSync('src/core/Perf.ts', 'utf8');
    const khop = /export type LayerName\s*=\s*([^;]+);/.exec(ma);
    if (khop === null) bao('lenh ve', 'khong thay LayerName trong src/core/Perf.ts');
    else {
      const soLop = (khop[1].match(/'/g) ?? []).length / 2;
      if (soLop > t.so) bao('lenh ve', `${soLop} lop ve, tran ${t.so} lenh/khung`);
      else dat.push(`${soLop} lop ve ≤ ${t.so} lenh/khung`);
    }
  }
}

// --- Hai dong khai thang la khong kiem duoc o day -----------------------------
boQua.push('sprite dong moi khung: phai do tren may that — `?do=sprite`');
boQua.push('co ban build: `ci.yml` chan sau khi day');

// --- Bao cao ------------------------------------------------------------------
for (const d of dat) console.log(`  DAT   ${d}`);
for (const d of boQua) console.log(`  BO QUA ${d}`);
for (const d of hong) console.log(`  HONG  ${d}`);
console.log(`So do: ${dat.length}/${dat.length + hong.length} tran co may doc, ${boQua.length} khai BO QUA`);
if (hong.length) process.exit(1);
