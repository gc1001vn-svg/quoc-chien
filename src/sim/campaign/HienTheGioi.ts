/**
 * Dung so cho man the gioi (Phase 11B): thanh tren, bang ngoai giao, the bat on, nut tan
 * cong tinh, man ket. Ham thuan - vao `TheGioi`, ra object de `ui/` ve, khong tu doi gi.
 *
 * Luat "bam duoc hay khong" doc lai DUNG dieu kien ma `TheGioi` / `NgoaiGiao` se kiem khi
 * bam that, de nut khoa va ly do khop voi hanh vi - khong nut nao sang ma bam khong an.
 *
 * TypeScript thuan (luat 1). So doc tu `tg.du` (luat 2); chu hien thi la tieng Viet.
 */
import type { BanDoTinh } from './BanDoTinh.ts';
import { xacSuatThang } from './ChienTranh.ts';
import type { KetQuaVan, LyDoTanCong, TheGioi } from './TheGioi.ts';
import type { LuaChonBatOn, TrangThaiNG } from './TheGioiData.ts';

export const TEN_TRANG_THAI: Readonly<Record<TrangThaiNG, string>> = {
  chien_tranh: 'Chiến tranh', ngung_ban: 'Ngừng bắn', hoa_binh: 'Hoà bình', lien_minh: 'Liên minh',
};

/** Mot nut: bam duoc khong, va vi sao khong (chuoi rong khi bam duoc). */
export interface Nut {
  readonly duoc: boolean;
  readonly lyDo: string;
}

export interface ThanhTren {
  readonly vang: number;
  readonly batOn: number;
  readonly nguongThe: number;
  readonly gio: number;
  readonly suc: number;
  readonly soTinh: number;
  /** Thoi dai cua nuoc ta (so, tu 1). `ui/` doi ra ten bang `balance.json > thoiDai`. */
  readonly doi: number;
}

export interface HangNuoc {
  readonly id: string;
  readonly ten: string;
  readonly conSong: boolean;
  readonly trangThai: TrangThaiNG;
  readonly tenTrangThai: string;
  /** Quan he voi ta, lam tron so nguyen. */
  readonly quanHe: number;
  /** Suc quan ta / suc quan ho. */
  readonly tiLeSuc: number;
  readonly soTinh: number;
  readonly thuongMai: boolean;
  /** De doa luc nay co thang khong (ti le suc du `de_doa.ti_le_thang`). */
  readonly deDoaThang: boolean;
  readonly nutThuongMai: Nut;
  readonly nutDamPhan: Nut;
  readonly nutDeDoa: Nut;
  readonly nutTuyenChien: Nut;
}

export interface LuaChonHien {
  readonly id: string;
  readonly ten: string;
  readonly vang: number;
  /** Hau qua viet ra chu, vd "−30 bất ổn · mất 2 đội". */
  readonly moTa: string;
  readonly nut: Nut;
}

export interface TheBatOnHien {
  readonly mo: boolean;
  readonly chiSo: number;
  readonly nguongSup: number;
  /** So gio con lai truoc khi noi loan, neu cu ke the. */
  readonly gioConNoiLoan: number;
  readonly luaChon: readonly LuaChonHien[];
}

export interface TanCongHien {
  readonly nut: Nut;
  /** Xac suat thang 0..1; 0 khi khong danh duoc. */
  readonly xacSuat: number;
}

export interface ManKet {
  readonly thang: boolean;
  readonly tieuDe: string;
  readonly moTa: string;
  readonly gio: number;
}

const DUOC: Nut = { duoc: true, lyDo: '' };
const khoa = (lyDo: string): Nut => ({ duoc: false, lyDo });

export function thanhTren(tg: TheGioi): ThanhTren {
  const ta = tg.nuoc(tg.ta);
  return {
    vang: Math.floor(ta.vang),
    batOn: Math.round(tg.batOn.chiSo),
    nguongThe: tg.du.batOn.nguongThe,
    gio: tg.gio,
    suc: Math.round(tg.suc(tg.ta)),
    soTinh: tg.tinhCua(tg.ta).length,
    doi: ta.doi,
  };
}

/** Moi nuoc khac ta, theo thu tu trong `nations.json`. */
export function hangNgoaiGiao(tg: TheGioi, banDo: BanDoTinh): HangNuoc[] {
  const ta = tg.ta;
  const vangTa = tg.nuoc(ta).vang;
  const ng = tg.ngoaiGiao;
  const soNG = tg.du.ngoaiGiao;
  return banDo.nuoc.filter((n) => n.id !== ta).map((n): HangNuoc => {
    const conSong = tg.nuoc(n.id).conSong;
    const tt = ng.trangThai(ta, n.id);
    const tiLeSuc = tg.suc(ta) / Math.max(1, tg.suc(n.id));
    const thuongMai = ng.dangThuongMai(ta, n.id);
    const mat = khoa('Đã mất nước');
    let damPhan: Nut = DUOC;
    if (vangTa < soNG.damPhan.vang) damPhan = khoa(`Cần ${String(soNG.damPhan.vang)} vàng`);
    else if (tt === 'chien_tranh' && tg.suc(n.id) >= tg.du.ai.tiLeTuyenChien * Math.max(1, tg.suc(ta))) {
      damPhan = khoa('Họ mạnh hơn, không chịu hoà');
    }
    return {
      id: n.id,
      ten: n.hien,
      conSong,
      trangThai: tt,
      tenTrangThai: TEN_TRANG_THAI[tt],
      quanHe: Math.round(ng.quanHe(ta, n.id)),
      tiLeSuc,
      soTinh: tg.tinhCua(n.id).length,
      thuongMai,
      deDoaThang: tiLeSuc >= soNG.deDoa.tiLeThang,
      nutThuongMai: !conSong ? mat : !thuongMai && tt === 'chien_tranh' ? khoa('Đang chiến tranh') : DUOC,
      nutDamPhan: conSong ? damPhan : mat,
      nutDeDoa: conSong ? DUOC : mat,
      nutTuyenChien: !conSong ? mat : tt === 'chien_tranh' ? khoa('Đang chiến tranh') : DUOC,
    };
  });
}

export function theBatOn(tg: TheGioi): TheBatOnHien {
  const b = tg.batOn;
  const vangTa = tg.nuoc(tg.ta).vang;
  return {
    mo: b.theMo,
    chiSo: Math.round(b.chiSo),
    nguongSup: tg.du.batOn.nguongSup,
    gioConNoiLoan: Math.max(0, tg.du.batOn.gioNoiLoan - b.gioDaKe),
    luaChon: b.luaChon.map((l): LuaChonHien => ({
      id: l.id,
      ten: l.hien,
      vang: l.vang,
      moTa: moTaLuaChon(l),
      nut: vangTa + l.vang < 0 ? khoa(`Cần ${String(-l.vang)} vàng`) : DUOC,
    })),
  };
}

/** Chu hau qua cua mot lua chon bat on: chi ghi cai khac 0. */
function moTaLuaChon(l: LuaChonBatOn): string {
  const so = (n: number): string => (n > 0 ? `+${String(n)}` : `−${String(-n)}`);
  const ra: string[] = [`${so(l.batOn)} bất ổn`];
  if (l.vang !== 0) ra.push(`${so(l.vang)} vàng`);
  if (l.matDoi > 0) ra.push(`mất ${String(l.matDoi)} đội`);
  if (l.vanHoa !== 0) ra.push(`${so(l.vanHoa)} văn hoá`);
  if (l.gioGiamThue > 0) ra.push(`thu thuế ít đi ${String(l.gioGiamThue)} giờ`);
  return ra.join(' · ');
}

const LY_DO_TAN_CONG: Readonly<Record<LyDoTanCong, string>> = {
  '': '',
  'khong-co-tinh': 'Không có tỉnh này',
  'cua-minh': 'Tỉnh của ta',
  'khong-ke': 'Không giáp đất ta',
  'khong-dang-chien': 'Chưa tuyên chiến',
  'dang-nghi': 'Quân đang nghỉ',
  'het-quan': 'Hết quân',
};

export function tanCongTinh(tg: TheGioi, tinhId: string): TanCongHien {
  const ly = tg.lyDoKhongDanh(tg.ta, tinhId);
  if (ly !== '') return { nut: khoa(LY_DO_TAN_CONG[ly]), xacSuat: 0 };
  const di = tg.nuoc(tg.ta).quan.slice(0, tg.du.quan.doiMoiTran);
  const xs = xacSuatThang(di, tg.quanThu(tinhId), tg.diaHinh(tinhId), tg.du.quan.tuong, tg.tuongThu(tinhId), tg.tran);
  return { nut: DUOC, xacSuat: xs };
}

const KIEU_KET: Readonly<Record<KetQuaVan['kieu'], string>> = {
  '': '',
  thong_tri: 'Thống trị — chiếm thủ đô mọi nước',
  khoa_hoc: 'Khoa học — xong mọi công nghệ tới thời đại đích',
  van_hoa: 'Văn hoá — ảnh hưởng vượt các nước khác',
  ngoai_giao: 'Ngoại giao — được bầu làm minh chủ',
  mat_thu_do: 'Mất thủ đô',
  sup_do: 'Bất ổn làm sụp đổ cả nước',
};

/** `undefined` khi van con dang choi. */
export function manKet(tg: TheGioi): ManKet | undefined {
  const kq = tg.ketQua;
  if (kq.trangThai === 'dang_choi') return undefined;
  const tieuDe = kq.trangThai === 'thang' ? 'Chiến thắng' : kq.trangThai === 'thua' ? 'Thất bại' : 'Hết giờ';
  const moTa = kq.trangThai === 'het_gio' ? 'Hết thời gian ván mà chưa ai thắng' : KIEU_KET[kq.kieu];
  return { thang: kq.trangThai === 'thang', tieuDe, moTa, gio: kq.gio };
}
