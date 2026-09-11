/**
 * Nhan ten tinh noi tren ban do, va mot dong nho noi ro NUOC TA la nuoc nao.
 *
 * VI SAO CAN: chu du an xem ban do tren iPhone 11/09 va bao "khong thay chu dat nuoc ta
 * dau". Mau mai thanh va manh dat nau co phan biet duoc bon nuoc, nhung khong ai doc ra
 * duoc cai nao la CUA MINH neu khong co chu.
 *
 * Nhan la the DOM nam tren canvas: khong bao gio bi cong trinh che, khong ton mot sprite
 * nao trong tran 5.000, va doc net o moi muc thu phong. Doi lai phai tu doi toa do the
 * gioi sang CSS px moi khung - 28 nhan, khong dang ke.
 */
import type { BanDoTinh, Nuoc, Tinh } from '../sim/campaign/BanDoTinh.ts';

/** Mau chu theo mau phe. Trung lap khong co phe nen dung mau chu thuong. */
const MAU: Readonly<Record<string, string>> = {
  do: '#e8796a',
  la: '#78c47c',
  lam: '#7ab0e8',
  vang: '#e5bc55',
};

/** Nhan treo cao hon tam hex bao nhieu phan mot o nen - cho khoi de len mai thanh. */
const CAO_HON = 1.15;

/** Hex hep hon bay nhieu CSS px thi bot nhan, giu lai tinh cua ta va cac thu do. */
const HEX_HEP_NHAT = 46;

export class NhanTinh {
  private readonly goc: HTMLDivElement;
  private readonly nhan: readonly { el: HTMLSpanElement; tinh: Tinh; luonHien: boolean }[];

  constructor(chaMe: HTMLElement, banDo: BanDoTinh, nuocTa: string) {
    this.goc = document.createElement('div');
    this.goc.className = 'nhan-tinh';
    chaMe.appendChild(this.goc);

    this.nhan = banDo.tinh.map((t: Tinh) => {
      const el: HTMLSpanElement = document.createElement('span');
      el.textContent = t.thuDo ? `${t.hien} ★` : t.hien;
      el.style.color = MAU[t.mau] ?? '#cfc6b4';
      if (t.nuoc === nuocTa) el.dataset['cuaTa'] = 'co';
      this.goc.appendChild(el);
      // Thu do va tinh cua ta van hien ca khi phai bot chu - do la hai thu tra loi cau
      // "dat cua ai o dau", con lai chi la ten.
      return { el, tinh: t, luonHien: t.nuoc === nuocTa || t.thuDo };
    });

    chaMe.appendChild(chuThich(banDo, nuocTa));
  }

  /**
   * Dat lai cho cho tung nhan.
   *
   * Khi mot hex hep hon `HEX_HEP_NHAT` CSS px - iPhone cam DUNG o muc mo man roi vao
   * dung truong hop nay - 28 ten chen nhau thanh mot dam khong doc duoc. Luc do chi giu
   * nhan cua tinh nuoc ta va bon thu do.
   *
   * @param viTri Doi tam mot tinh sang toa do CSS px trong khung ve.
   * @param oPx   Be ngang mot o nen, de biet treo cao len bao nhieu.
   */
  public ve(
    viTri: (t: Tinh) => { x: number; y: number },
    oPx: number,
    tiLe: number,
    rongCss: number,
    caoCss: number,
  ): void {
    const cao: number = CAO_HON * oPx * tiLe;
    const chatCho: boolean = 2 * oPx * tiLe < HEX_HEP_NHAT;
    for (const n of this.nhan) {
      const p = viTri(n.tinh);
      // Nhan ngoai khung thi an han: `translate` ra ngoai van bat trinh duyet dan trang.
      const ngoai: boolean = p.x < -80 || p.x > rongCss + 80 || p.y < -40 || p.y > caoCss + 40
        || (chatCho && !n.luonHien);
      n.el.hidden = ngoai;
      if (ngoai) continue;
      n.el.style.transform = `translate(${String(Math.round(p.x))}px, ${String(Math.round(p.y - cao))}px)`;
    }
  }
}

/** Dong nho o goc: nuoc ta la nuoc nao, kem cham mau cua phe. */
function chuThich(banDo: BanDoTinh, nuocTa: string): HTMLDivElement {
  const d: HTMLDivElement = document.createElement('div');
  d.className = 'nhan-nuoc-ta';
  const n: Nuoc | undefined = banDo.nuoc.find((x: Nuoc) => x.id === nuocTa);
  if (n === undefined) {
    d.textContent = 'Chưa chọn nước';
    return d;
  }
  const cham: HTMLSpanElement = document.createElement('span');
  cham.className = 'nhan-cham';
  cham.style.background = MAU[n.mau] ?? '#cfc6b4';
  d.append(cham, document.createTextNode(`Nước ta: ${n.hien}`));
  return d;
}
