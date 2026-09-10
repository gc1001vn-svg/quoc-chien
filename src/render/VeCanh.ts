/**
 * Hai vong ve cua canh thanh pho, tach khoi `CityScene` cho khoi cham tran 300 dong.
 *
 * HAI LUAT VE, chot o TECH_SPEC muc 3:
 *
 * 1. VE HET LOP NEN TRUOC, ROI MOI TOI LOP VAT THE. Bong do duoc nuong san vao sprite nen
 *    no tho ra khoi o cua minh; tron hai lop lai roi xep chung theo truc sau thi o nen
 *    phia sau se de len bong cua nha phia truoc va bong bien mat.
 * 2. Trong moi lop, xep theo truc sau `a + b`, khong xep lai theo trang atlas. Bo ve nap
 *    ca hai trang cung luc nen doi trang khong ton them lenh ve (xem `Shader.ts`).
 */
import { neoX, neoY, type VungO } from './IsoMath';
import type { Atlas } from './Atlas';
import type { Gl } from './Gl';
import type { BanDo, O } from '../sim/city/BanDo';
import type { ThanhPho } from '../sim/city/City';
import type { Walker } from '../sim/city/Walkers';

/** Moi thu can de ve mot khung hinh, gom lai cho khoi truyen tam bien. */
export interface Ve {
  readonly gl: Gl;
  readonly atlas: Atlas;
  readonly rongDev: number;
  readonly caoDev: number;
  /** Diem anh khung ve tren mot don vi the gioi. */
  readonly tiLe: number;
  camX: number;
  camY: number;
  dem: number;
}

/** Hop bao cua mot sprite tren man, tinh bang diem anh khung ve. */
export interface Hop {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

/** Cong trinh dang duoc soi: cai gi dung truoc no va trum len no thi tam giau di. */
export interface Muc {
  /** Truc sau cua muc. Chi vat co truc sau LON HON moi che duoc no. */
  readonly sau: number;
  readonly hop: Hop;
}

/** Hop bao cua sprite `ten` dat tai o `(a,b)`. `undefined` neu atlas khong co sprite do. */
function hopSprite(ve: Ve, a: number, b: number, ten: string): Hop | undefined {
  if (!ve.atlas.co(ten)) return undefined;
  const s = ve.atlas.o(ten);
  const oPx: number = ve.atlas.oPx();
  const x: number = (neoX(a, b, oPx) - s.ox - ve.camX) * ve.tiLe + ve.rongDev / 2;
  const y: number = (neoY(a, b, oPx) - s.oy - ve.camY) * ve.tiLe + ve.caoDev / 2;
  return { x0: x, y0: y, x1: x + s.w * ve.tiLe, y1: y + s.h * ve.tiLe };
}

/**
 * Do dac cong trinh o `o` de biet cai gi dang che no.
 *
 * Tra `undefined` khi khong co vat the nao dung o do - khong con gi de soi.
 */
export function doMuc(ve: Ve, banDo: BanDo, o: O): Muc | undefined {
  const v = banDo.vat.find((t) => t.a === o.a && t.b === o.b);
  if (v === undefined) return undefined;
  const hop: Hop | undefined = hopSprite(ve, v.a, v.b, v.ten);
  if (hop === undefined) return undefined;
  return { sau: v.a + v.b + 2 * (v.o - 1), hop };
}

/** Hai hop co dam vao nhau khong. */
function trum(p: Hop, q: Hop): boolean {
  return p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1;
}

/**
 * Ve lop nen, di theo tung DUONG CHEO `a + b` tang dan.
 *
 * Di theo duong cheo chu khong theo hang: o nen co be day va co bong, o nao `a + b` nho
 * hon thi o phia xa va phai ve truoc. Quet theo hang `a` roi `b` se ve o (1,0) sau o (0,2)
 * du (1,0) o phia xa hon - sai thu tu de.
 *
 * `vungONhinThay` tra ve hop bao rong hon vung that khoang gap doi, nen tung o van phai
 * loai lai bang `datSprite` - khong loai la vuot tran 1.500 sprite luc thu nho.
 */
export function veLopNen(ve: Ve, banDo: BanDo, vung: VungO): void {
  const canh: number = banDo.canh;
  for (let s = vung.aMin + vung.bMin; s <= vung.aMax + vung.bMax; s += 1) {
    const dau: number = Math.max(vung.aMin, s - vung.bMax);
    const cuoi: number = Math.min(vung.aMax, s - vung.bMin);
    for (let a = dau; a <= cuoi; a += 1) {
      const ten: string | undefined = banDo.nen[a * canh + (s - a)];
      if (ten !== undefined) datSprite(ve, a, s - a, ten);
    }
  }
}

/**
 * Ve lop vat the VA nguoi vac hang, tron chung mot dong xep theo truc sau.
 *
 * Ve nguoi thanh mot lop rieng sau nha thi ho **di xuyen nha**: nguoi dung sau mai nha van
 * hien len tren mai. Da bi mot lan, chu du an nhin ra ngay. Nha da xep san luc sinh ban do;
 * nguoi doi cho moi nhip nen phai xep lai moi khung - vai tram phan tu, khong dang ke.
 *
 * Do sau cua khoi nha lay o GOC TRUOC (`a + b + 2*(o-1)`), giong luc sinh ban do.
 *
 * `muc` co gia tri thi mo LO cong trinh do: moi vat dung TRUOC no va trum len no bi bo
 * qua mot khung. Khong co buoc nay thi mot cai gieng cao 2,4 hang o nam sau day nha dan
 * cao 5,6 hang la khong bao gio nhin thay - chu du an bao "khong thay gi" nam lan lien.
 */
export function veLopVat(
  ve: Ve, banDo: BanDo, veNha: boolean, tp: ThanhPho | undefined, muc?: Muc,
): void {
  const nguoi: readonly Walker[] = tp === undefined
    ? []
    : [...tp.doiWalker.danhSach].sort((m, n) => m.a + m.b - (n.a + n.b));

  let i = 0;
  if (veNha) {
    for (const v of banDo.vat) {
      const sau: number = v.a + v.b + 2 * (v.o - 1);
      while (i < nguoi.length && (nguoi[i] as Walker).a + (nguoi[i] as Walker).b <= sau) {
        const w = nguoi[i] as Walker;
        datSprite(ve, w.a, w.b, spriteWalker(w));
        i += 1;
      }
      if (muc !== undefined && sau > muc.sau && cheMuc(ve, v.a, v.b, v.ten, muc)) continue;
      datSprite(ve, v.a, v.b, v.ten);
    }
  }
  for (; i < nguoi.length; i += 1) {
    const w = nguoi[i] as Walker;
    datSprite(ve, w.a, w.b, spriteWalker(w));
  }
}

/** Sprite `ten` o `(a,b)` co trum len muc dang soi khong. */
function cheMuc(ve: Ve, a: number, b: number, ten: string, muc: Muc): boolean {
  const hop: Hop | undefined = hopSprite(ve, a, b, ten);
  return hop !== undefined && trum(hop, muc.hop);
}

/**
 * Ten sprite cua mot nguoi vac hang: `nguoi_<kieu>_<huong>_<dang>`.
 *
 * Hai dang thay phien nhau theo so buoc da di, nen chan doi ben moi lan sang o moi -
 * khong the thi nguoi truot tren duong nhu keo mot mieng bia.
 */
function spriteWalker(w: Walker): string {
  const kieu: string = w.kieu === 0 ? 'nam' : 'nu';
  return `nguoi_${kieu}_${String(w.huong)}_${String(w.buoc % 2)}`;
}

/**
 * Xep mot sprite vao lo ve, neu no con dinh man hinh.
 *
 * Loai o day chu khong o cho khac vi toa do man hinh dang sao cung phai tinh - phep so
 * sanh them gan nhu khong ton gi, ma cat duoc mot nua so sprite.
 */
function datSprite(ve: Ve, a: number, b: number, ten: string): void {
  const hop: Hop | undefined = hopSprite(ve, a, b, ten);
  if (hop === undefined) return;
  if (hop.x1 < 0 || hop.x0 > ve.rongDev || hop.y1 < 0 || hop.y0 > ve.caoDev) return;
  const s = ve.atlas.o(ten);
  const [u0, v0, u1, v1] = ve.atlas.uv(s);
  ve.gl.them(s.trang, hop.x0, hop.y0, hop.x1 - hop.x0, hop.y1 - hop.y0, u0, v0, u1, v1);
  ve.dem += 1;
}
