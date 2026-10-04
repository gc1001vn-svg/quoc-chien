#!/usr/bin/env node
/**
 * Bật Playwright MCP cho Claude lái trình duyệt: chơi thử game, thử app. `.mcp.json` gọi file này.
 *
 * VI SAO BOC MOT LOP: truoc khi trinh duyet mo phai nap CA cua proxy vao kho NSS
 * (`mo_mang_chromium.mjs`), khong thi moi trang ngoai `ERR_CERT_AUTHORITY_INVALID`. Cam
 * `--ignore-https-errors`. Chu du an chon B (Playwright MCP) thay script tu viet 04/10 — so do:
 * kho `ghi-nho`, `quyet-dinh/2026-10-04-do-a-b-playwright-mcp-hon-script-tu-viet.md`.
 *
 * stdout la kenh JSON-RPC cua MCP: moi dong in ra truoc khi MCP chay phai di stderr.
 *
 * Ghim dung ban 0.0.83 (keo Playwright 1.64 alpha) — doi ban thi do lai truoc.
 */
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const goc = (duongDan) => fileURLToPath(new URL(`../${duongDan}`, import.meta.url));

// Nap CA. Hong thi van bat MCP — trang trong may (localhost) van mo duoc; loi TLS hien o trang.
spawnSync('node', [goc('scripts/mo_mang_chromium.mjs')], { stdio: ['ignore', 2, 2] });

const thamSo = [
  '-y', '@playwright/mcp@0.0.83',
  '--headless', '--no-sandbox', '--isolated',
  '--executable-path', process.env.CHROMIUM ?? '/opt/pw-browsers/chromium',
  '--caps', 'vision,devtools',
  '--viewport-size', '960x600',
  '--init-script', goc('tools/lib/moc_am_thanh.js'),
  '--output-dir', goc('anh_chup/trinh_duyet'),
];
if (process.env.HTTPS_PROXY) thamSo.push('--proxy-server', process.env.HTTPS_PROXY);

const may = spawn('npx', thamSo, { stdio: 'inherit' });
may.on('exit', (ma) => process.exit(ma ?? 1));
