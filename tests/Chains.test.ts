/**
 * Hang rao cho ba file du lieu: `wares.json` · `buildings.json` · `chains.json`.
 *
 * Ba file nay do tay nguoi go, va sai o day khong lam chuong trinh do - no lam kinh te
 * ket im lang. `kiemTra` phai bat duoc truoc khi chay mot nhip nao.
 */
import { describe, expect, it } from 'vitest';
import { docNha } from '../src/sim/city/Buildings.ts';
import { docChuoi, kiemTra } from '../src/sim/city/Chains.ts';
import { docHang } from '../src/sim/city/Wares.ts';
import hangTho from '../data/wares.json';
import nhaTho from '../data/buildings.json';
import chuoiTho from '../data/chains.json';

const dsHang = docHang(hangTho);
const dsNha = docNha(nhaTho);
const dsChuoi = docChuoi(chuoiTho);

describe('du lieu that trong data/', () => {
  it('ba file khop nhau, khong loi nao', () => {
    expect(kiemTra(dsHang, dsNha, dsChuoi)).toEqual([]);
  });

  it('moi mat hang deu co nguoi lam ra va nguoi dung den', () => {
    const lamRa = new Set(dsNha.flatMap((n) => n.ra.map((m) => m.hang)));
    const dungDen = new Set(dsNha.flatMap((n) => n.vao.map((m) => m.hang)));
    for (const h of dsHang) {
      expect(lamRa.has(h.ten), `${h.ten} khong ai lam ra`).toBe(true);
      expect(dungDen.has(h.ten), `${h.ten} khong ai dung den`).toBe(true);
    }
  });

  it('nha tieu thu khong de ra hang, nha san xuat thi co', () => {
    for (const n of dsNha) {
      if (n.kieu === 'tieu_thu') expect(n.ra).toEqual([]);
      else expect(n.ra.length).toBeGreaterThan(0);
    }
  });
});

describe('kiemTra bat duoc loi', () => {
  const hang = [{ ten: 'go', hien: 'Go', tran: 10, dau: 0, hao: 0 }];

  it('hang khong ai lam ra', () => {
    const nha = docNha({
      nha: [
        { ten: 'a', hien: 'A', kieu: 'tieu_thu', so: 1, nhip: 1, vao: [{ hang: 'go', so: 1 }], ra: [] },
      ],
    });
    const chuoi = docChuoi({ chuoi: [{ ten: 'c', hien: 'C', qua: ['a', 'a'] }] });
    expect(kiemTra(hang, nha, chuoi).join(' ')).toMatch(/khong nha nao lam ra/);
  });

  it('hang khong ai dung den', () => {
    const nha = docNha({
      nha: [{ ten: 'a', hien: 'A', kieu: 'san_xuat', so: 1, nhip: 1, vao: [], ra: [{ hang: 'go', so: 1 }] }],
    });
    const chuoi = docChuoi({ chuoi: [{ ten: 'c', hien: 'C', qua: ['a', 'a'] }] });
    expect(kiemTra(hang, nha, chuoi).join(' ')).toMatch(/khong nha nao dung den/);
  });

  it('nha quen ke vao chuoi nao', () => {
    const nha = docNha({
      nha: [
        { ten: 'a', hien: 'A', kieu: 'san_xuat', so: 1, nhip: 1, vao: [], ra: [{ hang: 'go', so: 1 }] },
        { ten: 'b', hien: 'B', kieu: 'tieu_thu', so: 1, nhip: 1, vao: [{ hang: 'go', so: 1 }], ra: [] },
      ],
    });
    const chuoi = docChuoi({ chuoi: [{ ten: 'c', hien: 'C', qua: ['a', 'a'] }] });
    expect(kiemTra(hang, nha, chuoi).join(' ')).toMatch(/nha "b" khong nam trong chuoi nao/);
  });

  it('chuoi di qua nha khong co that', () => {
    const nha = docNha({
      nha: [
        { ten: 'a', hien: 'A', kieu: 'san_xuat', so: 1, nhip: 1, vao: [], ra: [{ hang: 'go', so: 1 }] },
        { ten: 'b', hien: 'B', kieu: 'tieu_thu', so: 1, nhip: 1, vao: [{ hang: 'go', so: 1 }], ra: [] },
      ],
    });
    const chuoi = docChuoi({ chuoi: [{ ten: 'c', hien: 'C', qua: ['a', 'b', 'z'] }] });
    expect(kiemTra(hang, nha, chuoi).join(' ')).toMatch(/nha "z" - nha nay khong co/);
  });
});
