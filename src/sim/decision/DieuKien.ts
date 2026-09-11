/**
 * Dieu kien kich hoat: "ton `thep` >= 40", "soNha > 120"...
 *
 * Tach khoi `Engine.ts` ngay 11/09 vi Phase 8 can dung LAI dung bo luat nay cho Eureka
 * (`sim/meta/Eureka.ts`): lam Eureka bang mot bo luat rieng thi hai ben se troi khac nhau,
 * va cai the quyet dinh doc duoc se khac cai Eureka doc duoc tren cung mot bang so.
 *
 * TypeScript thuan (luat 1): nhan `ThongKe` da chot san, khong doc file, khong dung DOM.
 */
import type { SoHang, ThongKe } from '../city/Cham.ts';
import { layChuoi, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

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

/** So cua thanh pho ma `ThongKe` khong mang: dieu kien `soNha` va `soKho` can. */
export interface SoThanhPho {
  readonly soNha: number;
  readonly soKho: number;
}

/** Doc mot dieu kien tu JSON. Nem `LoiDuLieu` kem duong dan neu sai. */
export function docDieuKien(tho: unknown, duong: string): DieuKien {
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

/** Dieu kien co dung tren bang so cua gio nay khong. Khong co mat hang do thi coi la sai. */
export function dung(dk: DieuKien, tk: ThongKe, tp: SoThanhPho): boolean {
  const so: number | undefined = doSo(dk, tk, tp);
  if (so === undefined) return false;
  if (dk.phep === '>=') return so >= dk.gia;
  if (dk.phep === '<=') return so <= dk.gia;
  if (dk.phep === '>') return so > dk.gia;
  return so < dk.gia;
}
