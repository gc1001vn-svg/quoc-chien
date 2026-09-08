/**
 * Tam chan the quyet dinh: truot len tu day man, thanh pho van nhin thay phia tren.
 *
 * Dung sim lai luc hien (GAME_SPEC muc 7) va tra lai dung toc do cu luc dong - khong tu
 * dat ve 1x, nguoi choi dang chay 4x thi bam xong phai duoc chay tiep 4x.
 *
 * Dung MOT lan luc mo trang roi chi bat/tat `hidden`: dung lai DOM moi lan hien the thi
 * moi van vai chuc the la vai chuc cum nut mo coi con dinh listener.
 */
import type { LuaChon, The } from '../sim/decision/Engine.ts';
import type { DongHo, TocDo } from '../sim/Clock.ts';

export class TheQuyetDinh {
  private readonly goc: HTMLDivElement;
  private readonly tieuDe: HTMLParagraphElement;
  private readonly hangNut: HTMLDivElement;
  private readonly dongHo: DongHo;
  /** Toc do truoc luc hien the, de tra lai dung muc do. */
  private tocDoCu: TocDo = 1;
  private dangHien = false;

  constructor(chaMe: HTMLElement, dongHo: DongHo) {
    this.dongHo = dongHo;
    this.goc = document.createElement('div');
    this.goc.className = 'the-quyet-dinh';
    this.goc.hidden = true;

    this.tieuDe = document.createElement('p');
    this.tieuDe.className = 'the-van';
    this.hangNut = document.createElement('div');
    this.hangNut.className = 'the-nut';

    this.goc.append(this.tieuDe, this.hangNut);
    chaMe.appendChild(this.goc);
  }

  /** Dang co the tren man khong - vong ve hoi de khoi hien hai the chong nhau. */
  get hien(): boolean {
    return this.dangHien;
  }

  /**
   * Hien mot the. `xong` duoc goi voi lua chon nguoi choi bam, sau khi sim da chay lai.
   */
  hienThe(the: The, xong: (lc: LuaChon) => void): void {
    this.tieuDe.textContent = the.van;
    this.hangNut.replaceChildren();
    for (const lc of the.chon) {
      this.hangNut.appendChild(this.dungNut(lc, xong));
    }
    this.tocDoCu = this.dongHo.tocDo;
    this.dongHo.tocDo = 0;
    this.dangHien = true;
    this.goc.hidden = false;
  }

  private dungNut(lc: LuaChon, xong: (lc: LuaChon) => void): HTMLButtonElement {
    const nut: HTMLButtonElement = document.createElement('button');
    nut.type = 'button';
    const van: HTMLSpanElement = document.createElement('span');
    van.className = 'the-nut-van';
    van.textContent = lc.van;
    // Mat duoc va mat mat luon nam ngay tren nut: khong doc duoc danh doi thi moi lua chon
    // deu nhu nhau, va the quyet dinh thanh nut "OK" co ba mau.
    const loi: HTMLSpanElement = document.createElement('span');
    loi.className = 'the-nut-loi';
    loi.textContent = lc.loi;
    nut.append(van, loi);
    nut.addEventListener('click', () => {
      this.dong();
      xong(lc);
    });
    return nut;
  }

  private dong(): void {
    this.goc.hidden = true;
    this.dangHien = false;
    this.dongHo.tocDo = this.tocDoCu;
  }
}
