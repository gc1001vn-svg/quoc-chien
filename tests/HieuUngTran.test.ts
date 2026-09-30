/**
 * Thu 2 (30/09): hieu ung man tran - khung khung, tin hieu cho tung canh, co `?tat=`.
 *
 * Lop hieu ung do hat vao mot bo dem gia (`NoiHat`) - khong trinh duyet, khong WebGL.
 */
import { describe, expect, it } from 'vitest';
import soTho from '../data/hieu_ung.json';
import { HINH } from '../src/render/Hat';
import { docCoTat } from '../src/render/HieuUngThanhPho';
import { buocDongHo, doiVo, HieuUngTran, type KhungTran, type NoiHat } from '../src/render/HieuUngTran';
import type { LinhVe, MuiTen } from '../src/render/DienTranCoBan';
import type { Canh } from '../src/sim/campaign/BattleScript';

const SO = soTho.tran;

const KICH_BAN: Canh[] = [
  { giay: 0, loai: 'tien', ben: 'a', doi: -1, chu: '' },
  { giay: 10, loai: 'ban', ben: 'a', doi: 0, chu: '' },
  { giay: 12, loai: 'giap_la_ca', ben: 'b', doi: 1, chu: '' },
  { giay: 25, loai: 'vo', ben: 'b', doi: 1, chu: '' },
  { giay: 25.5, loai: 'vo', ben: 'a', doi: 0, chu: '' },
  { giay: 40, loai: 'ket_thuc', ben: 'a', doi: -1, chu: '' },
];

const KHUNG: KhungTran = { camX: 0, camY: 0, tiLe: 1, rongDev: 800, caoDev: 800, oPx: 64, dpr: 1 };

/** Bo dem gia: ghi lai kieu hinh va mau cua moi hat. */
function demHat(): NoiHat & { kieu: number[]; mau: number[][] } {
  const kieu: number[] = [];
  const mau: number[][] = [];
  return {
    kieu, mau,
    them: (_x, _y, _rx, _ry, r, g, b, _a, k) => { kieu.push(Math.floor(k + 0.001)); mau.push([r, g, b]); },
  };
}

const linh = (dang: LinhVe['dang'], ben: LinhVe['ben'] = 'a', doi = 0, a = 5): LinhVe => ({ a, b: 5, ten: 'x', ben, doi, dang });
const muiTen = (tuoi: number, con: number): MuiTen => ({ a: 5, b: 5, cao: 0, ten: 'dan_h0', tuoi, con });

describe('khung khung (Sakurai)', () => {
  it('di qua moc vo thi dung dung o moc, khung voMs; qua ket_thuc khung lau hon; ca hai duoi tran', () => {
    expect(buocDongHo(24.9, 0.5, KICH_BAN)).toEqual({ giay: 25, dungMs: Math.min(SO.khung.voMs, SO.khung.tranMs) });
    expect(buocDongHo(39.8, 1, KICH_BAN)).toEqual({ giay: 40, dungMs: Math.min(SO.khung.ketThucMs, SO.khung.tranMs) });
    expect(SO.khung.ketThucMs).toBeGreaterThan(SO.khung.voMs);
    expect(Math.max(SO.khung.voMs, SO.khung.ketThucMs)).toBeLessThanOrEqual(SO.khung.tranMs);
  });

  it('khong qua moc nao thi chay thang; dung dung tai moc thi khong khung lai', () => {
    expect(buocDongHo(13, 0.5, KICH_BAN)).toEqual({ giay: 13.5, dungMs: 0 });
    expect(buocDongHo(25, 0.2, KICH_BAN)).toEqual({ giay: 25.2, dungMs: 0 });
  });

  it('toc xem cao: moi buoc chi mot moc, hai vo gan nhau khung rieng tung lan', () => {
    expect(buocDongHo(24, 5, KICH_BAN).giay).toBe(25);
    expect(buocDongHo(25, 5, KICH_BAN).giay).toBe(25.5);
  });

  it('dong ho dung het so ms khung roi moi chay tiep; `?tat=khung` thi khong dung', () => {
    const h = new HieuUngTran(demHat(), KICH_BAN, new Set(), false);
    expect(h.buoc(24.9, 0.5, 16)).toBe(25);
    let giay = 25;
    let khung = 0;
    while (giay === 25 && khung < 100) { giay = h.buoc(giay, 0.016, 16); khung += 1; }
    expect(khung).toBe(Math.ceil(SO.khung.voMs / 16) + 1);
    const tat = new HieuUngTran(demHat(), KICH_BAN, docCoTat('khung'), false);
    expect(tat.buoc(24.9, 0.5, 16)).toBeCloseTo(25.4);
  });
});

describe('tin hieu tung canh', () => {
  it('tien: linh dang di sinh bui; `?tat=bui` thi khong', () => {
    const d = demHat();
    new HieuUngTran(d, KICH_BAN, new Set(), false).chay(KHUNG, [linh('di'), linh('di')], [], 3, 0.016, 2);
    expect(d.kieu.filter((k) => k === HINH.tron).length).toBe(2);
    const t = demHat();
    new HieuUngTran(t, KICH_BAN, docCoTat('bui'), false).chay(KHUNG, [linh('di')], [], 3, 0.016, 2);
    expect(t.kieu).toEqual([]);
  });

  it('ban: tran sung phut khoi khi dan vua roi nong, tran co toe bui khi ten cam; `?tat=khoi` thi khong', () => {
    const sung = demHat();
    new HieuUngTran(sung, KICH_BAN, new Set(), true).chay(KHUNG, [], [muiTen(0.01, 0.5), muiTen(0.3, 0.2)], 11, 0.016, 0.05);
    expect(sung.kieu.length).toBe(1);
    const co = demHat();
    new HieuUngTran(co, KICH_BAN, new Set(), false).chay(KHUNG, [], [muiTen(0.01, 0.5), muiTen(0.3, 0.02)], 11, 0.016, 0.05);
    expect(co.kieu.length).toBe(1);
    const tat = demHat();
    new HieuUngTran(tat, KICH_BAN, docCoTat('khoi'), true).chay(KHUNG, [], [muiTen(0.01, 0.5)], 11, 0.016, 0.05);
    expect(tat.kieu).toEqual([]);
  });

  it('giap la ca: nguoi MOI trung don thi chop + tia, dung yen khung sau thi khong chop lai', () => {
    const d = demHat();
    const h = new HieuUngTran(d, KICH_BAN, docCoTat('bui'), false);
    h.chay(KHUNG, [linh('trung', 'b', 1)], [], 13, 0, 0.016);
    const lan1 = d.kieu.length;
    expect(lan1).toBeGreaterThanOrEqual(1 + (SO.chop.soTia[0] ?? 0));
    d.kieu.length = 0;
    h.chay(KHUNG, [linh('trung', 'b', 1)], [], 13.02, 0, 0.016);
    expect(d.kieu.length).toBe(lan1);
    const t = demHat();
    new HieuUngTran(t, KICH_BAN, docCoTat('chop'), false).chay(KHUNG, [linh('trung', 'b', 1)], [], 13, 0.016, 0.016);
    expect(t.kieu).toEqual([]);
  });

  it('vo: doi vo co co trang va nhat mau; doi chua vo thi khong; `?tat=co,nhat` thi khong', () => {
    expect([...doiVo(KICH_BAN, 25.2)]).toEqual(['b1']);
    const d = demHat();
    new HieuUngTran(d, KICH_BAN, docCoTat('bui'), false).chay(KHUNG, [linh('di', 'b', 1), linh('di', 'a', 0)], [], 25.2, 0.016, 0);
    expect(d.kieu.filter((k) => k === HINH.co).length).toBe(1);
    expect(d.mau[d.kieu.indexOf(HINH.co)]).toEqual(SO.co.trang);
    expect(d.kieu.filter((k) => k === HINH.tron).length).toBe(1);
    const t = demHat();
    new HieuUngTran(t, KICH_BAN, docCoTat('bui,co,nhat'), false).chay(KHUNG, [linh('di', 'b', 1)], [], 25.2, 0.016, 0);
    expect(t.kieu).toEqual([]);
  });

  it('ket thuc: co mau ben thang dung len sau khi nay; `?tat=het` thi man trong', () => {
    const d = demHat();
    const h = new HieuUngTran(d, KICH_BAN, docCoTat('bui,nhat'), false);
    h.chay(KHUNG, [linh('di', 'a', 1)], [], 40, 0, 0);
    h.chay(KHUNG, [linh('di', 'a', 1)], [], 40, SO.co.nayGiay, 0);
    expect(d.mau.filter((_, i) => d.kieu[i] === HINH.co)).toContainEqual(SO.co.ben.a);
    const het = demHat();
    new HieuUngTran(het, KICH_BAN, docCoTat('het'), true).chay(KHUNG, [linh('di', 'a', 1), linh('trung', 'b', 1)], [muiTen(0.01, 0.5)], 40, 0.5, 2);
    expect(het.kieu).toEqual([]);
  });
});
