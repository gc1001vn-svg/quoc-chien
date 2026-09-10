/**
 * Ghim vang chi thang vao cong trinh vua bay toi.
 *
 * VI SAO CAN: bam bang cong trinh thi camera bay dung toa do, nhung o goc cheo cai gi
 * dung TRUOC thi ve DE LEN cai dung sau. Gieng cao 2,4 hang o nam sau mot day nha dan cao
 * 5,6 hang la mat mui. Chu du an bam nam lan lien va bao "khong co gi het".
 *
 * `VeCanh` da giau tam nhung vat che muc; ghim nay lam not nua con lai - noi cho biet
 * PHAI NHIN VAO DAU. Ghim la the DOM nam tren canvas nen khong bao gio bi che, va khong
 * ton mot sprite nao trong tran 5.000.
 *
 * Style de thang trong `.ts` chu khong vao `src/style.css`: file do nam trong
 * `.claude/file_khoa.txt`, phai hoi chu du an truoc khi dung toi.
 */
import type { O } from '../sim/city/BanDo.ts';

export class Ghim {
  private readonly goc: HTMLDivElement;
  private readonly ten: HTMLSpanElement;
  private muc: O | undefined;

  constructor(chaMe: HTMLElement) {
    this.goc = document.createElement('div');
    this.goc.hidden = true;
    this.goc.style.cssText = [
      'position:absolute', 'z-index:3', 'pointer-events:none',
      'transform:translate(-50%,-100%)', 'text-align:center', 'line-height:1',
    ].join(';');

    this.ten = document.createElement('span');
    this.ten.style.cssText = [
      'display:inline-block', 'background:rgba(8,7,6,0.92)', 'color:#c9a227',
      'border:1px solid #c9a227', 'border-radius:6px', 'padding:3px 8px',
      'font-size:12px', 'white-space:nowrap',
    ].join(';');

    const mui: HTMLSpanElement = document.createElement('span');
    mui.textContent = '▼';
    mui.style.cssText = 'display:block;color:#c9a227;font-size:14px;margin-top:1px';

    this.goc.append(this.ten, mui);
    chaMe.appendChild(this.goc);
  }

  /** O dang duoc soi, `undefined` la khong soi cai nao. */
  layMuc(): O | undefined { return this.muc; }

  /** Ghim vao o `o`, nhan ten `hien`. */
  dat(o: O, hien: string): void {
    this.muc = o;
    this.ten.textContent = hien;
  }

  /**
   * Treo ghim ngay tren NOC cong trinh: `x` la giua sprite, `yNoc` la mep tren cua no,
   * ca hai tinh bang CSS px trong khung.
   *
   * Lay thang hop bao ma `VeCanh` vua do chu khong tu tinh lai tu toa do o: sprite moi loai
   * neo mot kieu (`oy` rieng), tu tinh la ghim treo lech - da lech mot lan 10/09.
   */
  ve(x: number, yNoc: number, rongCss: number, caoCss: number): void {
    this.goc.hidden = false;
    // Kep vao trong khung: coi xay gio cao 4,7 hang o nen noc no tho han len tren mep man,
    // khong kep thi ghim treo ngoai man va bien mat dung luc can nhat.
    this.goc.style.left = `${String(Math.round(kep(x, 34, rongCss - 34)))}px`;
    this.goc.style.top = `${String(Math.round(kep(yNoc, 46, caoCss - 8)))}px`;
  }

  /** Thoi soi. */
  xoa(): void {
    this.muc = undefined;
    this.goc.hidden = true;
  }
}

function kep(x: number, thap: number, cao: number): number {
  return Math.min(Math.max(x, thap), Math.max(thap, cao));
}
