/**
 * Xay them nha va kho **luc dang chay** - phan viec cua thong doc (Phase 5).
 *
 * Tach khoi `City.ts` vi hai ly do: file do da sat tran 300 dong, va ba viec o day deu
 * la ham thuan tuy tren ban do - test duoc rieng, khong can dung ca thanh pho.
 */
import type { Rng } from '../../core/Rng.ts';
import type { BanDo, O } from './BanDo.ts';
import { chenVat, congRaDuong } from './BanDo.ts';
import type { QuyHoach, SoDat } from './QuyHoach.ts';
import { datNha } from './QuyHoach.ts';
import { cuaThanh } from './Nen.ts';
import type { DinhNghiaNha } from './Buildings.ts';
import { ThuNha } from './Buildings.ts';

/**
 * Dat sprite danh dau mot kho, ngay canh nga tu co kho.
 *
 * Khong dat DUNG o nga tu vi o do la duong: de sprite len duong thi nguoi vac hang di
 * xuyen qua no. O cheo (a+1, b+1) chac chan khong phai duong khi `duongCach > 2`.
 *
 * Ghi o vao `daChiem` luon: tu Phase 6B nha kinh te cung hien ra man hinh, khong danh dau
 * thi mot cai nha se moc dung len chong thung hang cua kho.
 */
export function veKho(banDo: BanDo, o: O): void {
  if (banDo.spriteKho === '') return;
  banDo.daChiem.add((o.a + 1) * banDo.canh + (o.b + 1));
  chenVat(banDo, { a: o.a + 1, b: o.b + 1, ten: banDo.spriteKho, o: 1 });
}

/**
 * Cho dat kho moi: uu tien CUA THANH, het cua thi lay nga tu xa cac kho cu nhat.
 *
 * Hai luat, theo dung thu tu:
 *
 * 1. **Cua thanh truoc** - cho truc duong chinh cat qua duong vien giua hai vanh. Tu
 *    10/09 thanh pho chia vanh theo chuc nang nen hang phai chay tu vanh nay sang vanh
 *    kia; kho nam ngay cua thi moi chang duong chi dai bang nua khoang cach hai vanh.
 *    Trong bon cua chua dung, lay cai XA cac kho cu nhat de kho khong don ve mot phia.
 * 2. **Het cua thi quay ve luat cu** - nga tu xa cac kho cu nhat.
 *
 * Vi sao khong dung mot minh luat cu: tren ban do vuong, cho xa nhat luon la BON GOC. Ban
 * ve quy hoach 10/09 cho thay ba kho nam ba goc con nua phia nam va phia dong khong co kho
 * nao - chu du an nhin ban ve la thay ngay.
 *
 * Tra ve `undefined` khi moi nga tu deu da co kho.
 */
export function choKhoMoi(banDo: BanDo, cu: readonly O[], qh?: QuyHoach): O | undefined {
  const c: number = banDo.duongCach;
  const xaNhat = (a: number, b: number): number => {
    let gan = Number.MAX_SAFE_INTEGER;
    for (const k of cu) gan = Math.min(gan, Math.abs(k.a - a) + Math.abs(k.b - b));
    return gan;
  };

  if (qh !== undefined) {
    let cua: O | undefined;
    let xa = 0;
    for (const o of cuaThanh(qh)) {
      const d: number = xaNhat(o.a, o.b);
      // `d === 0` la cua da co kho roi.
      if (d > xa) {
        xa = d;
        cua = o;
      }
    }
    if (cua !== undefined && xa > 0) return cua;
  }

  let tot: O | undefined;
  let xa = 0;
  // Chi xet nga tu KHONG sat mep: kho o goc ban do thi nua so nha van phai di het chieu ngang.
  for (let a = c; a <= banDo.canh - 1 - c; a += c) {
    for (let b = c; b <= banDo.canh - 1 - c; b += c) {
      const d: number = xaNhat(a, b);
      if (d > xa) {
        xa = d;
        tot = { a, b };
      }
    }
  }
  return tot;
}

/**
 * Dung mot nha moi tren o trong sat duong. `undefined` khi ban do da chat.
 *
 * Nha moi vao van SAN mot chuyen hang giong luc mo van: khong thi no dung im ca chuc phut
 * game cho nguoi dau tien di bo tu kho ve, va bang so nhin nhu thong doc xay hong.
 *
 * Dat sprite ngay tai day chu khong de nguoi goi lam: day la nha thong doc xay luc dang
 * chay, tuc dung cai nguoi choi vua bam tren the quyet dinh. Quen chen thi bam "xay hai
 * coi xay" xong tren man khong co gi moc len - dung cai loi ma Phase 6B di chua.
 */
export function dungNha(
  def: DinhNghiaNha, chiSo: number, banDo: BanDo, rng: Rng,
  tranRieng: number, moiChuyen: number, quyHoach: QuyHoach, soDat: SoDat,
): ThuNha | undefined {
  // Nha thong doc xay cung phai vao dung khu quy hoach, khong thi mo may lai roi rac.
  const o: O | undefined = datNha(banDo, rng, quyHoach, def, soDat);
  if (o === undefined) return undefined;
  const nha = new ThuNha(
    def, chiSo, chiSo % def.nhip, o, congRaDuong(o, banDo.duongCach), tranRieng,
  );
  for (const m of def.vao) nha.nhan(m.hang, moiChuyen);
  chenVat(banDo, { a: o.a, b: o.b, ten: def.sprite, o: 1 });
  return nha;
}
