/**
 * Hang hoa va kho chung cua thanh pho.
 *
 * Phase 3 dung **mot kho chung cho ca thanh pho**, hang chuyen tuc thi: nha san xuat bo
 * hang vao kho, nha khac lay ra ngay. Phase 4 thay bang walker vac that (GAME_SPEC muc 4,
 * cach cua Caesar III) ma khong phai dong so can bang nao - luc do `them`/`bot` chi doi
 * cho goi, khong doi y nghia.
 *
 * Hai dieu kho phai giu bang duoc: **khong bao gio am**, va **khong bao gio qua tran**.
 */
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from './DocJson.ts';

/** Mot mat hang: ten may doc, ten nguoi doc, suc chua, ton kho luc bat dau. */
export interface DinhNghiaHang {
  readonly ten: string;
  readonly hien: string;
  readonly tran: number;
  readonly dau: number;
}

/** Doc `data/wares.json`. Nem `LoiDuLieu` neu sai. */
export function docHang(tho: unknown): DinhNghiaHang[] {
  const goc = layObject(tho, 'wares.json');
  const mang = layMang(goc['hang'], 'wares.json > hang');
  if (mang.length === 0) throw new LoiDuLieu('wares.json > hang', 'khong duoc rong');

  const ra: DinhNghiaHang[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `wares.json > hang[${String(i)}]`;
    const o = layObject(muc, duong);
    const ten = layChuoi(o['ten'], `${duong}.ten`);
    if (daCo.has(ten)) throw new LoiDuLieu(`${duong}.ten`, `trung ten "${ten}"`);
    daCo.add(ten);

    const tran = laySoNguyen(o['tran'], `${duong}.tran`);
    const dau = laySoNguyen(o['dau'], `${duong}.dau`, 0);
    if (dau > tran) throw new LoiDuLieu(`${duong}.dau`, 'ton kho ban dau vuot tran');

    ra.push({ ten, hien: layChuoi(o['hien'], `${duong}.hien`), tran, dau });
  }
  return ra;
}

/** Kho chung: giu so luong tung mat hang, kep trong khoang 0..tran. */
export class Kho {
  private readonly so = new Map<string, number>();
  private readonly tran = new Map<string, number>();

  constructor(dsHang: readonly DinhNghiaHang[]) {
    for (const h of dsHang) {
      this.so.set(h.ten, h.dau);
      this.tran.set(h.ten, h.tran);
    }
  }

  /** Ten moi mat hang, theo dung thu tu trong `wares.json`. */
  get tenHang(): string[] {
    return [...this.so.keys()];
  }

  /** Ton kho hien tai. Hang khong co trong dinh nghia thi nem loi, khong tra ve 0. */
  co(ten: string): number {
    const n = this.so.get(ten);
    if (n === undefined) throw new LoiDuLieu(`kho.${ten}`, 'khong co mat hang nay');
    return n;
  }

  /** Suc chua toi da. */
  tranCua(ten: string): number {
    const n = this.tran.get(ten);
    if (n === undefined) throw new LoiDuLieu(`kho.${ten}`, 'khong co mat hang nay');
    return n;
  }

  /** Con du cho cho `so` mon nua khong. */
  duCho(ten: string, so: number): boolean {
    return this.co(ten) + so <= this.tranCua(ten);
  }

  /** Con du `so` mon de lay ra khong. */
  du(ten: string, so: number): boolean {
    return this.co(ten) >= so;
  }

  /**
   * Bo hang vao kho. Tra ve so **thuc su** bo vao duoc - day tran thi it hon so xin bo.
   * Khong bao gio vuot tran.
   */
  them(ten: string, so: number): number {
    if (so < 0) throw new LoiDuLieu(`kho.${ten}`, 'them so am - dung `bot`');
    const dat = Math.min(so, this.tranCua(ten) - this.co(ten));
    this.so.set(ten, this.co(ten) + dat);
    return dat;
  }

  /**
   * Lay hang ra khoi kho. Tra ve so **thuc su** lay duoc - khong du thi it hon so xin lay.
   * Khong bao gio xuong duoi 0.
   */
  bot(ten: string, so: number): number {
    if (so < 0) throw new LoiDuLieu(`kho.${ten}`, 'bot so am - dung `them`');
    const dat = Math.min(so, this.co(ten));
    this.so.set(ten, this.co(ten) - dat);
    return dat;
  }

  /** Ban sao de in bang hay de test doc, khong sua duoc kho that. */
  ban(): Map<string, number> {
    return new Map(this.so);
  }
}
