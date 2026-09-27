/**
 * Thanh the gioi (Phase 11B): mot dong so cua nuoc ta o dau man, nut mo bang ngoai giao,
 * va man ket van. Moi man (thanh pho, ban do tinh) co mot cai rieng, cung doc MOT `TheGioi`.
 *
 * Dung DOM mot lan; `capNhat()` goi moi khung, chi ghi lai khi chu doi that.
 * So lay tu `HienTheGioi.ts` - o day khong tu tinh luat nut nao bam duoc.
 */
import type { BanDoTinh } from '../sim/campaign/BanDoTinh';
import { dauTuVanHoa } from '../sim/campaign/HanhDong';
import { hangNgoaiGiao, manKet, thanhTren, type HangNuoc, type Nut } from '../sim/campaign/HienTheGioi';
import type { TheGioi } from '../sim/campaign/TheGioi';

export class ThanhTheGioi {
  private readonly tg: TheGioi;
  private readonly banDo: BanDoTinh;
  private readonly tenDoi: readonly string[];
  private readonly dong: HTMLSpanElement;
  private readonly bang: HTMLDivElement;
  private readonly ket: HTMLDivElement;
  private chuCu = '';
  /** Gio luc dung bang lan cuoi - sang gio moi thi dung lai cho so khop. */
  private gioBang = -1;

  constructor(chaMe: HTMLElement, tg: TheGioi, banDo: BanDoTinh, tenDoi: readonly string[]) {
    this.tg = tg;
    this.banDo = banDo;
    this.tenDoi = tenDoi;
    const thanh: HTMLDivElement = document.createElement('div');
    thanh.className = 'thanh-tg';
    this.dong = document.createElement('span');
    const nut: HTMLButtonElement = nutMoi('🤝 Ngoại giao', () => { this.moDong(); });
    thanh.append(this.dong, nut);

    this.bang = document.createElement('div');
    this.bang.className = 'bang-ng';
    this.bang.hidden = true;
    this.ket = document.createElement('div');
    this.ket.className = 'man-ket';
    this.ket.hidden = true;
    chaMe.append(thanh, this.bang, this.ket);
    // `?ng=1` mo san bang - de may ao chup duoc ma khong phai gia bo cham tay, nhu `?bang=1`.
    if (new URLSearchParams(window.location.search).get('ng') === '1') this.moDong();
  }

  /** Goi moi khung. */
  public capNhat(): void {
    const s = thanhTren(this.tg);
    const chu = `🏛 ${this.tenDoi[s.doi - 1] ?? String(s.doi)} · 💰 ${String(s.vang)} · ⚠ ${String(s.batOn)}/${String(s.nguongThe)} · ⚔ ${String(s.suc)}`
      + ` · ${String(s.soTinh)} tỉnh · giờ ${String(s.gio)}`;
    if (chu !== this.chuCu) {
      this.chuCu = chu;
      this.dong.textContent = chu;
    }
    if (!this.bang.hidden && this.gioBang !== this.tg.gio) this.dungBang();
    if (this.ket.hidden && manKet(this.tg) !== undefined) this.hienKet();
  }

  private moDong(): void {
    this.bang.hidden = !this.bang.hidden;
    if (!this.bang.hidden) this.dungBang();
  }

  private dungBang(): void {
    this.gioBang = this.tg.gio;
    const dau: HTMLDivElement = document.createElement('div');
    dau.className = 'bang-ng-dau';
    dau.innerHTML = '<b>Ngoại giao</b>';
    dau.appendChild(nutMoi('✕', () => { this.bang.hidden = true; }, 'bang-ng-dong'));
    const vh: number = this.tg.du.vanHoa.vangMoiLanDauTu;
    const dauTu: HTMLButtonElement = nutMoi(`🎭 Đầu tư văn hoá (${String(vh)} vàng)`, () => {
      dauTuVanHoa(this.tg, vh);
      this.dungBang();
    }, 'bang-ng-dau-tu');
    dauTu.disabled = this.tg.nuoc(this.tg.ta).vang < vh;
    this.bang.replaceChildren(dau, ...hangNgoaiGiao(this.tg, this.banDo).map((h) => this.hang(h)), dauTu);
  }

  /** Mot nuoc: ten, trang thai, so, bon nut. */
  private hang(h: HangNuoc): HTMLDivElement {
    const d: HTMLDivElement = document.createElement('div');
    d.className = 'bang-ng-hang';
    const ten: HTMLParagraphElement = document.createElement('p');
    ten.innerHTML = `<b>${h.ten}</b> · ${h.conSong ? h.tenTrangThai : 'đã mất nước'}`;
    const so: HTMLParagraphElement = document.createElement('p');
    so.className = 'bang-ng-so';
    so.textContent = `quan hệ ${String(h.quanHe)} · sức ta/họ ${h.tiLeSuc.toFixed(1)}× · ${String(h.soTinh)} tỉnh`
      + (h.thuongMai ? ' · đang buôn bán' : '');
    const ta = this.tg.ta;
    const hangNut: HTMLDivElement = document.createElement('div');
    hangNut.className = 'bang-ng-nut';
    hangNut.append(
      this.nutNG(h.thuongMai ? 'Cắt buôn' : 'Buôn bán', h.nutThuongMai, () => {
        this.tg.ngoaiGiao.datThuongMai(ta, h.id, !h.thuongMai);
      }),
      this.nutNG('Đàm phán', h.nutDamPhan, () => { this.tg.damPhan(ta, h.id); }),
      this.nutNG(h.deDoaThang ? 'Đe doạ' : 'Đe doạ (yếu)', h.nutDeDoa, () => { this.tg.deDoa(ta, h.id); }),
      this.nutNG('Tuyên chiến', h.nutTuyenChien, () => { this.tg.tuyenChien(ta, h.id); }),
    );
    d.append(ten, so, hangNut);
    return d;
  }

  private nutNG(chu: string, nut: Nut, bam: () => void): HTMLButtonElement {
    const b: HTMLButtonElement = nutMoi(chu, () => {
      bam();
      this.dungBang();
    });
    b.disabled = !nut.duoc;
    if (!nut.duoc) b.title = nut.lyDo;
    // Ly do khoa ghi ngay tren nut: iPhone khong co re chuot de doc `title`.
    if (!nut.duoc) b.textContent = `${chu} · ${nut.lyDo}`;
    return b;
  }

  private hienKet(): void {
    const k = manKet(this.tg);
    if (k === undefined) return;
    this.ket.dataset['thang'] = k.thang ? 'co' : 'khong';
    this.ket.innerHTML = `<b>${k.tieuDe}</b><p>${k.moTa}</p><p>Giờ thứ ${String(k.gio)}</p>`;
    this.ket.appendChild(nutMoi('Ván mới', () => { window.location.reload(); }));
    this.ket.hidden = false;
  }
}

function nutMoi(chu: string, bam: () => void, lop = ''): HTMLButtonElement {
  const b: HTMLButtonElement = document.createElement('button');
  b.type = 'button';
  if (lop !== '') b.className = lop;
  b.textContent = chu;
  b.addEventListener('click', bam);
  return b;
}
