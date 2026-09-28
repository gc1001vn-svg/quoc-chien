/**
 * Man len doi (Phase 12D): phu kin man khi nuoc ta buoc sang thoi dai moi, dung game toi
 * khi cham.
 *
 * 12C la mot the nho giua man tu tat sau 6 giay - chu du an xem 28/09 van bao "co chut
 * bien chuyen nhung van khong ro, can ro hon han". Nen gio: ten doi chu to, dong
 * "Co dai -> Trung co", va nhung thu moi mo; dong ho ve 0 nhu the quyet dinh, cham moi
 * chay lai o toc do cu.
 */
import { moTaLenDoi, type Doi, type MoTaLenDoi } from '../sim/meta/ThoiDai';
import type { DongHo, TocDo } from '../sim/Clock';

export class TheLenDoi {
  private readonly man: HTMLDivElement;
  private readonly dongHo: DongHo;
  /** Ten hien cac cong nghe cua doi `so` - `CityScene` loc tu cay cong nghe. */
  private readonly congNgheCuaDoi: (so: number) => string[];
  private doiCu: Doi | undefined;
  private tocDoCu: TocDo | undefined;

  constructor(chaMe: HTMLElement, dongHo: DongHo, congNgheCuaDoi: (so: number) => string[]) {
    this.dongHo = dongHo;
    this.congNgheCuaDoi = congNgheCuaDoi;
    this.man = document.createElement('div');
    this.man.className = 'man-len-doi';
    this.man.hidden = true;
    this.man.addEventListener('click', () => { this.tat(); });
    chaMe.appendChild(this.man);
  }

  /** Dang phu man. `CityScene` hoi de khong bat the quyet dinh len tren. */
  get dangHien(): boolean {
    return !this.man.hidden;
  }

  /**
   * Goi moi khung voi doi dang o. Lan dau chi ghi nho, khong hien - tru `?lendoi=1`: hien
   * truoc man len `doiSau` de may ao chup duoc, nhu `?ng=1` cua bang ngoai giao.
   */
  public theoDoi(doi: Doi, doiSau: Doi | undefined): void {
    const cu = this.doiCu;
    this.doiCu = doi;
    if (cu === undefined && doiSau !== undefined
      && new URLSearchParams(window.location.search).get('lendoi') === '1') {
      this.hien(moTaLenDoi(doi, doiSau, this.congNgheCuaDoi(doiSau.so)));
    }
    if (cu !== undefined && cu.so !== doi.so) {
      this.hien(moTaLenDoi(cu, doi, this.congNgheCuaDoi(doi.so)));
    }
  }

  private hien(mt: MoTaLenDoi): void {
    const tieuDe: HTMLElement = document.createElement('b');
    tieuDe.textContent = mt.tieuDe;
    const tuDen: HTMLElement = document.createElement('p');
    tuDen.className = 'man-len-doi-tu-den';
    tuDen.textContent = mt.tuDen;
    const ds: HTMLUListElement = document.createElement('ul');
    ds.append(...mt.moi.map((chu) => {
      const li: HTMLLIElement = document.createElement('li');
      li.textContent = chu;
      return li;
    }));
    const nhac: HTMLElement = document.createElement('p');
    nhac.className = 'man-len-doi-nhac';
    nhac.textContent = 'Chạm để tiếp tục';
    this.man.replaceChildren(tieuDe, tuDen, ds, nhac);
    // Lan len doi thu hai khi man con mo (500x) thi giu toc do cu cua lan dau.
    if (this.tocDoCu === undefined) this.tocDoCu = this.dongHo.tocDo;
    this.dongHo.tocDo = 0;
    this.man.hidden = false;
  }

  private tat(): void {
    this.man.hidden = true;
    if (this.tocDoCu !== undefined) this.dongHo.tocDo = this.tocDoCu;
    this.tocDoCu = undefined;
  }
}
