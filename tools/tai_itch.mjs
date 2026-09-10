#!/usr/bin/env node
/**
 * Tai goi asset mien phi tu itch.io ve `assets_source/`.
 *
 * VI SAO PHUC TAP HON KENNEY: itch khong de duong dan file trong HTML. Nut Download chay
 * ba buoc, moi buoc doi mot ma chong gia mao (`csrf_token`) va cookie phien:
 *
 *   1. GET trang goi                    -> cookie `itchio_token`, ma csrf la chinh no
 *   2. POST <trang>/download_url        -> tra ve duong trang tai co khoa
 *   3. GET trang tai                    -> danh sach file, moi file mot `data-upload_id`
 *   4. POST <trang>/file/<upload_id>    -> tra ve duong dan that (co ky, het han sau vai phut)
 *
 * Buoc 4 phai goi vao duong KHONG co khoa; goi vao duong co khoa thi itch tra 404.
 * Cookie phai giu suot bon buoc.
 *
 * Dung:
 *   node tools/tai_itch.mjs kaylousberg/kaykit-medieval-builder-pack
 */
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const KHO = 'assets_source';

/** Gom cookie tu header `set-cookie` cua moi luot goi. */
class Hu {
  constructor() { this.banh = new Map(); }
  nhan(res) {
    for (const d of res.headers.getSetCookie?.() ?? []) {
      const [c] = d.split(';');
      const k = c.indexOf('=');
      if (k > 0) this.banh.set(c.slice(0, k).trim(), c.slice(k + 1));
    }
  }
  get chuoi() { return [...this.banh].map(([k, v]) => `${k}=${v}`).join('; '); }
}

/** Itch chan toc do (429) khi goi lien tiep nhieu goi. Nghi roi thu lai, moi lan gap doi. */
async function goi(hu, duong, tuyChon = {}, conThu = 4) {
  const res = await fetch(duong, {
    ...tuyChon,
    redirect: 'follow',
    headers: { cookie: hu.chuoi, 'x-requested-with': 'XMLHttpRequest', ...(tuyChon.headers ?? {}) },
  });
  if (res.status === 429 && conThu > 0) {
    const cho = (5 - conThu) * 5 + 5;
    console.log(`itch chan toc do (429), nghi ${cho}s roi thu lai...`);
    await new Promise((xong) => setTimeout(xong, cho * 1000));
    return goi(hu, duong, tuyChon, conThu - 1);
  }
  hu.nhan(res);
  return res;
}

/** @param {string} duAn Dang `<tac-gia>/<ten-goi>`, vi du `kaylousberg/kaykit-medieval-builder-pack`. */
async function tai(duAn) {
  const [tacGia, ten] = duAn.split('/');
  const goc = `https://${tacGia}.itch.io/${ten}`;
  const dich = join(KHO, ten);
  if (existsSync(dich)) {
    console.log(`${ten}: da co ${dich}, bo qua.`);
    return;
  }

  const hu = new Hu();
  const trang = await goi(hu, goc);
  if (!trang.ok) throw new Error(`Khong mo duoc ${goc}: HTTP ${trang.status}`);
  const html = await trang.text();

  if (!/CC0|Creative Commons Zero|public domain/i.test(html)) {
    throw new Error(`${ten}: trang khong noi CC0. Kiem license bang mat truoc khi tai.`);
  }
  const csrf = decodeURIComponent(hu.banh.get('itchio_token') ?? '');
  if (csrf === '') throw new Error(`${ten}: itch khong dat cookie itchio_token`);

  const traLoi = await goi(hu, `${goc}/download_url`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ csrf_token: csrf }),
  });
  const { url: trangTai } = await traLoi.json();
  if (typeof trangTai !== 'string') throw new Error(`${ten}: khong xin duoc trang tai`);

  const dsHtml = await (await goi(hu, trangTai)).text();
  const id = [...dsHtml.matchAll(/data-upload_id="(\d+)"/g)].map((m) => m[1]);
  const tenFile = [...dsHtml.matchAll(/title="([^"]+\.zip)"/g)].map((m) => m[1]);
  if (id.length === 0) throw new Error(`${ten}: khong thay file nao trong trang tai`);

  mkdirSync(dich, { recursive: true });
  for (let i = 0; i < id.length; i += 1) {
    // Duong nay KHONG mang khoa; mang khoa vao la itch tra ve trang 404.
    const xin = await goi(hu, `${goc}/file/${id[i]}?source=game_download`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `csrf_token=${encodeURIComponent(csrf)}`,
    });
    const { url: duongThat } = await xin.json();
    if (typeof duongThat !== 'string') throw new Error(`${ten}: khong xin duoc duong file ${id[i]}`);

    const byte = Buffer.from(await (await fetch(duongThat)).arrayBuffer());
    const zip = join(KHO, `${ten}-${i}.zip`);
    writeFileSync(zip, byte);
    console.log(`${ten}: ${tenFile[i] ?? id[i]} - ${(byte.length / 1e6).toFixed(1)} MB`);
    execFileSync('unzip', ['-o', '-q', zip, '-d', dich], { stdio: 'inherit' });
    rmSync(zip);
  }
  console.log(`${ten}: giai nen xong -> ${dich}`);
}

const duAn = process.argv.slice(2);
if (duAn.length === 0) {
  console.error('Thieu goi. Vi du: node tools/tai_itch.mjs kaylousberg/kaykit-medieval-builder-pack');
  process.exit(1);
}
for (const d of duAn) await tai(d);
