/**
 * Phase 9: tran danh chay ngam (GAME_SPEC muc 6). Tinh truoc, dien sau - nen ket qua
 * phai tat dinh theo hat giong, va kich ban phai khop dung ket qua da tinh.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { docDuLieuTran, duDoan, tinhTran, type DauVaoTran, type DuLieuTran } from '../src/sim/campaign/Battle';
import { sinhKichBan } from '../src/sim/campaign/BattleScript';

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

const duLieu: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), doc('battle.json'));

const CAN: DauVaoTran = {
  a: { doi: ['giao_thu', 'kiem_si', 'cung_thu', 'ky_binh', 'giao_thu', 'cung_thu'], tuong: 1 },
  b: { doi: ['kiem_si', 'giao_thu', 'cung_thu', 'ky_binh', 'kiem_si', 'cung_thu'], tuong: 1 },
  diaHinh: 'dong_bang',
};

describe('Bang giap x dan', () => {
  it('moi loai giap co du he so cho moi loai dan', () => {
    for (const giap of duLieu.giap) {
      for (const dan of duLieu.dan) {
        expect(duLieu.heSo(giap, dan), `${giap} x ${dan}`).toBeGreaterThan(0);
      }
    }
  });

  it('moi loai doi dung giap va dan co trong bang', () => {
    for (const d of duLieu.doi.values()) {
      expect(duLieu.giap).toContain(d.giap);
      expect(duLieu.dan).toContain(d.dan);
    }
  });
});

describe('tinhTran', () => {
  it('cung hat giong ra cung ket qua', () => {
    expect(tinhTran(CAN, duLieu, 7)).toEqual(tinhTran(CAN, duLieu, 7));
  });

  it('ben dong gap ba thang ap dao', () => {
    const lech: DauVaoTran = {
      a: { doi: Array<string>(9).fill('kiem_si'), tuong: 1 },
      b: { doi: Array<string>(3).fill('kiem_si'), tuong: 1 },
      diaHinh: 'dong_bang',
    };
    for (let hat = 0; hat < 20; hat += 1) expect(tinhTran(lech, duLieu, hat).thang).toBe('a');
    expect(duDoan(lech, duLieu)).toBeGreaterThan(0.95);
  });

  it('tran luon ket thuc truoc tran giay va so chet khong vuot quan so', () => {
    for (let hat = 0; hat < 30; hat += 1) {
      const kq = tinhTran(CAN, duLieu, hat);
      expect(kq.giayKetThuc).toBeLessThanOrEqual(duLieu.tranGiay);
      expect(kq.chetA).toBeGreaterThanOrEqual(0);
      expect(kq.chetA).toBeLessThanOrEqual(kq.linhA);
      expect(kq.chetB).toBeLessThanOrEqual(kq.linhB);
    }
  });

  it('du doan doi xung: doi ben thi phan tram doi nhau', () => {
    const nguoc: DauVaoTran = { a: CAN.b, b: CAN.a, diaHinh: 'dong_bang' };
    expect(duDoan(CAN, duLieu) + duDoan(nguoc, duLieu)).toBeCloseTo(1, 6);
  });

  it('dia hinh phong thu nghieng ve ben giu dat (ben b)', () => {
    const nui: DauVaoTran = { ...CAN, diaHinh: 'nui' };
    expect(duDoan(nui, duLieu)).toBeLessThan(duDoan(CAN, duLieu));
  });

  it('tuong gioi hon nghieng du doan', () => {
    const gioi: DauVaoTran = { ...CAN, a: { ...CAN.a, tuong: 3 } };
    expect(duDoan(gioi, duLieu)).toBeGreaterThan(duDoan(CAN, duLieu));
  });

  it('loai doi la thi nem loi, khong tinh bay', () => {
    const sai: DauVaoTran = { ...CAN, a: { doi: ['khong_co'], tuong: 0 } };
    expect(() => tinhTran(sai, duLieu, 1)).toThrow(/khong_co/);
  });
});

describe('do dai tran - GAME_SPEC muc 6: 30-60 giay', () => {
  // Jules viet (soat 25/09): truoc khi giam sat thuong, tran guong 6 kiem si het trong 23,5 giay.
  it('tran guong 6 kiem si keo dai tu 30 den tran giay', () => {
    const vao: DauVaoTran = { a: { doi: Array<string>(6).fill('kiem_si'), tuong: 1 }, b: { doi: Array<string>(6).fill('kiem_si'), tuong: 1 }, diaHinh: 'dong_bang' };
    for (let hat = 0; hat < 10; hat += 1) {
      const kq = tinhTran(vao, duLieu, hat);
      expect(kq.giayKetThuc).toBeGreaterThanOrEqual(30);
      expect(kq.giayKetThuc).toBeLessThanOrEqual(duLieu.tranGiay);
    }
  });
});

describe('sinhKichBan', () => {
  it('mo bang hai ben tien o giay 0, dong bang ket thuc dung giay da tinh', () => {
    const kq = tinhTran(CAN, duLieu, 3);
    const kb = sinhKichBan(kq, CAN, duLieu);
    expect(kb[0]?.giay).toBe(0);
    expect(kb[0]?.loai).toBe('tien');
    expect(kb.at(-1)?.loai).toBe('ket_thuc');
    expect(kb.at(-1)?.giay).toBe(kq.giayKetThuc);
    const giay: number[] = kb.map((c) => c.giay);
    expect(giay).toEqual([...giay].sort((x, y) => x - y));
  });
});
