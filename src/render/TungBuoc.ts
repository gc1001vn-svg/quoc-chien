/**
 * Tien do xay mot cong trinh (Buoc 1 "xay nha tung buoc", 04/10). TypeScript thuan, khong GL,
 * khong trinh duyet - test duoc bang so (`tests/TungBuoc.test.ts`, luat TP16).
 *
 * Tinh bang NHIP mo phong chu khong bang giay that: chi phu thuoc `soNhip - nhipXay`, nen dung
 * hinh thi nha dung moc, tua 500x thi xong ngay, cung mot nhip thi cung mot hinh. Moi so doc tu
 * `data/tung_buoc.json`. Ke hoach: `docs/ke-hoach/2026-10-04-buoc-1-xay-nha-tung-buoc.md`.
 */
import soTho from '../../data/tung_buoc.json';

export const SO_XAY = soTho;

/** Bon chang: vach mong · moc tu duoi len + gian giao · loe sang · xong. */
export type GiaiDoan = 'mong' | 'moc' | 'loe' | 'xong';

export interface TienDo {
  readonly giaiDoan: GiaiDoan;
  /** Phan cua ca qua trinh, 0..1. */
  readonly t: number;
  /** Phan sprite da moc, tu muc giu day len toi dinh, 0..1. Giai doan mong chua ve sprite. */
  readonly hien: number;
  /** Do chop sang cong vao sprite (shader sprite nhan duoi 0,5). */
  readonly sang: number;
}

export const XONG: TienDo = { giaiDoan: 'xong', t: 1, hien: 1, sang: 0 };

/** Tien do o phan `t` cua qua trinh. Tu 1 tro len la xong. */
export function tienDoTheoPhan(t: number, so: typeof SO_XAY = SO_XAY): TienDo {
  if (!(t < 1)) return XONG;
  const p = Math.max(0, t);
  if (p < so.mong) return { giaiDoan: 'mong', t: p, hien: 0, sang: 0 };
  if (p < so.xongMoc) return { giaiDoan: 'moc', t: p, hien: (p - so.mong) / (so.xongMoc - so.mong), sang: 0 };
  return { giaiDoan: 'loe', t: p, hien: 1, sang: so.sangLoe * (1 - (p - so.xongMoc) / (1 - so.xongMoc)) };
}

/**
 * Tien do cong trinh khoi cong o nhip `nhipXay`, nhin o nhip `soNhip`.
 * Khong co nhip khoi cong la vat co tu dau van - luon xong.
 */
export function tienDoXay(nhipXay: number | undefined, soNhip: number, so: typeof SO_XAY = SO_XAY): TienDo {
  if (nhipXay === undefined) return XONG;
  return tienDoTheoPhan((soNhip - nhipXay) / so.thoiLuongNhip, so);
}

/**
 * Cat sprite dang moc, toa do khung ve: tra ve `[y dinh moi, v dinh moi]`.
 *
 * Tu `yGiu` tro xuong luon hien (mat nen, chan tuong); phan tren moc dan theo `hien`. Cat
 * ngang ca sprite tu day len thi chi thay bong do tren nen dat truoc - ra "cat lat" (Gemini 04/10).
 */
export function catTren(
  hien: number, y0: number, y1: number, yGiu: number, v0: number, v1: number,
): readonly [number, number] {
  const giu = Math.min(y1, Math.max(y0, yGiu));
  const y = giu - Math.min(1, Math.max(0, hien)) * (giu - y0);
  return [y, v0 + ((v1 - v0) * (y - y0)) / (y1 - y0)];
}
