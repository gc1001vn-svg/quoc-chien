/**
 * Phase 11A: lop the gioi chay ngam - ngoai giao, bat on, quan, thang thua.
 * Nuoc nguoi choi an so gia (`SoNuocTa`) de test khong phai chay thanh pho that.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { docDuLieuTran, type DuLieuTran } from '../src/sim/campaign/Battle';
import { dungBanDoTinh, tinhKe, type BanDoTinh, type CauHinhBanDoTinh, type CauHinhNuoc } from '../src/sim/campaign/BanDoTinh';
import { BatOn } from '../src/sim/campaign/BatOn';
import { danh, doiMuaDuoc, muaQuan, sucQuan } from '../src/sim/campaign/ChienTranh';
import { NgoaiGiao } from '../src/sim/campaign/NgoaiGiao';
import { TheGioi, type SoNuocTa } from '../src/sim/campaign/TheGioi';
import { docTheGioi, type DuLieuTheGioi } from '../src/sim/campaign/TheGioiData';

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

const tran: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), doc('battle.json'));
const du: DuLieuTheGioi = docTheGioi(doc('the_gioi.json'), doc('victory.json'), new Set(tran.doi.keys()));
const banDo: BanDoTinh = dungBanDoTinh(doc('provinces.json') as CauHinhBanDoTinh, doc('nations.json') as CauHinhNuoc);

const YEN: SoNuocTa = { soNha: 200, doi: 1, soCongNgheXong: 0, doiXongHet: 0, thieuLuongThuc: false, theDangLap: [] };

describe('docTheGioi', () => {
  it('doc duoc hai file that', () => {
    expect(du.thang.khoaHocDoi).toBe(5);
    expect(du.batOn.luaChon.map((l) => l.id)).toEqual(['dan_ap', 'giam_thue', 'nha_hat']);
  });

  it('bao loi kem duong dan khi quan trung lap go sai ten doi', () => {
    const tho = doc('the_gioi.json') as { quan: { quan_trung_lap: string[] } };
    tho.quan.quan_trung_lap = ['khong_co'];
    expect(() => docTheGioi(tho, doc('victory.json'), new Set(tran.doi.keys()))).toThrow(/quan_trung_lap/);
  });
});

describe('NgoaiGiao', () => {
  it('dam phan len tung bac mot, khong nhay coc', () => {
    const ng = new NgoaiGiao(du.ngoaiGiao);
    ng.tuyenChien('a', 'b');
    expect(ng.trangThai('a', 'b')).toBe('chien_tranh');
    const seen: string[] = [];
    for (let i = 0; i < 20; i++) seen.push(ng.damPhan('b', 'a'));
    expect(seen).toContain('ngung_ban');
    expect(seen.indexOf('ngung_ban')).toBeLessThan(seen.indexOf('hoa_binh'));
    expect(seen.indexOf('hoa_binh')).toBeLessThan(seen.indexOf('lien_minh'));
  });

  it('dang chien thi khong mo thuong mai; quan he ghim trong [-100, 100]', () => {
    const ng = new NgoaiGiao(du.ngoaiGiao);
    ng.tuyenChien('a', 'b');
    expect(ng.datThuongMai('a', 'b', true)).toBe(false);
    for (let i = 0; i < 20; i++) ng.doiQuanHe('a', 'b', -30);
    expect(ng.quanHe('a', 'b')).toBe(-100);
  });

  it('de doa khi yeu thi phan tac dung', () => {
    const ng = new NgoaiGiao(du.ngoaiGiao);
    expect(ng.deDoa('a', 'b', 0.5)).toBe(false);
    expect(ng.quanHe('a', 'b')).toBe(du.ngoaiGiao.deDoa.quanHeThua);
  });
});

describe('BatOn', () => {
  it('ke the thi noi loan dung sau gio_noi_loan gio, chon lua chon thi ha xuong', () => {
    const b = new BatOn(du.batOn);
    const vao = { thieuLuongThuc: true, dangChien: true, theDangLap: [] };
    let gio = 0;
    while (!b.theMo) {
      b.gio(vao);
      gio += 1;
      expect(gio).toBeLessThan(200);
    }
    const ketQua: string[] = [];
    for (let i = 0; i < du.batOn.gioNoiLoan; i++) ketQua.push(b.gio(vao));
    expect(ketQua.filter((k) => k === 'noi_loan')).toHaveLength(1);
    while (!b.theMo) b.gio(vao);
    const truoc = b.chiSo;
    expect(b.chon('giam_thue')?.id).toBe('giam_thue');
    expect(b.chiSo).toBeLessThan(truoc);
    expect(b.gioGiamThue).toBeGreaterThan(0);
  });

  it('the thue thap lam bat on giam', () => {
    const co = new BatOn(du.batOn);
    const khong = new BatOn(du.batOn);
    for (let i = 0; i < 30; i++) {
      co.gio({ thieuLuongThuc: false, dangChien: false, theDangLap: ['thue_thap'] });
      khong.gio({ thieuLuongThuc: false, dangChien: false, theDangLap: [] });
    }
    expect(co.chiSo).toBeLessThan(khong.chiSo);
  });
});

describe('ChienTranh', () => {
  it('doi mua duoc theo thoi dai: doi 1 giao/cung, doi 3 nhom sung', () => {
    expect(doiMuaDuoc(tran, 1).map((l) => l.id).sort()).toEqual(['cung_thu', 'giao_thu']);
    expect(new Set(doiMuaDuoc(tran, 3).map((l) => l.nhom))).toEqual(new Set(['sung']));
  });

  it('mua quan khong vuot ngan sach, khong vuot tran', () => {
    const ds = doiMuaDuoc(tran, 2);
    const kq = muaQuan([], 10000, ds, 5, 0, tran);
    expect(kq.quan).toHaveLength(5);
    const re = muaQuan([], 100, ds, 30, 0, tran);
    expect(100 - re.vangCon).toBeLessThanOrEqual(100);
    expect(re.vangCon).toBeGreaterThanOrEqual(0);
  });

  it('day tran thi giai ngu doi yeu nhat de lay doi thoi moi; quan xep manh truoc', () => {
    const cu = Array(5).fill('giao_thu') as string[];
    const kq = muaQuan(cu, 10000, doiMuaDuoc(tran, 5), 5, 0, tran);
    expect(kq.quan).toHaveLength(5);
    expect(kq.quan).not.toContain('giao_thu');
    const suc = kq.quan.map((id) => sucQuan([id], tran));
    expect([...suc].sort((a, b) => b - a)).toEqual(suc);
  });

  it('danh vao tinh khong ai giu thi chiem khong mat doi nao', () => {
    const kq = danh(['giao_thu'], [], 'dong_bang', 1, 1, tran, 1);
    expect(kq).toMatchObject({ tanCongThang: true, matTanCong: 0 });
  });
});

describe('tinhKe', () => {
  it('ke nhau hai chieu, moi tinh co it nhat hai tinh ke, khong tu ke chinh minh', () => {
    const ke = tinhKe(banDo);
    for (const [t, ds] of ke) {
      expect(ds.size, t).toBeGreaterThanOrEqual(2);
      expect(ds.has(t)).toBe(false);
      for (const k of ds) expect(ke.get(k)?.has(t), `${t}-${k}`).toBe(true);
    }
  });
});

describe('TheGioi', () => {
  it('dau van: danh duoc tinh trung lap ke ben, chua danh duoc nuoc khac', () => {
    const tg = new TheGioi(du, banDo, tran);
    const muc = tg.mucTieu('hoa_nguyen');
    expect(muc.length).toBeGreaterThan(0);
    for (const t of muc) expect(tg.chu(t)).toBe('');
    expect(tg.keNuoc('hoa_nguyen', 'luc_khe')).toBe(tg.keNuoc('luc_khe', 'hoa_nguyen'));
  });

  it('khong danh duoc nuoc dang hoa binh; tuyen chien roi thi duoc', () => {
    const tg = new TheGioi(du, banDo, tran);
    tg.nuoc('hoa_nguyen').quan = ['kiem_si'];
    expect(tg.keNuoc('hoa_nguyen', 'luc_khe')).toBe(true);
    const ke = tg.tinhCua('luc_khe').find((t) => tg.tanCong('hoa_nguyen', t) === 'khong-dang-chien');
    expect(ke).toBeDefined();
    tg.tuyenChien('hoa_nguyen', 'luc_khe');
    expect(tg.mucTieu('hoa_nguyen')).toContain(ke);
  });

  it('chiem thu do thi nuoc do bi xoa so, moi tinh ve tay ben chiem', () => {
    const tg = new TheGioi(du, banDo, tran);
    const thuDo = banDo.tinh.find((t) => t.nuoc === 'luc_khe' && t.thuDo);
    expect(thuDo).toBeDefined();
    // Luc Khe khong con quan: danh lien tiep cho toi khi roi thu do.
    tg.tuyenChien('hoa_nguyen', 'luc_khe');
    tg.nuoc('luc_khe').quan = [];
    tg.nuoc('hoa_nguyen').quan = Array(10).fill('ky_binh') as string[];
    for (let lan = 0; lan < 10 && tg.nuoc('luc_khe').conSong; lan++) {
      for (const t of tg.mucTieu('hoa_nguyen')) {
        if (tg.chu(t) === 'luc_khe') {
          tg.nuoc('hoa_nguyen').gioNghi = 0;
          tg.tanCong('hoa_nguyen', t);
        }
      }
    }
    expect(tg.nuoc('luc_khe').conSong).toBe(false);
    expect(tg.tinhCua('luc_khe')).toHaveLength(0);
  });

  it('thang Khoa hoc khi xong het doi trong victory.json', () => {
    const tg = new TheGioi(du, banDo, tran);
    tg.gioTiep(YEN);
    expect(tg.ketQua.trangThai).toBe('dang_choi');
    tg.gioTiep({ ...YEN, doi: 5, doiXongHet: 5 });
    expect(tg.ketQua).toMatchObject({ trangThai: 'thang', kieu: 'khoa_hoc' });
  });

  it('thang Van hoa khi dau tu du; thang Ngoai giao khi du phieu o dot bau', () => {
    const vh = new TheGioi(du, banDo, tran);
    vh.tiLeChiQuanTa = 0;
    vh.nuoc(vh.ta).vang = 1e6;
    vh.dauTuVanHoa(1e6);
    vh.gioTiep(YEN);
    expect(vh.ketQua.kieu).toBe('van_hoa');

    const ng = new TheGioi(du, banDo, tran);
    for (const n of ng.conSong) if (n !== ng.ta) ng.ngoaiGiao.doiQuanHe(ng.ta, n, 100);
    for (let g = 0; g < du.ngoaiGiao.bau.gioMoiLan && ng.ketQua.trangThai === 'dang_choi'; g++) {
      ng.gioTiep({ ...YEN, doi: du.ngoaiGiao.bau.doiToiThieu });
    }
    expect(ng.ketQua.kieu).toBe('ngoai_giao');
  });

  it('cung hat giong, cung dau vao thi cung nhat ky', () => {
    const chay = (): string[] => {
      const tg = new TheGioi(du, banDo, tran);
      for (let g = 0; g < 80; g++) tg.gioTiep({ ...YEN, doi: g < 21 ? 1 : 2 });
      return tg.nhatKy;
    };
    expect(chay()).toEqual(chay());
  });
});
