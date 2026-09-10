/**
 * Quy hoach thanh pho: nam khu vong dong tam, nha cung loai dung thanh cum.
 *
 * VI SAO CAN (chu du an chot 10/09): 188 nha rai deu khap 9.216 o thi nhin dau cung chi
 * thay nha dan. Ca van co sau coi xay ma khong ai tim ra. Quy hoach lai thi biet cho nao
 * co gi - va tim mot cai la thay ca dan.
 *
 * Khoang cach do bang **Chebyshev** (max cua hai truc) chu khong Euclid: luoi iso nghieng
 * 45 do nen hinh vuong Chebyshev hien ra man thanh hinh THOI, dung cai mat nguoi doc ra la
 * "vong trong, vong ngoai". Hinh tron Euclid tren luoi iso lai ra hinh bau duc det.
 */
import type { Rng } from '../../core/Rng.ts';
import type { BanDo, O } from './BanDo.ts';
import { laDuong } from './BanDo.ts';
import { layObject, laySoNguyen } from './DocJson.ts';

/** Ten nam khu, tu trong ra ngoai. */
export type TenKhu = 'do_thi' | 'san_xuat' | 'nong_nghiep' | 'cong_nghiep' | 'quan_su';

/** Ranh gioi ngoai cua tung khu, tinh bang khoang cach Chebyshev tu tam ban do. */
export interface VanhKhu {
  readonly do_thi: number;
  readonly san_xuat: number;
  readonly nong_nghiep: number;
  readonly cong_nghiep: number;
}

/** Doc `thanh_pho_demo.json > khu`. */
export function docVanhKhu(tho: unknown): VanhKhu {
  const o = layObject(tho, 'thanh_pho_demo.json > khu');
  const lay = (ten: string): number => laySoNguyen(o[ten], `khu.${ten}`);
  return {
    do_thi: lay('do_thi'),
    san_xuat: lay('san_xuat'),
    nong_nghiep: lay('nong_nghiep'),
    cong_nghiep: lay('cong_nghiep'),
  };
}

/** Khoang cach Chebyshev tu o `(a,b)` toi tam ban do. */
export function xaTam(a: number, b: number, canh: number): number {
  const tam: number = Math.floor(canh / 2);
  return Math.max(Math.abs(a - tam), Math.abs(b - tam));
}

/** O `(a,b)` co nam trong khu `khu` khong. */
export function trongKhu(a: number, b: number, canh: number, v: VanhKhu, khu: TenKhu): boolean {
  const r: number = xaTam(a, b, canh);
  if (khu === 'do_thi') return r < v.do_thi;
  if (khu === 'san_xuat') return r >= v.do_thi && r < v.san_xuat;
  if (khu === 'nong_nghiep') return r >= v.san_xuat && r < v.nong_nghiep;
  if (khu === 'cong_nghiep') return r >= v.nong_nghiep && r < v.cong_nghiep;
  return r >= v.cong_nghiep;
}

/** O nay dat duoc nha khong: sat duong, chua ai chiem, khong nam tren duong. */
function datDuoc(banDo: BanDo, daChiem: ReadonlySet<number>, a: number, b: number): boolean {
  const c: number = banDo.duongCach;
  if (a < 1 || b < 1 || a >= banDo.canh - 1 || b >= banDo.canh - 1) return false;
  if (laDuong({ a, b }, c)) return false;
  // Sat duong: ke duong nhung khong nam tren duong.
  if (a % c !== 1 && b % c !== 1 && a % c !== c - 1 && b % c !== c - 1) return false;
  return !daChiem.has(a * banDo.canh + b);
}

/** So lan boc that bai lien tiep thi coi nhu khu da chat. */
const BOC_TOI_DA = 400;

/**
 * Hop bao cua mot khu: `[thap, cao]` cho ca hai truc.
 *
 * VI SAO CAN: khu do thi chi chiem 9 % dien tich ban do. Boc ngau nhien tren CA ban do thi
 * chin lan trong muoi roi ra ngoai khu, 400 lan boc chi con vai chuc lan trung - thong doc
 * bao "khu chat" trong khi khu con day cho. Do duoc 10/09.
 */
function hopBao(canh: number, v: VanhKhu, khu: TenKhu): [number, number] {
  const tam: number = Math.floor(canh / 2);
  const r: number = khu === 'do_thi' ? v.do_thi
    : khu === 'san_xuat' ? v.san_xuat
      : khu === 'nong_nghiep' ? v.nong_nghiep
        : khu === 'cong_nghiep' ? v.cong_nghiep
          : canh;
  return [Math.max(0, tam - r), Math.min(canh - 1, tam + r)];
}

/**
 * Boc mot o trong khu `khu`. `undefined` khi khu da chat.
 *
 * Boc ngau nhien chu khong quet tuan tu: quet thi nha xep thanh hang tu goc ra, nhin nhu
 * bang tinh chu khong phai thanh pho.
 */
export function oTrongKhu(
  banDo: BanDo, daChiem: Set<number>, rng: Rng, v: VanhKhu, khu: TenKhu,
): O | undefined {
  const [thap, cao] = hopBao(banDo.canh, v, khu);
  const rong: number = cao - thap + 1;
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a: number = thap + rng.nguyen(rong);
    const b: number = thap + rng.nguyen(rong);
    if (!trongKhu(a, b, banDo.canh, v, khu)) continue;
    if (!datDuoc(banDo, daChiem, a, b)) continue;
    daChiem.add(a * banDo.canh + b);
    return { a, b };
  }
  return undefined;
}

/** Ban kinh toi da khi toa ra tim o gan hat cum. Rong hon thi cum khong con ra cum. */
const BAN_KINH_CUM = 12;

/**
 * O trong GAN `hat` nhat, van phai nam trong khu. `undefined` khi quanh hat da chat.
 *
 * Toa ra tung vong vuong quanh hat: vong 1 la tam o ke, vong 2 la mep hinh 5x5, cu the.
 * Nho vay sau coi xay dung thanh mot cum thay vi rai khap khu san xuat.
 */
export function oGanHat(
  banDo: BanDo, daChiem: Set<number>, v: VanhKhu, khu: TenKhu, hat: O,
): O | undefined {
  for (let r = 1; r <= BAN_KINH_CUM; r += 1) {
    for (let da = -r; da <= r; da += 1) {
      for (let db = -r; db <= r; db += 1) {
        // Chi xet MEP cua vong r, phan trong da xet o cac vong truoc.
        if (Math.max(Math.abs(da), Math.abs(db)) !== r) continue;
        const a: number = hat.a + da;
        const b: number = hat.b + db;
        if (a < 0 || b < 0 || a >= banDo.canh || b >= banDo.canh) continue;
        if (!trongKhu(a, b, banDo.canh, v, khu)) continue;
        if (!datDuoc(banDo, daChiem, a, b)) continue;
        daChiem.add(a * banDo.canh + b);
        return { a, b };
      }
    }
  }
  return undefined;
}
