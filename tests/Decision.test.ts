/**
 * Thuoc do cua Phase 6: the phai hien ra THAT, khong hien qua day, va khong hoi lai
 * mot the vua hoi.
 *
 * Bai hoc Phase 5: nguong dat theo tran ly thuyet thi dieu kien khong bao gio dung va
 * khong ai biet - `hien du the trong 10 gio game` la test chan chinh cai do.
 */
import { describe, expect, it } from 'vitest';
import { ThanhPho } from '../src/sim/city/City.ts';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { DongCo, docNhipDo, docThe, type LuaChon, type The } from '../src/sim/decision/Engine.ts';
import { NhatKy } from '../src/sim/decision/NhatKy.ts';
import { Van } from '../src/sim/decision/Van.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import chinhSach from '../data/policy.json';
import theTho from '../data/decisions.json';
import canBang from '../data/balance.json';

/** Bang so gia, du de dong co quet. */
function tk(gio: number, dinh: number): ThongKe {
  return {
    gio,
    nha: [],
    hang: [{
      ten: 'bot', hien: 'Bột', ton: 0, tran: 300,
      lamRa: 0, dungHet: 0, cho: 9999, day: 0, hong: 0,
    }],
    walker: { chuyen: 0, boCuoc: 0, dinh },
  };
}

const KHONG_THANH_PHO = { soNha: 0, soKho: 1 };

describe('doc du lieu the', () => {
  it('doc duoc `data/decisions.json` va moi the co 2-4 lua chon', () => {
    const ds: The[] = docThe(theTho);
    expect(ds.length).toBeGreaterThanOrEqual(6);
    for (const t of ds) {
      expect(t.chon.length).toBeGreaterThanOrEqual(2);
      expect(t.chon.length).toBeLessThanOrEqual(4);
      expect(t.dieuKien.length).toBeGreaterThan(0);
    }
  });

  it('van cua the phai la tieng Viet CO DAU - nguoi choi doc chu nay', () => {
    const coDau = /[ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/i;
    for (const t of docThe(theTho)) {
      expect(coDau.test(t.van), `the "${t.ten}" khong dau`).toBe(true);
      for (const c of t.chon) expect(coDau.test(c.van + c.loi)).toBe(true);
    }
  });

  it('nem loi khi the chi co mot lua chon', () => {
    expect(() => docThe({
      the: [{
        ten: 'x', diem: 1, van: 'a',
        dieuKien: [{ do: 'soNha', phep: '>=', gia: 1 }],
        chon: [{ van: 'a', loi: 'b', hauQua: { xayKho: true } }],
      }],
    })).toThrow();
  });

  it('nem loi khi dieu kien doc theo hang ma khong noi hang nao', () => {
    expect(() => docThe({
      the: [{
        ten: 'x', diem: 1, van: 'a',
        dieuKien: [{ do: 'ton', phep: '>=', gia: 1 }],
        chon: [
          { van: 'a', loi: 'b', hauQua: { xayKho: true } },
          { van: 'c', loi: 'd', hauQua: { xayKho: true } },
        ],
      }],
    })).toThrow();
  });
});

describe('nhip do', () => {
  const nd = docNhipDo(canBang);

  it('the thuong phai cho du gian cach, the khan thi khong', () => {
    const ds: The[] = docThe(theTho);
    const dc = new DongCo(ds, nd);
    // Gio 1: the khan `duong_dong` dung dieu kien (dinh 320) va duoc hoi ngay.
    expect(dc.hoi(tk(1, 320), KHONG_THANH_PHO)?.ten).toBe('duong_dong');
    // Gio 2: `thieu_bot` dung dieu kien nhung chua du gian cach 2 gio.
    expect(dc.hoi(tk(2, 0), KHONG_THANH_PHO)).toBeUndefined();
    expect(dc.hoi(tk(3, 0), KHONG_THANH_PHO)?.ten).toBe('thieu_bot');
  });

  it('khong hoi lai cung mot the trong `gioLapLai` gio', () => {
    const dc = new DongCo(docThe(theTho), nd);
    expect(dc.hoi(tk(1, 320), KHONG_THANH_PHO)?.ten).toBe('duong_dong');
    for (let gio = 3; gio < 1 + nd.gioLapLai; gio += 2) {
      expect(dc.hoi(tk(gio, 320), KHONG_THANH_PHO)?.ten).not.toBe('duong_dong');
    }
    expect(dc.hoi(tk(1 + nd.gioLapLai, 320), KHONG_THANH_PHO)?.ten).toBe('duong_dong');
  });

  it('het tran mot van thi ngung hoi', () => {
    const dc = new DongCo(docThe(theTho), { ...nd, toiDaMotVan: 2 });
    let so = 0;
    for (let gio = 1; gio <= 60; gio += 1) {
      if (dc.hoi(tk(gio, 320), KHONG_THANH_PHO) !== undefined) so += 1;
    }
    expect(so).toBe(2);
    expect(dc.so).toBe(2);
  });
});

describe('van that, 10 gio game', () => {
  function chayVan(): { tp: ThanhPho; dc: DongCo; nk: NhatKy } {
    const tp = new ThanhPho({ hang, nha, chuoi, banDo, walker });
    const td = new Governor(tp, docChinhSach(chinhSach));
    const dc = new DongCo(docThe(theTho), docNhipDo(canBang));
    const nk = new NhatKy();
    const van = new Van(tp, td, dc, nk);
    tp.datThongDoc(van);
    for (let gio = 1; gio <= 10; gio += 1) {
      tp.chay(NHIP_MOI_GIO);
      const t = van.the;
      if (t !== undefined) van.traLoi(t.chon[0] as LuaChon);
    }
    return { tp, dc, nk };
  }

  it('hien du the trong 10 gio game - dieu kien khong dat theo tran ly thuyet', () => {
    const { dc } = chayVan();
    expect(dc.so).toBeGreaterThanOrEqual(3);
  });

  it('tra loi the lam thanh pho doi that', () => {
    const { tp } = chayVan();
    expect(tp.soNha).toBeGreaterThan(94);
    expect(tp.doiWalker.soKho).toBeGreaterThanOrEqual(2);
  });

  it('nhat ky ghi ca the lan lua chon, khong dong nao rong', () => {
    const { nk } = chayVan();
    expect(nk.danhSach.some((s) => s.loai === 'the')).toBe(true);
    expect(nk.danhSach.some((s) => s.loai === 'chon')).toBe(true);
    for (const s of nk.danhSach) expect(s.van.length).toBeGreaterThan(0);
  });

  it('nhat ky chi giu `tran` dong gan nhat', () => {
    const nk = new NhatKy(3);
    for (let i = 0; i < 10; i += 1) nk.ghi(i, 'the', `dong ${String(i)}`);
    expect(nk.danhSach.length).toBe(3);
    expect(nk.moiNhat(1)[0]?.van).toBe('dong 9');
  });
});
