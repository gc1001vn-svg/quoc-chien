/**
 * Bon dieu kien thang cua nguoi choi (GAME_SPEC muc 11). Ham thuan: nhan so, tra ve kieu
 * thang hay chuoi rong - `TheGioi.ts` lo ghi nhat ky va ket van.
 *
 * TypeScript thuan (luat 1). Nguong doc tu `victory.json` + `the_gioi.json > ngoai_giao.bau` (luat 2).
 */
import type { NgoaiGiao } from './NgoaiGiao.ts';
import type { KieuThang, NuocTG, SoNuocTa } from './TheGioi.ts';
import type { DuLieuTheGioi } from './TheGioiData.ts';

export interface XetThang {
  readonly kieu: KieuThang | '';
  /** So phieu minh chu dot nay; -1 khi gio nay khong co bau. */
  readonly phieu: number;
  readonly soNuocKhac: number;
}

export function xetThang(
  du: DuLieuTheGioi, gio: number, ta: NuocTG, dsNuoc: readonly NuocTG[], so: SoNuocTa, ngoaiGiao: NgoaiGiao,
): XetThang {
  const t = du.thang;
  const conSong: string[] = dsNuoc.filter((n) => n.conSong).map((n) => n.id);
  const soKhac: number = conSong.length - 1;
  const ra = (kieu: KieuThang | '', phieu = -1): XetThang => ({ kieu, phieu, soNuocKhac: soKhac });
  if (soKhac === 0) return ra('thong_tri');
  if (so.doiXongHet >= t.khoaHocDoi) return ra('khoa_hoc');
  // Nuoc da mat van tinh anh huong cu (dong bang luc mat) - khong thi thon tinh cang
  // nhieu cang de thang Van hoa, hai kieu thang chong len nhau.
  const vhKhac: number = dsNuoc.filter((n) => n.id !== ta.id).reduce((s, n) => s + n.vanHoa, 0);
  if (ta.vanHoa >= t.vanHoaToiThieu && ta.vanHoa > t.vanHoaTiLe * vhKhac) return ra('van_hoa');
  const bau = du.ngoaiGiao.bau;
  if (gio % bau.gioMoiLan !== 0 || ta.doi < bau.doiToiThieu) return ra('');
  const phieu: number = ngoaiGiao.demPhieu(ta.id, conSong);
  return ra(phieu > t.ngoaiGiaoTiLePhieu * soKhac ? 'ngoai_giao' : '', phieu);
}
