/**
 * Vai dong su kien gan nhat, goc man hinh.
 *
 * Ve lai chi khi nhat ky DAI RA, khong ve moi khung: 60 lan mot giay dung `textContent`
 * cho vai chuc dong la tu tay lam rot fps.
 */
import type { NhatKy } from '../sim/decision/NhatKy.ts';

export class BangSuKien {
  private readonly goc: HTMLDivElement;
  private readonly nhatKy: NhatKy;
  private readonly soDong: number;
  private daVe = -1;

  constructor(chaMe: HTMLElement, nhatKy: NhatKy, soDong = 4) {
    this.nhatKy = nhatKy;
    this.soDong = soDong;
    this.goc = document.createElement('div');
    this.goc.className = 'su-kien';
    chaMe.appendChild(this.goc);
  }

  /** Goi moi khung. Tu biet khi nao khong co gi moi de khoi ve lai. */
  capNhat(): void {
    const so: number = this.nhatKy.danhSach.length;
    if (so === this.daVe) return;
    this.daVe = so;

    this.goc.replaceChildren();
    for (const s of this.nhatKy.moiNhat(this.soDong)) {
      const dong: HTMLParagraphElement = document.createElement('p');
      dong.dataset['loai'] = s.loai;
      dong.textContent = `${String(Math.floor(s.gio))}h · ${s.van}`;
      this.goc.appendChild(dong);
    }
  }
}
