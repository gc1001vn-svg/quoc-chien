/**
 * BA dong su kien gan nhat, goc trai duoi - AN san, bam nut `☰` moi hien.
 *
 * Bon dong o 62 % chieu rong lan het nua duoi man hinh iPhone - chu du an bao "che het
 * man hinh" ngay 10/09. Ba dong, moi dong mot hang, 42 % chieu rong (xem `style.css`).
 *
 * Ve lai chi khi nhat ky DAI RA, khong ve moi khung: 60 lan mot giay dung `textContent`
 * cho vai chuc dong la tu tay lam rot fps.
 */
import type { NhatKy } from '../sim/decision/NhatKy.ts';

export class BangSuKien {
  private readonly goc: HTMLDivElement;
  private readonly nut: HTMLButtonElement;
  private readonly nhatKy: NhatKy;
  private readonly soDong: number;
  private daVe = -1;
  /** Mo van thi AN, cho man hinh sach. Bam nut moi hien. */
  private hien = false;

  constructor(chaMe: HTMLElement, nhatKy: NhatKy, soDong = 3) {
    this.nhatKy = nhatKy;
    this.soDong = soDong;
    this.goc = document.createElement('div');
    this.goc.className = 'su-kien';
    this.goc.hidden = true;
    chaMe.appendChild(this.goc);

    this.nut = document.createElement('button');
    this.nut.type = 'button';
    this.nut.className = 'su-kien-nut';
    this.nut.textContent = '☰';
    this.nut.title = 'Nhật ký sự kiện';
    this.nut.addEventListener('click', () => { this.batTat(); });
    chaMe.appendChild(this.nut);
  }

  /** Bat hay tat bang su kien. */
  batTat(): void {
    this.hien = !this.hien;
    this.goc.hidden = !this.hien;
    this.nut.dataset['bat'] = this.hien ? 'co' : 'khong';
    // Ve lai ngay: luc an bang khong cap nhat nen no dang cu.
    this.daVe = -1;
    this.capNhat();
  }

  /** Goi moi khung. Tu biet khi nao khong co gi moi de khoi ve lai. */
  capNhat(): void {
    if (!this.hien) return;
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
