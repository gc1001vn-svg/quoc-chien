/**
 * Noi lop the gioi vao man thanh pho (Phase 11B): moi gio game thanh pho chot xong thi the
 * gioi cung qua mot gio, dung so that cua thanh pho (`NoiThanhPho.ts`). The bat on hien
 * bang cung tam chan voi the quyet dinh - dung sim luc hien, tra lai toc do cu.
 *
 * Gan SAU `thanhPho.moDau()`: `sim:van` cung bat dau dem gio the gioi sau phan mo dau.
 */
import type { ThanhPho, ThongDoc } from '../sim/city/City';
import type { DongHo } from '../sim/Clock';
import type { Meta } from '../sim/meta/Meta';
import { chonBatOn } from '../sim/campaign/HanhDong';
import { theBatOn } from '../sim/campaign/HienTheGioi';
import { soNuocTa } from '../sim/campaign/NoiThanhPho';
import type { TheQuyetDinh } from './DecisionCard';
import type { TheGioiGame } from './DungTheGioi';
import { ThanhTheGioi } from './ThanhTheGioi';

export type { TheGioiGame } from './DungTheGioi';

export interface TheGioiTrenThanhPho {
  /** Goi moi khung. */
  capNhat(): void;
}

export function noiTheGioi(
  goc: HTMLElement, the: TheGioiGame, thanhPho: ThanhPho, meta: Meta, van: ThongDoc, dongHo: DongHo, theUi: TheQuyetDinh,
): TheGioiTrenThanhPho {
  const tg = the.tg;
  thanhPho.datThongDoc({
    moiGio: (): void => {
      van.moiGio();
      tg.gioTiep(soNuocTa(thanhPho, meta, tg.du.batOn.hangLuongThuc));
    },
  });
  const thanh = new ThanhTheGioi(goc, tg, the.banDo, the.tenDoi);
  return {
    capNhat: (): void => {
      // Het van thi dung han dong ho - man ket che ca man, chay tiep chi ton pin.
      if (tg.ketQua.trangThai !== 'dang_choi') dongHo.tocDo = 0;
      else if (tg.batOn.theMo && !theUi.hien) {
        const b = theBatOn(tg);
        theUi.hienThe({
          van: `Dân bất ổn ${String(b.chiSo)}/${String(b.nguongSup)} — còn ${String(b.gioConNoiLoan)} giờ nữa là nổi loạn, mất một tỉnh.`,
          chon: b.luaChon.map((l) => ({ id: l.id, van: l.ten, loi: l.nut.duoc ? l.moTa : `${l.moTa} · ${l.nut.lyDo}`, khoa: !l.nut.duoc })),
        }, (lc) => { chonBatOn(tg, lc.id); });
      }
      thanh.capNhat();
    },
  };
}
