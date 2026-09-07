/**
 * Hang rao cho ban do trung bay va cho `data/thanh_pho_demo.json`.
 *
 * Test dat nhat o day la cai cuoi: MOI ten sprite khai trong JSON phai co that trong
 * atlas da nuong. Go sai mot chu thi cai nha do bien mat khong bao loi gi - dung loai loi
 * ma nhin anh chup cung kho thay.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import cauHinhTho from '../data/thanh_pho_demo.json';
import { sinhBanDo, type BanDo, type CauHinhBanDo } from '../src/render/BanDoDemo';
import { docBoAtlas } from '../src/render/Atlas';

const CAU_HINH: CauHinhBanDo = cauHinhTho;

function doc(ten: string): ReturnType<typeof docBoAtlas> {
  return docBoAtlas(JSON.parse(readFileSync(`public/assets/atlas/${ten}.json`, 'utf8')));
}

describe('sinh ban do trung bay', () => {
  const banDo: BanDo = sinhBanDo(CAU_HINH);

  it('lap day du o nen', () => {
    expect(banDo.canh).toBe(CAU_HINH.canh);
    expect(banDo.nen).toHaveLength(CAU_HINH.canh * CAU_HINH.canh);
    expect(banDo.nen.every((t) => t !== undefined && t !== '')).toBe(true);
  });

  it('duong nam dung cho da khai, nga tu o cho hai duong cat nhau', () => {
    const c: number = CAU_HINH.canh;
    expect(banDo.nen[0 * c + 0]).toBe(CAU_HINH.nen.ngaTu);
    expect(banDo.nen[0 * c + 3]).toBe(CAU_HINH.nen.duong);
    expect(banDo.nen[3 * c + 0]).toBe(CAU_HINH.nen.duong);
    expect(banDo.nen[3 * c + 3]).not.toBe(CAU_HINH.nen.duong);
  });

  it('khong hai vat the nao cung mot o, va khong vat the nao nam tren duong', () => {
    const cho = new Set<number>();
    for (const v of banDo.vat) {
      const o: number = v.a * CAU_HINH.canh + v.b;
      expect(cho.has(o)).toBe(false);
      cho.add(o);
      expect(v.a % CAU_HINH.duongCach).not.toBe(0);
      expect(v.b % CAU_HINH.duongCach).not.toBe(0);
    }
  });

  it('vat the da xep san theo truc sau, ve theo thu tu nay la dung', () => {
    // Xep theo GOC TRUOC cua khoi. Cong trinh 2x2 neo o o sau nhat cua no, lay o neo ma
    // xep thi no ve truoc ca thu dung ben canh no va bi de len.
    const truocNhat = (v: { a: number; b: number; o: number }): number => v.a + v.b + 2 * (v.o - 1);
    for (let i = 1; i < banDo.vat.length; i += 1) {
      const truoc = banDo.vat[i - 1];
      const nay = banDo.vat[i];
      if (truoc === undefined || nay === undefined) continue;
      expect(truocNhat(truoc)).toBeLessThanOrEqual(truocNhat(nay));
    }
  });

  it('cong trinh nhieu o khong bao gio chong o len nhau', () => {
    const cho = new Set<number>();
    for (const v of banDo.vat) {
      for (let da = 0; da < v.o; da += 1) {
        for (let db = 0; db < v.o; db += 1) {
          const o: number = (v.a + da) * CAU_HINH.canh + (v.b + db);
          expect(cho.has(o)).toBe(false);
          cho.add(o);
          // Ca khoi phai tranh duong, khong chi rieng o neo.
          expect((v.a + da) % CAU_HINH.duongCach).not.toBe(0);
          expect((v.b + db) % CAU_HINH.duongCach).not.toBe(0);
        }
      }
    }
  });

  it('dat gan het so vat the da khai', () => {
    const khai: number = CAU_HINH.vat.reduce((t, v) => t + v.so, 0);
    expect(khai).toBeGreaterThan(250);
    // Boc trung o thi bo, nhung ban do 64x64 rong chan nen hut khong dang ke.
    expect(banDo.vat.length).toBeGreaterThan(khai * 0.97);
    expect(banDo.vat.length).toBeLessThanOrEqual(khai);
  });

  it('cung hat giong ra dung mot ban do', () => {
    expect(sinhBanDo(CAU_HINH)).toEqual(banDo);
  });

  it('hat giong khac ra ban do khac', () => {
    expect(sinhBanDo({ ...CAU_HINH, hatGiong: CAU_HINH.hatGiong + 1 })).not.toEqual(banDo);
  });
});

describe('ten sprite khai trong JSON phai co that trong atlas', () => {
  for (const co of ['1x', '2x']) {
    it(`du ten cho bo ${co}`, () => {
      const bo = doc(`${CAU_HINH.me}_${co}`);
      const thieu: string[] = [];
      const kiem = (ten: string): void => {
        if (bo.sprite[ten] === undefined) thieu.push(ten);
      };
      kiem(CAU_HINH.nen.duong);
      kiem(CAU_HINH.nen.ngaTu);
      for (const t of CAU_HINH.nen.thuong) kiem(t.ten);
      for (const v of CAU_HINH.vat) kiem(v.ten);
      expect(thieu).toEqual([]);
    });
  }
});
