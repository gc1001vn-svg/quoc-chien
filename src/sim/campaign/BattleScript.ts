/**
 * Kich ban tran: bien su kien tho cua `Battle.ts` thanh dong thoi gian de Phase 10 dien
 * (`render/BattleScene.ts`). Kich ban chi DOC ket qua da tinh - khong tinh lai gi - nen
 * cai nguoi choi xem khong bao gio lech con so du doan va ket qua (GAME_SPEC muc 6).
 */
import type { DauVaoTran, DuLieuTran, KetQuaTran, Phe } from './Battle.ts';

export type LoaiCanh = 'tien' | 'ban' | 'giap_la_ca' | 'vo' | 'ket_thuc';

/** Mot canh cua kich ban. `doi` = chi so doi trong ben, -1 la ca ben. */
export interface Canh {
  readonly giay: number;
  readonly loai: LoaiCanh;
  readonly ben: Phe;
  readonly doi: number;
  /** Mot dong tieng Viet de hien nhat ky tran. */
  readonly chu: string;
}

const TEN_BEN: Readonly<Record<Phe, string>> = { a: 'quân ta', b: 'quân địch' };

/** Dung kich ban tu ket qua. Canh dau luon la hai ben tien o giay 0, canh cuoi la ket thuc. */
export function sinhKichBan(kq: KetQuaTran, vao: DauVaoTran, duLieu: DuLieuTran): Canh[] {
  const ten = (ben: Phe, doi: number): string => {
    const id: string = (ben === 'a' ? vao.a : vao.b).doi[doi] ?? '';
    return `${duLieu.doi.get(id)?.hien ?? id} (${TEN_BEN[ben]})`;
  };
  const canh: Canh[] = [{ giay: 0, loai: 'tien', ben: 'a', doi: -1, chu: 'Hai bên tiến' }];
  for (const s of kq.suKien) {
    if (s.loai === 'vo') {
      canh.push({ giay: s.giay, loai: 'vo', ben: s.ben, doi: s.doi, chu: `${ten(s.ben, s.doi)} vỡ trận` });
      continue;
    }
    const id: string = (s.ben === 'a' ? vao.a : vao.b).doi[s.doi] ?? '';
    const xa: boolean = (duLieu.doi.get(id)?.tam ?? 0) > 1;
    canh.push({
      giay: s.giay,
      loai: xa ? 'ban' : 'giap_la_ca',
      ben: s.ben,
      doi: s.doi,
      chu: xa ? `${ten(s.ben, s.doi)} bắn loạt đầu` : `${ten(s.ben, s.doi)} xông vào giáp lá cà`,
    });
  }
  const thua: Phe = kq.thang === 'a' ? 'b' : 'a';
  canh.push({
    giay: kq.giayKetThuc,
    loai: 'ket_thuc',
    ben: kq.thang,
    doi: -1,
    chu: `Tàn quân ${TEN_BEN[thua]} rút — ${TEN_BEN[kq.thang]} thắng`,
  });
  return canh;
}
