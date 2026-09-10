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
import { datNha, xaVien } from './QuyHoach.ts';
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
 * Nga tu XA cac kho cu nhat va BAM RANH GIOI giua hai vanh - cho dat kho moi.
 *
 * Xa nhat chu khong ngau nhien: ca thanh pho do ve mot kho thi truc vao tam dong nghit
 * ma duong ria vang tanh. Kho moi phai keo duoc mot phan dong nguoi do sang huong khac.
 *
 * Bam ranh gioi la cho quan trong hon. Tu 10/09 thanh pho chia vanh dong tam theo chuc
 * nang, nen hang phai chay tu vanh nay sang vanh kia: lua mi tu vanh nong nghiep vao coi
 * xay o vanh san xuat, banh mi tu do vao nha dan o long thanh. Kho nam giua hai vanh thi
 * moi chang duong chi dai bang NUA khoang cach hai vanh. Do duoc: kho rai deu khap ban do
 * cho 238.172 chuyen mot gio, kho bam ranh gioi cho hon han - xem `docs/NHAT_KY`.
 *
 * Nga tu nam o boi cua 8 ma duong vien nam o toa do le, nen khong bao gio trung khop tuyet
 * doi - vi vay tru dan theo do lech chu khong doi hoi trung khit.
 *
 * Tra ve `undefined` khi moi nga tu deu da co kho.
 */
const HE_SO_VIEN = 4;

export function choKhoMoi(banDo: BanDo, cu: readonly O[], qh?: QuyHoach): O | undefined {
  const c: number = banDo.duongCach;
  let tot: O | undefined;
  let diemTot = -Infinity;
  // Chi xet nga tu KHONG sat mep: kho o goc ban do thi nua so nha van phai di het chieu ngang.
  for (let a = c; a <= banDo.canh - 1 - c; a += c) {
    for (let b = c; b <= banDo.canh - 1 - c; b += c) {
      let gan = Number.MAX_SAFE_INTEGER;
      for (const k of cu) gan = Math.min(gan, Math.abs(k.a - a) + Math.abs(k.b - b));
      // Tru dan theo do lech khoi vien, KHONG cong mot mon thuong lon: thuong lon thi moi
      // nga tu bam vien deu thang, va cai xa cac kho cu nhat lai la BON GOC ban do - noi
      // te nhat de dat kho. Tru dan thi vua bam vien vua con rai deu.
      const diem: number = gan - (qh === undefined ? 0 : HE_SO_VIEN * xaVien(qh, a, b));
      if (diem > diemTot) {
        diemTot = diem;
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
