/**
 * Tran doi sung (Phase 10B, `?tran=2`): moi sprite lop dien hoi - linh, xac, dan - phai co
 * trong atlas `linh_sung`. Thieu mot ten thi `datSprite` bo qua im lang: xe tang tang hinh
 * chu khong bao loi, dung loai loi chi lo ra tren iPhone.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docDuLieuTran, tinhTran, type DauVaoTran, type DuLieuTran } from '../src/sim/campaign/Battle';
import { DienTran, type CauHinhDien } from '../src/render/DienTran';

interface TranMau {
  me: string;
  ten_dan: string;
  ban: Partial<CauHinhDien>;
  a: string[];
  b: string[];
  tuong_a: number;
  tuong_b: number;
  dia_hinh: string;
  hat_giong: number;
}

const doc = (ten: string): unknown => JSON.parse(readFileSync(new URL(`../${ten}`, import.meta.url), 'utf8')) as unknown;
const duLieu: DuLieuTran = docDuLieuTran(doc('data/armor_table.json'), doc('data/units.json'), doc('data/battle.json'));
const chung = doc('data/dien_tran.json') as CauHinhDien & { tran_mau_sung: TranMau };
const m: TranMau = chung.tran_mau_sung;
const ch: CauHinhDien = { ...chung, ...m.ban, ten_dan: m.ten_dan };
const vao: DauVaoTran = { a: { doi: m.a, tuong: m.tuong_a }, b: { doi: m.b, tuong: m.tuong_b }, diaHinh: m.dia_hinh };
const kq = tinhTran(vao, duLieu, m.hat_giong);
const tamDoi = new Map<string, number>([...duLieu.doi].map(([id, l]) => [id, l.tam]));
const cacGiay: number[] = Array.from({ length: Math.ceil((kq.giayKetThuc + 3) * 4) }, (_, i) => i / 4);

describe('tran doi sung - atlas linh_sung', () => {
  for (const co of ['1x', '2x']) {
    const atlas = (doc(`public/atlas/${m.me}_${co}.json`) as { sprite: Record<string, unknown> }).sprite;

    it(`${co}: moi linh, xac va dan trong ca tran deu co sprite`, () => {
      const dien = new DienTran(kq, vao, ch, tamDoi);
      const thieu = new Set<string>();
      let soDan = 0;
      for (const g of cacGiay) {
        for (const l of dien.linhLuc(g)) if (atlas[l.ten] === undefined) thieu.add(l.ten);
        for (const d of dien.muiTenLuc(g)) {
          soDan += 1;
          if (atlas[d.ten] === undefined) thieu.add(d.ten);
        }
      }
      expect([...thieu]).toEqual([]);
      // Tran co doi ban xa (hoa mai, dai bac, bo binh, xe tang) thi phai co dan bay.
      expect(soDan).toBeGreaterThan(0);
    });
  }

  it('ca sau loai doi sung / hien dai deu co mat trong tran mau', () => {
    const nhom = new Set((doc('data/units.json') as { doi: { id: string; nhom: string }[] }).doi
      .filter((u) => u.nhom !== 'co').map((u) => u.id));
    expect(new Set([...m.a, ...m.b])).toEqual(nhom);
  });
});
