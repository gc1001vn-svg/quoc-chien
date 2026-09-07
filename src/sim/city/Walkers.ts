/**
 * Walker: nguoi vac hang di tren duong.
 *
 * **Khong tim duong day du** (`GAME_SPEC.md` muc 4 - cach cua Caesar III, khong phai cach
 * cua Widelands). Duong la luoi deu: moi hang va moi cot chia het cho `duongCach`. Nen
 * moi buoc chi la mot phep so sanh:
 *
 * - Dang dung tren **cot duong** (`b % c === 0`) thi doi duoc `a`.
 * - Dang dung tren **hang duong** (`a % c === 0`) thi doi duoc `b`.
 * - Khong doi duoc theo huong can di thi buoc ve nga tu gan nhat truoc.
 *
 * Re nhu vay moi ganh noi hang tram nguoi cung luc tren iPhone.
 */
import type { O } from './BanDo.ts';
import { layObject, laySoNguyen } from './DocJson.ts';

/** So cua nguoi vac hang, doc tu `data/walkers.json`. */
export interface CauHinhWalker {
  readonly nhipMoiBuoc: number;
  readonly moiChuyen: number;
  readonly tranRieng: number;
  readonly buocToiDa: number;
  readonly tranWalker: number;
  /** Tran rieng cho nguoi DI LAY. Luon thap hon `tranWalker` de nguoi giao hang co cho. */
  readonly tranLay: number;
  /** Tran rieng cho nguoi DI GIAO hang. */
  readonly tranGiao: number;
  readonly hatGiongDatNha: number;
}

/** Doc `data/walkers.json`. Nem `LoiDuLieu` neu sai. */
export function docWalker(tho: unknown): CauHinhWalker {
  const o = layObject(tho, 'walkers.json');
  const lay = (ten: string): number => laySoNguyen(o[ten], `walkers.json.${ten}`);
  return {
    nhipMoiBuoc: lay('nhipMoiBuoc'),
    moiChuyen: lay('moiChuyen'),
    tranRieng: lay('tranRieng'),
    buocToiDa: lay('buocToiDa'),
    tranWalker: lay('tranWalker'),
    tranLay: lay('tranLay'),
    tranGiao: lay('tranGiao'),
    hatGiongDatNha: lay('hatGiongDatNha'),
  };
}

/** Walker dang lam gi. */
export type Viec = 'giao' | 'lay';

/** Mot nguoi dang tren duong. */
export interface Walker {
  /** Chi so nha phat ra no, tro vao mang nha cua `ThanhPho`. */
  readonly nha: number;
  readonly viec: Viec;
  readonly hang: string;
  /** Cong cua nha da phat - noi phai quay ve. */
  readonly nhaVe: O;
  /** So mon dang vac. Di lay thi bang 0 cho toi luc lay duoc. */
  so: number;
  a: number;
  b: number;
  /** Da toi kho chua. Chua thi dich la kho, roi thi dich la `nhaVe`. */
  daToiKho: boolean;
  /** Da di bao nhieu buoc. Qua tran thi bo cuoc, tra hang ve. */
  buoc: number;
  /** Con bao nhieu nhip nua moi duoc buoc tiep. */
  cho: number;
}

/** So do cua doi walker trong mot gio game. */
export interface SoWalker {
  readonly chuyen: number;
  readonly boCuoc: number;
  readonly dinh: number;
}

/**
 * Mot buoc tren luoi duong, tu (a,b) toi (da,db). Tra ve o ke tiep.
 *
 * Khong bao gio quay dau vo ich: uu tien truc dang di duoc, het truc thi ve nga tu.
 */
export function buocKeTiep(tu: O, toi: O, c: number): O {
  const { a, b } = tu;
  const ganC = (x: number): number => Math.round(x / c) * c;

  // Dich luon nam tren mot con duong: hoac cot (`b % c === 0`), hoac hang (`a % c === 0`).
  // Phai vao dung con duong DO truoc roi moi di doc theo no - di sai truc truoc la ket:
  // toi o (a, 48) voi a khong chia het cho c thi khong con doi duoc `b` nua, va nguoi cu
  // di qua di lai giua do voi nga tu. Da bi dung mot lan.
  if (toi.b % c === 0) {
    if (b === toi.b) return a === toi.a ? tu : { a: a + Math.sign(toi.a - a), b };
    if (a % c === 0) return { a, b: b + Math.sign(toi.b - b) };
    return { a: a + Math.sign(ganC(a) - a), b };
  }

  if (a === toi.a) return b === toi.b ? tu : { a, b: b + Math.sign(toi.b - b) };
  if (b % c === 0) return { a: a + Math.sign(toi.a - a), b };
  return { a, b: b + Math.sign(ganC(b) - b) };
}

/** Doi walker cua ca thanh pho. */
export class DoiWalker {
  private ds: Walker[] = [];
  /** Dem rieng tung viec. Chung mot tran thi ben nay chiem het cho cua ben kia. */
  private soLay = 0;
  private soGiao = 0;
  private demChuyen = 0;
  private demBoCuoc = 0;
  private demDinh = 0;

  private readonly kho: O;
  private readonly duongCach: number;
  private readonly nhipMoiBuoc: number;
  private readonly buocToiDa: number;

  // Gan trong than ham chu khong `constructor(private readonly kho: O)`: Node boc kieu
  // TypeScript khong nuot duoc loi viet tat do (CLAUDE.md luat 1).
  constructor(kho: O, duongCach: number, nhipMoiBuoc: number, buocToiDa: number) {
    this.kho = kho;
    this.duongCach = duongCach;
    this.nhipMoiBuoc = nhipMoiBuoc;
    this.buocToiDa = buocToiDa;
  }

  /** Bao nhieu nguoi dang tren duong ngay luc nay. */
  get so(): number {
    return this.ds.length;
  }

  /** Bao nhieu nguoi dang lam viec nay. */
  soViec(viec: Viec): number {
    return viec === 'lay' ? this.soLay : this.soGiao;
  }

  /** Danh sach de ve. Chi doc. */
  get danhSach(): readonly Walker[] {
    return this.ds;
  }

  /** So cua gio hien tai, va xoa bo dem. */
  chotGio(): SoWalker {
    const ra: SoWalker = { chuyen: this.demChuyen, boCuoc: this.demBoCuoc, dinh: this.demDinh };
    this.demChuyen = 0;
    this.demBoCuoc = 0;
    this.demDinh = this.ds.length;
    return ra;
  }

  /** Phat mot nguoi tu cong `tuCong` cua nha thu `nha`. */
  phat(nha: number, tuCong: O, viec: Viec, hang: string, so: number): void {
    this.ds.push({
      nha, viec, hang, nhaVe: tuCong,
      so: viec === 'giao' ? so : 0,
      a: tuCong.a, b: tuCong.b,
      daToiKho: false, buoc: 0, cho: 0,
    });
    if (viec === 'lay') this.soLay += 1;
    else this.soGiao += 1;
    if (this.ds.length > this.demDinh) this.demDinh = this.ds.length;
  }

  /** Mot nguoi vua xong viec, tra lai cho cho nguoi khac. */
  private xong(w: Walker): void {
    if (w.viec === 'lay') this.soLay -= 1;
    else this.soGiao -= 1;
  }

  /**
   * Chay mot nhip. `oKho` xu ly luc nguoi toi kho, `veNha` luc ve toi nha.
   *
   * Tra ve so nguoi vua ve toi noi - nguoi goi khong can dem lai.
   */
  nhip(oKho: (w: Walker) => void, veNha: (w: Walker) => void): void {
    const con: Walker[] = [];
    for (const w of this.ds) {
      if (w.cho > 0) {
        w.cho -= 1;
        con.push(w);
        continue;
      }
      const dich: O = w.daToiKho ? w.nhaVe : this.kho;
      if (w.a === dich.a && w.b === dich.b) {
        if (w.daToiKho) {
          veNha(w);
          this.xong(w);
          this.demChuyen += 1;
          continue;
        }
        oKho(w);
        w.daToiKho = true;
        con.push(w);
        continue;
      }

      const buoc: O = buocKeTiep(w, dich, this.duongCach);
      if ((buoc.a === w.a && buoc.b === w.b) || w.buoc >= this.buocToiDa) {
        // Ket cung hoac di qua lau: tra hang ve nha ngay, dung de hang bien mat.
        veNha(w);
        this.xong(w);
        this.demBoCuoc += 1;
        continue;
      }
      w.a = buoc.a;
      w.b = buoc.b;
      w.buoc += 1;
      w.cho = this.nhipMoiBuoc - 1;
      con.push(w);
    }
    this.ds = con;
  }
}
