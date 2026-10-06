/**
 * Ngay/dem (Buoc 2, 05/10): `src/render/NgayDem.ts` la ham thuan cua nhip mo phong. Sim khong doi -
 * `sim:thu`, `sim:van` ra y het; o day chi giu hinh dang cua ngay va phep giau nguoi vac.
 */
import { describe, expect, it } from 'vitest';
import { maManh } from '../src/render/Shader.ts';
import {
  BAN_NGAY, SO_DEM, bamNguoi, docGio, doToi, gioTrongNgay, mauNhan, nguoiTrongDem, theoGio, theoNhip,
} from '../src/render/NgayDem.ts';

const K = SO_DEM.chuKyNhip;

describe('NgayDem - so trong data', () => {
  it('chu ky duong, bon moc gio theo thu tu trong 0..24, mau trong 0..1', () => {
    expect(K).toBeGreaterThan(0);
    const [s0, s1] = SO_DEM.rangSang;
    const [t0, t1] = SO_DEM.chieuToi;
    expect(0 <= (s0 ?? -1) && (s0 ?? 0) < (s1 ?? 0) && (s1 ?? 0) < (t0 ?? 0) && (t0 ?? 0) < (t1 ?? 0) && (t1 ?? 99) <= 24).toBe(true);
    for (const c of [...SO_DEM.mauChieu, ...SO_DEM.mauDem]) expect(c > 0 && c <= 1).toBe(true);
    expect(SO_DEM.tiLeAnNguoi).toBeGreaterThanOrEqual(0);
    expect(SO_DEM.tiLeAnNguoi).toBeLessThanOrEqual(1);
  });
});

describe('NgayDem - theo nhip', () => {
  it('mo man (nhip 36.000) va dau moi chu ky la `gioDauChuKy`, ban ngay - anh chup cu khong doi', () => {
    for (const n of [0, 36_000, K, 7 * K]) {
      expect(gioTrongNgay(n)).toBeCloseTo(SO_DEM.gioDauChuKy, 9);
      expect(theoNhip(n).dem).toBe(0);
      expect(theoNhip(n).mau).toEqual([1, 1, 1]);
    }
  });

  it('khong co nhip (ban do tinh, man tran) la ban ngay', () => {
    expect(theoNhip(undefined)).toEqual(BAN_NGAY);
  });

  it('chi phu thuoc nhip chia du chu ky: dung, tua cung nhip cung mau', () => {
    for (const d of [0, 1, 777, Math.floor(K / 2), K - 1]) {
      expect(theoNhip(36_000 + d)).toEqual(theoNhip(36_000 + d + 13 * K));
    }
  });

  it('troi lien: hai nhip ke nhau khong nhay mau qua 0,001', () => {
    let truoc = theoNhip(0);
    for (let n = 1; n <= K; n += 1) {
      const p = theoNhip(n);
      for (let i = 0; i < 3; i += 1) expect(Math.abs((p.mau[i] ?? 0) - (truoc.mau[i] ?? 0))).toBeLessThan(0.001);
      truoc = p;
    }
  });

  it('mot ngay: trua sang, toi han dung mauDem, toi len mot chieu luc chieu, xuong mot chieu luc sang', () => {
    expect(doToi(12)).toBe(0);
    expect(doToi(0)).toBe(1);
    expect(theoGio(0).mau).toEqual(SO_DEM.mauDem.map((c) => c));
    const [t0 = 18, t1 = 20] = SO_DEM.chieuToi;
    const [s0 = 5, s1 = 7] = SO_DEM.rangSang;
    for (let g = t0; g < t1; g += 0.05) expect(doToi(g + 0.05)).toBeGreaterThanOrEqual(doToi(g));
    for (let g = s0; g < s1; g += 0.05) expect(doToi(g + 0.05)).toBeLessThanOrEqual(doToi(g));
  });

  it('giua hoang hon am hon ca ban ngay lan toi han (kenh do troi hon kenh lam)', () => {
    const [r, , b] = mauNhan(0.5);
    expect(r).toBeGreaterThan(b);
  });
});

describe('NgayDem - shader sprite', () => {
  it('moi so trang deu co u_toi; nhan toi truoc khi cong chop sang (loe xay, loe doi me sang ro giua dem)', () => {
    for (let so = 1; so <= 4; so += 1) {
      const ma = maManh(so);
      expect(ma).toContain('uniform vec3 u_toi;');
      expect(ma).toContain('c.rgb * (1.0 - u_toi) + c.a * sang * 2.0');
    }
  });
});

describe('NgayDem - ?gio=', () => {
  it('so ghim gio, lap chay vong, sai dang thi troi theo nhip', () => {
    expect(docGio(null)).toBeUndefined();
    expect(docGio('22')).toBe(22);
    expect(docGio('25')).toBe(1);
    expect(docGio('lap')).toBe('lap');
    expect(docGio('abc')).toBeUndefined();
  });
});

describe('NgayDem - giau nguoi vac', () => {
  const ds = Array.from({ length: 4000 }, (_, i) => ({
    nha: i % 400, kho: { a: (i * 7) % 96, b: (i * 13) % 96 }, kieu: i % 2, viec: i % 3 === 0 ? 'giao' as const : 'lay' as const,
    daToiKho: i % 5 === 0,
  }));

  it('ban ngay giu nguyen danh sach; dem chi loc ban sao, khong dung danh sach goc', () => {
    expect(nguoiTrongDem(ds, 0)).toBe(ds);
    const dai = ds.length;
    const con = nguoiTrongDem(ds, 1);
    expect(ds.length).toBe(dai);
    expect(con.length).toBeLessThan(dai);
  });

  it('toi han giau gan dung `tiLeAnNguoi` nguoi di lay/giao, nguoi ve nha giau it hon', () => {
    const di = ds.filter((w) => !w.daToiKho);
    const ve = ds.filter((w) => w.daToiKho);
    const anDi = 1 - nguoiTrongDem(di, 1).length / di.length;
    const anVe = 1 - nguoiTrongDem(ve, 1).length / ve.length;
    expect(Math.abs(anDi - SO_DEM.tiLeAnNguoi)).toBeLessThan(0.05);
    expect(anVe).toBeLessThan(anDi);
  });

  it('tat dinh va mot chieu: cung nguoi cung ket qua, ai da giau o do toi thap thi van giau khi toi hon', () => {
    for (const w of ds.slice(0, 200)) {
      expect(bamNguoi(w)).toBe(bamNguoi({ ...w }));
      const h = bamNguoi(w);
      expect(h >= 0 && h < 1).toBe(true);
    }
    const it3 = new Set(nguoiTrongDem(ds, 0.3));
    for (const w of nguoiTrongDem(ds, 0.9)) expect(it3.has(w)).toBe(true);
  });
});
