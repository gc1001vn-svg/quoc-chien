/**
 * Eureka (GAME_SPEC muc 9, hoc Civilization VI): lam mot viec cu the thi mot cong nghe
 * re han di. Lam viec len thoi dai thanh thu KIEM DUOC, khong phai ngoi doi.
 *
 * Dieu kien dung DUNG bo luat cua the quyet dinh (`decision/DieuKien.ts`) - mot bo luat,
 * khong co ban sao thu hai se troi khac di.
 *
 * TypeScript thuan (luat 1). Moi con so nam trong `data/eureka.json` (luat 2).
 */
import type { ThongKe } from '../city/Cham.ts';
import { docDieuKien, dung, type DieuKien, type SoThanhPho } from '../decision/DieuKien.ts';
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

/** Mot moc Eureka doc tu `data/eureka.json`. */
export interface MocEureka {
  readonly congNghe: string;
  /** Cau ta viec phai lam, hien tren bang cong nghe. */
  readonly hien: string;
  readonly dieuKien: DieuKien;
}

/** Ca file `data/eureka.json` da doc xong. */
export interface DuLieuEureka {
  /** Giam bao nhieu phan tram gia cong nghe. */
  readonly giam: number;
  readonly ds: readonly MocEureka[];
}

/** Doc `data/eureka.json`. Nem `LoiDuLieu` kem duong dan neu sai. */
export function docEureka(tho: unknown): DuLieuEureka {
  const goc = layObject(tho, 'eureka.json');
  const giam = laySoNguyen(goc['giam'], 'eureka.json > giam', 0);
  if (giam >= 100) throw new LoiDuLieu('eureka.json > giam', 'phai duoi 100 phan tram');

  const mang = layMang(goc['eureka'], 'eureka.json > eureka');
  const ds: MocEureka[] = [];
  const daCo = new Set<string>();
  for (const [i, muc] of mang.entries()) {
    const duong = `eureka.json > eureka[${String(i)}]`;
    const o = layObject(muc, duong);
    const congNghe = layChuoi(o['congNghe'], `${duong}.congNghe`);
    // Mot cong nghe mot Eureka: hai moc cung tro mot cho thi giam hai lan, va bang cong
    // nghe khong biet hien cau nao.
    if (daCo.has(congNghe)) throw new LoiDuLieu(`${duong}.congNghe`, `trung "${congNghe}"`);
    daCo.add(congNghe);
    ds.push({
      congNghe,
      hien: layChuoi(o['hien'], `${duong}.hien`),
      dieuKien: docDieuKien(o['dieuKien'], `${duong}.dieuKien`),
    });
  }
  return { giam, ds };
}

/** Eureka cua mot van dang choi: moc nao da dat. */
export class SoEureka {
  private readonly du: DuLieuEureka;
  private readonly dat = new Set<string>();

  constructor(du: DuLieuEureka) {
    this.du = du;
  }

  /** Moc cua mot cong nghe, hay `undefined` neu cong nghe do khong co Eureka. */
  moc(congNghe: string): MocEureka | undefined {
    return this.du.ds.find((m) => m.congNghe === congNghe);
  }

  daDat(congNghe: string): boolean {
    return this.dat.has(congNghe);
  }

  /** Gia thuc cua mot cong nghe sau khi tru Eureka da dat. */
  gia(congNghe: string, giaGoc: number): number {
    if (!this.dat.has(congNghe)) return giaGoc;
    return Math.max(1, Math.round((giaGoc * (100 - this.du.giam)) / 100));
  }

  /**
   * Cham bang so cua gio vua xong. Tra ve nhung moc VUA dat lan dau.
   *
   * Da dat roi thi thoi: dieu kien "ton thep >= 20" dung suot ca van, khong the giam gia
   * mai. Da hoc xong cong nghe do roi thi cung khong ghi nua - bao "Eureka! Luyen thep"
   * sau khi da co Luyen thep la mot dong nhat vo nghia trong nhat ky.
   */
  cham(tk: ThongKe, tp: SoThanhPho, daXong: (id: string) => boolean): MocEureka[] {
    const moi: MocEureka[] = [];
    for (const m of this.du.ds) {
      if (this.dat.has(m.congNghe) || daXong(m.congNghe)) continue;
      if (!dung(m.dieuKien, tk, tp)) continue;
      this.dat.add(m.congNghe);
      moi.push(m);
    }
    return moi;
  }
}
