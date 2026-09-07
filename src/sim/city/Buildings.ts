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
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from './DocJson.ts';
import type { Kho } from './Wares.ts';

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

function docMuc(tho: unknown, duong: string): Muc[] {
  return layMang(tho, duong).map((m, i) => {
    const o = layObject(m, `${duong}[${String(i)}]`);
    return {
      hang: layChuoi(o['hang'], `${duong}[${String(i)}].hang`),
      so: laySoNguyen(o['so'], `${duong}[${String(i)}].so`),
    };
  });
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
  private conLai = 0;
  private dangLam = false;
  private dem: number;

  readonly def: DinhNghiaNha;

  // Khai kieu roi gan trong than ham, khong dung `constructor(readonly def: ...)`:
  // Node boc kieu TypeScript khong nuot duoc loi viet tat do (ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX).
  constructor(def: DinhNghiaNha, lechPha: number) {
    this.def = def;
    this.dem = lechPha % def.nhip;
  }

  /** Chay mot nhip. */
  nhip(kho: Kho, bd: BoDem): void {
    if (this.def.kieu === 'tieu_thu') this.nhipTieuThu(kho, bd);
    else this.nhipSanXuat(kho, bd);
  }

  /** Nha tieu thu: den ky thi an tung mon mot cach doc lap. */
  private nhipTieuThu(kho: Kho, bd: BoDem): void {
    this.dem += 1;
    if (this.dem < this.def.nhip) return;
    this.dem = 0;

    for (const m of this.def.vao) {
      const duoc = kho.bot(m.hang, m.so);
      if (duoc > 0) bd.dungHet(m.hang, duoc);
      if (duoc < m.so) bd.doi(this.def.ten, m.hang);
    }
    bd.meXong(this.def.ten);
  }

  /** Nha san xuat: an het hang vao, cho du nhip, roi de ra hang. */
  private nhipSanXuat(kho: Kho, bd: BoDem): void {
    if (this.dem > 0) {
      // Con dang lech pha luc bat dau van, chua chay me nao.
      this.dem -= 1;
      return;
    }

    if (!this.dangLam) {
      const thieu = this.def.vao.find((m) => !kho.du(m.hang, m.so));
      if (thieu !== undefined) {
        bd.doi(this.def.ten, thieu.hang);
        return;
      }
      for (const m of this.def.vao) {
        bd.dungHet(m.hang, kho.bot(m.hang, m.so));
      }
      this.dangLam = true;
      this.conLai = this.def.nhip;
      return;
    }

    this.conLai -= 1;
    if (this.conLai > 0) return;

    // Me xong. Chi giao hang khi kho con cho cho **tat ca** dau ra - giao mot nua roi
    // ket lai se lam mat hang, va lam bang so noi doi.
    const day = this.def.ra.find((m) => !kho.duCho(m.hang, m.so));
    if (day !== undefined) {
      bd.tac(this.def.ten, day.hang);
      return;
    }
    for (const m of this.def.ra) {
      bd.lamRa(m.hang, kho.them(m.hang, m.so));
    }
    this.dangLam = false;
    bd.meXong(this.def.ten);
  }
}
