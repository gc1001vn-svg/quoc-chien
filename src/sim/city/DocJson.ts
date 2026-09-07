/**
 * Doc so va chu tu JSON mot cach co kiem tra.
 *
 * `data/*.json` la noi dat MOI so can bang (CLAUDE.md luat 2), va la thu duy nhat cua
 * mo phong den tu ben ngoai. Sai mot chu trong do thi phai bao **ngay luc doc**, kem ten
 * truong sai - khong de no am tham thanh `undefined` roi mai sau moi vo o cho khac.
 *
 * TypeScript thuan: khong doc file, khong biet file nam o dau. Nguoi goi doc file roi
 * dua object vao (`scripts/sim_thu.ts` doc bang fs, trinh duyet doc bang import JSON).
 */

/** Loi du lieu: keo theo duong dan toi cho sai de sua cho nhanh. */
export class LoiDuLieu extends Error {
  constructor(duong: string, viSao: string) {
    super(`${duong}: ${viSao}`);
    this.name = 'LoiDuLieu';
  }
}

/** Ep ve object. Mang khong tinh la object o day. */
export function layObject(tho: unknown, duong: string): Record<string, unknown> {
  if (typeof tho !== 'object' || tho === null || Array.isArray(tho)) {
    throw new LoiDuLieu(duong, 'phai la mot object');
  }
  return tho as Record<string, unknown>;
}

/** Ep ve mang. */
export function layMang(tho: unknown, duong: string): unknown[] {
  if (!Array.isArray(tho)) throw new LoiDuLieu(duong, 'phai la mot mang');
  return tho;
}

/** Ep ve chuoi khong rong. */
export function layChuoi(tho: unknown, duong: string): string {
  if (typeof tho !== 'string' || tho === '') {
    throw new LoiDuLieu(duong, 'phai la chuoi khong rong');
  }
  return tho;
}

/** Ep ve so nguyen duong. Moi so cua kinh te deu la so nguyen - hang dem tung cai. */
export function laySoNguyen(tho: unknown, duong: string, toiThieu = 1): number {
  if (typeof tho !== 'number' || !Number.isInteger(tho) || tho < toiThieu) {
    throw new LoiDuLieu(duong, `phai la so nguyen tu ${String(toiThieu)} tro len`);
  }
  return tho;
}
