/** Khai bao kieu cho `obj.mjs`, de bai test bang TypeScript goi thang duoc bo doc. */

export interface KetQuaObj {
  /** Dinh phang [x,y,z, u,v, nx,ny,nz, r,g,b, anh] * 3 dinh moi tam giac. */
  readonly dinh: Float32Array;
  readonly min: number[];
  readonly max: number[];
  readonly soTamGiac: number;
}

/**
 * Mau nhan theo COT cua bang mau `colormap.png`.
 *
 * Can the nay vi ca goi City Kit cua Kenney chi co DUNG MOT material ten `colormap`, nen
 * mau theo ten material khong tach duoc tuong voi mai. Cho ngoi trong bang mau moi la
 * cai phan biet that su.
 */
export interface SonCot {
  /** So cot cua bang mau. Mac dinh 16 - Kenney chia vay. */
  readonly so?: number;
  /**
   * Chi so cot -> mau. Mang ba so thi NHAN vao mau san co; `{ thay }` thi THAY han va bo
   * luon anh cua cot do - duong duy nhat doi duoc SAC, vi mau nhan khong keo noi mai
   * xanh la sang mau do.
   */
  readonly mau: Record<string, number[] | { readonly thay: number[] }>;
}

/** So o mot dinh chiem trong mang dinh phang. */
export const BUOC: number;

export function docObj(
  duong: string,
  sonVl?: Record<string, number[]>,
  gamma?: boolean,
  traAnh?: ((tenAnh: string) => number) | null,
  sonCot?: SonCot | null,
  /** Chi lay mat cua nhom `g <ten>` nay. `null` la lay het ca file. */
  nhom?: string | null,
): KetQuaObj;
