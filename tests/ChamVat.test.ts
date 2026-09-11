/**
 * Cham vao mot diem tren canh thanh pho thi trung vat the nao.
 *
 * Test dat nhat o day la cai cuoi: khi hai cong trinh chong len nhau tren man, phai tra ve
 * cai DUNG GAN hon. Tra nham cai xa la bam mai nha nay lai hien ten nha kia - dung loai loi
 * nhin anh chup khong thay, vi ten van hien ra binh thuong.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Atlas, docBoAtlas } from '../src/render/Atlas';
import { vatTaiDiem, type Ve } from '../src/render/VeCanh';
import type { BanDo, OVat } from '../src/sim/city/BanDo';

const bo = docBoAtlas(JSON.parse(readFileSync('public/atlas/trung_co_2_1x.json', 'utf8')));
const atlas = new Atlas(bo, []);

/**
 * `Ve` du de do hop bao: `vatTaiDiem` chi doc `atlas`, `tiLe`, `camX/camY` va hai canh
 * khung. Khong ve gi nen `gl` khong duoc dung toi.
 */
function veGia(): Ve {
  return {
    gl: undefined as unknown as Ve['gl'],
    atlas,
    rongDev: 800,
    caoDev: 600,
    tiLe: 1,
    camX: 0,
    camY: 0,
    dem: 0,
  };
}

/** Ban do rong chi co danh sach vat the - `vatTaiDiem` khong dung gi khac. */
function banDoGia(vat: OVat[]): BanDo {
  return { canh: 64, duongCach: 8, nen: [], vat, daCoChu: new Set<number>() } as unknown as BanDo;
}

describe('cham vao vat the', () => {
  const ve = veGia();

  it('cham dung giua sprite thi trung no', () => {
    const v: OVat = { a: 0, b: 0, ten: 'nha_dan', o: 2 };
    const s = atlas.o('nha_dan');
    // Neo o (0,0) nam giua khung; sprite trai ra tu `-ox` den `w - ox`.
    const x: number = ve.rongDev / 2 - s.ox + s.w / 2;
    const y: number = ve.caoDev / 2 - s.oy + s.h / 2;
    expect(vatTaiDiem(ve, banDoGia([v]), x, y)).toBe(v);
  });

  it('cham ra ngoai hop bao thi khong trung gi', () => {
    const v: OVat = { a: 0, b: 0, ten: 'nha_dan', o: 2 };
    expect(vatTaiDiem(ve, banDoGia([v]), 5, 5)).toBeUndefined();
  });

  it('hai vat chong nhau thi tra ve cai DUNG GAN hon', () => {
    // `banDo.vat` xep theo truc sau tang dan: phan tu sau la phan tu dung gan man hinh hon.
    const xa: OVat = { a: 0, b: 0, ten: 'nha_dan', o: 2 };
    const gan: OVat = { a: 1, b: 1, ten: 'nha_dan', o: 2 };
    const s = atlas.o('nha_dan');
    const x: number = ve.rongDev / 2 - s.ox + s.w / 2;
    const y: number = ve.caoDev / 2 - s.oy + s.h / 2;
    // Diem nay nam trong hop bao cua ca hai: o (1,1) chi lech xuong nua o nen.
    expect(vatTaiDiem(ve, banDoGia([xa, gan]), x, y)).toBe(gan);
  });

  it('bo loc chan duoc vat khong muon nhan', () => {
    const cay: OVat = { a: 0, b: 0, ten: 'cay_soi', o: 1 };
    const nha: OVat = { a: 0, b: 0, ten: 'nha_dan', o: 2 };
    const s = atlas.o('nha_dan');
    const x: number = ve.rongDev / 2 - s.ox + s.w / 2;
    const y: number = ve.caoDev / 2 - s.oy + s.h / 2;
    const chi = (t: OVat): boolean => t.ten !== 'cay_soi';
    expect(vatTaiDiem(ve, banDoGia([nha, cay]), x, y, chi)).toBe(nha);
  });

  it('ten sprite khong co trong atlas thi bo qua, khong no', () => {
    const ma: OVat = { a: 0, b: 0, ten: 'khong_ton_tai', o: 1 };
    expect(vatTaiDiem(ve, banDoGia([ma]), ve.rongDev / 2, ve.caoDev / 2)).toBeUndefined();
  });
});
