/**
 * Doc file OBJ cua Kenney.
 *
 * VI SAO KHONG DUNG THU VIEN: gan nhu ca goi Kenney dung mot material duy nhat tro toi
 * mot anh `Textures/colormap.png`, va file OBJ chi co `v` `vt` `vn` `f` `usemtl`. Doc bang
 * tay het chua tram dong, keo ca thu vien 3D vao chi de doc bay nhieu la lo. Luat
 * "thu vien do hoa ngoai = 0" o TECH_SPEC muc 2.
 *
 * Mot ngoai le: 10 model co them material `Water` khong co anh, chi co mau phang `Kd`.
 * Bo qua no thi be nuoc va gieng ra loang lo den-do vi toa do anh tro vao cho trong.
 * Nen moi dinh mang theo ca mau va co `anh` (1 = lay mau tu anh, 0 = lay mau phang).
 *
 * Tra ve mang dinh phang [x,y,z, u,v, nx,ny,nz, r,g,b, anh] * 3 dinh moi tam giac.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** So so thuc moi dinh. */
export const BUOC = 12;

/** Doc file .mtl nam canh file .obj: ten material -> mau phang va co dung anh khong. */
function docMtl(duong) {
  const bang = new Map();
  let ten = '';
  try {
    for (const dong of readFileSync(duong, 'utf8').split('\n')) {
      const p = dong.trim().split(/\s+/);
      if (p[0] === 'newmtl') {
        ten = p[1];
        bang.set(ten, { kd: [1, 1, 1], anh: 0 });
      } else if (p[0] === 'Kd' && bang.has(ten)) {
        bang.get(ten).kd = [Number(p[1]), Number(p[2]), Number(p[3])];
      } else if (p[0] === 'map_Kd' && bang.has(ten)) {
        bang.get(ten).anh = 1;
      }
    }
  } catch {
    // Khong co .mtl thi coi nhu ca file dung anh.
  }
  return bang;
}

/**
 * @param {string} duong Duong dan file .obj
 * @returns {{dinh: Float32Array, min: number[], max: number[], soTamGiac: number}}
 */
export function docObj(duong) {
  const mtl = docMtl(join(dirname(duong), `${duong.split('/').pop().replace(/\.obj$/, '')}.mtl`));
  let vatLieu = { kd: [1, 1, 1], anh: 1 };
  const v = [];
  const vt = [];
  const vn = [];
  const ra = [];
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  for (const dong of readFileSync(duong, 'utf8').split('\n')) {
    const p = dong.trim().split(/\s+/);
    if (p[0] === 'v') {
      const x = Number(p[1]);
      const y = Number(p[2]);
      const z = Number(p[3]);
      v.push([x, y, z]);
      if (x < min[0]) min[0] = x;
      if (y < min[1]) min[1] = y;
      if (z < min[2]) min[2] = z;
      if (x > max[0]) max[0] = x;
      if (y > max[1]) max[1] = y;
      if (z > max[2]) max[2] = z;
    } else if (p[0] === 'vt') {
      vt.push([Number(p[1]), Number(p[2])]);
    } else if (p[0] === 'vn') {
      vn.push([Number(p[1]), Number(p[2]), Number(p[3])]);
    } else if (p[0] === 'usemtl') {
      vatLieu = mtl.get(p[1]) ?? { kd: [1, 1, 1], anh: 1 };
    } else if (p[0] === 'f') {
      // Mat co the 3, 4 hay nhieu canh -> chia thanh quat tam giac.
      const goc = p.slice(1);
      for (let i = 1; i + 1 < goc.length; i += 1) {
        for (const ten of [goc[0], goc[i], goc[i + 1]]) {
          const [a, b, c] = ten.split('/');
          const toaDo = v[chiSo(a, v.length)] ?? [0, 0, 0];
          const anh = b === undefined || b === '' ? [0, 0] : (vt[chiSo(b, vt.length)] ?? [0, 0]);
          const phap = c === undefined || c === '' ? [0, 1, 0] : (vn[chiSo(c, vn.length)] ?? [0, 1, 0]);
          ra.push(
            toaDo[0], toaDo[1], toaDo[2], anh[0], anh[1], phap[0], phap[1], phap[2],
            vatLieu.kd[0], vatLieu.kd[1], vatLieu.kd[2], vatLieu.anh,
          );
        }
      }
    }
  }

  return { dinh: new Float32Array(ra), min, max, soTamGiac: ra.length / (BUOC * 3) };
}

/** OBJ danh so tu 1; so am la dem nguoc tu cuoi. */
function chiSo(chuoi, tong) {
  const n = Number(chuoi);
  return n < 0 ? tong + n : n - 1;
}
