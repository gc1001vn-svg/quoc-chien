/**
 * Chong lop clip (25/09): nguoi cuoi ngua giu dang ngoi o than duoi, than tren chay nhat
 * chem. Lop co `tuXuong` chi duoc de len xuong do va xuong con cua no.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docGltf } from '../tools/lib/gltf.mjs';

/**
 * Chuoi ba xuong `goc` -> `than` -> `tay`, moi xuong dich len 1. Mot tam giac: dinh 0 bam
 * `goc` o (0,0,0), dinh 1 bam `than` o (0,1,0), dinh 2 bam `tay` o (1,2,0). Hai clip:
 * `nga` xoay `goc` 90 do quanh z, `vung` xoay `than` 90 do quanh z.
 */
function taoFile(): string {
  const s = Math.SQRT1_2;
  const phan: ArrayBufferView[] = [
    new Float32Array([0, 0, 0, 0, 1, 0, 1, 2, 0]),
    new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]),
    new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
    new Float32Array([...[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], ...[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -1, 0, 1], ...[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -2, 0, 1]]),
    new Float32Array([0, 1]),
    new Float32Array([0, 0, 0, 1, 0, 0, s, s]),
  ];
  const bv: { buffer: number; byteOffset: number; byteLength: number }[] = [];
  let moc = 0;
  for (const p of phan) {
    bv.push({ buffer: 0, byteOffset: moc, byteLength: p.byteLength });
    moc += p.byteLength;
  }
  const dem = Buffer.concat(phan.map((p) => Buffer.from(p.buffer, p.byteOffset, p.byteLength)));
  const acc = (v: number, t: string, c: number, n: number): unknown => ({ bufferView: v, componentType: c, count: n, type: t });
  const clip = (ten: string, node: number): unknown => ({
    name: ten, channels: [{ sampler: 0, target: { node, path: 'rotation' } }], samplers: [{ input: 4, output: 5 }],
  });
  const j = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0, 3] }],
    nodes: [{ name: 'goc', children: [1] }, { name: 'than', translation: [0, 1, 0], children: [2] }, { name: 'tay', translation: [0, 1, 0] }, { name: 'luoi', mesh: 0, skin: 0 }],
    skins: [{ joints: [0, 1, 2], inverseBindMatrices: 3 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, JOINTS_0: 1, WEIGHTS_0: 2 } }] }],
    accessors: [acc(0, 'VEC3', 5126, 3), acc(1, 'VEC4', 5121, 3), acc(2, 'VEC4', 5126, 3), acc(3, 'MAT4', 5126, 3), acc(4, 'SCALAR', 5126, 2), acc(5, 'VEC4', 5126, 2)],
    animations: [clip('nga', 0), clip('vung', 1)],
    bufferViews: bv,
    buffers: [{ byteLength: dem.length, uri: `data:application/octet-stream;base64,${dem.toString('base64')}` }],
  };
  const duong: string = join(mkdtempSync(join(tmpdir(), 'lop-')), 'lop.gltf');
  writeFileSync(duong, JSON.stringify(j));
  return duong;
}

function dinh(r: { dinh: Float32Array }, i: number): number[] {
  return [r.dinh[i * 12] ?? 0, r.dinh[i * 12 + 1] ?? 0];
}

describe('docGltf chong lop clip', () => {
  const f: string = taoFile();

  it('mot lop nhu cu: `vung` xoay than, tay quay theo', () => {
    const d = dinh(docGltf(f, { hoatAnh: { duong: f, ten: 'vung', phan: 1 } }), 2);
    expect(d[0]).toBeCloseTo(-1);
    expect(d[1]).toBeCloseTo(2);
  });

  it('lop sau co tuXuong chi de len xuong con: `nga` bi chan o goc, `vung` van chay', () => {
    // `nga` dat o lop sau nhung chi cho xuong tu `than` tro xuong - xuong `goc` KHONG xoay.
    const r = docGltf(f, { hoatAnh: [{ duong: f, ten: 'vung', phan: 1 }, { duong: f, ten: 'nga', phan: 1, tuXuong: 'than' }] });
    const d = dinh(r, 2);
    expect(d[0]).toBeCloseTo(-1);
    expect(d[1]).toBeCloseTo(2);
  });

  it('lop sau khong tuXuong thi de len het', () => {
    const r = docGltf(f, { hoatAnh: [{ duong: f, ten: 'vung', phan: 1 }, { duong: f, ten: 'nga', phan: 1 }] });
    // `nga` chi co kenh cho `goc`, nen `than` van giu tu the cua `vung`: goc 90 do cong
    // than 90 do = tay quay 180 do.
    const d = dinh(r, 2);
    expect(d[0]).toBeCloseTo(-2);
    expect(d[1]).toBeCloseTo(-1);
  });

  it('tuXuong sai ten thi bao loi', () => {
    expect(() => docGltf(f, { hoatAnh: [{ duong: f, ten: 'nga', phan: 1, tuXuong: 'chan' }] })).toThrow(/khong co xuong "chan"/);
  });
});
