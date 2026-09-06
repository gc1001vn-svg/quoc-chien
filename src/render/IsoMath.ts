/**
 * Doi qua lai giua LUOI O va TOA DO MAN HINH, phoi canh cheo 2:1.
 *
 * Cong thuc chot o TECH_SPEC muc 3, da chay thu that o `tools/xem_canh.mjs` cuoi Phase 1:
 *
 *     x = (a - b) * o_px/2 - ox
 *     y = (a + b) * o_px/4 - oy
 *
 * `a` va `b` la hai truc cua luoi. `ox`/`oy` la diem neo cua sprite - viec cua ben goi,
 * o day chi tinh toa do NEO cua o, chua tru neo.
 *
 * Truc sau la `a + b`: o nao co tong nho hon thi o phia xa, ve truoc. Trong cung mot
 * duong cheo (`a + b` bang nhau) cac o nam canh nhau, khong de len nhau, nen ve theo
 * thu tu nao cung duoc.
 *
 * File nay la TypeScript thuan, khong dung gi cua trinh duyet - de test duoc bang so.
 */

/** Khung nhin, tinh bang diem anh cua the gioi (chua nhan zoom, chua tru camera). */
export interface Khung {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

/** Khoang o con co the nhin thay. Bao ngoai vung that, ben goi con phai loai tung o. */
export interface VungO {
  readonly aMin: number;
  readonly aMax: number;
  readonly bMin: number;
  readonly bMax: number;
}

/** Sprite tran ra bao xa khoi diem neo, ve bon phia. Giong `BienDo` cua `Atlas`. */
export interface NoiKhung {
  readonly trai: number;
  readonly tren: number;
  readonly phai: number;
  readonly duoi: number;
}

/** Toa do ngang cua diem neo o `(a, b)`. */
export function neoX(a: number, b: number, oPx: number): number {
  return (a - b) * (oPx / 2);
}

/** Toa do doc cua diem neo o `(a, b)`. */
export function neoY(a: number, b: number, oPx: number): number {
  return (a + b) * (oPx / 4);
}

/** Truc sau: nho hon la o phia xa, ve truoc. */
export function sau(a: number, b: number): number {
  return a + b;
}

/**
 * Nguoc lai cua {@link neoX} / {@link neoY}: diem tren the gioi roi vao o nao.
 *
 * Tra ve so thuc, chua lam tron - ben goi tu quyet dinh lam tron kieu gi.
 */
export function oTaiDiem(x: number, y: number, oPx: number): { a: number; b: number } {
  const u: number = (2 * x) / oPx;
  const v: number = (4 * y) / oPx;
  return { a: (u + v) / 2, b: (v - u) / 2 };
}

/**
 * Khoang o co the nhin thay trong `khung`.
 *
 * Vung nhin that trong luoi `(a, b)` la mot hinh binh hanh, khong phai hinh chu nhat,
 * nen ham nay tra ve HOP BAO cua no - rong hon vung that khoang gap doi. Ben goi PHAI
 * loai tiep tung o bang hop bao cua sprite, neu khong se ve thua va vuot tran 1.500
 * sprite cua TECH_SPEC muc 2.
 *
 * Khung duoc noi ra theo `noi` truoc khi tinh: nha cao neo o duoi chan nen diem neo cua
 * no co the nam ngoai man ma phan mai van nhin thay. Noi bang bien do that cua atlas,
 * khong doan le.
 *
 * @param canh Canh ban do, tinh bang o. Ket qua bi cat ve trong `[0, canh - 1]`.
 */
export function vungONhinThay(
  khung: Khung, oPx: number, canh: number, noi: NoiKhung,
): VungO {
  const x0: number = khung.x0 - noi.phai;
  const x1: number = khung.x1 + noi.trai;
  const y0: number = khung.y0 - noi.duoi;
  const y1: number = khung.y1 + noi.tren;

  // `a` tang theo ca x lan y; `b` giam theo x, tang theo y. Nen bon dinh la du.
  const gocA = oTaiDiem(x0, y0, oPx).a;
  const ngonA = oTaiDiem(x1, y1, oPx).a;
  const gocB = oTaiDiem(x1, y0, oPx).b;
  const ngonB = oTaiDiem(x0, y1, oPx).b;

  const cat = (v: number): number => Math.min(Math.max(v, 0), canh - 1);
  return {
    aMin: cat(Math.floor(gocA)),
    aMax: cat(Math.ceil(ngonA)),
    bMin: cat(Math.floor(gocB)),
    bMax: cat(Math.ceil(ngonB)),
  };
}
