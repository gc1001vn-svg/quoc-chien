/**
 * Thu 1 (30/09): icon nha tac, co `?tat=`, tilt-shift theo zoom.
 *
 * Icon doc HAI SO CHI-DOC cua `ThuNha` (`nhipTac`, `nhipDoi`). Test o day chay mot nha
 * that qua `nhip()` voi bo dem gia - khong dung trinh duyet, khong WebGL.
 */
import { describe, expect, it } from 'vitest';
import soTho from '../data/hieu_ung.json';
import { ThuNha, type BoDem, type DinhNghiaNha, type Giao } from '../src/sim/city/Buildings';
import { HINH } from '../src/render/Hat';
import { docCoTat, iconCua, tiltTheoZoom } from '../src/render/HieuUngThanhPho';

const boDem: BoDem = { meXong: () => {}, doi: () => {}, tac: () => {}, lamRa: () => {}, dungHet: () => {} };
/** Khong ai di vac hang: nha nao cung dung lai sau vai me. */
const giao = { xinLay: () => false, xinGiao: () => false } as unknown as Giao;

function nha(vao: DinhNghiaNha['vao'], kieu: DinhNghiaNha['kieu'] = 'san_xuat'): ThuNha {
  const def: DinhNghiaNha = {
    ten: 'thu', hien: 'Thử', sprite: 'thu', khu: 'san_xuat', cachNhau: 1, motKhoi: false,
    kieu, so: 1, nhip: 1, vao, ra: [{ hang: 'banh', so: 1 }],
  };
  return new ThuNha(def, 0, 0, { a: 0, b: 0 }, { a: 0, b: 1 }, 2);
}

const SAU = soTho.icon.sauNhip;

describe('icon nha tac', () => {
  it('kho day lau thi co icon "kho day", bot hang ra chay lai thi mat', () => {
    const n = nha([]);
    for (let i = 0; i < SAU + 10; i += 1) n.nhip(giao, boDem);
    expect(n.nhipTac()).toBeGreaterThanOrEqual(SAU);
    expect(iconCua(n, SAU)).toBe(HINH.khoDay);
    n.bot('banh', 10);
    for (let i = 0; i < 3; i += 1) n.nhip(giao, boDem);
    expect(n.nhipTac()).toBe(0);
    expect(iconCua(n, SAU)).toBeUndefined();
  });

  it('thieu hang vao lau thi co icon "thieu hang", co hang thi mat', () => {
    const n = nha([{ hang: 'bot', so: 1 }]);
    for (let i = 0; i < SAU; i += 1) n.nhip(giao, boDem);
    expect(iconCua(n, SAU)).toBe(HINH.thieuHang);
    n.nhan('bot', 1);
    n.nhip(giao, boDem);
    expect(n.nhipDoi()).toBe(0);
    expect(iconCua(n, SAU)).toBeUndefined();
  });

  it('tac ngan chua qua nguong thi chua hien - tranh nhap nhay', () => {
    const n = nha([{ hang: 'bot', so: 1 }]);
    for (let i = 0; i < SAU - 1; i += 1) n.nhip(giao, boDem);
    expect(iconCua(n, SAU)).toBeUndefined();
  });

  it('nha tieu thu (nha dan) khong mang icon', () => {
    const n = nha([{ hang: 'bot', so: 1 }], 'tieu_thu');
    for (let i = 0; i < SAU * 3; i += 1) n.nhip(giao, boDem);
    expect(iconCua(n, SAU)).toBeUndefined();
  });
});

describe('co ?tat=', () => {
  it('tat tung thu, nhieu thu cach dau phay, het = moi thu', () => {
    expect([...docCoTat(null)]).toEqual([]);
    expect(docCoTat('khoi,chim')).toEqual(new Set(['khoi', 'chim']));
    for (const t of ['hauky', 'tilt', 'khoi', 'chim', 'icon']) expect(docCoTat('het').has(t)).toBe(true);
  });
});

describe('tilt-shift theo zoom', () => {
  it('tat han khi thu nho het co, du manh tu tiltDuZoom', () => {
    expect(tiltTheoZoom(soTho.hauKy.tiltTuZoom)).toBe(0);
    expect(tiltTheoZoom(soTho.hauKy.tiltDuZoom)).toBeCloseTo(soTho.hauKy.tilt);
    expect(tiltTheoZoom(2)).toBeCloseTo(soTho.hauKy.tilt);
    expect(tiltTheoZoom(0.6)).toBeLessThan(tiltTheoZoom(0.8));
  });
});
