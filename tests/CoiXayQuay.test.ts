/**
 * Cong trinh nhieu khung: coi xay quay.
 *
 * Test dat nhat o day la cai cuoi: DOI khung roi van cham trung cong trinh. Ten sprite
 * that su ve la `coi_xay_k<so>`, con ban do chi biet ten `coi_xay` - go lech mot cho la
 * cong trinh bien mat khoi man hay bam vao khong ra gi, ma khong bao loi nao ca.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Atlas, coHinh, docBoAtlas } from '../src/render/Atlas';
import { vatTaiDiem, type Ve } from '../src/render/VeCanh';
import type { BanDo, OVat } from '../src/sim/city/BanDo';

const ME = ['trung_co_2', 'hien_dai'];

function doc(ten: string): ReturnType<typeof docBoAtlas> {
  return docBoAtlas(JSON.parse(readFileSync(`public/atlas/${ten}.json`, 'utf8')));
}

describe('me atlas khai du khung cho coi xay', () => {
  for (const me of ME) {
    for (const co of ['1x', '2x']) {
      it(`${me} bo ${co} co ba khung, khong con ten goc`, () => {
        const bo = doc(`${me}_${co}`);
        for (const k of [0, 1, 2]) expect(bo.sprite[`coi_xay_k${String(k)}`]).toBeDefined();
        expect(bo.sprite['coi_xay_k3']).toBeUndefined();
        expect(bo.sprite['coi_xay']).toBeUndefined();
        // `Atlas.thieu` va hai test ten sprite deu doi chieu qua day.
        expect(coHinh(bo, 'coi_xay')).toBe(true);
        expect(coHinh(bo, 'khong_co_cai_nay')).toBe(false);
      });

      it(`${me} bo ${co}: ba khung KHAC nhau`, () => {
        const bo = doc(`${me}_${co}`);
        // Canh quat xoay thi hop bao doi theo. Ba khung ra y het nhau nghia la `rz`/`rx`
        // khong toi duoc manh canh quat - go sai ten manh trong `khung` la ra dung the.
        const dau = [0, 1, 2].map((k) => {
          const s = bo.sprite[`coi_xay_k${String(k)}`];
          if (s === undefined) throw new Error('thieu khung');
          return `${String(s.w)}x${String(s.h)}+${String(s.ox)}+${String(s.oy)}`;
        });
        expect(new Set(dau).size).toBe(3);
      });
    }
  }
});

describe('cham vao coi xay o moi khung', () => {
  const atlas = new Atlas(doc('trung_co_2_1x'), []);
  const vat: OVat = { a: 0, b: 0, ten: 'coi_xay', o: 2 };
  const banDo = {
    canh: 64, duongCach: 8, nen: [], vat: [vat], daCoChu: new Set<number>(),
  } as unknown as BanDo;

  function veGia(khung: number): Ve {
    return {
      gl: undefined as unknown as Ve['gl'],
      atlas,
      rongDev: 800,
      caoDev: 600,
      tiLe: 1,
      camX: 0,
      camY: 0,
      dem: 0,
      khung,
    };
  }

  // Sau nhip = ba khung o `NHIP_MOI_KHUNG = 2`, di het mot vong khung.
  for (const khung of [0, 1, 2, 3, 4, 5]) {
    it(`nhip ${String(khung)}: bam giua sprite thi trung coi xay`, () => {
      const ve = veGia(khung);
      const s = atlas.o(`coi_xay_k${String(Math.floor(khung / 2) % 3)}`);
      // Neo o (0,0) nam giua khung; sprite trai ra tu `-ox` den `w - ox`.
      const x: number = 400 - s.ox + s.w / 2;
      const y: number = 300 - s.oy + s.h / 2;
      expect(vatTaiDiem(ve, banDo, x, y)).toEqual(vat);
    });
  }
});
