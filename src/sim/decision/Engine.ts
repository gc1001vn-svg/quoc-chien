/**
 * Dong co the quyet dinh (GAME_SPEC muc 7): quet dieu kien moi gio game, chon the diem
 * cao nhat chua hoi gan day.
 *
 * TypeScript thuan (luat 1): nhan `ThongKe` da chot san, khong doc file, khong dung DOM.
 * Nho vay `npm run sim:thu` chay het 10 gio va tra loi thay nguoi choi duoc.
 * Moi con so nhip do nam trong `data/balance.json`, van the trong `data/decisions.json`.
 */
import type { SoHang, ThongKe } from '../city/Cham.ts';
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

/** Phep so sanh cua mot dieu kien. */
export type Phep = '>=' | '<=' | '>' | '<';

/** Con so mot dieu kien nhin vao. Sau mon dau doc theo `hang`. */
export type DoGi =
  | 'ton' | 'cho' | 'day' | 'hong' | 'lamRa' | 'dungHet'
  | 'dinh' | 'boCuoc' | 'chuyen' | 'soNha' | 'soKho';

const CAN_HANG: readonly DoGi[] = ['ton', 'cho', 'day', 'hong', 'lamRa', 'dungHet'];
const MOI_DO: readonly DoGi[] = [
  ...CAN_HANG, 'dinh', 'boCuoc', 'chuyen', 'soNha', 'soKho',
];
const MOI_PHEP: readonly string[] = ['>=', '<=', '>', '<'];

/** Mot dieu kien kich hoat. */
export interface DieuKien {
  readonly do: DoGi;
  /** Bat buoc khi `do` doc theo mat hang. */
  readonly hang?: string;
  readonly phep: Phep;
  readonly gia: number;
}

/** Hau qua cua mot lua chon. Cach ap nam trong `HauQua.ts`. */
export interface HauQua {
  readonly xay?: readonly { readonly ten: string; readonly so: number }[];
  readonly xayKho?: boolean;
  /** Ten nguong cua thong doc -> so cong them. Am la de tay hon, duong la chat tay hon. */
  readonly doiNguong?: Readonly<Record<string, number>>;
  readonly noiTran?: { readonly nha?: number; readonly kho?: number };
}

/** Mot lua chon tren the. */
export interface LuaChon {
  readonly van: string;
  /** Mat duoc va mat mat - moi lua chon phai co danh doi that (GAME_SPEC muc 7). */
  readonly loi: string;
  readonly hauQua: HauQua;
}

/** Mot the quyet dinh. */
export interface The {
  readonly ten: string;
  readonly diem: number;
  /** The khan duoc pha luat gian cach. */
  readonly khan: boolean;
  readonly van: string;
  readonly dieuKien: readonly DieuKien[];
  readonly chon: readonly LuaChon[];
}

/** Luat nhip do, doc tu `data/balance.json`. */
export interface NhipDo {
  readonly gioQuet: number;
  readonly gioGianCach: number;
  readonly gioLapLai: number;
  readonly toiDaMotVan: number;
}

/** So cua thanh pho ma `ThongKe` khong mang: dieu kien `soNha` va `soKho` can. */
export interface SoThanhPho {
  readonly soNha: number;
  readonly soKho: number;
}

/** Doc `data/balance.json`. */
export function docNhipDo(tho: unknown): NhipDo {
  const o = layObject(tho, 'balance.json');
  return {
    gioQuet: laySoNguyen(o['gioQuet'], 'balance.json > gioQuet'),
    gioGianCach: laySoNguyen(o['gioGianCach'], 'balance.json > gioGianCach', 0),
    gioLapLai: laySoNguyen(o['gioLapLai'], 'balance.json > gioLapLai', 0),
    toiDaMotVan: laySoNguyen(o['toiDaMotVan'], 'balance.json > toiDaMotVan'),
  };
}

function docHauQua(tho: unknown, duong: string): HauQua {
  const o = layObject(tho, duong);
  const ra: {
    xay?: { ten: string; so: number }[];
    xayKho?: boolean;
    doiNguong?: Record<string, number>;
    noiTran?: { nha?: number; kho?: number };
  } = {};

  if (o['xay'] !== undefined) {
    ra.xay = layMang(o['xay'], `${duong}.xay`).map((m, i) => {
      const n = layObject(m, `${duong}.xay[${String(i)}]`);
      return {
        ten: layChuoi(n['ten'], `${duong}.xay[${String(i)}].ten`),
        so: laySoNguyen(n['so'], `${duong}.xay[${String(i)}].so`),
      };
    });
  }
  if (o['xayKho'] === true) ra.xayKho = true;
  if (o['doiNguong'] !== undefined) {
    const g = layObject(o['doiNguong'], `${duong}.doiNguong`);
    const bang: Record<string, number> = {};
    for (const [ten, gia] of Object.entries(g)) {
      if (typeof gia !== 'number' || !Number.isInteger(gia)) {
        throw new LoiDuLieu(`${duong}.doiNguong.${ten}`, 'phai la so nguyen');
      }
      bang[ten] = gia;
    }
    ra.doiNguong = bang;
  }
  if (o['noiTran'] !== undefined) {
    const g = layObject(o['noiTran'], `${duong}.noiTran`);
    ra.noiTran = {
      ...(g['nha'] === undefined ? {} : { nha: laySoNguyen(g['nha'], `${duong}.noiTran.nha`) }),
      ...(g['kho'] === undefined ? {} : { kho: laySoNguyen(g['kho'], `${duong}.noiTran.kho`) }),
    };
  }
  if (Object.keys(ra).length === 0) throw new LoiDuLieu(duong, 'lua chon khong lam gi ca');
  return ra;
}

function docDieuKien(tho: unknown, duong: string): DieuKien {
  const o = layObject(tho, duong);
  const doGi = layChuoi(o['do'], `${duong}.do`) as DoGi;
  if (!MOI_DO.includes(doGi)) {
    throw new LoiDuLieu(`${duong}.do`, `khong biet do gi: "${doGi}"`);
  }
  const phep = layChuoi(o['phep'], `${duong}.phep`) as Phep;
  if (!MOI_PHEP.includes(phep)) throw new LoiDuLieu(`${duong}.phep`, `khong biet phep "${phep}"`);
  const canHang: boolean = CAN_HANG.includes(doGi);
  const hang: string | undefined = o['hang'] === undefined
    ? undefined
    : layChuoi(o['hang'], `${duong}.hang`);
  if (canHang && hang === undefined) throw new LoiDuLieu(duong, `"${doGi}" phai kem "hang"`);
  const gia = laySoNguyen(o['gia'], `${duong}.gia`, 0);
  return { do: doGi, phep, gia, ...(hang === undefined ? {} : { hang }) };
}

/** Doc `data/decisions.json`. Nem `LoiDuLieu` neu sai. */
export function docThe(tho: unknown): The[] {
  const goc = layObject(tho, 'decisions.json');
  const mang = layMang(goc['the'], 'decisions.json > the');
  if (mang.length === 0) throw new LoiDuLieu('decisions.json > the', 'khong duoc rong');

  const ra: The[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `decisions.json > the[${String(i)}]`;
    const o = layObject(muc, duong);
    const ten = layChuoi(o['ten'], `${duong}.ten`);
    if (daCo.has(ten)) throw new LoiDuLieu(`${duong}.ten`, `trung ten "${ten}"`);
    daCo.add(ten);

    const dieuKien = layMang(o['dieuKien'], `${duong}.dieuKien`)
      .map((d, k) => docDieuKien(d, `${duong}.dieuKien[${String(k)}]`));
    if (dieuKien.length === 0) {
      throw new LoiDuLieu(`${duong}.dieuKien`, 'the khong co dieu kien thi hoi mai mai');
    }

    const chon = layMang(o['chon'], `${duong}.chon`).map((c, k) => {
      const duongC = `${duong}.chon[${String(k)}]`;
      const oc = layObject(c, duongC);
      return {
        van: layChuoi(oc['van'], `${duongC}.van`),
        loi: layChuoi(oc['loi'], `${duongC}.loi`),
        hauQua: docHauQua(oc['hauQua'], `${duongC}.hauQua`),
      };
    });
    // 2-4 lua chon: mot lua chon khong phai quyet dinh, nam lua chon thi khong ai doc het
    // tren man hinh dien thoai (GAME_SPEC muc 7).
    if (chon.length < 2 || chon.length > 4) {
      throw new LoiDuLieu(`${duong}.chon`, `phai co 2-4 lua chon, dang co ${String(chon.length)}`);
    }

    ra.push({
      ten,
      diem: laySoNguyen(o['diem'], `${duong}.diem`, 0),
      khan: o['khan'] === true,
      van: layChuoi(o['van'], `${duong}.van`),
      dieuKien,
      chon,
    });
  }
  return ra;
}

/** Con so ma mot dieu kien nhin vao. `undefined` khi khong co mat hang do. */
function doSo(dk: DieuKien, tk: ThongKe, tp: SoThanhPho): number | undefined {
  if (dk.do === 'dinh') return tk.walker.dinh;
  if (dk.do === 'boCuoc') return tk.walker.boCuoc;
  if (dk.do === 'chuyen') return tk.walker.chuyen;
  if (dk.do === 'soNha') return tp.soNha;
  if (dk.do === 'soKho') return tp.soKho;
  const h: SoHang | undefined = tk.hang.find((m) => m.ten === dk.hang);
  return h === undefined ? undefined : h[dk.do];
}

function dung(dk: DieuKien, tk: ThongKe, tp: SoThanhPho): boolean {
  const so: number | undefined = doSo(dk, tk, tp);
  if (so === undefined) return false;
  if (dk.phep === '>=') return so >= dk.gia;
  if (dk.phep === '<=') return so <= dk.gia;
  if (dk.phep === '>') return so > dk.gia;
  return so < dk.gia;
}

/**
 * Quet the moi gio game. Nguoi goi hoi moi khi chot xong mot gio; co the thi dung sim
 * lai va hien len.
 */
export class DongCo {
  private readonly ds: readonly The[];
  private readonly nd: NhipDo;
  /** Gio hoi the gan nhat. `-Infinity` de the dau tien khong phai cho gian cach. */
  private gioCuoi = Number.NEGATIVE_INFINITY;
  private readonly gioTungThe = new Map<string, number>();
  private daHoi = 0;

  constructor(ds: readonly The[], nd: NhipDo) {
    this.ds = ds;
    this.nd = nd;
  }

  /** Da hoi bao nhieu the tu dau van. */
  get so(): number {
    return this.daHoi;
  }

  /** The nen hoi ngay bay gio, hay `undefined` neu chua toi luc. */
  hoi(tk: ThongKe, tp: SoThanhPho): The | undefined {
    if (this.daHoi >= this.nd.toiDaMotVan) return undefined;
    if (tk.gio % this.nd.gioQuet !== 0) return undefined;

    let tot: The | undefined;
    for (const t of this.ds) {
      // The khan pha duoc luat gian cach, nhung khong pha luat khong hoi lai.
      if (!t.khan && tk.gio - this.gioCuoi < this.nd.gioGianCach) continue;
      const lanTruoc: number | undefined = this.gioTungThe.get(t.ten);
      if (lanTruoc !== undefined && tk.gio - lanTruoc < this.nd.gioLapLai) continue;
      if (!t.dieuKien.every((dk) => dung(dk, tk, tp))) continue;
      if (tot === undefined || t.diem > tot.diem) tot = t;
    }
    if (tot === undefined) return undefined;

    this.gioCuoi = tk.gio;
    this.gioTungThe.set(tot.ten, tk.gio);
    this.daHoi += 1;
    return tot;
  }
}
