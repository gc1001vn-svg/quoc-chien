/**
 * Quy hoach thanh pho theo VANH DONG TAM, va rai nha theo KHOANG CACH TOI THIEU.
 *
 * Ban 10/09 truoc chia ban do thanh 16 phuong vuong roi keo tien ich ve LOI PHUONG. Do
 * doc ra so: **6 trong 12 gieng nam chung mot phuong**, 10/21 cap cach nhau duoi 4 o. Chu
 * du an goi dung ten: "1 dong gieng nuoc o cung voi nhau". Nguyen nhan la hieu sai Perry -
 * mot don vi lan can co MOT trung tam, nen 12 gieng nghia la 12 don vi lan can chu khong
 * phai 4. Keo ca 3 gieng cua mot phuong ve cung mot loi thi chung chong len nhau.
 *
 * Ban nay dung ba nguon, moi nguon chua mot benh:
 *
 * 1. **Kevin Lynch, *The Image of the City* (1960)** - mot thanh pho doc duoc nho
 *    **Districts** (moi khu mot chat nen, mot kieu vat rieng) va **Edges** (ranh gioi
 *    lien tuc va nhin thay duoc; **khong can la tuong chan**). Xem `Nen.ts` cho phan vien.
 * 2. **Ped shed - quang di bo 5 phut (400 m)**, tu don vi lan can cua Perry: tien ich dat
 *    o TAM VUNG NO PHUC VU. O day mot "vung" la mot KHOI PHO 8x8 giua bon con duong, va
 *    moi khoi pho chi duoc MOT tien ich (`motKhoi`).
 * 3. **Poisson-disk sampling (blue noise)** - boc ngau nhien nhung giu khoang cach toi
 *    thieu. Moi loai nha khai `cachNhau` rieng trong `data/buildings.json`.
 *
 * Boc mai khong ra thi **tu noi** `cachNhau` xuong, khong bao "khu chat" roi chet - do la
 * lo ngay 10/09 lam thong doc het cho xay.
 */
import type { Rng } from '../../core/Rng.ts';
import type { BanDo, O } from './BanDo.ts';
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from './DocJson.ts';

/** Ten nam khu chuc nang. */
export type TenKhu = 'do_thi' | 'san_xuat' | 'nong_nghiep' | 'cong_nghiep' | 'quan_su';

const TEN_KHU: readonly string[] = ['do_thi', 'san_xuat', 'nong_nghiep', 'cong_nghiep', 'quan_su'];

/** Mot o nen kem trong so boc. */
export interface ONen {
  readonly ten: string;
  readonly trong: number;
}

/** Mot vanh dong tam. */
export interface Vanh {
  readonly khu: TenKhu;
  /** Khoang cach Chebyshev tu tam ban do: o nam trong `tu..den` thuoc vanh nay. */
  readonly tu: number;
  readonly den: number;
  /** Co thi o con phai nam trong `goc` o tinh tu mot trong bon goc ban do (khu quan su). */
  readonly goc?: number;
  /** O nen trong RUOT vanh - day la "thematic continuity" cua Lynch. */
  readonly nen: readonly ONen[];
  /** O nen cua duong vien chay quanh mep ngoai vanh. */
  readonly vienNen: string;
  /** Vat thap rai tren vien. Rong thi vien chi la nen. */
  readonly vienVat: readonly string[];
}

export interface QuyHoach {
  readonly canh: number;
  readonly duongCach: number;
  /** Xet theo THU TU: o khop vanh dau tien la thuoc vanh do. Quan su phai dung truoc. */
  readonly vanh: readonly Vanh[];
}

/** Doc `thanh_pho_demo.json > vanh`. */
export function docQuyHoach(tho: unknown, canh: number, duongCach: number): QuyHoach {
  const mang = layMang(tho, 'thanh_pho_demo.json > vanh');
  if (mang.length === 0) throw new LoiDuLieu('vanh', 'khong duoc rong');
  const vanh: Vanh[] = mang.map((m, i) => {
    const duong = `vanh[${String(i)}]`;
    const o = layObject(m, duong);
    const khu = layChuoi(o['khu'], `${duong}.khu`);
    if (!TEN_KHU.includes(khu)) {
      throw new LoiDuLieu(`${duong}.khu`, `phai la mot trong ${TEN_KHU.join(' ')}`);
    }
    const nen: ONen[] = layMang(o['nen'], `${duong}.nen`).map((n, j) => {
      const t = layObject(n, `${duong}.nen[${String(j)}]`);
      return {
        ten: layChuoi(t['ten'], `${duong}.nen[${String(j)}].ten`),
        trong: laySoNguyen(t['trong'], `${duong}.nen[${String(j)}].trong`),
      };
    });
    if (nen.length === 0) throw new LoiDuLieu(`${duong}.nen`, 'khong duoc rong');
    return {
      khu: khu as TenKhu,
      // `tu` cua vanh long thanh la 0, nen phai cho phep 0 - mac dinh cua `laySoNguyen`
      // la tu 1 tro len.
      tu: laySoNguyen(o['tu'], `${duong}.tu`, 0),
      den: laySoNguyen(o['den'], `${duong}.den`),
      ...(o['goc'] === undefined ? {} : { goc: laySoNguyen(o['goc'], `${duong}.goc`) }),
      nen,
      vienNen: layChuoi(o['vienNen'], `${duong}.vienNen`),
      vienVat: layMang(o['vienVat'] ?? [], `${duong}.vienVat`)
        .map((v, j) => layChuoi(v, `${duong}.vienVat[${String(j)}]`)),
    };
  });
  return { canh, duongCach, vanh };
}

/** Khoang cach Chebyshev tu o toi tam ban do. */
export function xaTam(qh: QuyHoach, a: number, b: number): number {
  const t: number = (qh.canh - 1) / 2;
  return Math.max(Math.abs(a - t), Math.abs(b - t));
}

/** Khoang cach Chebyshev toi goc ban do gan nhat. */
function xaGoc(qh: QuyHoach, a: number, b: number): number {
  const c: number = qh.canh - 1;
  return Math.min(Math.max(a, b), Math.max(c - a, b), Math.max(a, c - b), Math.max(c - a, c - b));
}

/** Vanh chua o `(a,b)`. Luon tra ve mot cai - vanh cuoi cung don het phan con lai. */
export function vanhCuaO(qh: QuyHoach, a: number, b: number): Vanh {
  const d: number = xaTam(qh, a, b);
  for (const v of qh.vanh) {
    if (d < v.tu || d > v.den) continue;
    if (v.goc !== undefined && xaGoc(qh, a, b) > v.goc) continue;
    return v;
  }
  return qh.vanh[qh.vanh.length - 1] as Vanh;
}

export function khuCuaO(qh: QuyHoach, a: number, b: number): TenKhu {
  return vanhCuaO(qh, a, b).khu;
}

/**
 * O nay co nam tren duong VIEN giua hai vanh khong.
 *
 * Vien la mot vong day dung MOT o, chay o dung `den` cua tung vanh. Vanh ngoai cung khong
 * co vien - ra khoi no la het ban do.
 *
 * Cho duong cat qua vien thi vien nhuong duong: Lynch goi vien la "unity seam", noi lien
 * chu khong phai ngan cach. Nguoi vac hang van di qua binh thuong.
 */
export function laVien(qh: QuyHoach, a: number, b: number): boolean {
  const d: number = xaTam(qh, a, b);
  const cuoi: number = (qh.vanh[qh.vanh.length - 1] as Vanh).den;
  for (const v of qh.vanh) {
    if (v.den >= cuoi) continue;
    if (Math.floor(d) === v.den) return true;
  }
  return false;
}

/** Yeu cau dat mot toa nha, lay tu `data/buildings.json`. */
export interface YeuCauDat {
  readonly ten: string;
  readonly khu: TenKhu;
  /** Khoang cach Chebyshev toi thieu toi mot nha CUNG LOAI. */
  readonly cachNhau: number;
  /** Tien ich: moi khoi pho 8x8 chi duoc mot cai, va dat cang gan giua khoi cang tot. */
  readonly motKhoi: boolean;
}

/** So sach cho ca luot dat nha: da dat cai nao o dau, khoi pho nao da co tien ich. */
export interface SoDat {
  readonly theoLoai: Map<string, O[]>;
  readonly khoiDaCoTienIch: Set<number>;
}

export function soDatMoi(): SoDat {
  return { theoLoai: new Map<string, O[]>(), khoiDaCoTienIch: new Set<number>() };
}

/** So lan boc truot lien tiep thi coi nhu khoang cach dang xet la qua chat. */
const BOC_TOI_DA = 400;

/** Chi so khoi pho chua o `(a,b)`. */
function khoiCuaO(qh: QuyHoach, a: number, b: number): number {
  const soKhoi: number = Math.ceil(qh.canh / qh.duongCach);
  return Math.floor(a / qh.duongCach) * soKhoi + Math.floor(b / qh.duongCach);
}

/** O nay dat duoc nha khong: dung khu, sat duong, khong tren duong, khong tren vien. */
function datDuoc(banDo: BanDo, qh: QuyHoach, khu: TenKhu, a: number, b: number): boolean {
  const c: number = qh.duongCach;
  if (a < 1 || b < 1 || a >= qh.canh - 1 || b >= qh.canh - 1) return false;
  if (a % c === 0 || b % c === 0) return false;
  // Sat duong: nha bam duong moi ra thanh pho, va nguoi vac hang di tren duong.
  if (a % c !== 1 && b % c !== 1 && a % c !== c - 1 && b % c !== c - 1) return false;
  if (laVien(qh, a, b)) return false;
  if (khuCuaO(qh, a, b) !== khu) return false;
  return !banDo.daChiem.has(a * qh.canh + b);
}

/** Cach xa moi nha cung loai it nhat `can` o chua. */
function duXa(so: SoDat, ten: string, a: number, b: number, can: number): boolean {
  const da: O[] | undefined = so.theoLoai.get(ten);
  if (da === undefined) return true;
  for (const o of da) {
    if (Math.max(Math.abs(o.a - a), Math.abs(o.b - b)) < can) return false;
  }
  return true;
}

/**
 * Danh dau o da dung, KE CA bon o ke.
 *
 * Nha ke sat nhau thi mai chong mai, ca day thanh mot khoi - chu du an goi dung ten la
 * "don cuc". Chua o ke ra thi giua hai nha luon co mot o co hay mot loi di.
 */
function chiemVaChuaLe(banDo: BanDo, canh: number, a: number, b: number): void {
  banDo.daChiem.add(a * canh + b);
  for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x: number = a + (da as number);
    const y: number = b + (db as number);
    if (x >= 0 && y >= 0 && x < canh && y < canh) banDo.daChiem.add(x * canh + y);
  }
}

/** Boc mot o thuong: nem phi tieu, giu khoang cach toi thieu. */
function bocThuong(
  banDo: BanDo, rng: Rng, qh: QuyHoach, yc: YeuCauDat, so: SoDat, can: number,
): O | undefined {
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a: number = rng.nguyen(qh.canh);
    const b: number = rng.nguyen(qh.canh);
    if (!datDuoc(banDo, qh, yc.khu, a, b)) continue;
    if (!duXa(so, yc.ten, a, b, can)) continue;
    return { a, b };
  }
  return undefined;
}

/**
 * Boc mot o cho TIEN ICH: moi khoi pho mot cai, va cang gan giua khoi cang tot.
 *
 * Day la ped shed thu nho - tu moi nha trong khoi, di bo vai buoc la toi gieng. Khac han
 * ban cu keo ca ba gieng cua mot phuong ve chung mot loi.
 */
function bocTienIch(
  banDo: BanDo, rng: Rng, qh: QuyHoach, yc: YeuCauDat, so: SoDat, can: number,
): O | undefined {
  const c: number = qh.duongCach;
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a0: number = rng.nguyen(qh.canh);
    const b0: number = rng.nguyen(qh.canh);
    const khoi: number = khoiCuaO(qh, a0, b0);
    if (so.khoiDaCoTienIch.has(khoi)) continue;
    // Quet ca khoi, giu o gan giua khoi nhat ma dat duoc.
    const ga: number = Math.floor(a0 / c) * c + c / 2;
    const gb: number = Math.floor(b0 / c) * c + c / 2;
    let tot: O | undefined;
    let gan = Infinity;
    for (let a = Math.floor(a0 / c) * c; a < Math.floor(a0 / c) * c + c; a += 1) {
      for (let b = Math.floor(b0 / c) * c; b < Math.floor(b0 / c) * c + c; b += 1) {
        if (!datDuoc(banDo, qh, yc.khu, a, b)) continue;
        if (!duXa(so, yc.ten, a, b, can)) continue;
        const xa: number = Math.abs(a - ga) + Math.abs(b - gb);
        if (xa < gan) { gan = xa; tot = { a, b }; }
      }
    }
    if (tot !== undefined) {
      so.khoiDaCoTienIch.add(khoi);
      return tot;
    }
  }
  return undefined;
}

/**
 * Dat mot toa nha. Boc mai khong ra thi TU NOI khoang cach toi thieu xuong.
 *
 * Khong noi thi lap lai lo 10/09: ham bao "khu chat" va thong doc het cho xay giua chung.
 */
export function datNha(
  banDo: BanDo, rng: Rng, qh: QuyHoach, yc: YeuCauDat, so: SoDat,
): O | undefined {
  for (let can = Math.max(1, yc.cachNhau); can >= 1; can = Math.floor(can * 0.7)) {
    const o: O | undefined = yc.motKhoi
      ? bocTienIch(banDo, rng, qh, yc, so, can)
      : bocThuong(banDo, rng, qh, yc, so, can);
    if (o === undefined) {
      if (can === 1) return undefined;
      continue;
    }
    const da: O[] = so.theoLoai.get(yc.ten) ?? [];
    da.push(o);
    so.theoLoai.set(yc.ten, da);
    chiemVaChuaLe(banDo, qh.canh, o.a, o.b);
    return o;
  }
  return undefined;
}
