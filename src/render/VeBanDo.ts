/**
 * Ve lop chien dich: 196 hex, vat dia hinh, cong trinh tinh va co hieu.
 *
 * Khac lop thanh pho o mot cho: luoi la LUC GIAC nen khong quet duoc theo duong cheo
 * `a + b`. Moi khung gom het muc ve vao mot mang roi xep theo truc sau `x + z` - 196 hex
 * cho khoang 400-600 muc, xep lai moi khung khong dang ke so voi vai tram walker cua
 * `VeCanh.ts` da xep san.
 */
import { hexX, hexY, truocSau } from './HexIso';
import type { Ve } from './VeCanh';
import type { BanDoTinh, OTinh, Tinh } from '../sim/campaign/BanDoTinh';
import type { ChienDich, CongTrinh } from '../sim/campaign/ChienDich';

/** Mot muc cho ve trong khung nay. */
interface Muc {
  readonly sau: number;
  readonly x: number;
  readonly y: number;
  readonly ten: string;
}

/** Co hieu dat lech sang phai bao nhieu phan mot o nen, de khong lut vao mai thanh. */
const CO_LECH_X = 0.75;

/**
 * Ve ca ban do.
 *
 * @param oChon O dang duoc soi (`<tinhId>#<oXay>`), chuoi rong la khong soi gi. O duoc soi
 *              ve them mot manh dat trong ben duoi cho de nhin ra.
 */
export function veBanDoTinh(ve: Ve, banDo: BanDoTinh, cd: ChienDich, oChon: string): void {
  const oPx: number = ve.atlas.oPx();
  const muc: Muc[] = [];

  for (const t of banDo.tinh) {
    for (let i = 0; i < t.o.length; i += 1) {
      const o: OTinh = t.o[i] as OTinh;
      const x: number = hexX(o.hex, oPx);
      const y: number = hexY(o.hex, oPx);
      const sau: number = truocSau(o.hex);
      muc.push({ sau, x, y, ten: o.nen });
      if (o.vat !== '') muc.push({ sau: sau + 0.01, x, y, ten: o.vat });

      const tren: string = tenTren(t, o, i, cd, oChon);
      if (tren !== '') muc.push({ sau: sau + 0.02, x, y, ten: tren });
      if (i === 0 && t.mau !== '') {
        muc.push({ sau: sau + 0.03, x: x + oPx * CO_LECH_X, y, ten: `co_${t.mau}` });
      }
    }
  }

  muc.sort((a: Muc, b: Muc): number => a.sau - b.sau);
  for (const m of muc) datSprite(ve, m.x, m.y, m.ten);
}

/**
 * Sprite dat TREN mot o hex, ngoai lop nen va vat dia hinh.
 *
 * O thu phu (i = 0): thu do la toa thanh, tinh thuong la nha lon, tinh trung lap la ruong.
 * O xay dung: trong thi la manh dat, dang xay la gian giao, xay xong la cong trinh mang
 * mau phe. Tinh trung lap chua co phe nen o xay cua no luon la manh dat - goi KayKit
 * khong co nha mau trung lap, chi co tuong, cau, gian giao va ruong.
 */
function tenTren(t: Tinh, o: OTinh, i: number, cd: ChienDich, oChon: string): string {
  if (i === 0) {
    if (t.mau === '') return 'ruong';
    return t.thuDo ? `thanh_${t.mau}` : `nha_${t.mau}`;
  }
  if (o.oXay < 0) return '';

  const tt = cd.oCua(t.id, o.oXay);
  if (tt.dangXay !== '') return 'gian_giao';
  if (tt.congTrinh !== '') {
    const c: CongTrinh | undefined = cd.xayDuocGi(t.id).find((x) => x.id === tt.congTrinh);
    if (c === undefined || t.mau === '') return 'dat_trong';
    return `${c.sprite}_${t.mau}`;
  }
  // O trong: chi ve manh dat o tinh CUA MINH. Ve het 143 o xay cua ca ban do thi ca vung
  // thanh mot mang nau, khong con nhin ra dau la dat minh xay duoc - da chup thu 11/09.
  if (t.nuoc !== cd.nuocCuaTa()) return '';
  return oChon === `${t.id}#${String(o.oXay)}` ? 'gian_giao' : 'dat_trong';
}

/** Xep mot sprite vao lo, neo tai toa do the gioi `(x, y)`. Ngoai man thi bo qua. */
function datSprite(ve: Ve, x: number, y: number, ten: string): void {
  if (!ve.atlas.co(ten)) return;
  const s = ve.atlas.o(ten);
  const x0: number = (x - s.ox - ve.camX) * ve.tiLe + ve.rongDev / 2;
  const y0: number = (y - s.oy - ve.camY) * ve.tiLe + ve.caoDev / 2;
  const rong: number = s.w * ve.tiLe;
  const cao: number = s.h * ve.tiLe;
  if (x0 + rong < 0 || x0 > ve.rongDev || y0 + cao < 0 || y0 > ve.caoDev) return;
  const [u0, v0, u1, v1] = ve.atlas.uv(s);
  ve.gl.them(s.trang, x0, y0, rong, cao, u0, v0, u1, v1);
  ve.dem += 1;
}
