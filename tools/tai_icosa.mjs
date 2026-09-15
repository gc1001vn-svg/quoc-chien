#!/usr/bin/env node
/**
 * Tai model tu kho guong ICOSA (https://icosa.gallery) - ban luu cua Google Poly.
 *
 * VI SAO CAN. Poly Pizza do duoc 10.400+ model nhung KHONG tai duoc: `static.poly.pizza`
 * tra 403 kem `Just a moment...` cua Cloudflare, ke ca khi lai Chromium (no nhan ra IP
 * trung tam du lieu). Icosa la kho guong cua chinh Google Poly - phan lon model nha tren
 * Poly Pizza goc tu day - va duong tai cua no di qua `web.archive.org`, khong dung
 * Cloudflare. Do 15/09: tai duoc that.
 *
 * BON BAY DA DO, DUNG "TOI UU" LAI:
 *
 * 1. `fetch` cua Node KHONG tai duoc `web.archive.org` - tra `403 Blocked by egress
 *    policy` vi no khong di CONNECT qua proxy phien. Phai goi `curl`. (API
 *    `api.icosa.gallery` thi `fetch` chay tot - chi host wayback moi vuong.)
 * 2. Phai them `--http1.1`. HTTP/2 qua proxy dut giua chung:
 *    `ws_closed_mid_exchange` sau ~11 giay.
 * 3. CAM tai thang URL API tra ve. No la moc gia `20250101010101id_/...`, wayback phai
 *    tra loi 302 sang moc that; cho `cdx.remote` mat ~16 giay thi tunnel da dut. Phai
 *    `curl -I` lay `location` truoc, roi GET dung moc that. Do: 11s dut / 2,4s xong.
 * 4. Host thu hai cua Icosa - `s3.us-east-005.backblazeb2.com` - `000 connect_rejected`,
 *    chua trong allowlist moi truong. Khong chan duong chinh: do 788 model nha thi 778
 *    co ban GLB/GLTF2 nam tren wayback.
 *
 * LICENSE. Kho Poly TOAN BO la CC-BY, khong co CC0 (do 788 model: 770 CC-BY 3.0 ·
 * 1 CC-BY 4.0 · 17 CC-BY-ND 3.0). Luat repo nhan CC0 · CC-BY · MIT, cam CC-BY-SA;
 * file nay bo them ND vi nuong sprite la tac pham phai sinh, ND cam phai sinh.
 * Moi model tai ve deu kem `ghi_cong.json` - nguyen lieu cho `docs/ASSET_CREDITS.md`.
 *
 * Dung:
 *   node tools/tai_icosa.mjs house building        # tu khoa tieng Anh
 *   node tools/tai_icosa.mjs nha --tam 8000        # tieng Viet: dich qua tu_dien_asset.json
 *   node tools/tai_icosa.mjs house --tam 0         # --tam 0 = khong gioi han so tam
 *   node tools/tai_icosa.mjs house --thu           # chi in ra se tai gi, khong tai
 *
 * Chay lai duoc: model da co tren dia thi bo qua, hong giua chung thi chay tiep.
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

const chay_lenh = promisify(execFile);

const API = 'https://api.icosa.gallery/v1/assets';
const THU_MUC = 'assets_source/icosa';
const TU_DIEN = 'tools/tu_dien_asset.json';
const CACHE = '.cache';
/** Cache ket qua do song 24 gio, giong `do_asset.mjs`. Kho Poly da dong bang tu 2021. */
const CACHE_SONG = 24 * 60 * 60 * 1000;
/** Tran so tam mac dinh: bang tran da dung khi do Poly Pizza, vua suc may nuong. */
const TAM_MAC_DINH = 8000;
/** So model tai cung luc. Wayback cham (~15 giay/model) nhung khong thich bi doi. */
const SONG_SONG = 4;
/** Lay het moi tu khoa: API tra toi da 100 moi trang. */
const MOI_TRANG = 100;
const LICENSE_CAM = ['_ND', '_SA'];
const LICENSE_NHAN = ['CREATIVE_COMMONS_BY', 'CREATIVE_COMMONS_0'];
/** Thu tu uu tien format: GLB tu chua moi thu trong mot file nen de nhat. */
const FORMAT_UU_TIEN = ['GLB', 'GLTF2', 'GLTF1'];

const doi = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Goi `curl` that vi `fetch` cua Node bi egress policy chan o host wayback (bay 1).
 * Bat buoc bat dong bo: `execFileSync` khoa vong lap su kien, bon luong tai se thanh mot.
 */
async function curl(args, lan = 4) {
  for (let i = 0; i < lan; i++) {
    try {
      const r = await chay_lenh('curl', ['-s', '--http1.1', '--max-time', '120', ...args], {
        encoding: 'buffer',
        maxBuffer: 1 << 28,
      });
      return r.stdout;
    } catch (loi) {
      if (i === lan - 1) throw loi;
      await doi(2 ** i * 1000); // 2s · 4s · 8s
    }
  }
}

/** Doi URL moc gia cua API sang moc that (bay 3). Khong co snapshot thi tra null. */
async function mocThat(url) {
  const dau = (await curl(['-I', url])).toString();
  const loc = (dau.match(/^location: (\S+)/im) || [])[1];
  if (loc) return loc;
  return /HTTP\/1\.1 200/.test(dau) ? url : null;
}

function licenseDuoc(asset) {
  const l = asset.license || '';
  if (LICENSE_CAM.some((x) => l.includes(x))) return false;
  return LICENSE_NHAN.includes(l);
}

/**
 * Lay het model trung tu khoa, di het cac trang.
 * Co cache 24 gio: buoc do het 17 tu khoa mat ~25 phut, ma lan chay lai (tai tiep cho
 * hong) khong can hoi lai API.
 */
async function doTuKhoa(tuKhoa) {
  const cache = join(CACHE, `icosa_${tuKhoa.replace(/\W/g, '_')}.json`);
  if (existsSync(cache) && Date.now() - statSync(cache).mtimeMs < CACHE_SONG) {
    return JSON.parse(readFileSync(cache, 'utf8'));
  }
  const ra = [];
  let token = '';
  for (;;) {
    const u = `${API}?keywords=${encodeURIComponent(tuKhoa)}&pageSize=${MOI_TRANG}` +
      (token ? `&pageToken=${encodeURIComponent(token)}` : '');
    const j = await (await fetch(u)).json();
    ra.push(...(j.assets || []));
    token = j.nextPageToken;
    if (!token || !(j.assets || []).length) {
      mkdirSync(CACHE, { recursive: true });
      writeFileSync(cache, JSON.stringify(ra));
      return ra;
    }
  }
}

/**
 * Danh sach ban tai duoc, uu tien GLB, chi lay ban nam tren wayback (bay 4).
 * Tra ve CA DANH SACH chu khong mot ban: wayback thieu ban luu cua tung file rieng le -
 * do 9 model dau thi 3 truot, ma 2 trong so do co ban khac tai duoc.
 */
function dsFormat(asset) {
  const ra = [];
  for (const loai of FORMAT_UU_TIEN) {
    for (const f of asset.formats || []) {
      if (f.formatType === loai && f.root?.url?.includes('web.archive.org')) ra.push(f);
    }
  }
  return ra;
}

function tenFile(f) {
  const duong = f.root.relativePath || decodeURIComponent(f.root.url.split('/').pop());
  return duong.replace(/[^\w.-]/g, '_');
}

/** Tai mot ban (format) ve `dich`. Tra ve false khi wayback khong co ban luu tu te. */
async function taiMotBan(f, dich) {
  const moc = await mocThat(f.root.url);
  if (!moc) return false;
  await curl(['-o', dich, moc]);
  const dau = existsSync(dich) ? readFileSync(dich).subarray(0, 5).toString() : '';
  // Wayback tra trang HTML (hay rong) khi thieu ban luu - xoa, dung de file rac nam lai.
  if (dau.startsWith('glTF') || dau.trimStart().startsWith('{')) return true;
  rmSync(dich, { force: true });
  return false;
}

/** Tai mot asset ve `assets_source/icosa/<assetId>/`. Tra ve so byte, 0 la bo qua. */
async function taiAsset(asset, ds) {
  const thuMuc = join(THU_MUC, asset.assetId);
  const cuDich = ds.map((x) => join(thuMuc, tenFile(x)));
  const daCo = cuDich.find((d) => existsSync(d) && statSync(d).size > 0);
  if (daCo) return { byte: 0, bo_qua: true };
  mkdirSync(thuMuc, { recursive: true });

  // Thu lan luot cac ban: GLB truoc, roi GLTF2, GLTF1 - ban nay thieu thi con ban kia.
  let f = null, dich = null;
  for (let i = 0; i < ds.length; i++) {
    if (await taiMotBan(ds[i], cuDich[i])) { f = ds[i]; dich = cuDich[i]; break; }
  }
  if (f === null) throw new Error(`khong ban nao co luu (thu ${ds.length})`);

  // GLTF tho: keo not file .bin va anh di kem, giu nguyen duong dan tuong doi.
  for (const r of f.resources || []) {
    const rd = join(thuMuc, (r.relativePath || '').replace(/[^\w./-]/g, '_'));
    if (existsSync(rd)) continue;
    mkdirSync(dirname(rd), { recursive: true });
    const rm = await mocThat(r.url);
    if (rm) await curl(['-o', rd, rm]);
  }

  writeFileSync(
    join(thuMuc, 'ghi_cong.json'),
    JSON.stringify(
      {
        ten: asset.displayName,
        tac_gia: asset.authorName,
        license: asset.license + ' ' + (asset.licenseVersion || ''),
        so_tam: asset.triangleCount,
        format: f.formatType,
        trang: `https://icosa.gallery/view/${asset.assetId}`,
        nguon: 'Icosa Gallery (kho guong Google Poly)',
      },
      null,
      1,
    ) + '\n',
  );
  return { byte: statSync(dich).size, bo_qua: false };
}

async function main() {
  const args = process.argv.slice(2);
  const thu = args.includes('--thu');
  const iTam = args.indexOf('--tam');
  const tranTam = iTam >= 0 ? Number(args[iTam + 1]) : TAM_MAC_DINH;
  // Bo ca `--tam` lan so dung sau no; `iTam < 0` thi khong duoc bo arg dau tien.
  const tuKhoa = args.filter((a, i) => !a.startsWith('--') && !(iTam >= 0 && i === iTam + 1));
  if (!tuKhoa.length) {
    console.log('Dung: node tools/tai_icosa.mjs <tu khoa...> [--tam 8000] [--thu]');
    process.exit(1);
  }

  // Tu dien Viet -> Anh dung chung voi `do:asset`: do hut thi them tu, dung sua ma nguon.
  const tuDien = existsSync(TU_DIEN) ? JSON.parse(readFileSync(TU_DIEN, 'utf8')) : {};
  const tra = tuKhoa.flatMap((t) => (tuDien[t]?.length ? tuDien[t] : [t]));

  const thay = new Map();
  const bo = { license: 0, tam: 0, format: 0 };
  for (const t of tra) {
    const ds = await doTuKhoa(t);
    for (const a of ds) {
      if (thay.has(a.assetId)) continue;
      if (!licenseDuoc(a)) { bo.license++; continue; }
      if (tranTam > 0 && a.triangleCount > tranTam) { bo.tam++; continue; }
      const ban = dsFormat(a);
      if (!ban.length) { bo.format++; continue; }
      thay.set(a.assetId, { a, ban });
    }
    console.log(`do "${t}": ${ds.length} model, gio giu ${thay.size}`);
  }
  console.log(
    `Bo: ${bo.license} sai license (ND/SA) · ${bo.tam} qua ${tranTam} tam · ${bo.format} khong co ban tai duoc`,
  );
  if (thu) {
    for (const { a } of thay.values()) {
      console.log(`${a.displayName} | ${a.assetId} | ${a.triangleCount} tam | ${a.license}`);
    }
    return;
  }

  const viec = [...thay.values()];
  let xong = 0, boQua = 0, hong = 0, tongByte = 0;
  const chay = async () => {
    for (;;) {
      const v = viec.shift();
      if (!v) return;
      try {
        const r = await taiAsset(v.a, v.ban);
        if (r.bo_qua) boQua++;
        else { xong++; tongByte += r.byte; }
      } catch (loi) {
        hong++;
        console.log(`HONG ${v.a.displayName} (${v.a.assetId}): ${String(loi.message).slice(0, 60)}`);
      }
      const da = xong + boQua + hong;
      if (da % 10 === 0) console.log(`... ${da}/${thay.size}`);
      await doi(0);
    }
  };
  await Promise.all(Array.from({ length: SONG_SONG }, chay));
  console.log(
    `Tai ${xong} · co san ${boQua} · hong ${hong} · ${(tongByte / 1048576).toFixed(1)} MB vao ${THU_MUC}/`,
  );
}

await main();
