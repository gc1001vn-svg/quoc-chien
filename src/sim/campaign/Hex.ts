/**
 * Toan luoi luc giac cua lop chien dich.
 *
 * Dung toa do AXIAL `(q, r)`: hai truc du ta het mat phang, khong can truc thu ba.
 * Hex cua goi KayKit la POINTY-TOP theo truc Z cua model - dinh nhon huong ±Z, hai canh
 * phang o ±X. Vi vay hang chay theo `q`, va moi lan tang `r` thi lech NUA buoc ngang.
 *
 * File nay la TypeScript thuan, khong dung gi cua trinh duyet - phan doi sang toa do
 * man hinh nam o `src/render/HexIso.ts`, ben nay chi biet so.
 */

/** Mot o luc giac tren luoi. */
export interface OHex {
  readonly q: number;
  readonly r: number;
}

/**
 * Sau huong di tu mot o, theo chieu kim dong ho tu huong dong.
 *
 * Thu tu nay la thu tu VANH: `vanh()` tra ve dung sau o theo day nay, nen chi so o trong
 * vanh la on dinh giua cac lan chay - `data/provinces.json` tro vao chi so do.
 */
export const HUONG: readonly OHex[] = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
];

/** O ben canh `o` theo huong thu `i` (0-5). */
export function hangXom(o: OHex, i: number): OHex {
  const h: OHex = HUONG[i % HUONG.length] as OHex;
  return { q: o.q + h.q, r: o.r + h.r };
}

/** Sau o vay quanh `tam`, theo dung thu tu cua `HUONG`. */
export function vanh(tam: OHex): OHex[] {
  return HUONG.map((h: OHex): OHex => ({ q: tam.q + h.q, r: tam.r + h.r }));
}

/** Mot tinh = o thu phu o giua + vanh 6 o. Tra ve 7 o, o dau tien la thu phu. */
export function cumBay(tam: OHex): OHex[] {
  return [tam, ...vanh(tam)];
}

/** Khoang cach tinh bang so buoc hex. */
export function khoangCach(a: OHex, b: OHex): number {
  const dq: number = a.q - b.q;
  const dr: number = a.r - b.r;
  // Truc thu ba `s = -q - r`; khoang cach hex la nua tong tri tuyet doi cua ba truc.
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Khoa dung lam key cua `Map`/`Set` - hai o trung nhau thi cung mot chuoi. */
export function khoa(o: OHex): string {
  return `${String(o.q)},${String(o.r)}`;
}

/**
 * Tam cua cum 7 hex thu `(m, n)` trong luoi con.
 *
 * Luoi con sinh boi hai vecto `(3, -1)` va `(1, 2)`. Dinh thuc cua chung bang
 * `3*2 - (-1)*1 = 7`, dung bang so o mot cum - nen cac cum 7 hex lat KHIT mat phang,
 * khong ho khong chong. Day la ly do mot tinh co dung 7 o chu khong phai con so tuy y.
 */
export function tamCum(m: number, n: number): OHex {
  return { q: 3 * m + n, r: -m + 2 * n };
}
