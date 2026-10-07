/**
 * Bat on thay duoc trong thanh pho TRUOC khi the bat on ra (Thu 3, 30/09).
 *
 * Ngon ngu hinh `kho-game/docs/KY_NANG_TRANG_THAI.md` muc 4, dong "Bat on -> noi loan":
 * bac 1 khoi den lac dac · bac 2 them dam dong + co do · bac 3 (the da mo) them lua tren mai,
 * day dan theo so gio con lai toi noi loan.
 *
 * CHI DOC `tg.batOn` (`chiSo` · `theMo` · `gioDaKe`) - khong ghi gi nguoc lai. Dam dong la
 * sprite nguoi vac hang CO SAN trong atlas, tron vao dong xep truc sau cua `veLopVat`.
 * Khoi, lua, co la hat cua lo `Hat` (Thu 1, Thu 2) - khong anh, khong trang atlas moi.
 *
 * `?tat=batOn` tat het. `?batOn=<so>` chi de so LOP VE doc (chup anh), mo phong khong biet.
 */
import soTho from '../../data/hieu_ung.json';
import { GIU_SANG, HINH, type Hat } from './Hat';
import { neoX, neoY } from './IsoMath';
import { docCoTat } from './HieuUngThanhPho';
import type { Ve } from './VeCanh';
import type { ThanhPho } from '../sim/city/City';
import type { ThuNha } from '../sim/city/Buildings';
import { doHuong, type Walker } from '../sim/city/Walkers';
import type { TheGioi } from '../sim/campaign/TheGioi';

const SO = soTho.batOn;
const NHA: ReadonlySet<string> = new Set(SO.nha);

/** Nhung so lop ve can de chia bac. */
export interface SoBatOnVe {
  readonly diem: number;
  readonly nguongThe: number;
  readonly theMo: boolean;
  readonly gioKe: number;
  readonly gioNoiLoan: number;
}

export type Bac = 0 | 1 | 2 | 3;

/** Bac bao truoc. Nguong la ti le cua nguong the (`hieu_ung.json > batOn.bac`). */
export function bacBatOn(s: SoBatOnVe, tiLe: readonly number[] = SO.bac): Bac {
  if (s.theMo || s.diem >= s.nguongThe) return 3;
  if (s.diem >= (tiLe[1] ?? 1) * s.nguongThe) return 2;
  if (s.diem >= (tiLe[0] ?? 1) * s.nguongThe) return 1;
  return 0;
}

/** Bam chi so ra 0..1: on dinh giua cac khung, khong nhap nhay. */
export const bam = (i: number): number => ((i * 2654435761) >>> 0) / 4294967296;

/** `k` nha dan trong khung, xep theo bam chi so - cung khung camera thi cung ket qua. */
export function chonNha(nha: readonly ThuNha[], trong: (n: ThuNha) => boolean, k: number): ThuNha[] {
  return nha.filter((n) => NHA.has(n.def.ten) && trong(n))
    .sort((m, n) => bam(m.chiSo) - bam(n.chiSo)).slice(0, k);
}

export type NguoiVe = Pick<Walker, 'a' | 'b' | 'kieu' | 'huong' | 'buoc'>;

/** Mot dam dong dung quanh cong nha, phan lon quay vao nha, doi chan theo `giay`. */
export function nguoiQuanh(n: ThuNha, so: number, giay: number): NguoiVe[] {
  const vao = doHuong(n.cong, n.oNha, 1);
  const ra: NguoiVe[] = [];
  for (let i = 0; i < so; i += 1) {
    const h = bam(n.chiSo * 31 + i);
    const h2 = bam(n.chiSo * 17 + i * 7 + 3);
    ra.push({
      a: n.cong.a + (h - 0.5) * SO.tanO,
      b: n.cong.b + (h2 - 0.5) * SO.tanO,
      kieu: i % 2,
      huong: i % 3 === 2 ? (vao + (h > 0.5 ? 1 : 3)) % 4 : vao,
      buoc: Math.floor(giay / SO.nhipChanGiay + h * 10),
    });
  }
  return ra;
}

// ---- Phan duoi chi chay trong trinh duyet ----

const theGioiCua = new WeakMap<ThanhPho, TheGioi>();
let url: { tat: boolean; de: number | undefined } | undefined;
const docUrl = (): { tat: boolean; de: number | undefined } => {
  if (url === undefined) {
    const q = new URLSearchParams(window.location.search);
    const de = Number(q.get('batOn') ?? Number.NaN);
    url = { tat: docCoTat(q.get('tat')).has('batOn'), de: Number.isFinite(de) ? de : undefined };
  }
  return url;
};

/** Goi mot lan luc noi the gioi vao man thanh pho. */
export function noiBatOn(tp: ThanhPho, tg: TheGioi): void {
  theGioiCua.set(tp, tg);
}

/** Bac va do tien toi noi loan (0..1) dang hien. `?tat=batOn` luon bac 0. */
export function bacTheGioi(tg: TheGioi): { bac: Bac; tien: number } {
  const u = docUrl();
  if (u.tat) return { bac: 0, tien: 0 };
  const so = tg.du.batOn;
  const diem = u.de ?? tg.batOn.chiSo;
  const s: SoBatOnVe = {
    diem, nguongThe: so.nguongThe, theMo: u.de === undefined ? tg.batOn.theMo : diem >= so.nguongThe,
    gioKe: tg.batOn.gioDaKe, gioNoiLoan: so.gioNoiLoan,
  };
  return { bac: bacBatOn(s), tien: Math.min(1, s.gioKe / Math.max(1, s.gioNoiLoan)) };
}

const bacCua = (tp: ThanhPho): { bac: Bac; tien: number } => {
  const tg = theGioiCua.get(tp);
  return tg === undefined ? { bac: 0, tien: 0 } : bacTheGioi(tg);
};

/** Nha nam trong phan giua khung camera (`giua` = ti le nua khung) - mep man de bi che. */
function trongKhung(ve: Ve): (n: ThuNha) => boolean {
  const nx = (ve.rongDev / 2 / ve.tiLe) * SO.giua;
  const ny = (ve.caoDev / 2 / ve.tiLe) * SO.giua;
  const oPx = ve.atlas.oPx();
  return (n) => Math.abs(neoX(n.oNha.a, n.oNha.b, oPx) - ve.camX) < nx && Math.abs(neoY(n.oNha.a, n.oNha.b, oPx) - ve.camY) < ny;
}

/** Nguoi cua dam dong, cho `veLopVat` tron vao dong xep truc sau. */
export function nguoiBatOn(ve: Ve, tp: ThanhPho): readonly NguoiVe[] {
  if (bacCua(tp).bac < 2) return [];
  const giay = performance.now() / 1000;
  return chonNha(tp.dsNhaThat(), trongKhung(ve), SO.damNha).flatMap((n) => nguoiQuanh(n, SO.nguoiMoiDam, giay));
}

interface HatBay { x: number; y: number; vy: number; tuoi: number; tho: number; ph: number; lua: boolean }

const ngau = (a: readonly number[]): number => {
  const lo = a[0] ?? 0;
  return lo + Math.random() * ((a[1] ?? lo) - lo);
};

/** Khoi den, lua, co tren nha bat on. Mot ban cho moi `HieuUng`. */
export class VeBatOn {
  private readonly hat: HatBay[] = [];
  private henKhoi = 0;
  private henLua = 0;

  /** Dinh mai giua khung sprite (toa do the gioi). Sprite chua co thi bo qua. */
  private dinh(ve: Ve, n: ThuNha): { x: number; y: number } | undefined {
    const ten = ve.atlas.co(n.def.sprite) ? n.def.sprite : `${n.def.sprite}_k0`;
    if (!ve.atlas.co(ten)) return undefined;
    const s = ve.atlas.o(ten);
    const oPx = ve.atlas.oPx();
    return { x: neoX(n.oNha.a, n.oNha.b, oPx) - s.ox + s.w / 2, y: neoY(n.oNha.a, n.oNha.b, oPx) - s.oy + s.h * SO.mai };
  }

  chay(hat: Hat, ve: Ve, tp: ThanhPho, dt: number, giay: number, dpr: number): void {
    const { bac, tien } = bacCua(tp);
    const dx = (x: number): number => (x - ve.camX) * ve.tiLe + ve.rongDev / 2;
    const dy = (y: number): number => (y - ve.camY) * ve.tiLe + ve.caoDev / 2;
    if (bac >= 1) {
      const nha = chonNha(tp.dsNhaThat(), trongKhung(ve), SO.khoiNha);
      this.henKhoi -= dt;
      this.henLua -= dt;
      const khoi = this.henKhoi <= 0;
      const lua = bac >= 3 && this.henLua <= 0;
      if (khoi) this.henKhoi = ngau(SO.khoi.nhipGiay);
      if (lua) this.henLua = ngau(SO.lua.nhipGiay) / (0.35 + 0.65 * tien);
      for (const n of nha) {
        const p = this.dinh(ve, n);
        if (p === undefined || this.hat.length >= SO.toiDa) continue;
        if (khoi) this.hat.push({ x: p.x, y: p.y, vy: -ngau(SO.khoi.bayLen), tuoi: 0, tho: ngau(SO.khoi.tuoiGiay), ph: Math.random() * 6.28, lua: false });
        if (lua) {
          this.hat.push({
            x: p.x + (Math.random() - 0.5) * SO.lua.tan, y: p.y + Math.random() * SO.lua.tan * 0.5,
            vy: -ngau(SO.lua.bayLen), tuoi: 0, tho: ngau(SO.lua.tuoiGiay), ph: Math.random() * 6.28, lua: true,
          });
        }
      }
      if (bac >= 2) this.veCo(hat, ve, tp, giay, dx, dy, dpr);
    }
    this.veHat(hat, ve, dt, giay, dx, dy, dpr);
  }

  private veHat(hat: Hat, ve: Ve, dt: number, giay: number, dx: (x: number) => number, dy: (y: number) => number, dpr: number): void {
    const k = SO.khoi;
    const l = SO.lua;
    for (let i = this.hat.length - 1; i >= 0; i -= 1) {
      const h = this.hat[i] as HatBay;
      h.tuoi += dt;
      if (h.tuoi > h.tho) { this.hat.splice(i, 1); continue; }
      h.x += (h.lua ? Math.sin(giay * 9 + h.ph) * 6 : k.gio + Math.sin(giay * 1.3 + h.ph) * 3) * dt;
      h.y += h.vy * dt;
      const t = h.tuoi / h.tho;
      if (h.lua) {
        const r = Math.max(((l.banKinh[1] ?? 8) * (1 - t) + (l.banKinh[0] ?? 3) * t) * ve.tiLe, l.toiThieuCss * dpr * (1 - t));
        const m = l.mau;
        hat.them(dx(h.x), dy(h.y), r, r * 1.3, m[0] ?? 1, (m[1] ?? 0.5) * (1 - 0.6 * t), m[2] ?? 0.1, Math.min(1, t / 0.1) * (1 - t) * l.doDac, HINH.tron + GIU_SANG);
      } else {
        const r = ((k.banKinh[0] ?? 4) + ((k.banKinh[1] ?? 20) - (k.banKinh[0] ?? 4)) * (1 - (1 - t) * (1 - t))) * ve.tiLe;
        const m = k.mau;
        hat.them(dx(h.x), dy(h.y), r, r * 0.9, m[0] ?? 0, m[1] ?? 0, m[2] ?? 0, Math.min(1, t / 0.12) * Math.pow(1 - t, 1.2) * k.doDac, HINH.tron);
      }
    }
  }

  /** Co do giua moi dam dong - kieu 8 cua `Hat` (Thu 2). Co toi thieu theo diem CSS. */
  private veCo(hat: Hat, ve: Ve, tp: ThanhPho, giay: number, dx: (x: number) => number, dy: (y: number) => number, dpr: number): void {
    const c = SO.co;
    const ry = Math.max(c.cao * ve.tiLe, c.toiThieuCss * dpr) / 2;
    const rx = ry * (c.rong / c.cao);
    const oPx = ve.atlas.oPx();
    for (const [i, n] of chonNha(tp.dsNhaThat(), trongKhung(ve), SO.damNha).entries()) {
      const x = dx(neoX(n.cong.a, n.cong.b, oPx)) + rx * 0.84;
      const y = dy(neoY(n.cong.a, n.cong.b, oPx)) - c.nang * ve.tiLe - ry;
      const pha = (giay * 1.1 + i * 0.37) % 1;
      hat.them(x, y, rx, ry, c.mau[0] ?? 0.8, c.mau[1] ?? 0.1, c.mau[2] ?? 0.1, 1, HINH.co + Math.min(pha, 0.99));
    }
  }
}
