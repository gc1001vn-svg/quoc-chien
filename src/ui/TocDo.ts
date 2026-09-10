/**
 * Nut toc do: dung · 1× · 5× · 10× · 20× · 30×, them 50× khi mo bang `?test=1`.
 *
 * Khong co no thi mot gio game la mot gio THAT o 1x, ma the quyet dinh chi hoi o moc gio -
 * nguoi choi ngoi nhin 60 phut khong ai hoi gi. O 8x con 7,5 phut, o 30x con hai phut.
 * Van mo man o 8x (`TOC_DO_MO_MAN`).
 *
 * The quyet dinh dat `dongHo.tocDo = 0` luc hien; hang nut nay doc lai dong ho moi khung
 * nen nut sang dung theo, khong can ai bao.
 */
import { TOC_DO, TOC_DO_THU, type DongHo, type TocDo } from '../sim/Clock.ts';

/** Mo bang `?test=1` thi hang nut co them muc 50x. Ban choi that khong co. */
function dangThuGame(): boolean {
  return new URLSearchParams(window.location.search).get('test') === '1';
}

export class HangTocDo {
  private readonly dongHo: DongHo;
  private readonly nut: HTMLButtonElement[] = [];
  private daVe: TocDo | undefined;

  constructor(chaMe: HTMLElement, dongHo: DongHo) {
    this.dongHo = dongHo;
    const hang: HTMLDivElement = document.createElement('div');
    hang.className = 'toc-do';
    const muc50: readonly TocDo[] = dangThuGame() ? [TOC_DO_THU] : [];
    for (const muc of [...TOC_DO, ...muc50]) {
      const n: HTMLButtonElement = document.createElement('button');
      n.type = 'button';
      n.textContent = muc === 0 ? '❚❚' : `${String(muc)}×`;
      n.addEventListener('click', () => {
        this.dongHo.tocDo = muc;
      });
      this.nut.push(n);
      hang.appendChild(n);
    }
    chaMe.appendChild(hang);
  }

  /** Muc toc do cua nut thu `i`. Nut cuoi la 50x khi dang thu game. */
  private mucCua(i: number): TocDo {
    return TOC_DO[i] ?? TOC_DO_THU;
  }

  /** Goi moi khung. Chi ve lai khi toc do doi that. */
  capNhat(): void {
    const muc: TocDo = this.dongHo.tocDo;
    if (muc === this.daVe) return;
    this.daVe = muc;
    for (const [i, n] of this.nut.entries()) {
      n.dataset['bat'] = this.mucCua(i) === muc ? 'co' : 'khong';
    }
  }
}
