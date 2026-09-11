/**
 * Thuoc do cua Phase 8 - cay cong nghe: cay phai DI DUOC tu dau den cuoi.
 *
 * Cai de hong nhat o mot cay cong nghe khong phai code ma la du lieu: go sai mot id tien
 * de la ca nhanh do khong bao gio hoc duoc, ma game van chay binh thuong va khong ai
 * biet. Test o day cham DU LIEU THAT trong `data/tech.json`, khong cham cay bia dat.
 */
import { describe, expect, it } from 'vitest';
import { CayCongNghe, docCongNghe, type CongNghe, type DuLieuCongNghe } from '../src/sim/meta/CongNghe.ts';
import { LoiDuLieu } from '../src/sim/city/DocJson.ts';
import techTho from '../data/tech.json';

const du: DuLieuCongNghe = docCongNghe(techTho);

describe('doc data/tech.json', () => {
  it('doc duoc, va moi cong nghe co toi da hai tien de', () => {
    expect(du.ds.length).toBeGreaterThanOrEqual(20);
    for (const c of du.ds) expect(c.tienDe.length).toBeLessThanOrEqual(2);
  });

  it('moi tien de deu la mot cong nghe co that', () => {
    const id = new Set(du.ds.map((c) => c.id));
    for (const c of du.ds) {
      for (const t of c.tienDe) expect(id, `"${c.id}" can "${t}"`).toContain(t);
    }
  });

  it('khong cong nghe nao tu lam tien de cho chinh no', () => {
    for (const c of du.ds) expect(c.tienDe).not.toContain(c.id);
  });

  it('tien de phai dung TRUOC trong file - luat nay chan cay thanh vong tron', () => {
    expect(() => docCongNghe({
      nghienCuu: { coBan: 1, moiNhaMotDiem: 10 },
      congNghe: [{
        id: 'a', hien: 'A', thoiDai: 1, gia: 10, tienDe: ['b'], loi: 'x', moThe: [],
      }],
    })).toThrow(LoiDuLieu);
  });

  it('khong trung id', () => {
    const id = du.ds.map((c) => c.id);
    expect(new Set(id).size).toBe(id.length);
  });
});

describe('di het cay', () => {
  it('moi cong nghe deu toi duoc: hoc mai thi khong con cai nao ket lai', () => {
    const cay = new CayCongNghe(du);
    // Gia bang 1 de vong lap ngan; day la phep do DUONG DI, khong phai do nhip do.
    for (let i = 0; i < du.ds.length; i += 1) {
      const xong: CongNghe | undefined = cay.don(1, () => 1);
      expect(xong, `ket o cong nghe thu ${String(i + 1)}`).toBeDefined();
    }
    expect(cay.soXong).toBe(du.ds.length);
    expect(cay.hocDuoc()).toHaveLength(0);
  });

  it('chua du tien de thi khong chon duoc', () => {
    const cay = new CayCongNghe(du);
    const sau: CongNghe | undefined = du.ds.find((c) => c.tienDe.length === 2);
    expect(sau).toBeDefined();
    expect(cay.chon((sau as CongNghe).id)).toBe(false);
  });

  it('diem thua chay sang cong nghe sau, khong vut di', () => {
    const cay = new CayCongNghe(du);
    // Don 10 diem vao mot cong nghe gia 4: xong ngay, va con du 6.
    expect(cay.don(10, () => 4)).toBeDefined();
    expect(cay.daDon).toBe(6);
  });

  it('chua chon thi tu hoc cai RE nhat, khong dung im ca van', () => {
    const cay = new CayCongNghe(du);
    const reNhat: CongNghe = cay.hocDuoc()
      .reduce((a, b) => (b.gia < a.gia ? b : a));
    expect(cay.don(0, (c) => c.gia)?.id).toBeUndefined();
    expect(cay.dang?.id).toBe(reNhat.id);
  });
});

describe('diem nghien cuu moi gio', () => {
  it('thanh pho cang lon nghien cuu cang nhanh', () => {
    const cay = new CayCongNghe(du);
    expect(cay.diemMoiGio(200, 100)).toBeGreaterThan(cay.diemMoiGio(40, 100));
  });

  it('he so the chinh sach an vao diem', () => {
    const cay = new CayCongNghe(du);
    const mot: number = cay.diemMoiGio(200, 100);
    expect(cay.diemMoiGio(200, 200)).toBe(mot * 2);
  });
});
