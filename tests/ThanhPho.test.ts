/**
 * Thuoc do cua Phase 3 (KE_HOACH.md muc 3), dat thanh test tu dong de CI chan.
 *
 * `npm run sim:thu` in bang cho nguoi doc; file nay cham diem cho may. Cham cung mot cach:
 * chay 10 gio game, moi gio (tru gio dau, luc chuoi con mo may) phai dat ca ba dieu -
 * khong hang am, moi nha chay duoc it nhat mot me, moi hang vua duoc lam ra vua bi dung den.
 */
import { describe, expect, it } from 'vitest';
import { chamDiem, ThanhPho } from '../src/sim/city/City.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';

function taoThanhPho(): ThanhPho {
  return new ThanhPho({ hang, nha, chuoi });
}

describe('ThanhPho chay 10 gio game', () => {
  it('khong gio nao co loi, va khong hang nao am o bat ky luc nao', () => {
    const tp = taoThanhPho();
    const loi: string[] = [];

    for (let gio = 1; gio <= 10; gio++) {
      // Kiem tung phut mot: hang am o giua gio ma cuoi gio lai duong thi bang so giau mat.
      for (let phut = 0; phut < 60; phut++) {
        tp.chay(NHIP_MOI_GIO / 60);
        for (const ten of tp.kho.tenHang) expect(tp.kho.co(ten)).toBeGreaterThanOrEqual(0);
      }
      const tk = tp.gioVuaXong();
      expect(tk).toBeDefined();
      if (tk !== undefined && gio > 1) {
        loi.push(...chamDiem(tk).map((d) => `gio ${String(gio)}: ${d}`));
      }
    }

    expect(loi).toEqual([]);
    expect(tp.dongHo.soNhip).toBe(NHIP_MOI_GIO * 10);
  });

  it('khong mat hang nao vuot tran kho', () => {
    const tp = taoThanhPho();
    tp.chay(NHIP_MOI_GIO * 3);
    for (const h of tp.dsHang) expect(tp.kho.co(h.ten)).toBeLessThanOrEqual(h.tran);
  });

  it('dan an duoc ca bay mon, khong mon nao bi doi ca gio', () => {
    const tp = taoThanhPho();
    tp.chay(NHIP_MOI_GIO * 3);
    const tk = tp.gioVuaXong();
    const dan = tk?.nha.find((n) => n.ten === 'nha_dan');
    expect(dan?.me).toBeGreaterThan(0);
    expect(dan?.doi).toBe(0);
  });

  it('doi mot so trong data/ la doi ket qua - bo bat loi that su bat duoc', () => {
    // Bo gieng nuoc di thi nuoc khong ai lam ra nua: `kiemTra` phai chan ngay luc tao.
    const thieuGieng = { nha: nha.nha.filter((n) => n.ten !== 'gieng') };
    expect(() => new ThanhPho({ hang, nha: thieuGieng, chuoi })).toThrow(/nuoc/);
  });
});
