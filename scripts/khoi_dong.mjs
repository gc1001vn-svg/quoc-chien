#!/usr/bin/env node
/**
 * Thuoc KHOI DONG: mo ban da build bang Chromium that, hong neu trang khong chay.
 *
 * VI SAO CAN, va vi sao KHONG phai `check:base` hay buoc curl trong CI:
 *   - `check:base` doc file trong `dist/`, khong chay dong nao.
 *   - Buoc "Kiem trang da len" trong `deploy.yml` curl bon duong, doi HTTP 200. Mot
 *     trang trang tinh cung tra 200: file CO, nhung JS nem loi luc khoi dong, hay mot
 *     atlas 404 thi curl van xanh. Bon thu do chi trinh duyet that moi thay.
 *   - Thuoc nay chay TRUOC khi day, tren may ao. Buoc curl chay SAU khi day, tren CI.
 *     Hai cai bat hai loai hong khac nhau, khong thay nhau duoc.
 *
 * Hong khi thay bat ky cai nao:
 *   1. ngoai le chua bat (`Runtime.exceptionThrown`)
 *   2. `console.error` trong trang
 *   3. file tra ve tu HTTP 400 tro len, hoac tai hong o tang mang — atlas thieu,
 *      duong dan goc sai
 *   4. `#app canvas` khong hien sau han cho
 *
 * Dung: `npm run khoi:dong` (tu build neu chua co `dist/`, tu bat va tat may chu xem).
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { TrinhDuyet } from '../tools/lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const CONG = Number(process.env.CONG ?? 4174);
const HAN_CANVAS = Number(process.env.HAN_CANVAS ?? 20000);
// Cho them vai khung hinh sau khi canvas hien: loi luc ve khung dau khong kip bao
// truoc khi minh doc so su kien.
const CHO_VE = Number(process.env.CHO_VE ?? 3000);

if (!existsSync('dist/index.html')) {
  console.error('HONG: chua co dist/index.html — chay `npm run build` truoc.');
  process.exit(1);
}

/** @param {string} duong @returns {string} Dia chi day du, co duong dan goc. */
const diaChi = (duong) => `http://127.0.0.1:${CONG}${duong}`;

// Doc duong dan goc tu chinh ban da build: `check:base` da doi chieu no voi
// `vite.config.ts`, nen o day chi can dung lai, khong doc lai cau hinh lan hai.
const goc = process.env.GOC_THU ?? '/quoc-chien/';

const mayChu = spawn(
  'npx',
  ['vite', 'preview', '--host', '127.0.0.1', '--port', String(CONG), '--strictPort'],
  { stdio: 'ignore' },
);

/** @returns {Promise<void>} */
const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

/** @returns {Promise<boolean>} May chu xem da tra loi chua. */
async function choMayChu() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const tra = await fetch(diaChi(goc));
      if (tra.ok) return true;
    } catch { /* chua len, thu lai — vong lap nay la cach duy nhat biet no len chua */ }
    await nghi(500);
  }
  return false;
}

const loi = [];
const td = new TrinhDuyet(CHROMIUM, 9224);
try {
  if (!(await choMayChu())) {
    console.error(`HONG: vite preview khong tra loi o ${diaChi(goc)} sau 30 giay.`);
    process.exit(1);
  }

  await td.mo();
  await td.batMang();
  await td.datManHinh(874, 402, 2);
  await td.moTrang(diaChi(goc));

  const coCanvas = await td.choDen("document.querySelector('#app canvas') !== null", HAN_CANVAS);
  if (!coCanvas) loi.push(`#app canvas khong hien sau ${HAN_CANVAS / 1000} giay`);
  await nghi(CHO_VE);

  for (const sk of td.suKien) {
    if (sk.ten === 'Runtime.exceptionThrown') {
      const ct = sk.tham?.exceptionDetails;
      loi.push(`ngoai le: ${ct?.exception?.description ?? ct?.text ?? '(khong ro)'}`);
    } else if (sk.ten === 'Runtime.consoleAPICalled' && sk.tham?.type === 'error') {
      const chu = (sk.tham.args ?? [])
        .map((a) => a.description ?? String(a.value ?? ''))
        .join(' ');
      loi.push(`console.error: ${chu}`);
    } else if (sk.ten === 'Network.responseReceived') {
      const tra = sk.tham?.response;
      if (typeof tra?.status === 'number' && tra.status >= 400) {
        loi.push(`HTTP ${tra.status}: ${tra.url}`);
      }
    } else if (sk.ten === 'Network.loadingFailed') {
      // `Failed to fetch` cua service worker luc cai dat khong phai hong that.
      if (sk.tham?.canceled !== true) {
        loi.push(`tai hong (${sk.tham?.type}): ${sk.tham?.errorText}`);
      }
    }
  }
} finally {
  await td.dong();
  mayChu.kill();
}

if (loi.length > 0) {
  console.error(`HONG: trang khoi dong co ${loi.length} loi`);
  for (const d of loi) console.error(`  - ${d}`);
  console.error('  Khong day len khi thuoc nay do — trang tra 200 van co the la trang trang.');
  process.exit(1);
}

console.log(`khoi dong: sach — canvas hien, khong ngoai le, khong console.error, khong file tai hong`);
