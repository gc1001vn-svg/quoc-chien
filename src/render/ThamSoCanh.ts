/** Tham so URL cua canh thanh pho (tach khoi `CityScene.ts` cho file duoi tran 300 dong). */
import type { O } from '../sim/city/BanDo';

/**
 * O dat camera luc mo man, lay tu `?o=a,b`. `undefined` thi de camera o giua ban do.
 *
 * Co tham so nay de may ao chup duoc DUNG cho mot toa nha va kiem xem no co that su hien
 * ra khong - truoc do chi doan bang mat tren anh toan canh.
 */
export function oBanDau(): O | undefined {
  const tho: string | null = new URLSearchParams(window.location.search).get('o');
  if (tho === null) return undefined;
  const [a, b] = tho.split(',').map(Number);
  if (a === undefined || b === undefined || !Number.isFinite(a) || !Number.isFinite(b)) {
    return undefined;
  }
  return { a, b };
}
