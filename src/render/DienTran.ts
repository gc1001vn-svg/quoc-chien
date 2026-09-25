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

/** Khuon `data/dien_tran.json` - chi cac truong lop dien dung. */
export interface CauHinhDien {
  readonly khoang_linh: number;
  readonly cot_toi_da: number;
  readonly khung_moi_giay: number;
  readonly giay_trung: number;
  readonly toc_rut: number;
  readonly huong: number;
}

export type DangLinh = 'di' | 'danh' | 'trung' | 'chet';

/** Mot linh can ve. `ten` la ten sprite trong atlas `linh_co`. */
export interface LinhVe {
  readonly a: number;
  readonly b: number;
  readonly ten: string;
  readonly ben: Phe;
}

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

/**
 * Chon huong sprite cho vector di `(da, db)`. Vector 0 thi tra -1 - noi goi giu huong cu.
 * Goc `atan2(da, db)` vi huong 0 nhin theo +b (xem dau file).
 */
export function chonHuong(da: number, db: number, soHuong: number): number {
  if (da === 0 && db === 0) return -1;
  const buoc: number = (2 * Math.PI) / soHuong;
  const h: number = Math.round(Math.atan2(da, db) / buoc);
  return ((h % soHuong) + soHuong) % soHuong;
}

/**
 * Cho dung cua linh thu `i` trong doi `n` nguoi, so voi tam doi: xep hang ngang toi da
 * `cot` nguoi, cac hang can giua.
 */
export function oDoiHinh(i: number, n: number, cot: number, khoang: number): { da: number; db: number } {
  const soCot: number = Math.min(cot, n);
  const soHang: number = Math.ceil(n / soCot);
  const hang: number = Math.floor(i / soCot);
  // Hang cuoi thieu nguoi thi can giua rieng hang do.
  const trongHang: number = hang === soHang - 1 ? n - hang * soCot : soCot;
  const cotI: number = i % soCot;
  return {
    da: (hang - (soHang - 1) / 2) * khoang,
    db: (cotI - (trongHang - 1) / 2) * khoang,
  };
}

/** Chi so khung vet ngay truoc `giay` va phan noi `f` (0..1) sang khung sau. */
export function timKhung(vet: readonly KhungVet[], giay: number): { i: number; f: number } {
  if (vet.length === 0) throw new Error('vet rong: tinhTran luon ghi it nhat mot khung');
  let i = 0;
  while (i + 1 < vet.length && (vet[i + 1]?.giay ?? Infinity) <= giay) i += 1;
  const dau: KhungVet = vet[i] as KhungVet;
  const sau: KhungVet | undefined = vet[i + 1];
  if (sau === undefined || sau.giay <= dau.giay) return { i, f: 0 };
  return { i, f: Math.min(1, Math.max(0, (giay - dau.giay) / (sau.giay - dau.giay))) };
}

function diem(k: KhungVet | undefined, ben: Phe, doi: number): DiemDoi | undefined {
  return k === undefined ? undefined : (ben === 'a' ? k.a : k.b)[doi];
}

/** Dien mot tran da tinh. Dung mot lan, hoi `linhLuc(giay)` moi khung hinh. */
export class DienTran {
  private readonly kq: KetQuaTran;
  private readonly vao: DauVaoTran;
  private readonly ch: CauHinhDien;
  private readonly linh: Linh[] = [];
  /** Huong cuoi cung cua moi doi, khoa `a3` / `b0` - dung yen thi giu huong cu. */
  private readonly huongDoi = new Map<string, number>();

  public constructor(kq: KetQuaTran, vao: DauVaoTran, ch: CauHinhDien) {
    this.kq = kq;
    this.vao = vao;
    this.ch = ch;
    this.dungLinh();
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
        for (const l of cua) {
          if (l.giayChet <= giay) {
            // Hai khung chet: nga xuong roi nam han.
            const k: number = giay - l.giayChet < 1 / this.ch.khung_moi_giay ? 0 : 1;
            xac.push({ a: l.aChet, b: l.bChet, ben, ten: `${id}_chet_h${String(l.huongChet)}_k${String(k)}` });
            continue;
          }
          const o = oDoiHinh(l.chiSo, n, this.ch.cot_toi_da, this.ch.khoang_linh);
          // Nguoi sap chet ke tiep (con song co chi so lon nhat) hien trung don.
          const d: DangLinh = trung && l.chiSo === conSong - 1 && !p0.vo ? 'trung' : dang;
          const k: number = (khung + l.chiSo) % 2;
          song.push({ a: tam.a + o.da, b: tam.b + o.db, ben, ten: `${id}_${d}_h${String(huong)}_k${String(k)}` });
        }
      });
    }
    song.sort((p, q) => p.a + p.b - (q.a + q.b));
    return [...xac, ...song];
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
        const o = oDoiHinh(l.chiSo, n, this.ch.cot_toi_da, this.ch.khoang_linh);
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
