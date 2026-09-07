/** Khai bao kieu cho `gltf.mjs`, de bai test bang TypeScript goi thang duoc bo doc. */

export interface KetQuaGltf {
  /** Dinh phang [x,y,z, u,v, nx,ny,nz, r,g,b, anh] * 3 dinh moi tam giac. */
  readonly dinh: Float32Array;
  readonly min: number[];
  readonly max: number[];
  readonly soTamGiac: number;
}

export interface TuyChonGltf {
  /** Ten xuong -> ba goc xoay (do) cong them vao tu the goc. */
  readonly dang?: Record<string, number[]>;
  /** Doi trai/phai cua bang dang. */
  readonly guong?: boolean;
  /** Ten file anh -> chi so anh toan cuc, hay -1 neu khong tim ra. */
  readonly traAnh?: ((tenAnh: string) => number) | null;
  /** Ten material -> mau nhan rieng. */
  readonly mau_vl?: Record<string, number[]>;
  /** Chi giu phan thit bam vao nhung xuong nay. */
  readonly xuong?: string[] | null;
}

export function docGltf(duong: string, tuyChon?: TuyChonGltf): KetQuaGltf;
