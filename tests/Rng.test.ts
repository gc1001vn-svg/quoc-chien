/**
 * TECH_SPEC muc 8: "cung hat giong -> cung ket qua". Day la hang rao cho luat do.
 *
 * Khong co no thi ban do moi lan mo moi khac, khong test duoc gi, va khong luu duoc mot
 * van choi bang mot con so.
 */
import { describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng';

describe('Rng', () => {
  it('cung hat giong ra cung day so', () => {
    const a: number[] = Array.from({ length: 50 }, () => new Rng(12345).so());
    const mot = new Rng(12345);
    const hai = new Rng(12345);
    expect(Array.from({ length: 50 }, () => mot.so()))
      .toEqual(Array.from({ length: 50 }, () => hai.so()));
    // Va moi lan dung lai tu dau cung ra dung so dau tien do.
    expect(new Set(a).size).toBe(1);
  });

  it('hat giong khac thi day so khac', () => {
    const mot = new Rng(1);
    const hai = new Rng(2);
    const day = (r: Rng): number[] => Array.from({ length: 20 }, () => r.so());
    expect(day(mot)).not.toEqual(day(hai));
  });

  it('so luon nam trong [0, 1)', () => {
    const r = new Rng(777);
    for (let i = 0; i < 5000; i += 1) {
      const v: number = r.so();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('nguyen(n) luon nam trong [0, n)', () => {
    const r = new Rng(99);
    for (let i = 0; i < 5000; i += 1) {
      const v: number = r.nguyen(64);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(64);
    }
  });

  it('theoTrongSo chia dung ti le da khai', () => {
    const r = new Rng(2026);
    const dem: Record<string, number> = { a: 0, b: 0 };
    for (let i = 0; i < 20000; i += 1) {
      const k: string = r.theoTrongSo([{ gia: 'a', trong: 3 }, { gia: 'b', trong: 1 }]);
      dem[k] = (dem[k] ?? 0) + 1;
    }
    // Cho 3:1, sai so 2% la rong rai voi 20.000 lan boc.
    expect((dem['a'] ?? 0) / 20000).toBeGreaterThan(0.73);
    expect((dem['a'] ?? 0) / 20000).toBeLessThan(0.77);
  });

  it('trong so bang 0 thi khong bao gio duoc chon', () => {
    const r = new Rng(5);
    for (let i = 0; i < 500; i += 1) {
      expect(r.theoTrongSo([{ gia: 'co', trong: 1 }, { gia: 'khong', trong: 0 }])).toBe('co');
    }
  });
});
