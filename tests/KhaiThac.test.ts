/**
 * Buoc 4 khai thac can dan (12/10): bai cay/da quanh trai go, mo thua dan theo nhip nha THAT SU lam.
 * Chay so thuan va mot nha that qua `nhip()` - khong trinh duyet, khong WebGL.
 */
import { describe, expect, it } from 'vitest';
import { ThuNha, type BoDem, type DinhNghiaNha, type Giao } from '../src/sim/city/Buildings';
import { changVat, oBai, phanVong, SO_KHAI_THAC } from '../src/render/KhaiThac';
import type { BanDo } from '../src/sim/city/BanDo';

const SO = SO_KHAI_THAC;
const boDem: BoDem = { meXong: () => {}, doi: () => {}, tac: () => {}, lamRa: () => {}, dungHet: () => {} };
const giao = { xinLay: () => false, xinGiao: () => false } as unknown as Giao;

function nha(vao: DinhNghiaNha['vao']): ThuNha {
  const def: DinhNghiaNha = {
    ten: 'thu', hien: 'Thử', sprite: 'trai_go', khu: 'nong_nghiep', cachNhau: 1, motKhoi: false, o: 1,
    kieu: 'san_xuat', so: 1, nhip: 3, vao, ra: [{ hang: 'go', so: 1 }],
  };
  return new ThuNha(def, 0, 0, { a: 0, b: 0 }, { a: 0, b: 1 }, 2);
}

describe('chang vat trong bai', () => {
  it('chat lan luot tung vat, roi bai trong, roi moc lai tu 0 len 1', () => {
    expect([0, 1, 2, 3].map((i) => changVat(0, i, 4))).toEqual(['chang', 'hinh', 'hinh', 'hinh']);
    expect([0, 1, 2, 3].map((i) => changVat(SO.chatDen * 0.5, i, 4))).toEqual(['mat', 'mat', 'chang', 'hinh']);
    expect([0, 1, 2, 3].map((i) => changVat(SO.chatDen - 1e-9, i, 4))).toEqual(['mat', 'mat', 'mat', 'chang']);
    expect(changVat((SO.chatDen + SO.trongDen) / 2, 3, 4)).toBe('mat');
    expect(changVat((SO.trongDen + 1) / 2, 0, 4)).toBeCloseTo(0.5);
  });

  it('cung nhip cung phan vong, qua mot chu ky thi lap lai', () => {
    const t = phanVong(1234, 7, 9);
    expect(t).toBeGreaterThanOrEqual(0);
    expect(t).toBeLessThan(1);
    expect(phanVong(1234 + SO.chuKyNhip, 7, 9)).toBeCloseTo(t);
  });
});

describe('nhip da lam cua nha', () => {
  it('chi dem luc dang lam me: kho day thi dung, thieu hang thi khong dem', () => {
    const n = nha([]);
    for (let i = 0; i < 100; i += 1) n.nhip(giao, boDem);
    // Kho rieng chua 2: 2 me de ra, me thu 3 lam xong thi tac (3 me x 3 nhip), khong ai bot hang ra.
    expect(n.nhipTac()).toBeGreaterThan(0);
    expect(n.nhipDaLam()).toBe(9);
    n.bot('go', 2);
    for (let i = 0; i < 4; i += 1) n.nhip(giao, boDem);
    expect(n.nhipDaLam()).toBeGreaterThan(9);

    const doi = nha([{ hang: 'bot', so: 1 }]);
    for (let i = 0; i < 50; i += 1) doi.nhip(giao, boDem);
    expect(doi.nhipDaLam()).toBe(0);
  });
});

describe('o dat bai', () => {
  const banDo = { canh: 20, duongCach: 5, daChiem: new Set([7 * 20 + 6]) } as unknown as BanDo;

  it('chi o phia sau/ngang nha, khong duong, khong ai chiem, toi da toiDa, hai bai khong chung o', () => {
    const daLay = new Set<number>();
    const ds = oBai(banDo, 7, 7, daLay);
    expect(ds.length).toBeGreaterThan(0);
    expect(ds.length).toBeLessThanOrEqual(SO.toiDa);
    for (const o of ds) {
      expect(o.a - 7 + (o.b - 7)).toBeLessThanOrEqual(0);
      expect(o.a % 5 !== 0 && o.b % 5 !== 0).toBe(true);
      expect(banDo.daChiem.has(o.a * 20 + o.b)).toBe(false);
    }
    const ke = oBai(banDo, 8, 7, daLay);
    expect(ke.some((o) => ds.some((p) => p.a === o.a && p.b === o.b))).toBe(false);
  });
});
