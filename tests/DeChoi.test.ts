/**
 * Thu 3 (30/09): bac bao truoc bat on, cham xem truoc tren the quyet dinh, bang tach nguon
 * chinh sach. Ca ba CHI DOC mo phong - test chay trong Node, khong trinh duyet, khong WebGL.
 */
import { describe, expect, it } from 'vitest';
import soTho from '../data/hieu_ung.json';
import theGioiTho from '../data/the_gioi.json';
import { ThuNha, type DinhNghiaNha } from '../src/sim/city/Buildings';
import { bacBatOn, chonNha, nguoiQuanh, type SoBatOnVe } from '../src/render/HieuUngBatOn';
import { docCoTat } from '../src/render/HieuUngThanhPho';
import { chamXemTruoc } from '../src/ui/ChamXemTruoc';
import { tachNguon } from '../src/ui/TachNguon';
import { ThanhPho } from '../src/sim/city/City.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { docDuLieuMeta, Meta } from '../src/sim/meta/Meta.ts';
import { docThe } from '../src/sim/decision/Engine.ts';
import theQuyetDinh from '../data/decisions.json';
import hang from '../data/wares.json';
import nhaTho from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import chinhSach from '../data/policy.json';
import techTho from '../data/tech.json';
import eurekaTho from '../data/eureka.json';
import theTho from '../data/the_chinh_sach.json';
import canBang from '../data/balance.json';

const NGUONG = theGioiTho.bat_on.nguong_the;
const so = (diem: number, theMo = false): SoBatOnVe => ({ diem, nguongThe: NGUONG, theMo, gioKe: 0, gioNoiLoan: 12 });

describe('bac bao truoc bat on', () => {
  it('bac theo ti le nguong the, the mo la bac 3', () => {
    const [b1, b2] = soTho.batOn.bac;
    expect(bacBatOn(so(NGUONG * (b1 ?? 0) - 0.01))).toBe(0);
    expect(bacBatOn(so(NGUONG * (b1 ?? 0)))).toBe(1);
    expect(bacBatOn(so(NGUONG * (b2 ?? 0) - 0.01))).toBe(1);
    expect(bacBatOn(so(NGUONG * (b2 ?? 0)))).toBe(2);
    expect(bacBatOn(so(NGUONG))).toBe(3);
    // The da mo ma diem tut duoi nguong (chua chon) van la bac 3 - lua con chay toi luc chon.
    expect(bacBatOn(so(5, true))).toBe(3);
  });

  function nhaDan(i: number): ThuNha {
    const def = { ten: 'nha_dan', sprite: 'nha_dan', kieu: 'nha_o', ra: [], vao: [] } as unknown as DinhNghiaNha;
    return new ThuNha(def, i, 0, { a: i * 3, b: 5 }, { a: i * 3, b: 4 }, 2);
  }

  it('chon nha on dinh: cung dau vao cung ket qua, khong phu thuoc thu tu danh sach', () => {
    const ds = Array.from({ length: 20 }, (_, i) => nhaDan(i));
    const tatCa = (): boolean => true;
    const a = chonNha(ds, tatCa, 3).map((n) => n.chiSo);
    const b = chonNha([...ds].reverse(), tatCa, 3).map((n) => n.chiSo);
    expect(a).toHaveLength(3);
    expect(b).toEqual(a);
    // Nha ngoai khung khong bao gio duoc chon.
    expect(chonNha(ds, (n) => n.chiSo < 2, 3).map((n) => n.chiSo).sort()).toEqual([0, 1]);
  });

  it('dam dong dung quanh cong, dung so nguoi, sprite hop le', () => {
    const n = nhaDan(4);
    const ds = nguoiQuanh(n, 7, 3.2);
    expect(ds).toHaveLength(7);
    for (const p of ds) {
      expect(Math.abs(p.a - n.cong.a)).toBeLessThanOrEqual(soTho.batOn.tanO / 2);
      expect(Math.abs(p.b - n.cong.b)).toBeLessThanOrEqual(soTho.batOn.tanO / 2);
      expect([0, 1, 2, 3]).toContain(p.huong);
      expect([0, 1]).toContain(p.kieu);
    }
  });
});

describe('cham xem truoc kieu Reigns', () => {
  const c = soTho.cham;
  it('khong hau qua thi khong cham', () => {
    expect(chamXemTruoc({})).toEqual({ nha: 0, kho: 0, thongDoc: 0 });
  });
  it('xay nha: it thi cham nho, nhieu thi cham to', () => {
    expect(chamXemTruoc({ xay: [{ ten: 'x', so: c.nhaTo - 1 }] }).nha).toBe(1);
    expect(chamXemTruoc({ xay: [{ ten: 'x', so: c.nhaTo }] }).nha).toBe(2);
    expect(chamXemTruoc({ noiTran: { nha: c.noiNhaTo } }).nha).toBe(2);
    expect(chamXemTruoc({ noiTran: { nha: -(c.noiNhaTo - 1) } }).nha).toBe(1);
  });
  it('kho va thong doc, khong noi tang hay giam', () => {
    expect(chamXemTruoc({ xayKho: true })).toEqual({ nha: 0, kho: 1, thongDoc: 0 });
    expect(chamXemTruoc({ noiTran: { kho: c.noiKhoTo } }).kho).toBe(2);
    expect(chamXemTruoc({ doiNguong: { nguongCho: c.nguongTo } }).thongDoc).toBe(2);
    expect(chamXemTruoc({ doiNguong: { nguongCho: -c.nguongTo } }).thongDoc).toBe(2);
    expect(chamXemTruoc({ doiNguong: { nguongCho: c.nguongTo - 1 } }).thongDoc).toBe(1);
  });
  it('moi hau qua trong decisions.json deu cho it nhat mot cham', () => {
    for (const the of docThe(theQuyetDinh)) {
      for (const lc of the.chon) {
        const k = chamXemTruoc(lc.hauQua);
        expect(k.nha + k.kho + k.thongDoc, JSON.stringify(lc.hauQua)).toBeGreaterThan(0);
      }
    }
  });
});

describe('bang tach nguon chinh sach', () => {
  function dung(): { meta: Meta; td: Governor } {
    const tp = new ThanhPho({ hang, nha: nhaTho, chuoi, banDo, walker });
    const td = new Governor(tp, docChinhSach(chinhSach));
    return { meta: new Meta(docDuLieuMeta(techTho, eurekaTho, theTho, canBang), tp, td), td };
  }
  const cong = (d: readonly { so: number }[]): number => d.reduce((s, x) => s + x.so, 0);

  it('cong lai tung dong ra dung so mo phong dang chay', () => {
    const { meta, td } = dung();
    meta.chinhSach.datSoO(3);
    for (const id of ['khan_hoang', 'tich_tru', 'truong_lang']) meta.chinhSach.mo(id);
    expect(meta.lapThe(0, 'khan_hoang')).toBe(true);
    expect(meta.lapThe(1, 'tich_tru')).toBe(true);
    expect(meta.lapThe(2, 'truong_lang')).toBe(true);
    td.noiTran(7, 1); // nhu the quyet dinh vua noi tran

    const t = tachNguon(meta);
    expect(t.nghienCuu.tong).toBe(meta.chinhSach.heSoNghienCuu);
    expect(cong(t.nghienCuu.dong) + t.nghienCuu.san).toBe(t.nghienCuu.tong);
    expect(t.diemMoiGio.tong).toBe(meta.diemMoiGio);
    expect(Math.round((cong(t.diemMoiGio.dong) * t.diemMoiGio.heSo) / 100)).toBe(meta.diemMoiGio);
    expect(t.tranNha.tong).toBe(td.cap.tranNha);
    expect(cong(t.tranNha.dong)).toBe(td.cap.tranNha);
    expect(cong(t.tranKho.dong)).toBe(td.cap.tranKho);
    expect(t.tranNha.dong.find((d) => d.ten === 'Thẻ quyết định đã chọn')?.so).toBe(7);
    expect(t.tranKho.dong.find((d) => d.ten === 'Thẻ quyết định đã chọn')?.so).toBe(1);
  });

  it('khong the nao thi chi con goc va thong doc', () => {
    const { meta, td } = dung();
    const t = tachNguon(meta);
    expect(t.nghienCuu.dong).toEqual([{ ten: 'Gốc', so: 100 }]);
    expect(t.tranNha.dong).toHaveLength(1);
    expect(t.tranNha.tong).toBe(td.cap.tranNha);
  });
});

describe('co ?tat= cua Thu 3', () => {
  it('het tat ca batOn, cham, nguon; tung cai tat rieng duoc', () => {
    for (const t of ['batOn', 'cham', 'nguon']) expect(docCoTat('het').has(t)).toBe(true);
    expect(docCoTat('cham')).toEqual(new Set(['cham']));
  });
});
