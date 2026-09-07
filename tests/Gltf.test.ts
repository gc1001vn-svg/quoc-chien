/**
 * Bo doc glTF cua may nuong: `tools/lib/gltf.mjs`.
 *
 * VI SAO TU DUNG FILE glTF TI HON chu khong doc goi that: `assets_source/` khong len git
 * (440 MB), CI khong co no. Bai test phai chay duoc o may khong co goc asset nao.
 *
 * File dung o day co dung mot tam giac va hai xuong, nhung du de bat ba loi nang nhat:
 * tron da sai, xoay xuong sai chieu, va lat toa do anh thieu.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docGltf } from '../tools/lib/gltf.mjs';

/**
 * Dung mot file glTF ti hon: mot tam giac, hai xuong.
 *
 *   dinh 0 (0,0,0) bam xuong `root`
 *   dinh 1 (0,1,0) bam xuong `canh` - dung ngay tai goc cua xuong do
 *   dinh 2 (1,1,0) bam xuong `canh` - cach goc xuong mot don vi theo truc x
 */
function taoFileGltf(): string {
  const viTri = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0]);
  const phap = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
  const uv = new Float32Array([0, 0, 0, 0.25, 1, 1]);
  const khop = new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
  const nang = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
  const chiSo = new Uint16Array([0, 1, 2]);
  // Nghich dao ma tran tu the buoc: `root` o goc nen la ma tran don vi; `canh` dich len
  // mot don vi nen nghich dao la dich xuong mot don vi.
  const nghichDao = new Float32Array([
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -1, 0, 1,
  ]);

  const phan = [viTri, phap, uv, khop, nang, chiSo, nghichDao];
  const bo: Buffer[] = [];
  const khuc: { do: number; dai: number }[] = [];
  let moc = 0;
  for (const m of phan) {
    const b = Buffer.from(m.buffer, m.byteOffset, m.byteLength);
    // glTF doi moi vung bat dau o boi so cua co thanh phan; dem cho tron.
    const chen = (4 - (moc % 4)) % 4;
    if (chen > 0) {
      bo.push(Buffer.alloc(chen));
      moc += chen;
    }
    bo.push(b);
    khuc.push({ do: moc, dai: b.length });
    moc += b.length;
  }
  const dem = Buffer.concat(bo);

  const acc = (i: number, loai: string, kieu: number, so: number): unknown => ({
    bufferView: i, componentType: kieu, count: so, type: loai,
  });
  const j = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0, 3] }],
    nodes: [
      { name: 'root', children: [1] },
      { name: 'canh', translation: [0, 1, 0] },
      { name: 'khong_dung' },
      { name: 'luoi', mesh: 0, skin: 0 },
    ],
    skins: [{ joints: [0, 1], inverseBindMatrices: 6 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2, JOINTS_0: 3, WEIGHTS_0: 4 },
        indices: 5,
      }],
    }],
    accessors: [
      acc(0, 'VEC3', 5126, 3), acc(1, 'VEC3', 5126, 3), acc(2, 'VEC2', 5126, 3),
      acc(3, 'VEC4', 5121, 3), acc(4, 'VEC4', 5126, 3), acc(5, 'SCALAR', 5123, 3),
      acc(6, 'MAT4', 5126, 2),
    ],
    bufferViews: khuc.map((k) => ({ buffer: 0, byteOffset: k.do, byteLength: k.dai })),
    buffers: [{ byteLength: dem.length, uri: `data:application/octet-stream;base64,${dem.toString('base64')}` }],
  };

  const thuMuc: string = mkdtempSync(join(tmpdir(), 'gltf-'));
  const duong: string = join(thuMuc, 'thu.gltf');
  writeFileSync(duong, JSON.stringify(j));
  return duong;
}

/** Lay toa do cua dinh thu `i` trong mang dinh phang. */
function dinhThu(dinh: Float32Array, i: number): number[] {
  return [dinh[i * 12] ?? 0, dinh[i * 12 + 1] ?? 0, dinh[i * 12 + 2] ?? 0];
}

describe('docGltf', () => {
  const duong: string = taoFileGltf();

  it('khong co dang thi tra ve dung dinh goc', () => {
    const r = docGltf(duong);
    expect(r.soTamGiac).toBe(1);
    expect(dinhThu(r.dinh, 0)).toEqual([0, 0, 0]);
    expect(dinhThu(r.dinh, 1)).toEqual([0, 1, 0]);
    expect(dinhThu(r.dinh, 2)).toEqual([1, 1, 0]);
  });

  it('lat toa do anh, vi glTF dem v tu tren xuong con OBJ tu duoi len', () => {
    const r = docGltf(duong);
    expect(r.dinh[3 + 12]).toBeCloseTo(0);
    expect(r.dinh[4 + 12]).toBeCloseTo(0.75);
  });

  it('xoay mot xuong thi keo theo dung phan thit bam vao no', () => {
    // Xoay `canh` 90 do quanh truc z: dinh nam ngay goc xuong dung yen, dinh cach goc
    // mot don vi theo x bi quay len thanh mot don vi theo y.
    const r = docGltf(duong, { dang: { canh: [0, 0, 90] } });
    expect(dinhThu(r.dinh, 0)).toEqual([0, 0, 0]);
    const d1 = dinhThu(r.dinh, 1);
    const d2 = dinhThu(r.dinh, 2);
    expect(d1[0]).toBeCloseTo(0);
    expect(d1[1]).toBeCloseTo(1);
    expect(d2[0]).toBeCloseTo(0);
    expect(d2[1]).toBeCloseTo(2);
  });

  it('guong doi ben trai voi ben phai cua bang dang', () => {
    // Bang dang chi noi ve `canh_l`, ma file khong co xuong do -> khong gi doi. Guong
    // cung khong the tu bia ra xuong moi.
    const r = docGltf(duong, { dang: { canh_l: [0, 0, 90] }, guong: true });
    expect(dinhThu(r.dinh, 2)).toEqual([1, 1, 0]);
  });

  it('loc theo xuong: tam giac nao co mot dinh bam xuong bi loai thi bo ca tam giac', () => {
    expect(docGltf(duong, { xuong: ['canh'] }).soTamGiac).toBe(0);
    expect(docGltf(duong, { xuong: ['root', 'canh'] }).soTamGiac).toBe(1);
  });
});
