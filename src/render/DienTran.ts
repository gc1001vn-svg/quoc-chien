/**
 * Dien tran: tu ket qua DA TINH cua `sim/campaign/Battle.ts` ra tung linh can ve o giay `t`.
 *
 * Phan THUAN cua `BattleScene.ts` - khong DOM, khong WebGL - de test chay trong Node. Chi DOC
 * ket qua, khong tinh lai gi: nguoi choi xem gi thi con so van la con so da du doan
 * (GAME_SPEC muc 6: tinh truoc, dien sau).
 *
 * Toa do: `x`, `y` cua sim la o chien truong, dat thang vao o luoi `(a, b)` = `(x, y)`.
 * Huong sprite theo `tools/nuong_sprite.mjs` (ham `moRongLinh`): huong `h` nhin theo
 * `(sin, cos)` cua goc `h * 360 / soHuong` tren mat phang `(a, b)`.
 */
import type { DauVaoTran, DiemDoi, KetQuaTran, KhungVet, Phe } from '../sim/campaign/Battle';
import { bam, chonHuong, diem, oDoiHinh, timKhung, type CauHinhDien, type DangLinh, type LinhVe, type MuiTen } from './DienTranCoBan';

export { chonHuong, oDoiHinh, timKhung } from './DienTranCoBan';
export type { CauHinhDien, DangLinh, LinhVe, MuiTen } from './DienTranCoBan';

/** Mot linh trong doi: chet luc nao, o dau, nhin huong nao luc chet. */
interface Linh {
  readonly ben: Phe;
  readonly doi: number;
  readonly chiSo: number;
  giayChet: number;
  aChet: number;
  bChet: number;
  huongChet: number;
}


/** Dien mot tran da tinh. Dung mot lan, hoi `linhLuc(giay)` moi khung hinh. */
export class DienTran {
  private readonly kq: KetQuaTran;
  private readonly vao: DauVaoTran;
  private readonly ch: CauHinhDien;
  private readonly linh: Linh[] = [];
  /** Huong cuoi cung cua moi doi, khoa `a3` / `b0` - dung yen thi giu huong cu. */
  private readonly huongDoi = new Map<string, number>();

  /** Tam danh theo loai doi (`units.json`). Doi co tam <= 1 la can chien. Bo trong = khong dan hang. */
  private readonly tamDoi: ReadonlyMap<string, number>;

  public constructor(kq: KetQuaTran, vao: DauVaoTran, ch: CauHinhDien, tamDoi: ReadonlyMap<string, number> = new Map()) {
    this.kq = kq;
    this.vao = vao;
    this.ch = ch;
    this.tamDoi = tamDoi;
    this.dungLinh();
  }

  private idDoi(ben: Phe, doi: number): string {
    return (ben === 'a' ? this.vao.a : this.vao.b).doi[doi] ?? '';
  }

  /** Giay doi bat dau danh (su kien `danh` dau tien), Infinity neu chua. */
  private giayDanh(ben: Phe, doi: number): number {
    return this.kq.suKien.find((s) => s.loai === 'danh' && s.ben === ben && s.doi === doi)?.giay ?? Infinity;
  }

  /** Tam doi o `giay` (noi giua hai khung vet, doi vo thi chay ve). */
  private tamLuc(ben: Phe, doi: number, giay: number): { a: number; b: number } | undefined {
    const { i, f } = timKhung(this.kq.vet, giay);
    const p0 = diem(this.kq.vet[i], ben, doi);
    const p1 = diem(this.kq.vet[i + 1], ben, doi) ?? p0;
    return p0 === undefined || p1 === undefined ? undefined : this.viTri(ben, doi, p0, p1, f, giay);
  }

  /** Doi dich gan nhat con dung o giay `giay`, -1 neu het. */
  private dichGan(ben: Phe, tam: { a: number; b: number }, giay: number): number {
    const k: KhungVet = this.kq.vet[timKhung(this.kq.vet, giay).i] as KhungVet;
    const dich: readonly DiemDoi[] = ben === 'a' ? k.b : k.a;
    let tot = -1;
    let kc = Infinity;
    dich.forEach((e, j) => {
      const d: number = Math.hypot(e.x - tam.a, e.y - tam.b);
      if (!e.vo && d < kc) {
        kc = d;
        tot = j;
      }
    });
    return tot;
  }

  /** Khoang giua hai linh cua doi `doi` ben `ben`. */
  private khoang(ben: Phe, doi: number): number {
    const id: string = (ben === 'a' ? this.vao.a : this.vao.b).doi[doi] ?? '';
    return this.ch.khoang_rieng?.[id] ?? this.ch.khoang_linh;
  }

  /** Hop o luoi ma quan tung dung trong ca tran - de man mo ra zoom vua khit. */
  public hopVet(): { a0: number; a1: number; b0: number; b1: number } {
    let a0 = Infinity;
    let a1 = -Infinity;
    let b0 = Infinity;
    let b1 = -Infinity;
    for (const k of this.kq.vet) {
      for (const p of [...k.a, ...k.b]) {
        a0 = Math.min(a0, p.x);
        a1 = Math.max(a1, p.x);
        b0 = Math.min(b0, p.y);
        b1 = Math.max(b1, p.y);
      }
    }
    return { a0, a1, b0, b1 };
  }

  /** Do dai tran, giay. */
  public giayKetThuc(): number {
    return this.kq.giayKetThuc;
  }

  /** Moi linh can ve o `giay`: xac truoc (nam duoi), roi nguoi song xep theo truc sau. */
  public linhLuc(giay: number): LinhVe[] {
    const { i, f } = timKhung(this.kq.vet, giay);
    const truoc: KhungVet = this.kq.vet[i] as KhungVet;
    const sau: KhungVet = this.kq.vet[i + 1] ?? truoc;
    const xac: LinhVe[] = [];
    const song: LinhVe[] = [];
    const khung: number = Math.floor(giay * this.ch.khung_moi_giay);
    const soKhung = (d: DangLinh): number => this.ch.so_khung?.[d] ?? 2;

    for (const ben of ['a', 'b'] as const) {
      const ids: readonly string[] = (ben === 'a' ? this.vao.a : this.vao.b).doi;
      ids.forEach((id, doi) => {
        const p0 = diem(truoc, ben, doi);
        const p1 = diem(sau, ben, doi) ?? p0;
        if (p0 === undefined || p1 === undefined) return;
        const tam = this.viTri(ben, doi, p0, p1, f, giay);
        const huong: number = this.huong(ben, doi, p0, p1, tam, truoc);
        const dang: DangLinh = p0.vo ? 'di' : p0.dangDanh ? 'danh' : 'di';
        const cua: Linh[] = this.linh.filter((l) => l.ben === ben && l.doi === doi);
        const n: number = cua.length;
        const conSong: number = cua.filter((l) => l.giayChet > giay).length;
        const trung: boolean = cua.some((l) => l.giayChet <= giay && giay - l.giayChet < this.ch.giay_trung);
        const hang = this.hangGiap(ben, doi, id, tam, p0, giay);
        let thu = 0;
        for (const l of cua) {
          if (l.giayChet <= giay) {
            // Hai khung chet: nga xuong roi nam han.
            const k: number = giay - l.giayChet < 1 / this.ch.khung_moi_giay ? 0 : soKhung('chet') - 1;
            xac.push({ a: l.aChet, b: l.bChet, ben, ten: `${id}_chet_h${String(l.huongChet)}_k${String(k)}` });
            continue;
          }
          const o = oDoiHinh(l.chiSo, n, this.ch.cot_toi_da, this.khoang(ben, doi));
          // Nguoi sap chet ke tiep (con song co chi so lon nhat) hien trung don.
          const d: DangLinh = trung && l.chiSo === conSong - 1 && !p0.vo ? 'trung' : dang;
          // Moi linh mot pha rieng - khong ca doi vung kiem cung mot nhip.
          const pha: number = Math.floor(bam(l.chiSo, doi + (ben === 'a' ? 0 : 50)) * soKhung(d));
          const k: number = (khung + pha) % soKhung(d);
          let a: number = tam.a + o.da;
          let b: number = tam.b + o.db;
          if (hang !== undefined) {
            // Linh con song thu `thu` dung o hang `thu / cot`, cot `thu % cot` cua tuyen giap.
            const cot: number = Math.min(this.ch.cot_toi_da, conSong);
            const r: number = Math.floor(thu / cot);
            const trongHang: number = Math.min(cot, conSong - r * cot);
            const ngang: number = ((thu % cot) - (trongHang - 1) / 2) * this.khoang(ben, doi);
            const sau: number = (this.ch.khoang_giap_rieng?.[id] ?? this.ch.khoang_giap ?? 0.45) / 2 + r * this.khoang(ben, doi)
              - (this.ch.nhun ?? 0) * Math.sin(((k + 0.5) / soKhung(d)) * Math.PI);
            const ga: number = hang.m.a - hang.u.a * sau - hang.u.b * ngang;
            const gb: number = hang.m.b - hang.u.b * sau + hang.u.a * ngang;
            a += (ga - a) * hang.w;
            b += (gb - b) * hang.w;
          }
          thu += 1;
          song.push({ a, b, ben, ten: `${id}_${d}_h${String(huong)}_k${String(k)}` });
        }
      });
    }
    song.sort((p, q) => p.a + p.b - (q.a + q.b));
    return [...xac, ...song];
  }

  /**
   * Tuyen giap la ca cua doi can chien dang danh: diem giua `m` hai tam doi, huong `u` (don vi)
   * tu doi minh sang doi dich, `w` (0..1) do da chay ra tuyen - tang dan trong `giay_vao_tran`.
   * `undefined` khi doi khong can chien, khong danh, da vo, hay khong biet tam danh.
   */
  private hangGiap(
    ben: Phe, doi: number, id: string, tam: { a: number; b: number }, p0: DiemDoi, giay: number,
  ): { m: { a: number; b: number }; u: { a: number; b: number }; w: number } | undefined {
    const tamDanh: number | undefined = this.tamDoi.get(id);
    if (tamDanh === undefined || tamDanh > 1 || p0.vo || !p0.dangDanh) return undefined;
    const e: number = this.dichGan(ben, tam, giay);
    const te = e < 0 ? undefined : this.tamLuc(ben === 'a' ? 'b' : 'a', e, giay);
    if (te === undefined) return undefined;
    const kc: number = Math.hypot(te.a - tam.a, te.b - tam.b) || 1;
    const w: number = Math.min(1, Math.max(0, (giay - this.giayDanh(ben, doi)) / (this.ch.giay_vao_tran ?? 0.6)));
    return { m: { a: (tam.a + te.a) / 2, b: (tam.b + te.b) / 2 }, u: { a: (te.a - tam.a) / kc, b: (te.b - tam.b) / kc }, w };
  }

  /**
   * Mui ten dang bay o `giay`. Moi cung thu con song cua doi danh xa dang danh ban mot mui
   * moi `chu_ky_ban` giay (lech pha theo nguoi), bay `giay_bay` giay theo duong vong toi
   * quanh tam doi dich gan nhat. Chi de nhin - sat thuong da tinh san trong ket qua.
   */
  public muiTenLuc(giay: number): MuiTen[] {
    const ra: MuiTen[] = [];
    const T: number = this.ch.chu_ky_ban ?? 1.6;
    const F: number = Math.min(this.ch.giay_bay ?? 0.9, T);
    for (const l of this.linh) {
      const id: string = this.idDoi(l.ben, l.doi);
      if ((this.tamDoi.get(id) ?? 0) <= 1) continue;
      const lech: number = bam(l.chiSo, l.doi + 17) * T;
      const ban: number = Math.floor((giay + lech) / T) * T - lech;
      const f: number = (giay - ban) / F;
      if (f < 0 || f >= 1 || l.giayChet <= ban) continue;
      const tam = this.tamLuc(l.ben, l.doi, ban);
      const p = diem(this.kq.vet[timKhung(this.kq.vet, ban).i], l.ben, l.doi);
      if (tam === undefined || p === undefined || p.vo || !p.dangDanh) continue;
      const e: number = this.dichGan(l.ben, tam, ban);
      const te = e < 0 ? undefined : this.tamLuc(l.ben === 'a' ? 'b' : 'a', e, ban);
      if (te === undefined) continue;
      const tan: number = this.ch.tan_ban ?? 1.2;
      const lot = Math.floor(ban / T);
      const da: number = te.a + (bam(l.chiSo, lot) - 0.5) * tan - tam.a;
      const db: number = te.b + (bam(lot, l.chiSo + 3) - 0.5) * tan - tam.b;
      const h: number = chonHuong(da, db, this.ch.huong);
      ra.push({
        a: tam.a + da * f,
        b: tam.b + db * f,
        cao: 4 * (this.ch.do_vong ?? 0.22) * Math.hypot(da, db) * f * (1 - f),
        ten: `mui_ten_h${String(Math.max(0, h))}`,
      });
    }
    return ra;
  }

  /**
   * Tam doi o `giay`: noi giua hai khung vet. Doi da vo thi sim dung no lai; lop dien cho
   * no chay ve phia minh (ben a ve a nho, ben b ve a lon) voi `toc_rut`.
   */
  private viTri(ben: Phe, doi: number, p0: DiemDoi, p1: DiemDoi, f: number, giay: number): { a: number; b: number } {
    if (!p0.vo) return { a: p0.x + (p1.x - p0.x) * f, b: p0.y + (p1.y - p0.y) * f };
    const giayVo: number = this.kq.suKien.find((s) => s.loai === 'vo' && s.ben === ben && s.doi === doi)?.giay ?? giay;
    const chieu: number = ben === 'a' ? -1 : 1;
    return { a: p0.x + chieu * this.ch.toc_rut * Math.max(0, giay - giayVo), b: p0.y };
  }

  /** Huong doi: dang di thi theo huong di; dang danh thi nhin doi dich gan nhat; vo thi quay ve. */
  private huong(ben: Phe, doi: number, p0: DiemDoi, p1: DiemDoi, tam: { a: number; b: number }, k: KhungVet): number {
    const khoa = `${ben}${String(doi)}`;
    let h = -1;
    if (p0.vo) h = chonHuong(ben === 'a' ? -1 : 1, 0, this.ch.huong);
    else if (p0.dangDanh) {
      const dich: readonly DiemDoi[] = ben === 'a' ? k.b : k.a;
      let tot: DiemDoi | undefined;
      for (const e of dich) {
        if (e.vo) continue;
        if (tot === undefined || Math.hypot(e.x - tam.a, e.y - tam.b) < Math.hypot(tot.x - tam.a, tot.y - tam.b)) tot = e;
      }
      if (tot !== undefined) h = chonHuong(tot.x - tam.a, tot.y - tam.b, this.ch.huong);
    } else h = chonHuong(p1.x - p0.x, p1.y - p0.y, this.ch.huong);
    if (h < 0) h = this.huongDoi.get(khoa) ?? chonHuong(ben === 'a' ? 1 : -1, 0, this.ch.huong);
    this.huongDoi.set(khoa, h);
    return h;
  }

  /**
   * Linh nao chet luc nao: lan theo vet, `conSong` cua doi tut tu `n` xuong `m` o khung nao
   * thi linh `m..n-1` chet o khung do, tai cho dung trong doi hinh luc ay. Khung dau cho biet
   * quan so ban dau.
   */
  private dungLinh(): void {
    const dau: KhungVet | undefined = this.kq.vet[0];
    if (dau === undefined) return;
    for (const ben of ['a', 'b'] as const) {
      (ben === 'a' ? dau.a : dau.b).forEach((p, doi) => {
        for (let i = 0; i < p.conSong; i += 1) {
          this.linh.push({ ben, doi, chiSo: i, giayChet: Infinity, aChet: 0, bChet: 0, huongChet: 0 });
        }
      });
    }
    for (let k = 1; k < this.kq.vet.length; k += 1) {
      const khung: KhungVet = this.kq.vet[k] as KhungVet;
      const truoc: KhungVet = this.kq.vet[k - 1] as KhungVet;
      for (const l of this.linh) {
        if (l.giayChet !== Infinity) continue;
        const p = diem(khung, l.ben, l.doi);
        if (p === undefined || l.chiSo < p.conSong) continue;
        const n: number = diem(dau, l.ben, l.doi)?.conSong ?? 0;
        const o = oDoiHinh(l.chiSo, n, this.ch.cot_toi_da, this.khoang(l.ben, l.doi));
        const p0 = diem(truoc, l.ben, l.doi) ?? p;
        l.giayChet = khung.giay;
        l.aChet = p.x + o.da;
        l.bChet = p.y + o.db;
        l.huongChet = this.huong(l.ben, l.doi, p0, p, { a: p.x, b: p.y }, khung);
      }
    }
    this.huongDoi.clear();
  }
}
