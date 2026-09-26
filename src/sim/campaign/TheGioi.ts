/**
 * Lop the gioi (Phase 11A): bon nuoc, tinh ai giu, quan, ngoai giao, bat on, dieu kien
 * thang thua. Chay theo GIO GAME, cung nhip voi thanh pho.
 *
 * Nuoc nguoi choi KHONG co kinh te rieng o day: moi gio nguoi goi dua vao so that cua
 * thanh pho (`SoNuocTa`, xem `NoiThanhPho.ts`) - day la cho noi lop chien dich voi kinh te
 * thanh pho. Nuoc AI khong co thanh pho nen kinh te rut gon theo so tinh.
 *
 * TypeScript thuan (luat 1), tat dinh theo hat giong (TECH_SPEC muc 8). So o `data/` (luat 2).
 */
import { Rng } from '../../core/Rng.ts';
import type { DuLieuTran } from './Battle.ts';
import { tinhKe, type BanDoTinh, type Tinh } from './BanDoTinh.ts';
import { BatOn } from './BatOn.ts';
import { danh, doiMuaDuoc, muaQuan, sucQuan, type KetQuaDanh } from './ChienTranh.ts';
import { NgoaiGiao } from './NgoaiGiao.ts';
import type { DuLieuTheGioi } from './TheGioiData.ts';
import { aiHanhDong } from './AiNuoc.ts';
import { xetThang } from './DieuKienThang.ts';

/** So cua nuoc nguoi choi trong mot gio, lay tu thanh pho that. */
export interface SoNuocTa {
  readonly soNha: number;
  readonly doi: number;
  readonly soCongNgheXong: number;
  /** Doi lon nhat ma MOI cong nghe tu doi 1 toi doi do deu da xong. */
  readonly doiXongHet: number;
  readonly thieuLuongThuc: boolean;
  readonly theDangLap: readonly string[];
}

/** Trang thai mot nuoc. */
export interface NuocTG {
  readonly id: string;
  readonly nguoiChoi: boolean;
  vang: number;
  quan: string[];
  vanHoa: number;
  doi: number;
  conSong: boolean;
  gioNghi: number;
  dem: number;
}

export type KieuThang = 'thong_tri' | 'khoa_hoc' | 'van_hoa' | 'ngoai_giao';
export interface KetQuaVan {
  readonly trangThai: 'dang_choi' | 'thang' | 'thua' | 'het_gio';
  readonly kieu: KieuThang | 'mat_thu_do' | 'sup_do' | '';
  readonly gio: number;
}

/** Vi sao mot lenh tan cong bi tu choi. Chuoi rong = da danh. */
export type LyDoTanCong = '' | 'khong-co-tinh' | 'cua-minh' | 'khong-ke' | 'khong-dang-chien' | 'dang-nghi' | 'het-quan';

export class TheGioi {
  readonly du: DuLieuTheGioi;
  readonly tran: DuLieuTran;
  readonly ngoaiGiao: NgoaiGiao;
  readonly batOn: BatOn;
  readonly nhatKy: string[] = [];
  /** Phan vang nguoi choi dua vao mua quan moi gio. */
  tiLeChiQuanTa: number;
  private readonly tinhTheoId: ReadonlyMap<string, Tinh>;
  private readonly nuocTheoId = new Map<string, NuocTG>();
  private readonly chuTinh = new Map<string, string>();
  private readonly keBen: ReadonlyMap<string, ReadonlySet<string>>;
  private readonly quanTrungLap = new Map<string, string[]>();
  private readonly rng: Rng;
  private soGio = 0;
  private soTran = 0;
  private kq: KetQuaVan = { trangThai: 'dang_choi', kieu: '', gio: 0 };

  constructor(du: DuLieuTheGioi, banDo: BanDoTinh, tran: DuLieuTran) {
    this.du = du;
    this.tran = tran;
    this.ngoaiGiao = new NgoaiGiao(du.ngoaiGiao);
    this.batOn = new BatOn(du.batOn);
    this.tiLeChiQuanTa = du.quan.tiLeChiQuan;
    this.rng = new Rng(du.hatGiong);
    this.tinhTheoId = new Map(banDo.tinh.map((t): [string, Tinh] => [t.id, t]));
    for (const n of banDo.nuoc) {
      this.nuocTheoId.set(n.id, { id: n.id, nguoiChoi: n.nguoi_choi, vang: 0, quan: [], vanHoa: 0, doi: 1, conSong: true, gioNghi: 0, dem: 0 });
    }
    for (const t of banDo.tinh) {
      this.chuTinh.set(t.id, t.nuoc);
      if (t.nuoc === '') this.quanTrungLap.set(t.id, [...du.quan.quanTrungLap]);
    }
    this.keBen = tinhKe(banDo);
  }

  get gio(): number { return this.soGio; }
  get ketQua(): KetQuaVan { return this.kq; }
  /** Khoa nuoc nguoi choi. */
  get ta(): string { return [...this.nuocTheoId.values()].find((n) => n.nguoiChoi)?.id ?? ''; }
  get dsNuoc(): readonly NuocTG[] { return [...this.nuocTheoId.values()]; }
  get conSong(): string[] { return this.dsNuoc.filter((n) => n.conSong).map((n) => n.id); }

  public nuoc(id: string): NuocTG {
    const n = this.nuocTheoId.get(id);
    if (n === undefined) throw new Error(`Khong co nuoc "${id}"`);
    return n;
  }
  /** Chu cua tinh; chuoi rong la trung lap. */
  public chu(tinhId: string): string { return this.chuTinh.get(tinhId) ?? ''; }
  public tinhCua(nuoc: string): string[] { return [...this.chuTinh].filter(([, c]) => c === nuoc).map(([t]) => t); }
  public suc(nuoc: string): number { return sucQuan(this.nuoc(nuoc).quan, this.tran); }
  /** Hai nuoc co chung bien gioi khong. */
  public keNuoc(a: string, b: string): boolean {
    return this.tinhCua(a).some((t) => [...(this.keBen.get(t) ?? [])].some((k) => this.chu(k) === b));
  }
  /**
   * Doi giu mot tinh. Tinh trung lap: doi trung lap cua no. Tinh co chu: quan cua chu rai
   * deu theo so tinh (nhan `heSoGiu`), thu do nhan them `heSoThuDo`, tran `doiMoiTran`.
   * Nuoc cang rong thi moi tinh cang mong quan - khong thi ca nuoc dung sau moi tinh.
   */
  public quanThu(tinhId: string): string[] {
    const c = this.chu(tinhId);
    if (c === '') return this.quanTrungLap.get(tinhId) ?? [];
    const q = this.du.quan;
    const quan = this.nuoc(c).quan;
    const heSo = q.heSoGiu * (this.tinhTheoId.get(tinhId)?.thuDo === true ? q.heSoThuDo : 1);
    const n = Math.min(q.doiMoiTran, Math.ceil((quan.length * heSo) / Math.max(1, this.tinhCua(c).length)));
    return quan.slice(0, n);
  }
  /** Cac tinh `nuoc` danh duoc ngay bay gio: ke dat minh, trung lap hay cua nuoc dang chien. */
  public mucTieu(nuoc: string): string[] {
    const ra = new Set<string>();
    for (const t of this.tinhCua(nuoc)) {
      for (const k of this.keBen.get(t) ?? []) {
        const c = this.chu(k);
        if (c !== nuoc && (c === '' || this.ngoaiGiao.trangThai(nuoc, c) === 'chien_tranh')) ra.add(k);
      }
    }
    return [...ra].sort(soChuoi);
  }
  public diaHinh(tinhId: string): string { return this.tinhTheoId.get(tinhId)?.diaHinh ?? ''; }
  /** Cap tuong ben giu tinh: thu do dang con chu cu giu thi co tuong gioi hon. */
  public tuongThu(tinhId: string): number {
    const t = this.tinhTheoId.get(tinhId);
    return t !== undefined && t.thuDo && this.chu(tinhId) === t.nuoc ? this.du.quan.tuongThuDo : this.du.quan.tuong;
  }

  /** Danh mot tinh. Dung chung cho nguoi choi va AI. */
  public tanCong(nuoc: string, tinhId: string): LyDoTanCong {
    const t = this.tinhTheoId.get(tinhId);
    if (t === undefined) return 'khong-co-tinh';
    const n = this.nuoc(nuoc);
    const c = this.chu(tinhId);
    if (c === nuoc) return 'cua-minh';
    if (!this.tinhCua(nuoc).some((x) => this.keBen.get(x)?.has(tinhId))) return 'khong-ke';
    if (c !== '' && this.ngoaiGiao.trangThai(nuoc, c) !== 'chien_tranh') return 'khong-dang-chien';
    if (n.gioNghi > 0) return 'dang-nghi';
    if (n.quan.length === 0) return 'het-quan';
    const di = n.quan.slice(0, this.du.quan.doiMoiTran);
    const hat = (this.du.hatGiong ^ Math.imul(++this.soTran, 2654435761)) >>> 0;
    const kq: KetQuaDanh = danh(di, this.quanThu(tinhId), t.diaHinh, this.du.quan.tuong, this.tuongThu(tinhId), this.tran, hat);
    n.quan.splice(0, kq.matTanCong);
    if (c === '') this.quanTrungLap.get(tinhId)?.splice(0, kq.matPhongThu);
    else this.nuoc(c).quan.splice(0, kq.matPhongThu);
    n.gioNghi = this.du.quan.gioNghiTanCong;
    this.ghi(`${nuoc} danh ${tinhId}: ${kq.tanCongThang ? 'chiem' : 'bai'}`);
    if (kq.tanCongThang) this.chiem(nuoc, t);
    return '';
  }

  public tuyenChien(a: string, b: string): void {
    this.ngoaiGiao.tuyenChien(a, b);
    this.ghi(`${a} tuyen chien ${b}`);
  }
  /**
   * Dam phan, ben `a` tra vang. Khong du vang thi khong dam phan duoc. Dang chien ma `b`
   * manh hon ro (tu `ai.ti_le_tuyen_chien` lan) thi `b` khong chiu ngoi xuong - ben thua
   * khong tu thoat chien tranh bang tien duoc.
   */
  public damPhan(a: string, b: string): boolean {
    const n = this.nuoc(a);
    if (n.vang < this.du.ngoaiGiao.damPhan.vang) return false;
    const dangChien = this.ngoaiGiao.trangThai(a, b) === 'chien_tranh';
    if (dangChien && this.suc(b) >= this.du.ai.tiLeTuyenChien * Math.max(1, this.suc(a))) return false;
    n.vang -= this.du.ngoaiGiao.damPhan.vang;
    this.ngoaiGiao.damPhan(a, b);
    return true;
  }
  public deDoa(a: string, b: string): boolean {
    const thang = this.ngoaiGiao.deDoa(a, b, this.suc(a) / Math.max(1, this.suc(b)));
    if (thang) {
      const nop = Math.min(this.nuoc(b).vang, this.du.ngoaiGiao.deDoa.congNap);
      this.nuoc(b).vang -= nop;
      this.nuoc(a).vang += nop;
    }
    return thang;
  }
  /** Nguoi choi doi vang thang ra anh huong van hoa. */
  public dauTuVanHoa(vang: number): void {
    const ta = this.nuoc(this.ta);
    const chi = Math.max(0, Math.min(vang, ta.vang));
    ta.vang -= chi;
    ta.vanHoa += chi * this.du.vanHoa.moiVangDauTu;
  }
  /** Chon mot lua chon cua the bat on. Khong du vang thi tu choi - tra ve false. */
  public chonBatOn(id: string): boolean {
    const ta = this.nuoc(this.ta);
    const lc = this.batOn.luaChon.find((l) => l.id === id);
    if (lc === undefined || ta.vang + lc.vang < 0 || this.batOn.chon(id) === undefined) return false;
    ta.vang += lc.vang;
    ta.vanHoa += lc.vanHoa;
    ta.quan.splice(0, lc.matDoi);
    return true;
  }

  /** Mot gio game troi qua. */
  public gioTiep(so: SoNuocTa): void {
    if (this.kq.trangThai !== 'dang_choi') return;
    this.soGio += 1;
    const du = this.du;
    for (const n of this.dsNuoc) {
      if (!n.conSong) continue;
      const soTinh = this.tinhCua(n.id).length;
      if (n.nguoiChoi) {
        n.doi = so.doi;
        const heSoThue = this.batOn.gioGiamThue > 0 ? du.kinhTe.giamThueHeSo : 1;
        n.vang += so.soNha * du.kinhTe.vangMoiNha * heSoThue + soTinh * du.kinhTe.vangMoiTinh;
        n.vanHoa += so.soNha * du.vanHoa.moiNha + so.soCongNgheXong * du.vanHoa.moiCongNghe + soTinh * du.vanHoa.moiTinh;
      } else {
        n.doi = du.doiAiTheoGio.filter((g) => g <= this.soGio).length;
        n.vang += soTinh * du.kinhTe.vangMoiTinhAi + du.kinhTe.vangThuDoAi;
        n.vanHoa += soTinh * du.vanHoa.moiTinhAi + n.doi * du.vanHoa.moiDoiAi;
      }
      for (const m of this.conSong) {
        if (m !== n.id && this.ngoaiGiao.dangThuongMai(n.id, m)) n.vang += du.ngoaiGiao.thuongMai.vangMoiGio;
      }
      const nganSach = n.vang * (n.nguoiChoi ? this.tiLeChiQuanTa : du.quan.tiLeChiQuan);
      // Tran quan theo dat: nuoi quan bang tinh, co ban + moi tinh.
      const tran = du.quan.quanCoBan + du.quan.quanMoiTinh * soTinh;
      const mua = muaQuan(n.quan, nganSach, doiMuaDuoc(this.tran, n.doi), tran, n.dem, this.tran);
      n.vang -= nganSach - mua.vangCon;
      n.quan = mua.quan;
      n.dem = mua.dem;
      if (n.gioNghi > 0) n.gioNghi -= 1;
    }
    for (const id of this.conSong) {
      if (id !== this.ta && this.nuoc(id).conSong) aiHanhDong(this, id, this.rng);
    }
    if (this.kq.trangThai !== 'dang_choi') return;
    this.ngoaiGiao.gio(this.conSong);
    this.xetBatOn(so);
    if (this.kq.trangThai === 'dang_choi') {
      const x = xetThang(du, this.soGio, this.nuoc(this.ta), this.dsNuoc, so, this.ngoaiGiao);
      if (x.phieu >= 0) this.ghi(`bau minh chu: ${String(x.phieu)}/${String(x.soNuocKhac)} phieu`);
      if (x.kieu !== '') this.ket('thang', x.kieu);
    }
    if (this.kq.trangThai === 'dang_choi' && this.soGio >= du.thang.gioToiDa) this.ket('het_gio', '');
  }

  private xetBatOn(so: SoNuocTa): void {
    const ta = this.ta;
    const dangChien = this.conSong.some((n) => n !== ta && this.ngoaiGiao.trangThai(ta, n) === 'chien_tranh');
    const kq = this.batOn.gio({ thieuLuongThuc: so.thieuLuongThuc, dangChien, theDangLap: so.theDangLap });
    if (kq === 'sup') this.ket('thua', 'sup_do');
    if (kq !== 'noi_loan') return;
    const mat = this.tinhCua(ta).filter((t) => this.tinhTheoId.get(t)?.thuDo !== true).sort(soChuoi).pop();
    if (mat === undefined) {
      this.ket('thua', 'sup_do');
      return;
    }
    this.chuTinh.set(mat, '');
    this.quanTrungLap.set(mat, [...this.du.quan.quanTrungLap]);
    this.batOn.matTinh();
    this.ghi(`noi loan: mat ${mat}`);
  }

  private chiem(nuoc: string, t: Tinh): void {
    const cu = this.chu(t.id);
    this.chuTinh.set(t.id, nuoc);
    this.quanTrungLap.delete(t.id);
    if (cu === '') return;
    if (cu === this.ta) this.batOn.matTinh();
    if (!t.thuDo || t.nuoc !== cu) return;
    // Mat thu do: nuoc do bi xoa so, moi tinh con lai ve tay ben chiem.
    const n = this.nuoc(cu);
    n.conSong = false;
    n.quan = [];
    for (const x of this.tinhCua(cu)) this.chuTinh.set(x, nuoc);
    this.ghi(`${cu} mat thu do vao tay ${nuoc}`);
    if (cu === this.ta) this.ket('thua', 'mat_thu_do');
  }

  private ket(trangThai: KetQuaVan['trangThai'], kieu: KetQuaVan['kieu']): void {
    this.kq = { trangThai, kieu, gio: this.soGio };
    this.ghi(`ket thuc: ${trangThai} ${kieu}`);
  }

  private ghi(chu: string): void {
    this.nhatKy.push(`gio ${String(this.soGio)}: ${chu}`);
  }
}

/** So sanh chuoi theo ma ky tu - khong phu thuoc ngon ngu may (luat tat dinh cua src/sim/). */
const soChuoi = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
