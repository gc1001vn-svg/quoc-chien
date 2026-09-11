/**
 * Dung ban do chien dich tu `data/provinces.json` + `data/nations.json`.
 *
 * Ban do nay TINH: o nao thuoc tinh nao, dia hinh gi, sprite nen va vat trang tri nao.
 * Thu thay doi theo thoi gian (dat lenh xay, dem luot) nam o `ChienDich.ts`.
 *
 * Cung mot hat giong thi ra dung mot ban do - TECH_SPEC muc 8 bat buoc.
 */
import { Rng } from '../../core/Rng.ts';
import { cumBay, khoa, tamCum, type OHex } from './Hex.ts';

/** Mot nuoc trong `data/nations.json`. */
export interface Nuoc {
  readonly id: string;
  readonly hien: string;
  readonly mau: string;
  readonly nguoi_choi: boolean;
  readonly dac_tinh: readonly string[];
}

/** Mot tinh trong `data/provinces.json`, dang tho. */
export interface TinhTho {
  readonly id: string;
  readonly hien: string;
  readonly m: number;
  readonly n: number;
  readonly nuoc: string;
  readonly dia_hinh: string;
  readonly o_xay: number;
  readonly thu_do?: boolean;
}

/** Khuon `data/provinces.json`. */
export interface CauHinhBanDoTinh {
  readonly nen_theo_dia_hinh: Readonly<Record<string, readonly string[]>>;
  /** Ten dia hinh de HIEN ra man, co dau. Thieu thi hien thang khoa. */
  readonly ten_dia_hinh: Readonly<Record<string, string>>;
  readonly vat_theo_dia_hinh: Readonly<Record<string, readonly string[]>>;
  readonly vat_thua: number;
  readonly hat_giong: number;
  /** Mot luot chien dich keo dai bao nhieu giay that. */
  readonly giay_moi_luot: number;
  readonly zoomMin: number;
  readonly zoomMax: number;
  readonly zoomDau: number;
  readonly tinh: readonly TinhTho[];
}

/** Khuon `data/nations.json`. */
export interface CauHinhNuoc {
  readonly nuoc: readonly Nuoc[];
}

/** Mot o hex trong mot tinh. */
export interface OTinh {
  readonly hex: OHex;
  /** Ten sprite nen. */
  readonly nen: string;
  /** Vat dia hinh dat len nen; chuoi rong la khong co. O xay dung luon de trong. */
  readonly vat: string;
  /**
   * Chi so o xay dung, tu 0. `-1` nghia la khong phai o xay: o thu phu o giua, hoac o
   * vanh nam ngoai `o_xay` cua tinh.
   */
  readonly oXay: number;
}

/** Mot tinh da dung xong. */
export interface Tinh {
  readonly id: string;
  readonly hien: string;
  /** Khoa nuoc, chuoi rong la tinh trung lap. */
  readonly nuoc: string;
  /** Mau phe de chon sprite; chuoi rong voi tinh trung lap. */
  readonly mau: string;
  readonly thuDo: boolean;
  readonly diaHinh: string;
  /** Ten dia hinh de hien ra man, vi du "đồng bằng". */
  readonly hienDiaHinh: string;
  readonly tam: OHex;
  /** Bay o: phan tu 0 la thu phu, 1-6 la vanh theo dung thu tu `HUONG`. */
  readonly o: readonly OTinh[];
  /** So o xay dung cua tinh, 4-6. */
  readonly soOXay: number;
}

/** Ban do chien dich da dung xong. */
export interface BanDoTinh {
  readonly nuoc: readonly Nuoc[];
  readonly tinh: readonly Tinh[];
  /** Tra tinh theo khoa hex - dung khi nguoi choi cham vao mot o. */
  readonly theoHex: ReadonlyMap<string, string>;
}

/** Doc `data/nations.json` va kiem so luong. */
export function docNuoc(tho: CauHinhNuoc): readonly Nuoc[] {
  if (tho.nuoc.length < 2) throw new Error('nations.json phai co it nhat hai nuoc');
  return tho.nuoc;
}

/**
 * Dung ban do tu hai file cau hinh.
 *
 * Moi tinh lay 7 hex quanh tam cum cua no. Vi luoi con co dinh thuc 7, hai tinh khac
 * nhau khong bao gio dung chung mot hex - ham nay van kiem lai va bao loi neu trung,
 * de mot lan sua `provinces.json` sai khong lot ra den man hinh.
 */
export function dungBanDoTinh(tho: CauHinhBanDoTinh, thoNuoc: CauHinhNuoc): BanDoTinh {
  const nuoc: readonly Nuoc[] = docNuoc(thoNuoc);
  const mauTheoNuoc = new Map<string, string>(nuoc.map((n: Nuoc): [string, string] => [n.id, n.mau]));
  const rng: Rng = new Rng(tho.hat_giong);
  const theoHex = new Map<string, string>();
  const tinh: Tinh[] = [];

  for (const t of tho.tinh) {
    if (t.o_xay < 4 || t.o_xay > 6) {
      throw new Error(`Tinh ${t.id}: o_xay = ${String(t.o_xay)}, phai trong khoang 4-6`);
    }
    const mau: string = t.nuoc === '' ? '' : (mauTheoNuoc.get(t.nuoc) ?? '');
    if (t.nuoc !== '' && mau === '') throw new Error(`Tinh ${t.id}: khong co nuoc "${t.nuoc}"`);

    const hex: readonly OHex[] = cumBay(tamCum(t.m, t.n));
    const o: OTinh[] = hex.map((h: OHex, i: number): OTinh => {
      const k: string = khoa(h);
      const cu: string | undefined = theoHex.get(k);
      if (cu !== undefined) throw new Error(`Hex ${k} thuoc ca tinh ${cu} lan ${t.id}`);
      theoHex.set(k, t.id);
      // Chi so o xay: o giua (i = 0) la thu phu, vanh lay `o_xay` o dau tien.
      const oXay: number = i >= 1 && i <= t.o_xay ? i - 1 : -1;
      return { hex: h, nen: nen(tho, t.dia_hinh, rng), vat: vat(tho, t.dia_hinh, oXay, i, rng), oXay };
    });

    tinh.push({
      id: t.id,
      hien: t.hien,
      nuoc: t.nuoc,
      mau,
      thuDo: t.thu_do === true,
      diaHinh: t.dia_hinh,
      hienDiaHinh: tho.ten_dia_hinh[t.dia_hinh] ?? t.dia_hinh,
      tam: hex[0] as OHex,
      o,
      soOXay: t.o_xay,
    });
  }

  return { nuoc, tinh, theoHex };
}

/** Sprite nen cua mot o, boc theo dia hinh. */
function nen(tho: CauHinhBanDoTinh, diaHinh: string, rng: Rng): string {
  const ds: readonly string[] = tho.nen_theo_dia_hinh[diaHinh] ?? [];
  if (ds.length === 0) throw new Error(`Khong co sprite nen cho dia hinh "${diaHinh}"`);
  return ds[rng.nguyen(ds.length)] as string;
}

/**
 * Vat dia hinh dat len mot o.
 *
 * O xay dung va o thu phu luon de trong: cho de cong trinh. O con lai boc theo
 * `vat_thua` - de 1 thi kin mit, nhin roi mat.
 */
function vat(tho: CauHinhBanDoTinh, diaHinh: string, oXay: number, i: number, rng: Rng): string {
  const ds: readonly string[] = tho.vat_theo_dia_hinh[diaHinh] ?? [];
  // Van phai rut so de day so khong lech giua o co vat va o khong - cung hat giong thi
  // cung ban do, ke ca khi doi `o_xay` cua mot tinh khac.
  const boc: number = rng.so();
  const thu: number = ds.length === 0 ? 0 : rng.nguyen(ds.length);
  if (oXay >= 0 || i === 0 || ds.length === 0) return '';
  return boc < tho.vat_thua ? (ds[thu] as string) : '';
}
