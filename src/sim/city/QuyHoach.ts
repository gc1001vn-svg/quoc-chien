/**
 * Quy hoach thanh pho theo **don vi lan can** (neighbourhood unit, Clarence Perry 1929).
 *
 * Ba luat cua Perry, lay nguyen:
 *
 * 1. **Phuong tu cap**: moi phuong o co du tien ich cua no - gieng nuoc, cho, kho - dat o
 *    LOI phuong, di bo vai buoc la toi. Khong gom het gieng ca thanh pho vao mot cho.
 * 2. **Duong lon chay VONG QUANH phuong, khong xuyen qua.** Luoi duong `duongCach` san co
 *    lam viec do: moi phuong rong ba khoi duong, duong trong phuong chi de di lai trong nha.
 * 3. **Nha rai deu, khong dinh nhau.** Dat xong mot nha thi bon o ke bi danh dau luon.
 *
 * Ban 10/09 dau tien gom moi nha cung loai vao mot cum quanh mot "hat" - chu du an nhin ra
 * ngay: "day la don cuc chu khong phai quy hoach". Dung: quy hoach that phan theo CHUC NANG
 * cua tung vung, roi trong vung do rai deu.
 *
 * Ban do chia luoi phuong vuong; ban do 96 o voi phuong 24 o thanh **4x4 = 16 phuong**.
 * Chuc nang tung phuong khai thang trong `data/thanh_pho_demo.json > phuong` - mot bang chu
 * nhat doc duoc bang mat, sua bo cuc khong phai dung toi code.
 */
import type { Rng } from '../../core/Rng.ts';
import type { BanDo, O } from './BanDo.ts';
import { laDuong } from './BanDo.ts';
import { layChuoi, layMang, LoiDuLieu } from './DocJson.ts';

/** Ten nam chuc nang phuong. */
export type TenKhu = 'do_thi' | 'san_xuat' | 'nong_nghiep' | 'cong_nghiep' | 'quan_su';

const TEN_KHU: readonly string[] = ['do_thi', 'san_xuat', 'nong_nghiep', 'cong_nghiep', 'quan_su'];

/** Ban do chuc nang: `bang[hang][cot]` la chuc nang cua phuong do. */
export interface BanDoPhuong {
  /** Canh mot phuong, tinh bang o luoi. */
  readonly canh: number;
  readonly bang: readonly (readonly TenKhu[])[];
}

/** Doc `thanh_pho_demo.json > phuong`. */
export function docPhuong(tho: unknown, canhPhuong: number): BanDoPhuong {
  const hang = layMang(tho, 'thanh_pho_demo.json > phuong');
  const bang: TenKhu[][] = hang.map((h, i) => layMang(h, `phuong[${String(i)}]`).map((o, j) => {
    const ten = layChuoi(o, `phuong[${String(i)}][${String(j)}]`);
    if (!TEN_KHU.includes(ten)) {
      throw new LoiDuLieu(`phuong[${String(i)}][${String(j)}]`, `phai la mot trong ${TEN_KHU.join(' ')}`);
    }
    return ten as TenKhu;
  }));
  if (bang.length === 0) throw new LoiDuLieu('phuong', 'khong duoc rong');
  for (const [i, h] of bang.entries()) {
    if (h.length !== bang.length) {
      throw new LoiDuLieu(`phuong[${String(i)}]`, `phai co dung ${String(bang.length)} phuong`);
    }
  }
  return { canh: canhPhuong, bang };
}

/** Chuc nang cua phuong chua o `(a,b)`. */
export function khuCuaO(a: number, b: number, p: BanDoPhuong): TenKhu {
  const i: number = Math.min(bang(p) - 1, Math.floor(a / p.canh));
  const j: number = Math.min(bang(p) - 1, Math.floor(b / p.canh));
  return (p.bang[i] as readonly TenKhu[])[j] as TenKhu;
}

/** So phuong tren mot canh ban do. */
function bang(p: BanDoPhuong): number {
  return p.bang.length;
}

/**
 * Danh dau o da dung, KE CA bon o ke.
 *
 * Nha ke sat nhau thi mai chong mai, ca day thanh mot khoi do - chu du an goi dung ten la
 * "don cuc". Chua o ke ra thi giua hai nha luon co mot o co hay mot loi di.
 */
function chiemVaChuaLe(daChiem: Set<number>, canh: number, a: number, b: number): void {
  daChiem.add(a * canh + b);
  for (const [da, db] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x: number = a + (da as number);
    const y: number = b + (db as number);
    if (x >= 0 && y >= 0 && x < canh && y < canh) daChiem.add(x * canh + y);
  }
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
const BOC_TOI_DA = 600;

/**
 * Boc mot o trong khu `khu`, rai deu khap moi phuong mang chuc nang do.
 *
 * `veLoi` = true thi uu tien o GAN LOI phuong: gieng, cho, kho phai nam giua khu dan cu de
 * ai cung di bo toi duoc - do la diem cot loi cua don vi lan can. Nha o thi nguoc lai, rai
 * ra vanh ngoai cua phuong.
 */
export function oTrongKhu(
  banDo: BanDo, daChiem: Set<number>, rng: Rng, p: BanDoPhuong, khu: TenKhu, veLoi = false,
): O | undefined {
  let tot: O | undefined;
  // `-Infinity` chu khong `-1`: diem la khoang cach toi loi lay dau am nen LUON am, de -1
  // thi khong o nao vuot qua duoc va ham bao "khu chat" ngay o nha dau tien.
  let diemTot = -Infinity;
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a: number = rng.nguyen(banDo.canh);
    const b: number = rng.nguyen(banDo.canh);
    if (khuCuaO(a, b, p) !== khu) continue;
    if (!datDuoc(banDo, daChiem, a, b)) continue;
    if (!veLoi) {
      chiemVaChuaLe(daChiem, banDo.canh, a, b);
      return { a, b };
    }
    // Gan loi phuong bao nhieu: 0 la sat loi. Boc vai o roi giu o gan nhat.
    const diem: number = -xaLoiPhuong(a, b, p);
    if (diem > diemTot) {
      diemTot = diem;
      tot = { a, b };
      if (diem >= -2) break;
    }
  }
  if (tot === undefined) return undefined;
  chiemVaChuaLe(daChiem, banDo.canh, tot.a, tot.b);
  return tot;
}

/** Khoang cach Chebyshev tu o toi loi phuong chua no. */
export function xaLoiPhuong(a: number, b: number, p: BanDoPhuong): number {
  const nua: number = Math.floor(p.canh / 2);
  const la: number = Math.floor(a / p.canh) * p.canh + nua;
  const lb: number = Math.floor(b / p.canh) * p.canh + nua;
  return Math.max(Math.abs(a - la), Math.abs(b - lb));
}
