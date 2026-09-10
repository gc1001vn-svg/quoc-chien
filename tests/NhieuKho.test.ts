/**
 * Nhieu kho (Phase 5): nguoi vac hang phai di toi kho GAN NHAT, va sprite kho phai chen
 * dung thu tu ve.
 *
 * Chen sai thu tu thi nguoi vac hang di xuyen nha - chu du an nhin ra ngay, da bi mot lan
 * o Phase 4 voi lop nguoi ve rieng.
 */
import { describe, expect, it } from 'vitest';
import { chenVat, sinhBanDo, type BanDo, type OVat } from '../src/sim/city/BanDo.ts';
import { DoiWalker } from '../src/sim/city/Walkers.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import cauHinh from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';

describe('doi walker voi nhieu kho', () => {
  it('nguoi duoc phat di toi kho gan cong nha nhat', () => {
    const doi = new DoiWalker({ a: 8, b: 8 }, 8, 2, 400);
    doi.themKho({ a: 80, b: 80 });

    doi.phat(0, { a: 8, b: 9 }, 'giao', 'go', 1);
    doi.phat(1, { a: 80, b: 79 }, 'giao', 'go', 1);

    expect(doi.danhSach[0]?.kho).toEqual({ a: 8, b: 8 });
    expect(doi.danhSach[1]?.kho).toEqual({ a: 80, b: 80 });
  });

  it('mot kho thi ai cung ve kho do - y nhu truoc Phase 5', () => {
    const doi = new DoiWalker({ a: 8, b: 8 }, 8, 2, 400);
    doi.phat(0, { a: 80, b: 79 }, 'giao', 'go', 1);
    expect(doi.soKho).toBe(1);
    expect(doi.danhSach[0]?.kho).toEqual({ a: 8, b: 8 });
  });
});

describe('chen sprite kho', () => {
  const sau = (v: OVat): number => v.a + v.b + 2 * v.o;

  it('ban do van xep dung thu tu truc sau sau khi chen', () => {
    const banDo: BanDo = sinhBanDo(cauHinh);
    chenVat(banDo, { a: 40, b: 41, ten: 'dong_thung', o: 1 });
    chenVat(banDo, { a: 8, b: 9, ten: 'dong_thung', o: 1 });
    for (let i = 1; i < banDo.vat.length; i += 1) {
      expect(sau(banDo.vat[i] as OVat)).toBeGreaterThanOrEqual(sau(banDo.vat[i - 1] as OVat));
    }
  });

  it('thanh pho xay them kho thi co them dung mot sprite kho', () => {
    const tp = new ThanhPho({ hang, nha, chuoi, banDo: cauHinh, walker });
    const dem = (): number => tp.banDo.vat.filter((v) => v.ten === tp.banDo.spriteKho).length;
    const truoc: number = dem();
    const khoTruoc: number = tp.doiWalker.soKho;
    expect(tp.xayKho()).toBe(true);
    expect(tp.doiWalker.soKho).toBe(khoTruoc + 1);
    expect(dem()).toBe(truoc + 1);
  });
});
