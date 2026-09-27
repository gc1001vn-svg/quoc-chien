/**
 * Bang tinh: cham vao mot tinh tren ban do thi bang nay hien len duoi day man.
 *
 * Hai viec, tuy vao cho vua cham:
 *   - cham o xay dung TRONG cua nuoc minh  -> hien danh sach cong trinh, bam la xay luon
 *   - cham cho khac                        -> hien ten tinh, nuoc, dia hinh, so o xay
 *
 * Khong lam bang o rieng roi bat nguoi choi doi chieu so thu tu: chu du an bam bang mot
 * ngon tay tren iPhone, cham thang vao manh dat muon xay la it buoc nhat.
 */
import type { Tinh } from '../sim/campaign/BanDoTinh.ts';
import type { ChienDich, CongTrinh, LyDoTuChoi } from '../sim/campaign/ChienDich.ts';
import { tanCongTinh } from '../sim/campaign/HienTheGioi.ts';
import type { TheGioi } from '../sim/campaign/TheGioi.ts';

/** Cau chu giai thich vi sao khong xay duoc. */
const LOI: Readonly<Record<string, string>> = {
  'khong-phai-cua-ta': 'Tỉnh này không thuộc nước ta.',
  'o-da-co-chu': 'Ô này đã có công trình rồi.',
  'sai-dia-hinh': 'Địa hình tỉnh này không xây được công trình đó.',
  'khong-co-o': 'Không có ô xây dựng ở đây.',
};

export class BangTinh {
  private readonly goc: HTMLDivElement;
  private readonly cd: ChienDich;
  /** Goi lai sau khi dat duoc mot lenh xay, de man ban do ve lai ngay. */
  private readonly sauKhiXay: () => void;
  private readonly tg: TheGioi;

  constructor(chaMe: HTMLElement, cd: ChienDich, tg: TheGioi, sauKhiXay: () => void) {
    this.cd = cd;
    this.tg = tg;
    this.sauKhiXay = sauKhiXay;
    this.goc = document.createElement('div');
    this.goc.className = 'bang-tinh';
    this.goc.hidden = true;
    chaMe.appendChild(this.goc);
  }

  /** Dong bang. */
  public dong(): void {
    this.goc.hidden = true;
    this.goc.replaceChildren();
  }

  /**
   * Mo bang cho mot tinh.
   *
   * @param oXay Chi so o xay dung vua cham, `-1` neu cham vao cho khac trong tinh.
   */
  public mo(t: Tinh, oXay: number): void {
    this.goc.replaceChildren();
    this.goc.hidden = false;
    this.goc.appendChild(this.dauBang(t));
    if (this.cd.chu(t.id) !== this.cd.nuocCuaTa()) this.goc.appendChild(this.nutTanCong(t));

    const tt = oXay >= 0 ? this.cd.oCua(t.id, oXay) : undefined;
    if (tt !== undefined && tt.dangXay !== '') {
      this.goc.appendChild(dong(`Đang xây · còn ${String(tt.conLai)} lượt`));
      return;
    }
    if (tt !== undefined && tt.congTrinh !== '') {
      const c = this.cd.xayDuocGi(t.id).find((x) => x.id === tt.congTrinh);
      this.goc.appendChild(dong(`Đã xây: ${c?.hien ?? tt.congTrinh}`));
      return;
    }
    if (tt === undefined) {
      const d = this.cd.demTinh(t.id);
      this.goc.appendChild(
        dong(`${String(d.trong)} ô trống · ${String(d.dangXay)} đang xây · ${String(d.daXay)} đã xây`),
      );
      return;
    }
    this.chonCongTrinh(t, oXay);
  }

  /** Dong dau bang: ten tinh, nuoc, dia hinh, va nut dong. */
  private dauBang(t: Tinh): HTMLDivElement {
    const d: HTMLDivElement = document.createElement('div');
    d.className = 'bang-tinh-dau';
    d.innerHTML =
      `<b>${t.hien}${t.thuDo ? ' ★' : ''}</b>` +
      `<span>${this.cd.tenNuoc(this.cd.chu(t.id))} · ${t.hienDiaHinh} · ${String(t.soOXay)} ô xây</span>`;
    const x: HTMLButtonElement = document.createElement('button');
    x.type = 'button';
    x.className = 'bang-tinh-dong';
    x.textContent = '✕';
    x.addEventListener('click', () => { this.dong(); });
    d.appendChild(x);
    return d;
  }

  /** Nut tan cong tinh khong phai cua ta (Phase 11B). Khoa thi ghi ly do ngay tren nut. */
  private nutTanCong(t: Tinh): HTMLButtonElement {
    const tc = tanCongTinh(this.tg, t.id);
    const nut: HTMLButtonElement = document.createElement('button');
    nut.type = 'button';
    nut.className = 'bang-tinh-nut';
    nut.disabled = !tc.nut.duoc;
    nut.innerHTML = tc.nut.duoc
      ? `<b>⚔ Tấn công</b><span>dự đoán thắng ~${String(Math.round(tc.xacSuat * 100))}%</span>`
      : `<b>⚔ Tấn công</b><span>${tc.nut.lyDo}</span>`;
    nut.addEventListener('click', () => { this.tanCong(t); });
    return nut;
  }

  private tanCong(t: Tinh): void {
    const ta = this.tg.ta;
    const truoc: number = this.tg.nuoc(ta).quan.length;
    if (this.tg.tanCong(ta, t.id) !== '') return;
    const mat: number = truoc - this.tg.nuoc(ta).quan.length;
    const chiem: boolean = this.tg.chu(t.id) === ta;
    this.mo(t, -1);
    this.goc.appendChild(dong(`${chiem ? `Chiếm được ${t.hien}!` : 'Đánh thua, phải rút.'} Ta mất ${String(mat)} đội.`));
    this.sauKhiXay();
  }

  /** Danh sach cong trinh xay duoc tren o nay, moi cai mot nut. */
  private chonCongTrinh(t: Tinh, oXay: number): void {
    const chon: readonly CongTrinh[] = this.cd.xayDuocGi(t.id);
    if (this.cd.chu(t.id) !== this.cd.nuocCuaTa()) {
      this.goc.appendChild(dong(LOI['khong-phai-cua-ta'] ?? ''));
      return;
    }
    for (const c of chon) {
      const nut: HTMLButtonElement = document.createElement('button');
      nut.type = 'button';
      nut.className = 'bang-tinh-nut';
      nut.innerHTML = `<b>${c.hien}</b><span>${String(c.luot)} lượt · ${c.mo_ta}</span>`;
      nut.addEventListener('click', () => { this.xay(t, oXay, c); });
      this.goc.appendChild(nut);
    }
  }

  /** Dat lenh xay roi bao lai ket qua ngay tren bang. */
  private xay(t: Tinh, oXay: number, c: CongTrinh): void {
    const ly: LyDoTuChoi = this.cd.datLenhXay(t.id, oXay, c.id);
    this.goc.replaceChildren();
    this.goc.appendChild(this.dauBang(t));
    if (ly === '') {
      this.goc.appendChild(dong(`Bắt đầu xây ${c.hien} · ${String(c.luot)} lượt`));
      this.sauKhiXay();
    } else {
      this.goc.appendChild(dong(LOI[ly] ?? 'Không xây được.'));
    }
  }
}

/** Mot dong chu trong bang. */
function dong(chu: string): HTMLParagraphElement {
  const p: HTMLParagraphElement = document.createElement('p');
  p.className = 'bang-tinh-chu';
  p.textContent = chu;
  return p;
}
