/**
 * Thanh pho: gom kho chung, danh sach nha, va bo dem de cham diem.
 *
 * TypeScript thuan (TECH_SPEC muc 1, luat 1): khong doc file, khong ve gi. Nguoi goi doc
 * ba file JSON roi dua object vao. Nho vay `npm run sim:thu` chay 10 gio game trong Node
 * trong vai giay, va toan bo luat kinh te test tu dong duoc.
 */
import { DongHo, NHIP_MOI_GIO } from '../Clock.ts';
import { Rng } from '../../core/Rng.ts';
import type { BanDo, O } from './BanDo.ts';
import { chenVat, congRaDuong, datMotNha, sinhBanDo } from './BanDo.ts';
import { choKhoMoi, dungNha, veKho } from './XayThem.ts';
import type { BoDem, DinhNghiaNha, Giao } from './Buildings.ts';
import { docNha, ThuNha } from './Buildings.ts';
import type { DinhNghiaChuoi } from './Chains.ts';
import { docChuoi, kiemTra } from './Chains.ts';
import { LoiDuLieu } from './DocJson.ts';
import type { DinhNghiaHang } from './Wares.ts';
import { docHang, hangHong, Kho } from './Wares.ts';
import type { CauHinhWalker, Walker } from './Walkers.ts';
import { docWalker, DoiWalker } from './Walkers.ts';

/** Bao lau kiem hang hong mot lan. 60 nhip = 6 giay game - du min, khong ton. */
const NHIP_HONG = 60;

/** Nam file JSON con nguyen, chua doc. */
export interface DuLieuTho {
  readonly hang: unknown;
  readonly nha: unknown;
  readonly chuoi: unknown;
  /** `data/thanh_pho_demo.json` - de sinh ban do va biet duong nam o dau. */
  readonly banDo: unknown;
  /** `data/walkers.json`. */
  readonly walker: unknown;
}

import type { ThongKe } from './Cham.ts';

/**
 * Duoc goi moi khi chot xong mot gio game - Phase 5 la thong doc. Khai o day chu khong
 * import `Governor`: `city/` khong duoc biet gi ve `autoplay/`, nguoc lai thi duoc.
 */
export interface ThongDoc {
  moiGio(): void;
}

/** Thanh pho song bang so, hang di bang nguoi vac. */
export class ThanhPho implements BoDem, Giao {
  readonly kho: Kho;
  readonly banDo: BanDo;
  readonly doiWalker: DoiWalker;
  readonly dongHo = new DongHo();
  readonly dsHang: readonly DinhNghiaHang[];
  readonly dsNha: readonly DinhNghiaNha[];
  readonly dsChuoi: readonly DinhNghiaChuoi[];

  private readonly nhaThat: ThuNha[] = [];
  /** Day so boc cho dat nha. Song suot van de thong doc xay tiep tu day so do. */
  private readonly rngDat: Rng;
  /** Thong doc da xay them bao nhieu nha moi loai. */
  private readonly demXay = new Map<string, number>();
  private readonly demMe = new Map<string, number>();
  private readonly demDoi = new Map<string, number>();
  private readonly demTac = new Map<string, number>();
  private readonly demLamRa = new Map<string, number>();
  private readonly demDungHet = new Map<string, number>();
  private readonly demCho = new Map<string, number>();
  private readonly demDay = new Map<string, number>();
  private readonly demHong = new Map<string, number>();
  /** Phan le chua du mot mon de vut di. Giu lai de hong 2 %/gio khong bi lam tron thanh 0. */
  private readonly duHong = new Map<string, number>();
  private gioTruoc: ThongKe | undefined;
  private thongDoc: ThongDoc | undefined;
  private readonly cauHinh: CauHinhWalker;

  constructor(tho: DuLieuTho) {
    this.dsHang = docHang(tho.hang);
    this.dsNha = docNha(tho.nha);
    this.dsChuoi = docChuoi(tho.chuoi);
    this.cauHinh = docWalker(tho.walker);

    const loi = kiemTra(this.dsHang, this.dsNha, this.dsChuoi);
    if (loi.length > 0) throw new LoiDuLieu('data/', `\n  - ${loi.join('\n  - ')}`);

    this.kho = new Kho(this.dsHang);
    this.banDo = sinhBanDo(tho.banDo as Parameters<typeof sinhBanDo>[0]);

    // Boc tung o mot chu khong dat mot the: thong doc con xay tiep luc dang chay, nen
    // day so `rngDat` phai song sau constructor. Cung hat giong, cung ban do.
    // O chiem lay THANG tu `banDo.daChiem` - chung mot tap voi vat the trang tri, khong
    // thi nha kinh te dat de len cay va nha cua ban do.
    this.rngDat = new Rng(this.cauHinh.hatGiongDatNha);
    const tongNha: number = this.dsNha.reduce((t, n) => t + n.so, 0);
    const cho: O[] = [];
    for (let i = 0; i < tongNha; i += 1) {
      const o: O | undefined = datMotNha(this.banDo, this.banDo.daChiem, this.rngDat);
      if (o === undefined) break;
      cho.push(o);
    }
    if (cho.length < tongNha) {
      throw new LoiDuLieu('ban do', `chi dat duoc ${String(cho.length)}/${String(tongNha)} nha`);
    }

    let k = 0;
    for (const def of this.dsNha) {
      for (let i = 0; i < def.so; i++) {
        const o: O = cho[k] as O;
        // Lech pha deu nhau tren ca chu ky, de 30 nha dan khong cung an vao mot nhip.
        const nha = new ThuNha(
          def, k, Math.floor((i * def.nhip) / def.so),
          o, congRaDuong(o, this.banDo.duongCach), this.cauHinh.tranRieng,
        );
        // Mo van voi mot chuyen hang san trong nha, khong thi ca thanh pho dung im cho
        // nguoi dau tien di bo tu kho ve.
        for (const m of def.vao) nha.nhan(m.hang, this.cauHinh.moiChuyen);
        chenVat(this.banDo, { a: o.a, b: o.b, ten: def.sprite, o: 1 });
        this.nhaThat.push(nha);
        k += 1;
      }
    }

    // Kho chung dat o nga tu gan giua ban do nhat: moi nha deu di toi duoc.
    const c: number = this.banDo.duongCach;
    const giua: number = Math.round(this.banDo.canh / 2 / c) * c;
    this.doiWalker = new DoiWalker(
      { a: giua, b: giua }, c, this.cauHinh.nhipMoiBuoc, this.cauHinh.buocToiDa,
    );
    veKho(this.banDo, { a: giua, b: giua });
  }

  /** Thong doc xay them mot nha loai `ten`. Tra ve co xay duoc khong. */
  xayNha(ten: string): boolean {
    const def: DinhNghiaNha | undefined = this.dsNha.find((n) => n.ten === ten);
    if (def === undefined) return false;
    const nha: ThuNha | undefined = dungNha(
      def, this.nhaThat.length, this.banDo, this.rngDat,
      this.cauHinh.tranRieng, this.cauHinh.moiChuyen,
    );
    if (nha === undefined) return false;
    this.nhaThat.push(nha);
    this.demXay.set(ten, (this.demXay.get(ten) ?? 0) + 1);
    return true;
  }

  /** Thong doc xay them mot kho o nga tu xa cac kho cu nhat. */
  xayKho(): boolean {
    const tot: O | undefined = choKhoMoi(this.banDo, this.doiWalker.danhSachKho);
    if (tot === undefined) return false;
    this.doiWalker.themKho(tot);
    veKho(this.banDo, tot);
    return true;
  }

  /** Da xay them bao nhieu nha loai `ten` tu dau van. */
  soDaXay(ten: string): number {
    return this.demXay.get(ten) ?? 0;
  }

  /** Giao thanh pho cho mot thong doc. Khong goi thi thanh pho dung yen nhu Phase 4. */
  datThongDoc(td: ThongDoc): void { this.thongDoc = td; }

  /**
   * Chay san mot doan truoc khi ai nhin thay. Khong co no thi kho nha nao cung day, gan
   * nhu khong ai phai di bo, va phai cho hang gio THAT moi thay nguoi tren duong.
   */
  moDau(): void {
    this.chay(this.cauHinh.nhipMoDau);
  }

  // --- Giao: `ThuNha` goi len xin nguoi vac hang. ---

  xinLay(nha: ThuNha, hang: string): boolean {
    // Kho khong co mon do thi dung cu nguoi di - da bi ket cung mot lan vi cho nay:
    // 400 nguoi di lay hang tu cai kho rong, khong con cho cho nguoi CHO HANG TOI kho,
    // nen kho mai mai rong. Nguoi giao hang phai luon duoc uu tien hon nguoi di lay.
    if (this.kho.co(hang) === 0) return false;
    if (this.doiWalker.soViec('lay') >= this.cauHinh.tranLay) return false;
    this.doiWalker.phat(nha.chiSo, nha.cong, 'lay', hang, 0);
    return true;
  }

  xinGiao(nha: ThuNha, hang: string, so: number): boolean {
    if (this.doiWalker.soViec('giao') >= this.cauHinh.tranGiao) return false;
    // Hang len vai nguoi NGAY luc phat, khong de lai trong nha: de lai thi no vua nam
    // trong kho rieng vua nam tren duong, dem hai lan.
    const mang: number = nha.bot(hang, Math.min(so, this.cauHinh.moiChuyen));
    if (mang === 0) return false;
    this.doiWalker.phat(nha.chiSo, nha.cong, 'giao', hang, mang);
    return true;
  }

  /** Nguoi toi kho chung: tra hang xuong hoac nhan hang len. */
  private oKho = (w: Walker): void => {
    if (w.viec === 'giao') w.so -= this.kho.them(w.hang, w.so);
    else w.so = this.kho.bot(w.hang, this.cauHinh.moiChuyen);
  };

  /** Nguoi ve toi nha: trut het nhung gi con tren vai. */
  private veNha = (w: Walker): void => {
    const nha: ThuNha | undefined = this.nhaThat[w.nha];
    if (nha === undefined) return;
    if (w.so > 0) nha.nhan(w.hang, w.so);
    nha.dangLay.delete(w.hang);
  };

  /** Tong so nha co that trong thanh pho. */
  get soNha(): number {
    return this.nhaThat.length;
  }

  /** Chay mot nhip 10 Hz. */
  nhip(): void {
    for (const nha of this.nhaThat) nha.nhip(this, this);
    this.doiWalker.nhip(this.oKho, this.veNha);
    this.dongHo.chayThang(1);
    if (this.dongHo.soNhip % NHIP_HONG === 0) this.hong();
    if (this.dongHo.soNhip % NHIP_MOI_GIO === 0) {
      this.chotGio();
      // Sau `chotGio` chu khong truoc: thong doc phai nhin bang so cua gio VUA xong.
      this.thongDoc?.moiGio();
    }
  }

  /** Hang de lau thi hong. Luat nam trong `Wares.ts`; o day chi ghi so vut di. */
  private hong(): void {
    const lan: number = NHIP_MOI_GIO / NHIP_HONG;
    for (const [ten, so] of hangHong(this.kho, this.dsHang, this.duHong, lan)) {
      this.cong(this.demHong, ten, so);
    }
  }

  /** Chay `so` nhip lien tiep. */
  chay(so: number): void {
    for (let i = 0; i < so; i++) this.nhip();
  }

  /** Bang so cua gio game vua xong. `undefined` khi chua chay du mot gio. */
  gioVuaXong(): ThongKe | undefined {
    return this.gioTruoc;
  }

  // --- BoDem: `ThuNha` goi nguoc len day. Khong goi tay tu ben ngoai. ---

  meXong(tenNha: string): void {
    this.cong(this.demMe, tenNha, 1);
  }

  doi(tenNha: string, hang: string): void {
    this.cong(this.demDoi, tenNha, 1);
    this.cong(this.demCho, hang, 1);
  }

  tac(tenNha: string, hang: string): void {
    this.cong(this.demTac, tenNha, 1);
    this.cong(this.demDay, hang, 1);
  }

  lamRa(hang: string, so: number): void {
    this.cong(this.demLamRa, hang, so);
  }

  dungHet(hang: string, so: number): void {
    this.cong(this.demDungHet, hang, so);
  }

  private cong(dem: Map<string, number>, khoa: string, so: number): void {
    dem.set(khoa, (dem.get(khoa) ?? 0) + so);
  }

  /** Chot bang so cua gio vua xong roi xoa bo dem cho gio moi. */
  private chotGio(): void {
    this.gioTruoc = {
      gio: this.dongHo.soNhip / NHIP_MOI_GIO,
      nha: this.dsNha.map((n) => ({
        ten: n.ten,
        hien: n.hien,
        // So THAT: thong doc xay them thi cot nay phai noi len dieu do.
        so: n.so + this.soDaXay(n.ten),
        me: this.demMe.get(n.ten) ?? 0,
        doi: this.demDoi.get(n.ten) ?? 0,
        tac: this.demTac.get(n.ten) ?? 0,
      })),
      hang: this.dsHang.map((h) => ({
        ten: h.ten,
        hien: h.hien,
        ton: this.kho.co(h.ten),
        tran: h.tran,
        lamRa: this.demLamRa.get(h.ten) ?? 0,
        dungHet: this.demDungHet.get(h.ten) ?? 0,
        cho: this.demCho.get(h.ten) ?? 0,
        day: this.demDay.get(h.ten) ?? 0,
        hong: this.demHong.get(h.ten) ?? 0,
      })),
      walker: this.doiWalker.chotGio(),
    };
    const bo = [this.demMe, this.demDoi, this.demTac, this.demLamRa, this.demDungHet];
    for (const dem of [...bo, this.demCho, this.demDay, this.demHong]) dem.clear();
  }
}
