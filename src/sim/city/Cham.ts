/**
 * Bang so cua mot gio game, va phep cham diem.
 *
 * Tach khoi `City.ts` vi file do da cham tran 300 dong (CLAUDE.md). Day la phan "doc ket
 * qua"; `City.ts` la phan "chay".
 */
import type { SoWalker } from './Walkers.ts';

/** So cua mot loai nha trong mot gio game. */
export interface SoNha {
  readonly ten: string;
  readonly hien: string;
  readonly so: number;
  readonly me: number;
  readonly doi: number;
  readonly tac: number;
}

/** So cua mot mat hang trong mot gio game. */
export interface SoHang {
  readonly ten: string;
  readonly hien: string;
  readonly ton: number;
  readonly tran: number;
  readonly lamRa: number;
  readonly dungHet: number;
  /** So nhip co nha phai dung vi thieu mat hang nay. */
  readonly cho: number;
  /** So nhip co nha phai dung vi kho mat hang nay da day. */
  readonly day: number;
  /** So mon hong di trong gio - khong tinh la "dung het", vi khong ai duoc huong. */
  readonly hong: number;
}

/** Bang so cua mot gio game. */
export interface ThongKe {
  readonly gio: number;
  readonly nha: readonly SoNha[];
  readonly hang: readonly SoHang[];
  readonly walker: SoWalker;
}

/**
 * Cham diem mot gio game. Tra ve danh sach loi bang chu; rong la dat.
 *
 * Day la dinh nghia cu the cua "khong chuoi nao ket vinh vien" ma `KE_HOACH.md` muc 3
 * doi hoi: trong mot gio game, **moi nha phai chay duoc it nhat mot me** va **moi mat
 * hang phai vua duoc lam ra vua bi dung den**. Nha nao dung im ca tieng, hay hang nao
 * nam yen ca tieng, la chuoi da ket.
 */
export function chamDiem(tk: ThongKe): string[] {
  const loi: string[] = [];
  for (const n of tk.nha) {
    if (n.me === 0) {
      const viSao = n.tac > n.doi ? 'kho day, khong co cho de hang' : 'thieu hang vao';
      loi.push(`nha "${n.ten}" khong chay duoc me nao trong ca gio - ${viSao}`);
    }
  }
  for (const h of tk.hang) {
    if (h.ton < 0) loi.push(`hang "${h.ten}" am: ${String(h.ton)}`);
    if (h.lamRa === 0) loi.push(`hang "${h.ten}" ca gio khong ai lam ra`);
    if (h.dungHet === 0) loi.push(`hang "${h.ten}" ca gio khong ai dung den`);
  }
  return loi;
}
