/**
 * Hieu ung man tran (Thu 2, 30/09): moi canh cua `BattleScript` mot tin hieu hinh.
 *
 *   tien        -> bui duoi chan linh dang di
 *   ban         -> tran co: bui cho ten cam · tran sung: khoi o nong khi dan roi
 *   giap_la_ca  -> chop + tia o linh dang trung don
 *   vo          -> co trang tren doi vo + nhat mau linh doi do + khung khung
 *   ket_thuc    -> co mau ben thang dung len + khung khung dai hon
 *
 * CHI DOC: `LinhVe`, `MuiTen` cua `DienTran` va kich ban da sinh. Khung khung chi dung DONG HO
 * PHAT - ket qua tran da tinh xong tu truoc, khong doi (GAME_SPEC muc 6).
 *
 * Tat tung thu bang `?tat=`: `bui` · `khoi` · `chop` · `co` · `nhat` · `khung` · `het`.
 * Ve bang lo hat cua Thu 1 (`Hat.ts`): mot lenh ve, 0 trang atlas.
 */
import soTho from '../../data/hieu_ung.json';
import { HINH, Hat } from './Hat';
import { neoX, neoY } from './IsoMath';
import type { Gl } from './Gl';
import type { Canh } from '../sim/campaign/BattleScript';
import type { LinhVe, MuiTen } from './DienTranCoBan';

const SO = soTho.tran;

/** Cho lop hieu ung do hat vao - `Hat` that, hay bo dem gia trong test. */
export interface NoiHat {
  them(x: number, y: number, rx: number, ry: number, r: number, g: number, b: number, a: number, kieu: number): void;
}

/** Camera cua khung hinh: toa do the gioi -> diem anh khung ve. */
export interface KhungTran {
  readonly camX: number;
  readonly camY: number;
  readonly tiLe: number;
  readonly rongDev: number;
  readonly caoDev: number;
  readonly oPx: number;
  /** Diem anh that tren mot diem CSS - co co co toi thieu de van thay khi thu nho het co. */
  readonly dpr: number;
}

/**
 * Buoc dong ho phat tran `buoc` giay. Di qua moc `vo` / `ket_thuc` thi DUNG DUNG o moc do
 * va tra ve so mili giay khung (Sakurai: don ket lieu khung lau hon, moi lan co tran).
 * Moi buoc toi da mot moc - toc xem cao thi moi vo tran van khung rieng, khong cong don.
 */
export function buocDongHo(giay: number, buoc: number, kichBan: readonly Canh[]): { giay: number; dungMs: number } {
  const moc = kichBan.find((c) => (c.loai === 'vo' || c.loai === 'ket_thuc') && c.giay > giay && c.giay <= giay + buoc);
  if (moc === undefined) return { giay: giay + buoc, dungMs: 0 };
  const ms = moc.loai === 'vo' ? SO.khung.voMs : SO.khung.ketThucMs;
  return { giay: moc.giay, dungMs: Math.min(ms, SO.khung.tranMs) };
}

/** Doi nao da vo o `giay`, khoa `ben + doi`. */
export function doiVo(kichBan: readonly Canh[], giay: number): ReadonlySet<string> {
  return new Set(kichBan.filter((c) => c.loai === 'vo' && c.giay <= giay).map((c) => `${c.ben}${String(c.doi)}`));
}

const ngau = (a: readonly number[]): number => {
  const lo = a[0] ?? 0;
  return lo + Math.random() * ((a[1] ?? lo) - lo);
};
const mau3 = (a: readonly number[]): [number, number, number] => [a[0] ?? 1, a[1] ?? 1, a[2] ?? 1];

/** Mot hat: bui, khoi, chop, tia. `vao` = phan dau tuoi de hien dan (0 = hien ngay). */
interface HatTran {
  x: number; y: number; vx: number; vy: number; roi: number;
  tuoi: number; tho: number; r0: number; r1: number;
  mau: [number, number, number]; doDac: number; vao: number;
}

export class HieuUngTran {
  private readonly hat: NoiHat;
  private readonly kichBan: readonly Canh[];
  private readonly tat: ReadonlySet<string>;
  /** Tran sung: dan roi nong thi phut khoi. Tran co: ten cam dat thi toe bui. */
  private readonly sung: boolean;
  private readonly giayHet: number;
  private readonly ds: HatTran[] = [];
  /** Linh dang trung don lan truoc cua moi doi - doi cho nghia la mot nguoi moi trung. */
  private readonly trungTruoc = new Map<string, { a: number; b: number }>();
  private dungMs = 0;
  private dongHo = 0;
  /** Giay may luc co ben thang dung len, -1 la chua dung. */
  private thangTu = -1;

  constructor(hat: NoiHat, kichBan: readonly Canh[], tat: ReadonlySet<string>, sung: boolean) {
    this.hat = hat;
    this.kichBan = kichBan;
    this.tat = tat;
    this.sung = sung;
    this.giayHet = kichBan.find((c) => c.loai === 'ket_thuc')?.giay ?? Infinity;
  }

  /** Buoc dong ho phat, co khung khung. Tra ve giay moi. */
  buoc(giay: number, buocTran: number, msThat: number): number {
    if (this.dungMs > 0) {
      this.dungMs -= msThat;
      return giay;
    }
    if (this.tat.has('khung')) return giay + buocTran;
    const r = buocDongHo(giay, buocTran, this.kichBan);
    this.dungMs = r.dungMs;
    return r.giay;
  }

  /** Sinh, troi, ve moi hat cua khung nay vao `hat`. `dtTran` = 0 khi dong ho dung. */
  chay(k: KhungTran, linh: readonly LinhVe[], muiTen: readonly MuiTen[], giay: number, dtThat: number, dtTran: number): void {
    this.dongHo += dtThat;
    const dx = (x: number): number => (x - k.camX) * k.tiLe + k.rongDev / 2;
    const dy = (y: number): number => (y - k.camY) * k.tiLe + k.caoDev / 2;
    const wx = (a: number, b: number): number => neoX(a, b, k.oPx);
    const wy = (a: number, b: number): number => neoY(a, b, k.oPx);
    const vo = doiVo(this.kichBan, giay);

    // Nhat mau doi vo: mot vet sang mo phu len tung nguoi, ve truoc de hat va co nam tren.
    if (!this.tat.has('nhat')) {
      const n = SO.nhat;
      const [r, g, b] = mau3(n.mau);
      for (const l of linh) {
        if (l.dang === 'chet' || !vo.has(`${l.ben}${String(l.doi)}`)) continue;
        this.hat.them(dx(wx(l.a, l.b)), dy(wy(l.a, l.b) - n.nang), (n.banKinh[0] ?? 10) * k.tiLe, (n.banKinh[1] ?? 16) * k.tiLe, r, g, b, n.doDac, HINH.tron);
      }
    }
    if (dtTran > 0) this.sinh(linh, muiTen, dtTran, wx, wy);
    this.troi(this.dungMs > 0 ? 0 : dtThat, k.tiLe, dx, dy);
    if (!this.tat.has('co')) this.veCo(linh, vo, giay, k, dx, dy, wx, wy);
  }

  private sinh(
    linh: readonly LinhVe[], muiTen: readonly MuiTen[], dtTran: number,
    wx: (a: number, b: number) => number, wy: (a: number, b: number) => number,
  ): void {
    if (!this.tat.has('bui')) {
      const u = SO.bui;
      for (const l of linh) {
        if (l.dang !== 'di' || Math.random() >= u.moiGiayTran * dtTran) continue;
        this.them(wx(l.a, l.b) + (Math.random() - 0.5) * 10, wy(l.a, l.b), (Math.random() - 0.5) * 8, -u.bayLen, 0,
          u.tuoiGiay, u.banKinh, u.mau, u.doDac, 0.15);
      }
    }
    if (!this.tat.has('khoi')) {
      for (const m of muiTen) {
        if (this.sung && m.tuoi <= dtTran) {
          const u = SO.khoiSung;
          this.them(wx(m.a, m.b) + (Math.random() - 0.5) * 12, wy(m.a, m.b) - u.nang, (Math.random() - 0.5) * 6, -u.bayLen, 0,
            u.tuoiGiay, u.banKinh, u.mau, u.doDac, 0.1);
        } else if (!this.sung && m.con <= dtTran) {
          const u = SO.cam;
          this.them(wx(m.a, m.b), wy(m.a, m.b), 0, -3, 0, u.tuoiGiay, u.banKinh, u.mau, u.doDac, 0.05);
        }
      }
    }
    if (!this.tat.has('chop')) this.sinhChop(linh, wx, wy);
  }

  /** Chop + tia khi mot nguoi MOI trung don: linh `trung` cua doi doi cho so voi khung truoc. */
  private sinhChop(linh: readonly LinhVe[], wx: (a: number, b: number) => number, wy: (a: number, b: number) => number): void {
    const c = SO.chop;
    const con = new Set<string>();
    for (const l of linh) {
      if (l.dang !== 'trung') continue;
      const khoa = `${l.ben}${String(l.doi)}`;
      con.add(khoa);
      const cu = this.trungTruoc.get(khoa);
      this.trungTruoc.set(khoa, { a: l.a, b: l.b });
      if (cu !== undefined && Math.hypot(cu.a - l.a, cu.b - l.b) < c.dichToiThieu) continue;
      const x = wx(l.a, l.b);
      const y = wy(l.a, l.b) - c.nang;
      this.them(x, y, 0, 0, 0, [c.tuoiGiay], [c.banKinh, c.banKinh * 0.5], c.mau, 1, 0);
      const so = Math.round(ngau(c.soTia));
      for (let i = 0; i < so; i += 1) {
        const goc = Math.random() * Math.PI * 2;
        const v = ngau(c.tocDoTia);
        this.them(x, y, Math.cos(goc) * v, Math.sin(goc) * v * 0.7 - 30, 220, [c.tuoiTia], [c.coTia, c.coTia * 0.6], c.mau, 1, 0);
      }
    }
    for (const khoa of [...this.trungTruoc.keys()]) if (!con.has(khoa)) this.trungTruoc.delete(khoa);
  }

  private them(
    x: number, y: number, vx: number, vy: number, roi: number, tuoi: readonly number[],
    banKinh: readonly number[], mau: readonly number[], doDac: number, vao: number,
  ): void {
    if (this.ds.length >= SO.toiDa) return;
    this.ds.push({ x, y, vx, vy, roi, tuoi: 0, tho: ngau(tuoi), r0: banKinh[0] ?? 4, r1: banKinh[1] ?? banKinh[0] ?? 4, mau: mau3(mau), doDac, vao });
  }

  private troi(dt: number, tiLe: number, dx: (x: number) => number, dy: (y: number) => number): void {
    for (let i = this.ds.length - 1; i >= 0; i -= 1) {
      const h = this.ds[i] as HatTran;
      h.tuoi += dt;
      if (h.tuoi > h.tho) { this.ds.splice(i, 1); continue; }
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      h.vy += h.roi * dt;
      const t = h.tuoi / h.tho;
      const r = (h.r0 + (h.r1 - h.r0) * (1 - (1 - t) * (1 - t))) * tiLe;
      const a = (h.vao > 0 ? Math.min(1, t / h.vao) : 1) * Math.pow(1 - t, 1.3) * h.doDac;
      this.hat.them(dx(h.x), dy(h.y), r, r * 0.85, h.mau[0], h.mau[1], h.mau[2], a, HINH.tron);
    }
  }

  /** Co trang tren moi doi vo con nguoi; het tran thi co ben thang o giua quan thang. */
  private veCo(
    linh: readonly LinhVe[], vo: ReadonlySet<string>, giay: number, k: KhungTran,
    dx: (x: number) => number, dy: (y: number) => number,
    wx: (a: number, b: number) => number, wy: (a: number, b: number) => number,
  ): void {
    const c = SO.co;
    const tam = new Map<string, { x: number; y: number; n: number }>();
    const thang = giay >= this.giayHet ? this.kichBan[this.kichBan.length - 1]?.ben : undefined;
    for (const l of linh) {
      if (l.dang === 'chet') continue;
      const khoa = vo.has(`${l.ben}${String(l.doi)}`) ? `${l.ben}${String(l.doi)}` : l.ben === thang ? 'thang' : '';
      if (khoa === '') continue;
      const t = tam.get(khoa) ?? { x: 0, y: 0, n: 0 };
      t.x += wx(l.a, l.b);
      t.y += wy(l.a, l.b);
      t.n += 1;
      tam.set(khoa, t);
    }
    if (thang === undefined) this.thangTu = -1;
    else if (this.thangTu < 0) this.thangTu = this.dongHo;
    let i = 0;
    for (const [khoa, t] of tam) {
      i += 1;
      const la = khoa === 'thang';
      let co = la ? c.coThang : 1;
      if (la) {
        // Nay len: phong tu 0 qua 1,15 roi ve 1 trong `nayGiay`.
        const s = Math.min(1, (this.dongHo - this.thangTu) / c.nayGiay);
        co *= s < 1 ? Math.sin(s * Math.PI * 0.62) / Math.sin(Math.PI * 0.62) * (1 + 0.15 * Math.sin(s * Math.PI)) : 1;
      }
      if (co <= 0.01) continue;
      const [r, g, b] = mau3(la ? (thang === 'b' ? c.ben.b : c.ben.a) : c.trang);
      // Thu nho het co (dien thoai doc ~0,2x) co van toi thieu `toiThieuCss` diem CSS.
      const phong = Math.max(k.tiLe, (c.toiThieuCss * k.dpr) / c.rong) * co;
      const rx = (c.rong / 2) * phong;
      const ry = (c.cao / 2) * phong;
      const x = dx(t.x / t.n) + rx * 0.84;
      const y = dy(t.y / t.n) - c.nang * k.tiLe - ry;
      const pha = (this.dongHo * 1.1 + i * 0.37) % 1;
      this.hat.them(x, y, rx, ry, r, g, b, 1, HINH.co + Math.min(pha, 0.99));
    }
  }
}

/** Lop hieu ung tran gan voi `gl`: lo hat rieng, mot lenh ve. */
export class VeHieuUngTran {
  readonly hieu: HieuUngTran;
  private readonly gl: Gl;
  private readonly hat: Hat;

  constructor(gl: Gl, kichBan: readonly Canh[], tat: ReadonlySet<string>, tenDan: string | undefined) {
    this.gl = gl;
    this.hat = new Hat(gl, SO.toiDa + 200);
    this.hieu = new HieuUngTran(this.hat, kichBan, tat, SO.khoiSung.dan.includes(tenDan ?? ''));
  }

  /** Ve sau `gl.ketThucKhung()`. Tra ve so lenh ve them (0 hoac 1). */
  ve(k: KhungTran, linh: readonly LinhVe[], muiTen: readonly MuiTen[], giay: number, dtThat: number, dtTran: number): number {
    this.hieu.chay(k, linh, muiTen, giay, dtThat, dtTran);
    const lenh = this.hat.xa();
    this.gl.khoiPhuc();
    return lenh;
  }
}
