#!/usr/bin/env node
/**
 * Tai goi model CC0 cua Kenney ve `assets_source/`.
 *
 * VI SAO CAN SCRIPT: trang Kenney giau duong dan zip trong HTML, nut Download la
 * `javascript:void(0)`. Duong dan that nam o the <a id='donate-text' href='...zip'>, va no
 * co ma bam + dau thoi gian nen doi moi lan Kenney cap nhat goi -> khong ghi cung duoc.
 *
 * `assets_source/` nam trong .gitignore: goi tai ve khong len git, khong len may chu.
 * Chi atlas da nuong moi vao `public/assets/`.
 *
 * Dung:
 *   node tools/tai_asset.mjs fantasy-town-kit tower-defense-kit
 */
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const KHO = 'assets_source';

/** @param {string} slug Ten goi tren kenney.nl, vi du 'fantasy-town-kit'. */
async function timDuongZip(slug) {
  const trang = `https://kenney.nl/assets/${slug}`;
  const res = await fetch(trang);
  if (!res.ok) throw new Error(`Khong mo duoc ${trang}: HTTP ${res.status}`);
  const html = await res.text();
  const bat = html.match(
    new RegExp(`https://kenney\\.nl/media/pages/assets/${slug}/[^'"\\s]+\\.zip`),
  );
  if (bat === null) throw new Error(`Khong tim thay duong zip trong ${trang}`);
  return bat[0];
}

/** @param {string} slug */
async function tai(slug) {
  const dich = join(KHO, slug);
  if (existsSync(dich)) {
    console.log(`${slug}: da co ${dich}, bo qua.`);
    return;
  }
  const zip = await timDuongZip(slug);
  console.log(`${slug}: ${zip}`);

  const res = await fetch(zip);
  if (!res.ok) throw new Error(`Tai hong ${zip}: HTTP ${res.status}`);
  const byte = Buffer.from(await res.arrayBuffer());

  mkdirSync(KHO, { recursive: true });
  const tam = join(KHO, `${slug}.zip`);
  writeFileSync(tam, byte);
  console.log(`${slug}: ${(byte.length / 1e6).toFixed(1)} MB`);

  mkdirSync(dich, { recursive: true });
  execFileSync('unzip', ['-o', '-q', tam, '-d', dich], { stdio: 'inherit' });
  rmSync(tam);
  console.log(`${slug}: giai nen xong -> ${dich}`);
}

const slug = process.argv.slice(2);
if (slug.length === 0) {
  console.error('Thieu ten goi. Vi du: node tools/tai_asset.mjs fantasy-town-kit');
  process.exit(1);
}
for (const s of slug) await tai(s);
