/**
 * Cham thang vao mot cong trinh tren canh thanh pho la hien ten no.
 *
 * Chu du an chot 11/09: "bam vao cong trinh nao se tu hien ten ra". Truoc do chi bam qua
 * bang cong trinh moi biet ten, ma bang thi liet ke theo LOAI - nhin thay mot mai nha la
 * vay giua pho thi khong tra nguoc ra duoc no la cai gi.
 *
 * File rieng vi `CityScene.ts` da sat tran 300 dong cua CLAUDE.md.
 */
import { vatTaiDiem, type Ve } from './VeCanh';
import type { Ghim } from '../ui/Ghim';
import type { BanDo, OVat } from '../sim/city/BanDo';
import type { ThanhPho } from '../sim/city/City';

/** Cham di qua bao nhieu diem anh thi tinh la KEO ban do chu khong phai chon cong trinh. */
const NGUONG_CHAM = 10;
/** Cham lau hon bao nhieu mili giay thi khong tinh la chon nua. */
const NGUONG_GIAY = 500;

/**
 * Noi lop nghe cham vao `canvas`.
 *
 * `Camera` da bat `pointerdown` de keo ban do; lop nay bat them chi de phan biet CHAM voi
 * KEO - khong phan biet thi moi lan keo xong lai ghim nham mot cong trinh.
 *
 * @param layVe Tra ve `Ve` cua khung vua ve xong, de do hop bao sprite dung muc thu phong
 *              hien tai. Chua ve khung nao thi tra `undefined` va cham bi bo qua.
 */
export function noiChamChon(
  canvas: HTMLCanvasElement,
  layVe: () => Ve | undefined,
  banDo: BanDo,
  tp: ThanhPho,
  ghim: Ghim,
  dpr: () => number,
): void {
  let batDau: { x: number; y: number; luc: number } | undefined;

  canvas.addEventListener('pointerdown', (e: PointerEvent) => {
    batDau = { x: e.clientX, y: e.clientY, luc: performance.now() };
  });
  canvas.addEventListener('pointerup', (e: PointerEvent) => {
    const d = batDau;
    batDau = undefined;
    if (d === undefined) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > NGUONG_CHAM) return;
    if (performance.now() - d.luc > NGUONG_GIAY) return;
    cham(e.clientX, e.clientY);
  });

  function cham(cssX: number, cssY: number): void {
    const ve: Ve | undefined = layVe();
    if (ve === undefined) return;
    const ten: ReadonlyMap<string, string> = tenTheoO(tp);
    const khung: DOMRect = canvas.getBoundingClientRect();
    const v: OVat | undefined = vatTaiDiem(
      ve, banDo,
      (cssX - khung.left) * dpr(), (cssY - khung.top) * dpr(),
      (t: OVat) => ten.has(khoaO(t.a, t.b)),
    );
    if (v === undefined) {
      ghim.xoa();
      return;
    }
    ghim.dat({ a: v.a, b: v.b }, ten.get(khoaO(v.a, v.b)) ?? v.ten);
  }
}

/**
 * Bang o -> ten hien cua cong trinh dung o do.
 *
 * Tra theo O chu khong theo ten sprite: nhieu loai nha dung chung mot hinh
 * (`data/buildings.json`), doi nguoc tu sprite ra ten la ra nham loai. Dung lai bang moi
 * lan cham - thong doc van dang xay them nha, va vai tram muc thi khong dang ke.
 */
function tenTheoO(tp: ThanhPho): ReadonlyMap<string, string> {
  const bang = new Map<string, string>();
  for (const def of tp.dsNha) {
    for (const o of tp.viTriNha(def.ten)) bang.set(khoaO(o.a, o.b), def.hien);
  }
  return bang;
}

function khoaO(a: number, b: number): string {
  return `${String(a)},${String(b)}`;
}
