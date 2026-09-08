/**
 * Nhat ky su kien: mot dong thoi gian duy nhat cho ca thanh pho.
 *
 * Thong doc xay gi, the nao da hoi, nguoi choi chon gi, va hau qua co lam duoc that
 * khong - tat ca vao mot cho. Khong co no thi nguoi choi bam mot nut roi khong biet
 * chuyen gi vua xay ra, va bang so gio sau khong noi len duoc dieu do.
 */

/** Loai su kien - de ben ve to mau khac nhau, khong de sim dung vao. */
export type LoaiSuKien = 'the' | 'chon' | 'thong_doc' | 'hong';

/** Mot dong nhat ky. */
export interface SuKien {
  readonly gio: number;
  readonly loai: LoaiSuKien;
  readonly van: string;
}

/**
 * Nhat ky giu `tran` dong gan nhat.
 *
 * Co tran vi van dai hang tram gio game: giu het thi mang phinh mai, ma nguoi choi cung
 * chi doc vai dong cuoi.
 */
export class NhatKy {
  private readonly ds: SuKien[] = [];
  private readonly tran: number;

  constructor(tran = 200) {
    this.tran = tran;
  }

  /** Toan bo dong dang giu, cu nhat o dau. */
  get danhSach(): readonly SuKien[] {
    return this.ds;
  }

  /** `so` dong moi nhat, moi nhat o dau - dung de ve len goc man. */
  moiNhat(so: number): SuKien[] {
    return this.ds.slice(-so).reverse();
  }

  ghi(gio: number, loai: LoaiSuKien, van: string): void {
    this.ds.push({ gio, loai, van });
    if (this.ds.length > this.tran) this.ds.shift();
  }
}
