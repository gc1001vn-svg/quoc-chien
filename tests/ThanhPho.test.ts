/**
 * Thuoc do cua Phase 3 (KE_HOACH.md muc 3), dat thanh test tu dong de CI chan.
 *
 * `npm run sim:thu` in bang cho nguoi doc; file nay cham diem cho may. Cham cung mot cach:
 * chay 10 gio game, moi gio (tru gio dau, luc chuoi con mo may) phai dat ca ba dieu -
 * khong hang am, moi nha chay duoc it nhat mot me, moi hang vua duoc lam ra vua bi dung den.
 */
import { describe, expect, it } from 'vitest';
import { ThanhPho } from '../src/sim/city/City.ts';
import { chamDiem } from '../src/sim/city/Cham.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';

function taoThanhPho(): ThanhPho {
  return new ThanhPho({ hang, nha, chuoi, banDo, walker });
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

  it('dan van an duoc, doi khong qua mot phan bay so luot lay hang', () => {
    const tp = taoThanhPho();
    tp.chay(NHIP_MOI_GIO * 10);
    const tk = tp.gioVuaXong();
    const dan = tk?.nha.find((n) => n.ten === 'nha_dan');
    expect(dan?.me).toBeGreaterThan(0);

    // Tu Phase 4 hang phai co nguoi vac toi nen doi vai luot la binh thuong - truoc do
    // hang chuyen tuc thi nen doi = 0. Nhung doi qua nhieu la doi walker khong ganh noi.
    const dinhNghia = nha.nha.find((n) => n.ten === 'nha_dan');
    const luot: number = (dan?.me ?? 0) * (dinhNghia?.vao.length ?? 1);
    expect(dan?.doi ?? 0).toBeLessThan(luot / 7);
  });

  it('walker giao xong hang, khong ai bo cuoc giua duong', () => {
    const tp = taoThanhPho();
    tp.chay(NHIP_MOI_GIO * 3);
    const tk = tp.gioVuaXong();
    expect(tk?.walker.chuyen).toBeGreaterThan(1000);
    // Bo cuoc nghia la nha bi vay kin hoac tran buoc dat qua thap - ca hai deu la loi.
    expect(tk?.walker.boCuoc).toBe(0);
  });

  it('hang co hao thi hong that, va hong khong bi tinh nham la "dung het"', () => {
    const tp = taoThanhPho();
    tp.chay(NHIP_MOI_GIO * 2);
    const tk = tp.gioVuaXong();
    const ca = tk?.hang.find((h) => h.ten === 'ca');
    const sat = tk?.hang.find((h) => h.ten === 'sat');
    expect(ca?.hong).toBeGreaterThan(0);
    // Sat khai hao 0 - khong duoc hong mot mon nao.
    expect(sat?.hong).toBe(0);
  });

  it('doi mot so trong data/ la doi ket qua - bo bat loi that su bat duoc', () => {
    // Bo gieng nuoc di thi nuoc khong ai lam ra nua: `kiemTra` phai chan ngay luc tao.
    const thieuGieng = { nha: nha.nha.filter((n) => n.ten !== 'gieng') };
    expect(() => new ThanhPho({ hang, nha: thieuGieng, chuoi, banDo, walker })).toThrow(/nuoc/);
  });
});
