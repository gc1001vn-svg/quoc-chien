/**
 * Kiem tra viec doc va so sanh cac dieu kien kich hoat the/eureka.
 */
import { describe, expect, it } from 'vitest';
import { docDieuKien, dung, type DieuKien, type SoThanhPho } from '../src/sim/decision/DieuKien.ts';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { LoiDuLieu } from '../src/sim/city/DocJson.ts';

/**
 * Tao bang thong ke gia de kiem tra. MOI truong mot so KHAC NHAU: trung so thi doc nham
 * truong nay sang truong kia van xanh (cai loi 24/09 do ra: 3/6 loi lot).
 */
function createMockStats(): ThongKe {
  return {
    gio: 10,
    nha: [],
    hang: [
      {
        ten: 'thep', hien: 'Thép',
        ton: 40, tran: 100, lamRa: 7, dungHet: 3, cho: 0, day: 1, hong: 4
      },
      {
        ten: 'gao', hien: 'Gạo',
        ton: 10, tran: 50, lamRa: 12, dungHet: 11, cho: 21, day: 13, hong: 2
      }
    ],
    walker: { chuyen: 100, boCuoc: 5, dinh: 20 }
  };
}

describe('docDieuKien', () => {
  it('doc duoc dieu kien doc theo hang', () => {
    const condition = docDieuKien({ do: 'ton', hang: 'thep', phep: '>=', gia: 40 }, 'test');
    expect(condition.do).toBe('ton');
    expect(condition.hang).toBe('thep');
    expect(condition.phep).toBe('>=');
    expect(condition.gia).toBe(40);
  });

  it('doc duoc dieu kien khong can hang', () => {
    const condition = docDieuKien({ do: 'soNha', phep: '>', gia: 120 }, 'test');
    expect(condition.do).toBe('soNha');
    expect(condition.hang).toBeUndefined();
    expect(condition.phep).toBe('>');
    expect(condition.gia).toBe(120);
  });

  it('nem loi neu khong biet do gi', () => {
    expect(() => docDieuKien({ do: 'sai', phep: '>', gia: 1 }, 't'))
      .toThrow(LoiDuLieu);
  });

  it('nem loi neu khong biet phep', () => {
    expect(() => docDieuKien({ do: 'soNha', phep: '===', gia: 1 }, 't'))
      .toThrow(LoiDuLieu);
  });

  it('nem loi neu thieu hang khi do can', () => {
    expect(() => docDieuKien({ do: 'ton', phep: '>=', gia: 10 }, 't'))
      .toThrow(LoiDuLieu);
  });

  it('nem loi neu gia am', () => {
    expect(() => docDieuKien({ do: 'soNha', phep: '>=', gia: -1 }, 't'))
      .toThrow(LoiDuLieu);
  });

  it('nem loi neu gia khong dung chuan', () => {
    expect(() => docDieuKien({ do: 'soNha', phep: '>=', gia: '10' }, 't'))
      .toThrow(LoiDuLieu);
  });
});

describe('dung', () => {
  const stats = createMockStats();
  const cityStats: SoThanhPho = { soNha: 150, soKho: 3 };

  it('so sanh >= voi bien', () => {
    expect(dung({ do: 'ton', hang: 'thep', phep: '>=', gia: 40 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'ton', hang: 'thep', phep: '>=', gia: 41 }, stats, cityStats)).toBe(false);
  });

  it('so sanh <= voi bien', () => {
    expect(dung({ do: 'ton', hang: 'thep', phep: '<=', gia: 40 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'ton', hang: 'thep', phep: '<=', gia: 39 }, stats, cityStats)).toBe(false);
  });

  it('so sanh >', () => {
    expect(dung({ do: 'soNha', phep: '>', gia: 149 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'soNha', phep: '>', gia: 150 }, stats, cityStats)).toBe(false);
  });

  it('so sanh <', () => {
    expect(dung({ do: 'soNha', phep: '<', gia: 151 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'soNha', phep: '<', gia: 150 }, stats, cityStats)).toBe(false);
  });

  /**
   * Truong doc ra phai BANG dung `so`: `>= so` dung va `> so` sai. Chi kiem ve dung thi
   * doc nham sang truong lon hon van xanh.
   */
  function docRa(dk: { do: DieuKien['do']; hang?: string }, so: number): void {
    expect(dung({ ...dk, phep: '>=', gia: so }, stats, cityStats)).toBe(true);
    expect(dung({ ...dk, phep: '>', gia: so }, stats, cityStats)).toBe(false);
  }

  it('doc so walker', () => {
    docRa({ do: 'dinh' }, 20);
    docRa({ do: 'boCuoc' }, 5);
    docRa({ do: 'chuyen' }, 100);
  });

  it('doc so thanh pho', () => {
    docRa({ do: 'soNha' }, 150);
    docRa({ do: 'soKho' }, 3);
  });

  it('doc so tung mat hang', () => {
    docRa({ do: 'ton', hang: 'gao' }, 10);
    docRa({ do: 'cho', hang: 'gao' }, 21);
    docRa({ do: 'day', hang: 'gao' }, 13);
    docRa({ do: 'hong', hang: 'gao' }, 2);
    docRa({ do: 'lamRa', hang: 'gao' }, 12);
    docRa({ do: 'dungHet', hang: 'gao' }, 11);
    docRa({ do: 'hong', hang: 'thep' }, 4);
  });

  it('sai khi khong co mat hang do trong bang thong ke', () => {
    expect(dung({ do: 'ton', hang: 'xien', phep: '>=', gia: 0 }, stats, cityStats)).toBe(false);
  });
});
