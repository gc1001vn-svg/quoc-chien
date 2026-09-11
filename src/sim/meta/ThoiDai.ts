/**
 * Sau thoi dai (GAME_SPEC muc 9): co dai -> trung co -> sung ong -> cong nghiep ->
 * hien dai -> tuong lai.
 *
 * Len doi can DU CONG NGHE va DU CONG TRINH. Game chua co dan so va vang nen so cong
 * trinh dung thay dan so - doi lai duoc bang mot dong trong `data/balance.json` khi
 * Phase 9 noi lop chien dich vao kinh te.
 *
 * TypeScript thuan (luat 1). Moi con so nam trong `data/balance.json > thoiDai` (luat 2).
 */
import { layChuoi, layMang, layObject, laySoNguyen, LoiDuLieu } from '../city/DocJson.ts';

/** Dieu kien len doi ke tiep. `null` la chua mo duong len. */
export interface DieuKienLen {
  readonly soCongNghe: number;
  readonly soNha: number;
}

/** Mot thoi dai doc tu `data/balance.json > thoiDai`. */
export interface Doi {
  readonly so: number;
  readonly hien: string;
  /** So o chinh phu lap the chinh sach duoc o doi nay. */
  readonly soO: number;
  /** Ten me atlas cua doi nay. Doi doi la doi atlas (TECH_SPEC muc 2). */
  readonly me: string;
  readonly len: DieuKienLen | undefined;
}

/** Doc `data/balance.json > thoiDai`. Nem `LoiDuLieu` kem duong dan neu sai. */
export function docThoiDai(tho: unknown): Doi[] {
  const goc = layObject(tho, 'balance.json');
  const mang = layMang(goc['thoiDai'], 'balance.json > thoiDai');
  if (mang.length === 0) throw new LoiDuLieu('balance.json > thoiDai', 'khong duoc rong');

  const ds: Doi[] = [];
  for (const [i, muc] of mang.entries()) {
    const duong = `balance.json > thoiDai[${String(i)}]`;
    const o = layObject(muc, duong);
    const so = laySoNguyen(o['so'], `${duong}.so`);
    // Doi phai lien tiep tu 1: `doi[i]` phai la doi so `i + 1`. Nho vay tim doi hien tai
    // chi la mot phep tru, khong phai quet ca mang.
    if (so !== i + 1) throw new LoiDuLieu(`${duong}.so`, `phai la ${String(i + 1)}`);

    let len: DieuKienLen | undefined;
    if (o['len'] !== null && o['len'] !== undefined) {
      const l = layObject(o['len'], `${duong}.len`);
      len = {
        soCongNghe: laySoNguyen(l['soCongNghe'], `${duong}.len.soCongNghe`, 0),
        soNha: laySoNguyen(l['soNha'], `${duong}.len.soNha`, 0),
      };
    }

    ds.push({
      so,
      hien: layChuoi(o['hien'], `${duong}.hien`),
      soO: laySoNguyen(o['soO'], `${duong}.soO`),
      me: layChuoi(o['me'], `${duong}.me`),
      ...(len === undefined ? { len: undefined } : { len }),
    });
  }
  return ds;
}

/** Thoi dai cua mot van dang choi. */
export class ThoiDai {
  private readonly ds: readonly Doi[];
  private chiSo = 0;

  constructor(ds: readonly Doi[]) {
    if (ds.length === 0) throw new Error('phai co it nhat mot thoi dai');
    this.ds = ds;
  }

  /** Doi dang o. */
  get doi(): Doi {
    // `docThoiDai` da chan doi phai lien tiep tu 1 nen chi so luon trong mang.
    return this.ds[this.chiSo] as Doi;
  }

  /** Doi ke tiep, hay `undefined` khi dang o doi cuoi. */
  get doiSau(): Doi | undefined {
    return this.ds[this.chiSo + 1];
  }

  /** Du dieu kien len doi ke tiep chua. Doi cuoi, hay `len: null`, thi mai mai la chua. */
  duLen(soCongNghe: number, soNha: number): boolean {
    const dk: DieuKienLen | undefined = this.doi.len;
    if (dk === undefined || this.doiSau === undefined) return false;
    return soCongNghe >= dk.soCongNghe && soNha >= dk.soNha;
  }

  /** Len mot doi. Tra ve doi moi, hay `undefined` neu chua du dieu kien. */
  len(soCongNghe: number, soNha: number): Doi | undefined {
    if (!this.duLen(soCongNghe, soNha)) return undefined;
    this.chiSo += 1;
    return this.doi;
  }
}
