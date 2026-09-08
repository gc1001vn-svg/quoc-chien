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

/** Mot mat hang: ten may doc, ten nguoi doc, suc chua, ton kho luc bat dau, do hong. */
export interface DinhNghiaHang {
  readonly ten: string;
  readonly hien: string;
  readonly tran: number;
  readonly dau: number;
  /**
   * Bao nhieu phan tram ton kho hong di moi gio game. 0 la khong bao gio hong.
   *
   * Nho co so nay ma muoi va ca muoi moi co nghia: ca tuoi hong 40 %/gio, ca muoi 2 %.
   * Cung vi no ma kho khong con dung im o tran nua - hang du bi an dan.
   */
  readonly hao: number;
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

    // Khong khai `hao` thi coi nhu khong hong - sat va da lam gi co chuyen thoi rua.
    const hao = o['hao'] === undefined ? 0 : laySoNguyen(o['hao'], `${duong}.hao`, 0);
    if (hao > 100) throw new LoiDuLieu(`${duong}.hao`, 'khong the hong qua 100 %/gio');

    ra.push({ ten, hien: layChuoi(o['hien'], `${duong}.hien`), tran, dau, hao });
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

/**
 * Hang de lau thi hong. Vut mot phan `hao` %/gio, chia deu cho `lanMoiGio` lan goi.
 *
 * Tinh tren ton kho hien tai nen cang tru nhieu cang hao nhieu - do la ly do de xay kho
 * vua du chu khong chat cang. Phan le duoc giu lai trong `du` de mon hong cham nhu ca
 * muoi 2 %/gio khong bi lam tron xuong 0 mai mai.
 *
 * @returns So thuc su vut di tung mon. Mon khong hong thi khong co trong bang.
 */
export function hangHong(
  kho: Kho, ds: readonly DinhNghiaHang[], du: Map<string, number>, lanMoiGio: number,
): Map<string, number> {
  const ra = new Map<string, number>();
  for (const h of ds) {
    if (h.hao === 0) continue;
    const phan: number = (kho.co(h.ten) * h.hao) / 100 / lanMoiGio;
    const con: number = (du.get(h.ten) ?? 0) + phan;
    const vut: number = Math.floor(con);
    du.set(h.ten, con - vut);
    if (vut > 0) ra.set(h.ten, kho.bot(h.ten, vut));
  }
  return ra;
}
