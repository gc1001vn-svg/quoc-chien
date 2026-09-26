/**
 * Quan cua mot nuoc tren ban do chien dich: mua doi, do suc, danh chiem mot tinh.
 *
 * Tran dung that bang `tinhTran()` cua Phase 9 - khong co cong thuc thu hai de troi khac.
 * Moi ben dua toi da `doiMoiTran` doi; ben nao chet bao nhieu phan linh thi mat bay nhieu
 * phan doi da dua vao tran.
 *
 * TypeScript thuan (luat 1). Khong con so can bang nao o day (luat 2).
 */
import { duDoan, tinhTran, type DuLieuTran, type KetQuaTran, type LoaiDoi } from './Battle.ts';

/**
 * Cac loai doi mua duoc o thoi dai `doi`: nhom cua loai doi moi nhat da mo. Qua thoi
 * dai sung thi khong mua giao nua - doi cu van giu trong quan cho toi khi chet.
 */
export function doiMuaDuoc(duLieu: DuLieuTran, doi: number): readonly LoaiDoi[] {
  let moiNhat: LoaiDoi | undefined;
  for (const l of duLieu.doi.values()) {
    if (l.doi <= doi && (moiNhat === undefined || l.doi > moiNhat.doi)) moiNhat = l;
  }
  if (moiNhat === undefined) return [];
  const nhom: string = moiNhat.nhom;
  return [...duLieu.doi.values()].filter((l) => l.nhom === nhom && l.doi <= doi);
}

/** Suc quan tho: tong linh x mau x sat thuong. Dung de so manh yeu, khong de chay tran. */
export function sucQuan(quan: readonly string[], duLieu: DuLieuTran): number {
  let s = 0;
  for (const id of quan) s += sucDoi(id, duLieu);
  return s;
}

/** Ket qua mot lan mua quan. */
export interface KetQuaMua {
  readonly quan: string[];
  readonly vangCon: number;
  /** Bo dem xoay vong - lan sau mua tiep tu loai ke, cho quan hon hop. */
  readonly dem: number;
}

/** Suc mot doi - thu tu xep quan. */
function sucDoi(id: string, duLieu: DuLieuTran): number {
  const l: LoaiDoi | undefined = duLieu.doi.get(id);
  return l === undefined ? 0 : l.linh * l.mau * l.satThuong;
}

/**
 * Mua doi bang `nganSach` vang, xoay vong qua cac loai mua duoc, toi da `toiDa` doi.
 * Quan tra ve LUON xep manh truoc: ra tran lay dau danh sach, mat doi cung cat tu dau.
 * Day tran thi giai ngu doi yeu nhat de mua doi moi manh hon - khong thi len thoi sung
 * van om giao thu tu thoi co. Tra ve quan moi va so vang CHUA TIEU cua ngan sach.
 */
export function muaQuan(
  quan: readonly string[], nganSach: number, dsMua: readonly LoaiDoi[], toiDa: number, dem: number,
  duLieu: DuLieuTran,
): KetQuaMua {
  const moi: string[] = [...quan].sort((a, b) => sucDoi(b, duLieu) - sucDoi(a, duLieu));
  let con: number = nganSach;
  let d: number = dem;
  while (dsMua.length > 0) {
    const l = dsMua[d % dsMua.length] as LoaiDoi;
    if (l.gia > con) break;
    if (moi.length >= toiDa) {
      const yeuNhat: string | undefined = moi[moi.length - 1];
      if (yeuNhat === undefined || sucDoi(yeuNhat, duLieu) >= sucDoi(l.id, duLieu)) break;
      moi.pop();
    }
    con -= l.gia;
    moi.push(l.id);
    moi.sort((a, b) => sucDoi(b, duLieu) - sucDoi(a, duLieu));
    d += 1;
  }
  return { quan: moi, vangCon: con, dem: d };
}

/** Ket qua mot tran danh chiem tinh. */
export interface KetQuaDanh {
  readonly tanCongThang: boolean;
  /** So doi moi ben mat. */
  readonly matTanCong: number;
  readonly matPhongThu: number;
  /** `undefined` khi ben thu khong con doi nao - chiem khong can danh. */
  readonly tran: KetQuaTran | undefined;
}

/** Xac suat ben tan cong thang, doc tu `duDoan()` - AI dung de quyet co danh hay khong. */
export function xacSuatThang(
  tanCong: readonly string[], phongThu: readonly string[], diaHinh: string, tuong: number, tuongThu: number,
  duLieu: DuLieuTran,
): number {
  if (tanCong.length === 0) return 0;
  if (phongThu.length === 0) return 1;
  return duDoan({ a: { doi: tanCong, tuong }, b: { doi: phongThu, tuong: tuongThu }, diaHinh }, duLieu);
}

/**
 * Danh mot tran. `tanCong` / `phongThu` la cac doi DA CHON dua vao tran (nguoi goi cat
 * theo `doiMoiTran`). `tuongThu` rieng cho ben giu dat - thu do co tuong gioi hon.
 * Mat doi lam tron theo ti le linh chet.
 */
export function danh(
  tanCong: readonly string[], phongThu: readonly string[], diaHinh: string, tuong: number, tuongThu: number,
  duLieu: DuLieuTran, hatGiong: number,
): KetQuaDanh {
  if (tanCong.length === 0) return { tanCongThang: false, matTanCong: 0, matPhongThu: 0, tran: undefined };
  if (phongThu.length === 0) return { tanCongThang: true, matTanCong: 0, matPhongThu: 0, tran: undefined };
  const kq: KetQuaTran = tinhTran(
    { a: { doi: tanCong, tuong }, b: { doi: phongThu, tuong: tuongThu }, diaHinh }, duLieu, hatGiong,
  );
  const thang: boolean = kq.thang === 'a';
  const matA: number = Math.min(tanCong.length, Math.round((tanCong.length * kq.chetA) / kq.linhA));
  const matB: number = Math.min(phongThu.length, Math.round((phongThu.length * kq.chetB) / kq.linhB));
  // Ben thua bo chay thi cung phai mat it nhat mot doi, khong thi thua mai khong mon.
  return {
    tanCongThang: thang,
    matTanCong: thang ? matA : Math.max(1, matA),
    matPhongThu: thang ? Math.max(1, matB) : matB,
    tran: kq,
  };
}
