/**
 * AI nuoc khac (Phase 11A): theo luat, khong hoc, tat dinh theo hat giong.
 *
 * Moi gio moi nuoc AI lam dung ba viec, theo thu tu:
 * 1. Dang chien ma yeu hon thi xin hoa (dam phan).
 * 2. Ke bien gioi, manh hon ro, quan he nguoi thi co xac suat tuyen chien.
 * 3. Het gio nghi thi danh tinh ke de an nhat, neu du doan thang du cao.
 *
 * TypeScript thuan (luat 1). Moi nguong doc tu `the_gioi.json > ai` (luat 2).
 */
import type { Rng } from '../../core/Rng.ts';
import { xacSuatThang } from './ChienTranh.ts';
import type { TheGioi } from './TheGioi.ts';

export function aiHanhDong(tg: TheGioi, id: string, rng: Rng): void {
  const ai = tg.du.ai;
  const toi = tg.nuoc(id);
  for (const khac of tg.conSong) {
    if (khac === id) continue;
    const tiLe: number = tg.suc(id) / Math.max(1, tg.suc(khac));
    const tt = tg.ngoaiGiao.trangThai(id, khac);
    // Rut so moi luot du co dung hay khong: day so khong lech khi mot dieu kien doi.
    const boc: number = rng.so();
    if (tt === 'chien_tranh') {
      if (tiLe < ai.tiLeXinHoa) tg.damPhan(id, khac);
      continue;
    }
    if (
      tt !== 'lien_minh' && tiLe >= ai.tiLeTuyenChien && boc < ai.xacSuatTuyenChien &&
      tg.ngoaiGiao.quanHe(id, khac) < ai.quanHeTuyenChien && tg.keNuoc(id, khac)
    ) {
      tg.tuyenChien(id, khac);
    }
  }

  if (toi.gioNghi > 0 || toi.quan.length === 0) return;
  const di = toi.quan.slice(0, tg.du.quan.doiMoiTran);
  let tot = '';
  let xs = 0;
  for (const t of tg.mucTieu(id)) {
    const p: number = xacSuatThang(di, tg.quanThu(t), tg.diaHinh(t), tg.du.quan.tuong, tg.tuongThu(t), tg.tran);
    if (p > xs) {
      xs = p;
      tot = t;
    }
  }
  if (tot !== '' && xs >= ai.xacSuatTanCong) tg.tanCong(id, tot);
}
