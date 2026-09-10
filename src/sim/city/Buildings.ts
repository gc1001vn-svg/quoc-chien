/**
 * Toa nha: dinh nghia doc tu `data/buildings.json`, va the hien chay tung nhip.
 *
 * Hai kieu nha, khac nhau o mot cho duy nhat nhung rat quan trong:
 *
 * - `san_xuat`: an het `vao` **cung mot luc** roi mot lat sau de ra `ra`. Thieu mot mon
 *   la ca me khong chay - dung nhu day chuyen that.
 * - `tieu_thu`: an tung mon **doc lap**. Het ruou thi dan van an duoc banh mi. Neu bat
 *   dan an theo kieu `san_xuat` thi mot mat hang het la ca thanh pho nhin doi - loi day
 *   chuyen gia, khong phai loi kinh te.
 */
import type { O } from './BanDo.ts';
import type { TenKhu } from './QuyHoach.ts';
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from './DocJson.ts';

/** Mot mon hang kem so luong. */
export interface Muc {
  readonly hang: string;
  readonly so: number;
}

/** Kieu nha. */
export type KieuNha = 'san_xuat' | 'tieu_thu';

/** Dinh nghia mot loai nha. Moi so o day den tu `data/buildings.json`. */
export interface DinhNghiaNha {
  readonly ten: string;
  readonly hien: string;
  /** Ten sprite trong atlas. Nhieu loai nha dung chung mot hinh - xem `data/buildings.json`. */
  readonly sprite: string;
  /** Khu quy hoach: `do_thi` `san_xuat` `nong_nghiep` `cong_nghiep` `quan_su`. */
  readonly khu: TenKhu;
  /** Khoang cach Chebyshev toi thieu toi mot nha CUNG LOAI - xem `QuyHoach.ts`. */
  readonly cachNhau: number;
  /** Tien ich: moi khoi pho 8x8 mot cai, dat gan giua khoi (ped shed). */
  readonly motKhoi: boolean;
  readonly kieu: KieuNha;
  readonly so: number;
  readonly nhip: number;
  readonly vao: readonly Muc[];
  readonly ra: readonly Muc[];
}

/** Noi nhan so lieu tung nhip. `City` cai dat, `ThuNha` chi bao len. */
export interface BoDem {
  /** Mot me da xong (nha san xuat) hoac mot luot an da xong (nha tieu thu). */
  meXong(tenNha: string): void;
  /** Nha dung vi thieu hang vao. */
  doi(tenNha: string, hang: string): void;
  /** Nha dung vi kho day, khong co cho de hang ra. */
  tac(tenNha: string, hang: string): void;
  /** Hang vua duoc lam ra. */
  lamRa(hang: string, so: number): void;
  /** Hang vua bi dung het. */
  dungHet(hang: string, so: number): void;
}

/**
 * Noi goi nguoi vac hang. `ThanhPho` cai dat, `ThuNha` goi len.
 *
 * Tu Phase 4, nha **khong cham vao kho chung** nua - moi mon hang deu phai co mot nguoi
 * di bo tren duong cho qua. Nha nao xa duong hay bi vay kin thi hang toi cham, va do
 * chinh la chieu sau ma bo tri nha cua mang lai.
 */
export interface Giao {
  /** Xin mot nguoi di kho lay `hang` ve. Tra ve co phat duoc nguoi khong. */
  xinLay(nha: ThuNha, hang: string): boolean;
  /** Xin mot nguoi cho `so` mon `hang` ra kho chung. */
  xinGiao(nha: ThuNha, hang: string, so: number): boolean;
}

function docMuc(tho: unknown, duong: string): Muc[] {
  return layMang(tho, duong).map((m, i) => {
    const o = layObject(m, `${duong}[${String(i)}]`);
    return {
      hang: layChuoi(o['hang'], `${duong}[${String(i)}].hang`),
      so: laySoNguyen(o['so'], `${duong}[${String(i)}].so`),
    };
  });
}

/** Nam ten khu hop le, khong hon. Sai ten thi nha se roi vao khu khong ai ngo. */
const TEN_KHU: readonly string[] = ['do_thi', 'san_xuat', 'nong_nghiep', 'cong_nghiep', 'quan_su'];

function docKhu(tho: unknown, duong: string): TenKhu {
  const ten = layChuoi(tho, duong);
  if (!TEN_KHU.includes(ten)) throw new LoiDuLieu(duong, `phai la mot trong ${TEN_KHU.join(' ')}`);
  return ten as TenKhu;
}

/** Doc `data/buildings.json`. Nem `LoiDuLieu` neu sai. */
export function docNha(tho: unknown): DinhNghiaNha[] {
  const goc = layObject(tho, 'buildings.json');
  const mang = layMang(goc['nha'], 'buildings.json > nha');
  if (mang.length === 0) throw new LoiDuLieu('buildings.json > nha', 'khong duoc rong');

  const ra: DinhNghiaNha[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `buildings.json > nha[${String(i)}]`;
    const o = layObject(muc, duong);
    const ten = layChuoi(o['ten'], `${duong}.ten`);
    if (daCo.has(ten)) throw new LoiDuLieu(`${duong}.ten`, `trung ten "${ten}"`);
    daCo.add(ten);

    const kieu = layChuoi(o['kieu'], `${duong}.kieu`);
    if (kieu !== 'san_xuat' && kieu !== 'tieu_thu') {
      throw new LoiDuLieu(`${duong}.kieu`, 'phai la "san_xuat" hoac "tieu_thu"');
    }

    const vao = docMuc(o['vao'], `${duong}.vao`);
    const raHang = docMuc(o['ra'], `${duong}.ra`);
    if (kieu === 'tieu_thu' && raHang.length > 0) {
      throw new LoiDuLieu(`${duong}.ra`, 'nha tieu thu khong duoc de ra hang');
    }
    if (kieu === 'san_xuat' && raHang.length === 0) {
      throw new LoiDuLieu(`${duong}.ra`, 'nha san xuat phai de ra it nhat mot mon');
    }
    if (vao.length === 0 && kieu === 'tieu_thu') {
      throw new LoiDuLieu(`${duong}.vao`, 'nha tieu thu phai an it nhat mot mon');
    }

    ra.push({
      ten,
      hien: layChuoi(o['hien'], `${duong}.hien`),
      sprite: layChuoi(o['sprite'], `${duong}.sprite`),
      khu: docKhu(o['khu'], `${duong}.khu`),
      cachNhau: laySoNguyen(o['cachNhau'], `${duong}.cachNhau`),
      motKhoi: o['motKhoi'] === true,
      kieu,
      so: laySoNguyen(o['so'], `${duong}.so`),
      nhip: laySoNguyen(o['nhip'], `${duong}.nhip`),
      vao,
      ra: raHang,
    });
  }
  return ra;
}

/**
 * Mot toa nha co that trong thanh pho.
 *
 * `tre` la do lech pha luc bat dau: 30 nha dan cung an vao dung mot nhip thi kho giat
 * cuc, nhin vao bang so tuong chuoi dang kep. Lech pha cho giong thanh pho that.
 */
export class ThuNha {
  readonly def: DinhNghiaNha;
  readonly chiSo: number;
  readonly oNha: O;
  /** O duong sat nha. Walker xuat phat va ve toi day, khong buoc vao trong nha. */
  readonly cong: O;
  /** Hang dang co nguoi di kho lay ve - dung phat them nguoi nua cho cung mot mon. */
  readonly dangLay = new Set<string>();

  /** Kho rieng cua nha. Tu Phase 4, day la cho DUY NHAT nha cham vao duoc. */
  private readonly rieng = new Map<string, number>();
  private readonly tranRieng: number;
  private conLai = 0;
  private dangLam = false;
  private dem: number;

  // Khai kieu roi gan trong than ham, khong dung `constructor(readonly def: ...)`:
  // Node boc kieu TypeScript khong nuot duoc loi viet tat do (ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX).
  constructor(def: DinhNghiaNha, chiSo: number, lechPha: number, oNha: O, cong: O, tranRieng: number) {
    this.def = def;
    this.chiSo = chiSo;
    this.oNha = oNha;
    this.cong = cong;
    this.tranRieng = tranRieng;
    this.dem = lechPha % def.nhip;
  }

  /** Ton kho rieng cua mot mon. */
  co(hang: string): number {
    return this.rieng.get(hang) ?? 0;
  }

  /** Bo hang vao kho rieng, kep theo tran. Tra ve so thuc su vao duoc. */
  them(hang: string, so: number): number {
    const dat: number = Math.min(so, this.tranRieng - this.co(hang));
    if (dat <= 0) return 0;
    this.rieng.set(hang, this.co(hang) + dat);
    return dat;
  }

  /**
   * Nhan hang tu mot nguoi vac ve, **khong kep theo tran**.
   *
   * Kep o day thi hang tren vai nguoi do se bien mat - bang so noi doi. Tha de kho rieng
   * phinh qua tran mot luc: cho de hang RA moi kiem tran, nen no van ghim san xuat lai.
   */
  nhan(hang: string, so: number): void {
    this.rieng.set(hang, this.co(hang) + so);
  }

  /** Lay hang ra khoi kho rieng. Tra ve so thuc su lay duoc. */
  bot(hang: string, so: number): number {
    const dat: number = Math.min(so, this.co(hang));
    this.rieng.set(hang, this.co(hang) - dat);
    return dat;
  }

  /** Chay mot nhip. */
  nhip(giao: Giao, bd: BoDem): void {
    if (this.def.kieu === 'tieu_thu') this.nhipTieuThu(giao, bd);
    else this.nhipSanXuat(giao, bd);
  }

  /** Xin nguoi di lay mon con thieu, neu chua co ai dang di lay mon do. */
  private xinThieu(giao: Giao, hang: string): void {
    if (this.dangLay.has(hang)) return;
    if (giao.xinLay(this, hang)) this.dangLay.add(hang);
  }

  /** Nha tieu thu: den ky thi an tung mon mot cach doc lap, lay tu kho rieng. */
  private nhipTieuThu(giao: Giao, bd: BoDem): void {
    this.dem += 1;
    if (this.dem < this.def.nhip) return;
    this.dem = 0;

    for (const m of this.def.vao) {
      const duoc: number = this.bot(m.hang, m.so);
      if (duoc > 0) bd.dungHet(m.hang, duoc);
      if (duoc < m.so) bd.doi(this.def.ten, m.hang);
      if (this.co(m.hang) < m.so) this.xinThieu(giao, m.hang);
    }
    bd.meXong(this.def.ten);
  }

  /** Nha san xuat: an het hang vao tu kho rieng, cho du nhip, roi de ra kho rieng. */
  private nhipSanXuat(giao: Giao, bd: BoDem): void {
    if (this.dem > 0) {
      // Con dang lech pha luc bat dau van, chua chay me nao.
      this.dem -= 1;
      return;
    }

    if (!this.dangLam) {
      const thieu = this.def.vao.find((m) => this.co(m.hang) < m.so);
      if (thieu !== undefined) {
        bd.doi(this.def.ten, thieu.hang);
        this.xinThieu(giao, thieu.hang);
        return;
      }
      for (const m of this.def.vao) bd.dungHet(m.hang, this.bot(m.hang, m.so));
      this.dangLam = true;
      this.conLai = this.def.nhip;
      return;
    }

    this.conLai -= 1;
    if (this.conLai > 0) return;

    // Me xong. Chi de hang xuong khi kho rieng con cho cho **tat ca** dau ra - de mot nua
    // roi ket lai se lam mat hang, va lam bang so noi doi.
    const day = this.def.ra.find((m) => this.co(m.hang) + m.so > this.tranRieng);
    if (day !== undefined) {
      bd.tac(this.def.ten, day.hang);
      this.guiDi(giao);
      return;
    }
    for (const m of this.def.ra) bd.lamRa(m.hang, this.them(m.hang, m.so));
    this.dangLam = false;
    bd.meXong(this.def.ten);
    this.guiDi(giao);
  }

  /** Kho rieng day thi goi nguoi cho bot ra kho chung. */
  private guiDi(giao: Giao): void {
    for (const m of this.def.ra) {
      const co: number = this.co(m.hang);
      if (co > 0) giao.xinGiao(this, m.hang, co);
    }
  }
}
