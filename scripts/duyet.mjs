#!/usr/bin/env node
/**
 * Dung ban DUYET: build lai voi duong dan goc tuong doi roi don vao `.duyet/`.
 *
 * VI SAO CAN. May ao KHONG mo duoc trang that - `github.io` va moi hosting deu tra `000`
 * (do lai 15/09 van vay). Nen moi vong duyet sprite hay man hinh deu phai: day `main`,
 * doi CI, roi nho chu du an chup man hinh. Mot vong mat mot luot cua anh.
 *
 * Ban duyet di duong khac: `.duyet/` duoc dang thanh Artifact ngay trong phien, chu du an
 * bam link la mo game that tren iPhone. KHONG dung `main`, khong doi deploy.
 *
 * BA CHO PHAI SUA so voi ban that, va vi sao:
 *
 * 1. `--base=./`. Ban that viet cung `/quoc-chien/` (hang so `BASE` trong `vite.config.ts`).
 *    Artifact phuc vu o duong dan khac han nen moi file se 404. `assetUrl` doc
 *    `import.meta.env.BASE_URL` nen doi `--base` la ca code lan HTML deu theo.
 * 2. Bo service worker. Manifest PWA van mang `start_url` `/quoc-chien/` (sinh tu hang so
 *    trong `vite.config.ts`, ma file do KHOA). Giu lai thi SW dang ky sai pham vi va an
 *    mat ban moi. Ban duyet khong can choi offline.
 * 3. `xem.html` boc `game/index.html` bang iframe. Artifact tu boc noi dung vao khung
 *    `<!doctype html>` cua no; day thang mot trang HTML du dau du duoi vao la hong. Boc
 *    iframe thi trang game giu nguyen, cung nguon nen khong vuong CSP.
 *
 * `.duyet/` KHONG len git (xem `.gitignore`).
 *
 * Dung:
 *   npm run duyet
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RA = '.duyet';
const GAME = join(RA, 'game');

/** Tran cua Artifact, theo tai lieu cong cu. Vuot la dang hong, phai biet TRUOC khi dang. */
const TRAN = { trang: 16 * 1024 * 1024, nhiPhan: 15 * 1024 * 1024, tong: 64 * 1024 * 1024, soFile: 255 };

/**
 * File ban duyet bo het.
 * PWA: xem ghi chu 2 o dau file. `.nojekyll`: chi GitHub Pages can, va Artifact tu choi
 * no vi duoi file khong ung voi kieu noi dung nao phuc vu duoc.
 */
const BO_FILE = ['sw.js', 'manifest.webmanifest', 'registerSW.js', '.nojekyll'];

function build() {
  execFileSync('node', ['scripts/ghi_phien_ban.mjs'], { stdio: 'inherit' });
  rmSync(RA, { recursive: true, force: true });
  execFileSync('npx', ['vite', 'build', '--base=./', '--outDir', GAME, '--emptyOutDir'], {
    stdio: 'inherit',
  });
}

/** Go the dang ky service worker va the manifest khoi trang game. */
function goPwa() {
  const duong = join(GAME, 'index.html');
  let html = readFileSync(duong, 'utf8');
  html = html
    .replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/g, '')
    .replace(/<link rel="manifest"[^>]*>/g, '');
  writeFileSync(duong, html);
  for (const ten of BO_FILE) rmSync(join(GAME, ten), { force: true });
  // Workbox sinh ten co ma bam, khong doan duoc - quet thu muc goc.
  for (const ten of readdirSync(GAME)) {
    if (ten.startsWith('workbox-') && ten.endsWith('.js')) rmSync(join(GAME, ten));
  }
}

const XEM = `<title>Quốc Chiến — bản duyệt</title>
<style>
  :root { --nen: #12100e; --chu: #efe7d8; --vien: #3a332b; }
  :root[data-theme="light"] { --nen: #efe7d8; --chu: #12100e; --vien: #c9bda6; }
  /* Cot doc: iframe lap phan con lai. Truoc 26/09 iframe cao 100dvh - 44px co dinh, ma dong
     tieu de xuong hai dong tren iPhone -> day iframe (hang nut duoi) bi day ra ngoai man. */
  body { margin: 0; background: var(--nen); color: var(--chu); font: 14px system-ui, sans-serif;
    display: flex; flex-direction: column; height: 100dvh; }
  header {
    padding: 8px 16px; padding-top: calc(8px + env(safe-area-inset-top, 0px));
    border-bottom: 1px solid var(--vien); display: flex; gap: 12px; flex-wrap: wrap;
  }
  header b { font-weight: 600; }
  header span { opacity: .65; }
  iframe { display: block; width: 100%; border: 0; flex: 1; min-height: 0; }
</style>
<header><b>Quốc Chiến</b><span>bản duyệt — không phải bản trên GitHub Pages · đo fps: mở bằng Safari, chạm vào game một lần (chưa chạm Safari khoá 30)</span></header>
<iframe src="game/index.html" title="Quốc Chiến"></iframe>
`;

/** Liet ke file kem co, de doi chieu voi tran cua Artifact truoc khi dang. */
function liet(thuMuc, goc = thuMuc) {
  const ra = [];
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten);
    const tt = statSync(duong);
    if (tt.isDirectory()) ra.push(...liet(duong, goc));
    else ra.push({ duong: duong.slice(goc.length + 1), co: tt.size });
  }
  return ra;
}

build();
goPwa();
writeFileSync(join(RA, 'xem.html'), XEM);

const file = liet(RA).sort((a, b) => b.co - a.co);
const tong = file.reduce((t, f) => t + f.co, 0);
const toNhat = file[0];

console.log(`\n.duyet/ — ${file.length} file · ${(tong / 1024 / 1024).toFixed(1)} MB`);
for (const f of file.slice(0, 6)) console.log(`  ${(f.co / 1024).toFixed(0).padStart(7)} KB  ${f.duong}`);
if (file.length > 6) console.log(`  … con ${file.length - 6} file`);

const loi = [];
if (file.length > TRAN.soFile) loi.push(`${file.length} file, tran ${TRAN.soFile}`);
if (tong > TRAN.tong) loi.push(`tong ${(tong / 1024 / 1024).toFixed(1)} MB, tran ${TRAN.tong / 1024 / 1024} MB`);
if (toNhat !== undefined && toNhat.co > TRAN.nhiPhan) {
  loi.push(`${toNhat.duong} ${(toNhat.co / 1024 / 1024).toFixed(1)} MB, tran ${TRAN.nhiPhan / 1024 / 1024} MB`);
}
if (loi.length > 0) {
  console.error(`\nVUOT TRAN ARTIFACT: ${loi.join(' · ')}`);
  process.exit(1);
}
console.log('\nDat tran Artifact. Dang bang: Artifact file_path=.duyet/xem.html, files={"game/...": ...}');
