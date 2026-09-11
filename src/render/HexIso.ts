/**
 * Doi qua lai giua LUOI LUC GIAC cua lop chien dich va toa do man hinh.
 *
 * Hex cua goi KayKit rong 2 don vi model theo truc X va 2,309 theo truc Z - tuc la
 * POINTY-TOP theo Z, ban kinh `R = 2/sqrt(3) = 1,1547`. May nuong chieu truc X va Z cua
 * model thang vao hai truc `a`/`b` cua `IsoMath` (yaw 45 do, pitch 30 do, `ppu = o_px/
 * sqrt(2)` - khai trien ra dung `neoX`/`neoY`), nen o day chi can doi `(q, r)` sang toa do
 * the gioi roi goi thang `IsoMath`.
 *
 *     x = 2 * (q + r/2)          buoc ngang 2 o, moi hang lech nua buoc
 *     z = sqrt(3) * r            buoc doc 1,5 * R = sqrt(3)
 *
 * File nay la TypeScript thuan, khong dung gi cua trinh duyet - de test duoc bang so.
 */
import { neoX, neoY } from './IsoMath';
import type { OHex } from '../sim/campaign/Hex';

/** Be ngang mot hex, tinh bang o luoi. */
export const BUOC_NGANG = 2;
/** Khoang cach giua hai hang hex, tinh bang o luoi. */
export const BUOC_DOC = Math.sqrt(3);

/** Toa do the gioi cua tam mot hex, tinh bang o luoi. */
export function theGioi(o: OHex): { x: number; z: number } {
  return { x: BUOC_NGANG * (o.q + o.r / 2), z: BUOC_DOC * o.r };
}

/** Toa do ngang cua tam hex tren man hinh (chua tru camera, chua nhan zoom). */
export function hexX(o: OHex, oPx: number): number {
  const w = theGioi(o);
  return neoX(w.x, w.z, oPx);
}

/** Toa do doc cua tam hex tren man hinh. */
export function hexY(o: OHex, oPx: number): number {
  const w = theGioi(o);
  return neoY(w.x, w.z, oPx);
}

/**
 * Khoa sap xep theo truc sau: o nao nho hon thi o phia xa, phai ve TRUOC.
 *
 * Truc sau cua phoi canh 2:1 la `x + z`. Hai hex cung mot gia tri thi nam canh nhau,
 * khong de len nhau, nen ve theo thu tu nao cung duoc.
 */
export function truocSau(o: OHex): number {
  const w = theGioi(o);
  return w.x + w.z;
}

/**
 * Toa do man hinh -> hex gan nhat. Dung khi nguoi choi cham vao ban do.
 *
 * Dao nguoc hai cong thuc cua `IsoMath` roi lam tron bang toa do khoi: lam tron ca ba
 * truc `q`, `r`, `s = -q-r`, roi sua lai truc lech nhieu nhat. Lam tron rieng tung truc
 * se tra ve o khong ton tai o mep giua hai hex.
 */
export function hexTaiDiem(sx: number, sy: number, oPx: number): OHex {
  const x: number = sx / oPx + (2 * sy) / oPx;
  const z: number = -sx / oPx + (2 * sy) / oPx;
  const r: number = z / BUOC_DOC;
  const q: number = x / BUOC_NGANG - r / 2;
  return lamTron(q, r);
}

/** Lam tron toa do hex thuc ve o nguyen gan nhat, qua toa do khoi ba truc. */
function lamTron(q: number, r: number): OHex {
  const s: number = -q - r;
  let rq: number = Math.round(q);
  let rr: number = Math.round(r);
  const rs: number = Math.round(s);
  const dq: number = Math.abs(rq - q);
  const dr: number = Math.abs(rr - r);
  const ds: number = Math.abs(rs - s);
  // Ba truc phai cong lai bang 0; sua lai truc lech nhieu nhat de giu rang buoc do.
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  // `Math.round(-0.2)` tra ve `-0`, ma `-0` khong bang `0` khi so sanh sau (`Object.is`,
  // `toEqual` cua vitest, va khoa `Map` neu ai do doi sang dung so). Chuan ve `0`.
  return { q: khongAmKhong(rq), r: khongAmKhong(rr) };
}

/** Doi `-0` thanh `0`; moi so khac giu nguyen. */
function khongAmKhong(v: number): number {
  return v === 0 ? 0 : v;
}
