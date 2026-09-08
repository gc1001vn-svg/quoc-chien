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

  constructor(tp: ThanhPho, cs: ChinhSach) {
    this.tp = tp;
    this.cs = cs;
  }

  /** Nhung viec da lam, moi nhat o cuoi. */
  get daLam(): readonly ViecDaLam[] {
    return this.nhatKy;
  }

  /** Cap thong doc ngay luc nay. */
  get cap(): Cap {
    return capHienTai(this.cs, this.tp.soNha);
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
    return tk.walker.boCuoc >= this.cs.nguongBoCuoc || tk.walker.dinh >= this.cs.nguongDinh;
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
      if (h.ton > 0 || h.cho < this.cs.nguongCho) continue;
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
