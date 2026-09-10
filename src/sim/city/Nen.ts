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
import { laVien, vanhCuaO, xaTam } from './QuyHoach.ts';
import type { O } from './BanDo.ts';

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

/**
 * Cac CUA THANH: cho truc duong chinh cat qua duong vien.
 *
 * Kho hang dat o day. Ly do lay tu chinh cach thanh tran trung co hoat dong: cho va nha
 * can nam ngay cua thanh, tren con duong chinh, dung cho hang doi vanh - nong san tu ngoai
 * dong vao, do nghe tu trong pho ra.
 *
 * Truoc do `choKhoMoi` chi lay "nga tu xa cac kho cu nhat", va tren mot ban do vuong thi
 * cho xa nhat luon la BON GOC. Ban ve quy hoach 10/09 cho thay ba kho nam ba goc, con nua
 * phia nam va phia dong khong co kho nao. Chu du an nhin ra ngay.
 *
 * Tra ve danh sach da xep tu vanh trong ra vanh ngoai, moi vanh bon huong.
 */
export function cuaThanh(qh: QuyHoach): O[] {
  const c: number = qh.duongCach;
  const giua: number = Math.round((qh.canh - 1) / 2 / c) * c;
  const cuoi: number = (qh.vanh[qh.vanh.length - 1] as Vanh).den;
  const ra: O[] = [];
  const daCo = new Set<number>();
  // Vanh sap theo `den` tang dan, de kho moc dan tu trong ra ngoai.
  const trong: number[] = qh.vanh.filter((v) => v.den < cuoi).map((v) => v.den)
    .sort((m, n) => m - n);
  for (const r of trong) {
    // Nga tu gan nhat tren truc, ca bon huong.
    const buoc: number = Math.max(c, Math.round(r / c) * c);
    for (const [da, db] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const a: number = giua + (da as number) * buoc;
      const b: number = giua + (db as number) * buoc;
      if (a < c || b < c || a > qh.canh - 1 - c || b > qh.canh - 1 - c) continue;
      const k: number = a * qh.canh + b;
      if (daCo.has(k)) continue;
      daCo.add(k);
      ra.push({ a, b });
    }
  }
  return ra;
}

/** O nay cach duong vien gan nhat bao nhieu o. */
export function xaVien(qh: QuyHoach, a: number, b: number): number {
  const d: number = xaTam(qh, a, b);
  const cuoi: number = (qh.vanh[qh.vanh.length - 1] as Vanh).den;
  let gan = Infinity;
  for (const v of qh.vanh) {
    if (v.den >= cuoi) continue;
    gan = Math.min(gan, Math.abs(d - v.den));
  }
  return gan;
}

/**
 * Rai vat THAP vao RUOT khoi pho, cho ban do khoi trong hoac.
 *
 * Ngay 10/09 bo 157 nha trang tri vi chung cao 7-9 hang o va che mat gieng, mo. Thanh pho
 * do ra trong hoac. Bu lai bang vat thap - bui, da, hang rao, thung - deu duoi 2 hang o
 * nen khong che duoc gi.
 *
 * CHI DAT VAO RUOT KHOI PHO, tuc nhung o KHONG sat duong. Do dung la nhung o ma `datNha`
 * khong bao gio dung toi (nha phai bam duong de nguoi vac hang di toi), nen lap bao nhieu
 * cung khong tranh cho voi cong trinh - khong lo tai canh "vanh chat, khong dat noi nha".
 *
 * Moi vanh mot bo vat rieng: long thanh co ghe va hoa, cong nghiep co da va thung, nong
 * nghiep co co cao va hang rao. Day van la "thematic continuity" cua Lynch - nhin chat vat
 * la doan ra dang o khu nao.
 */
export function vatLap(qh: QuyHoach, rng: Rng, daChiem: Set<number>): OVat[] {
  const c: number = qh.duongCach;
  const ra: OVat[] = [];
  for (const v of qh.vanh) {
    if (v.vatRuot.length === 0 || v.soLap === 0) continue;
    let dat = 0;
    // Tran boc de khong quay vo tan khi vanh da day.
    for (let lan = 0; lan < v.soLap * 40 && dat < v.soLap; lan += 1) {
      const a: number = rng.nguyen(qh.canh);
      const b: number = rng.nguyen(qh.canh);
      if (a < 1 || b < 1 || a >= qh.canh - 1 || b >= qh.canh - 1) continue;
      if (vanhCuaO(qh, a, b) !== v) continue;
      if (a % c === 0 || b % c === 0) continue;
      // Chi ruot khoi pho: bo moi o sat duong, de danh cho cong trinh.
      if (a % c === 1 || b % c === 1 || a % c === c - 1 || b % c === c - 1) continue;
      if (laVien(qh, a, b)) continue;
      if (daChiem.has(a * qh.canh + b)) continue;
      daChiem.add(a * qh.canh + b);
      ra.push({ a, b, ten: v.vatRuot[rng.nguyen(v.vatRuot.length)] as string, o: 1 });
      dat += 1;
    }
  }
  return ra;
}
