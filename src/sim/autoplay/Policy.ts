/**
 * Chinh sach cua thong doc: doc tu `data/policy.json`, khong mot con so nao nam trong .ts
 * (CLAUDE.md luat 2).
 *
 * TypeScript thuan nhu ca `src/sim/` (luat 1): nhan object da doc san, khong tu doc file.
 */
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

/** Mot cap thong doc. Len cap thi tran nha va tran kho noi ra. */
export interface Cap {
  readonly ten: string;
  /** So nha toi thieu de dat cap nay. */
  readonly tuNha: number;
  readonly tranNha: number;
  readonly tranKho: number;
}

/** Toan bo chinh sach. */
export interface ChinhSach {
  readonly gioMoiLan: number;
  readonly nguongBoCuoc: number;
  readonly nguongDinh: number;
  readonly nguongCho: number;
  /** Xep theo `tuNha` tang dan. */
  readonly cap: readonly Cap[];
}

/** Doc `data/policy.json`. Nem `LoiDuLieu` neu sai. */
export function docChinhSach(tho: unknown): ChinhSach {
  const goc = layObject(tho, 'policy.json');
  const mang = layMang(goc['cap'], 'policy.json > cap');
  if (mang.length === 0) throw new LoiDuLieu('policy.json > cap', 'khong duoc rong');

  const cap: Cap[] = mang.map((m, i) => {
    const duong = `policy.json > cap[${String(i)}]`;
    const o = layObject(m, duong);
    return {
      ten: layChuoi(o['ten'], `${duong}.ten`),
      tuNha: laySoNguyen(o['tuNha'], `${duong}.tuNha`, 0),
      tranNha: laySoNguyen(o['tranNha'], `${duong}.tranNha`),
      tranKho: laySoNguyen(o['tranKho'], `${duong}.tranKho`),
    };
  });

  // Xep san mot lan o day chu khong xep moi gio: `capHienTai` chay moi gio game.
  cap.sort((m, n) => m.tuNha - n.tuNha);
  if (cap[0]?.tuNha !== 0) throw new LoiDuLieu('policy.json > cap', 'phai co mot cap tuNha = 0');

  return {
    gioMoiLan: laySoNguyen(goc['gioMoiLan'], 'policy.json > gioMoiLan'),
    nguongBoCuoc: laySoNguyen(goc['nguongBoCuoc'], 'policy.json > nguongBoCuoc', 0),
    nguongDinh: laySoNguyen(goc['nguongDinh'], 'policy.json > nguongDinh', 0),
    nguongCho: laySoNguyen(goc['nguongCho'], 'policy.json > nguongCho', 0),
    cap,
  };
}

/** Cap ung voi `soNha` nha dang co: cap cuoi cung ma `tuNha` con nho hon hay bang. */
export function capHienTai(cs: ChinhSach, soNha: number): Cap {
  let ra: Cap = cs.cap[0] as Cap;
  for (const c of cs.cap) {
    if (c.tuNha <= soNha) ra = c;
  }
  return ra;
}
