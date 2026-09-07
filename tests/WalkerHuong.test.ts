/**
 * Huong va kieu cua nguoi vac hang - phan sim quyet dinh ben ve lay sprite nao.
 *
 * Sai huong thi nguoi di giat lui ma khong ai bat duoc bang mat o kich thuoc 35 diem anh,
 * nen phai co bai test chan.
 */
import { describe, expect, it } from 'vitest';
import { DoiWalker, doHuong } from '../src/sim/city/Walkers';

describe('doHuong', () => {
  it('doc bon huong tu mot buoc tren luoi', () => {
    expect(doHuong({ a: 5, b: 5 }, { a: 6, b: 5 })).toBe(0);
    expect(doHuong({ a: 5, b: 5 }, { a: 5, b: 6 })).toBe(1);
    expect(doHuong({ a: 5, b: 5 }, { a: 4, b: 5 })).toBe(2);
    expect(doHuong({ a: 5, b: 5 }, { a: 5, b: 4 })).toBe(3);
  });

  it('dung yen thi giu huong cu, khong quay dau vo co', () => {
    expect(doHuong({ a: 5, b: 5 }, { a: 5, b: 5 }, 2)).toBe(2);
  });
});

describe('DoiWalker', () => {
  it('chia nam nu xen ke, va dat huong ngay o buoc dau', () => {
    const doi: DoiWalker = new DoiWalker({ a: 0, b: 4 }, 4, 1, 100);
    doi.phat(0, { a: 4, b: 4 }, 'lay', 'banh_mi', 0);
    doi.phat(1, { a: 4, b: 4 }, 'lay', 'banh_mi', 0);
    expect(doi.danhSach.map((w) => w.kieu)).toEqual([0, 1]);

    // Kho o (0,4), nguoi dung o (4,4) tren cung truc `b` -> buoc dau phai di ve `a` giam.
    doi.nhip(() => undefined, () => undefined);
    expect(doi.danhSach[0]?.a).toBe(3);
    expect(doi.danhSach[0]?.huong).toBe(2);
  });
});
