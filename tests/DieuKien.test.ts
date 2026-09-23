/**
 * Kiem tra viec doc va so sanh cac dieu kien kich hoat the/eureka.
 */
import { describe, expect, it } from 'vitest';
import { docDieuKien, dung, type SoThanhPho } from '../src/sim/decision/DieuKien.ts';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { LoiDuLieu } from '../src/sim/city/DocJson.ts';

/** Tao bang thong ke gia de kiem tra. */
function createMockStats(): ThongKe {
  return {
    gio: 10,
    nha: [],
    hang: [
      {
        ten: 'thep', hien: 'Thép',
        ton: 40, tran: 100, lamRa: 5, dungHet: 3, cho: 0, day: 1, hong: 0
      },
      {
        ten: 'gao', hien: 'Gạo',
        ton: 10, tran: 50, lamRa: 0, dungHet: 10, cho: 20, day: 0, hong: 2
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
      .toThrowError(LoiDuLieu);
  });

  it('nem loi neu khong biet phep', () => {
    expect(() => docDieuKien({ do: 'soNha', phep: '===', gia: 1 }, 't'))
      .toThrowError(LoiDuLieu);
  });

  it('nem loi neu thieu hang khi do can', () => {
    expect(() => docDieuKien({ do: 'ton', phep: '>=', gia: 10 }, 't'))
      .toThrowError(LoiDuLieu);
  });

  it('nem loi neu gia khong dung chuan', () => {
    expect(() => docDieuKien({ do: 'soNha', phep: '>=', gia: '10' }, 't'))
      .toThrowError(LoiDuLieu);
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

  it('doc so walker', () => {
    expect(dung({ do: 'dinh', phep: '>=', gia: 20 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'boCuoc', phep: '>=', gia: 5 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'chuyen', phep: '>=', gia: 100 }, stats, cityStats)).toBe(true);
  });

  it('doc so thanh pho', () => {
    expect(dung({ do: 'soNha', phep: '>=', gia: 150 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'soKho', phep: '>=', gia: 3 }, stats, cityStats)).toBe(true);
  });

  it('doc so tung mat hang', () => {
    expect(dung({ do: 'ton', hang: 'gao', phep: '>=', gia: 10 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'cho', hang: 'gao', phep: '>=', gia: 20 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'day', hang: 'thep', phep: '>=', gia: 1 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'hong', hang: 'gao', phep: '>=', gia: 2 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'lamRa', hang: 'thep', phep: '>=', gia: 5 }, stats, cityStats)).toBe(true);
    expect(dung({ do: 'dungHet', hang: 'gao', phep: '>=', gia: 10 }, stats, cityStats)).toBe(true);
  });

  it('sai khi khong co mat hang do trong bang thong ke', () => {
    expect(dung({ do: 'ton', hang: 'xien', phep: '>=', gia: 0 }, stats, cityStats)).toBe(false);
  });
});
