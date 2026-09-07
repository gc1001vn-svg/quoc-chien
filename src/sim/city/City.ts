/**
 * Thanh pho: gom kho chung, danh sach nha, va bo dem de cham diem.
 *
 * TypeScript thuan (TECH_SPEC muc 1, luat 1): khong doc file, khong ve gi. Nguoi goi doc
 * ba file JSON roi dua object vao. Nho vay `npm run sim:thu` chay 10 gio game trong Node
 * trong vai giay, va toan bo luat kinh te test tu dong duoc.
 */
import { DongHo, NHIP_MOI_GIO } from '../Clock.ts';
import type { BoDem, DinhNghiaNha } from './Buildings.ts';
import { docNha, ThuNha } from './Buildings.ts';
import type { DinhNghiaChuoi } from './Chains.ts';
import { docChuoi, kiemTra } from './Chains.ts';
import { LoiDuLieu } from './DocJson.ts';
import type { DinhNghiaHang } from './Wares.ts';
import { docHang, Kho } from './Wares.ts';

/** Bao lau kiem hang hong mot lan. 60 nhip = 6 giay game - du min, khong ton. */
const NHIP_HONG = 60;

/** Ba file JSON con nguyen, chua doc. */
export interface DuLieuTho {
  readonly hang: unknown;
  readonly nha: unknown;
  readonly chuoi: unknown;
}

/** So cua mot loai nha trong mot gio game. */
export interface SoNha {
  readonly ten: string;
  readonly hien: string;
  readonly so: number;
  readonly me: number;
  readonly doi: number;
  readonly tac: number;
}

/** So cua mot mat hang trong mot gio game. */
export interface SoHang {
  readonly ten: string;
  readonly hien: string;
  readonly ton: number;
  readonly tran: number;
  readonly lamRa: number;
  readonly dungHet: number;
  /** So nhip co nha phai dung vi thieu mat hang nay. */
  readonly cho: number;
  /** So nhip co nha phai dung vi kho mat hang nay da day. */
  readonly day: number;
  /** So mon hong di trong gio - khong tinh la "dung het", vi khong ai duoc huong. */
  readonly hong: number;
}

/** Bang so cua mot gio game. */
export interface ThongKe {
  readonly gio: number;
  readonly nha: readonly SoNha[];
  readonly hang: readonly SoHang[];
}

/** Thanh pho song bang so. Chua ve gi len man hinh - Phase 4 moi ve. */
export class ThanhPho implements BoDem {
  readonly kho: Kho;
  readonly dongHo = new DongHo();
  readonly dsHang: readonly DinhNghiaHang[];
  readonly dsNha: readonly DinhNghiaNha[];
  readonly dsChuoi: readonly DinhNghiaChuoi[];

  private readonly nhaThat: ThuNha[] = [];
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

  constructor(tho: DuLieuTho) {
    this.dsHang = docHang(tho.hang);
    this.dsNha = docNha(tho.nha);
    this.dsChuoi = docChuoi(tho.chuoi);

    const loi = kiemTra(this.dsHang, this.dsNha, this.dsChuoi);
    if (loi.length > 0) throw new LoiDuLieu('data/', `\n  - ${loi.join('\n  - ')}`);

    this.kho = new Kho(this.dsHang);
    for (const def of this.dsNha) {
      for (let i = 0; i < def.so; i++) {
        // Lech pha deu nhau tren ca chu ky, de 30 nha dan khong cung an vao mot nhip.
        this.nhaThat.push(new ThuNha(def, Math.floor((i * def.nhip) / def.so)));
      }
    }
  }

  /** Tong so nha co that trong thanh pho. */
  get soNha(): number {
    return this.nhaThat.length;
  }

  /** Chay mot nhip 10 Hz. */
  nhip(): void {
    for (const nha of this.nhaThat) nha.nhip(this.kho, this);
    this.dongHo.chayThang(1);
    if (this.dongHo.soNhip % NHIP_HONG === 0) this.hong();
    if (this.dongHo.soNhip % NHIP_MOI_GIO === 0) this.chotGio();
  }

  /**
   * Hang de lau thi hong. Chay moi `NHIP_HONG` nhip cho re, khong chay tung nhip.
   *
   * Tinh tren ton kho hien tai nen cang tru nhieu cang hao nhieu - do la ly do de xay kho
   * vua du chu khong chat cang. Phan le duoc giu lai (`duHong`) de mon hong cham nhu ca
   * muoi 2 %/gio khong bi lam tron xuong 0 mai mai.
   */
  private hong(): void {
    for (const h of this.dsHang) {
      if (h.hao === 0) continue;
      const phan = (this.kho.co(h.ten) * h.hao) / 100 / (NHIP_MOI_GIO / NHIP_HONG);
      const du = (this.duHong.get(h.ten) ?? 0) + phan;
      const vut = Math.floor(du);
      this.duHong.set(h.ten, du - vut);
      if (vut > 0) this.cong(this.demHong, h.ten, this.kho.bot(h.ten, vut));
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
        so: n.so,
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
    };
    const bo = [this.demMe, this.demDoi, this.demTac, this.demLamRa, this.demDungHet];
    for (const dem of [...bo, this.demCho, this.demDay, this.demHong]) dem.clear();
  }
}

/**
 * Cham diem mot gio game. Tra ve danh sach loi bang chu; rong la dat.
 *
 * Day la dinh nghia cu the cua "khong chuoi nao ket vinh vien" ma `KE_HOACH.md` muc 3
 * doi hoi: trong mot gio game, **moi nha phai chay duoc it nhat mot me** va **moi mat
 * hang phai vua duoc lam ra vua bi dung den**. Nha nao dung im ca tieng, hay hang nao
 * nam yen ca tieng, la chuoi da ket.
 */
export function chamDiem(tk: ThongKe): string[] {
  const loi: string[] = [];
  for (const n of tk.nha) {
    if (n.me === 0) {
      const viSao = n.tac > n.doi ? 'kho day, khong co cho de hang' : 'thieu hang vao';
      loi.push(`nha "${n.ten}" khong chay duoc me nao trong ca gio - ${viSao}`);
    }
  }
  for (const h of tk.hang) {
    if (h.ton < 0) loi.push(`hang "${h.ten}" am: ${String(h.ton)}`);
    if (h.lamRa === 0) loi.push(`hang "${h.ten}" ca gio khong ai lam ra`);
    if (h.dungHet === 0) loi.push(`hang "${h.ten}" ca gio khong ai dung den`);
  }
  return loi;
}
