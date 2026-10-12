/**
 * Khai thac can dan (Buoc 4, 12/10): quanh trai go, mo co bai cay/da thua dan khi nha lam viec,
 * het thi bai trong roi moc lai. Ke hoach `docs/ke-hoach/2026-10-12-buoc-4-khai-thac-can-dan.md`,
 * moi so o `data/tung_buoc.json` muc `khaiThac`.
 *
 * CHI DOI HINH - sim chi dem `ThuNha.nhipDaLam()`, `sim:van` ra y nhu truoc. Tinh theo nhip nha THAT SU
 * lam: kho day, thieu hang thi bai dung; dung hinh thi dung, tua thi chat nhanh, cung nhip cung hinh.
 * Vat cua bai khong nam trong `banDo.vat` (sim khong biet chung) - `vatVe` xep chung hai danh sach theo
 * truc sau. `?tat=khaiThac` tat; `?khaiThacTien=<0..1>` ghim moi bai vao cung mot phan vong - chi de chup anh.
 */
import soTho from '../../data/tung_buoc.json';
import { bam } from './HieuUngBatOn';
import { docCoTat } from './HieuUngThanhPho';
import { phanXay } from './HieuUngXay';
import { spriteVat } from './LuaLon';
import type { TienDo } from './TungBuoc';
import type { Ve } from './VeCanh';
import { laDuong, type BanDo, type O, type OVat } from '../sim/city/BanDo';
import type { ThuNha } from '../sim/city/Buildings';
import type { ThanhPho } from '../sim/city/City';

export const SO_KHAI_THAC = soTho.khaiThac;
type So = typeof SO_KHAI_THAC;

/** Phan vong (0..1) cua bai quanh nha o `(a,b)` da lam `nhipLam` nhip. Moi nha lech pha theo bam o. */
export function phanVong(nhipLam: number, a: number, b: number, so: So = SO_KHAI_THAC): number {
  const p = nhipLam / so.chuKyNhip + bam(a * 4099 + b);
  return p - Math.floor(p);
}

/** Vat thu `thu` (thu tu chat) cua bai `soVat` vat o phan vong `t`: con nguyen, dang chat, da mat, hay phan da moc lai. */
export function changVat(t: number, thu: number, soVat: number, so: So = SO_KHAI_THAC): 'hinh' | 'chang' | 'mat' | number {
  if (t >= so.trongDen) return (t - so.trongDen) / (1 - so.trongDen);
  if (t >= so.chatDen) return 'mat';
  const dangChat = Math.floor((t / so.chatDen) * soVat);
  return thu < dangChat ? 'mat' : thu === dangChat ? 'chang' : 'hinh';
}

/** O dat vat quanh nha `(a,b)`: phia sau hoac ngang nha (khong che nha), khong duong, khong ai chiem, chua bai nao lay. */
export function oBai(banDo: BanDo, a: number, b: number, daLay: Set<number>, so: So = SO_KHAI_THAC): O[] {
  const ds: O[] = [];
  for (let da = -so.banKinh; da <= so.banKinh; da += 1) {
    for (let db = -so.banKinh; db <= -da; db += 1) {
      const o = { a: a + da, b: b + db };
      const k = o.a * banDo.canh + o.b;
      if ((da === 0 && db === 0) || o.a < 1 || o.b < 1 || o.a > banDo.canh - 2 || o.b > banDo.canh - 2) continue;
      if (!laDuong(o, banDo.duongCach) && !banDo.daChiem.has(k) && !daLay.has(k)) ds.push(o);
    }
  }
  const lay = ds.sort((m, n) => bam(m.a * 4099 + m.b) - bam(n.a * 4099 + n.b)).slice(0, so.toiDa);
  for (const o of lay) daLay.add(o.a * banDo.canh + o.b);
  return lay;
}

interface VatBai { readonly nha: ThuNha; readonly thu: number; readonly soVat: number; readonly chang: string }
const bai = new Map<OVat, VatBai>();
let xep: { dai: number; tp: ThanhPho; ds: readonly OVat[] } | undefined;

interface ThamSoUrl { readonly tat: boolean; readonly tien: number | undefined }
let url: ThamSoUrl | undefined;
const docUrl = (): ThamSoUrl => {
  if (url === undefined) {
    const q = new URLSearchParams(window.location.search);
    const so = Number(q.get('khaiThacTien') ?? Number.NaN);
    url = { tat: docCoTat(q.get('tat')).has('khaiThac'), tien: Number.isFinite(so) ? so : undefined };
  }
  return url;
};

/** Vat can ve, xep theo truc sau: `banDo.vat` cong vat cac bai. Xep lai khi ban do them vat (thong doc vua xay). */
export function vatVe(banDo: BanDo, tp: ThanhPho | undefined): readonly OVat[] {
  if (tp === undefined || docUrl().tat) return banDo.vat;
  if (xep?.dai !== banDo.vat.length || xep.tp !== tp) {
    bai.clear();
    const daLay = new Set<number>();
    for (const n of tp.dsNhaThat()) {
      const loai = SO_KHAI_THAC.bai.find((l) => l.nha.includes(n.def.sprite));
      if (loai === undefined) continue;
      const ds = oBai(banDo, n.oNha.a, n.oNha.b, daLay);
      ds.forEach((o, thu) => {
        const ten = loai.hinh[Math.floor(bam(o.a * 131 + o.b) * loai.hinh.length)] ?? loai.chang;
        bai.set({ a: o.a, b: o.b, ten, o: 1 }, { nha: n, thu, soVat: ds.length, chang: loai.chang });
      });
    }
    // Cung khoa truc sau voi `BanDo.chenVat`; sort on dinh nen thu tu cu cua `banDo.vat` giu nguyen.
    const sau = (v: OVat): number => v.a + v.b + 2 * v.o;
    xep = { dai: banDo.vat.length, tp, ds: [...banDo.vat, ...bai.keys()].sort((m, n) => sau(m) - sau(n)) };
  }
  return xep.ds;
}

function chang(k: VatBai): ReturnType<typeof changVat> {
  return changVat(docUrl().tien ?? phanVong(k.nha.nhipDaLam(), k.nha.oNha.a, k.nha.oNha.b), k.thu, k.soVat);
}

/** Ten sprite cua vat `v` khung nay: vat bai dang chat thi ve hinh chang, vat khac nhu cu (ruong lon dan). */
export function spriteVe(ve: Ve, v: OVat, tp: ThanhPho | undefined): string {
  const k = bai.get(v);
  return k !== undefined && chang(k) === 'chang' ? k.chang : spriteVat(ve, v, tp);
}

const MAT: TienDo = { giaiDoan: 'mong', t: 0, hien: 0, sang: 0 };

/** Cat sprite cua vat `v`: vat bai da chat thi khong ve, dang moc lai thi moc tu duoi len; nha thi theo Buoc 1. */
export function xayVe(ve: Ve, v: OVat): TienDo | undefined {
  const k = bai.get(v);
  if (k === undefined) return phanXay(ve, v);
  const c = chang(k);
  if (c === 'mat') return MAT;
  return typeof c === 'number' ? { giaiDoan: 'moc', t: c, hien: c, sang: 0 } : undefined;
}
