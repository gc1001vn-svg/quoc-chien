/**
 * Thuat xep atlas cua may nuong: `tools/lib/xep.mjs`.
 */
import { describe, expect, it } from 'vitest';
import { xep } from '../tools/lib/xep.mjs';

describe('xep', () => {
  it('o thap hon lap vao cho trong cuoi trang cu, khong mo trang moi', () => {
    // Canh 100, le 0: ke 60 roi ke 30 -> con 10 diem anh cuoi trang.
    // O 45 khong vua -> sang trang 1; o 8 van vua cho trong cua trang 0.
    const r = xep([
      { ten: 'a', w: 100, h: 60 },
      { ten: 'b', w: 100, h: 30 },
      { ten: 'c', w: 50, h: 45 },
      { ten: 'd', w: 50, h: 8 },
    ], 100, 0);
    const trang = Object.fromEntries(r.o.map((o) => [o.ten, o.trang]));
    expect(trang).toEqual({ a: 0, b: 0, c: 1, d: 0 });
    expect(r.soTrang).toBe(2);
  });

  it('khong o nao chong len nhau, khong o nao ra ngoai trang', () => {
    const o = Array.from({ length: 40 }, (_, i) => ({ ten: `o${String(i)}`, w: 10 + ((i * 7) % 30), h: 5 + ((i * 13) % 40) }));
    const r = xep(o, 128, 2);
    for (const a of r.o) {
      expect(a.x + a.w).toBeLessThanOrEqual(128);
      expect(a.y + a.h).toBeLessThanOrEqual(128);
      for (const b of r.o) {
        if (a === b || a.trang !== b.trang) continue;
        const tach = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
        expect(tach).toBe(true);
      }
    }
  });
});

describe('xep - khe cua ke cu', () => {
  it('o thap lap vao khe ben phai cua ke da dong', () => {
    // Ke 1 (cao 60) chi dung 60/100 ngang; ke 2 cao 40 kin. O 30x30 lot khe ke 1.
    const r = xep([
      { ten: 'a', w: 60, h: 60 },
      { ten: 'b', w: 100, h: 40 },
      { ten: 'c', w: 30, h: 30 },
    ], 100, 0);
    const c = r.o.find((o) => o.ten === 'c');
    expect(c).toMatchObject({ trang: 0, x: 60, y: 0 });
    expect(r.soTrang).toBe(1);
  });
});

describe('xep - chong duoi o trong ke cao', () => {
  it('o thap chong xuong duoi mot o da xep, khong mo ke moi', () => {
    // Xep theo cao giam dan: a (50x100) roi c (50x50) kin ngang ke cao 100. Duoi c con 50
    // -> b (50x40) chong vao do, khong mo ke moi.
    const r = xep([
      { ten: 'a', w: 50, h: 100 },
      { ten: 'b', w: 50, h: 40 },
      { ten: 'c', w: 50, h: 50 },
    ], 100, 0);
    expect(r.o.find((o) => o.ten === 'b')).toMatchObject({ trang: 0, x: 50, y: 50 });
    expect(r.soTrang).toBe(1);
  });
});
