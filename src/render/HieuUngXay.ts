/**
 * Nha moc dan (Buoc 1 "xay nha tung buoc", 04/10): vach mong -> moc tu duoi len + gian giao, bui,
 * tho dung go, mat go bay -> loe sang -> xong. Mau Survivor Island (`docs/NHAT_KY/NHAN_GAME_TU_ANH_04_10.md`),
 * ke hoach `docs/ke-hoach/2026-10-04-buoc-1-xay-nha-tung-buoc.md`.
 *
 * CHI DOC `OVat.nhipXay` ma sim ghi luc thong doc xay - khong ghi gi nguoc lai. Tien do o `TungBuoc.ts`
 * (theo nhip mo phong). Sprite moc dan cat o `VeCanh.datSprite`; tho la sprite nguoi vac hang CO SAN,
 * tron vao dong xep truc sau cua `veLopVat`. Que, bui, mat go, vong sang la hat lo `Hat` - khong anh,
 * khong trang atlas moi, khong them lenh ve.
 *
 * `?tat=xay` tat het: nha hien ngay nhu truoc. `?xayTien=<0..1>` ghim tien do cac cong truong khoi
 * cong tu luc mo man, `?xayTien=lap` cho chay lap - chi de chup anh, quay clip (`?xay=` o `ThamSoCanh.ts`).
 */
import { HINH, type Hat } from './Hat';
import { neoX, neoY } from './IsoMath';
import { docCoTat } from './HieuUngThanhPho';
import { bam, type NguoiVe } from './HieuUngBatOn';
import { SO_XAY, catTren, tienDoTheoPhan, tienDoXay, type TienDo } from './TungBuoc';
import type { Ve } from './VeCanh';
import { congRaDuong, type BanDo, type O, type OVat } from '../sim/city/BanDo';
import { doHuong } from '../sim/city/Walkers';

const SO = SO_XAY;

interface ThamSoUrl { readonly tat: boolean; readonly tien: number | 'lap' | undefined }
let url: ThamSoUrl | undefined;
const docUrl = (): ThamSoUrl => {
  if (url === undefined) {
    const q = new URLSearchParams(window.location.search);
    const tho = q.get('xayTien');
    const so = Number(tho ?? Number.NaN);
    url = { tat: docCoTat(q.get('tat')).has('xay'), tien: tho === 'lap' ? 'lap' : Number.isFinite(so) ? so : undefined };
  }
  return url;
};
/** Nhip mo phong o khung dau tien - `?xayTien` chi ghim cong truong khoi cong tu day ve sau. */
let moMan: number | undefined;

/** Tien do cua vat `v` o khung nay; `undefined` khi no khong phai cong truong dang xay. */
export function phanXay(ve: Ve, v: OVat): TienDo | undefined {
  if (v.nhipXay === undefined || ve.nhipSim === undefined || docUrl().tat) return undefined;
  moMan ??= ve.nhipSim;
  const ghim = docUrl().tien;
  const tien = ghim === 'lap' ? (performance.now() / 1000 / SO.chuKyLapGiay) % 1 : ghim;
  const p: TienDo = tien !== undefined && v.nhipXay >= moMan - SO.thoiLuongNhip
    ? tienDoTheoPhan(tien) : tienDoXay(v.nhipXay, ve.nhipSim);
  return p.giaiDoan === 'xong' ? undefined : p;
}

/** Cat sprite dang moc (`VeCanh.datSprite`): tu goc sau cua o tro xuong hien ngay, phan tren moc dan. */
export function catSprite(
  ve: Ve, p: TienDo, y0: number, y1: number, oy: number, v0: number, v1: number,
): readonly [number, number] {
  return catTren(p.hien, y0, y1, y0 + (oy - SO.giuDay * ve.atlas.oPx()) * ve.tiLe, v0, v1);
}

interface CongTruong { readonly v: OVat; readonly p: TienDo }
const daXay = new WeakMap<BanDo, { dai: number; ds: OVat[] }>();

/** Cong trinh dang xay o khung nay, moi khoi cong truoc. */
function congTruong(ve: Ve, banDo: BanDo): CongTruong[] {
  let c = daXay.get(banDo);
  // `banDo.vat` chi them, khong bot: so vat doi la vua co thu moi xay.
  if (c?.dai !== banDo.vat.length) {
    const ds = banDo.vat.filter((v) => v.nhipXay !== undefined).sort((m, n) => (n.nhipXay ?? 0) - (m.nhipXay ?? 0));
    c = { dai: banDo.vat.length, ds };
    daXay.set(banDo, c);
  }
  const ra: CongTruong[] = [];
  for (const v of c.ds) {
    const p = phanXay(ve, v);
    // Xep moi truoc: mot cai da xong thi moi cai khoi cong som hon cung da xong.
    if (p === undefined) break;
    ra.push({ v, p });
  }
  return ra;
}

/** Cho tho dung: o duong truoc cong, lui vao phia nha `lui` o. */
function choTho(v: OVat, banDo: BanDo, lui: number): { a: number; b: number; cong: O } {
  const cong = congRaDuong(v, banDo.duongCach);
  return { a: cong.a + (v.a - cong.a) * lui, b: cong.b + (v.b - cong.b) * lui, cong };
}

/** Tho dung go truoc moi cong truong dang mong, dang moc - cho `veLopVat` tron vao dong xep truc sau. */
export function nguoiXay(ve: Ve, banDo: BanDo): NguoiVe[] {
  const giay = performance.now() / 1000;
  const ra: NguoiVe[] = [];
  for (const { v, p } of congTruong(ve, banDo)) {
    if (p.giaiDoan === 'loe') continue;
    const t = choTho(v, banDo, SO.tho.lui);
    const h = bam(v.a * 131 + v.b);
    // Doi chan moi nhat go: nguoi vac hang khong co hinh vung bua, hai dang chan la nhip go.
    ra.push({ a: t.a, b: t.b, kieu: h < 0.5 ? 0 : 1, huong: doHuong(t.cong, v, 1), buoc: Math.floor(giay / SO.go.nhipGiay + h * 10) });
  }
  return ra;
}

interface HatBay { x: number; y: number; vx: number; vy: number; tuoi: number; tho: number; r: number; mat: boolean }
interface Hop4 { readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number }
type Diem = readonly [number, number];

const ngau = (a: readonly number[]): number => {
  const lo = a[0] ?? 0;
  return lo + Math.random() * ((a[1] ?? lo) - lo);
};

/** Que, bui, mat go, vong sang cua moi cong truong. Mot ban cho moi `HieuUng`. */
export class VeXay {
  private readonly bay: HatBay[] = [];
  private readonly che = new Map<OVat, boolean>();
  private daiChe = -1;
  private henBui = 0;
  private henGo = 0;

  chay(hat: Hat, ve: Ve, banDo: BanDo, dt: number, dpr: number): void {
    const oPx = ve.atlas.oPx();
    const dx = (x: number): number => (x - ve.camX) * ve.tiLe + ve.rongDev / 2;
    const dy = (y: number): number => (y - ve.camY) * ve.tiLe + ve.caoDev / 2;
    if (this.daiChe !== banDo.vat.length) { this.che.clear(); this.daiChe = banDo.vat.length; }
    this.henBui -= dt;
    this.henGo -= dt;
    const bui = this.henBui <= 0;
    const go = this.henGo <= 0;
    if (bui) this.henBui = ngau(SO.bui.nhipGiay);
    if (go) this.henGo = SO.go.nhipGiay;
    const q = SO.que;
    const day = Math.max(q.day * ve.tiLe, q.toiThieuCss * dpr);
    const que = (p0: Diem, p1: Diem, mau: readonly number[], f = 1): void => {
      hat.themQue(dx(p0[0]), dy(p0[1]), dx(p0[0] + (p1[0] - p0[0]) * f), dy(p0[1] + (p1[1] - p0[1]) * f), day,
        mau[0] ?? 0, mau[1] ?? 0, mau[2] ?? 0, q.doDac);
    };
    let so = 0;
    for (const { v, p } of congTruong(ve, banDo)) {
      const ten = ve.atlas.co(v.ten) ? v.ten : `${v.ten}_k0`;
      if (!ve.atlas.co(ten)) continue;
      const s = ve.atlas.o(ten);
      const [ax, ay] = [neoX(v.a, v.b, oPx), neoY(v.a, v.b, oPx)];
      const dinh = ay - s.oy;
      if (dx(ax - s.ox + s.w) < 0 || dx(ax - s.ox) > ve.rongDev || dy(dinh + s.h) < 0 || dy(dinh) > ve.caoDev) continue;
      if (so >= SO.toiDaCongTruong) break;
      so += 1;
      // Hinh thoi mong: trai, truoc, phai, sau - rong hon mot o theo `coMong`.
      const k = SO.coMong * oPx;
      const [L, F, R, B]: readonly [Diem, Diem, Diem, Diem] = [[ax - k / 2, ay], [ax, ay + k / 4], [ax + k / 2, ay], [ax, ay - k / 4]];
      if (p.giaiDoan === 'mong') {
        // Bon canh vach lan luot.
        const n = (p.t / SO.mong) * 4;
        for (const [i, [p0, p1]] of ([[B, R], [R, F], [F, L], [L, B]] as const).entries()) {
          if (n > i) que(p0, p1, q.mauMong, Math.min(1, n - i));
        }
      } else if (p.giaiDoan === 'moc') {
        const giu = ay - SO.giuDay * oPx;
        const tren = giu - p.hien * (giu - dinh) - q.nhoLen;
        if (!this.biChe(ve, banDo, v, { x0: L[0], y0: dinh, x1: R[0], y1: F[1] })) {
          for (const c of [L, F, R]) if (c[1] - tren > 2) que(c, [c[0], tren], q.mau);
          // Van ngang theo hai canh truoc, tung tang mot, toi ngang dinh cot.
          for (let h = q.tang; ay - h >= tren; h += q.tang) {
            que([L[0], L[1] - h], [F[0], F[1] - h], q.mau);
            que([F[0], F[1] - h], [R[0], R[1] - h], q.mau);
          }
        }
        if (go) this.phatMat(choTho(v, banDo, SO.tho.lui + 0.3), oPx);
      } else {
        const u = (p.t - SO.xongMoc) / (1 - SO.xongMoc);
        const l = SO.loe;
        const r = ((l.banKinh[0] ?? 20) + ((l.banKinh[1] ?? 90) - (l.banKinh[0] ?? 20)) * u) * ve.tiLe;
        hat.them(dx(ax), dy((ay + dinh) / 2), r, r * 0.8, l.mau[0] ?? 1, l.mau[1] ?? 1, l.mau[2] ?? 1, l.doDac * (1 - u), HINH.tron);
      }
      if (bui && p.giaiDoan !== 'loe' && this.bay.length < SO.toiDaBay) {
        this.bay.push({
          x: ax + (Math.random() - 0.5) * k * 0.8, y: ay + (Math.random() - 0.5) * k * 0.25, vx: 0, vy: -ngau(SO.bui.bayLen),
          tuoi: 0, tho: ngau(SO.bui.tuoiGiay), r: ngau(SO.bui.banKinh), mat: false,
        });
      }
    }
    this.veBay(hat, dt, dx, dy, ve.tiLe, dpr);
  }

  /** Mat go bay ra tu cho bua cham tuong, cao `go.cao` o tren mat dat. */
  private phatMat(o: { a: number; b: number }, oPx: number): void {
    const g = SO.go;
    const x = neoX(o.a, o.b, oPx);
    const y = neoY(o.a, o.b, oPx) - g.cao * oPx;
    for (let i = Math.round(ngau(g.soMat)); i > 0 && this.bay.length < SO.toiDaBay; i -= 1) {
      const v = ngau(g.tocDo);
      const goc = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      this.bay.push({ x, y, vx: Math.cos(goc) * v, vy: Math.sin(goc) * v, tuoi: 0, tho: ngau(g.tuoiGiay), r: g.co, mat: true });
    }
  }

  private veBay(hat: Hat, dt: number, dx: (x: number) => number, dy: (y: number) => number, tiLe: number, dpr: number): void {
    const [b, g] = [SO.bui, SO.go];
    for (let i = this.bay.length - 1; i >= 0; i -= 1) {
      const h = this.bay[i] as HatBay;
      h.tuoi += dt;
      if (h.tuoi > h.tho) { this.bay.splice(i, 1); continue; }
      const t = h.tuoi / h.tho;
      if (h.mat) h.vy += g.trongLuc * dt;
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      if (h.mat) {
        const r = Math.max(h.r * tiLe, g.toiThieuCss * dpr);
        hat.them(dx(h.x), dy(h.y), r, r, g.mau[0] ?? 1, g.mau[1] ?? 1, g.mau[2] ?? 1, 1 - t * t, HINH.tron);
      } else {
        const r = h.r * (1 + 0.6 * t) * tiLe;
        hat.them(dx(h.x), dy(h.y), r, r * 0.8, b.mau[0] ?? 1, b.mau[1] ?? 1, b.mau[2] ?? 1, Math.min(1, t / 0.15) * (1 - t) * b.doDac, HINH.tron);
      }
    }
  }

  /**
   * Vat dung truoc trum len hop gian giao qua `cheToiDa` khong. Hat ve sau moi sprite nen que se de
   * len nha, cay dung truoc - bi che thi bo que, giu bui. Tinh mot lan, tinh lai khi ban do co vat moi.
   */
  private biChe(ve: Ve, banDo: BanDo, v: OVat, hop: Hop4): boolean {
    const cu = this.che.get(v);
    if (cu !== undefined) return cu;
    const co = biCheBoi(ve, banDo, v.a + v.b + 2 * (v.o - 1), hop, SO.cheToiDa);
    this.che.set(v, co);
    return co;
  }
}

/**
 * Co vat nao dung truoc truc sau `sauV` trum len hop `hop` (toa do the gioi) tu `nguong` dien tich tro
 * len khong. Dung chung cho que gian giao (tren) va den, lua trai ban dem (`HieuUngDem.ts`).
 *
 * `theoThan`: do vat che bang THAN that - ngang theo o nen (`o` o), doc tu dinh sprite toi mep truoc o nen -
 * thay vi ca khung sprite. Khung nha dan gom ca bong do trong suot ben phai: do theo khung thi ngon lua giua
 * nga tu trong tron van bi tinh la "bi che" (do 05/10). Que gian giao (buoc 1, anh da duyet) giu cach cu.
 */
export function biCheBoi(ve: Ve, banDo: BanDo, sauV: number, hop: Hop4, nguong: number, theoThan = false): boolean {
  const oPx = ve.atlas.oPx();
  const dienTich = (hop.x1 - hop.x0) * (hop.y1 - hop.y0);
  // `banDo.vat` xep theo truc sau tang dan: di tu cuoi ve, gap vat o sau hon thi dung.
  for (let i = banDo.vat.length - 1; i >= 0; i -= 1) {
    const w = banDo.vat[i] as OVat;
    if (w.a + w.b + 2 * (w.o - 1) <= sauV) break;
    const ten = ve.atlas.co(w.ten) ? w.ten : `${w.ten}_k0`;
    if (!ve.atlas.co(ten)) continue;
    const s = ve.atlas.o(ten);
    const [nx, ny] = [neoX(w.a, w.b, oPx), neoY(w.a, w.b, oPx)];
    const [x0, x1] = theoThan ? [nx - (w.o * oPx) / 2, nx + (w.o * oPx) / 2] : [nx - s.ox, nx - s.ox + s.w];
    const [y0, y1] = [ny - s.oy, theoThan ? ny + ((2 * w.o - 1) * oPx) / 4 : ny - s.oy + s.h];
    const rong = Math.min(hop.x1, x1) - Math.max(hop.x0, x0);
    const cao = Math.min(hop.y1, y1) - Math.max(hop.y0, y0);
    if (rong > 0 && cao > 0 && rong * cao >= nguong * dienTich) return true;
  }
  return false;
}
