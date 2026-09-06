/**
 * Sinh mot ban do trung bay 64x64 tu `data/thanh_pho_demo.json`.
 *
 * TAM THOI. Phase 3 se co `src/sim/` sinh ra thanh pho that; file nay chi de Phase 2 co
 * cai ma ve va co cai ma do fps. Nhung no da tuan hai luat: MOI so nam trong JSON
 * (CLAUDE.md luat 2), va no la TypeScript thuan nen test duoc bang so, khong can trinh duyet.
 *
 * Cung mot hat giong thi ra dung mot ban do - TECH_SPEC muc 8 bat buoc.
 */
import { Rng } from '../core/Rng';
import { sau } from './IsoMath';

/** Mot vat the dat tren luoi. */
export interface OVat {
  readonly a: number;
  readonly b: number;
  readonly ten: string;
}

/** Ban do da sinh xong. */
export interface BanDo {
  readonly canh: number;
  /** Ten sprite cua tung o nen, tra theo `a * canh + b`. */
  readonly nen: readonly string[];
  /** Vat the, DA XEP theo truc sau - ve theo dung thu tu nay la dung. */
  readonly vat: readonly OVat[];
}

/** Khuon cua `data/thanh_pho_demo.json`. */
export interface CauHinhBanDo {
  readonly canh: number;
  readonly hatGiong: number;
  readonly duongCach: number;
  readonly nen: {
    readonly duong: string;
    readonly ngaTu: string;
    readonly thuong: readonly { readonly ten: string; readonly trong: number }[];
  };
  readonly leDuong: number;
  /** `bam` la so o toi da cach duong. Khong khai thi rai tu do khap ban do. */
  readonly vat: readonly { readonly ten: string; readonly so: number; readonly bam?: number }[];
  readonly zoomMin: number;
  readonly zoomMax: number;
  readonly zoomDau: number;
  readonly tranSprite: number;
}

/** So lan boc o that bai lien tiep thi bo mot vat the. Chan vong lap vo tan khi ban do chat. */
const BOC_TOI_DA = 60;

/** Sinh ban do tu cau hinh. Cung cau hinh -> cung ban do. */
export function sinhBanDo(ch: CauHinhBanDo): BanDo {
  const canh: number = ch.canh;
  const rng: Rng = new Rng(ch.hatGiong);
  const nen: string[] = new Array<string>(canh * canh);
  const trongSo = ch.nen.thuong.map((t) => ({ gia: t.ten, trong: t.trong }));

  for (let a = 0; a < canh; a += 1) {
    for (let b = 0; b < canh; b += 1) {
      const doc: boolean = a % ch.duongCach === 0;
      const ngang: boolean = b % ch.duongCach === 0;
      // Boc so NGAY CA khi o la duong, de day so cua rng khong doi theo bo cuc duong.
      const thuong: string = rng.theoTrongSo(trongSo);
      nen[a * canh + b] = doc && ngang ? ch.nen.ngaTu : (doc || ngang ? ch.nen.duong : thuong);
    }
  }

  const vat: OVat[] = [];
  const daChiem: Set<number> = new Set<number>();
  for (const loai of ch.vat) {
    for (let i = 0; i < loai.so; i += 1) {
      const o: number | null = bocODat(rng, ch, daChiem, loai.bam);
      if (o === null) continue;
      daChiem.add(o);
      vat.push({ a: Math.floor(o / canh), b: o % canh, ten: loai.ten });
    }
  }
  vat.sort((m, n) => sau(m.a, m.b) - sau(n.a, n.b));

  return { canh, nen, vat };
}

/**
 * Boc mot o dat duoc vat the: khong phai duong, chua ai chiem, va cach mep du xa.
 *
 * @param bam Neu co, o phai cach duong khong qua ngan nay. Nha bam duong moi ra thanh pho;
 *   rai deu khap ban do thi ra mot canh rung co nha moc rai rac.
 * @returns Chi so o `a * canh + b`, hay `null` neu boc mai khong ra.
 */
function bocODat(
  rng: Rng, ch: CauHinhBanDo, daChiem: ReadonlySet<number>, bam?: number,
): number | null {
  const canh: number = ch.canh;
  const le: number = ch.leDuong;
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a: number = rng.nguyen(canh);
    const b: number = rng.nguyen(canh);
    if (a % ch.duongCach === 0 || b % ch.duongCach === 0) continue;
    // Chua mep ban do: vat the neo o chan nen phan tren cua no tran ra ngoai luoi.
    if (a < le || b < le || a >= canh - le || b >= canh - le) continue;
    if (bam !== undefined && xaDuong(a, b, ch.duongCach) > bam) continue;
    const o: number = a * canh + b;
    if (daChiem.has(o)) continue;
    return o;
  }
  return null;
}

/** Cach con duong gan nhat bao nhieu o. Duong nam o moi hang/cot chia het cho `cach`. */
function xaDuong(a: number, b: number, cach: number): number {
  const da: number = Math.min(a % cach, cach - (a % cach));
  const db: number = Math.min(b % cach, cach - (b % cach));
  return Math.min(da, db);
}
