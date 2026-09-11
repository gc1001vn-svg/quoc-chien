/**
 * Cay cong nghe (GAME_SPEC muc 9, hoc Freeciv): moi cong nghe toi da HAI tien de.
 *
 * TypeScript thuan (luat 1): khong doc file, khong dung DOM. Moi con so nam trong
 * `data/tech.json` (luat 2) - o day chi co luat, khong co gia tri.
 *
 * Cay nay KHONG biet Eureka la gi. Gia thuc cua mot cong nghe do nguoi goi dua vao
 * (`Meta.ts` gop Eureka), nen doi cach tinh Eureka khong phai sua file nay.
 */
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';
import { docHauQua, type HauQua } from '../decision/Engine.ts';

/** Mot cong nghe doc tu `data/tech.json`. */
export interface CongNghe {
  readonly id: string;
  readonly hien: string;
  readonly thoiDai: number;
  readonly gia: number;
  /** Toi da hai cai, va cai nao cung phai dung TRUOC trong file. */
  readonly tienDe: readonly string[];
  /** Mot cau cho nguoi choi doc. Khong phai khoa nha - xem `_loi` trong tech.json. */
  readonly loi: string;
  /** Id the chinh sach mo ra khi hoc xong. */
  readonly moThe: readonly string[];
  readonly thuong?: HauQua;
}

/** Cach sinh diem nghien cuu, doc tu `data/tech.json > nghienCuu`. */
export interface LuatNghienCuu {
  readonly coBan: number;
  readonly moiNhaMotDiem: number;
}

/** Ca file `data/tech.json` da doc xong. */
export interface DuLieuCongNghe {
  readonly luat: LuatNghienCuu;
  readonly ds: readonly CongNghe[];
}

const TOI_DA_TIEN_DE = 2;

/** Doc `data/tech.json`. Nem `LoiDuLieu` kem duong dan neu sai. */
export function docCongNghe(tho: unknown): DuLieuCongNghe {
  const goc = layObject(tho, 'tech.json');
  const ncu = layObject(goc['nghienCuu'], 'tech.json > nghienCuu');
  const luat: LuatNghienCuu = {
    coBan: laySoNguyen(ncu['coBan'], 'tech.json > nghienCuu.coBan', 0),
    moiNhaMotDiem: laySoNguyen(ncu['moiNhaMotDiem'], 'tech.json > nghienCuu.moiNhaMotDiem'),
  };

  const mang = layMang(goc['congNghe'], 'tech.json > congNghe');
  if (mang.length === 0) throw new LoiDuLieu('tech.json > congNghe', 'khong duoc rong');

  const ds: CongNghe[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `tech.json > congNghe[${String(i)}]`;
    const o = layObject(muc, duong);
    const id = layChuoi(o['id'], `${duong}.id`);
    if (daCo.has(id)) throw new LoiDuLieu(`${duong}.id`, `trung id "${id}"`);

    const tienDe = layMang(o['tienDe'], `${duong}.tienDe`)
      .map((t, k) => layChuoi(t, `${duong}.tienDe[${String(k)}]`));
    if (tienDe.length > TOI_DA_TIEN_DE) {
      throw new LoiDuLieu(`${duong}.tienDe`, `toi da ${String(TOI_DA_TIEN_DE)} tien de`);
    }
    for (const t of tienDe) {
      // Tien de phai dung TRUOC trong file. Luat nay vua de doc file tu tren xuong, vua
      // chan cho cay thanh vong tron (A can B, B can A) ma khong phai quet do thi.
      if (!daCo.has(t)) throw new LoiDuLieu(`${duong}.tienDe`, `"${t}" chua co o tren`);
    }
    daCo.add(id);

    ds.push({
      id,
      hien: layChuoi(o['hien'], `${duong}.hien`),
      thoiDai: laySoNguyen(o['thoiDai'], `${duong}.thoiDai`),
      gia: laySoNguyen(o['gia'], `${duong}.gia`),
      tienDe,
      loi: layChuoi(o['loi'], `${duong}.loi`),
      moThe: layMang(o['moThe'], `${duong}.moThe`)
        .map((t, k) => layChuoi(t, `${duong}.moThe[${String(k)}]`)),
      ...(o['thuong'] === undefined ? {} : { thuong: docHauQua(o['thuong'], `${duong}.thuong`) }),
    });
  }
  return { luat, ds };
}

/** Cay cong nghe cua mot van dang choi: da hoc gi, dang hoc gi, don duoc bao nhieu diem. */
export class CayCongNghe {
  private readonly ds: readonly CongNghe[];
  private readonly luat: LuatNghienCuu;
  private readonly xong = new Set<string>();
  /** Diem da don vao cong nghe dang hoc. Doi cong nghe thi diem GIU NGUYEN, khong mat. */
  private diem = 0;
  private dangHoc: CongNghe | undefined;

  constructor(du: DuLieuCongNghe) {
    this.ds = du.ds;
    this.luat = du.luat;
  }

  /** Toan bo cay, ke ca cai chua hoc duoc - bang cong nghe can ve du de nguoi choi nhin. */
  get toanBo(): readonly CongNghe[] {
    return this.ds;
  }

  /** Da hoc xong bao nhieu cong nghe. Dieu kien len thoi dai nhin vao so nay. */
  get soXong(): number {
    return this.xong.size;
  }

  daXong(id: string): boolean {
    return this.xong.has(id);
  }

  /** Cong nghe dang hoc, hay `undefined` khi nguoi choi chua chon. */
  get dang(): CongNghe | undefined {
    return this.dangHoc;
  }

  /** Diem da don vao cong nghe dang hoc. */
  get daDon(): number {
    return this.diem;
  }

  /** Cong nghe hoc duoc ngay bay gio: du tien de, chua hoc xong. */
  hocDuoc(): CongNghe[] {
    return this.ds.filter((c) => !this.xong.has(c.id) && c.tienDe.every((t) => this.xong.has(t)));
  }

  /** Chon cong nghe de hoc. Tra ve `false` neu chua du tien de hoac da hoc roi. */
  chon(id: string): boolean {
    const c: CongNghe | undefined = this.hocDuoc().find((x) => x.id === id);
    if (c === undefined) return false;
    this.dangHoc = c;
    return true;
  }

  /** Diem nghien cuu mot gio game sinh ra. `heSo` la phan tram cua the chinh sach. */
  diemMoiGio(soNha: number, heSo: number): number {
    const tho: number = this.luat.coBan + Math.floor(soNha / this.luat.moiNhaMotDiem);
    return Math.round((tho * heSo) / 100);
  }

  /**
   * Don `them` diem vao cong nghe dang hoc. Tra ve cong nghe VUA XONG, hay `undefined`.
   *
   * Chua chon gi thi tu chon cai re nhat hoc duoc: `npm run sim:congnghe` chay khong co
   * nguoi bam, va nguoi choi mo game ra roi khong dong vao bang cong nghe cung khong nen
   * ngoi im mot van.
   *
   * `gia` la gia THUC sau Eureka, do `Meta.ts` dua vao.
   */
  don(them: number, gia: (c: CongNghe) => number): CongNghe | undefined {
    if (this.dangHoc === undefined) {
      const re: CongNghe | undefined = this.hocDuoc()
        .reduce<CongNghe | undefined>((a, b) => (a === undefined || gia(b) < gia(a) ? b : a), undefined);
      if (re === undefined) return undefined;
      this.dangHoc = re;
    }
    this.diem += them;
    const can: number = gia(this.dangHoc);
    if (this.diem < can) return undefined;

    const vuaXong: CongNghe = this.dangHoc;
    this.xong.add(vuaXong.id);
    // Diem thua chay sang cong nghe sau, khong vut di: don du 119/120 roi mat sach la
    // nguoi choi thay minh bi phat vi bam dung luc.
    this.diem -= can;
    this.dangHoc = undefined;
    return vuaXong;
  }
}
