/**
 * Lop dien giap la ca va mui ten (25/09, sau khi chu du an bao "chi thay hai khoi huc nhau").
 * Chi la lop ve: khong duoc doi ket qua, chi doi cho dung cua linh va them mui ten.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docDuLieuTran, tinhTran, type DauVaoTran, type DuLieuTran } from '../src/sim/campaign/Battle';
import { DienTran, type CauHinhDien } from '../src/render/DienTran';

const doc = (ten: string): unknown => JSON.parse(readFileSync(new URL(`../${ten}`, import.meta.url), 'utf8')) as unknown;
const duLieu: DuLieuTran = docDuLieuTran(doc('data/armor_table.json'), doc('data/units.json'), doc('data/battle.json'));
const ch = doc('data/dien_tran.json') as CauHinhDien & { tran_mau: { a: string[]; b: string[]; hat_giong: number } };
const vao: DauVaoTran = { a: { doi: ch.tran_mau.a, tuong: 1 }, b: { doi: ch.tran_mau.b, tuong: 1 }, diaHinh: 'dong_bang' };
const kq = tinhTran(vao, duLieu, ch.tran_mau.hat_giong);
const tamDoi = new Map<string, number>([...duLieu.doi].map(([id, l]) => [id, l.tam]));
const atlas = (doc('public/atlas/linh_co_2x.json') as { sprite: Record<string, unknown> }).sprite;
const cacGiay: number[] = Array.from({ length: Math.ceil((kq.giayKetThuc + 3) * 4) }, (_, i) => i / 4);

/**
 * So linh ben a DE LEN mot linh ben b (cach duoi 0,2 o) - dung cai chu du an che: hai khoi
 * huc vao nhau, chong len nhau. Do 25/09 tran mau: kieu cu 3-14 linh moi luc, dan hang 0.
 */
function soDe(dt: DienTran, giay: number): number {
  const song = dt.linhLuc(giay).filter((l) => !l.ten.includes('_chet_'));
  const b = song.filter((l) => l.ben === 'b');
  return song.filter((x) => x.ben === 'a' && b.some((y) => Math.hypot(x.a - y.a, x.b - y.b) < 0.2)).length;
}

describe('giap la ca', () => {
  const cu = new DienTran(kq, vao, ch);
  const moi = new DienTran(kq, vao, ch, tamDoi);
  // Giay giua tran, sau khi moi doi can chien da vao tran du `giay_vao_tran`.
  const giua: number = (kq.suKien.filter((s) => s.loai === 'danh').at(-1)?.giay ?? 0) + (ch.giay_vao_tran ?? 0.6) + 0.5;

  it('dan hang thi khong linh nao de len linh dich; kieu cu thi co', () => {
    expect(soDe(cu, giua)).toBeGreaterThan(0);
    expect(soDe(moi, giua)).toBe(0);
  });

  it('truoc khi danh, dan hang khong doi gi', () => {
    expect(moi.linhLuc(0)).toEqual(cu.linhLuc(0));
  });

  it('so linh va so xac khong doi so voi khong dan hang', () => {
    for (const g of cacGiay) {
      const x = moi.linhLuc(g);
      const y = cu.linhLuc(g);
      expect(x.length).toBe(y.length);
      expect(x.filter((l) => l.ten.includes('_chet_')).length).toBe(y.filter((l) => l.ten.includes('_chet_')).length);
    }
  });

  it('moi ten sprite (du 4 khung di/danh) co trong atlas', () => {
    for (const g of cacGiay) for (const l of moi.linhLuc(g)) expect(atlas, l.ten).toHaveProperty([l.ten]);
  });

  it('linh dang danh khong vung dong loat: trong mot doi co nhieu khung khac nhau cung luc', () => {
    const danh = moi.linhLuc(giua).filter((l) => l.ten.includes('_danh_'));
    expect(new Set(danh.map((l) => l.ten.slice(-2))).size).toBeGreaterThan(1);
  });
});

describe('mui ten', () => {
  const dt = new DienTran(kq, vao, ch, tamDoi);

  it('giay 0 chua co mui ten nao; trong tran co mui ten bay', () => {
    expect(dt.muiTenLuc(0)).toEqual([]);
    expect(cacGiay.some((g) => dt.muiTenLuc(g).length > 0)).toBe(true);
  });

  it('mui ten co ten trong atlas, do cao khong am va khong vuot dinh vong', () => {
    for (const g of cacGiay) {
      for (const m of dt.muiTenLuc(g)) {
        expect(atlas, m.ten).toHaveProperty([m.ten]);
        expect(m.cao).toBeGreaterThanOrEqual(0);
        expect(m.cao).toBeLessThanOrEqual((ch.do_vong ?? 0) * duLieu.chienTruong);
      }
    }
  });

  it('khong co tam danh thi khong ban (giu dung hanh vi cu)', () => {
    const cu = new DienTran(kq, vao, ch);
    expect(cacGiay.every((g) => cu.muiTenLuc(g).length === 0)).toBe(true);
  });
});
