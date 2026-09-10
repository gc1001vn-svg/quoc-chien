/**
 * Bang cong trinh: mot dong moi loai nha, bam la camera bay toi cai tiep theo.
 *
 * VI SAO CAN: ban do 96x96 co gan tram cong trinh. O muc thu nho nhat man hinh chi thay 39
 * o, ma ca van chi co sau coi xay va bon xuong cua - tim bang mat khong bao gio ra. Chu du
 * an bao "khong thay gieng, mo, xuong" BON lan lien; ba lan truoc chua chua dung goc: sprite
 * van o do va van duoc ve dung, cai thieu la DUONG DEN.
 *
 * Bam lai cung mot dong thi sang cai KE TIEP cung loai, xoay vong - xem het sau cai coi xay
 * bang sau lan bam.
 */
import type { ThanhPho } from '../sim/city/City.ts';
import type { O } from '../sim/city/BanDo.ts';

export class BangCongTrinh {
  private readonly goc: HTMLDivElement;
  private readonly nut: HTMLButtonElement;
  private readonly tp: ThanhPho;
  private readonly bay: (o: O, hien: string) => void;
  /** Loai nha -> da xem toi cai thu may. Nho de bam lai thi sang cai ke tiep. */
  private readonly daXem = new Map<string, number>();
  private hien = false;

  constructor(chaMe: HTMLElement, tp: ThanhPho, bay: (o: O, hien: string) => void) {
    this.tp = tp;
    this.bay = bay;

    this.goc = document.createElement('div');
    this.goc.className = 'cong-trinh';
    this.goc.hidden = true;
    chaMe.appendChild(this.goc);

    this.nut = document.createElement('button');
    this.nut.type = 'button';
    this.nut.className = 'cong-trinh-nut';
    this.nut.textContent = '⌂';
    this.nut.title = 'Danh sách công trình';
    this.nut.addEventListener('click', () => { this.batTat(); });
    chaMe.appendChild(this.nut);

    // `?bang=1` mo san bang - de may ao chup duoc no ma khong phai gia bo cham tay.
    if (new URLSearchParams(window.location.search).get('bang') === '1') this.batTat();
  }

  /** Bat hay tat bang. Ve lai moi lan bat: thong doc co the da xay them nha. */
  batTat(): void {
    this.hien = !this.hien;
    this.goc.hidden = !this.hien;
    this.nut.dataset['bat'] = this.hien ? 'co' : 'khong';
    if (this.hien) this.ve();
  }

  private ve(): void {
    this.goc.replaceChildren();
    for (const def of this.tp.dsNha) {
      const cho: readonly O[] = this.tp.viTriNha(def.ten);
      if (cho.length === 0) continue;
      const dong: HTMLButtonElement = document.createElement('button');
      dong.type = 'button';
      dong.innerHTML = `<b>${def.hien}</b><span>${String(cho.length)}</span>`;
      dong.addEventListener('click', () => { this.toiCaiKeTiep(def.ten, def.hien); });
      this.goc.appendChild(dong);
    }
  }

  /** Bay toi cai ke tiep cua loai `ten`, xoay vong khi het. */
  private toiCaiKeTiep(ten: string, hien: string): void {
    const cho: readonly O[] = this.tp.viTriNha(ten);
    if (cho.length === 0) return;
    const i: number = (this.daXem.get(ten) ?? -1) + 1;
    this.daXem.set(ten, i % cho.length);
    this.bay(cho[i % cho.length] as O, hien);
  }
}
