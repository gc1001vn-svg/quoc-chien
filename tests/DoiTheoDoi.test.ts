/**
 * Len doi phai thay ro (Phase 12D): nen, duong va nguoi khong duoc y nguyen giua hai doi
 * ke nhau. Truoc 12D do tay 28/09: 7/7 o nen va 16/16 nguoi y nguyen o bon trong nam lan
 * len doi - chu du an bao "van khong ro". Day la con so do, thanh thuoc may bat.
 *
 * So CONG THUC trong `tools/me/*.json` (sau khi go `nhu`), khong so anh: cong thuc giong
 * thi anh nuong ra giong.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import canBang from '../data/balance.json';

const NEN = ['o_co', 'o_dat', 'o_duong', 'o_duong_lat', 'o_cat', 'o_da', 'o_ruong'];
const NGUOI: string[] = [];
for (const kieu of ['nam', 'nu']) {
  for (let h = 0; h < 4; h += 1) for (let d = 0; d < 2; d += 1) NGUOI.push(`nguoi_${kieu}_${String(h)}_${String(d)}`);
}

type CongThuc = Record<string, unknown>;
const docMe = (me: string): CongThuc =>
  (JSON.parse(readFileSync(`tools/me/${me}.json`, 'utf8')) as { sprite: CongThuc }).sprite;

/** Cong thuc da go `nhu` - ban sao xoay cua sprite goc thi mang theo cong thuc goc. */
function congThuc(bo: CongThuc, ten: string): string {
  const c = bo[ten] as { nhu?: string } | undefined;
  if (c === undefined) throw new Error(`thieu sprite ${ten}`);
  if (!Array.isArray(c) && c.nhu !== undefined) return `${congThuc(bo, c.nhu)}|${JSON.stringify({ ...c, nhu: undefined })}`;
  return JSON.stringify(c);
}

const meCuaDoi: string[] = canBang.thoiDai.map((d) => d.me);

/**
 * Cap doi con CHUNG me - tach me rieng doi 4 la viec Phase 12E. Ghi ro o day thay vi bo qua
 * test: them mot cap chung me moi ma khong ghi vao day la do.
 */
const CHUNG_ME_CHO_12E = ['3->4'];

describe('len doi thay ro: nen va nguoi doi theo doi', () => {
  for (let i = 1; i < meCuaDoi.length; i += 1) {
    const truoc = meCuaDoi[i - 1] as string;
    const sau = meCuaDoi[i] as string;
    const cap = `${String(i)}->${String(i + 1)}`;
    it(`doi ${cap} (${truoc} -> ${sau}): khong o nen, khong dang nguoi nao y nguyen`, () => {
      if (truoc === sau) {
        expect(CHUNG_ME_CHO_12E).toContain(cap);
        return;
      }
      const a = docMe(truoc);
      const b = docMe(sau);
      const giong = [...NEN, ...NGUOI].filter((t) => congThuc(a, t) === congThuc(b, t));
      expect(giong).toEqual([]);
    });
  }
});
