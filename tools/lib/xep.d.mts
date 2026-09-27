/** Khai bao kieu cho `xep.mjs`, de bai test bang TypeScript goi thang duoc thuat xep. */

export interface OXep {
  readonly ten: string;
  readonly trang: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export function xep(
  o: { ten: string; w: number; h: number }[],
  canh: number,
  le?: number,
): { o: OXep[]; soTrang: number; lapDay: number[] };
