/**
 * `scripts/kiem_cheo.mjs --so-sanh`: may doi chieu hai lan chay thuoc (Claude va Jules).
 * Lech so ma no bao KHOP thi ca quy trinh kiem cheo vo nghia - nen test chinh duong so sanh.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = {
  commitGoc: 'abc1234',
  fileDoi: ['tests/B.test.ts', 'tests/A.test.ts'],
  thuoc: {
    lint: { ma: 0, giay: 7.1, so: {} },
    test: { ma: 0, giay: 35, so: { hong: 0, dat: 363, tong: 363 } },
    'sim:tran': { ma: 0, giay: 1.2, so: { lech: '2.24', trongKhung: '81.0', brier: '0.12' } },
  },
};

/** Ghi hai file ket qua roi chay `--so-sanh`. */
function soSanh(hai: unknown): { ma: number; chu: string } {
  const thu: string = mkdtempSync(join(tmpdir(), 'kiem-cheo-'));
  const a: string = join(thu, 'mot.json');
  const b: string = join(thu, 'hai.json');
  writeFileSync(a, JSON.stringify(GOC));
  writeFileSync(b, JSON.stringify(hai));
  const r = spawnSync('node', ['scripts/kiem_cheo.mjs', '--so-sanh', a, b], { encoding: 'utf8' });
  return { ma: r.status ?? -1, chu: `${r.stdout}${r.stderr}` };
}

describe('kiem_cheo --so-sanh', () => {
  it('hai file giong nhau thi KHOP, ma thoat 0', () => {
    const r = soSanh(GOC);
    expect(r.ma).toBe(0);
    expect(r.chu).toMatch(/KHOP/);
  });

  it('chi khac thoi gian chay thi van KHOP - may Jules cham hon khong phai lech', () => {
    const r = soSanh({ ...GOC, thuoc: { ...GOC.thuoc, test: { ...GOC.thuoc.test, giay: 90 } } });
    expect(r.ma).toBe(0);
  });

  it('thu tu file doi khac nhau thi van KHOP', () => {
    const r = soSanh({ ...GOC, fileDoi: [...GOC.fileDoi].reverse() });
    expect(r.ma).toBe(0);
  });

  it('so test lech thi LECH, ma thoat 1, ke ra thuoc lech', () => {
    const r = soSanh({ ...GOC, thuoc: { ...GOC.thuoc, test: { ma: 0, giay: 35, so: { hong: 0, dat: 351, tong: 351 } } } });
    expect(r.ma).toBe(1);
    expect(r.chu).toMatch(/test so lieu/);
  });

  it('ma thoat lech, commit goc lech, file doi lech deu bi bat', () => {
    expect(soSanh({ ...GOC, thuoc: { ...GOC.thuoc, lint: { ma: 1, giay: 7, so: {} } } }).chu).toMatch(/lint ma thoat/);
    expect(soSanh({ ...GOC, commitGoc: 'def5678' }).chu).toMatch(/commit goc/);
    expect(soSanh({ ...GOC, fileDoi: ['src/x.ts'] }).chu).toMatch(/file doi/);
  });

  it('file thu hai thieu mot thuoc thi LECH', () => {
    const { lint, test } = GOC.thuoc;
    const r = soSanh({ ...GOC, thuoc: { lint, test } });
    expect(r.ma).toBe(1);
    expect(r.chu).toMatch(/sim:tran: chi co o/);
  });
});
