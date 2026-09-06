#!/usr/bin/env node
/**
 * Tai hoa tiet CC0 cua Poly Haven ve `assets_source/hoa_tiet/`.
 *
 * VI SAO CAN: Quaternius khong co o nen co / dat / duong / song. Ma lay o nen cua goi
 * model khac thi thuoc luoi lai lech - dung cai bay da sap voi KayKit o Phase 1. Nen o
 * nen duoc TU SINH: mot tam phang do `tools/nuong_sprite.mjs` dung bang so, roi dan hoa
 * tiet nay len. Tu sinh thi o nen luon ra dung `64x32` diem anh chuan 2:1.
 *
 * VI SAO KHONG DUNG `tai_asset.mjs`: file do chuyen tim duong zip giau trong HTML cua
 * kenney.nl. Poly Haven co API JSON dang hoang, hinh dang viec khac han.
 *
 * Toan bo kho Poly Haven la CC0: https://polyhaven.com/license
 *
 * Dung:
 *   node tools/tai_hoa_tiet.mjs sparse_grass brown_mud_dry cobblestone_01
 *   node tools/tai_hoa_tiet.mjs --do-phan-giai 2k sparse_grass
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const KHO = 'assets_source/hoa_tiet';
const API = 'https://api.polyhaven.com/files';

/**
 * Tim duong tai anh mau goc cua mot hoa tiet.
 *
 * @param {string} ten Ma hoa tiet tren Poly Haven, vi du 'sparse_grass'.
 * @param {string} doPhanGiai '1k' | '2k' | '4k'. Cang lon cang net nhung nuong cang cham.
 */
async function timDuongAnh(ten, doPhanGiai) {
  const res = await fetch(`${API}/${ten}`);
  if (!res.ok) throw new Error(`Khong hoi duoc Poly Haven ve "${ten}": HTTP ${res.status}`);
  const bo = await res.json();
  const mau = bo.Diffuse ?? bo.diffuse ?? bo.Color ?? null;
  if (mau === null) throw new Error(`"${ten}" khong co anh mau (Diffuse)`);
  const co = mau[doPhanGiai];
  if (co === undefined) {
    throw new Error(`"${ten}" khong co co ${doPhanGiai}; co: ${Object.keys(mau).join(', ')}`);
  }
  // Uu tien jpg: nho hon png nhieu lan, ma o nen khong can kenh trong suot.
  const f = co.jpg ?? co.png;
  if (f === undefined) throw new Error(`"${ten}" ${doPhanGiai} khong co jpg lan png`);
  return { duong: f.url, duoi: co.jpg === undefined ? 'png' : 'jpg', co: f.size ?? 0 };
}

async function tai(ten, doPhanGiai) {
  const { duong, duoi } = await timDuongAnh(ten, doPhanGiai);
  const raFile = join(KHO, `${ten}.${duoi}`);
  if (existsSync(raFile)) {
    console.log(`${ten}: da co, bo qua`);
    return;
  }
  const res = await fetch(duong);
  if (!res.ok) throw new Error(`Tai "${ten}" hong: HTTP ${res.status}`);
  const byte = Buffer.from(await res.arrayBuffer());
  mkdirSync(KHO, { recursive: true });
  writeFileSync(raFile, byte);
  console.log(`${ten}: ${(byte.length / 1024 / 1024).toFixed(1)} MB -> ${raFile}`);
}

const doi = process.argv.slice(2);
let doPhanGiai = '1k';
const ten = [];
for (let i = 0; i < doi.length; i += 1) {
  if (doi[i] === '--do-phan-giai') {
    i += 1;
    doPhanGiai = doi[i] ?? '1k';
  } else {
    ten.push(doi[i]);
  }
}
if (ten.length === 0) {
  console.error('Dung: node tools/tai_hoa_tiet.mjs [--do-phan-giai 1k|2k] <ma> [<ma>...]');
  process.exit(1);
}
for (const t of ten) await tai(t, doPhanGiai);
