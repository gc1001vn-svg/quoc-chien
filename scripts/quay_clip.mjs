#!/usr/bin/env node
/**
 * Quay clip game dang chay (mac dinh 15 giay, kho iPhone cam doc) ra MP4 cho anh xem tren
 * iPhone ma khong phai mo game.
 *
 * VI SAO CAN: anh chup chi ra mot khoanh khac — tran danh, hieu ung, hoat canh xay nha thi
 * phai xem chuyen dong. Y tu `htdt/godogen` (MIT): "chua thay game chay thi ket thuc bang
 * clip 15–20 giay, tu xem lai truoc khi bao xong".
 *
 * Do 04/10 (may ao ve bang phan mem, DPR 1): tran 59 khung/s, thanh pho 18 khung/s; clip
 * 15 giay 150–400 KB, ma hoa ~3,5 giay. **Do muot trong clip la cua may ao, khong phai fps
 * iPhone** — fps that van doi anh do. DPR 2 thi thanh pho tut con 5 khung/s.
 *
 * Dung (tu build neu chua co `dist/`, tu bat va tat may chu xem):
 *   npm run quay -- "?tran=1" "×4"          # duong dan them, nut toc do bam truoc khi quay
 *   npm run quay -- "" "10×" 20              # thanh pho, 10×, 20 giay
 *   MAN=ngang npm run quay -- "?tran=2"
 * Ra: `anh_chup/clip_<ten>.mp4` (H.264, phat duoc tren iPhone). Gui anh bang SendUserFile.
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TrinhDuyet } from '../tools/lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const CONG = Number(process.env.CONG ?? 4179);
const GOC = '/quoc-chien/';
const NGANG = process.env.MAN === 'ngang';
const RONG = NGANG ? 874 : 393;
const CAO = NGANG ? 402 : 852;
const [duongThem = '', nutTocDo = '', giayChu = '15'] = process.argv.slice(2);
const GIAY = Number(giayChu);
const THU_MUC = 'anh_chup';

if (!existsSync('dist/index.html')) execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });

const nghi = (ms) => new Promise((r) => setTimeout(r, ms));
const diaChi = `http://127.0.0.1:${CONG}${GOC}${duongThem}`;
const tam = mkdtempSync(join(tmpdir(), 'clip-'));
const tenTep = (i) => join(tam, `k${String(i).padStart(5, '0')}.jpg`);
/** Dau thoi gian that (giay) cua tung khung, theo Chromium — phat lai dung nhip that. */
const moc = [];

const mayChu = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(CONG), '--strictPort'], { stdio: 'ignore' });
const td = new TrinhDuyet(CHROMIUM, 9229);
td.nghe = (ten, tham) => {
  if (ten !== 'Page.screencastFrame') return;
  writeFileSync(tenTep(moc.length), Buffer.from(tham.data, 'base64'));
  moc.push(tham.metadata.timestamp);
  // Khong tra loi thi Chromium ngung gui khung.
  td.goi('Page.screencastFrameAck', { sessionId: tham.sessionId }).catch(() => { /* trang da dong — bo qua */ });
};

try {
  let len = false;
  for (let i = 0; i < 60 && !len; i += 1) {
    try { len = (await fetch(diaChi)).ok; } catch { /* may chu chua len — vong nay la cach biet */ }
    if (!len) await nghi(500);
  }
  if (!len) throw new Error(`vite preview khong tra loi o ${diaChi}`);
  await td.mo();
  await td.datManHinh(RONG, CAO, 1);
  await td.moTrang(diaChi);
  const xong = await td.choDen("document.querySelector('#app[data-da-ve]') !== null", 30000);
  if (!xong) throw new Error('game chua ve xong khung dau sau 30 giay');
  // The quyet dinh dau van che nua duoi man: bam lua chon dau nhu nguoi choi that.
  await td.doc("document.querySelector('.the-quyet-dinh:not([hidden]) .the-nut button:not([disabled])')?.click()");
  if (nutTocDo) {
    const bam = await td.doc(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.innerText.trim() === ${JSON.stringify(nutTocDo)}); b?.click(); return !!b; })()`);
    if (!bam) console.warn(`Canh bao: khong thay nut "${nutTocDo}", quay o toc do mac dinh.`);
  }
  await td.goi('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: RONG, maxHeight: CAO, everyNthFrame: 1 });
  await nghi(GIAY * 1000);
  await td.goi('Page.stopScreencast');
  console.log(`Trang thai cuoi clip: ${JSON.stringify(await td.doc('window.__qc?.trangThai()'))}`);
} finally {
  await td.dong();
  mayChu.kill();
}

if (moc.length < 2) {
  console.error(`HONG: chi nhan ${moc.length} khung — trang khong ve gi?`);
  process.exit(1);
}
// Danh sach cho ffmpeg concat: moi khung dung den khung sau, khung cuoi lap lai mot lan
// (dac ta concat: dong `duration` cua tep cuoi chi co hieu luc khi tep do duoc nhac lai).
const ds = moc.map((t, i) => `file '${tenTep(i)}'\nduration ${((moc[i + 1] ?? t + 0.1) - t).toFixed(4)}`);
ds.push(`file '${tenTep(moc.length - 1)}'`);
writeFileSync(join(tam, 'ds.txt'), `${ds.join('\n')}\n`);
mkdirSync(THU_MUC, { recursive: true });
const ra = join(THU_MUC, `clip_${duongThem.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'thanh-pho'}${NGANG ? '_ngang' : ''}.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tam, 'ds.txt'),
  '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-crf', '28', ra]);
rmSync(tam, { recursive: true, force: true });
const khungGiay = (moc.length / ((moc.at(-1) - moc[0]) || 1)).toFixed(1);
console.log(`Da quay: ${ra} (${(statSync(ra).size / 1024).toFixed(0)} KB, ${GIAY} giay, ${moc.length} khung = ${khungGiay} khung/s may ao)`);
process.exit(0);
