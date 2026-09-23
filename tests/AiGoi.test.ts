/**
 * Hang rao cho `scripts/ai_goi.mjs`.
 *
 * Script nay song bang mot loi hua: cho no in ra la cho GOI THAT, khong phai cho
 * trung ten. Hai ca duoi day la hai nua cua loi hua do, do tren chinh ma dang
 * chay: `xayNha` phai ra du bon cho goi (`grep` ra sau vi dem ca comment va dong
 * khai bao), va `doi` phai BO nhung khai bao trung ten khong giu ham.
 *
 * Nang chuong trinh TypeScript mat vai giay nen ca file dung chung MOT program.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import type ts from 'typescript';
import { docChuongTrinh, timCaller, timKhaiBao } from '../scripts/ai_goi.mjs';

let program: ts.Program;

beforeAll(() => {
  program = docChuongTrinh();
}, 60_000);

describe('ai_goi — cho goi that', () => {
  it('xayNha: du nam cho goi, mot khai bao', () => {
    const kq = timCaller(program, 'xayNha');
    expect(kq.khai_bao.map((k) => k.file)).toEqual(['src/sim/city/City.ts']);
    expect(kq.cho.map((c) => c.file)).toEqual([
      'src/sim/autoplay/Governor.ts',
      'src/sim/autoplay/Governor.ts',
      'src/sim/decision/HauQua.ts',
      'tests/NhaKinhTeHien.test.ts',
      'tests/NhaKinhTeHien.test.ts',
    ]);
  });

  it('ghi ten ham bao, khong chi ghi so dong', () => {
    const kq = timCaller(program, 'xayNha');
    expect(kq.cho.map((c) => c.trong)).toEqual([
      'moiGio',
      'moiGio',
      'apHauQua',
      '<muc file>',
      '<muc file>',
    ]);
  });

  it('khong co ten do thi noi thang, khong tra danh sach rong im lang', () => {
    const kq = timCaller(program, 'khongHeCoTenNayDau');
    expect(kq.khai_bao).toHaveLength(0);
    expect(kq.cho).toHaveLength(0);
  });
});

describe('ai_goi — loc khai bao', () => {
  it('bo bien trung ten khong giu ham', () => {
    const ds = timKhaiBao(program, 'doi');
    expect(ds.length).toBeGreaterThan(0);
    const kq = timCaller(program, 'doi');
    expect(kq.khai_bao.every((k) => k.loai !== 'bien')).toBe(true);
  });

  it('caller cua doi deu la cho goi method that', () => {
    const kq = timCaller(program, 'doi');
    expect(kq.cho.map((c) => `${c.file}:${String(c.dong)}`)).toEqual([
      'src/sim/city/Buildings.ts:224',
      'src/sim/city/Buildings.ts:241',
      'src/render/DoiMeAtlas.ts:71',
    ]);
  });
});
