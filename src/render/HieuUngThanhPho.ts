/**
 * Hieu ung man thanh pho (Thu 1, 30/09): hau ky, khoi bep, chim + bong chim, icon nha tac.
 *
 * CHI DOC mo phong: `ThuNha.nhipTac()` / `nhipDoi()` va danh sach nha. Khong ghi gi nguoc
 * lai - `sim:van`, `sim:tran` phai ra y nhu truoc (luat Thu 1, `docs/ke-hoach/2026-09-30-*`).
 *
 * Tat tung thu bang `?tat=`: `hauky` · `tilt` · `khoi` · `chim` · `icon` · `het` (moi thu, ca man tran),
 * nhieu cai cach nhau dau phay. Nut "Hieu ung" cua `Perf` tat ca lop luc dang choi.
 *
 * Lenh ve: canh 1 + lo hat 1 + hau ky 1 = 3, trong tran 4 (TECH_SPEC muc 2).
 */
import soTho from '../../data/hieu_ung.json';
import { HauKy } from './HauKy';
import { HINH, Hat } from './Hat';
import { neoX, neoY } from './IsoMath';
import type { Gl } from './Gl';
import type { Ve } from './VeCanh';
import type { ThanhPho } from '../sim/city/City';
import type { ThuNha } from '../sim/city/Buildings';

const SO = soTho;

/** Cac thu dang TAT theo `?tat=`. */
export function docCoTat(chuoi: string | null): ReadonlySet<string> {
  const tat = new Set((chuoi ?? '').split(',').map((s) => s.trim()).filter((s) => s !== ''));
  if (tat.has('het')) for (const t of ['hauky', 'tilt', 'khoi', 'chim', 'icon', 'bui', 'chop', 'co', 'nhat', 'khung']) tat.add(t);
  return tat;
}

/**
 * Do manh tilt-shift theo zoom: 0 o `tiltTuZoom` (thu nho het co, nhin ca thanh pho),
 * du manh tu `tiltDuZoom`.
 */
export function tiltTheoZoom(zoom: number): number {
  const k = (zoom - SO.hauKy.tiltTuZoom) / (SO.hauKy.tiltDuZoom - SO.hauKy.tiltTuZoom);
  const t = Math.min(1, Math.max(0, k));
  return SO.hauKy.tilt * t * t * (3 - 2 * t);
}

/** Icon nao hien tren nha nay, hay khong icon nao. Kho day uu tien - no dung ca chuoi sau. */
export function iconCua(nha: ThuNha, sauNhip: number): number | undefined {
  if (nha.def.kieu !== 'san_xuat') return undefined;
  if (nha.nhipTac() >= sauNhip) return HINH.khoDay;
  if (nha.nhipDoi() >= sauNhip) return HINH.thieuHang;
  return undefined;
}

const ngau = (a: readonly number[]): number => {
  const lo = a[0] ?? 0;
  return lo + Math.random() * ((a[1] ?? lo) - lo);
};
/** Chon nha co khoi theo bam chi so: on dinh giua cac khung, khong nhap nhay. */
const coKhoi = (i: number): boolean => ((i * 2654435761) >>> 0) / 4294967296 < SO.khoi.tiLeNhaCoKhoi;
const NHA_KHOI: ReadonlySet<string> = new Set(SO.khoi.nha);
const ONG_KHOI: ReadonlyMap<string, readonly number[]> = new Map(Object.entries(SO.khoi.ongKhoi));

interface HatKhoi { x: number; y: number; vy: number; tuoi: number; tho: number; ph: number }
interface Chim { x: number; y: number; vy: number; ph: number; co: number; tuoi: number }

class HieuUng {
  private readonly gl: Gl;
  private readonly tat: ReadonlySet<string>;
  private readonly hauKy: HauKy | undefined;
  private readonly hat: Hat;
  private readonly khoi: HatKhoi[] = [];
  private readonly don = new Map<number, number>();
  private readonly chim: Chim[] = [];
  private henChim = 2;
  private giay = 0;
  private truoc = 0;
  private bat = true;

  constructor(gl: Gl) {
    this.gl = gl;
    this.tat = docCoTat(new URLSearchParams(window.location.search).get('tat'));
    this.hauKy = this.tat.has('hauky') ? undefined : new HauKy(gl, SO.hauKy);
    this.hat = new Hat(gl, SO.khoi.toiDa + 400);
  }

  batDau(bat: boolean): void {
    this.bat = bat;
    if (bat) this.hauKy?.batDau();
    this.gl.batDauKhung();
  }

  ketThuc(ve: Ve, tp: ThanhPho, zoom: number, ms: number): number {
    const dt = this.truoc === 0 ? 0 : Math.min(0.05, (ms - this.truoc) / 1000);
    this.truoc = ms;
    this.giay += dt;
    if (!this.bat) return 0;
    const dpr = this.gl.tiLeDiemAnh();
    const nua = { x: ve.rongDev / 2 / ve.tiLe, y: ve.caoDev / 2 / ve.tiLe };
    const bien = { x0: ve.camX - nua.x, x1: ve.camX + nua.x, y0: ve.camY - nua.y, y1: ve.camY + nua.y };
    const dx = (x: number): number => (x - ve.camX) * ve.tiLe + ve.rongDev / 2;
    const dy = (y: number): number => (y - ve.camY) * ve.tiLe + ve.caoDev / 2;
    const nha = tp.dsNhaThat();
    if (!this.tat.has('chim')) this.chayChim(dt, bien, dx, dy, ve.tiLe, dpr);
    if (!this.tat.has('khoi')) this.chayKhoi(dt, nha, ve, bien, dx, dy);
    if (!this.tat.has('icon')) this.veIcon(nha, ve, dpr);
    let lenh = this.hat.xa();
    if (this.hauKy !== undefined) {
      lenh += this.hauKy.ketThuc({
        camX: ve.camX, camY: ve.camY, tiLe: ve.tiLe, giay: this.giay, may: true,
        tilt: this.tat.has('tilt') ? 0 : tiltTheoZoom(zoom),
      });
    }
    this.gl.khoiPhuc();
    return lenh;
  }

  /**
   * Dinh ong khoi (toa do the gioi) cua mot nha. Vi tri tinh bang phan cua khung sprite,
   * do tren anh chup (`data/hieu_ung.json > khoi.ongKhoi`); sprite chua do thi khong co khoi.
   */
  private ongKhoi(ve: Ve, n: ThuNha): { x: number; y: number } | undefined {
    const ten = ve.atlas.co(n.def.sprite) ? n.def.sprite : `${n.def.sprite}_k0`;
    if (!ve.atlas.co(ten)) return undefined;
    const phan = ONG_KHOI.get(n.def.sprite);
    if (phan === undefined) return undefined;
    const s = ve.atlas.o(ten);
    const oPx = ve.atlas.oPx();
    return {
      x: neoX(n.oNha.a, n.oNha.b, oPx) - s.ox + s.w * (phan[0] ?? 0.5),
      y: neoY(n.oNha.a, n.oNha.b, oPx) - s.oy + s.h * (phan[1] ?? 0),
    };
  }

  private chayKhoi(
    dt: number, nha: readonly ThuNha[], ve: Ve, b: Bien,
    dx: (x: number) => number, dy: (y: number) => number,
  ): void {
    const k = SO.khoi;
    for (const n of nha) {
      if (!NHA_KHOI.has(n.def.ten) || !coKhoi(n.chiSo)) continue;
      // Nha dung vi tac thi het khoi - dung nhu bang tin hieu (`KY_NANG_TRANG_THAI.md` muc 4).
      if (n.nhipTac() > 0 || n.nhipDoi() > 0) continue;
      const p = this.ongKhoi(ve, n);
      if (p === undefined || p.x < b.x0 || p.x > b.x1 || p.y < b.y0 - 40 || p.y > b.y1 + 40) continue;
      let con = (this.don.get(n.chiSo) ?? ngau(k.nhipGiay)) - dt;
      while (con <= 0) {
        con += ngau(k.nhipGiay);
        if (this.khoi.length < k.toiDa) {
          this.khoi.push({ x: p.x, y: p.y, vy: -ngau(k.bayLen), tuoi: 0, tho: ngau(k.tuoiGiay), ph: Math.random() * 6.28 });
        }
      }
      this.don.set(n.chiSo, con);
    }
    const [r0, r1] = [k.banKinh[0] ?? 3, k.banKinh[1] ?? 16];
    for (let i = this.khoi.length - 1; i >= 0; i -= 1) {
      const h = this.khoi[i] as HatKhoi;
      h.tuoi += dt;
      if (h.tuoi > h.tho) { this.khoi.splice(i, 1); continue; }
      h.x += (k.gio + Math.sin(this.giay * 1.3 + h.ph) * 3) * dt;
      h.y += h.vy * dt;
      h.vy *= 1 - 0.16 * dt;
      const t = h.tuoi / h.tho;
      const r = (r0 + (r1 - r0) * (1 - (1 - t) * (1 - t))) * ve.tiLe;
      const a = Math.min(1, t / 0.12) * Math.pow(1 - t, 1.3) * k.doDac;
      this.hat.them(dx(h.x), dy(h.y), r, r * 0.9, 0.8, 0.82, 0.86, a, HINH.tron);
    }
  }

  private chayChim(
    dt: number, b: Bien, dx: (x: number) => number, dy: (y: number) => number, tiLe: number, dpr: number,
  ): void {
    const c = SO.chim;
    this.henChim -= dt;
    if (this.henChim <= 0) {
      this.henChim = ngau(c.henGiay);
      const y0 = b.y0 + (0.2 + Math.random() * 0.7) * (b.y1 - b.y0);
      const so = Math.round(ngau(c.soMoiDan));
      for (let i = 0; i < so; i += 1) {
        const hang = Math.ceil(i / 2);
        const phia = i % 2 === 1 ? 1 : -1;
        this.chim.push({
          x: b.x0 - 20 - hang * 3 * c.co, y: y0 + phia * hang * 2.2 * c.co, vy: -c.tocDo * (0.15 + Math.random() * 0.1),
          ph: Math.random() * 6.28, co: 0.85 + Math.random() * 0.3, tuoi: 0,
        });
      }
    }
    const co = Math.max(c.co * tiLe, 5 * dpr);
    const [lx, ly] = [c.bongLech[0] ?? 0, c.bongLech[1] ?? 0];
    for (let i = this.chim.length - 1; i >= 0; i -= 1) {
      const m = this.chim[i] as Chim;
      m.tuoi += dt;
      if (m.tuoi > c.tuoiGiay) { this.chim.splice(i, 1); continue; }
      m.x += c.tocDo * dt;
      m.y += m.vy * dt + Math.sin(this.giay * 1.7 + m.ph) * 0.6 * dt * c.co;
      // Bong duoi dat lech theo huong nang nuong san: cam giac chim o tren cao.
      this.hat.them(dx(m.x + lx), dy(m.y + ly), co * 0.65 * m.co, co * 0.32 * m.co, 0.04, 0.06, 0.04, 0.2, HINH.tron);
    }
    for (const m of this.chim) {
      const vo = 0.5 + 0.5 * Math.sin(this.giay * 9 + m.ph);
      this.hat.them(dx(m.x), dy(m.y), co * m.co, co * 0.7 * m.co, 0.12, 0.12, 0.14, 0.9, HINH.chim + Math.min(vo, 0.99));
    }
  }

  private veIcon(nha: readonly ThuNha[], ve: Ve, dpr: number): void {
    const R = SO.icon.banKinhCss * dpr;
    const nhun = Math.sin(this.giay * 3) * 1.5 * dpr;
    for (const n of nha) {
      const hinh = iconCua(n, SO.icon.sauNhip);
      if (hinh === undefined) continue;
      const ten = ve.atlas.co(n.def.sprite) ? n.def.sprite : `${n.def.sprite}_k0`;
      if (!ve.atlas.co(ten)) continue;
      const s = ve.atlas.o(ten);
      const oPx = ve.atlas.oPx();
      const x = (neoX(n.oNha.a, n.oNha.b, oPx) - s.ox + s.w / 2 - ve.camX) * ve.tiLe + ve.rongDev / 2;
      const y = (neoY(n.oNha.a, n.oNha.b, oPx) - s.oy - ve.camY) * ve.tiLe + ve.caoDev / 2 - R * 0.4 + nhun;
      if (x < -R || x > ve.rongDev + R || y < -R || y > ve.caoDev + R) continue;
      const nen = hinh === HINH.khoDay ? [0.62, 0.38, 0.1] : [0.66, 0.16, 0.12];
      this.hat.them(x, y, R, R, nen[0] ?? 0, nen[1] ?? 0, nen[2] ?? 0, 0.95, HINH.bong);
      this.hat.them(x, y, R * 0.68, R * 0.68, 1, 1, 1, 1, hinh);
    }
  }
}

interface Bien { x0: number; x1: number; y0: number; y1: number }

const moiGl = new WeakMap<Gl, HieuUng>();
const cua = (gl: Gl): HieuUng => {
  let h = moiGl.get(gl);
  if (h === undefined) { h = new HieuUng(gl); moiGl.set(gl, h); }
  return h;
};

/**
 * Mo khung hinh: co hau ky thi ve canh vao FBO, roi `gl.batDauKhung()`. Thay cho loi goi
 * `gl.batDauKhung()` o `CityScene` - mot dong, vi file do da cham tran 300 dong.
 */
export function batDauKhungCoHieuUng(gl: Gl, bat: boolean): void {
  cua(gl).batDau(bat);
}

/** Ve hat, icon, hau ky sau `gl.ketThucKhung()`. Tra ve so lenh ve them. */
export function ketThucHieuUng(ve: Ve, tp: ThanhPho, zoom: number, ms: number): number {
  return cua(ve.gl).ketThuc(ve, tp, zoom, ms);
}
