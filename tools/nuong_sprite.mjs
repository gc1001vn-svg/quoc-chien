#!/usr/bin/env node
/**
 * Nuong sprite: model 3D CC0 -> atlas PNG + JSON toa do.
 *
 * Cach chay: doc me o `tools/me/<ten>.json`, ghep cac manh model thanh tung sprite, tinh
 * san co va vi tri trong atlas o Node (de test duoc), roi mo Chromium ve bang WebGL tu
 * viet - khong three.js, dung luat "thu vien do hoa ngoai = 0" cua TECH_SPEC muc 2.
 *
 *   npm run nuong                 # nuong me trung_co, ca co 1x va 2x
 *   node tools/nuong_sprite.mjs trung_co 1
 *
 * Goc may anh: truc giao, xoay 45 do quanh truc dung, nghieng 30 do. 30 do la goc DUNG
 * cho o luoi 2:1 vi chieu cao chieu xuong = chieu ngang * sin(30) = mot nua. (TECH_SPEC
 * muc 3 co ghi "atan(0.5) ~ 26,57 do cho 2:1 chinh xac" - cho do ghi nham.)
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { docObj, BUOC } from './lib/obj.mjs';
import { xep } from './lib/xep.mjs';
import { TrinhDuyet } from './lib/cdp.mjs';

const CHROMIUM = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium';
const CANH = 2048;
const YAW = Math.PI / 4;
const PITCH = Math.PI / 6;
/** Diem anh moi o luoi o co 1x. O luoi cheo 45 do nen mot don vi rong sqrt(2) o luoi. */
const O_PX = 64;
const PPU_1X = O_PX / Math.SQRT2;
/** Vien trong moi o atlas, tranh cat cut net khu rang cua. */
const LE = 1;

/** Toa do the gioi -> toa do may anh (van tinh bang don vi o luoi). */
function chieu(x, y, z) {
  const x1 = x * Math.cos(YAW) - z * Math.sin(YAW);
  const z1 = x * Math.sin(YAW) + z * Math.cos(YAW);
  return [x1, y * Math.cos(PITCH) - z1 * Math.sin(PITCH), y * Math.sin(PITCH) + z1 * Math.cos(PITCH)];
}

/** Ghep cac manh cua mot sprite thanh mot mang dinh duy nhat, da xoay va da dich. */
function ghep(phan, kit) {
  const ra = [];
  for (const p of phan) {
    const [ma, ten] = p.m.split(':');
    const { dinh } = docObj(join(kit[ma], `${ten}.obj`));
    const goc = ((p.ry ?? 0) * Math.PI) / 180;
    const c = Math.cos(goc);
    const s = Math.sin(goc);
    for (let i = 0; i < dinh.length; i += BUOC) {
      const x = dinh[i];
      const z = dinh[i + 2];
      const nx = dinh[i + 5];
      const nz = dinh[i + 7];
      ra.push(
        x * c + z * s + (p.x ?? 0),
        dinh[i + 1] + (p.y ?? 0),
        -x * s + z * c + (p.z ?? 0),
        dinh[i + 3], dinh[i + 4],
        nx * c + nz * s, dinh[i + 6], -nx * s + nz * c,
        dinh[i + 8], dinh[i + 9], dinh[i + 10], dinh[i + 11],
      );
    }
  }
  return new Float32Array(ra);
}

/** Hop bao cua sprite trong khong gian may anh + co o atlas can dung. */
function doO(dinh, ppu) {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < dinh.length; i += BUOC) {
    const v = chieu(dinh[i], dinh[i + 1], dinh[i + 2]);
    for (let k = 0; k < 3; k += 1) {
      if (v[k] < lo[k]) lo[k] = v[k];
      if (v[k] > hi[k]) hi[k] = v[k];
    }
  }
  const w = Math.ceil((hi[0] - lo[0]) * ppu) + 2 * LE;
  const h = Math.ceil((hi[1] - lo[1]) * ppu) + 2 * LE;
  // Noi rong hop bao dung bang phan le da them, de hinh khong bi keo gian.
  const vx0 = lo[0] - LE / ppu;
  const vy0 = lo[1] - LE / ppu;
  return {
    w, h,
    vx0, vx1: vx0 + w / ppu,
    vy0, vy1: vy0 + h / ppu,
    vz0: lo[2], vz1: hi[2],
    // Diem neo: goc the gioi (0,0,0) nam o dau trong o sprite, tinh tu goc trai-tren.
    ox: Math.round((0 - vx0) * ppu),
    oy: Math.round((vy0 + h / ppu) * ppu),
  };
}

/** Doc chuoi dai tu trang theo tung khuc, tranh mot goi WebSocket vai MB. */
async function docDai(td, bieuThuc, khuc = 1_000_000) {
  const dai = Number(await td.doc(`(${bieuThuc}).length`));
  let ra = '';
  for (let i = 0; i < dai; i += khuc) {
    ra += await td.doc(`(${bieuThuc}).slice(${i}, ${i + khuc})`);
  }
  return ra;
}

async function nuong(tenMe, heSo) {
  const me = JSON.parse(readFileSync(`tools/me/${tenMe}.json`, 'utf8'));
  const kit = me.kit;
  const maKit = Object.keys(kit);
  const anh = maKit.map((k) => join(kit[k], 'Textures/colormap.png'));
  const ppu = PPU_1X * heSo;

  const dinhTheoTen = new Map();
  const oCanXep = [];
  const phu = new Map();
  for (const [ten, phan] of Object.entries(me.sprite)) {
    const dinh = ghep(phan, kit);
    const o = doO(dinh, ppu);
    dinhTheoTen.set(ten, Buffer.from(dinh.buffer));
    oCanXep.push({ ten, w: o.w, h: o.h });
    phu.set(ten, { ...o, anh: maKit.indexOf(phan[0].m.split(':')[0]) });
  }

  const xong = xep(oCanXep, CANH, 2);
  const sprite = xong.o.map((o) => ({ ...o, ...phu.get(o.ten) }));
  const bo = { canh: CANH, soTrang: xong.soTrang, yaw: YAW, pitch: PITCH, anh: anh.map((_, i) => `/anh/${i}`), sprite };

  const may = createServer((req, res) => {
    const d = decodeURIComponent(req.url ?? '/');
    if (d === '/') {
      res.end('<!doctype html><meta charset="utf-8"><body style="margin:0"><script type="module" src="/nuong.js"></script>');
    } else if (d === '/nuong.js') {
      res.setHeader('content-type', 'text/javascript');
      res.end(readFileSync('tools/lib/trang_nuong.js'));
    } else if (d === '/bo.json') {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(bo));
    } else if (d.startsWith('/anh/')) {
      res.setHeader('content-type', 'image/png');
      res.end(readFileSync(anh[Number(d.slice(5))]));
    } else if (d.startsWith('/bin/')) {
      res.setHeader('content-type', 'application/octet-stream');
      res.end(dinhTheoTen.get(d.slice(5)) ?? Buffer.alloc(0));
    } else {
      res.statusCode = 404;
      res.end('');
    }
  });
  await new Promise((ok) => may.listen(0, '127.0.0.1', ok));
  const cong = may.address().port;

  const td = new TrinhDuyet(CHROMIUM, 9224);
  const raPng = [];
  try {
    await td.mo();
    await td.datManHinh(CANH, CANH, 1);
    await td.moTrang(`http://127.0.0.1:${cong}/`);
    if (!(await td.choDen('window.XONG === true', 300000))) {
      throw new Error('Trang nuong khong bao xong sau 300 giay');
    }
    const loi = await td.doc('window.LOI ?? ""');
    if (loi !== '') throw new Error(`Trang nuong bao loi:\n${loi}`);
    for (let i = 0; i < xong.soTrang; i += 1) {
      const url = await docDai(td, `window.KQ[${i}]`);
      raPng.push(Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
    }
  } finally {
    await td.dong();
    may.close();
  }

  const thuMuc = 'public/assets/atlas';
  mkdirSync(thuMuc, { recursive: true });
  const dau = `${tenMe}_${heSo}x`;
  raPng.forEach((p, i) => writeFileSync(join(thuMuc, `${dau}_${i}.png`), p));

  const json = {
    canh: CANH,
    heSo,
    o_px: O_PX * heSo,
    trang: raPng.map((_, i) => `${dau}_${i}.png`),
    sprite: Object.fromEntries(sprite.map((s) => [
      s.ten, { trang: s.trang, x: s.x, y: s.y, w: s.w, h: s.h, ox: s.ox, oy: s.oy },
    ])),
  };
  writeFileSync(join(thuMuc, `${dau}.json`), `${JSON.stringify(json, null, 1)}\n`);

  console.log(`\n== ${dau}: ${sprite.length} sprite, ${xong.soTrang} trang atlas ${CANH}x${CANH}`);
  xong.lapDay.forEach((d, i) => console.log(`   trang ${i}: lap day ${d.toFixed(1)}%`));
  const mb = (xong.soTrang * CANH * CANH * 4) / 1e6;
  console.log(`   bo nho GPU ${mb.toFixed(1)} MB / tran 4 trang = ${((4 * CANH * CANH * 4) / 1e6).toFixed(1)} MB`);
  return xong.soTrang;
}

const tenMe = process.argv[2] ?? 'trung_co';
const heSo = process.argv[3] === undefined ? [1, 2] : [Number(process.argv[3])];
let tong = 0;
for (const h of heSo) tong += await nuong(tenMe, h);
console.log(`\nTong ${tong} trang atlas. Tran TECH_SPEC muc 2: 4 trang.`);
if (tong > 4) console.warn('CANH BAO: vuot tran 4 trang atlas.');
