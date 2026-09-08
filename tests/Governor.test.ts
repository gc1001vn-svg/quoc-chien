/**
 * Thuoc do cua Phase 5: thanh pho phai TU lon, va lon co ky luat.
 *
 * Ba dieu phai dung, moi dieu deu la mot cach thong doc co the pha thanh pho:
 * xay den tran roi phai dung; moi lan chi mot viec; va xay xong thi bang so phai noi that.
 */
import { describe, expect, it } from 'vitest';
import { ThanhPho } from '../src/sim/city/City.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { capHienTai, docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import chinhSach from '../data/policy.json';

function taoCoThongDoc(): { tp: ThanhPho; td: Governor } {
  const tp = new ThanhPho({ hang, nha, chuoi, banDo, walker });
  const td = new Governor(tp, docChinhSach(chinhSach));
  tp.datThongDoc(td);
  return { tp, td };
}

describe('thong doc tu xay', () => {
  it('thanh pho lon len, va co them kho', () => {
    const { tp, td } = taoCoThongDoc();
    const nhaDau: number = tp.soNha;
    tp.chay(NHIP_MOI_GIO * 10);

    expect(tp.soNha).toBeGreaterThan(nhaDau);
    expect(tp.doiWalker.soKho).toBeGreaterThanOrEqual(2);
    expect(td.daLam.length).toBeGreaterThan(0);
  });

  it('moi gio chi lam MOT viec', () => {
    const { tp, td } = taoCoThongDoc();
    tp.chay(NHIP_MOI_GIO * 10);
    const gio: number[] = td.daLam.map((v) => v.gio);
    expect(new Set(gio).size).toBe(gio.length);
  });

  it('khong xay qua tran cua cap', () => {
    const { tp } = taoCoThongDoc();
    const cs = docChinhSach(chinhSach);
    tp.chay(NHIP_MOI_GIO * 10);
    expect(tp.soNha).toBeLessThanOrEqual(capHienTai(cs, tp.soNha).tranNha);
    expect(tp.doiWalker.soKho).toBeLessThanOrEqual(capHienTai(cs, tp.soNha).tranKho);
  });

  it('bang so bao dung so nha THAT sau khi xay them', () => {
    const { tp } = taoCoThongDoc();
    tp.chay(NHIP_MOI_GIO * 10);
    const tk = tp.gioVuaXong();
    expect(tk).toBeDefined();
    const tong: number = (tk?.nha ?? []).reduce((t, n) => t + n.so, 0);
    expect(tong).toBe(tp.soNha);
  });

  it('khong dat thong doc thi thanh pho dung yen nhu Phase 4', () => {
    const tp = new ThanhPho({ hang, nha, chuoi, banDo, walker });
    const nhaDau: number = tp.soNha;
    tp.chay(NHIP_MOI_GIO * 3);
    expect(tp.soNha).toBe(nhaDau);
    expect(tp.doiWalker.soKho).toBe(1);
  });
});

describe('chinh sach', () => {
  it('cap len theo so nha, va cap dau luon la cap co tuNha = 0', () => {
    const cs = docChinhSach(chinhSach);
    expect(capHienTai(cs, 0).tuNha).toBe(0);
    const cuoi = cs.cap[cs.cap.length - 1];
    expect(cuoi).toBeDefined();
    if (cuoi !== undefined) expect(capHienTai(cs, cuoi.tuNha).ten).toBe(cuoi.ten);
  });

  it('tran cua cap truoc bang tuNha cap sau - khong cap nao ket cung', () => {
    const cs = docChinhSach(chinhSach);
    for (let i = 1; i < cs.cap.length; i += 1) {
      expect(cs.cap[i]?.tuNha).toBeLessThanOrEqual(cs.cap[i - 1]?.tranNha ?? 0);
    }
  });

  it('nem loi khi thieu cap tuNha = 0', () => {
    expect(() => docChinhSach({
      gioMoiLan: 1, nguongBoCuoc: 1, nguongDinh: 1, nguongCho: 1,
      cap: [{ ten: 'x', tuNha: 5, tranNha: 10, tranKho: 2 }],
    })).toThrow();
  });
});
