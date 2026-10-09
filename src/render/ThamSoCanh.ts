/** Tham so URL va trang thai cho may chup cua canh thanh pho (tach khoi `CityScene.ts` cho file duoi tran 300 dong). */
import type { O } from '../sim/city/BanDo';
import type { ThanhPho } from '../sim/city/City';
import { trangThaiKhung } from './HieuUngDem';
import { phanXay } from './HieuUngXay';
import type { TrangThaiMan } from './Man';
import type { Ve } from './VeCanh';

/**
 * `?xay=<loai nha>` hay `?xay=kho` (Buoc 1, 04/10): thong doc xay ngay luc mo man, camera bay toi.
 * De chup anh, quay clip nha moc dan ma khong phai cho thong doc tu xay; kem `?xayTien=` (`HieuUngXay.ts`)
 * de ghim tung giai doan. Tra ve o vua xay, hay `undefined` khi khong co tham so hoac het cho.
 */
export function xayThu(tp: ThanhPho): O | undefined {
  const ten: string | null = new URLSearchParams(window.location.search).get('xay');
  if (ten === null || !(ten === 'kho' ? tp.xayKho() : tp.xayNha(ten))) return undefined;
  return tp.layOVuaDung();
}

/**
 * O dat camera luc mo man, lay tu `?o=a,b`. `undefined` thi de camera o giua ban do.
 *
 * Co tham so nay de may ao chup duoc DUNG cho mot toa nha va kiem xem no co that su hien
 * ra khong - truoc do chi doan bang mat tren anh toan canh.
 */
export function oBanDau(): O | undefined {
  const tho: string | null = new URLSearchParams(window.location.search).get('o');
  if (tho === null) return undefined;
  const [a, b] = tho.split(',').map(Number);
  if (a === undefined || b === undefined || !Number.isFinite(a) || !Number.isFinite(b)) {
    return undefined;
  }
  return { a, b };
}

/**
 * Zoom mo man, lay tu `?zoom=` neu co.
 *
 * Co tham so nay de may ao chup duoc anh o dung muc thu phong muon kiem, khong phai gia
 * bo cham hai ngon. Khong co thi lay so trong JSON.
 */
export function zoomBanDau(macDinh: number): number {
  const tho: string | null = new URLSearchParams(window.location.search).get('zoom');
  const z: number = tho === null ? Number.NaN : Number(tho);
  return Number.isFinite(z) && z > 0 ? z : macDinh;
}

/**
 * `window.__qc.trangThai()` cua thanh pho (`src/main.ts`). Doc tu khung VUA VE - gio theo `?gio=`, nha dang
 * moc theo `?xayTien=` - chu khong tu sim tran, de bat "man hinh khac mo phong".
 */
export function trangThaiThanhPho(
  ve: Ve | undefined, tp: ThanhPho, doi: string, zoom: number, theMo: boolean,
): TrangThaiMan {
  if (ve === undefined) return { man: 'thanh-pho' };
  const dem = trangThaiKhung(ve.nhipSim);
  return {
    man: 'thanh-pho',
    gio: Number(dem.gio.toFixed(1)),
    doToi: Number(dem.dem.toFixed(2)),
    doi,
    soNha: tp.soNha,
    nhaDangXay: tp.banDo.vat.filter((v) => phanXay(ve, v) !== undefined).length,
    nguoiVac: tp.doiWalker.so,
    nhipSim: tp.dongHo.soNhip,
    sprite: ve.dem,
    zoom: Number(zoom.toFixed(2)),
    theMo,
  };
}
