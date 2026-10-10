#!/usr/bin/env node
/**
 * Hai phep do cho `docs/ART_BIBLE.md`. Chi in so, khong ve gi.
 *
 *   node tools/do_hinh.mjs mau <anh.png> [rong:cao:x:y]   do sang, bao hoa, do am, 6 mau chinh cua mot canh
 *   node tools/do_hinh.mjs tay-ve [me ...]                dem tay ve trong tung me `tools/me/*.json`
 *
 * VI SAO CAN: art bible dat luat bang so ("canh khong toi hon ...", "moi me toi da ... tay
 * ve"). So go tay vao tai lieu thi sai dan; so phai sinh tu lenh de phien sau do lai duoc.
 *
 * `mau` can ffmpeg - may ao KHONG co san: `apt-get update && apt-get install -y ffmpeg`.
 * Anh thu ve 64x64 roi gom 6 cum (k-means): du min de so huong giua hai canh, khong du de
 * lam bang mau tuyet doi. Khung cat phai bo chu, nut, hop thoai - khong thi do nham giao dien.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';

const [lenh, ...thamSo] = process.argv.slice(2);

/** Do sang cam nhan (Rec. 709), 0..1. */
const doSang = (v) => (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255;
/** Bao hoa kieu HSV, 0..1. */
const baoHoa = (v) => { const lon = Math.max(...v); return lon ? (lon - Math.min(...v)) / lon : 0; };
const hex = (v) => '#' + v.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

function doMau(anh, cat) {
  const loc = (cat ? `crop=${cat},` : '') + 'scale=64:64:flags=area';
  let tho;
  try {
    tho = execFileSync('ffmpeg', ['-v', 'error', '-i', anh, '-vf', loc, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
      { maxBuffer: 1 << 20 });
  } catch (loi) {
    console.error(`khong doc duoc anh bang ffmpeg (${loi.code ?? loi.status}). Chua cai thi: apt-get update && apt-get install -y ffmpeg`);
    process.exit(1);
  }
  const diem = [];
  for (let i = 0; i + 2 < tho.length; i += 3) diem.push([tho[i], tho[i + 1], tho[i + 2]]);
  // Khoi tao theo thu tu do sang de hai lan chay cung anh ra cung so.
  const theoSang = [...diem].sort((a, b) => doSang(a) - doSang(b));
  const K = 6;
  let tam = Array.from({ length: K }, (_, j) => theoSang[Math.floor(((j + 0.5) * theoSang.length) / K)].slice());
  const cum = new Array(diem.length).fill(0);
  for (let vong = 0; vong < 30; vong++) {
    diem.forEach((d, i) => {
      let tot = 0;
      let xa = Infinity;
      tam.forEach((t, j) => {
        const k = (d[0] - t[0]) ** 2 + (d[1] - t[1]) ** 2 + (d[2] - t[2]) ** 2;
        if (k < xa) { xa = k; tot = j; }
      });
      cum[i] = tot;
    });
    const tong = Array.from({ length: K }, () => [0, 0, 0, 0]);
    diem.forEach((d, i) => { const t = tong[cum[i]]; t[0] += d[0]; t[1] += d[1]; t[2] += d[2]; t[3]++; });
    tam = tong.map((t, j) => (t[3] ? [t[0] / t[3], t[1] / t[3], t[2] / t[3]] : tam[j]));
  }
  const dem = new Array(K).fill(0);
  cum.forEach((c) => dem[c]++);
  const tb = (f) => diem.reduce((s, d) => s + f(d), 0) / diem.length;
  // Do am: do lech do - lam TB, am la nghieng vang cam, duong cang lon cang am.
  const doAm = (d) => (d[0] - d[2]) / 255;
  console.log(`do sang TB ${tb(doSang).toFixed(2)} · bao hoa TB ${tb(baoHoa).toFixed(2)} · do am TB ${tb(doAm).toFixed(2)}`);
  console.log(tam.map((t, j) => ({ t, ti: dem[j] / diem.length }))
    .sort((a, b) => b.ti - a.ti)
    .map(({ t, ti }) => `${hex(t)} ${(ti * 100).toFixed(0)}%`).join(' · '));
}

/**
 * Tay ve cua mot thu muc trong `assets_source/`. Khong doan: thu muc la thi in `?`.
 * Icosa moi model mot tac gia, tra trong hai bang ke do may sinh.
 */
function tacGia(thuMuc, maIcosa, bangIcosa) {
  if (thuMuc === 'icosa') {
    const m = bangIcosa.match(new RegExp('`' + maIcosa.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + '/[^`]*` \\| ([^|]+)'));
    return 'Icosa: ' + (m ? m[1].trim() : '?');
  }
  if (/^kaykit/.test(thuMuc)) return 'KayKit';
  if (/megakit|^universal-(base-characters|animation-library)$|^modular-character-outfits|^lowpoly-animated-animals$|^medieval-weapons$|^animals$|^ultimatefantasyrts$|^farmbuildings$|^farmanimal$/.test(thuMuc)) return 'Quaternius';
  if (/-kit$|^city-kit-|^mini-characters$|^modular-buildings$/.test(thuMuc)) return 'Kenney';
  return '? ' + thuMuc;
}

function demTayVe(danhSach) {
  const bangIcosa = ['docs/KHO_ICOSA.md', 'docs/KHO_ASSET.md'].map((f) => readFileSync(f, 'utf8')).join('\n');
  const me = danhSach.length ? danhSach
    : readdirSync('tools/me').filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
  for (const ten of me) {
    const tay = new Set();
    const duyet = (o) => {
      if (Array.isArray(o)) { o.forEach(duyet); return; }
      if (!o || typeof o !== 'object') return;
      for (const [k, v] of Object.entries(o)) {
        if (k === 'duong' && typeof v === 'string' && v.startsWith('assets_source/')) {
          const p = v.split('/');
          tay.add(tacGia(p[1], p[2] ?? '', bangIcosa));
        } else duyet(v);
      }
    };
    duyet(JSON.parse(readFileSync(`tools/me/${ten}.json`, 'utf8')));
    console.log(`${ten.padEnd(11)} ${tay.size} tay ve: ${[...tay].join(' · ')}`);
  }
}

if (lenh === 'mau' && thamSo[0]) doMau(thamSo[0], thamSo[1]);
else if (lenh === 'tay-ve') demTayVe(thamSo);
else {
  console.error('dung: node tools/do_hinh.mjs mau <anh.png> [rong:cao:x:y] | tay-ve [me ...]');
  process.exit(1);
}
