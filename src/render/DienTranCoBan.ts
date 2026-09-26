/**
 * Phan co ban cua lop dien tran: kieu du lieu va ham thuan nho, tach khoi `DienTran.ts`
 * cho khoi cham tran 300 dong. Khong DOM, khong WebGL.
 */
import type { DiemDoi, KhungVet, Phe } from '../sim/campaign/Battle';

/** Khuon `data/dien_tran.json` - chi cac truong lop dien dung. */
export interface CauHinhDien {
  readonly khoang_linh: number;
  /** Khoang rieng theo loai doi (`ky_binh`), khong co thi dung `khoang_linh`. */
  readonly khoang_rieng?: Readonly<Record<string, number>>;
  readonly cot_toi_da: number;
  readonly khung_moi_giay: number;
  readonly giay_trung: number;
  readonly toc_rut: number;
  readonly huong: number;
  /** So khung moi dang, khop me `linh_co`. Thieu thi 2 (me cu). */
  readonly so_khung?: Readonly<Record<DangLinh, number>>;
  /** So khung rieng theo loai doi - xe tang la model tinh, moi dang mot khung (me `linh_sung`). */
  readonly so_khung_rieng?: Readonly<Record<string, Readonly<Partial<Record<DangLinh, number>>>>>;
  /** Tien to sprite dan bay: `mui_ten` (me `linh_co`), `dan` (me `linh_sung`). Thieu thi `mui_ten`. */
  readonly ten_dan?: string;
  readonly khoang_giap?: number;
  /** Khoang giap rieng theo loai doi - ngua dai, hai hang ky phai dung gian ra. */
  readonly khoang_giap_rieng?: Readonly<Record<string, number>>;
  readonly nhun?: number;
  readonly giay_vao_tran?: number;
  readonly chu_ky_ban?: number;
  readonly giay_bay?: number;
  readonly do_vong?: number;
  readonly tan_ban?: number;
}

/** Mot mui ten dang bay. `cao` tinh bang o, lop ve doi ra diem anh. */
export interface MuiTen {
  readonly a: number;
  readonly b: number;
  readonly cao: number;
  readonly ten: string;
}

export type DangLinh = 'di' | 'danh' | 'trung' | 'chet';

/** Mot linh can ve. `ten` la ten sprite trong atlas cua tran (`linh_co`, `linh_sung`). */
export interface LinhVe {
  readonly a: number;
  readonly b: number;
  readonly ten: string;
  readonly ben: Phe;
}

/**
 * Chon huong sprite cho vector di `(da, db)`. Vector 0 thi tra -1 - noi goi giu huong cu.
 * Goc `atan2(da, db)` vi huong 0 nhin theo +b (xem dau file).
 */
export function chonHuong(da: number, db: number, soHuong: number): number {
  if (da === 0 && db === 0) return -1;
  const buoc: number = (2 * Math.PI) / soHuong;
  const h: number = Math.round(Math.atan2(da, db) / buoc);
  return ((h % soHuong) + soHuong) % soHuong;
}

/**
 * Cho dung cua linh thu `i` trong doi `n` nguoi, so voi tam doi: xep hang ngang toi da
 * `cot` nguoi, cac hang can giua.
 */
export function oDoiHinh(i: number, n: number, cot: number, khoang: number): { da: number; db: number } {
  const soCot: number = Math.min(cot, n);
  const soHang: number = Math.ceil(n / soCot);
  const hang: number = Math.floor(i / soCot);
  // Hang cuoi thieu nguoi thi can giua rieng hang do.
  const trongHang: number = hang === soHang - 1 ? n - hang * soCot : soCot;
  const cotI: number = i % soCot;
  return {
    da: (hang - (soHang - 1) / 2) * khoang,
    db: (cotI - (trongHang - 1) / 2) * khoang,
  };
}

/** Chi so khung vet ngay truoc `giay` va phan noi `f` (0..1) sang khung sau. */
export function timKhung(vet: readonly KhungVet[], giay: number): { i: number; f: number } {
  if (vet.length === 0) throw new Error('vet rong: tinhTran luon ghi it nhat mot khung');
  let i = 0;
  while (i + 1 < vet.length && (vet[i + 1]?.giay ?? Infinity) <= giay) i += 1;
  const dau: KhungVet = vet[i] as KhungVet;
  const sau: KhungVet | undefined = vet[i + 1];
  if (sau === undefined || sau.giay <= dau.giay) return { i, f: 0 };
  return { i, f: Math.min(1, Math.max(0, (giay - dau.giay) / (sau.giay - dau.giay))) };
}

export function diem(k: KhungVet | undefined, ben: Phe, doi: number): DiemDoi | undefined {
  return k === undefined ? undefined : (ben === 'a' ? k.a : k.b)[doi];
}

/** So gia ngau nhien tat dinh trong [0, 1) tu hai so nguyen - lech pha, lech diem roi. */
export function bam(x: number, y: number): number {
  const v: number = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}
