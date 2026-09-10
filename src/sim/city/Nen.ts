/**
 * O nen theo KHU va duong VIEN giua cac khu.
 *
 * Tach khoi `BanDo.ts` cho khoi cham tran 300 dong.
 *
 * Hai dieu lay tu **Kevin Lynch, *The Image of the City* (1960)**:
 *
 * - **Districts** — nguoi ta nhan ra mot khu nho "thematic continuity": cung chat nen,
 *   cung kieu vat, cung mau. Nen moi vanh mot bang trong so rieng: long thanh nhieu da
 *   lat, cong nghiep nhieu da soi, nong nghiep nhieu ruong.
 * - **Edges** — ranh gioi **khong can la tuong chan**, chi can *lien tuc va nhin thay
 *   duoc*. Vien o day day dung MOT o, va **duong duoc di xuyen qua** ("unity seam"), nen
 *   nguoi vac hang khong bi chan.
 *
 * Chu du an chot 10/09: vien la "nen rieng + hang rao cay thap", khong phai tuong thanh -
 * tuong thanh se doi ca cach tim duong cua nguoi vac hang.
 */
import type { Rng } from '../../core/Rng.ts';
import type { OVat } from './BanDo.ts';
import type { QuyHoach, Vanh } from './QuyHoach.ts';
import { laVien, vanhCuaO } from './QuyHoach.ts';

/** Cu bao nhieu o vien thi dat mot vat danh dau. Thua thi rac, thieu thi khong thay vien. */
const VIEN_CU = 3;

/** Cau hinh nen chung: duong va nga tu. */
export interface NenChung {
  readonly duong: string;
  readonly ngaTu: string;
}

/**
 * Sinh mang o nen cho ca ban do.
 *
 * Van boc so NGAY CA khi o la duong, de day so cua rng khong doi theo bo cuc duong -
 * doi thi ca ban do nhay mot cai chi vi them mot con duong.
 */
export function sinhNen(qh: QuyHoach, rng: Rng, chung: NenChung): string[] {
  const canh: number = qh.canh;
  const nen: string[] = new Array<string>(canh * canh);
  // Bang trong so cua tung vanh, dung lai cho khoi dung 9.216 lan.
  const bang = new Map<Vanh, { gia: string; trong: number }[]>();
  for (const v of qh.vanh) bang.set(v, v.nen.map((n) => ({ gia: n.ten, trong: n.trong })));

  for (let a = 0; a < canh; a += 1) {
    for (let b = 0; b < canh; b += 1) {
      const v: Vanh = vanhCuaO(qh, a, b);
      const thuong: string = rng.theoTrongSo(bang.get(v) as { gia: string; trong: number }[]);
      const doc: boolean = a % qh.duongCach === 0;
      const ngang: boolean = b % qh.duongCach === 0;
      // Duong DE LEN vien: Lynch goi vien la "unity seam", noi lien chu khong ngan cach.
      const o: string = doc && ngang
        ? chung.ngaTu
        : (doc || ngang ? chung.duong : (laVien(qh, a, b) ? v.vienNen : thuong));
      nen[a * canh + b] = o;
    }
  }
  return nen;
}

/**
 * Rai vat danh dau doc duong vien.
 *
 * Quet ca ban do mot luot chu khong di theo duong vien: vien la mot vong vuong quanh tam
 * nen quet thang la ra dung no, khoi phai tinh hinh hoc.
 */
export function vatVien(qh: QuyHoach, rng: Rng, daChiem: Set<number>): OVat[] {
  const ra: OVat[] = [];
  let dem = 0;
  for (let a = 1; a < qh.canh - 1; a += 1) {
    for (let b = 1; b < qh.canh - 1; b += 1) {
      if (!laVien(qh, a, b)) continue;
      if (a % qh.duongCach === 0 || b % qh.duongCach === 0) continue;
      dem += 1;
      if (dem % VIEN_CU !== 0) continue;
      if (daChiem.has(a * qh.canh + b)) continue;
      const ds: readonly string[] = vanhCuaO(qh, a, b).vienVat;
      if (ds.length === 0) continue;
      daChiem.add(a * qh.canh + b);
      ra.push({ a, b, ten: ds[rng.nguyen(ds.length)] as string, o: 1 });
    }
  }
  return ra;
}
