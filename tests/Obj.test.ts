/**
 * Bo doc OBJ cua may nuong: `tools/lib/obj.mjs`.
 *
 * VI SAO TU DUNG FILE OBJ TI HON chu khong doc goi that: `assets_source/` khong len git,
 * CI khong co no. Bai test phai chay duoc o may khong co goc asset nao - cung le voi
 * `tests/Gltf.test.ts`.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docObj, BUOC } from '../tools/lib/obj.mjs';

/**
 * Hai tam giac, mot material, nhung toa do anh roi vao HAI COT khac nhau cua bang mau:
 * tam giac dau o `u = 0.09` (cot 1 khi chia 16), tam giac sau o `u = 0.47` (cot 7).
 *
 * Day dung la hinh dang cua goi Kenney City Kit: ca goi mot material ten `colormap`, phan
 * biet mau bang CHO NGOI trong bang mau chu khong bang ten material.
 */
function taoFileObj(): string {
  const noi = [
    'mtllib thu.mtl',
    'v 0 0 0', 'v 1 0 0', 'v 0 1 0', 'v 2 0 0',
    'vt 0.0938 0.3', 'vt 0.4688 0.3',
    'vn 0 1 0',
    'usemtl colormap',
    'f 1/1/1 2/1/1 3/1/1',
    'f 2/2/1 4/2/1 3/2/1',
  ].join('\n');
  const thuMuc: string = mkdtempSync(join(tmpdir(), 'obj-'));
  const duong: string = join(thuMuc, 'thu.obj');
  writeFileSync(duong, noi);
  writeFileSync(join(thuMuc, 'thu.mtl'), 'newmtl colormap\nKd 1 1 1\nmap_Kd Textures/colormap.png\n');
  return duong;
}

/** Mau (r, g, b) cua dinh thu `i` trong mang dinh phang. */
function mauDinh(dinh: Float32Array, i: number): number[] {
  return [dinh[i * BUOC + 8] ?? 0, dinh[i * BUOC + 9] ?? 0, dinh[i * BUOC + 10] ?? 0];
}

describe('docObj', () => {
  const duong: string = taoFileObj();

  it('khong son gi thi moi dinh giu mau Kd cua material', () => {
    const r = docObj(duong);
    expect(r.soTamGiac).toBe(2);
    expect(mauDinh(r.dinh, 0)).toEqual([1, 1, 1]);
    expect(mauDinh(r.dinh, 3)).toEqual([1, 1, 1]);
  });

  it('mau_cot son theo COT bang mau, hai phan cung material van tach duoc', () => {
    const r = docObj(duong, {}, false, null, { mau: { 1: [2, 0, 0] } });
    // Tam giac dau nam o cot 1 -> do; tam giac sau o cot 7 -> khong dung toi.
    expect(mauDinh(r.dinh, 0)).toEqual([2, 0, 0]);
    expect(mauDinh(r.dinh, 2)).toEqual([2, 0, 0]);
    expect(mauDinh(r.dinh, 3)).toEqual([1, 1, 1]);
  });

  it('mau_cot nhan CHONG voi mau cua material, khong thay the', () => {
    const r = docObj(duong, { colormap: [0.5, 0.5, 0.5] }, false, null, { mau: { 7: [2, 2, 2] } });
    expect(mauDinh(r.dinh, 0)).toEqual([0.5, 0.5, 0.5]);
    expect(mauDinh(r.dinh, 3)).toEqual([1, 1, 1]);
  });

  it('so cot khai khac thi cot doi theo', () => {
    // Chia 8 cot thi ca hai toa do deu roi vao cot 0 va 3, khong con la 1 va 7.
    const r = docObj(duong, {}, false, null, { so: 8, mau: { 0: [3, 0, 0], 3: [0, 3, 0] } });
    expect(mauDinh(r.dinh, 0)).toEqual([3, 0, 0]);
    expect(mauDinh(r.dinh, 3)).toEqual([0, 3, 0]);
  });
});
