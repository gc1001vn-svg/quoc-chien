/**
 * `byteStride: 0` trong glTF la XEP KHIT, khong phai buoc 0 byte.
 *
 * Model Google tren Icosa (ga, cuu, lon, chuong, xi-lo... tai tu kho-game) ghi dung vay.
 * Bo doc cu dung `??` nen hieu 0 la buoc 0: moi dinh doc trung mot diem, hop bao 0, sprite
 * ra rong - do 28/09 tren 20/20 model. Tach khoi `Gltf.test.ts` vi file do cham tran 300 dong.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docGltf } from '../tools/lib/gltf.mjs';

/** Mot tam giac (0,0,0) (0,1,0) (1,1,0), moi vung du lieu ghi `byteStride` cho truoc. */
function taoFile(buoc: number | undefined): string {
  const viTri = Buffer.from(new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0]).buffer);
  const chiSo = Buffer.from(new Uint16Array([0, 1, 2, 0]).buffer);
  const dem = Buffer.concat([viTri, chiSo]);
  const vung = (byteOffset: number, byteLength: number): object =>
    (buoc === undefined ? { buffer: 0, byteOffset, byteLength } : { buffer: 0, byteOffset, byteLength, byteStride: buoc });
  const j = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3' },
      { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
    ],
    bufferViews: [vung(0, viTri.length), vung(viTri.length, 6)],
    buffers: [{ byteLength: dem.length, uri: `data:application/octet-stream;base64,${dem.toString('base64')}` }],
  };
  const duong: string = join(mkdtempSync(join(tmpdir(), 'gltf-')), 'thu.gltf');
  writeFileSync(duong, JSON.stringify(j));
  return duong;
}

describe('docGltf doc byteStride', () => {
  it('`byteStride: 0` ra dung hop bao, y nhu khong ghi `byteStride`', () => {
    const khong = docGltf(taoFile(undefined));
    const bang0 = docGltf(taoFile(0));
    expect(bang0.min).toEqual([0, 0, 0]);
    expect(bang0.max).toEqual([1, 1, 0]);
    expect([...bang0.dinh]).toEqual([...khong.dinh]);
  });
});
