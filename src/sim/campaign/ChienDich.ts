/**
 * Lop chien dich: dat lenh xay tren o xay dung cua tinh, dem luot, xay xong thi dung nha.
 *
 * Phase 7 co y giu lop nay TACH HAN khoi kinh te thanh pho: mot luot o day khong phai
 * mot nhip 10 Hz cua `sim/city/`, va cong trinh tinh chua do hang vao kho thanh pho.
 * Noi hai lop lai la viec cua Phase 9 tro di - noi som thi vo can bang da can o Phase 3-6.
 */
import type { BanDoTinh, Tinh } from './BanDoTinh.ts';

/** Mot loai cong trinh tinh trong `data/prov_buildings.json`. */
export interface CongTrinh {
  readonly id: string;
  readonly hien: string;
  readonly sprite: string;
  readonly luot: number;
  /** Dia hinh xay duoc; day rong nghia la xay duoc o moi dia hinh. */
  readonly dia_hinh: readonly string[];
  readonly mo_ta: string;
}

/** Khuon `data/prov_buildings.json`. */
export interface CauHinhCongTrinh {
  readonly cong_trinh: readonly CongTrinh[];
}

/** Trang thai mot o xay dung. */
export interface TrangThaiO {
  /** Khoa cong trinh da xay xong; chuoi rong la o con trong. */
  readonly congTrinh: string;
  /** Khoa cong trinh dang xay; chuoi rong la khong xay gi. */
  readonly dangXay: string;
  /** So luot con lai cua viec dang xay. */
  readonly conLai: number;
}

const O_TRONG: TrangThaiO = { congTrinh: '', dangXay: '', conLai: 0 };

/** Vi sao mot lenh xay bi tu choi. Chuoi rong nghia la nhan lenh. */
export type LyDoTuChoi = '' | 'khong-phai-cua-ta' | 'o-da-co-chu' | 'sai-dia-hinh' | 'khong-co-o';

/** Doc danh sach cong trinh va kiem so luot. */
export function docCongTrinh(tho: CauHinhCongTrinh): readonly CongTrinh[] {
  for (const c of tho.cong_trinh) {
    if (c.luot < 1) throw new Error(`Cong trinh ${c.id}: luot = ${String(c.luot)}, phai tu 1 tro len`);
  }
  return tho.cong_trinh;
}

/** Trang thai chay cua lop chien dich. */
export class ChienDich {
  private readonly banDo: BanDoTinh;
  private readonly congTrinh: readonly CongTrinh[];
  private readonly theoId: ReadonlyMap<string, Tinh>;
  /** Khoa `<tinhId>#<oXay>` -> trang thai. O khong co trong bang la o trong. */
  private readonly o = new Map<string, TrangThaiO>();
  private soLuot = 0;

  constructor(banDo: BanDoTinh, congTrinh: readonly CongTrinh[]) {
    this.banDo = banDo;
    this.congTrinh = congTrinh;
    this.theoId = new Map<string, Tinh>(banDo.tinh.map((t: Tinh): [string, Tinh] => [t.id, t]));
  }

  /** So luot da chay. */
  public luot(): number {
    return this.soLuot;
  }

  /** Khoa nuoc cua nguoi choi; chuoi rong neu `nations.json` khong danh dau nuoc nao. */
  public nuocCuaTa(): string {
    return this.banDo.nuoc.find((n) => n.nguoi_choi)?.id ?? '';
  }

  /** Ten mot nuoc de hien ra man; chuoi rong la tinh trung lap. */
  public tenNuoc(id: string): string {
    if (id === '') return 'trung lập';
    return this.banDo.nuoc.find((n) => n.id === id)?.hien ?? id;
  }

  /** Trang thai o xay dung thu `oXay` cua tinh. */
  public oCua(tinhId: string, oXay: number): TrangThaiO {
    return this.o.get(khoaO(tinhId, oXay)) ?? O_TRONG;
  }

  /** Cac cong trinh xay duoc o tinh nay, da loc theo dia hinh. */
  public xayDuocGi(tinhId: string): readonly CongTrinh[] {
    const t: Tinh | undefined = this.theoId.get(tinhId);
    if (t === undefined) return [];
    return this.congTrinh.filter((c) => c.dia_hinh.length === 0 || c.dia_hinh.includes(t.diaHinh));
  }

  /**
   * Dat lenh xay. Tra ve chuoi rong khi nhan lenh, khong thi tra ve ly do tu choi.
   *
   * Chi xay duoc tren dat cua nuoc nguoi choi: tinh trung lap va tinh nuoc khac phai
   * chiem da (Phase 9), khong phai cu bam la xay.
   */
  public datLenhXay(tinhId: string, oXay: number, congTrinhId: string): LyDoTuChoi {
    const t: Tinh | undefined = this.theoId.get(tinhId);
    if (t === undefined || oXay < 0 || oXay >= t.soOXay) return 'khong-co-o';
    if (t.nuoc !== this.nuocCuaTa()) return 'khong-phai-cua-ta';

    const hien: TrangThaiO = this.oCua(tinhId, oXay);
    if (hien.congTrinh !== '' || hien.dangXay !== '') return 'o-da-co-chu';

    const c: CongTrinh | undefined = this.congTrinh.find((x) => x.id === congTrinhId);
    if (c === undefined) return 'khong-co-o';
    if (c.dia_hinh.length > 0 && !c.dia_hinh.includes(t.diaHinh)) return 'sai-dia-hinh';

    this.o.set(khoaO(tinhId, oXay), { congTrinh: '', dangXay: c.id, conLai: c.luot });
    return '';
  }

  /** Mot luot troi qua: moi cong trinh dang xay bot mot luot, het luot thi dung xong. */
  public nhip(): void {
    this.soLuot += 1;
    for (const [k, v] of this.o) {
      if (v.dangXay === '') continue;
      const conLai: number = v.conLai - 1;
      this.o.set(
        k,
        conLai > 0
          ? { congTrinh: '', dangXay: v.dangXay, conLai }
          : { congTrinh: v.dangXay, dangXay: '', conLai: 0 },
      );
    }
  }

  /** Dem o trong / dang xay / da xay cua mot tinh. */
  public demTinh(tinhId: string): { trong: number; dangXay: number; daXay: number } {
    const t: Tinh | undefined = this.theoId.get(tinhId);
    if (t === undefined) return { trong: 0, dangXay: 0, daXay: 0 };
    let dangXay = 0;
    let daXay = 0;
    for (let i = 0; i < t.soOXay; i += 1) {
      const v: TrangThaiO = this.oCua(tinhId, i);
      if (v.dangXay !== '') dangXay += 1;
      else if (v.congTrinh !== '') daXay += 1;
    }
    return { trong: t.soOXay - dangXay - daXay, dangXay, daXay };
  }
}

/** Khoa mot o xay dung trong bang trang thai. */
function khoaO(tinhId: string, oXay: number): string {
  return `${tinhId}#${String(oXay)}`;
}
