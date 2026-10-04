#!/usr/bin/env node
/**
 * Soi giao dien DOM cua game o kho man iPhone that (doc + ngang), bao loi do duoc bang may.
 *
 * VI SAO CAN: `chup_man` chi chup anh, `khoi:dong` chi xem trang co chay. Loi "tieu de xuong
 * hai dong day hang nut ra ngoai man iPhone" (PHASE_10B, anh bao 26/09 "khong thay tran co")
 * khong thuoc nao bat — phai doi anh mo may that moi biet.
 *
 * Phep do chep y tu `probe.mjs` cua evondev/evondevKit (MIT, Copyright (c) evondev,
 * https://github.com/evondev/evondevKit, `skills/ui-ux/scripts/probe.mjs` muc 1, 1b, 1c, 5),
 * viet lai gon cho game: man choi khong bao gio duoc cuon, moi nut phai nam tron trong man.
 *
 *   1. trang cuon duoc (ngang hay doc)
 *   2. nut nam mot phan ngoai man
 *   3. nut bi phan tu khac de len giua nut (bam khong toi)
 *   4. nhan nut ngan xuong hai dong
 *   5. chu bi khung giau (overflow hidden / ellipsis cat mat chu)
 *
 * Dung: `npm run soi:giao-dien` (tu build neu chua co `dist/`, tu bat va tat may chu xem).
 * `MAN_SOI=?tran=1` chi soi mot man. Thoat ma 1 khi co loi.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { TrinhDuyet } from '../tools/lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const CONG = Number(process.env.CONG ?? 4175);
const GOC = '/quoc-chien/';
const HAN_NAP = Number(process.env.HAN_NAP ?? 30000);
// Kho man iPhone 16 Pro, cung so voi `chup_man.mjs`: doc la cach anh cam may that.
const KHO = [
  { ten: 'doc', rong: 393, cao: 852 },
  { ten: 'ngang', rong: 874, cao: 402 },
];
const MAN = process.env.MAN_SOI ? [process.env.MAN_SOI] : ['', '?man=ban-do', '?tran=1', '?tran=2'];

if (!existsSync('dist/index.html')) {
  console.error('HONG: chua co dist/index.html — chay `npm run build` truoc.');
  process.exit(1);
}

const nghi = (ms) => new Promise((r) => setTimeout(r, ms));
const diaChi = (duong) => `http://127.0.0.1:${CONG}${GOC}${duong}`;

// Chay trong trang voi `goc` la vung soi (CSS selector). Tra mang loi { loai, the, chu, so }.
// The quyet dinh (`.the-quyet-dinh`) la tam chan co y: game dung luc the hien, nen phan
// nam duoi no KHONG tinh la bi de — soi the rieng, roi dong the va soi phan con lai.
const soi = (goc) => `((gocSoi) => {
  const W = innerWidth, H = innerHeight, loi = [];
  const goc = document.querySelector(gocSoi);
  if (!goc) return loi;
  const ten = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).join('.') : '');
  const chu = (el) => (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
  const hien = (el) => {
    if (el.closest('[hidden]')) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Khung cuon gan nhat chua el (overflow auto/scroll va dang tran) — nut trong do keo toi duoc.
  const khungCuon = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY + s.overflowX) && (p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1)) return p;
    }
    return null;
  };
  const NUT = 'button, a[href], input, select, textarea, [role=button]';
  const nut = [...goc.querySelectorAll(NUT)].filter(hien);
  for (const el of nut) {
    const r = el.getBoundingClientRect();
    const kc = khungCuon(el);
    if (!kc && (r.right <= 0 || r.bottom <= 0 || r.left >= W || r.top >= H)) continue; // nam han ngoai man la co y
    if (kc) {
      const k = kc.getBoundingClientRect();
      if (r.top >= k.bottom - 1 || r.bottom <= k.top + 1) loi.push({ loai: 'nut-khuat-trong-khung-cuon', the: ten(el), chu: chu(el), so: Math.round(r.top - k.bottom) });
      continue; // nut trong khung cuon: phan ngoai man la phan cuon toi duoc, khong tinh ngoai man / bi de
    }
    const tran = Math.max(-r.left, -r.top, r.right - W, r.bottom - H);
    if (tran > 1) loi.push({ loai: 'nut-ngoai-man', the: ten(el), chu: chu(el), so: Math.round(tran) });
    const cx = Math.min(Math.max(r.left + r.width / 2, 0), W - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), H - 1);
    const tren = document.elementFromPoint(cx, cy);
    if (tren && tren !== el && !el.contains(tren) && !tren.contains(el)) {
      loi.push({ loai: 'nut-bi-de', the: ten(el), chu: chu(el) + ' <- ' + ten(tren), so: 0 });
    }
    const nhan = chu(el);
    if (nhan && nhan.length <= 24 && el.tagName !== 'TEXTAREA') {
      const rg = document.createRange(); rg.selectNodeContents(el);
      const dong = new Set([...rg.getClientRects()].filter((q) => q.width > 0).map((q) => Math.round(q.top)));
      if (dong.size > 1) loi.push({ loai: 'nhan-nut-xuong-dong', the: ten(el), chu: nhan, so: dong.size });
    }
  }
  // Nut chong nut: hai nut giao nhau mot phan (diem giua van trong nen phep "bi de" lot).
  for (let i = 0; i < nut.length; i += 1) {
    for (let j = i + 1; j < nut.length; j += 1) {
      const a = nut[i], b = nut[j];
      if (a.contains(b) || b.contains(a) || khungCuon(a) || khungCuon(b)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x1 = Math.max(ra.left, rb.left), x2 = Math.min(ra.right, rb.right);
      const y1 = Math.max(ra.top, rb.top), y2 = Math.min(ra.bottom, rb.bottom);
      if (x2 - x1 >= 2 && y2 - y1 >= 2) {
        loi.push({ loai: 'nut-chong-nut', the: ten(a) + ' + ' + ten(b), chu: chu(a) + ' + ' + chu(b), so: Math.round(Math.min(x2 - x1, y2 - y1)) });
      }
    }
  }
  for (const el of goc.querySelectorAll('*')) {
    if (!hien(el) || el.children.length > 0 || !el.textContent.trim()) continue;
    const s = getComputedStyle(el);
    const giauNgang = ['hidden', 'clip'].includes(s.overflowX) || s.textOverflow === 'ellipsis';
    const giauDoc = ['hidden', 'clip'].includes(s.overflowY);
    if ((giauNgang && el.scrollWidth > el.clientWidth + 1) || (giauDoc && el.scrollHeight > el.clientHeight + 1)) {
      loi.push({ loai: 'chu-bi-giau', the: ten(el), chu: chu(el), so: Math.max(el.scrollWidth - el.clientWidth, el.scrollHeight - el.clientHeight) });
    }
  }
  // Chu bi nut de: di tung doan chu (ke ca chu nam lan voi the con), lay phan giao giua tung
  // dong chu voi tung nut; giua phan giao ma nut nam tren thi chu bi che. Lay diem giua dong
  // thi lot duoi dong bi de (do 04/10: "5 tinh · gio 0" chui duoi nut "Ngoai giao").
  const nutTatCa = [...document.querySelectorAll(NUT)].filter(hien).map((b) => ({ b, r: b.getBoundingClientRect() }));
  const di = document.createTreeWalker(goc, NodeFilter.SHOW_TEXT);
  const daBao = new Set();
  for (let n = di.nextNode(); n; n = di.nextNode()) {
    const cha = n.parentElement;
    // Nhan ten tinh (.nhan-tinh) troi theo ban do khi keo: nam duoi nut mot luc la binh thuong.
    if (!n.textContent.trim() || !cha || daBao.has(cha) || !hien(cha) || cha.closest(NUT) || cha.closest('.nhan-tinh') || khungCuon(cha)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const q of rg.getClientRects()) {
      if (q.width < 2 || q.right <= 0 || q.left >= W || q.bottom <= 0 || q.top >= H) continue;
      for (const { b, r } of nutTatCa) {
        if (b.contains(cha)) continue;
        const x1 = Math.max(q.left, r.left), x2 = Math.min(q.right, r.right);
        const y1 = Math.max(q.top, r.top), y2 = Math.min(q.bottom, r.bottom);
        if (x2 - x1 < 2 || y2 - y1 < 2) continue;
        const tren = document.elementFromPoint((x1 + x2) / 2, (y1 + y2) / 2);
        if (tren && b.contains(tren)) {
          loi.push({ loai: 'chu-bi-nut-de', the: ten(cha), chu: n.textContent.trim().slice(0, 30) + ' <- ' + ten(b) + ' "' + chu(b) + '"', so: Math.round(x2 - x1) });
          daBao.add(cha);
          break;
        }
      }
      if (daBao.has(cha)) break;
    }
  }
  return loi;
})(${JSON.stringify(goc)})`;

// Trang con cuon duoc khong — do tren ca trang, khong theo vung.
const CUON = `(() => {
  const de = document.documentElement, loi = [];
  if (de.scrollWidth > innerWidth + 1) loi.push({ loai: 'cuon-ngang', the: 'html', chu: '', so: de.scrollWidth - innerWidth });
  if (de.scrollHeight > innerHeight + 1) loi.push({ loai: 'cuon-doc', the: 'html', chu: '', so: de.scrollHeight - innerHeight });
  return loi;
})()`;
const THE_MO = "!!document.querySelector('.the-quyet-dinh:not([hidden])')";
// Dong the bang cach bam lua chon dau con bam duoc — nhu nguoi choi that.
const DONG_THE = "document.querySelector('.the-quyet-dinh:not([hidden]) .the-nut button:not([disabled])')?.click()";

const mayChu = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(CONG), '--strictPort'], { stdio: 'ignore' });
const td = new TrinhDuyet(CHROMIUM, 9225);
const tatCa = [];
const anh = [];
const THU_MUC_ANH = 'anh_chup';
// `CHUP=1`: chup ca khi sach (anh truoc/sau mot lan sua) — mac dinh chi chup khi co loi.
const LUON_CHUP = process.env.CHUP === '1';
/** @param {string} duoi @returns {Promise<void>} */
async function chupLai(duoi) {
  mkdirSync(THU_MUC_ANH, { recursive: true });
  const tep = `${THU_MUC_ANH}/soi_${duoi.replace(/[^a-z0-9-]+/gi, '_')}.png`;
  writeFileSync(tep, await td.chup());
  anh.push(tep);
}
const batDau = Date.now();
try {
  let len = false;
  for (let i = 0; i < 60 && !len; i += 1) {
    try { len = (await fetch(diaChi(''))).ok; } catch { /* may chu chua len — vong nay la cach biet */ }
    if (!len) await nghi(500);
  }
  if (!len) throw new Error(`vite preview khong tra loi o ${diaChi('')}`);
  await td.mo();
  for (const kho of KHO) {
    await td.datManHinh(kho.rong, kho.cao, 1);
    for (const man of MAN) {
      await td.moTrang(diaChi(man));
      // Trang game: cho canvas va het chu "Dang nap". Trang khung (ban duyet boc iframe): cho tai xong.
      const xong = await td.choDen("document.querySelector('#app') === null ? document.readyState === 'complete' : document.querySelector('#app canvas') !== null && document.querySelector('.dang-nap') === null", HAN_NAP);
      if (!xong) { tatCa.push({ kho: kho.ten, man, loai: 'nap-khong-xong', the: '', chu: '', so: HAN_NAP }); continue; }
      await nghi(1500);
      const loi = [...(/** @type {any[]} */ (await td.doc(CUON)) ?? [])];
      // Toi da 3 the lien nhau (dong mot the co the bat the khac) — moi the soi rieng.
      for (let i = 0; i < 3 && (await td.doc(THE_MO)) === true; i += 1) {
        const loiThe = (await td.doc(soi('.the-quyet-dinh:not([hidden])'))) ?? [];
        if (loiThe.length > 0 || (LUON_CHUP && i === 0)) await chupLai(`${kho.ten}_${man || 'thanh-pho'}_the`);
        loi.push(...loiThe);
        await td.doc(DONG_THE);
        await nghi(600);
      }
      loi.push(...((await td.doc(soi('body'))) ?? []));
      for (const l of loi) tatCa.push({ kho: kho.ten, man: man || '(thanh pho)', ...l });
      // Co loi thi chup kem de nguoi xem doi chieu — may chi bat chu, mat nguoi moi chot.
      if (loi.length > 0 || LUON_CHUP) await chupLai(`${kho.ten}_${man || 'thanh-pho'}`);
    }
  }
} finally {
  await td.dong();
  mayChu.kill();
}

const giay = ((Date.now() - batDau) / 1000).toFixed(1);
if (tatCa.length === 0) {
  console.log(`soi giao dien: sach — ${MAN.length} man x ${KHO.length} kho, ${giay} giay`);
  if (anh.length > 0) console.log(`  Anh: ${anh.join(' ')}`);
  process.exit(0);
}
console.error(`HONG: ${tatCa.length} loi giao dien (${MAN.length} man x ${KHO.length} kho, ${giay} giay)`);
for (const l of tatCa) console.error(`  [${l.kho}] ${l.man} ${l.loai}: ${l.the} "${l.chu}" (${l.so})`);
if (anh.length > 0) console.error(`  Anh doi chieu: ${anh.join(' ')}`);
process.exit(1);
