/**
 * Ngay/dem cua thanh pho (Buoc 2, 05/10). TypeScript thuan, khong GL, khong trinh duyet - test duoc
 * bang so (`tests/NgayDem.test.ts`). Ke hoach: `docs/ke-hoach/2026-10-05-buoc-2-ngay-dem.md`.
 *
 * Tinh bang NHIP mo phong chu khong bang giay that, khuon `TungBuoc.ts`: dung hinh thi troi dung,
 * tua 500x thi ngay troi nhanh, cung mot nhip thi cung mot mau. Sim khong biet gi ve ngay/dem -
 * nguoi vac van chay suot dem, lop ve chi giau bot (`nguoiTrongDem`). Moi so doc tu
 * `data/tung_buoc.json > ngayDem`.
 */
import soTho from '../../data/tung_buoc.json';
import type { Walker } from '../sim/city/Walkers';

export const SO_DEM = soTho.ngayDem;

export type Mau3 = readonly [number, number, number];

export interface TrangThaiDem {
  /** Gio trong ngay, 0..24. */
  readonly gio: number;
  /** Do toi, 0 = ban ngay, 1 = toi han. */
  readonly dem: number;
  /** Mau nhan vao canh (1 = giu nguyen). Shader nhan `1 - mau` lam `u_toi`. */
  readonly mau: Mau3;
}

export const BAN_NGAY: TrangThaiDem = { gio: 12, dem: 0, mau: [1, 1, 1] };

const em = (t: number): number => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

/** Gio trong ngay o nhip `nhipSim`. Nhip chia het cho `chuKyNhip` la `gioDauChuKy`. */
export function gioTrongNgay(nhipSim: number, so: typeof SO_DEM = SO_DEM): number {
  // Chia du tren SO NHIP truoc (so nguyen, chinh xac) roi moi doi ra gio: cung nhip du thi cung gio tung bit.
  const du = ((nhipSim % so.chuKyNhip) + so.chuKyNhip) % so.chuKyNhip;
  return ((du / so.chuKyNhip) * 24 + so.gioDauChuKy) % 24;
}

/** Do toi o gio `gio`: 0 suot ban ngay, len dan luc chieu toi, 1 suot dem, xuong dan luc rang sang. */
export function doToi(gio: number, so: typeof SO_DEM = SO_DEM): number {
  const [t0 = 18, t1 = 20] = so.chieuToi;
  const [s0 = 5, s1 = 7] = so.rangSang;
  if (gio >= t1 || gio < s0) return 1;
  if (gio >= t0) return em((gio - t0) / (t1 - t0));
  if (gio < s1) return 1 - em((gio - s0) / (s1 - s0));
  return 0;
}

/** Mau nhan o do toi `dem`: am dan giua hoang hon/binh minh (`mauChieu`), xanh toi luc dem (`mauDem`). */
export function mauNhan(dem: number, so: typeof SO_DEM = SO_DEM): Mau3 {
  const chieu = 4 * dem * (1 - dem);
  // Tron dang `1 - t + c*t`: t = 1 ra dung c, t = 0 ra dung 1 (khong lech so le dau phay dong).
  const tron = (c: number, t: number): number => 1 - t + c * t;
  const kenh = (i: number): number => tron(so.mauChieu[i] ?? 1, chieu) * tron(so.mauDem[i] ?? 1, dem);
  return [kenh(0), kenh(1), kenh(2)];
}

/** Trang thai o gio `gio`. */
export function theoGio(gio: number, so: typeof SO_DEM = SO_DEM): TrangThaiDem {
  const dem = doToi(gio, so);
  return dem === 0 ? { ...BAN_NGAY, gio } : { gio, dem, mau: mauNhan(dem, so) };
}

/** Trang thai o nhip `nhipSim`. Khong co nhip (ban do tinh, man tran) la ban ngay. */
export function theoNhip(nhipSim: number | undefined, so: typeof SO_DEM = SO_DEM): TrangThaiDem {
  return nhipSim === undefined ? BAN_NGAY : theoGio(gioTrongNgay(nhipSim, so), so);
}

/**
 * `?gio=` de chup anh, quay clip: so 0..24 ghim gio, `lap` chay mot ngay trong `chuKyLapGiay` giay that.
 * Khong co hay sai dang thi `undefined` (troi theo nhip mo phong).
 */
export function docGio(chuoi: string | null): number | 'lap' | undefined {
  if (chuoi === null || chuoi.trim() === '') return undefined;
  if (chuoi === 'lap') return 'lap';
  const so = Number(chuoi);
  return Number.isFinite(so) ? ((so % 24) + 24) % 24 : undefined;
}

/** Bam mot nguoi vac ra 0..1 theo cac truong khong doi suot chuyen: on dinh giua cac khung, khong nhap nhay. */
export function bamNguoi(w: Pick<Walker, 'nha' | 'kho' | 'kieu' | 'viec'>): number {
  let h = Math.imul(w.nha + 1, 0x9e3779b1);
  h = Math.imul(h ^ (w.kho.a * 131 + w.kho.b), 0x85ebca6b);
  h = Math.imul(h ^ (w.kieu * 2 + (w.viec === 'giao' ? 1 : 0)), 0xc2b2ae35);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

/**
 * Nguoi vac con VE o do toi `dem`: giau dan `tiLeAnNguoi` luc toi han, nguoi dang ve nha (`daToiKho`) giau
 * it hon - dem xuong la thay dan di ve. Chi loc ban sao, khong dung toi danh sach cua sim.
 */
export function nguoiTrongDem<T extends Pick<Walker, 'nha' | 'kho' | 'kieu' | 'viec' | 'daToiKho'>>(
  ds: readonly T[], dem: number, so: typeof SO_DEM = SO_DEM,
): readonly T[] {
  if (dem <= 0) return ds;
  return ds.filter((w) => bamNguoi(w) >= dem * so.tiLeAnNguoi * (w.daToiKho ? so.heSoNguoiVe : 1));
}
