/**
 * Doc file glTF 2.0 (.gltf + .bin) co XUONG, va tao DANG truoc khi nuong.
 *
 * VI SAO PHAI CO: goi nguoi CC0 duy nhat hop phong cach trung co (Quaternius "Modular
 * Character Outfits - Fantasy") KHONG co ban OBJ, chi co .gltf va .fbx. Va model nam o
 * TU THE CHU T - hai tay dang ngang - lai khong kem san cu dong nao. Nuong thang ra thi
 * duoc mot nguoi dang tay di tren duong. Nen phai tu xoay xuong, tuc la phai tron da
 * (skinning) bang tay.
 *
 * Chi doc dung phan can de nuong mot anh tinh: dinh, phap tuyen, toa do anh, xuong. Bo
 * qua camera, cu dong, hoat anh hinh thai, nen, KHR_*. Keo ca thu vien glTF vao chi de
 * doc bay nhieu la lo - luat "thu vien do hoa ngoai = 0" cua `TECH_SPEC.md` muc 2.
 *
 * Tra ve dinh phang giong het `docObj`: [x,y,z, u,v, nx,ny,nz, r,g,b, anh] * 3 dinh moi
 * tam giac, de `ghep()` trong `nuong_sprite.mjs` dung lai nguyen phan xoay-dich-nhan mau.
 *
 * HAI CHO DE SAI, da tra gia mot lan moi ra:
 *   - glTF de goc toa do anh o GOC TREN-TRAI, OBJ de o GOC DUOI-TRAI. Trang nuong bat
 *     `UNPACK_FLIP_Y_WEBGL` cho hop voi OBJ, nen o day phai lat `v` mot lan: `1 - v`.
 *   - Ma tran trong glTF xep theo COT. `m[12] m[13] m[14]` moi la phan dich chuyen.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BUOC } from './obj.mjs';

/** So byte moi thanh phan, tra theo `componentType` cua glTF. */
const CO_BYTE = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
/** So thanh phan moi phan tu, tra theo `type`. */
const SO_PHAN = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
/** Doc mang so tho theo `componentType`. */
const MANG = {
  5120: Int8Array, 5121: Uint8Array, 5122: Int16Array,
  5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array,
};
/** Chia de dua so nguyen `normalized` ve doan 0..1. */
const CHIA = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };

/** Nhan hai ma tran 4x4 xep theo cot. */
function nhan(a, b) {
  const r = new Float64Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let d = 0; d < 4; d += 1) {
      r[c * 4 + d] = a[d] * b[c * 4] + a[4 + d] * b[c * 4 + 1]
        + a[8 + d] * b[c * 4 + 2] + a[12 + d] * b[c * 4 + 3];
    }
  }
  return r;
}

/** Ma tran don vi. */
function donVi() {
  return new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

/** Dich chuyen - xoay - phong to thanh mot ma tran. `q` la bon so [x,y,z,w]. */
function tuTRS(t, q, s) {
  const [x, y, z, w] = q;
  const [sx, sy, sz] = s;
  return new Float64Array([
    (1 - 2 * (y * y + z * z)) * sx, (2 * (x * y + z * w)) * sx, (2 * (x * z - y * w)) * sx, 0,
    (2 * (x * y - z * w)) * sy, (1 - 2 * (x * x + z * z)) * sy, (2 * (y * z + x * w)) * sy, 0,
    (2 * (x * z + y * w)) * sz, (2 * (y * z - x * w)) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    t[0], t[1], t[2], 1,
  ]);
}

/** Nhan hai bon-so (quaternion), thu tu `a` roi `b`. */
function nhanQ(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

/**
 * Ba goc xoay (do) quanh truc x, y, z thanh mot bon-so. Xoay lan luot x, roi y, roi z -
 * trong khong gian RIENG cua xuong, nen goc x cua `thigh` la "nhac dui ra truoc".
 */
function tuGoc(goc) {
  let q = [0, 0, 0, 1];
  const truc = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let i = 0; i < 3; i += 1) {
    const nua = ((goc[i] ?? 0) * Math.PI) / 360;
    const s = Math.sin(nua);
    q = nhanQ(q, [truc[i][0] * s, truc[i][1] * s, truc[i][2] * s, Math.cos(nua)]);
  }
  return q;
}

/** Nhan mot diem (w = 1) voi ma tran 4x4 xep theo cot. */
function diem(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

/** Nhan mot huong (w = 0) voi ma tran 4x4 - dich chuyen khong tinh vao. */
function huong(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z,
    m[1] * x + m[5] * y + m[9] * z,
    m[2] * x + m[6] * y + m[10] * z,
  ];
}

/** Doc mot accessor ra mang so, da dua ve 0..1 neu no khai `normalized`. */
function docAcc(j, dem, i) {
  const a = j.accessors[i];
  const soPhan = SO_PHAN[a.type];
  const ra = new Float64Array(a.count * soPhan);
  if (a.bufferView === undefined) return ra;
  const bv = j.bufferViews[a.bufferView];
  const goc = (bv.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const coByte = CO_BYTE[a.componentType];
  // `byteStride` khac 0 nghia la nhieu thuoc tinh xen ke nhau trong cung mot vung.
  const buoc = bv.byteStride ?? soPhan * coByte;
  const bin = dem[bv.buffer];
  const chia = a.normalized === true ? CHIA[a.componentType] : 0;
  for (let k = 0; k < a.count; k += 1) {
    const phan = new MANG[a.componentType](bin.buffer, bin.byteOffset + goc + k * buoc, soPhan);
    for (let c = 0; c < soPhan; c += 1) ra[k * soPhan + c] = chia === 0 ? phan[c] : phan[c] / chia;
  }
  return ra;
}

/** Doc mot buffer: file .bin nam canh, hay chuoi `data:` nhung thang trong file glTF. */
function docBuffer(b, thuMuc) {
  const uri = b.uri ?? '';
  if (uri.startsWith('data:')) return Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
  return readFileSync(join(thuMuc, decodeURIComponent(uri)));
}

/**
 * Bang dang: ten xuong -> ba goc xoay (do). `guong` doi ben trai voi ben phai, nho vay
 * dang "chan trai buoc truoc" dung lai duoc lam dang "chan phai buoc truoc" ma khong
 * phai chep so lan hai.
 */
function doiDang(dang, guong) {
  if (!guong) return dang;
  const ra = {};
  for (const [ten, goc] of Object.entries(dang)) {
    const doi = ten.endsWith('_l') ? `${ten.slice(0, -2)}_r`
      : ten.endsWith('_r') ? `${ten.slice(0, -2)}_l` : ten;
    // Guong qua mat phang doc: goc quanh truc x giu nguyen, quanh y va z doi dau.
    ra[doi] = [goc[0] ?? 0, -(goc[1] ?? 0), -(goc[2] ?? 0)];
  }
  return ra;
}

/**
 * Doc mot file glTF thanh mang dinh de nuong.
 *
 * @param {string} duong Duong dan file `.gltf`.
 * @param {object} [tuyChon]
 * @param {Record<string, number[]>} [tuyChon.dang] Ten xuong -> ba goc xoay (do) cong
 *   THEM vao tu the goc. Bo trong = giu nguyen tu the trong file.
 * @param {boolean} [tuyChon.guong] Doi trai/phai cua bang dang.
 * @param {string[]} [tuyChon.xuong] Chi giu phan thit bam vao nhung xuong nay. Bo trong
 *   = lay het. Can de CAT LAY DAU: bo do nong dan khong co dau (Quaternius de dau o goi
 *   "Universal Base Characters" rieng, cung bo xuong 65 khop), nen phai lay nguyen mot
 *   nguoi tu goi kia roi cat lay moi cai dau, dat len co cua nguoi mac do nong dan.
 * @param {(tenAnh: string) => number} [tuyChon.traAnh] Doi ten file anh thanh chi so anh
 *   toan cuc (>= 0), hay -1 neu khong tim ra.
 * @param {Record<string, number[]>} [tuyChon.mau_vl] Ten material -> mau nhan rieng.
 * @returns {{dinh: Float32Array, min: number[], max: number[], soTamGiac: number}}
 */
export function docGltf(duong, tuyChon = {}) {
  const { dang = {}, guong = false, traAnh = null, mau_vl: mauVl = {}, xuong: locXuong = null } = tuyChon;
  const j = JSON.parse(readFileSync(duong, 'utf8'));
  const thuMuc = dirname(duong);
  const dem = (j.buffers ?? []).map((b) => docBuffer(b, thuMuc));
  const nodes = j.nodes ?? [];
  const bangDang = doiDang(dang, guong);

  // Ma tran rieng cua tung node, da cong them goc xoay cua dang.
  const rieng = nodes.map((n) => {
    if (n.matrix !== undefined && bangDang[n.name] === undefined) return Float64Array.from(n.matrix);
    const q = n.rotation ?? [0, 0, 0, 1];
    const them = bangDang[n.name];
    return tuTRS(
      n.translation ?? [0, 0, 0],
      them === undefined ? q : nhanQ(q, tuGoc(them)),
      n.scale ?? [1, 1, 1],
    );
  });

  // Ma tran the gioi: nhan don tu goc cay xuong. Moi node chi co mot cha trong glTF.
  const theGioi = new Array(nodes.length).fill(null);
  const goc = (j.scenes?.[j.scene ?? 0]?.nodes) ?? nodes.map((_, i) => i);
  const di = (i, cha) => {
    theGioi[i] = nhan(cha, rieng[i]);
    for (const con of nodes[i].children ?? []) di(con, theGioi[i]);
  };
  for (const i of goc) di(i, donVi());

  const ra = [];
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  for (let i = 0; i < nodes.length; i += 1) {
    const n = nodes[i];
    if (n.mesh === undefined) continue;
    // Node mang xuong: glTF bao bo qua ma tran cua chinh no, chi tinh theo xuong.
    const coXuong = n.skin !== undefined;
    const cuaNode = theGioi[i] ?? donVi();
    let xuong = null;
    let giu = null;
    if (coXuong) {
      const s = j.skins[n.skin];
      const ibm = s.inverseBindMatrices === undefined
        ? null : docAcc(j, dem, s.inverseBindMatrices);
      xuong = s.joints.map((k, c) => (ibm === null
        ? theGioi[k]
        : nhan(theGioi[k], ibm.slice(c * 16, c * 16 + 16))));
      giu = locXuong === null
        ? null : s.joints.map((k) => locXuong.includes(nodes[k].name));
    }

    for (const p of j.meshes[n.mesh].primitives) {
      // Che do ve khac tam giac (diem, duong) khong dung de nuong.
      if ((p.mode ?? 4) !== 4) continue;
      themPrim(j, dem, p, coXuong ? null : cuaNode, xuong, giu, traAnh, mauVl, ra, min, max);
    }
  }

  return { dinh: new Float32Array(ra), min, max, soTamGiac: ra.length / (BUOC * 3) };
}

/** Mau nhan va chi so anh cua mot material. O `anh` la CHI SO + 1; 0 nghia la khong anh. */
function vatLieu(j, p, traAnh, mauVl) {
  const m = j.materials?.[p.material];
  if (m === undefined) return { kd: [1, 1, 1], anh: 0 };
  const pbr = m.pbrMetallicRoughness ?? {};
  const son = mauVl[m.name];
  const kd = (pbr.baseColorFactor ?? [1, 1, 1]).slice(0, 3)
    .map((v, k) => v * (son === undefined ? 1 : son[k]));
  const te = pbr.baseColorTexture;
  if (te === undefined) return { kd, anh: 0 };
  const uri = j.images?.[j.textures[te.index].source]?.uri ?? '';
  const ten = decodeURIComponent(uri).split('/').pop();
  const c = traAnh === null ? 0 : traAnh(ten);
  return { kd, anh: c < 0 ? 0 : c + 1 };
}

/**
 * Ghi mot primitive vao mang dinh chung.
 *
 * `giu` la bang xuong-nao-duoc-giu (theo chi so khop trong skin), hay `null` = giu het.
 * Mot tam giac chi vao neu CA BA dinh deu bam vao xuong duoc giu, khong thi cat dau se
 * keo theo mot vanh tam giac noi sang co va vai.
 */
function themPrim(j, dem, p, cuaNode, xuong, giu, traAnh, mauVl, ra, min, max) {
  const vt = docAcc(j, dem, p.attributes.POSITION);
  const so = vt.length / 3;
  const pt = p.attributes.NORMAL === undefined ? null : docAcc(j, dem, p.attributes.NORMAL);
  const uv = p.attributes.TEXCOORD_0 === undefined ? null : docAcc(j, dem, p.attributes.TEXCOORD_0);
  const kh = p.attributes.JOINTS_0 === undefined ? null : docAcc(j, dem, p.attributes.JOINTS_0);
  const na = p.attributes.WEIGHTS_0 === undefined ? null : docAcc(j, dem, p.attributes.WEIGHTS_0);
  const chiSo = p.indices === undefined
    ? Array.from({ length: so }, (_, i) => i)
    : docAcc(j, dem, p.indices);
  const vl = vatLieu(j, p, traAnh, mauVl);

  // Tron da: moi dinh chiu tu mot toi bon xuong, cong lai theo trong so.
  const viTri = new Float64Array(so * 3);
  const phap = new Float64Array(so * 3);
  for (let i = 0; i < so; i += 1) {
    const x = vt[i * 3];
    const y = vt[i * 3 + 1];
    const z = vt[i * 3 + 2];
    const nx = pt === null ? 0 : pt[i * 3];
    const ny = pt === null ? 1 : pt[i * 3 + 1];
    const nz = pt === null ? 0 : pt[i * 3 + 2];
    if (xuong === null || kh === null || na === null) {
      const m = cuaNode ?? donVi();
      [viTri[i * 3], viTri[i * 3 + 1], viTri[i * 3 + 2]] = diem(m, x, y, z);
      [phap[i * 3], phap[i * 3 + 1], phap[i * 3 + 2]] = huong(m, nx, ny, nz);
      continue;
    }
    let tong = 0;
    for (let c = 0; c < 4; c += 1) {
      const w = na[i * 4 + c];
      if (w === 0) continue;
      const m = xuong[kh[i * 4 + c]];
      if (m === undefined) continue;
      const d = diem(m, x, y, z);
      const h = huong(m, nx, ny, nz);
      for (let k = 0; k < 3; k += 1) {
        viTri[i * 3 + k] += d[k] * w;
        phap[i * 3 + k] += h[k] * w;
      }
      tong += w;
    }
    // Goi xuat sai co the de tong trong so khac 1; chia lai cho khoi teo hay phinh dinh.
    if (tong > 0 && Math.abs(tong - 1) > 1e-4) {
      for (let k = 0; k < 3; k += 1) viTri[i * 3 + k] /= tong;
    }
  }

  // Dinh nao bam vao xuong bi loai thi ca tam giac chua no bi bo.
  const dinhGiu = giu === null || kh === null || na === null ? null : new Uint8Array(so);
  if (dinhGiu !== null) {
    for (let i = 0; i < so; i += 1) {
      let nang = 0;
      let khop = -1;
      for (let c = 0; c < 4; c += 1) {
        if (na[i * 4 + c] > nang) {
          nang = na[i * 4 + c];
          khop = kh[i * 4 + c];
        }
      }
      dinhGiu[i] = khop >= 0 && giu[khop] === true ? 1 : 0;
    }
  }

  for (let t = 0; t < chiSo.length; t += 3) {
    if (dinhGiu !== null && (dinhGiu[Math.round(chiSo[t])] === 0
      || dinhGiu[Math.round(chiSo[t + 1])] === 0
      || dinhGiu[Math.round(chiSo[t + 2])] === 0)) continue;
    for (let g = 0; g < 3; g += 1) themDinh(Math.round(chiSo[t + g]));
  }

  function themDinh(i) {
    const x = viTri[i * 3];
    const y = viTri[i * 3 + 1];
    const z = viTri[i * 3 + 2];
    if (x < min[0]) min[0] = x;
    if (y < min[1]) min[1] = y;
    if (z < min[2]) min[2] = z;
    if (x > max[0]) max[0] = x;
    if (y > max[1]) max[1] = y;
    if (z > max[2]) max[2] = z;
    const d = Math.hypot(phap[i * 3], phap[i * 3 + 1], phap[i * 3 + 2]) || 1;
    ra.push(
      x, y, z,
      // glTF dem `v` tu tren xuong, OBJ tu duoi len. Trang nuong theo loi OBJ nen lat lai.
      uv === null ? 0 : uv[i * 2], uv === null ? 0 : 1 - uv[i * 2 + 1],
      phap[i * 3] / d, phap[i * 3 + 1] / d, phap[i * 3 + 2] / d,
      vl.kd[0], vl.kd[1], vl.kd[2], vl.anh,
    );
  }
}
