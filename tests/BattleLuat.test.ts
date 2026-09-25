/**
 * Luat tran danh tren bo du lieu MAU (khong phai data/*.json): moi truong mot gia tri rieng,
 * doc nham truong la ket qua doi. Soat 24/09: bo test dau chi bat 2/15 loi cai thu.
 */
import { describe, expect, it } from 'vitest';
import { docDuLieuTran, duDoan, tinhTran, type Ben, type DuLieuTran, type KetQuaTran } from '../src/sim/campaign/Battle';
import { sinhKichBan } from '../src/sim/campaign/BattleScript';

const BANG = { giap: ['da', 'tam'], dan: { chem: [1.5, 0.25], dam: [0.9, 0.8] } };

function taoDoi(id: string, khac: Record<string, unknown> = {}): Record<string, unknown> {
  return { id, hien: id, nhom: 'mau', doi: 1, gia: 50, linh: 10, mau: 10, sat_thuong: 1, tam: 1, toc_do: 3, giap: 'da', dan: 'dam', ...khac };
}

const DOI = {
  doi: [
    taoDoi('kiem', { dan: 'chem' }),
    taoDoi('bia_da'),
    taoDoi('bia_tam', { giap: 'tam' }),
    taoDoi('nhanh', { toc_do: 8 }),
    taoDoi('cham', { toc_do: 1, tam: 6 }),
    taoDoi('xa_manh', { tam: 100, sat_thuong: 1 }),
    taoDoi('xa_yeu', { tam: 100, sat_thuong: 0.1 }),
    taoDoi('bia_cam', { sat_thuong: 0, mau: 30 }),
  ],
};

const TRAN = {
  chien_truong: 40, hang_xuat_phat: 4, nhip_giay: 0.5, tran_giay: 60, giay_mau_vet: 0.5, nguong_vo: 0.25,
  nhieu: 0, he_so_tuong: 0.1, tuong_toi_da: 3, do_doc: 8, he_so_tam: 0, mu_phong_thu: 1,
  dia_hinh: {
    phang: { toc_do: 1, phong_thu: 1 },
    thu: { toc_do: 1, phong_thu: 0.5 },
    lay: { toc_do: 0.5, phong_thu: 1 },
  },
};

const du: DuLieuTran = docDuLieuTran(BANG, DOI, TRAN);

function ben(id: string, n: number, tuong = 0): Ben {
  return { doi: Array<string>(n).fill(id), tuong };
}

function tran(a: Ben, b: Ben, diaHinh = 'phang', duLieu: DuLieuTran = du, hat = 1): KetQuaTran {
  return tinhTran({ a, b, diaHinh }, duLieu, hat);
}

/** Giay dau tien ben `p` gay sat thuong. */
function giayCham(kq: KetQuaTran, p: 'a' | 'b'): number {
  return kq.suKien.find((s) => s.loai === 'danh' && s.ben === p)?.giay ?? Infinity;
}

describe('bang giap x dan', () => {
  it('doc dung o: dong = dan, cot = giap', () => {
    expect(du.heSo('da', 'chem')).toBe(1.5);
    expect(du.heSo('tam', 'chem')).toBe(0.25);
    expect(du.heSo('da', 'dam')).toBe(0.9);
    expect(du.heSo('tam', 'dam')).toBe(0.8);
  });

  it('sat thuong tra theo GIAP cua dich va DAN cua ben danh', () => {
    const vaoDa = tran(ben('kiem', 3), ben('bia_da', 3));
    const vaoTam = tran(ben('kiem', 3), ben('bia_tam', 3));
    // chem vao da 1.5, vao tam 0.25 - dich giap tam song lau hon han.
    expect(vaoDa.thang).toBe('a');
    expect(vaoTam.thang).toBe('b');
  });

  it('bang thieu cot thi nem loi', () => {
    expect(() => docDuLieuTran({ giap: ['da', 'tam'], dan: { chem: [1] } }, DOI, TRAN)).toThrow(/chem/);
  });
});

describe('tinhTran - tung luat', () => {
  it('ben thua co doi vo, chet it hon quan so (nguong vo), ben thang cung co chet', () => {
    const kq = tran(ben('bia_da', 4), ben('bia_da', 2));
    expect(kq.thang).toBe('a');
    const vo = kq.suKien.filter((s) => s.loai === 'vo' && s.ben === 'b').map((s) => s.doi);
    expect(vo.sort()).toEqual([0, 1]);
    expect(kq.chetB).toBeGreaterThan(0);
    expect(kq.chetB).toBeLessThan(kq.linhB);
    expect(kq.chetA).toBeGreaterThan(0);
  });

  it('dia hinh phong thu lam ben b giu dat chet it hon', () => {
    const phang = tran(ben('bia_da', 3), ben('bia_da', 3), 'phang');
    const thu = tran(ben('bia_da', 3), ben('bia_da', 3), 'thu');
    expect(thu.thang).toBe('b');
    expect(thu.chetB).toBeLessThan(phang.chetB);
  });

  it('tuong gioi lam ben do thang tran guong', () => {
    expect(tran(ben('bia_da', 3, 3), ben('bia_da', 3, 0)).thang).toBe('a');
    expect(tran(ben('bia_da', 3, 0), ben('bia_da', 3, 3)).thang).toBe('b');
  });

  it('dia hinh lay lam giap mat muon hon', () => {
    expect(giayCham(tran(ben('bia_da', 2), ben('bia_da', 2), 'lay'), 'a')).toBeGreaterThan(
      giayCham(tran(ben('bia_da', 2), ben('bia_da', 2), 'phang'), 'a'),
    );
  });

  it('giu hang: doi nhanh di cung doi cham toi luc cham dich', () => {
    const b: Ben = ben('bia_da', 2);
    const coCham = tran({ doi: ['nhanh', 'cham'], tuong: 0 }, b);
    const toanNhanh = tran({ doi: ['nhanh', 'nhanh'], tuong: 0 }, b);
    expect(giayCham(coCham, 'a')).toBeGreaterThan(giayCham(toanNhanh, 'a'));
  });

  it('het gio: ben con nhieu phan mau hon thang, du la ben nao', () => {
    const ngan: DuLieuTran = { ...du, tranGiay: 2 };
    const a = tran(ben('xa_manh', 3), ben('xa_yeu', 3), 'phang', ngan);
    expect(a.giayKetThuc).toBe(2);
    expect(a.thang).toBe('a');
    expect(tran(ben('xa_yeu', 3), ben('xa_manh', 3), 'phang', ngan).thang).toBe('b');
  });

  it('nhieu co trung binh 1: bat nhieu khong lam dich vo nhanh len', () => {
    // Dich khong danh tra, nen giay vo chi phu thuoc tong sat thuong ben a.
    const on: DuLieuTran = { ...du, nhieu: 0.9 };
    let giayOn = 0;
    const giayTat: number = tran(ben('xa_manh', 2), ben('bia_cam', 2)).giayKetThuc * 40;
    for (let hat = 0; hat < 40; hat += 1) giayOn += tran(ben('xa_manh', 2), ben('bia_cam', 2), 'phang', on, hat).giayKetThuc;
    expect(giayOn / giayTat).toBeGreaterThan(0.9);
    expect(giayOn / giayTat).toBeLessThan(1.1);
  });
});

describe('doc du lieu hong - soat 24/09 (Jules + Claude)', () => {
  const doiSai = (khac: Record<string, unknown>): { doi: Record<string, unknown>[] } => ({ doi: [taoDoi('loi', khac)] });

  it('so trong units.json phai la so huu han dung mien', () => {
    for (const khac of [
      { linh: Number.NaN }, { linh: 2.5 }, { mau: '10' }, { mau: Number.NaN }, { sat_thuong: -1 },
      { sat_thuong: Number.NaN }, { tam: 0 }, { toc_do: -1 }, { gia: 0 }, { linh: undefined },
    ]) {
      expect(() => docDuLieuTran(BANG, doiSai(khac), TRAN), JSON.stringify(khac)).toThrow(/loi/);
    }
  });

  it('bien dung mien van nhan: sat thuong 0, toc do 0', () => {
    expect(() => docDuLieuTran(BANG, doiSai({ sat_thuong: 0, toc_do: 0 }), TRAN)).not.toThrow();
  });

  it('trung ma doi thi nem loi, khong ghi de im lang', () => {
    expect(() => docDuLieuTran(BANG, { doi: [taoDoi('kiem'), taoDoi('kiem', { gia: 1 })] }, TRAN)).toThrow(/kiem/);
  });

  it('he so giap x dan am hoac khong phai so thi nem loi', () => {
    expect(() => docDuLieuTran({ giap: ['da', 'tam'], dan: { chem: [-1, 1] } }, DOI, TRAN)).toThrow(/chem/);
    expect(() => docDuLieuTran({ giap: ['da', 'tam'], dan: { chem: [1, Number.NaN] } }, DOI, TRAN)).toThrow(/chem/);
  });

  it('nhip_giay <= 0 bi chan luc doc - khong thi tinhTran lap vo han', () => {
    for (const v of [0, -0.5]) expect(() => docDuLieuTran(BANG, DOI, { ...TRAN, nhip_giay: v })).toThrow(/nhip_giay/);
  });

  it('thieu hay sai truong so trong battle.json thi nem loi dung ten truong', () => {
    const thieu: Record<string, unknown> = { ...TRAN };
    delete thieu.nguong_vo;
    expect(() => docDuLieuTran(BANG, DOI, thieu)).toThrow(/nguong_vo/);
    expect(() => docDuLieuTran(BANG, DOI, { ...TRAN, nguong_vo: 1 })).toThrow(/nguong_vo/);
    expect(() => docDuLieuTran(BANG, DOI, { ...TRAN, tran_giay: -5 })).toThrow(/tran_giay/);
    expect(() => docDuLieuTran(BANG, DOI, { ...TRAN, dia_hinh: { phang: { toc_do: -1, phong_thu: 1 } } })).toThrow(/phang/);
  });
});

describe('hai ben cung vo trong mot nhip', () => {
  it('ben giu dat (b) thang - cung luat voi het gio hoa nhau', () => {
    // Tran guong, khong nhieu: hai ben vo dung cung nhip. Truoc 24/09 ben a luon thang.
    const kq = tran(ben('bia_da', 2), ben('bia_da', 2));
    const vo = (p: 'a' | 'b'): number => kq.suKien.filter((s) => s.loai === 'vo' && s.ben === p).length;
    expect(vo('a')).toBe(2);
    expect(vo('b')).toBe(2);
    expect(kq.thang).toBe('b');
  });
});

describe('kiem dau vao', () => {
  it('ben rong, tuong am, tuong vuot tran, tuong le thi nem loi ca o duDoan lan tinhTran', () => {
    const tot: Ben = ben('bia_da', 2);
    for (const sai of [{ doi: [], tuong: 0 }, ben('bia_da', 2, -1), ben('bia_da', 2, 4), ben('bia_da', 2, 1.5)]) {
      expect(() => duDoan({ a: tot, b: sai, diaHinh: 'phang' }, du)).toThrow();
      expect(() => tran(sai, tot)).toThrow();
    }
    expect(() => tran(tot, tot, 'sa_mac')).toThrow(/sa_mac/);
  });

  it('tuong dung bang tran thi van nhan', () => {
    expect(() => tran(ben('bia_da', 2, 3), ben('bia_da', 2, 0))).not.toThrow();
  });
});

describe('sinhKichBan - tung canh', () => {
  it('doi danh xa la "ban", doi can chien la "giap_la_ca"', () => {
    const vao = { a: { doi: ['cham', 'kiem'], tuong: 0 }, b: ben('bia_da', 2), diaHinh: 'phang' };
    const kb = sinhKichBan(tinhTran(vao, du, 1), vao, du);
    expect(kb.find((c) => c.ben === 'a' && c.doi === 0 && c.loai !== 'vo')?.loai).toBe('ban');
    expect(kb.find((c) => c.ben === 'a' && c.doi === 1 && c.loai !== 'vo')?.loai).toBe('giap_la_ca');
  });

  it('canh cuoi goi dung ben thang', () => {
    const vao = { a: ben('bia_da', 4), b: ben('bia_da', 2), diaHinh: 'phang' };
    const cuoi = sinhKichBan(tinhTran(vao, du, 1), vao, du).at(-1);
    expect(cuoi?.ben).toBe('a');
    expect(cuoi?.chu).toMatch(/quân địch rút — quân ta thắng/);
  });
});
