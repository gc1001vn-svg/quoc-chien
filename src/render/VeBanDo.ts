/**
 * Ve lop chien dich: 252 hex, vat dia hinh, cong trinh tinh va co hieu.
 *
 * Khac lop thanh pho o mot cho: luoi la LUC GIAC nen khong quet duoc theo duong cheo
 * `a + b`. Moi khung gom het muc ve vao mot mang roi xep theo truc sau `x + z` - 252 hex
 * cho khoang 500-800 muc, xep lai moi khung khong dang ke so voi vai tram walker cua
 * `VeCanh.ts` da xep san.
 */
import soTho from '../../data/tung_buoc.json';
import { hexX, hexY, truocSau } from './HexIso';
import { docCoTat } from './HieuUngThanhPho';
import { catTren } from './TungBuoc';
import type { Ve } from './VeCanh';
import type { BanDoTinh, OTinh, Tinh } from '../sim/campaign/BanDoTinh';
import type { ChienDich, CongTrinh } from '../sim/campaign/ChienDich';

/** Mot muc cho ve trong khung nay. */
interface Muc {
  readonly sau: number;
  readonly x: number;
  readonly y: number;
  readonly ten: string;
  /** Phan nha da moc (Buoc 5); khong co la ve tron. */
  readonly hien?: number;
  /** Do chop sang luc vua xay xong. */
  readonly sang?: number;
}

/** Co hieu dat lech sang phai bao nhieu phan mot o nen, de khong lut vao mai thanh. */
const CO_LECH_X = 0.75;

/** Phan cong trinh tinh da moc: `luot` luot, con `conLai`, luot dang chay da qua `phanLuot` (0..1). */
export function phanDaXay(luot: number, conLai: number, phanLuot: number): number {
  return Math.min(1, Math.max(0, (luot - conLai + phanLuot) / luot));
}

/** Do chop sang `giay` giay that sau khi xay xong: tu `sangLoe` giam dan ve 0 trong `loeGiay`. */
export function sangXong(giay: number): number {
  const loe: number = soTho.xayTinh.loeGiay;
  return giay < 0 || giay >= loe ? 0 : soTho.sangLoe * (1 - giay / loe);
}

let tat: boolean | undefined;
const tatXay = (): boolean => (tat ??= docCoTat(new URLSearchParams(window.location.search).get('tat')).has('xayTinh'));
/** O dang xay o khung truoc, va luc (ms) thay no xay xong - de loe sang. Chi lop ve giu, sim khong biet. */
const dangXayTruoc = new Set<string>();
const xongLuc = new Map<string, number>();

/**
 * Ve ca ban do.
 *
 * @param oChon O dang duoc soi (`<tinhId>#<oXay>`), chuoi rong la khong soi gi. O duoc soi
 *              ve them mot manh dat trong ben duoi cho de nhin ra.
 */
export function veBanDoTinh(ve: Ve, banDo: BanDoTinh, cd: ChienDich, oChon: string, phanLuot: number): void {
  const oPx: number = ve.atlas.oPx();
  const bayGio: number = performance.now();
  const muc: Muc[] = [];

  for (const t of banDo.tinh) {
    for (let i = 0; i < t.o.length; i += 1) {
      const o: OTinh = t.o[i] as OTinh;
      const x: number = hexX(o.hex, oPx);
      const y: number = hexY(o.hex, oPx);
      const sau: number = truocSau(o.hex);
      muc.push({ sau, x, y, ten: o.nen });
      if (o.vat !== '') muc.push({ sau: sau + 0.01, x, y, ten: o.vat });

      const tren: string = tenTren(t, o, i, cd, oChon);
      // O dang chon sang len thay cho gian giao (anh chon 12/10); `?tat=xayTinh` giu gian giao nhu cu.
      const chon: number = !tatXay() && o.oXay >= 0 && oChon === `${t.id}#${String(o.oXay)}` ? soTho.xayTinh.sangChon : 0;
      if (tren !== '') muc.push({ sau: sau + 0.02, x, y, ten: tren, sang: Math.max(sangO(t, o, cd, bayGio), chon) });
      const moc = tatXay() ? undefined : nhaDangMoc(t, o, cd, phanLuot);
      if (moc !== undefined) muc.push({ sau: sau + 0.025, x, y, ...moc });
      if (i === 0 && cd.mau(t.id) !== '') {
        muc.push({ sau: sau + 0.03, x: x + oPx * CO_LECH_X, y, ten: `co_${cd.mau(t.id)}` });
      }
    }
  }

  muc.sort((a: Muc, b: Muc): number => a.sau - b.sau);
  for (const m of muc) datSprite(ve, m.x, m.y, m.ten, m.hien, m.sang);
}

/** Nha dang moc tren manh dat cua o dang xay (Buoc 5): sprite nha mau phe, cat theo phan da xay. */
function nhaDangMoc(t: Tinh, o: OTinh, cd: ChienDich, phanLuot: number): { ten: string; hien: number } | undefined {
  if (o.oXay < 0 || cd.mau(t.id) === '') return undefined;
  const tt = cd.oCua(t.id, o.oXay);
  const c: CongTrinh | undefined = cd.xayDuocGi(t.id).find((x) => x.id === tt.dangXay);
  return c === undefined ? undefined : { ten: `${c.sprite}_${cd.mau(t.id)}`, hien: phanDaXay(c.luot, tt.conLai, phanLuot) };
}

/** Do loe cua o xay: thay o vua het `dangXay` ma co `congTrinh` thi ghi luc xong, sang giam dan theo giay that. */
function sangO(t: Tinh, o: OTinh, cd: ChienDich, bayGio: number): number {
  if (o.oXay < 0 || tatXay()) return 0;
  const k = `${t.id}#${String(o.oXay)}`;
  const tt = cd.oCua(t.id, o.oXay);
  if (tt.dangXay !== '') {
    dangXayTruoc.add(k);
    return 0;
  }
  if (dangXayTruoc.delete(k) && tt.congTrinh !== '') xongLuc.set(k, bayGio);
  const luc: number | undefined = xongLuc.get(k);
  if (luc === undefined) return 0;
  const sang: number = sangXong((bayGio - luc) / 1000);
  if (sang === 0) xongLuc.delete(k);
  return sang;
}

/**
 * Sprite dat TREN mot o hex, ngoai lop nen va vat dia hinh.
 *
 * O thu phu (i = 0): thu do la toa thanh, tinh thuong la nha lon, tinh trung lap la ruong.
 * O xay dung: trong hay dang xay thi la manh dat (Buoc 5; `?tat=xayTinh` la gian giao), xay xong la cong trinh mang
 * mau phe. Tinh trung lap chua co phe nen o xay cua no luon la manh dat - goi KayKit
 * khong co nha mau trung lap, chi co tuong, cau, gian giao va ruong.
 */
function tenTren(t: Tinh, o: OTinh, i: number, cd: ChienDich, oChon: string): string {
  const mau: string = cd.mau(t.id);
  if (i === 0) {
    if (mau === '') return 'ruong';
    return t.thuDo ? `thanh_${mau}` : `nha_${mau}`;
  }
  if (o.oXay < 0) return '';

  const tt = cd.oCua(t.id, o.oXay);
  // Dang xay chi con manh dat, nha moc tren do (`nhaDangMoc`) - gian giao KayKit nhin nhu nha la (anh bao 12/10).
  if (tt.dangXay !== '') return tatXay() ? 'gian_giao' : 'dat_trong';
  if (tt.congTrinh !== '') {
    const c: CongTrinh | undefined = cd.xayDuocGi(t.id).find((x) => x.id === tt.congTrinh);
    if (c === undefined || mau === '') return 'dat_trong';
    return `${c.sprite}_${mau}`;
  }
  // O trong: chi ve manh dat o tinh CUA MINH. Ve het 185 o xay cua ca ban do thi ca vung
  // thanh mot mang nau, khong con nhin ra dau la dat minh xay duoc - da chup thu 11/09.
  if (cd.chu(t.id) !== cd.nuocCuaTa()) return '';
  return oChon === `${t.id}#${String(o.oXay)}` && tatXay() ? 'gian_giao' : 'dat_trong';
}

/** Xep mot sprite vao lo, neo tai toa do the gioi `(x, y)`. Ngoai man thi bo qua. */
export function datSprite(ve: Ve, x: number, y: number, ten: string, hien?: number, sang = 0): void {
  if (!ve.atlas.co(ten)) return;
  const s = ve.atlas.o(ten);
  const x0: number = (x - s.ox - ve.camX) * ve.tiLe + ve.rongDev / 2;
  const y0: number = (y - s.oy - ve.camY) * ve.tiLe + ve.caoDev / 2;
  const rong: number = s.w * ve.tiLe;
  const cao: number = s.h * ve.tiLe;
  if (x0 + rong < 0 || x0 > ve.rongDev || y0 + cao < 0 || y0 > ve.caoDev) return;
  const [u0, v0, u1, v1] = ve.atlas.uv(s);
  // Nha tinh dang xay (Buoc 5): cat phan chua moc nhu nha thanh pho buoc 1; sang < 0,5 cong vao trang (Shader.ts).
  const [yc, vc] = hien === undefined
    ? [y0, v0] : catTren(hien, y0, y0 + cao, y0 + s.oy * ve.tiLe, v0, v1); // moc tu chan nha (diem neo): o luc giac to, giuDay giu gan het nha
  ve.gl.them(s.trang + sang, x0, yc, rong, y0 + cao - yc, u0, vc, u1, v1);
  ve.dem += 1;
}
