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
  /** Canh khoi o ma vat the chiem, tinh tu (a,b) di ra. 1 la mot o. */
  readonly o: number;
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
  /** Ten me atlas, vi du `trung_co_2`. */
  readonly me: string;
  readonly canh: number;
  readonly hatGiong: number;
  readonly duongCach: number;
  readonly nen: {
    readonly duong: string;
    readonly ngaTu: string;
    readonly thuong: readonly { readonly ten: string; readonly trong: number }[];
  };
  readonly leDuong: number;
  /**
   * `bam` la so o toi da cach duong. Khong khai thi rai tu do khap ban do.
   * `o` la canh khoi o vat the chiem (nha Quaternius rong 2 o). Khong khai thi 1.
   */
  readonly vat: readonly {
    readonly ten: string; readonly so: number; readonly bam?: number; readonly o?: number;
  }[];
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
    const canhKhoi: number = loai.o ?? 1;
    for (let i = 0; i < loai.so; i += 1) {
      const o: number | null = bocODat(rng, ch, daChiem, canhKhoi, loai.bam);
      if (o === null) continue;
      const a: number = Math.floor(o / canh);
      const b: number = o % canh;
      for (let da = 0; da < canhKhoi; da += 1) {
        for (let db = 0; db < canhKhoi; db += 1) daChiem.add((a + da) * canh + (b + db));
      }
      vat.push({ a, b, ten: loai.ten, o: canhKhoi });
    }
  }
  // Xep theo GOC TRUOC cua khoi, khong theo o neo: cong trinh 2x2 phai ve sau moi thu
  // nam sau no, ma o neo cua no lai la o sau nhat trong bon o.
  vat.sort((m, n) => sau(m.a + m.o - 1, m.b + m.o - 1) - sau(n.a + n.o - 1, n.b + n.o - 1));

  return { canh, nen, vat };
}

/**
 * Boc mot o dat duoc vat the: khong phai duong, chua ai chiem, va cach mep du xa.
 *
 * @param canhKhoi Canh khoi o vat the chiem. CA khoi phai trong va khong cham duong.
 * @param bam Neu co, o phai cach duong khong qua ngan nay. Nha bam duong moi ra thanh pho;
 *   rai deu khap ban do thi ra mot canh rung co nha moc rai rac.
 * @returns Chi so o neo `a * canh + b`, hay `null` neu boc mai khong ra.
 */
function bocODat(
  rng: Rng, ch: CauHinhBanDo, daChiem: ReadonlySet<number>, canhKhoi: number, bam?: number,
): number | null {
  const canh: number = ch.canh;
  const le: number = ch.leDuong;
  for (let lan = 0; lan < BOC_TOI_DA; lan += 1) {
    const a: number = rng.nguyen(canh);
    const b: number = rng.nguyen(canh);
    // Chua mep ban do: vat the neo o chan nen phan tren cua no tran ra ngoai luoi.
    if (a < le || b < le || a + canhKhoi > canh - le || b + canhKhoi > canh - le) continue;
    if (bam !== undefined && xaDuong(a, b, ch.duongCach) > bam) continue;
    if (!khoiTrong(a, b, canhKhoi, ch, daChiem)) continue;
    return a * canh + b;
  }
  return null;
}

/** Ca khoi `canhKhoi x canhKhoi` neo o (a,b) deu trong, va khong o nao dam vao duong. */
function khoiTrong(
  a: number, b: number, canhKhoi: number, ch: CauHinhBanDo, daChiem: ReadonlySet<number>,
): boolean {
  for (let da = 0; da < canhKhoi; da += 1) {
    for (let db = 0; db < canhKhoi; db += 1) {
      if ((a + da) % ch.duongCach === 0 || (b + db) % ch.duongCach === 0) return false;
      if (daChiem.has((a + da) * ch.canh + (b + db))) return false;
    }
  }
  return true;
}

/** Cach con duong gan nhat bao nhieu o. Duong nam o moi hang/cot chia het cho `cach`. */
function xaDuong(a: number, b: number, cach: number): number {
  const da: number = Math.min(a % cach, cach - (a % cach));
  const db: number = Math.min(b % cach, cach - (b % cach));
  return Math.min(da, db);
}
