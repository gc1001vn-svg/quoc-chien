/**
 * Bang chinh so: so luu phai ap dung, so hong hay ngoai khoang khong duoc lam hong van choi,
 * va moi num trong `data/bang_chinh.json` phai tro toi mot so that.
 */
import { describe, expect, it } from 'vitest';
import bang from '../data/bang_chinh.json';
import policy from '../data/policy.json';
import walkers from '../data/walkers.json';
import balance from '../data/balance.json';
import { apSoPhu, chiKhacGoc, docSoPhu, laySoGoc, vietChepSo, type BoTep, type Num } from '../src/ui/ChinhSo.ts';

const NUM: readonly Num[] = bang.num;
function boMoi(): BoTep {
  return { policy: { ...policy }, walkers: { ...walkers }, balance: { ...balance } };
}

describe('bang chinh so', () => {
  it('moi num tro toi mot so that, va so goc nam trong khoang keo', () => {
    const goc = laySoGoc(NUM, boMoi());
    for (const n of NUM) {
      const v = goc[`${n.tep}.${n.truong}`] ?? Number.NaN;
      expect(v, `${n.tep}.${n.truong}`).toBeGreaterThanOrEqual(n.min);
      expect(v, `${n.tep}.${n.truong}`).toBeLessThanOrEqual(n.max);
    }
  });

  it('so luu hop le thi ap vao dung file', () => {
    const bo = boMoi();
    const daAp = apSoPhu(NUM, bo, docSoPhu('{"policy.gioNoDu":7,"walkers.moiChuyen":8}'));
    expect(daAp).toEqual(['policy.gioNoDu', 'walkers.moiChuyen']);
    expect(bo['policy']?.['gioNoDu']).toBe(7);
    expect(bo['walkers']?.['moiChuyen']).toBe(8);
  });

  it('so ngoai khoang, khoa la, chuoi hong: bo qua, giu so goc', () => {
    const bo = boMoi();
    expect(docSoPhu('{hong')).toEqual({});
    expect(docSoPhu('[1,2]')).toEqual({});
    expect(docSoPhu('{"policy.gioNoDu":"7"}')).toEqual({});
    const daAp = apSoPhu(NUM, bo, { 'policy.gioNoDu': 999, 'policy.nguongDinh': 1 });
    expect(daAp).toEqual([]);
    expect(bo['policy']?.['gioNoDu']).toBe(policy.gioNoDu);
    expect(bo['policy']?.['nguongDinh']).toBe(policy.nguongDinh);
  });

  it('num tro toi truong khong phai so thi nem loi ngay', () => {
    const sai: Num[] = [{ tep: 'policy', truong: 'nhaDanMoi', nhan: 'x', min: 0, max: 1, buoc: 1 }];
    expect(() => laySoGoc(sai, boMoi())).toThrow(/khong phai so/);
  });

  it('chep so chi ghi dong da doi', () => {
    const goc = laySoGoc(NUM, boMoi());
    expect(vietChepSo(NUM, goc, goc)).toBe('Chưa đổi số nào.');
    const chu = vietChepSo(NUM, goc, { ...goc, 'policy.gioNoDu': 6 });
    expect(chu).toBe(`data/policy.json > gioNoDu: ${String(policy.gioNoDu)} → 6`);
  });

  it('luu chi so khac goc', () => {
    const goc = laySoGoc(NUM, boMoi());
    expect(chiKhacGoc(goc, { ...goc, 'policy.gioNoDu': 9 })).toEqual({ 'policy.gioNoDu': 9 });
  });
});
