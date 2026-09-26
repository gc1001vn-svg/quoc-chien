/**
 * Doc `data/the_gioi.json` + `data/victory.json` thanh so cho lop the gioi (Phase 11A).
 *
 * Mot cua doc duy nhat, co kiem tra: thieu mot truong hay sai kieu thi bao ngay luc doc,
 * kem duong dan toi cho sai - khong de `undefined` lot vao cong thuc roi ra `NaN` ve sau.
 *
 * TypeScript thuan (luat 1). Khong con so can bang nao nam trong file nay (luat 2).
 */
import { LoiDuLieu, layChuoi, layMang, layObject, laySoNguyen } from '../city/DocJson.ts';

/** Bon trang thai ngoai giao giua hai nuoc (GAME_SPEC muc 5). */
export type TrangThaiNG = 'chien_tranh' | 'ngung_ban' | 'hoa_binh' | 'lien_minh';
export const MOI_TRANG_THAI: readonly TrangThaiNG[] = ['chien_tranh', 'ngung_ban', 'hoa_binh', 'lien_minh'];

/** Mot lua chon cua the bat on. */
export interface LuaChonBatOn {
  readonly id: string;
  readonly hien: string;
  readonly batOn: number;
  readonly matDoi: number;
  readonly vang: number;
  readonly vanHoa: number;
  readonly gioGiamThue: number;
}

export interface DuLieuTheGioi {
  readonly hatGiong: number;
  readonly kinhTe: {
    readonly vangMoiNha: number;
    readonly vangMoiTinh: number;
    readonly vangMoiTinhAi: number;
    readonly vangThuDoAi: number;
    readonly giamThueHeSo: number;
  };
  readonly quan: {
    readonly tiLeChiQuan: number;
    readonly quanCoBan: number;
    readonly quanMoiTinh: number;
    readonly doiMoiTran: number;
    readonly tuong: number;
    readonly tuongThuDo: number;
    readonly heSoGiu: number;
    readonly heSoThuDo: number;
    readonly gioNghiTanCong: number;
    readonly quanTrungLap: readonly string[];
  };
  /** Phan tu i = gio game nuoc AI len thoi dai i+1. */
  readonly doiAiTheoGio: readonly number[];
  readonly ngoaiGiao: {
    readonly trangThaiDau: TrangThaiNG;
    readonly troiMoiGio: number;
    readonly thuongMai: { readonly vangMoiGio: number; readonly quanHeMoiGio: number };
    readonly damPhan: { readonly vang: number; readonly quanHe: number };
    readonly deDoa: {
      readonly tiLeThang: number;
      readonly congNap: number;
      readonly quanHeThang: number;
      readonly quanHeThua: number;
    };
    readonly tuyenChienQuanHe: number;
    readonly nguong: { readonly ngungBan: number; readonly hoaBinh: number; readonly lienMinh: number };
    readonly bau: { readonly gioMoiLan: number; readonly doiToiThieu: number; readonly quanHeBau: number };
  };
  readonly ai: {
    readonly tiLeTuyenChien: number;
    readonly quanHeTuyenChien: number;
    readonly xacSuatTuyenChien: number;
    readonly xacSuatTanCong: number;
    readonly tiLeXinHoa: number;
  };
  readonly vanHoa: {
    readonly moiNha: number;
    readonly moiCongNghe: number;
    readonly moiTinh: number;
    readonly moiVangDauTu: number;
    readonly moiTinhAi: number;
    readonly moiDoiAi: number;
  };
  readonly batOn: {
    readonly thueMoiGio: number;
    readonly thieuLuongThuc: number;
    readonly chienTranhMoiGio: number;
    readonly matTinh: number;
    readonly giamMoiGio: number;
    /** Khoa the chinh sach -> so bat on bot moi gio khi dang lap. */
    readonly theGiam: ReadonlyMap<string, number>;
    readonly nguongThe: number;
    readonly gioNoiLoan: number;
    readonly noiLoanGiam: number;
    readonly nguongSup: number;
    readonly hangLuongThuc: readonly string[];
    readonly luaChon: readonly LuaChonBatOn[];
  };
  readonly thang: {
    readonly khoaHocDoi: number;
    readonly vanHoaTiLe: number;
    readonly vanHoaToiThieu: number;
    readonly ngoaiGiaoTiLePhieu: number;
    readonly gioToiDa: number;
  };
}

/** Doc mot so thuc huu han. */
function so(o: Record<string, unknown>, k: string, duong: string): number {
  const v: unknown = o[k];
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new LoiDuLieu(`${duong}.${k}`, 'phai la so');
  return v;
}

/** Doc mot so trong [0, 1] - ti le, xac suat. */
function tiLe(o: Record<string, unknown>, k: string, duong: string): number {
  const v: number = so(o, k, duong);
  if (v < 0 || v > 1) throw new LoiDuLieu(`${duong}.${k}`, 'phai trong [0, 1]');
  return v;
}

function con(o: Record<string, unknown>, k: string, duong: string): Record<string, unknown> {
  return layObject(o[k], `${duong}.${k}`);
}

function dsChuoi(tho: unknown, duong: string): string[] {
  return layMang(tho, duong).map((x, i) => layChuoi(x, `${duong}[${String(i)}]`));
}

/**
 * Doc hai file. `loaiDoi` la khoa moi loai doi trong `units.json` - de bat ngay mot
 * `quan_trung_lap` go sai ten, thay vi vo o tran dau tien.
 */
export function docTheGioi(tho: unknown, thoThang: unknown, loaiDoi: ReadonlySet<string>): DuLieuTheGioi {
  const g = layObject(tho, 'the_gioi.json');
  const kt = con(g, 'kinh_te', 'the_gioi.json');
  const q = con(g, 'quan', 'the_gioi.json');
  const ng = con(g, 'ngoai_giao', 'the_gioi.json');
  const ai = con(g, 'ai', 'the_gioi.json');
  const vh = con(g, 'van_hoa', 'the_gioi.json');
  const bo = con(g, 'bat_on', 'the_gioi.json');
  const d = 'the_gioi.json';

  const quanTrungLap: string[] = dsChuoi(q['quan_trung_lap'], `${d}.quan.quan_trung_lap`);
  for (const id of quanTrungLap) {
    if (!loaiDoi.has(id)) throw new LoiDuLieu(`${d}.quan.quan_trung_lap`, `khong co loai doi "${id}"`);
  }

  const doiAi: number[] = layMang(g['doi_ai_theo_gio'], `${d}.doi_ai_theo_gio`).map((x, i) =>
    laySoNguyen(x, `${d}.doi_ai_theo_gio[${String(i)}]`, 0),
  );
  for (let i = 1; i < doiAi.length; i++) {
    if ((doiAi[i] as number) < (doiAi[i - 1] as number)) {
      throw new LoiDuLieu(`${d}.doi_ai_theo_gio`, 'phai tang dan');
    }
  }

  const trangThaiDau = layChuoi(ng['trang_thai_dau'], `${d}.ngoai_giao.trang_thai_dau`) as TrangThaiNG;
  if (!MOI_TRANG_THAI.includes(trangThaiDau)) {
    throw new LoiDuLieu(`${d}.ngoai_giao.trang_thai_dau`, `khong biet trang thai "${trangThaiDau}"`);
  }

  const tm = con(ng, 'thuong_mai', `${d}.ngoai_giao`);
  const dp = con(ng, 'dam_phan', `${d}.ngoai_giao`);
  const dd = con(ng, 'de_doa', `${d}.ngoai_giao`);
  const nguong = con(ng, 'nguong', `${d}.ngoai_giao`);
  const bau = con(ng, 'bau', `${d}.ngoai_giao`);

  const theGiamTho = con(bo, 'the_giam', `${d}.bat_on`);
  const theGiam = new Map<string, number>();
  for (const k of Object.keys(theGiamTho)) theGiam.set(k, so(theGiamTho, k, `${d}.bat_on.the_giam`));

  const lcTho = con(bo, 'lua_chon', `${d}.bat_on`);
  const luaChon: LuaChonBatOn[] = Object.keys(lcTho).map((id): LuaChonBatOn => {
    const duong = `${d}.bat_on.lua_chon.${id}`;
    const l = layObject(lcTho[id], duong);
    return {
      id,
      hien: layChuoi(l['hien'], `${duong}.hien`),
      batOn: so(l, 'bat_on', duong),
      matDoi: laySoNguyen(l['mat_doi'], `${duong}.mat_doi`, 0),
      vang: so(l, 'vang', duong),
      vanHoa: so(l, 'van_hoa', duong),
      gioGiamThue: laySoNguyen(l['gio_giam_thue'], `${duong}.gio_giam_thue`, 0),
    };
  });
  if (luaChon.length === 0) throw new LoiDuLieu(`${d}.bat_on.lua_chon`, 'phai co it nhat mot lua chon');

  const t = layObject(thoThang, 'victory.json');
  const kh = con(t, 'khoa_hoc', 'victory.json');
  const vht = con(t, 'van_hoa', 'victory.json');
  const ngt = con(t, 'ngoai_giao', 'victory.json');

  return {
    hatGiong: laySoNguyen(g['hat_giong'], `${d}.hat_giong`, 0),
    kinhTe: {
      vangMoiNha: so(kt, 'vang_moi_nha', `${d}.kinh_te`),
      vangMoiTinh: so(kt, 'vang_moi_tinh', `${d}.kinh_te`),
      vangMoiTinhAi: so(kt, 'vang_moi_tinh_ai', `${d}.kinh_te`),
      vangThuDoAi: so(kt, 'vang_thu_do_ai', `${d}.kinh_te`),
      giamThueHeSo: tiLe(kt, 'giam_thue_he_so', `${d}.kinh_te`),
    },
    quan: {
      tiLeChiQuan: tiLe(q, 'ti_le_chi_quan', `${d}.quan`),
      quanCoBan: laySoNguyen(q['quan_co_ban'], `${d}.quan.quan_co_ban`, 0),
      quanMoiTinh: laySoNguyen(q['quan_moi_tinh'], `${d}.quan.quan_moi_tinh`, 0),
      doiMoiTran: laySoNguyen(q['doi_moi_tran'], `${d}.quan.doi_moi_tran`),
      tuong: laySoNguyen(q['tuong'], `${d}.quan.tuong`, 0),
      tuongThuDo: laySoNguyen(q['tuong_thu_do'], `${d}.quan.tuong_thu_do`, 0),
      heSoGiu: so(q, 'he_so_giu', `${d}.quan`),
      heSoThuDo: so(q, 'he_so_thu_do', `${d}.quan`),
      gioNghiTanCong: laySoNguyen(q['gio_nghi_tan_cong'], `${d}.quan.gio_nghi_tan_cong`, 0),
      quanTrungLap,
    },
    doiAiTheoGio: doiAi,
    ngoaiGiao: {
      trangThaiDau,
      troiMoiGio: so(ng, 'troi_moi_gio', `${d}.ngoai_giao`),
      thuongMai: {
        vangMoiGio: so(tm, 'vang_moi_gio', `${d}.ngoai_giao.thuong_mai`),
        quanHeMoiGio: so(tm, 'quan_he_moi_gio', `${d}.ngoai_giao.thuong_mai`),
      },
      damPhan: { vang: so(dp, 'vang', `${d}.ngoai_giao.dam_phan`), quanHe: so(dp, 'quan_he', `${d}.ngoai_giao.dam_phan`) },
      deDoa: {
        tiLeThang: so(dd, 'ti_le_thang', `${d}.ngoai_giao.de_doa`),
        congNap: so(dd, 'cong_nap', `${d}.ngoai_giao.de_doa`),
        quanHeThang: so(dd, 'quan_he_thang', `${d}.ngoai_giao.de_doa`),
        quanHeThua: so(dd, 'quan_he_thua', `${d}.ngoai_giao.de_doa`),
      },
      tuyenChienQuanHe: so(ng, 'tuyen_chien_quan_he', `${d}.ngoai_giao`),
      nguong: {
        ngungBan: so(nguong, 'ngung_ban', `${d}.ngoai_giao.nguong`),
        hoaBinh: so(nguong, 'hoa_binh', `${d}.ngoai_giao.nguong`),
        lienMinh: so(nguong, 'lien_minh', `${d}.ngoai_giao.nguong`),
      },
      bau: {
        gioMoiLan: laySoNguyen(bau['gio_moi_lan'], `${d}.ngoai_giao.bau.gio_moi_lan`),
        doiToiThieu: laySoNguyen(bau['doi_toi_thieu'], `${d}.ngoai_giao.bau.doi_toi_thieu`),
        quanHeBau: so(bau, 'quan_he_bau', `${d}.ngoai_giao.bau`),
      },
    },
    ai: {
      tiLeTuyenChien: so(ai, 'ti_le_tuyen_chien', `${d}.ai`),
      quanHeTuyenChien: so(ai, 'quan_he_tuyen_chien', `${d}.ai`),
      xacSuatTuyenChien: tiLe(ai, 'xac_suat_tuyen_chien', `${d}.ai`),
      xacSuatTanCong: tiLe(ai, 'xac_suat_tan_cong', `${d}.ai`),
      tiLeXinHoa: so(ai, 'ti_le_xin_hoa', `${d}.ai`),
    },
    vanHoa: {
      moiNha: so(vh, 'moi_nha', `${d}.van_hoa`),
      moiCongNghe: so(vh, 'moi_cong_nghe', `${d}.van_hoa`),
      moiTinh: so(vh, 'moi_tinh', `${d}.van_hoa`),
      moiVangDauTu: so(vh, 'moi_vang_dau_tu', `${d}.van_hoa`),
      moiTinhAi: so(vh, 'moi_tinh_ai', `${d}.van_hoa`),
      moiDoiAi: so(vh, 'moi_doi_ai', `${d}.van_hoa`),
    },
    batOn: {
      thueMoiGio: so(bo, 'thue_moi_gio', `${d}.bat_on`),
      thieuLuongThuc: so(bo, 'thieu_luong_thuc', `${d}.bat_on`),
      chienTranhMoiGio: so(bo, 'chien_tranh_moi_gio', `${d}.bat_on`),
      matTinh: so(bo, 'mat_tinh', `${d}.bat_on`),
      giamMoiGio: so(bo, 'giam_moi_gio', `${d}.bat_on`),
      theGiam,
      nguongThe: so(bo, 'nguong_the', `${d}.bat_on`),
      gioNoiLoan: laySoNguyen(bo['gio_noi_loan'], `${d}.bat_on.gio_noi_loan`),
      noiLoanGiam: so(bo, 'noi_loan_giam', `${d}.bat_on`),
      nguongSup: so(bo, 'nguong_sup', `${d}.bat_on`),
      hangLuongThuc: dsChuoi(bo['hang_luong_thuc'], `${d}.bat_on.hang_luong_thuc`),
      luaChon,
    },
    thang: {
      khoaHocDoi: laySoNguyen(kh['doi'], 'victory.json.khoa_hoc.doi'),
      vanHoaTiLe: so(vht, 'ti_le', 'victory.json.van_hoa'),
      vanHoaToiThieu: so(vht, 'toi_thieu', 'victory.json.van_hoa'),
      ngoaiGiaoTiLePhieu: tiLe(ngt, 'ti_le_phieu', 'victory.json.ngoai_giao'),
      gioToiDa: laySoNguyen(t['gio_toi_da'], 'victory.json.gio_toi_da'),
    },
  };
}
