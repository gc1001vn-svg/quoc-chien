#!/usr/bin/env node
/**
 * Cho Chromium trong may ao ra duoc Internet. CHAY LAI MOI PHIEN.
 *
 * VI SAO CAN. Moi request HTTPS cua phien di qua proxy cua Claude Code; proxy cat TLS ra
 * roi noi lai bang chung chi cua chinh no. Moi cong cu phai tin CA o
 * `/root/.ccr/ca-bundle.crt`. `curl` va Node da duoc dat san, NHUNG CHROMIUM THI CHUA:
 * README cua proxy viet "the browser NSS store ... already set up" — do 15/09 thi kho NSS
 * **RONG HOAN TOAN**, khong co chung chi nao. Hau qua: moi trang ngoai deu
 * `net::ERR_CERT_AUTHORITY_INVALID`, va `tools/lib/cdp.mjs` chi mo duoc file cuc bo.
 * Thuoc `khoi:dong` van xanh vi no chi mo ban build trong may — khong ai phat hien ra.
 *
 * Sau khi chay: do 15/09, Chromium mo duoc `kenney.nl` `polyhaven.com` `itch.io`
 * `quaternius.com` — 4/4.
 *
 * CHU DU AN PHAI DOI CHE DO QUYEN TRUOC. O che do `Auto`, `apt-get update` bi bo loc
 * chan `[Containment Escape]` **du da co luat trong `.claude/settings.json`** — do 15/09,
 * ba bien the deu chan. Doi sang `Accept edits` o nut che do canh o soan tin thi qua.
 * Bang day du sau cach da thu: `docs/DAU_PHIEN.md`.
 *
 * KHONG lam yeu TLS. No them dung mot CA — cua chinh proxy phien nay — vao kho tin cay
 * cua trinh duyet. Dung cach ma README cua proxy doi. Tuyet doi khong dung
 * `--ignore-certificate-errors*`.
 *
 * Dung:
 *   npm run mo:mang
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const CA = '/root/.ccr/agent-proxy-ca.crt';
const KHO = `sql:${process.env.HOME}/.pki/nssdb`;
/** Ten trong kho NSS. Trung ten thi `certutil -A` ghi de, nen chay lai nhieu lan van duoc. */
const TEN = 'ccr-agent-proxy';

function chay(lenh, thamSo) {
  return execFileSync(lenh, thamSo, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

if (!existsSync(CA)) {
  console.error(`Khong thay ${CA}. May ao nay khong dung proxy cua Claude Code?`);
  process.exit(1);
}

// `certutil -H` in trang giup roi thoat MA 1, nen khong dung no de kiem co hay khong.
// `-L` tren kho that thoat 0 khi certutil ton tai, ke ca khi kho rong.
let coCertutil = true;
try {
  chay('certutil', ['-d', KHO, '-L']);
} catch {
  coCertutil = false;
}

if (!coCertutil) {
  console.log('Chua co certutil, dang cai libnss3-tools...');
  // `apt-get update` BAT BUOC: danh muc goi trong anh may ao cu hon kho Ubuntu, cai thang
  // thi hong o `404 Not Found` vi so hieu ban da doi. Do 15/09.
  chay('apt-get', ['update']);
  chay('apt-get', ['install', '-y', 'libnss3-tools']);
}

const truoc = chay('certutil', ['-d', KHO, '-L']);
if (truoc.includes(TEN)) {
  console.log(`${TEN}: da co trong kho NSS, khong doi gi`);
} else {
  chay('certutil', ['-d', KHO, '-A', '-t', 'C,,', '-n', TEN, '-i', CA]);
  console.log(`${TEN}: da them vao kho NSS`);
}

console.log(chay('certutil', ['-d', KHO, '-L']).trim());
