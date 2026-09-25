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
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { docObj, BUOC } from './lib/obj.mjs';
import { docGltf } from './lib/gltf.mjs';
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
/**
 * Trang atlas RONG, 1x1 trong suot - dung de dem cho du so trang (`trang_it_nhat`).
 *
 * Ghi 1x1 chu khong 2048x2048: khong sprite nao tro vao trang nay nen kich thuoc that
 * khong anh huong gi, ma mot trang 2048 rong van ngon 16,8 MB bo nho GPU o may nguoi choi.
 */
const PNG_RONG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=',
  'base64',
);

/** Toa do the gioi -> toa do may anh (van tinh bang don vi o luoi). */
function chieu(x, y, z) {
  const x1 = x * Math.cos(YAW) - z * Math.sin(YAW);
  const z1 = x * Math.sin(YAW) + z * Math.cos(YAW);
  return [x1, y * Math.cos(PITCH) - z1 * Math.sin(PITCH), y * Math.sin(PITCH) + z1 * Math.cos(PITCH)];
}

/**
 * Doi khai bao kit ve mot dang duy nhat.
 *
 * `anh` co ba the:
 *   - bo trong  -> `Textures/colormap.png`, ca kit dung chung mot anh (cac goi Kenney)
 *   - `false`   -> kit khong co anh, mau nam ngay trong file .mtl (Nature Kit lam vay)
 *   - `"mtl"`   -> MOI MATERIAL MOT ANH RIENG, doc ten tu `map_Kd` trong file .mtl roi
 *                  tim trong `thu_muc_anh`. Quaternius lam vay: 27 anh PBR 2048x2048,
 *                  moi vat lieu mot bo, chu khong phai mot bang mau phang.
 *
 * `thu_muc_anh` nhan MOT hay NHIEU duong dan, tim lan luot. Goi cua nguoi khac hay xuat
 * thieu: Medieval Village khai `T_MetalOrnaments_BaseColor.png` nhung chi de no o thu muc
 * `glTF/`, khong co trong `Textures/`.
 */
function doiKit(khai) {
  const ra = {};
  for (const [ma, v] of Object.entries(khai)) {
    const o = typeof v === 'string' ? { duong: v } : v;
    // Kit glTF mang san ten anh trong chinh file model, va anh nam ngay canh model.
    // `loai: "glb"` la cung bo doc do, chi khac duoi file - GLB la glTF goi nhi phan,
    // anh nam luon trong file (`tools/lib/gltf.mjs`, ham `tachGlb`). Mo tu 11/09 de dung
    // duoc 814 file `.glb` cua kho chung (`docs/KHO_CHUNG.md`).
    const laGlb = o.loai === 'glb';
    const laGltf = o.loai === 'gltf' || laGlb;
    const theoMtl = o.anh === 'mtl' || laGltf;
    const thuMuc = o.thu_muc_anh ?? (laGltf ? '.' : '../Textures');
    ra[ma] = {
      duong: o.duong,
      laGltf,
      duoiModel: laGlb ? '.glb' : (laGltf ? '.gltf' : '.obj'),
      theoMtl,
      thuMucAnh: theoMtl
        ? (Array.isArray(thuMuc) ? thuMuc : [thuMuc]).map((t) => join(o.duong, t))
        : null,
      anh: theoMtl || o.anh === false ? null : join(o.duong, o.anh ?? 'Textures/colormap.png'),
      gamma: o.gamma === true,
      // So cot cua bang mau `colormap.png`, cho `mau_cot` cua tung manh. Kenney chia 16.
      soCot: o.so_cot ?? 16,
    };
  }
  return ra;
}

/**
 * So anh dung chung cho ca me: ten file -> chi so. Xay dan trong luc ghep sprite.
 *
 * Phai la mot so duy nhat cho ca me chu khong phai moi kit mot so: chi so nay di thang
 * vao tung dinh, va trang nuong ve theo nhom chi so.
 */
function taoSoAnh() {
  const bang = new Map();
  return {
    /** Them mot anh neu chua co, tra ve chi so. */
    them(duong) {
      if (duong === null) return -1;
      if (!bang.has(duong)) bang.set(duong, bang.size);
      return bang.get(duong);
    },
    /** Danh sach duong dan theo dung thu tu chi so. */
    danhSach() {
      return [...bang.keys()];
    },
  };
}

/**
 * Sinh mot TAM PHANG nam ngang, dan mot anh len.
 *
 * VI SAO PHAI TU SINH: Quaternius khong co o nen co / dat / song. Ma lay o nen cua goi
 * khac thi thuoc luoi lai lech - dung cai bay da sap voi KayKit o Phase 1 (o cua Kenney
 * rong 1 don vi, cua KayKit rong 2, khong `ti_le` thi nha to gap doi ca thanh pho).
 * Tu sinh thi o nen luon ra dung `64x32` diem anh chuan 2:1, khong phu thuoc ai.
 *
 * Khai trong me:  { "phang": 1, "texture": "assets_source/hoa_tiet/co.jpg", "lap": 2 }
 *   `phang`   canh tam, tinh bang don vi o luoi
 *   `texture` anh dan len; bo trong thi tam mang mau phang cua `mau`
 *   `lap`     anh lap lai bao nhieu lan tren mot canh; 1 la vua khit
 *   `lech`    dich toa do anh [u, v]. Cung mot anh ma moi o lay mot vung khac nhau thi
 *             mat khong con thay hoa tiet lap theo chu ky o - do la thu lam mat dat trong
 *             lien mach chu khong ra ban co.
 *   `day`     be day cua o. Bo trong hay 0 = tam phang tuyet doi, cac o xep khit nhau
 *             lien mach. Co `day` = o thanh khoi hop mong, thay canh ben nen luoi o hien
 *             ro nhu ban co - kieu cua Kenney va cua Age of Empires.
 */
function tamPhang(p, soAnh) {
  const c = (p.phang ?? 1) / 2;
  const d = p.day ?? 0;
  const y = (p.y ?? 0) + d;
  const x0 = p.x ?? 0;
  const z0 = p.z ?? 0;
  const u = p.lap ?? 1;
  const [lu, lv] = p.lech ?? [0, 0];
  const t = p.mau ?? [1, 1, 1];
  const khe = p.texture === undefined ? 0 : soAnh.them(p.texture) + 1;
  const dinh = [];
  const them = (dx, dy, dz, uu, vv, n) => {
    dinh.push(x0 + dx, dy, z0 + dz, uu + lu, vv + lv, n[0], n[1], n[2], t[0], t[1], t[2], khe);
  };
  // Mat tren, phap tuyen huong thang len.
  const tren = [0, 1, 0];
  them(-c, y, -c, 0, 0, tren); them(c, y, -c, u, 0, tren); them(c, y, c, u, u, tren);
  them(-c, y, -c, 0, 0, tren); them(c, y, c, u, u, tren); them(-c, y, c, 0, u, tren);
  if (d <= 0) return dinh;

  // Bon canh ben. Phap tuyen huong ra ngoai nen shader tu lam chung toi hon mat tren -
  // do la thu lam o nen trong nhu khoi co be day chu khong phai mieng giay dan xuong.
  const vd = (u * d) / (p.phang ?? 1);
  const canh = [
    { n: [0, 0, 1], a: [-c, c], b: [c, c] },
    { n: [0, 0, -1], a: [c, -c], b: [-c, -c] },
    { n: [1, 0, 0], a: [c, c], b: [c, -c] },
    { n: [-1, 0, 0], a: [-c, -c], b: [-c, c] },
  ];
  for (const e of canh) {
    them(e.a[0], y, e.a[1], 0, 0, e.n);
    them(e.b[0], y, e.b[1], u, 0, e.n);
    them(e.b[0], y - d, e.b[1], u, vd, e.n);
    them(e.a[0], y, e.a[1], 0, 0, e.n);
    them(e.b[0], y - d, e.b[1], u, vd, e.n);
    them(e.a[0], y - d, e.a[1], 0, vd, e.n);
  }
  return dinh;
}

/** Da bao thieu anh nao roi - moi anh chi keu mot lan cho do rac man hinh. */
const daKeuThieu = new Set();

/**
 * Tim mot file anh trong cac thu muc da khai.
 *
 * Khong thay thi tra ve `null` va keu mot cau, KHONG lam vo ca me: goi cua nguoi khac
 * hay xuat thieu vai anh, mat mot vat lieu thi sprite do dung mau phang, van nuong tiep
 * duoc. Vo ca me vi mot anh thieu la dat qua.
 */
function timAnh(thuMuc, tenAnh) {
  for (const t of thuMuc) {
    const duong = join(t, tenAnh);
    if (existsSync(duong)) return duong;
  }
  if (!daKeuThieu.has(tenAnh)) {
    daKeuThieu.add(tenAnh);
    console.warn(`  canh bao: khong tim thay anh "${tenAnh}", vat lieu do dung mau phang`);
  }
  return null;
}

/**
 * Nhan ban sprite: `{ "nhu": "<ten goc>", "mau_vl": {...}, "xoay": 90 }`.
 *
 * VI SAO CAN: nam cai nha chi khac nhau mau mai va mau tuong, ma moi cai 16 manh. Chep
 * tay ra 80 dong giong het nhau, sua mot cho thi phai sua nam cho. Khai `nhu` thi bien
 * the chi ba dong.
 *
 *   `mau_vl` tron VAO tung manh, khoa trung thi ban sao thang.
 *   `xoay`   quay ca sprite quanh truc dung; manh tu quay theo va vi tri x/z quay theo.
 *   `khung`  de len MOT manh, tra theo khoa `m` (hay `m#nhom` khi manh co loc nhom):
 *            `{ "kk:mill_blades": { "rz": 30 } }`, `{ "ki:windmill#blades": {...} }`.
 *            Day la duong lam cong trinh nhieu khung - `coi_xay_k1` chi khac `coi_xay_k0`
 *            o goc quay cua dung mot manh canh quat, chep ca sprite ra thi sua mot cho
 *            phai sua ba cho. Phai co `nhom` trong khoa vi than va canh cua
 *            `ki:windmill` nam trong CUNG MOT file, hai manh cung `m`.
 *
 * Goc phai la sprite thuong (mang manh) - khong nhan ban chong nhau, de doc me.
 */
function noiBanSao(sprite) {
  const ra = {};
  for (const [ten, v] of Object.entries(sprite)) {
    if (Array.isArray(v)) { ra[ten] = v; continue; }
    const goc = sprite[v.nhu];
    if (goc === undefined) throw new Error(`sprite "${ten}": khong co goc "${v.nhu}"`);
    if (!Array.isArray(goc)) throw new Error(`sprite "${ten}": goc "${v.nhu}" cung la ban sao`);
    const cung = ((v.xoay ?? 0) * Math.PI) / 180;
    const c = Math.cos(cung);
    const s = Math.sin(cung);
    // Go sai ten manh trong `khung` thi ban sao ra Y HET goc, khong bao gi - ma no se
    // hien len thanh "coi xay khong quay", dung loai loi ngoi mo ca buoi.
    for (const m of Object.keys(v.khung ?? {})) {
      if (!goc.some((p) => khoaManh(p) === m)) {
        throw new Error(`sprite "${ten}": goc "${v.nhu}" khong co manh "${m}"`);
      }
    }
    ra[ten] = goc.map((p) => {
      if (p.phang !== undefined) return p;
      const x = p.x ?? 0;
      const z = p.z ?? 0;
      return {
        ...p,
        x: x * c + z * s,
        z: -x * s + z * c,
        ry: (p.ry ?? 0) + (v.xoay ?? 0),
        mau_vl: { ...(p.mau_vl ?? {}), ...(v.mau_vl ?? {}) },
        ...(v.khung?.[khoaManh(p)] ?? {}),
      };
    });
  }
  return ra;
}

/** Khoa goi mot manh trong `khung`: `m`, hay `m#nhom` khi manh chi lay mot nhom cua file. */
function khoaManh(p) {
  return p.nhom === undefined ? p.m : `${p.m}#${p.nhom}`;
}

/**
 * Kit dung chung mot anh -> moi material co anh deu tro ve dung anh do.
 * Kit khai `"anh": "mtl"` -> tra ten file ghi trong .mtl, tim trong thu muc anh.
 */
function traAnhCua(k, soAnh) {
  return k.theoMtl
    ? (tenAnh) => (tenAnh === '' ? -1 : soAnh.them(timAnh(k.thuMucAnh, tenAnh)))
    : () => (k.anh === null ? -1 : soAnh.them(k.anh));
}

/** `"ma:ten"` -> duong file model cua kit do. */
function duongModel(m, kit) {
  const [ma, ten] = m.split(':');
  const k = kit[ma];
  if (k === undefined) throw new Error(`manh "${m}": khong co kit "${ma}"`);
  return join(k.duong, `${ten}${k.duoiModel}`);
}

/**
 * Tuy chon cho `docGltf` tu mot manh cua me. Doc de quy cho `gan`: vu khi gan vao tay,
 * nguoi cuoi gan vao lung ngua, kiem gan vao tay nguoi cuoi.
 *
 *   `hoat_anh`  `{ "m": "an:Rig_Medium_General", "ten": "Death_A", "phan": 1 }`
 *   `gan`       `[{ "xuong": "handslot.r", "m": "kv:spear_A", "chi_vi_tri", "dich", ... }]`
 */
function tuyChonGltf(p, kit, soAnh, bangDang) {
  const ha = p.hoat_anh;
  return {
    dang: bangDang[p.dang] ?? {},
    guong: p.guong === true,
    xuong: p.xuong ?? null,
    traAnh: traAnhCua(kit[p.m.split(':')[0]], soAnh),
    mau_vl: p.mau_vl ?? {},
    gamma: kit[p.m.split(':')[0]].gamma,
    hoatAnh: ha === undefined ? undefined : { duong: duongModel(ha.m, kit), ten: ha.ten, phan: ha.phan },
    gan: (p.gan ?? []).map((g) => ({
      xuong: g.xuong,
      duong: duongModel(g.m, kit),
      chiViTri: g.chi_vi_tri === true,
      dich: g.dich,
      tuyChon: tuyChonGltf({ ...g, xuong: undefined }, kit, soAnh, bangDang),
    })),
  };
}

/**
 * Sinh sprite linh tu khai bao gon `me.linh`: moi doi x `huong` huong x moi dang x moi
 * khung. Ten ra `<doi>_<dang>_h<huong>_k<khung>`.
 *
 * VI SAO KHONG CHEP TAY: 4 doi x 8 huong x 4 dang x 2 khung = 256 sprite. Moi sprite
 * khac nhau dung hai so (goc xoay, thoi diem trong clip) - chep ra 256 muc JSON thi sua
 * mot cay giao phai sua 64 cho.
 *
 * Huong `h` xoay model `h * 360 / huong` do quanh truc dung: model nhin theo +z, xoay
 * `a` do thi nhin theo (sin a, cos a) tren mat dat - `render/BattleScene.ts` chon huong
 * theo dung cong thuc nay.
 */
function moRongLinh(linh) {
  const ra = {};
  if (linh === undefined) return ra;
  for (const [doi, d] of Object.entries(linh.doi)) {
    for (const [dang, clip] of Object.entries(d.dang)) {
      const khung = clip.khung ?? linh.khung[dang];
      for (let h = 0; h < linh.huong; h += 1) {
        khung.forEach((phan, k) => {
          ra[`${doi}_${dang}_h${h}_k${k}`] = [{
            ...d.manh,
            ry: (d.manh.ry ?? 0) + (h * 360) / linh.huong,
            hoat_anh: { m: clip.m, ten: clip.ten, phan },
          }];
        });
      }
    }
  }
  return ra;
}

/**
 * Ghep cac manh cua mot sprite thanh mot mang dinh duy nhat, da xoay va da dich.
 *
 * `bangDang` la bang dang dung chung ca me (`me.dang`): ten dang -> ten xuong -> ba goc
 * xoay. Chi kit glTF dung toi; model OBJ khong co xuong.
 */
function ghep(phan, kit, soAnh, bangDang = {}) {
  const ra = [];
  for (const p of phan) {
    // Manh `phang`: khong doc file model nao ca, sinh thang mot tam vuong bang so.
    if (p.phang !== undefined) {
      ra.push(...tamPhang(p, soAnh));
      continue;
    }
    const [ma, ten] = p.m.split(':');
    const k = kit[ma];
    const traAnh = traAnhCua(k, soAnh);
    const { dinh } = k.laGltf
      ? docGltf(duongModel(p.m, kit), tuyChonGltf(p, kit, soAnh, bangDang))
      : docObj(
        join(k.duong, `${ten}.obj`), p.mau_vl ?? {}, k.gamma, traAnh,
        p.mau_cot === undefined ? null : { so: k.soCot, mau: p.mau_cot },
        p.nhom ?? null,
      );
    // Mau cua manh. `mau` la mau NHAN (giu van hoa tiet); them `thay_mau` thi bo hoc anh
    // di, son de mot mau phang - can the moi doi duoc mai ngoi xanh thanh mai ngoi do,
    // vi mau nhan khong bao gio keo mot mau xanh sang mau do duoc.
    const t = p.mau ?? [1, 1, 1];
    const son = p.thay_mau === true;
    // Moi goi do bang mot thuoc khac nhau: o luoi cua Kenney rong 1 don vi, cua KayKit
    // rong 2. `ti_le` keo ve cung mot thuoc.
    const tiLe = p.ti_le ?? 1;
    const goc = ((p.ry ?? 0) * Math.PI) / 180;
    const c = Math.cos(goc);
    const s = Math.sin(goc);
    // `rz` quay quanh truc DUNG MAN HINH, ap TRUOC `ry`. Chi co `ry` thi khong bao gio
    // dung noi canh quat coi xay: canh nam trong mat phang thang dung, ma `ry` chi quay
    // quanh truc dung nen thanh go van cu nam ngang.
    const gocZ = ((p.rz ?? 0) * Math.PI) / 180;
    const cz = Math.cos(gocZ);
    const sz = Math.sin(gocZ);
    // `rx` quay quanh truc DAM VAO MAN HINH. Canh quat cua Kenney (`ki:windmill`) nam
    // trong mat phang y-z, mong theo x - `rz` khong dung duoc, phai la `rx`.
    const gocX = ((p.rx ?? 0) * Math.PI) / 180;
    const cx = Math.cos(gocX);
    const sx = Math.sin(gocX);
    // Tam quay cua `rx` va `rz`, trong toa do model. Mac dinh la goc toa do.
    //
    // VI SAO CAN: truc canh quat khong nam o goc toa do - `kk:mill_blades` co tam o
    // (0, 1.268), canh cua `ki:windmill` o (_, 1.816, -0.003). Quay quanh goc toa do thi
    // ca cum canh VONG QUANH chan thap chu khong xoay tai cho.
    const [tamX, tamY, tamZ] = p.tam ?? [0, 0, 0];
    for (let i = 0; i < dinh.length; i += BUOC) {
      const x0 = dinh[i] - tamX;
      const y0 = dinh[i + 1] - tamY;
      const z0 = dinh[i + 2] - tamZ;
      const nx0 = dinh[i + 5];
      const ny0 = dinh[i + 6];
      const nz0 = dinh[i + 7];
      // `rz` truoc, roi `rx`, ca hai quanh `tam`; `ry` ben duoi ap sau cung.
      const y1 = x0 * sz + y0 * cz;
      const x = x0 * cz - y0 * sz + tamX;
      const y = y1 * cx - z0 * sx + tamY;
      const z = y1 * sx + z0 * cx + tamZ;
      const ny1 = nx0 * sz + ny0 * cz;
      const nx = nx0 * cz - ny0 * sz;
      const ny = ny1 * cx - nz0 * sx;
      const nz = ny1 * sx + nz0 * cx;
      ra.push(
        (x * c + z * s) * tiLe + (p.x ?? 0),
        y * tiLe + (p.y ?? 0),
        (-x * s + z * c) * tiLe + (p.z ?? 0),
        dinh[i + 3], dinh[i + 4],
        nx * c + nz * s, ny, -nx * s + nz * c,
        son ? t[0] : dinh[i + 8] * t[0],
        son ? t[1] : dinh[i + 9] * t[1],
        son ? t[2] : dinh[i + 10] * t[2],
        son ? 0 : dinh[i + 11],
      );
    }
  }
  return new Float32Array(ra);
}

/**
 * Huong den chinh, phai khop y het voi shader trong `trang_nuong.js`.
 * Bong do la hinh chieu cua vat len mat dat theo huong nay.
 */
const DEN = (() => {
  const v = [-0.55, 0.80, 0.35];
  const d = Math.hypot(...v);
  return v.map((x) => x / d);
})();

/**
 * Tam va ban kinh cua vet bong tren mat dat, do tu hop bao chan cua model.
 *
 * `hs` = `me.bong`: `nga` (bong dai bao nhieu lan chieu cao), `no_cao`, `no_them` (loang
 * ra theo chieu cao va mot khoang co dinh, don vi o luoi). Mac dinh la so cua nha. Linh
 * cao 0,6 o ma giu `no_them` 0,1 cua nha thi bong chiem gan nua o sprite - do 25/09.
 */
function doBong(dinh, hs = {}) {
  const lo = [Infinity, Infinity];
  const hi = [-Infinity, -Infinity];
  for (let i = 0; i < dinh.length; i += BUOC) {
    for (const [k, j] of [[0, 0], [1, 2]]) {
      const v = dinh[i + j];
      if (v < lo[k]) lo[k] = v;
      if (v > hi[k]) hi[k] = v;
    }
  }
  // Bong nga theo huong den, xa dan theo do cao cua vat.
  const cao = Math.max(...[...Array(dinh.length / BUOC)].map((_, i) => dinh[i * BUOC + 1]));
  const nga = (cao * (hs.nga ?? 0.55)) / DEN[1];
  // Vat cang cao bong cang loang ra - dung the that nhung o day chu yeu de bong tho ra
  // khoi bong dang vat, khong thi no nam gon duoi chan va coi nhu khong co.
  const no = cao * (hs.no_cao ?? 0.20) + (hs.no_them ?? 0.10);
  return {
    cx: (lo[0] + hi[0]) / 2 - DEN[0] * nga,
    cz: (lo[1] + hi[1]) / 2 - DEN[2] * nga,
    rx: ((hi[0] - lo[0]) / 2) * 0.95 + no,
    rz: ((hi[1] - lo[1]) / 2) * 0.95 + no,
  };
}

/** Hop bao cua sprite trong khong gian may anh + co o atlas can dung. */
function doO(dinh, ppu, bong) {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < dinh.length; i += BUOC) {
    const v = chieu(dinh[i], dinh[i + 1], dinh[i + 2]);
    for (let k = 0; k < 3; k += 1) {
      if (v[k] < lo[k]) lo[k] = v[k];
      if (v[k] > hi[k]) hi[k] = v[k];
    }
  }
  // Bong nam ngoai hop bao cua vat -> phai tinh vao, khong thi bi cat cut.
  // `bong` la null voi o nen (sprite toan manh phang): khong bong, khong noi hop bao.
  for (const [bx, bz] of bong === null ? [] : [
    [bong.cx - bong.rx, bong.cz - bong.rz], [bong.cx + bong.rx, bong.cz - bong.rz],
    [bong.cx - bong.rx, bong.cz + bong.rz], [bong.cx + bong.rx, bong.cz + bong.rz],
  ]) {
    const v = chieu(bx, 0, bz);
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
  const kit = doiKit(me.kit);
  // So anh xay DAN trong luc ghep: chi anh nao that su duoc dung moi vao so. Quaternius
  // co 27 anh 2048x2048 nhung mot me chi cham toi vai cai - nap het la phi bo nho.
  const soAnh = taoSoAnh();
  const ppu = PPU_1X * heSo;

  const dinhTheoTen = new Map();
  const oCanXep = [];
  const phu = new Map();
  for (const [ten, phan] of Object.entries(noiBanSao({ ...(me.sprite ?? {}), ...moRongLinh(me.linh) }))) {
    const dinh = ghep(phan, kit, soAnh, me.dang ?? {});
    // Sprite toan manh `phang` la o nen: KHONG co bong. Bong lam hai viec sai cung luc -
    // no nong hop bao them 15% (o nen ra 150 px thay vi dung 128), va mot o nen do bong
    // xuong chinh no thi vo nghia. Vat the dat tren tam phang van co bong nhu thuong.
    const chiPhang = phan.every((x) => x.phang !== undefined);
    const bong = chiPhang ? null : doBong(dinh, me.bong);
    const o = doO(dinh, ppu, bong);
    dinhTheoTen.set(ten, Buffer.from(dinh.buffer));
    oCanXep.push({ ten, w: o.w, h: o.h });
    // Khong con `anh` theo sprite: chi so anh nam trong tung DINH, trang nuong ve theo nhom.
    phu.set(ten, { ...o, bong });
  }

  const xong = xep(oCanXep, CANH, 2);
  const sprite = xong.o.map((o) => ({ ...o, ...phu.get(o.ten) }));
  // Hoa tiet CC0 cho phep chieu ba phuong. Khai o `me.hoa_tiet`; khong khai thi khong
  // chieu gi ca va sprite ra y het truoc - de lui ve ban cu chi bang mot dong trong me.
  const hoaTiet = me.hoa_tiet ?? [];
  const anh = soAnh.danhSach();
  const bo = {
    canh: CANH, soTrang: xong.soTrang, yaw: YAW, pitch: PITCH,
    anh: anh.map((_, i) => `/anh/${i}`), sprite,
    hoaTiet: hoaTiet.map((_, i) => `/hoatiet/${i}`),
    damHoaTiet: me.dam_hoa_tiet ?? 0,
    tiLeHoaTiet: me.ti_le_hoa_tiet ?? 4,
  };

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
    } else if (d.startsWith('/hoatiet/')) {
      res.setHeader('content-type', 'image/jpeg');
      res.end(readFileSync(hoaTiet[Number(d.slice(9))]));
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

  // MOI me phai ra CUNG so trang atlas: shader duoc dich cho dung so trang dang nap, nen
  // `DoiMeAtlas` nem loi khi len doi ma so trang lech (xem ghi chu o file do). Me nao xep
  // gon hon thi dem cho bang bang trang RONG - va trang do ghi 1x1 chu khong 2048x2048,
  // nen no khong ton bo nho GPU, khong ton duong truyen, va khong sprite nao tro vao.
  const canTrang = me.trang_it_nhat?.[String(heSo)] ?? 1;
  while (raPng.length < canTrang) raPng.push(PNG_RONG);

  const thuMuc = 'public/atlas';
  mkdirSync(thuMuc, { recursive: true });
  const dau = `${tenMe}_${heSo}x`;
  raPng.forEach((p, i) => writeFileSync(join(thuMuc, `${dau}_${i}.png`), p));
  // Xoa trang atlas THUA con sot lai tu lan nuong truoc. 10/09: bo bot sprite lam ban 2x
  // gon lai con MOT trang, nhung `trung_co_2_2x_1.png` cu van nam do - 1,8 MB rac van
  // duoc PWA tai ve may nguoi choi, va van phai ghi trong ASSET_CREDITS.
  for (const ten of readdirSync(thuMuc)) {
    const khop = ten.match(new RegExp(`^${dau}_(\\d+)\\.png$`));
    if (khop !== null && Number(khop[1]) >= raPng.length) {
      rmSync(join(thuMuc, ten));
      console.log(`   xoa trang thua: ${ten}`);
    }
  }

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

  console.log(`\n== ${dau}: ${sprite.length} sprite, ${raPng.length} trang atlas ${CANH}x${CANH}`);
  xong.lapDay.forEach((d, i) => console.log(`   trang ${i}: lap day ${d.toFixed(1)}%`));
  for (let i = xong.soTrang; i < raPng.length; i += 1) console.log(`   trang ${i}: RONG 1x1 (dem cho du so trang)`);
  const mb = (xong.soTrang * CANH * CANH * 4) / 1e6;
  console.log(`   bo nho GPU ${mb.toFixed(1)} MB / tran 4 trang = ${((4 * CANH * CANH * 4) / 1e6).toFixed(1)} MB`);
  return raPng.length;
}

const tenMe = process.argv[2] ?? 'trung_co';
const heSo = process.argv[3] === undefined ? [1, 2] : [Number(process.argv[3])];
let tong = 0;
for (const h of heSo) tong += await nuong(tenMe, h);
console.log(`\nTong ${tong} trang atlas. Tran TECH_SPEC muc 2: 4 trang.`);
if (tong > 4) console.warn('CANH BAO: vuot tran 4 trang atlas.');
