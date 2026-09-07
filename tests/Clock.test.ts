/**
 * Hang rao cho nhip 10 Hz (TECH_SPEC muc 2).
 *
 * Cho quan trong nhat: **khong troi nhip**. Vong ve 60 fps goi `tien(1/60)` - moi lan
 * chi duoc 0,167 nhip, lam tron xuong la 0. Giu phan le thi sau 6 khung se ra dung 1 nhip;
 * khong giu thi mo phong dung im ma van ve, dung loi cua Tay Vuc.
 */
import { describe, expect, it } from 'vitest';
import { chuoiGio, DongHo, NHIP_MOI_GIAY, NHIP_MOI_GIO } from '../src/sim/Clock.ts';

describe('DongHo', () => {
  it('mot giay that o toc do 1x ra dung 10 nhip', () => {
    const dh = new DongHo();
    expect(dh.tien(1)).toBe(NHIP_MOI_GIAY);
    expect(dh.soNhip).toBe(10);
  });

  it('khong troi nhip khi goi tung khung hinh 60 fps', () => {
    const dh = new DongHo();
    let tong = 0;
    for (let i = 0; i < 600; i++) tong += dh.tien(1 / 60);
    // 10 giay that -> 100 nhip. Cho phep lech 1 nhip vi phan le con dang giu.
    expect(tong).toBeGreaterThanOrEqual(99);
    expect(tong).toBeLessThanOrEqual(100);
    expect(dh.soNhip).toBe(tong);
  });

  it('toc do 0 la dung han, toc do 8 nhanh gap tam', () => {
    const dung = new DongHo();
    dung.tocDo = 0;
    expect(dung.tien(5)).toBe(0);
    expect(dung.soNhip).toBe(0);

    const nhanh = new DongHo();
    nhanh.tocDo = 8;
    expect(nhanh.tien(1)).toBe(80);
  });

  it('chay lai sau khi may treo thi bo bot, khong chay bu ca ngan nhip', () => {
    const dh = new DongHo();
    // 30 giay that o 8x la 2.400 nhip - chay het trong mot khung hinh se giat hinh.
    expect(dh.tien(30)).toBeLessThanOrEqual(200);
  });

  it('doi ra gio game dung', () => {
    const dh = new DongHo();
    dh.chayThang(NHIP_MOI_GIO * 10);
    expect(dh.gio).toBe(10);
    expect(chuoiGio(dh.soNhip)).toBe('10h00');
    expect(chuoiGio(NHIP_MOI_GIO * 2 + NHIP_MOI_GIAY * 60 * 34)).toBe('2h34');
  });
});
