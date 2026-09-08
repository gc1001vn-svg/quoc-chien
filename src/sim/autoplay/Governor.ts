/**
 * Thong doc: moi gio game nhin bang so cua gio vua xong roi tu xay them.
 *
 * Hai luat giu cho no khong pha thanh pho:
 *
 * - **Moi lan chi MOT viec.** Xay do dap thi thanh pho phinh nhanh hon toc do nguoi vac
 *   hang kip phuc vu, va nhin bang so khong con biet viec nao gay ra thay doi nao.
 * - **Kho truoc, nha sau.** Duong tac ma xay them nha thi chi them nguoi vao cho dong;
 *   phai no duong ra da roi moi them mieng an.
 *
 * TypeScript thuan (luat 1). Moi con so nam trong `data/policy.json` (luat 2).
 */
import type { SoHang, ThongKe } from '../city/Cham.ts';
import type { ThanhPho } from '../city/City.ts';
import type { Cap, ChinhSach } from './Policy.ts';
import { capHienTai } from './Policy.ts';

/** Mot viec thong doc vua lam, de in ra `sim:thu` va de test doc. */
export interface ViecDaLam {
  readonly gio: number;
  /** `kho` hoac ten loai nha vua xay. */
  readonly viec: string;
  readonly cap: string;
}

export class Governor {
  private readonly tp: ThanhPho;
  private readonly cs: ChinhSach;
  private readonly nhatKy: ViecDaLam[] = [];
  /**
   * Nguong dang chay. Chep tu `ChinhSach` chu khong doc thang: tu Phase 6, the quyet dinh
   * doi duoc nguong luc dang choi ("bat thong doc xay chat tay lai"), ma `data/policy.json`
   * thi khong duoc sua.
   */
  private readonly nguong: Map<string, number>;
  /** The quyet dinh da noi tran them bao nhieu, cong vao tran cua cap hien tai. */
  private themTranNha = 0;
  private themTranKho = 0;

  constructor(tp: ThanhPho, cs: ChinhSach) {
    this.tp = tp;
    this.cs = cs;
    this.nguong = new Map([
      ['nguongBoCuoc', cs.nguongBoCuoc],
      ['nguongDinh', cs.nguongDinh],
      ['nguongCho', cs.nguongCho],
    ]);
  }

  /** Nguong dang chay. Ten khong biet thi nem loi, khong im lang bo qua. */
  layNguong(ten: string): number {
    const so: number | undefined = this.nguong.get(ten);
    if (so === undefined) throw new Error(`khong co nguong "${ten}"`);
    return so;
  }

  /** Cong `delta` vao mot nguong. Am la de tay hon, duong la chat tay hon. Khong xuong duoi 0. */
  doiNguong(ten: string, delta: number): void {
    this.nguong.set(ten, Math.max(0, this.layNguong(ten) + delta));
  }

  /** Noi tran cua cap hien tai. Cong don, giu nguyen ca khi len cap. */
  noiTran(nha: number, kho: number): void {
    this.themTranNha += nha;
    this.themTranKho += kho;
  }

  /** Nhung viec da lam, moi nhat o cuoi. */
  get daLam(): readonly ViecDaLam[] {
    return this.nhatKy;
  }

  /** Cap thong doc ngay luc nay, da cong phan the quyet dinh noi them. */
  get cap(): Cap {
    const c: Cap = capHienTai(this.cs, this.tp.soNha);
    if (this.themTranNha === 0 && this.themTranKho === 0) return c;
    return {
      ten: c.ten, tuNha: c.tuNha,
      tranNha: c.tranNha + this.themTranNha,
      tranKho: c.tranKho + this.themTranKho,
    };
  }

  /** `ThanhPho` goi khi chot xong mot gio game. */
  moiGio(): void {
    const tk: ThongKe | undefined = this.tp.gioVuaXong();
    if (tk === undefined) return;
    if (tk.gio % this.cs.gioMoiLan !== 0) return;

    const cap: Cap = this.cap;
    if (this.canThemKho(tk) && this.tp.doiWalker.soKho < cap.tranKho && this.tp.xayKho()) {
      this.ghi(tk.gio, 'kho', cap);
      return;
    }
    if (this.tp.soNha >= cap.tranNha) return;
    const ten: string | undefined = this.nhaCanXay(tk);
    if (ten !== undefined && this.tp.xayNha(ten)) this.ghi(tk.gio, ten, cap);
  }

  /** Duong da qua tai chua: co nguoi bo cuoc, hoac so nguoi cung luc sat tran. */
  private canThemKho(tk: ThongKe): boolean {
    return tk.walker.boCuoc >= this.layNguong('nguongBoCuoc')
      || tk.walker.dinh >= this.layNguong('nguongDinh');
  }

  /**
   * Loai nha nen xay them, hay `undefined` neu khong thieu gi.
   *
   * Thieu = kho **rong** ma van co nha phai cho mon do. Chi nhin `cho` khong du: mon nao
   * cung co luc nha phai cho mot nhip, nhung kho con hang thi do la ket giao thong chu
   * khong phai thieu cho san xuat - xay them lo banh khong chua duoc.
   */
  private nhaCanXay(tk: ThongKe): string | undefined {
    let thieu: SoHang | undefined;
    for (const h of tk.hang) {
      if (h.ton > 0 || h.cho < this.layNguong('nguongCho')) continue;
      if (thieu === undefined || h.cho > thieu.cho) thieu = h;
    }
    if (thieu === undefined) return undefined;
    const ten: string = thieu.ten;
    return this.tp.dsNha.find((n) => n.ra.some((m) => m.hang === ten))?.ten;
  }

  private ghi(gio: number, viec: string, cap: Cap): void {
    this.nhatKy.push({ gio, viec, cap: cap.ten });
  }
}
