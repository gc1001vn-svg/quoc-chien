/**
 * Thuoc do cua Phase 8 - Eureka, thoi dai, the chinh sach.
 *
 * Ba cho de hong: Eureka giam gia HAI lan, the chinh sach thao ra khong tra lai dung cai
 * da cong vao, va cong nghe mo mot the khong co trong bo the.
 */
import { describe, expect, it } from 'vitest';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { docEureka, SoEureka } from '../src/sim/meta/Eureka.ts';
import { BoChinhSach, docTheChinhSach, type The } from '../src/sim/meta/TheChinhSach.ts';
import { docThoiDai, ThoiDai } from '../src/sim/meta/ThoiDai.ts';
import { docCongNghe } from '../src/sim/meta/CongNghe.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { DongCo, docNhipDo, docThe } from '../src/sim/decision/Engine.ts';
import { NhatKy } from '../src/sim/decision/NhatKy.ts';
import { Van } from '../src/sim/decision/Van.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import eurekaTho from '../data/eureka.json';
import theTho from '../data/the_chinh_sach.json';
import canBang from '../data/balance.json';
import techTho from '../data/tech.json';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import chinhSach from '../data/policy.json';
import theQuyetDinh from '../data/decisions.json';

const KHONG_XONG = (): boolean => false;
/** Thanh pho rong: de moc Eureka doc `soNha`/`soKho` khong dat theo, chi con moc mat hang. */
const SO_TP = { soNha: 0, soKho: 0 };

/**
 * Bang so gia: mot mat hang, moi con so cua no deu bang `so`.
 *
 * Dat het chu khong rieng `ton`: moc Eureka doc `lamRa` (xem `_do_that_11_09` trong
 * `data/eureka.json`), va test khong nen biet moc dang doc cot nao.
 */
function tk(gio: number, hang: string, so: number): ThongKe {
  return {
    gio,
    nha: [],
    hang: [{
      ten: hang, hien: hang, ton: so, tran: 9999,
      lamRa: so, dungHet: so, cho: so, day: so, hong: so,
    }],
    walker: { chuyen: so, boCuoc: so, dinh: so },
  };
}

describe('eureka', () => {
  it('doc duoc data/eureka.json va moi moc tro toi mot cong nghe co that', () => {
    const du = docEureka(eurekaTho);
    const id = new Set(docCongNghe(techTho).ds.map((c) => c.id));
    expect(du.ds.length).toBeGreaterThan(0);
    for (const m of du.ds) expect(id, `eureka tro toi "${m.congNghe}"`).toContain(m.congNghe);
  });

  it('dat mot lan thi thoi - dieu kien dung mai khong giam gia mai', () => {
    const du = docEureka(eurekaTho);
    const so = new SoEureka(du);
    const m = du.ds.find((x) => x.dieuKien.hang !== undefined);
    expect(m).toBeDefined();
    const hang: string = m?.dieuKien.hang ?? '';
    const cao: number = (m?.dieuKien.gia ?? 0) + 100;

    expect(so.cham(tk(1, hang, cao), SO_TP, KHONG_XONG)).toHaveLength(1);
    expect(so.cham(tk(2, hang, cao), SO_TP, KHONG_XONG)).toHaveLength(0);
  });

  it('gia giam dung so phan tram trong file, va chi giam khi da dat', () => {
    const du = docEureka(eurekaTho);
    const so = new SoEureka(du);
    const m = du.ds[0];
    expect(m).toBeDefined();
    const cn: string = m?.congNghe ?? '';
    expect(so.gia(cn, 100)).toBe(100);

    const hang: string = m?.dieuKien.hang ?? '';
    so.cham(tk(1, hang, (m?.dieuKien.gia ?? 0) + 100), SO_TP, KHONG_XONG);
    expect(so.gia(cn, 100)).toBe(100 - du.giam);
  });

  it('khong moc nao doc `ton` - ton kho cham TRAN ngay gio dau, khong phai tin hieu', () => {
    // Bai hoc 11/09: 19 moc dau tien deu dat theo `ton` va ca 19 sang ngay gio 1, vi
    // thanh pho demo mo man da co 188 cong trinh nen kho day tu dau. Xem `_do_that_11_09`
    // trong `data/eureka.json`.
    for (const m of docEureka(eurekaTho).ds) {
      expect(m.dieuKien.do, `moc "${m.congNghe}" doc \`ton\``).not.toBe('ton');
    }
  });

  it('sau MOT gio game that, qua nua so moc VAN chua dat - Eureka phai kiem duoc', () => {
    const tp = new ThanhPho({
      hang, nha, chuoi, banDo, walker,
    });
    tp.datThongDoc(new Van(
      tp,
      new Governor(tp, docChinhSach(chinhSach)),
      new DongCo(docThe(theQuyetDinh), docNhipDo(canBang)),
      new NhatKy(),
      false,
    ));
    tp.chay(NHIP_MOI_GIO);
    const tk1 = tp.gioVuaXong();
    expect(tk1).toBeDefined();

    const du = docEureka(eurekaTho);
    const so = new SoEureka(du);
    const dat: number = so.cham(
      tk1 as ThongKe, { soNha: tp.soNha, soKho: tp.doiWalker.soKho }, KHONG_XONG,
    ).length;
    expect(dat, `${String(dat)}/${String(du.ds.length)} moc dat san ngay gio 1`)
      .toBeLessThan(du.ds.length / 2);
  });

  it('da hoc xong roi thi khong ghi Eureka nua', () => {
    const du = docEureka(eurekaTho);
    const so = new SoEureka(du);
    const m = du.ds.find((x) => x.dieuKien.hang !== undefined);
    const hang: string = m?.dieuKien.hang ?? '';
    const cao: number = (m?.dieuKien.gia ?? 0) + 100;
    expect(so.cham(tk(1, hang, cao), SO_TP, () => true)).toHaveLength(0);
  });
});

describe('thoi dai', () => {
  const ds = docThoiDai(canBang);

  it('doc duoc sau doi, so lien tiep tu 1, moi doi co ten me atlas', () => {
    expect(ds).toHaveLength(6);
    for (const [i, d] of ds.entries()) {
      expect(d.so).toBe(i + 1);
      expect(d.me).not.toBe('');
    }
  });

  it('so o chinh phu khong bao gio tut xuong khi len doi', () => {
    for (let i = 1; i < ds.length; i += 1) {
      expect(ds[i]?.soO).toBeGreaterThanOrEqual(ds[i - 1]?.soO ?? 0);
    }
  });

  it('thieu cong nghe hay thieu cong trinh deu khong len duoc', () => {
    const td = new ThoiDai(ds);
    const dk = td.doi.len;
    expect(dk).toBeDefined();
    const cn: number = dk?.soCongNghe ?? 0;
    const nha: number = dk?.soNha ?? 0;
    expect(td.len(cn - 1, nha)).toBeUndefined();
    expect(td.len(cn, nha - 1)).toBeUndefined();
    expect(td.len(cn, nha)?.so).toBe(2);
  });

  it('`len: null` la het duong - khong len qua doi do', () => {
    const td = new ThoiDai(ds);
    for (let i = 0; i < 20; i += 1) td.len(999, 9999);
    const cuoi = ds.find((d) => d.len === undefined);
    expect(td.doi.so).toBe(cuoi?.so);
  });
});

describe('the chinh sach', () => {
  const ds: The[] = docTheChinhSach(theTho);

  it('doc duoc 20 the tro len, moi the co ca mat loi va mat hai', () => {
    expect(ds.length).toBeGreaterThanOrEqual(20);
    for (const t of ds) {
      expect(t.loi).not.toBe('');
      expect(t.hai).not.toBe('');
    }
  });

  it('moi the deu co mot cong nghe mo ra - khong the nao mo coi', () => {
    const moRa = new Set(docCongNghe(techTho).ds.flatMap((c) => c.moThe));
    for (const t of ds) expect(moRa, `khong cong nghe nao mo "${t.id}"`).toContain(t.id);
  });

  it('chua mo khoa thi khong lap duoc', () => {
    const bo = new BoChinhSach(ds, 0);
    bo.datSoO(2);
    expect(bo.lap(0, ds[0]?.id ?? '', 0)).toBe(false);
  });

  it('khong lap qua so o, va khong lap mot the vao hai o', () => {
    const bo = new BoChinhSach(ds, 0);
    bo.datSoO(2);
    const a: string = ds[0]?.id ?? '';
    const b: string = ds[1]?.id ?? '';
    bo.mo(a);
    bo.mo(b);
    expect(bo.lap(0, a, 0)).toBe(true);
    expect(bo.lap(1, a, 0)).toBe(false);
    expect(bo.lap(2, b, 0)).toBe(false);
  });

  it('thao ra tra lai DUNG cai da cong vao', () => {
    const bo = new BoChinhSach(ds, 0);
    bo.datSoO(2);
    const a: string = ds[0]?.id ?? '';
    bo.mo(a);
    expect(bo.tongNoiTran).toEqual({ nha: 0, kho: 0 });
    expect(bo.heSoNghienCuu).toBe(100);
    bo.lap(0, a, 0);
    bo.thao(0, 0);
    expect(bo.tongNoiTran).toEqual({ nha: 0, kho: 0 });
    expect(bo.heSoNghienCuu).toBe(100);
  });

  it('chua het thoi gian cho thi khong doi duoc the', () => {
    const bo = new BoChinhSach(ds, 8);
    bo.datSoO(2);
    const a: string = ds[0]?.id ?? '';
    const b: string = ds[1]?.id ?? '';
    bo.mo(a);
    bo.mo(b);
    expect(bo.lap(0, a, 10)).toBe(true);
    expect(bo.lap(1, b, 12)).toBe(false);
    expect(bo.lap(1, b, 18)).toBe(true);
  });

  it('bot so o thi the o o do bi thao ra, khong con tinh vao he so', () => {
    const bo = new BoChinhSach(ds, 0);
    bo.datSoO(2);
    const b: string = ds[1]?.id ?? '';
    bo.mo(b);
    bo.lap(1, b, 0);
    expect(bo.tongNoiTran).not.toEqual({ nha: 0, kho: 0 });
    bo.datSoO(1);
    expect(bo.tongNoiTran).toEqual({ nha: 0, kho: 0 });
  });
});
