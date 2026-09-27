/**
 * Hanh dong chi nguoi choi co (Phase 11B tach tu `TheGioi.ts` cho file duoi tran 300 dong):
 * dau tu van hoa, chon the bat on. Chi dung API cong khai cua `TheGioi`.
 *
 * TypeScript thuan (luat 1). So doc tu `the_gioi.json` qua `tg.du` (luat 2).
 */
import type { TheGioi } from './TheGioi.ts';

/** Nguoi choi doi vang thang ra anh huong van hoa. */
export function dauTuVanHoa(tg: TheGioi, vang: number): void {
  const ta = tg.nuoc(tg.ta);
  const chi = Math.max(0, Math.min(vang, ta.vang));
  ta.vang -= chi;
  ta.vanHoa += chi * tg.du.vanHoa.moiVangDauTu;
}

/** Chon mot lua chon cua the bat on. Khong du vang thi tu choi - tra ve false. */
export function chonBatOn(tg: TheGioi, id: string): boolean {
  const ta = tg.nuoc(tg.ta);
  const lc = tg.batOn.luaChon.find((l) => l.id === id);
  if (lc === undefined || ta.vang + lc.vang < 0 || tg.batOn.chon(id) === undefined) return false;
  ta.vang += lc.vang;
  ta.vanHoa += lc.vanHoa;
  ta.quan.splice(0, lc.matDoi);
  return true;
}
