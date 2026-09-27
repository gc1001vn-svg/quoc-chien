/**
 * The len doi (Phase 12C): hien giua man khi nuoc ta buoc sang thoi dai moi. Truoc day len
 * doi chi la mot dong trong nhat ky 3 dong - dong "Thong doc xay ..." day troi mat trong vai
 * giay, chu du an bao 27/09 "khong biet da len hay chua".
 *
 * Khong chan choi: tu tat sau `balance.json > giayTheLenDoi` giay that, cham vao la tat som.
 */
import { moTaLenDoi, type Doi } from '../sim/meta/ThoiDai';

export class TheLenDoi {
  private readonly the: HTMLDivElement;
  private readonly msHien: number;
  private doiCu: Doi | undefined;
  /** Luc (ms, `requestAnimationFrame`) the phai tat. 0 = dang tat. */
  private tatLuc = 0;

  constructor(chaMe: HTMLElement, giayHien: number) {
    this.msHien = giayHien * 1000;
    this.the = document.createElement('div');
    this.the.className = 'the-len-doi';
    this.the.hidden = true;
    this.the.addEventListener('click', () => { this.tat(); });
    chaMe.appendChild(this.the);
  }

  /**
   * Goi moi khung voi doi dang o. Lan dau chi ghi nho, khong hien - tru `?lendoi=1`: hien
   * truoc the len `doiSau` de may ao chup duoc, nhu `?ng=1` cua bang ngoai giao.
   */
  public theoDoi(doi: Doi, doiSau: Doi | undefined, now: number): void {
    const cu = this.doiCu;
    this.doiCu = doi;
    if (cu === undefined && doiSau !== undefined
      && new URLSearchParams(window.location.search).get('lendoi') === '1') {
      this.hien(moTaLenDoi(doi, doiSau), now);
    }
    if (cu !== undefined && cu.so !== doi.so) this.hien(moTaLenDoi(cu, doi), now);
    if (this.tatLuc !== 0 && now >= this.tatLuc) this.tat();
  }

  private hien(dong: readonly string[], now: number): void {
    this.the.replaceChildren(...dong.map((chu, i) => {
      const p: HTMLElement = document.createElement(i === 0 ? 'b' : 'span');
      p.textContent = chu;
      return p;
    }));
    this.the.hidden = false;
    this.tatLuc = now + this.msHien;
  }

  private tat(): void {
    this.the.hidden = true;
    this.tatLuc = 0;
  }
}
