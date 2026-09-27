/**
 * Phase 11B: so dung man the gioi. Luat chinh: nut sang <=> bam that an - moi nut doi chieu
 * voi chinh hanh dong cua `TheGioi` / `HanhDong`, khong chi voi chu ly do.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { docDuLieuTran, type DuLieuTran } from '../src/sim/campaign/Battle';
import { dungBanDoTinh, type BanDoTinh, type CauHinhBanDoTinh, type CauHinhNuoc } from '../src/sim/campaign/BanDoTinh';
import { chonBatOn } from '../src/sim/campaign/HanhDong';
import { hangNgoaiGiao, manKet, tanCongTinh, TEN_TRANG_THAI, thanhTren, theBatOn } from '../src/sim/campaign/HienTheGioi';
import { TheGioi, type SoNuocTa } from '../src/sim/campaign/TheGioi';
import { docTheGioi, type DuLieuTheGioi } from '../src/sim/campaign/TheGioiData';

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

const tran: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), doc('battle.json'));
const du: DuLieuTheGioi = docTheGioi(doc('the_gioi.json'), doc('victory.json'), new Set(tran.doi.keys()));
const banDo: BanDoTinh = dungBanDoTinh(doc('provinces.json') as CauHinhBanDoTinh, doc('nations.json') as CauHinhNuoc);
const YEN: SoNuocTa = { soNha: 200, doi: 1, soCongNgheXong: 0, doiXongHet: 0, thieuLuongThuc: false, theDangLap: [] };
const moi = (): TheGioi => new TheGioi(du, banDo, tran);
const hang = (tg: TheGioi, id: string) => hangNgoaiGiao(tg, banDo).find((h) => h.id === id);

describe('thanhTren', () => {
  it('doc dung so nuoc ta, vang lam tron xuong', () => {
    const tg = moi();
    tg.nuoc(tg.ta).vang = 12.9;
    const s = thanhTren(tg);
    expect(s).toMatchObject({ vang: 12, gio: 0, nguongThe: du.batOn.nguongThe });
    expect(s.soTinh).toBe(tg.tinhCua(tg.ta).length);
  });
});

describe('hangNgoaiGiao', () => {
  it('moi nuoc tru ta, theo thu tu nations.json, ten trang thai tieng Viet', () => {
    const tg = moi();
    const ds = hangNgoaiGiao(tg, banDo);
    expect(ds.map((h) => h.id)).toEqual(banDo.nuoc.filter((n) => n.id !== tg.ta).map((n) => n.id));
    for (const h of ds) expect(h.tenTrangThai).toBe(TEN_TRANG_THAI[h.trangThai]);
  });

  it('dang chien: khoa tuyen chien va mo buon; dang buon thi van cat duoc', () => {
    const tg = moi();
    const [a, b] = banDo.nuoc.filter((n) => n.id !== tg.ta).map((n) => n.id) as [string, string];
    tg.tuyenChien(tg.ta, a);
    expect(hang(tg, a)?.nutTuyenChien).toEqual({ duoc: false, lyDo: 'Đang chiến tranh' });
    expect(hang(tg, a)?.nutThuongMai).toEqual({ duoc: false, lyDo: 'Đang chiến tranh' });
    expect(tg.ngoaiGiao.datThuongMai(tg.ta, a, true)).toBe(false);
    tg.ngoaiGiao.datThuongMai(tg.ta, b, true);
    expect(hang(tg, b)?.thuongMai).toBe(true);
    expect(hang(tg, b)?.nutThuongMai.duoc).toBe(true);
    expect(hang(tg, b)?.nutTuyenChien.duoc).toBe(true);
  });

  it('nut dam phan khop dung ket qua tg.damPhan', () => {
    const tg = moi();
    const khac = banDo.nuoc.filter((n) => n.id !== tg.ta).map((n) => n.id);
    const [a, b, c] = khac as [string, string, string];
    // a: thieu vang. b: du vang, dang chien, ho manh hon. c: du vang, hoa binh.
    tg.nuoc(tg.ta).vang = du.ngoaiGiao.damPhan.vang - 1;
    expect(hang(tg, a)?.nutDamPhan).toEqual({ duoc: false, lyDo: `Cần ${String(du.ngoaiGiao.damPhan.vang)} vàng` });
    expect(tg.damPhan(tg.ta, a)).toBe(false);

    tg.nuoc(tg.ta).vang = 1000;
    tg.tuyenChien(tg.ta, b);
    tg.nuoc(tg.ta).quan = [];
    tg.nuoc(b).quan = Array(10).fill('ky_binh') as string[];
    expect(hang(tg, b)?.nutDamPhan).toEqual({ duoc: false, lyDo: 'Họ mạnh hơn, không chịu hoà' });
    expect(tg.damPhan(tg.ta, b)).toBe(false);

    expect(hang(tg, c)?.nutDamPhan.duoc).toBe(true);
    expect(tg.damPhan(tg.ta, c)).toBe(true);
  });

  it('deDoaThang theo ti le suc va khop ket qua tg.deDoa', () => {
    const tg = moi();
    const a = banDo.nuoc.find((n) => n.id !== tg.ta)?.id ?? '';
    tg.nuoc(tg.ta).quan = Array(10).fill('ky_binh') as string[];
    tg.nuoc(a).quan = ['giao_thu'];
    const h = hang(tg, a);
    expect(h?.tiLeSuc).toBeCloseTo(tg.suc(tg.ta) / Math.max(1, tg.suc(a)));
    expect(h?.deDoaThang).toBe(true);
    expect(tg.deDoa(tg.ta, a)).toBe(true);
    tg.nuoc(tg.ta).quan = [];
    expect(hang(tg, a)?.deDoaThang).toBe(false);
    expect(tg.deDoa(tg.ta, a)).toBe(false);
  });

  it('nuoc da mat: ca bon nut khoa, ly do mat nuoc', () => {
    const tg = moi();
    const a = banDo.nuoc.find((n) => n.id !== tg.ta)?.id ?? '';
    tg.nuoc(a).conSong = false;
    const h = hang(tg, a);
    expect(h?.conSong).toBe(false);
    for (const n of [h?.nutThuongMai, h?.nutDamPhan, h?.nutDeDoa, h?.nutTuyenChien]) {
      expect(n).toEqual({ duoc: false, lyDo: 'Đã mất nước' });
    }
  });
});

describe('theBatOn', () => {
  /** Day bat on toi luc the mo: thieu an lien tuc. */
  const moThe = (tg: TheGioi): void => {
    for (let g = 0; g < 200 && !tg.batOn.theMo; g++) tg.gioTiep({ ...YEN, thieuLuongThuc: true });
  };

  it('dong the luc yen; mo the thi dem gio con toi noi loan', () => {
    const tg = moi();
    expect(theBatOn(tg).mo).toBe(false);
    expect(theBatOn(tg).gioConNoiLoan).toBe(du.batOn.gioNoiLoan);
    moThe(tg);
    expect(theBatOn(tg).mo).toBe(true);
    const truoc = theBatOn(tg).gioConNoiLoan;
    tg.gioTiep({ ...YEN, thieuLuongThuc: true });
    expect(theBatOn(tg).gioConNoiLoan).toBe(Math.max(0, truoc - 1));
    expect(theBatOn(tg).gioConNoiLoan).toBeGreaterThanOrEqual(0);
  });

  it('lua chon khoa dung khi thieu vang - va chonBatOn cung tu choi dung khi do', () => {
    for (const lc of du.batOn.luaChon) {
      for (const vang of [0, 1000]) {
        const tg = moi();
        moThe(tg);
        tg.nuoc(tg.ta).vang = vang;
        const hien = theBatOn(tg).luaChon.find((l) => l.id === lc.id);
        expect(hien?.nut.duoc).toBe(vang + lc.vang >= 0);
        if (hien?.nut.duoc === false) expect(hien.nut.lyDo).toBe(`Cần ${String(-lc.vang)} vàng`);
        expect(chonBatOn(tg, lc.id)).toBe(hien?.nut.duoc);
      }
    }
  });

  it('mo ta hau qua ghi bat on va nhung khoan khac 0', () => {
    const tg = moi();
    const ds = theBatOn(tg).luaChon;
    const danAp = du.batOn.luaChon.find((l) => l.matDoi > 0);
    expect(ds.every((l) => l.moTa.includes('bất ổn'))).toBe(true);
    if (danAp !== undefined) expect(ds.find((l) => l.id === danAp.id)?.moTa).toContain(`mất ${String(danAp.matDoi)} đội`);
  });
});

describe('tanCongTinh', () => {
  it('khoa kem ly do dung khi lyDoKhongDanh khac rong, xac suat 0', () => {
    const tg = moi();
    const cuaTa = tg.tinhCua(tg.ta)[0] ?? '';
    const khac = banDo.nuoc.find((n) => n.id !== tg.ta)?.id ?? '';
    const tinhKhac = tg.tinhCua(khac).find((t) => tg.lyDoKhongDanh(tg.ta, t) === 'khong-dang-chien');
    const xa = banDo.tinh.find((t) => tg.lyDoKhongDanh(tg.ta, t.id) === 'khong-ke')?.id ?? '';
    expect(tanCongTinh(tg, cuaTa)).toEqual({ nut: { duoc: false, lyDo: 'Tỉnh của ta' }, xacSuat: 0 });
    expect(tanCongTinh(tg, xa).nut).toEqual({ duoc: false, lyDo: 'Không giáp đất ta' });
    if (tinhKhac !== undefined) expect(tanCongTinh(tg, tinhKhac).nut.lyDo).toBe('Chưa tuyên chiến');
    const trungLap = tg.mucTieu(tg.ta)[0] ?? '';
    tg.nuoc(tg.ta).quan = [];
    expect(tanCongTinh(tg, trungLap).nut.lyDo).toBe('Hết quân');
    tg.nuoc(tg.ta).quan = ['kiem_si'];
    tg.nuoc(tg.ta).gioNghi = 2;
    expect(tanCongTinh(tg, trungLap).nut.lyDo).toBe('Quân đang nghỉ');
  });

  it('danh duoc thi xac suat trong (0, 1] va tg.tanCong nhan lenh', () => {
    const tg = moi();
    tg.nuoc(tg.ta).quan = Array(6).fill('ky_binh') as string[];
    const t = tg.mucTieu(tg.ta)[0] ?? '';
    const tc = tanCongTinh(tg, t);
    expect(tc.nut.duoc).toBe(true);
    expect(tc.xacSuat).toBeGreaterThan(0);
    expect(tc.xacSuat).toBeLessThanOrEqual(1);
    expect(tg.tanCong(tg.ta, t)).toBe('');
    // Vua danh xong thi nghi: nut khoa lai, dung nhu tg.tanCong.
    const t2 = tg.mucTieu(tg.ta)[0] ?? '';
    expect(tanCongTinh(tg, t2).nut.duoc).toBe(tg.lyDoKhongDanh(tg.ta, t2) === '');
  });
});

describe('manKet', () => {
  it('dang choi thi undefined; thang Khoa hoc thi co tieu de, gio', () => {
    const tg = moi();
    expect(manKet(tg)).toBeUndefined();
    tg.gioTiep({ ...YEN, doi: 5, doiXongHet: du.thang.khoaHocDoi });
    const k = manKet(tg);
    expect(k).toMatchObject({ thang: true, gio: tg.ketQua.gio });
    expect(k?.tieuDe).not.toBe('');
    expect(k?.moTa).toContain('Khoa học');
  });

  it('mat thu do thi thua', () => {
    const tg = moi();
    const thuDo = banDo.tinh.find((t) => t.nuoc === tg.ta && t.thuDo)?.id ?? '';
    const [ke] = banDo.nuoc.filter((n) => n.id !== tg.ta && tg.keNuoc(n.id, tg.ta)).map((n) => n.id);
    expect(ke).toBeDefined();
    const dich = ke ?? '';
    tg.tuyenChien(dich, tg.ta);
    tg.nuoc(tg.ta).quan = [];
    tg.nuoc(dich).quan = Array(10).fill('ky_binh') as string[];
    for (let lan = 0; lan < 30 && tg.chu(thuDo) === tg.ta; lan++) {
      for (const t of tg.mucTieu(dich)) {
        if (tg.chu(t) === tg.ta) {
          tg.nuoc(dich).gioNghi = 0;
          tg.tanCong(dich, t);
        }
      }
    }
    const k = manKet(tg);
    expect(k).toMatchObject({ thang: false, moTa: 'Mất thủ đô' });
  });
});

describe('khong doi the gioi', () => {
  it('goi du bon ham, so the gioi y nguyen', () => {
    const tg = moi();
    tg.gioTiep(YEN);
    const truoc = JSON.stringify([tg.dsNuoc, tg.gio, tg.batOn.chiSo, tg.nhatKy.length]);
    thanhTren(tg);
    hangNgoaiGiao(tg, banDo);
    theBatOn(tg);
    for (const t of banDo.tinh) tanCongTinh(tg, t.id);
    manKet(tg);
    expect(JSON.stringify([tg.dsNuoc, tg.gio, tg.batOn.chiSo, tg.nhatKy.length])).toBe(truoc);
  });
});
