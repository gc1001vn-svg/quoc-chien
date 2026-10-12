/**
 * Buoc 5 ban do tinh xay theo luot (12/10): nha moc deu theo luot, xong thi loe sang. Buoc 6: suong mu ban do tinh.
 */
import { describe, expect, it } from 'vitest';
import soTho from '../data/tung_buoc.json';
import { phanDaXay, phanTan, sangXong, tinhThay } from '../src/render/VeBanDo';

describe('cong trinh tinh moc theo luot', () => {
  it('moc deu: vua dat lenh la 0, moi luot them 1/luot, giua luot thi o giua, het luot cuoi la du', () => {
    expect(phanDaXay(4, 4, 0)).toBe(0);
    expect(phanDaXay(4, 3, 0)).toBeCloseTo(0.25);
    expect(phanDaXay(4, 3, 0.5)).toBeCloseTo(0.375);
    expect(phanDaXay(4, 1, 0.99)).toBeLessThan(1);
    expect(phanDaXay(4, 0, 0.5)).toBe(1);
  });

  it('loe sang giam dan ve 0 trong loeGiay, truoc va sau thi tat', () => {
    const loe = soTho.xayTinh.loeGiay;
    expect(sangXong(0)).toBeCloseTo(soTho.sangLoe);
    expect(sangXong(loe / 2)).toBeCloseTo(soTho.sangLoe / 2);
    expect(sangXong(loe)).toBe(0);
    expect(sangXong(-0.1)).toBe(0);
    expect(sangXong(0)).toBeLessThan(0.5);
  });
});

describe('suong mu ban do tinh (Buoc 6)', () => {
  // a - b - c - d thanh mot hang; ta giu a.
  const ke = new Map([['a', new Set(['b'])], ['b', new Set(['a', 'c'])], ['c', new Set(['b', 'd'])], ['d', new Set(['c'])]]);
  const chu = (cua: Record<string, string>) => (id: string): string => cua[id] ?? '';

  it('thay tinh cua ta va tinh giap, con lai duoi suong; chiem them thi thay xa hon', () => {
    expect([...tinhThay(['a', 'b', 'c', 'd'], chu({ a: 'ta', b: 'dich' }), 'ta', ke)].sort()).toEqual(['a', 'b']);
    expect([...tinhThay(['a', 'b', 'c', 'd'], chu({ a: 'ta', b: 'ta' }), 'ta', ke)].sort()).toEqual(['a', 'b', 'c']);
  });

  it('suong tan deu trong tanGiay', () => {
    const giay = soTho.suong.tanGiay;
    expect(phanTan(0)).toBe(0);
    expect(phanTan(giay / 2)).toBeCloseTo(0.5);
    expect(phanTan(giay * 2)).toBe(1);
    expect(soTho.suong.sang).toBeLessThan(0.5);
  });
});
