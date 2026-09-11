/**
 * Bang nghien cuu: cay cong nghe, Eureka, thoi dai va the chinh sach (Phase 8).
 *
 * MOT bang hai the chu khong hai bang: man tham chieu chi cao 402 px va goc trai da co
 * hai nut (nhat ky, cong trinh). Them hai nut nua la hang nut dai hon nua man hinh.
 *
 * Lap the bang MOT cham: cham mot the chua lap la no vao o trong dau tien, cham the dang
 * lap la thao ra. Khong co buoc "chon o truoc roi chon the sau" - hai buoc tren dien thoai
 * la mot buoc de bam nham.
 */
import type { CongNghe } from '../sim/meta/CongNghe.ts';
import type { Meta } from '../sim/meta/Meta.ts';
import type { The } from '../sim/meta/TheChinhSach.ts';

type TheChu = 'cong_nghe' | 'chinh_sach';

export class BangMeta {
  private readonly goc: HTMLDivElement;
  private readonly nut: HTMLButtonElement;
  private readonly dau: HTMLDivElement;
  private readonly than: HTMLDivElement;
  private readonly nutThe: readonly HTMLButtonElement[];
  private readonly meta: Meta;
  private the: TheChu = 'cong_nghe';
  private hien = false;
  /** Chu ky cua lan ve gan nhat. Khong doi thi khong ve lai - `capNhat` chay moi khung. */
  private chuKy = '';
  /** Loi bao cho nguoi choi, hien mot lan roi thoi. */
  private bao = '';

  constructor(chaMe: HTMLElement, meta: Meta) {
    this.meta = meta;

    this.goc = document.createElement('div');
    this.goc.className = 'bang-meta';
    this.goc.hidden = true;
    chaMe.appendChild(this.goc);

    this.dau = document.createElement('div');
    this.dau.className = 'bang-meta-dau';
    this.goc.appendChild(this.dau);

    const hangThe: HTMLDivElement = document.createElement('div');
    hangThe.className = 'bang-meta-the';
    this.nutThe = [
      this.taoNutThe(hangThe, 'cong_nghe', 'Công nghệ'),
      this.taoNutThe(hangThe, 'chinh_sach', 'Chính sách'),
    ];
    this.goc.appendChild(hangThe);

    this.than = document.createElement('div');
    this.than.className = 'bang-meta-than';
    this.goc.appendChild(this.than);

    this.nut = document.createElement('button');
    this.nut.type = 'button';
    this.nut.className = 'bang-meta-nut';
    this.nut.textContent = '🔬';
    this.nut.title = 'Nghiên cứu và chính sách';
    this.nut.addEventListener('click', () => { this.batTat(); });
    chaMe.appendChild(this.nut);

    // `?bang=meta` mo san bang - de may ao chup duoc no ma khong phai gia bo cham tay.
    if (new URLSearchParams(window.location.search).get('bang') === 'meta') this.batTat();
  }

  batTat(): void {
    this.hien = !this.hien;
    this.goc.hidden = !this.hien;
    this.nut.dataset['bat'] = this.hien ? 'co' : 'khong';
    if (this.hien) this.ve();
  }

  /**
   * Dong bang.
   *
   * `CityScene` goi khi mot the quyet dinh hien ra: the chiem 46 % man tu duoi len, ma
   * bang nay keo xuong toi 24 % - hai cai de len nhau (da chup thay 11/09). The dang hoi
   * thi the duoc uu tien, bang doi khi nao nguoi choi mo lai.
   */
  dong(): void {
    if (this.hien) this.batTat();
  }

  /** Goi moi khung hinh. Chi ve lai khi co thu that su doi - ve moi khung la giat chu. */
  capNhat(): void {
    if (!this.hien) return;
    if (this.dauVet() === this.chuKy) return;
    this.ve();
  }

  /** Chu ky cua trang thai dang hien: doi mot ky tu la ve lai. */
  private dauVet(): string {
    const m = this.meta;
    const lap: string = m.chinhSach.dangLap.map((t) => t?.id ?? '-').join(',');
    return [
      this.the, this.bao, m.gio, m.thoiDai.doi.so, m.cay.soXong,
      m.cay.dang?.id ?? '-', m.cay.daDon, m.chinhSach.daMo().length, lap,
    ].join('|');
  }

  private taoNutThe(cha: HTMLElement, ten: TheChu, chu: string): HTMLButtonElement {
    const b: HTMLButtonElement = document.createElement('button');
    b.type = 'button';
    b.textContent = chu;
    b.dataset['the'] = ten;
    b.addEventListener('click', () => {
      this.the = ten;
      this.bao = '';
      this.ve();
    });
    cha.appendChild(b);
    return b;
  }

  private ve(): void {
    this.chuKy = this.dauVet();
    const m = this.meta;
    const doi = m.thoiDai.doi;
    this.dau.replaceChildren();
    const ten: HTMLElement = document.createElement('b');
    ten.textContent = `Thời đại ${doi.hien}`;
    const so: HTMLElement = document.createElement('span');
    so.textContent = `${String(m.cay.soXong)}/${String(m.cay.toanBo.length)} công nghệ · `
      + `${String(m.diemMoiGio)} điểm/giờ · nghiên cứu ${String(m.chinhSach.heSoNghienCuu)} %`;
    this.dau.append(ten, so, this.dongLenDoi());

    for (const b of this.nutThe) b.dataset['bat'] = b.dataset['the'] === this.the ? 'co' : 'khong';
    this.than.replaceChildren();
    if (this.bao !== '') this.than.appendChild(this.chu(this.bao, 'bao'));
    if (this.the === 'cong_nghe') this.veCongNghe();
    else this.veChinhSach();
  }

  /** Mot dong ke con thieu gi de len doi sau. Doi cuoi thi noi thang la het duong. */
  private dongLenDoi(): HTMLElement {
    const m = this.meta;
    const dk = m.thoiDai.doi.len;
    const sau = m.thoiDai.doiSau;
    if (dk === undefined || sau === undefined) {
      return this.chu('Chưa có đường lên thời đại sau.', 'mo');
    }
    return this.chu(
      `Lên ${sau.hien}: cần ${String(dk.soCongNghe)} công nghệ (đang có `
        + `${String(m.cay.soXong)}) và ${String(dk.soNha)} công trình.`,
      'mo',
    );
  }

  private veCongNghe(): void {
    const m = this.meta;
    const dang: CongNghe | undefined = m.cay.dang;
    if (dang === undefined) {
      this.than.appendChild(this.chu('Chưa chọn — chạm một công nghệ để học.', 'mo'));
    } else {
      const can: number = m.gia(dang);
      this.than.appendChild(this.chu(
        `Đang học ${dang.hien} — ${String(m.cay.daDon)}/${String(can)} điểm`, 'dang',
      ));
      const thanh: HTMLDivElement = document.createElement('div');
      thanh.className = 'bang-meta-thanh';
      const trong: HTMLDivElement = document.createElement('div');
      trong.style.width = `${String(Math.min(100, Math.round((m.cay.daDon / can) * 100)))}%`;
      thanh.appendChild(trong);
      this.than.appendChild(thanh);
    }

    for (const c of m.cay.hocDuoc()) {
      this.than.appendChild(this.nutCongNghe(c));
    }
    const xong: string = m.cay.toanBo.filter((c) => m.cay.daXong(c.id)).map((c) => c.hien).join(' · ');
    if (xong !== '') this.than.appendChild(this.chu(`Đã xong: ${xong}`, 'mo'));
  }

  private nutCongNghe(c: CongNghe): HTMLButtonElement {
    const m = this.meta;
    const b: HTMLButtonElement = document.createElement('button');
    b.type = 'button';
    b.className = 'bang-meta-muc';
    if (m.cay.dang?.id === c.id) b.dataset['bat'] = 'co';

    const dau: HTMLElement = document.createElement('b');
    dau.textContent = c.hien;
    const gia: HTMLElement = document.createElement('span');
    gia.textContent = `${String(m.gia(c))} điểm`;
    const hang: HTMLDivElement = document.createElement('div');
    hang.className = 'bang-meta-hang';
    hang.append(dau, gia);

    const loi: HTMLElement = document.createElement('span');
    loi.className = 'bang-meta-phu';
    const moc = m.eureka.moc(c.id);
    if (moc === undefined) loi.textContent = c.loi;
    else if (m.eureka.daDat(c.id)) loi.textContent = `Eureka đã đạt — đã rẻ đi.`;
    else loi.textContent = `Eureka: ${moc.hien}`;

    b.append(hang, loi);
    b.addEventListener('click', () => {
      m.cay.chon(c.id);
      this.bao = '';
      this.ve();
    });
    return b;
  }

  private veChinhSach(): void {
    const m = this.meta;
    const lap: string = m.chinhSach.dangLap.map((t) => t?.hien ?? '(trống)').join(' · ');
    const cho: number = m.chinhSach.conCho(m.gio);
    this.than.appendChild(this.chu(
      `${String(m.chinhSach.soO)} ô chính phủ: ${lap}`, 'dang',
    ));
    if (cho > 0) this.than.appendChild(this.chu(`Đổi thẻ sau ${String(cho)} giờ nữa.`, 'mo'));

    const daMo: The[] = m.chinhSach.daMo();
    if (daMo.length === 0) {
      this.than.appendChild(this.chu('Chưa mở thẻ nào — nghiên cứu công nghệ để mở.', 'mo'));
      return;
    }
    for (const t of daMo) this.than.appendChild(this.nutThePolicy(t));
  }

  private nutThePolicy(t: The): HTMLButtonElement {
    const m = this.meta;
    const o: number = m.chinhSach.dangLap.findIndex((x) => x?.id === t.id);
    const b: HTMLButtonElement = document.createElement('button');
    b.type = 'button';
    b.className = 'bang-meta-muc';
    if (o >= 0) b.dataset['bat'] = 'co';

    const dau: HTMLElement = document.createElement('b');
    dau.textContent = t.hien;
    const trangThai: HTMLElement = document.createElement('span');
    trangThai.textContent = o >= 0 ? 'đang lắp' : 'lắp';
    const hang: HTMLDivElement = document.createElement('div');
    hang.className = 'bang-meta-hang';
    hang.append(dau, trangThai);

    const loi: HTMLElement = document.createElement('span');
    loi.className = 'bang-meta-phu';
    loi.textContent = t.loi;
    const hai: HTMLElement = document.createElement('span');
    hai.className = 'bang-meta-hai';
    hai.textContent = t.hai;

    b.append(hang, loi, hai);
    b.addEventListener('click', () => { this.bamThe(t, o); });
    return b;
  }

  /** Cham mot the: dang lap thi thao ra, chua lap thi vao o trong dau tien. */
  private bamThe(t: The, o: number): void {
    const m = this.meta;
    if (o >= 0) {
      this.bao = m.thaoThe(o) ? '' : `Chưa đổi được — còn chờ ${String(m.chinhSach.conCho(m.gio))} giờ.`;
      this.ve();
      return;
    }
    const trong: number = m.chinhSach.dangLap.findIndex((x) => x === undefined);
    if (trong < 0) this.bao = 'Hết ô chính phủ — tháo một thẻ ra trước.';
    else if (!m.lapThe(trong, t.id)) {
      this.bao = `Chưa đổi được — còn chờ ${String(m.chinhSach.conCho(m.gio))} giờ.`;
    } else this.bao = '';
    this.ve();
  }

  private chu(van: string, loai: string): HTMLParagraphElement {
    const p: HTMLParagraphElement = document.createElement('p');
    p.className = 'bang-meta-chu';
    p.dataset['loai'] = loai;
    p.textContent = van;
    return p;
  }
}
