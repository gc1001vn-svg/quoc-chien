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
  /** Doi `baseColorFactor` tu tuyen tinh sang sRGB. */
  readonly gamma?: boolean;
  /** Chi giu phan thit bam vao nhung xuong nay. */
  readonly xuong?: string[] | null;
  /** Dat tu the theo clip `ten` trong file `duong`, tai `phan` (0..1) do dai clip. */
  readonly hoatAnh?: { readonly duong: string; readonly ten: string; readonly phan: number };
  /** Model phu gan vao xuong, doc de quy voi `tuyChon` rieng. */
  readonly gan?: readonly {
    readonly xuong: string;
    readonly duong: string;
    readonly tuyChon?: TuyChonGltf;
    /** Chi lay vi tri xuong, bo xoay - model phu dung thang. */
    readonly chiViTri?: boolean;
    /** Dich them (toa do the gioi) sau khi dat vao xuong. */
    readonly dich?: readonly number[];
  }[];
}

export function docGltf(duong: string, tuyChon?: TuyChonGltf): KetQuaGltf;
