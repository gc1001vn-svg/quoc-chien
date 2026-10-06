/**
 * Ban dem cua thanh pho (Buoc 2 ngay/dem, 05/10): mau toi cho sprite, den cua so nha dan, lua trai o
 * nga tu kho, "Zzz" tren nha dan tat den. Mau Survivor Island (`docs/NHAT_KY/NHAN_GAME_TU_ANH_04_10.md`
 * phan 4), ke hoach `docs/ke-hoach/2026-10-05-buoc-2-ngay-dem.md`.
 *
 * CHI DOC mo phong: nhip (`Ve.nhipSim`), `banDo.vat`, danh sach kho. Sim khong doi gi - nguoi vac van
 * chay suot dem, lop ve chi giau bot (`NgayDem.nguoiTrongDem`, goi o `VeCanh.veLopVat`). Den, lua, Zzz
 * la hat lo `Hat` - khong anh, khong trang atlas, khong them lenh ve (quang sang cong thuan, `Hat.ts`).
 *
 * `?tat=dem` tat het (ban ngay nhu cu) · `?tat=den` (den, lua) · `?tat=zzz`. `?gio=<0..24>` ghim gio,
 * `?gio=lap` chay mot ngay trong `chuKyLapGiay` giay that - chi de chup anh, quay clip.
 */
import { GIU_SANG, HINH, type Hat } from './Hat';
import { neoX, neoY } from './IsoMath';
import { docCoTat } from './HieuUngThanhPho';
import { bam } from './HieuUngBatOn';
import { biCheBoi, phanXay } from './HieuUngXay';
import { SO_XAY } from './TungBuoc';
import { BAN_NGAY, SO_DEM, docGio, theoGio, theoNhip, type TrangThaiDem } from './NgayDem';
import type { Gl } from './Gl';
import type { Ve } from './VeCanh';
import type { BanDo, O, OVat } from '../sim/city/BanDo';
import type { ThanhPho } from '../sim/city/City';

const SO = SO_DEM;
const NHA: ReadonlySet<string> = new Set(SO.nha);

interface ThamSoUrl { readonly tat: ReadonlySet<string>; readonly gio: number | 'lap' | undefined }
let url: ThamSoUrl | undefined;
const docUrl = (): ThamSoUrl => {
  if (url === undefined) {
    const q = new URLSearchParams(window.location.search);
    url = { tat: docCoTat(q.get('tat')), gio: docGio(q.get('gio')) };
  }
  return url;
};

/** Ngay/dem cua khung nay: theo nhip mo phong, hay theo `?gio=`. `?tat=dem` la ban ngay. */
export function trangThaiKhung(nhipSim: number | undefined): TrangThaiDem {
  const { tat, gio } = docUrl();
  if (tat.has('dem') || nhipSim === undefined) return BAN_NGAY;
  if (gio === 'lap') return theoGio((((performance.now() / 1000 / SO.chuKyLapGiay) % 1) * 24 + SO.gioDauChuKy) % 24);
  return gio === undefined ? theoNhip(nhipSim) : theoGio(gio);
}

const noiToi = new WeakMap<WebGLProgram, WebGLUniformLocation | null>();

/**
 * Dat `u_toi` cho chuong trinh sprite DANG DUNG. Goi dau khung, truoc moi `gl.them` - doi uniform giua
 * khung la phai xa lo som (+1 lenh ve). Dat MOI khung: len doi doi me la doi ca chuong trinh shader
 * (`Gl.datTrang`), chuong trinh moi mang 0. Shader khong co `u_toi` thi vi tri null, WebGL bo qua.
 */
export function datToiSprite(gl: Gl, t: TrangThaiDem): void {
  const g = gl.ctx();
  const ct = g.getParameter(g.CURRENT_PROGRAM) as WebGLProgram | null;
  if (ct === null) return;
  let noi = noiToi.get(ct);
  if (noi === undefined) {
    noi = g.getUniformLocation(ct, 'u_toi');
    noiToi.set(ct, noi);
  }
  g.uniform3f(noi, 1 - t.mau[0], 1 - t.mau[1], 1 - t.mau[2]);
}

interface Tan { x: number; y: number; vx: number; vy: number; tuoi: number; tho: number }
type Mau = readonly number[];

const ngau = (a: readonly number[]): number => {
  const lo = a[0] ?? 0;
  return lo + Math.random() * ((a[1] ?? lo) - lo);
};
/** Mot diem: toa do the gioi (`wx`, `wy`) va toa do man (`x`, `y`, diem anh khung ve). */
interface Diem { readonly wx: number; readonly wy: number; readonly x: number; readonly y: number }

/** Doi diem the gioi ra man; `undefined` khi nam ngoai man qua le `le` diem anh. */
function trenMan(ve: Ve, wx: number, wy: number, le: number): Diem | undefined {
  const x = (wx - ve.camX) * ve.tiLe + ve.rongDev / 2;
  const y = (wy - ve.camY) * ve.tiLe + ve.caoDev / 2;
  if (x < -le || x > ve.rongDev + le || y < -le || y > ve.caoDev + le) return undefined;
  return { wx, wy, x, y };
}

/** Bam o cua nha: nha nao thap den, nha nao ngu - on dinh giua cac khung va giua cac dem. */
const bamNha = (v: OVat): number => bam(v.a * 131 + v.b + 1);

/** Den, lua, Zzz. Mot ban cho moi `HieuUng`. */
export class VeDem {
  private readonly tan: Tan[] = [];
  private henTan = 0;
  private nha: { dai: number; ds: OVat[] } | undefined;
  private readonly che = new Map<string, boolean>();
  private readonly cho = new Map<string, O>();
  private daiChe = -1;

  chay(hat: Hat, ve: Ve, tp: ThanhPho, dt: number, giay: number, dpr: number): void {
    const t = ve.toi ?? BAN_NGAY;
    if (t.dem <= 0) { this.tan.length = 0; return; }
    const banDo = tp.banDo;
    if (this.daiChe !== banDo.vat.length) { this.che.clear(); this.cho.clear(); this.daiChe = banDo.vat.length; }
    const { tat } = docUrl();
    const nha = this.nhaDan(banDo);
    if (!tat.has('den')) {
      this.veDen(hat, ve, banDo, nha, t.dem, giay, dpr);
      this.veLua(hat, ve, banDo, tp.doiWalker.danhSachKho, t.dem, dt, giay, dpr);
    }
    if (!tat.has('zzz') && t.dem > SO.zzz.nguong) this.veZzz(hat, ve, nha, t.dem, giay, dpr);
  }

  /** Nha dan tren ban do, giu theo do dai `banDo.vat` (chi them, khong bot). */
  private nhaDan(banDo: BanDo): readonly OVat[] {
    if (this.nha?.dai !== banDo.vat.length) {
      this.nha = { dai: banDo.vat.length, ds: banDo.vat.filter((v) => NHA.has(v.ten)) };
    }
    return this.nha.ds;
  }

  /** Diem `phan` cua khung sprite nha `v` (toa do the gioi + man); `undefined` khi chua co hinh, dang xay, ngoai man. */
  private diem(ve: Ve, v: OVat, phan: Mau, le: number): Diem | undefined {
    const ten = ve.atlas.co(v.ten) ? v.ten : `${v.ten}_k0`;
    if (!ve.atlas.co(ten) || phanXay(ve, v) !== undefined) return undefined;
    const s = ve.atlas.o(ten);
    const oPx = ve.atlas.oPx();
    const wx = neoX(v.a, v.b, oPx) - s.ox + s.w * (phan[0] ?? 0.5);
    const wy = neoY(v.a, v.b, oPx) - s.oy + s.h * (phan[1] ?? 0.5);
    return trenMan(ve, wx, wy, le);
  }

  private veDen(hat: Hat, ve: Ve, banDo: BanDo, nha: readonly OVat[], dem: number, giay: number, dpr: number): void {
    const d = SO.den;
    const oPx = ve.atlas.oPx();
    const R = d.banKinh * oPx * ve.tiLe;
    const r = Math.max(d.loi * oPx * ve.tiLe, d.toiThieuCss * dpr);
    let so = 0;
    for (const v of nha) {
      const h = bamNha(v);
      if (h >= d.tiLe) continue;
      if (this.diem(ve, v, [0.5, 0.5], R * 4) === undefined) continue;
      if (so >= d.toiDa) break;
      so += 1;
      const nhay = 1 - d.nhapNhay * (0.5 + 0.5 * Math.sin(giay * (2 + h * 3) + h * 40));
      for (const [i, vt] of d.viTri.entries()) {
        const p = this.diem(ve, v, vt, R);
        if (p === undefined) continue;
        hat.them(p.x, p.y, R, R * 0.8, d.mau[0] ?? 1, d.mau[1] ?? 1, d.mau[2] ?? 1, d.doDac * dem * nhay, HINH.sang);
        if (!this.biChe(ve, banDo, `${String(v.a)},${String(v.b)},${String(i)}`, v.a + v.b + 2 * (v.o - 1), p, d.loi * oPx)) {
          hat.them(p.x, p.y, r, r, d.mauLoi[0] ?? 1, d.mauLoi[1] ?? 1, d.mauLoi[2] ?? 1, dem * nhay, HINH.tron + GIU_SANG);
        }
      }
    }
  }

  private veLua(
    hat: Hat, ve: Ve, banDo: BanDo, kho: readonly O[], dem: number, dt: number, giay: number, dpr: number,
  ): void {
    const l = SO.lua;
    const oPx = ve.atlas.oPx();
    const R = l.banKinh * oPx * ve.tiLe;
    const rl = Math.max(l.loi * oPx * ve.tiLe, l.toiThieuCss * dpr);
    const [mr, mg, mb] = [l.mau[0] ?? 1, l.mau[1] ?? 1, l.mau[2] ?? 1];
    this.henTan -= dt;
    const phat = this.henTan <= 0;
    if (phat) this.henTan = l.tan.nhipGiay;
    for (const [i, k] of kho.entries()) {
      const o = this.choLua(ve, banDo, k);
      const wy = neoY(o.a, o.b, oPx);
      const p = trenMan(ve, neoX(o.a, o.b, oPx), wy, R);
      if (p === undefined) continue;
      const nhay = 1 - l.nhapNhay * (0.5 + 0.5 * Math.sin(giay * 11 + i * 2.1) * Math.sin(giay * 7.3 + i));
      // Quang sang tren mat dat (det theo goc nhin xeo) va quanh ngon lua - van con khi loi lua bi che.
      hat.them(p.x, p.y, R, R * 0.55, mr, mg, mb, l.doDac * dem * nhay, HINH.sang);
      const q = rl * l.quangLoi.banKinh;
      hat.them(p.x, p.y - rl, q, q, mr, mg, mb, l.quangLoi.doDac * dem * nhay, HINH.sang);
      const ngon = { ...p, wy: wy - l.loi * oPx };
      if (this.biChe(ve, banDo, `k${String(o.a)},${String(o.b)}`, o.a + o.b, ngon, l.loi * oPx * 1.6)) continue;
      // Hai khuc cui bat cheo theo hai truc o nen (doc 1:2), roi ngon lua hai lop: ngoai cam, loi vang.
      // Cui duoc lua roi sang nen khong toi theo dem.
      const [c, cd] = [rl * l.cui.dai, rl * l.cui.day];
      const [cr, cg, cb] = [l.cui.mau[0] ?? 0, l.cui.mau[1] ?? 0, l.cui.mau[2] ?? 0];
      hat.themQue(p.x - c, p.y + c * 0.5, p.x + c, p.y - c * 0.5, cd, cr, cg, cb, dem, HINH.que + GIU_SANG);
      hat.themQue(p.x - c, p.y - c * 0.5, p.x + c, p.y + c * 0.5, cd, cr * 0.85, cg * 0.85, cb * 0.85, dem, HINH.que + GIU_SANG);
      hat.them(p.x, p.y - rl * 0.9 * nhay, rl * nhay, rl * 1.7 * nhay, l.mauLoi[0] ?? 1, l.mauLoi[1] ?? 1, l.mauLoi[2] ?? 1, dem, HINH.tron + GIU_SANG);
      hat.them(p.x, p.y - rl * 0.6, rl * 0.55, rl * 0.95 * nhay, l.mauTam[0] ?? 1, l.mauTam[1] ?? 1, l.mauTam[2] ?? 1, dem, HINH.tron + GIU_SANG);
      if (phat && this.tan.length < l.tan.toiDa) {
        this.tan.push({
          x: p.wx, y: ngon.wy, vx: (Math.random() - 0.5) * l.tan.ngang, vy: -ngau(l.tan.bayLen), tuoi: 0, tho: ngau(l.tan.tuoiGiay),
        });
      }
    }
    this.veTan(hat, ve, dt, dem, dpr);
  }

  /** Cho dat lua cua kho `k`: cho dau tien trong `oThu` ma loi lua khong bi che; nho theo kho. */
  private choLua(ve: Ve, banDo: BanDo, k: O): O {
    const khoa = `c${String(k.a)},${String(k.b)}`;
    const nho = this.cho.get(khoa);
    if (nho !== undefined) return nho;
    const oPx = ve.atlas.oPx();
    const l = SO.lua;
    const thu = l.oThu.map(([da = 0, db = 0]) => ({ a: k.a + da, b: k.b + db }));
    const tot = thu.find((o) => !biCheBoi(ve, banDo, o.a + o.b, {
      // Cung hop voi phep che loi lua o `veLua`: tam cao hon chan mot `loi`, ban kinh 1,6 `loi`.
      x0: neoX(o.a, o.b, oPx) - l.loi * oPx * 1.6, x1: neoX(o.a, o.b, oPx) + l.loi * oPx * 1.6,
      y0: neoY(o.a, o.b, oPx) - l.loi * oPx * 2.6, y1: neoY(o.a, o.b, oPx) + l.loi * oPx * 0.6,
    }, SO_XAY.cheToiDa, true)) ?? thu[0] ?? k;
    this.cho.set(khoa, tot);
    return tot;
  }

  private veTan(hat: Hat, ve: Ve, dt: number, dem: number, dpr: number): void {
    const t = SO.lua.tan;
    const r = Math.max(t.co * ve.tiLe, t.toiThieuCss * dpr);
    for (let i = this.tan.length - 1; i >= 0; i -= 1) {
      const h = this.tan[i] as Tan;
      h.tuoi += dt;
      if (h.tuoi > h.tho) { this.tan.splice(i, 1); continue; }
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      const x = (h.x - ve.camX) * ve.tiLe + ve.rongDev / 2;
      const y = (h.y - ve.camY) * ve.tiLe + ve.caoDev / 2;
      hat.them(x, y, r, r, t.mau[0] ?? 1, t.mau[1] ?? 1, t.mau[2] ?? 1, dem * (1 - h.tuoi / h.tho), HINH.tron + GIU_SANG);
    }
  }

  /** Ba chu Z bay len cheo tu mai nha tat den, lon dan, mo dan; moi chu ba que. */
  private veZzz(hat: Hat, ve: Ve, nha: readonly OVat[], dem: number, giay: number, dpr: number): void {
    const z = SO.zzz;
    const hien = Math.min(1, (dem - z.nguong) / (1 - z.nguong));
    const day = Math.max(z.day * ve.tiLe, 1.2 * dpr);
    const [bx, by] = [(z.bay[0] ?? 0) * ve.tiLe, (z.bay[1] ?? 0) * ve.tiLe];
    let so = 0;
    for (const v of nha) {
      const h = bamNha(v);
      if (h < SO.den.tiLe) continue;
      const p = this.diem(ve, v, z.viTri, by + 20 * dpr);
      if (p === undefined) continue;
      if (so >= z.toiDa) break;
      so += 1;
      for (let j = 0; j < 3; j += 1) {
        const u = (giay / z.chuKyGiay + h * 7 + j / 3) % 1;
        const s = Math.max(z.co * ve.tiLe, z.toiThieuCss * dpr) * (0.6 + 0.8 * u);
        const [x, y] = [p.x + bx * u, p.y - by * u];
        const a = Math.sin(Math.PI * u) * hien;
        const [r, g, b] = [z.mau[0] ?? 1, z.mau[1] ?? 1, z.mau[2] ?? 1];
        hat.themQue(x - s, y - s, x + s, y - s, day, r, g, b, a, HINH.que + GIU_SANG);
        hat.themQue(x + s, y - s, x - s, y + s, day, r, g, b, a, HINH.que + GIU_SANG);
        hat.themQue(x - s, y + s, x + s, y + s, day, r, g, b, a, HINH.que + GIU_SANG);
      }
    }
  }

  /**
   * Vat dung truoc che dom sang o `p.wx, p.wy` ban kinh `k` (toa do the gioi) khong - hat ve sau moi sprite
   * nen dom den, ngon lua se de len nha dung truoc. Tinh mot lan cho moi cho, tinh lai khi ban do co vat moi.
   */
  private biChe(ve: Ve, banDo: BanDo, khoa: string, sauV: number, p: Diem, k: number): boolean {
    const cu = this.che.get(khoa);
    if (cu !== undefined) return cu;
    const co = biCheBoi(ve, banDo, sauV, { x0: p.wx - k, y0: p.wy - k, x1: p.wx + k, y1: p.wy + k }, SO_XAY.cheToiDa, true);
    this.che.set(khoa, co);
    return co;
  }
}
