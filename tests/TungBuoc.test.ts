/**
 * Tien do xay nha tung buoc (Buoc 1, 04/10): `src/render/TungBuoc.ts` la ham thuan cua nhip mo phong.
 * Luat qua nhieu hat giong (nhip khoi cong sim ghi) o `tests/BatBienXay.test.ts` [TP16].
 */
import { describe, expect, it } from 'vitest';
import { SO_XAY, XONG, catTren, tienDoTheoPhan, tienDoXay } from '../src/render/TungBuoc.ts';

const T = SO_XAY.thoiLuongNhip;

describe('TungBuoc - tien do theo nhip', () => {
  it('so trong data hop le: bon chang theo thu tu, chop sang duoi muc shader nhan', () => {
    expect(T).toBeGreaterThan(0);
    expect(0 < SO_XAY.mong && SO_XAY.mong < SO_XAY.xongMoc && SO_XAY.xongMoc < 1).toBe(true);
    expect(SO_XAY.sangLoe).toBeGreaterThanOrEqual(0);
    expect(SO_XAY.sangLoe).toBeLessThan(0.5);
  });

  it('vat co tu dau van (khong nhip khoi cong) luon xong', () => {
    expect(tienDoXay(undefined, 0)).toEqual(XONG);
    expect(tienDoXay(undefined, 123_456)).toEqual(XONG);
  });

  it('di dung bon chang, xong dung nhip thu `thoiLuongNhip`, hien va t khong bao gio lui', () => {
    const n0 = 36_000;
    let truoc = tienDoXay(n0, n0);
    expect(truoc.giaiDoan).toBe('mong');
    expect(truoc.hien).toBe(0);
    const thay = new Set<string>();
    for (let d = 0; d <= T; d += 1) {
      const p = tienDoXay(n0, n0 + d);
      thay.add(p.giaiDoan);
      expect(p.t).toBeGreaterThanOrEqual(truoc.t);
      expect(p.hien).toBeGreaterThanOrEqual(truoc.hien);
      expect(p.sang).toBeLessThan(0.5);
      truoc = p;
    }
    expect([...thay]).toEqual(['mong', 'moc', 'loe', 'xong']);
    expect(tienDoXay(n0, n0 + T - 1).giaiDoan).not.toBe('xong');
    expect(tienDoXay(n0, n0 + T)).toEqual(XONG);
  });

  it('chi phu thuoc so nhip da troi: dung, tua, khoi cong luc nao cung ra cung hinh', () => {
    for (const d of [0, 1, 17, Math.floor(T / 2), T - 1, T, T * 40]) {
      expect(tienDoXay(5, 5 + d)).toEqual(tienDoXay(987_654, 987_654 + d));
      expect(tienDoXay(5, 5 + d)).toEqual(tienDoTheoPhan(d / T));
    }
  });

  it('chop sang chi o chang loe, giam dan ve 0', () => {
    expect(tienDoTheoPhan(SO_XAY.mong).sang).toBe(0);
    const dau = tienDoTheoPhan(SO_XAY.xongMoc);
    const sau = tienDoTheoPhan((SO_XAY.xongMoc + 1) / 2);
    expect(dau.giaiDoan).toBe('loe');
    expect(dau.sang).toBeCloseTo(SO_XAY.sangLoe);
    expect(sau.sang).toBeLessThan(dau.sang);
  });

  it('cat sprite: muc giu day hien ngay, moc het la nguyen hinh, v di cung y', () => {
    // Sprite cao 100 diem anh (y 0..100), uv doc 0,2..0,6, giu tu y 70 tro xuong.
    expect(catTren(0, 0, 100, 70, 0.2, 0.6)).toEqual([70, 0.2 + 0.4 * 0.7]);
    expect(catTren(1, 0, 100, 70, 0.2, 0.6)).toEqual([0, 0.2]);
    const [y, v] = catTren(0.5, 0, 100, 70, 0.2, 0.6);
    expect(y).toBeCloseTo(35);
    expect(v).toBeCloseTo(0.2 + 0.4 * 0.35);
    // Muc giu nam ngoai sprite thi kep vao trong.
    expect(catTren(0, 0, 100, 140, 0.2, 0.6)[0]).toBe(100);
  });
});
