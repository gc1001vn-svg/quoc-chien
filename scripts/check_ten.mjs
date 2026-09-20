#!/usr/bin/env node
// Thuoc: cam dat ten bang an du. Goi dung thu co that.
//
// Vi sao co thuoc nay: ten an du doc thi keu ma khong noi duoc no LAM GI, nen
// nguoi sau phai mo ma ra doc moi hieu — dung thu ma tai lieu sinh ra de tranh.
// Luat chep tu `Human-Agent-Society/reef` (Apache-2.0), muc "Naming and
// terminology": ho cam dung `ledger` `sidecar` `provenance` `evidence` `gate`
// `verdict` va bat dung `check` `validation` `evaluation` `result` `metadata`
// `record` thay vao.
//
// Chi quet DINH DANH trong ma: comment va chuoi bi go bo truoc khi tim, vi
// comment cua repo nay viet tieng Viet va co quyen nhac ten bi cam de giai thich.
//
// Chay: `node scripts/check_ten.mjs`

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

/** Tu bi cam -> thay bang gi. */
const CAM = new Map([
  ['gate', 'check / validation'],
  ['verdict', 'result / review_result'],
  ['ledger', 'record / metadata'],
  ['sidecar', 'ten dung cua tien trinh do'],
  ['provenance', 'source_info / metadata'],
  ['evidence', 'validation_result / record'],
]);

/** File tu ke cac tu tren — bo qua, khong thi thuoc tu bao chinh no. */
const BO_QUA = new Set(['scripts/check_ten.mjs', 'AGENTS.md']);

const DUOI = /\.(ts|tsx|mjs|js)$/;

/** Go comment va chuoi, de chi con dinh danh. */
function chiDinhDanh(ma) {
  return ma
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
}

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter((p) => p && DUOI.test(p) && !BO_QUA.has(p) && !p.startsWith('node_modules/'));

const dinh = [];
for (const p of files) {
  const ma = chiDinhDanh(readFileSync(p, 'utf8'));
  const dong = ma.split('\n');
  for (const [tu, thay] of CAM) {
    // Bat ca `gate`, `Gate`, `payGate`, `gate_id` — ranh gioi camelCase va snake_case.
    const re = new RegExp(`(^|[^A-Za-z])${tu}([^A-Za-z]|$)|[a-z]${tu[0].toUpperCase()}${tu.slice(1)}`, 'i');
    dong.forEach((d, i) => {
      if (re.test(d)) dinh.push({ p, dong: i + 1, tu, thay, ma: d.trim().slice(0, 80) });
    });
  }
}

console.log(`quet ${files.length} file ma, ${CAM.size} tu bi cam`);

if (dinh.length) {
  console.error(
    'HONG: co ten an du trong ma:\n' +
      dinh.map((d) => `  ${d.p}:${d.dong}  "${d.tu}" -> dung ${d.thay}\n    ${d.ma}`).join('\n'),
  );
  process.exit(1);
}
