/**
 * Buoc 5 ban do tinh xay theo luot (12/10): nha moc deu theo luot va phan luot dang chay, xong thi loe sang.
 */
import { describe, expect, it } from 'vitest';
import soTho from '../data/tung_buoc.json';
import { phanDaXay, sangXong } from '../src/render/VeBanDo';

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
