/**
 * Nhan fps + nut tat tung lop ve.
 *
 * Co mat tu phien dau theo Luat 2 cua TECH_SPEC muc 1: Tay Vuc sua hieu nang 15 phien
 * roi moi dung cong cu do, va chua ai chay no lan nao. Lan nay do truoc, sua sau.
 *
 * May ao Claude ve bang phan mem nen luon 1-5 fps - so o day chi co nghia tren may that.
 */

/** Bon lop ve tat duoc rieng tung cai de biet lop nao an het thoi gian. */
export type LayerName = 'nen' | 'nha' | 'nguoi' | 'hieuUng';

const NHAN_LOP: Record<LayerName, string> = {
  nen: 'Nền',
  nha: 'Nhà',
  nguoi: 'Người',
  hieuUng: 'Hiệu ứng',
};

/** So khung hinh giu lai de tinh trung vi. Ngan thoi, chi de nhan bot nhay so. */
const CUA_SO = 60;

export class Perf {
  private readonly moc: number[] = [];
  private readonly bat: Record<LayerName, boolean> = {
    nen: true,
    nha: true,
    nguoi: true,
    hieuUng: true,
  };
  private readonly nhan: HTMLDivElement;
  private truoc = 0;
  private ghiChu = '';

  /** @param goc The chua nhan fps va hang nut. Thuong la `document.body`. */
  constructor(goc: HTMLElement) {
    this.nhan = document.createElement('div');
    this.nhan.className = 'perf-nhan';
    goc.appendChild(this.nhan);
    goc.appendChild(this.dungHangNut());
  }

  /** Goi dung mot lan moi khung hinh, ngay dau vong ve. */
  public danhDau(nowMs: number): void {
    if (this.truoc !== 0) {
      this.moc.push(nowMs - this.truoc);
      if (this.moc.length > CUA_SO) this.moc.shift();
    }
    this.truoc = nowMs;
    this.nhan.textContent = `${this.fps().toFixed(0)} fps · ${this.msKhung().toFixed(1)} ms${this.ghiChu}`;
  }

  /** Chu them vao sau nhan fps, vi du so sprite dang ve. */
  public datGhiChu(chu: string): void {
    this.ghiChu = chu === '' ? '' : ` · ${chu}`;
  }

  /** Lop nay con dang ve khong. */
  public dangBat(lop: LayerName): boolean {
    return this.bat[lop];
  }

  /** Thoi gian trung vi mot khung hinh, tinh bang mili giay. */
  public msKhung(): number {
    if (this.moc.length === 0) return 0;
    const xep: number[] = [...this.moc].sort((a, b) => a - b);
    return xep[xep.length >> 1] ?? 0;
  }

  /** Khung hinh moi giay, tinh tu thoi gian trung vi. */
  public fps(): number {
    const ms: number = this.msKhung();
    return ms === 0 ? 0 : 1000 / ms;
  }

  /** Xoa het so da do, bat dau do lai tu dau. */
  public datLai(): void {
    this.moc.length = 0;
    this.truoc = 0;
  }

  private dungHangNut(): HTMLDivElement {
    const hang: HTMLDivElement = document.createElement('div');
    hang.className = 'perf-nut';
    for (const ten of Object.keys(NHAN_LOP) as LayerName[]) {
      const nut: HTMLButtonElement = document.createElement('button');
      nut.type = 'button';
      nut.textContent = NHAN_LOP[ten];
      nut.dataset['bat'] = 'co';
      nut.addEventListener('click', () => {
        this.bat[ten] = !this.bat[ten];
        nut.dataset['bat'] = this.bat[ten] ? 'co' : 'khong';
      });
      hang.appendChild(nut);
    }
    return hang;
  }
}
