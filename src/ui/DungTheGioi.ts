/**
 * Dung lop the gioi (Phase 11A) MOT lan cho ca hai man: thanh pho day gio, ban do tinh doc
 * chu tinh va cho tan cong. Hai man cung mot `TheGioi` - khong thi tinh chiem o ban do ma
 * thanh pho khong biet.
 */
import theGioiTho from '../../data/the_gioi.json';
import thangTho from '../../data/victory.json';
import bangGiap from '../../data/armor_table.json';
import donVi from '../../data/units.json';
import tranTho from '../../data/battle.json';
import tinhTho from '../../data/provinces.json';
import nuocTho from '../../data/nations.json';
import { docDuLieuTran, type DuLieuTran } from '../sim/campaign/Battle';
import { dungBanDoTinh, type BanDoTinh } from '../sim/campaign/BanDoTinh';
import { TheGioi } from '../sim/campaign/TheGioi';
import { docTheGioi } from '../sim/campaign/TheGioiData';

export interface TheGioiGame {
  readonly tg: TheGioi;
  readonly banDo: BanDoTinh;
}

export function dungTheGioi(): TheGioiGame {
  const tran: DuLieuTran = docDuLieuTran(bangGiap, donVi, tranTho);
  const banDo: BanDoTinh = dungBanDoTinh(tinhTho, nuocTho);
  const du = docTheGioi(theGioiTho, thangTho, new Set(tran.doi.keys()));
  return { tg: new TheGioi(du, banDo, tran), banDo };
}
