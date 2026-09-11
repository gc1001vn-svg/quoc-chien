/**
 * Man ban do tinh - viec chinh cua Phase 7.
 *
 * Lop chien dich chay nhip RIENG, cham hon han lop thanh pho: mot luot bang
 * `giay_moi_luot` giay that (`data/provinces.json`), trong khi thanh pho chay 10 nhip mot
 * giay. Hai lop khong dung chung dong ho va chua dung chung kho hang - noi chung lai la
 * viec cua Phase 9 tro di.
 *
 * Phan ve nam o `VeBanDo.ts`, phan bang o `ui/BangTinh.ts`; file nay lo dung canh, camera
 * va viec cham chon o.
 */
import tinhTho from '../../data/provinces.json';
import nuocTho from '../../data/nations.json';
import nhaTinhTho from '../../data/prov_buildings.json';
import {
  dungBanDoTinh,
  type BanDoTinh,
  type CauHinhBanDoTinh,
  type OTinh,
  type Tinh,
} from '../sim/campaign/BanDoTinh';
import { ChienDich, docCongTrinh } from '../sim/campaign/ChienDich';
import { khoa, type OHex } from '../sim/campaign/Hex';
import { BangTinh } from '../ui/BangTinh';
import { Perf } from '../core/Perf';
import { PHIEN_BAN } from '../PhienBan';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import { Camera } from './Camera';
import { Gl } from './Gl';
import { hexTaiDiem, hexX, hexY } from './HexIso';
import type { Man } from './Man';
import { veBanDoTinh } from './VeBanDo';
import type { Ve } from './VeCanh';

const CAU_HINH: CauHinhBanDoTinh = tinhTho;
/** Suc chua buffer. 196 hex cho khoang 600 muc ve, de rong ra cho thoai mai. */
const SUC_CHUA = 2048;
/** Cham di qua bao nhieu diem anh thi tinh la KEO ban do chu khong phai chon o. */
const NGUONG_CHAM = 10;
/** Cham lau hon bao nhieu mili giay thi khong tinh la chon nua. */
const NGUONG_GIAY = 500;

/** Mo man ban do tinh trong `goc`. Man bat dau o trang thai AN. */
export async function chayCanhBanDo(goc: HTMLElement): Promise<Man> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const perf: Perf = new Perf(goc);

  const bo: BoAtlas = await taiBoAtlas('hex_1', coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  const banDo: BanDoTinh = dungBanDoTinh(CAU_HINH, nuocTho);
  const cd = new ChienDich(banDo, docCongTrinh(nhaTinhTho));

  // Camera cua `Camera.ts` kep tam vao mot HINH THOI tam `(0, W/2)`, ban truc `W` va `W/2`.
  // Ban do hex khong nam san trong hinh thoi do, nen do hop bao that roi DICH ca ban do
  // vao giua - dich bang `lech`, khong sua `Camera`.
  const hop = hopBanDo(banDo, atlas.oPx());
  const W: number = hop.rong / 2 + hop.cao;
  const lechX: number = -(hop.x0 + hop.x1) / 2;
  const lechY: number = W / 2 - (hop.y0 + hop.y1) / 2;
  const cam: Camera = new Camera(
    atlas.heSo(), (2 * W) / atlas.oPx() + 1, atlas.oPx(),
    CAU_HINH.zoomMin, CAU_HINH.zoomMax, CAU_HINH.zoomDau,
  );
  cam.noiVao(canvas);

  let oChon = '';
  const bang = new BangTinh(goc, cd, () => { oChon = ''; });

  let rongCss = 1;
  let caoCss = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    cam.datKichThuoc(goc.clientWidth, goc.clientHeight);
    rongCss = goc.clientWidth;
    caoCss = goc.clientHeight;
  };
  window.addEventListener('resize', doKichThuoc);

  // Camera da bat `pointerdown` de keo; day la mot lop nghe rieng chi de phan biet CHAM
  // (chon o) voi KEO (di ban do). Khong phan biet thi moi lan keo xong lai mo bang.
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
    chonTaiDiem(e.clientX, e.clientY);
  });

  /** Doi diem cham tren man thanh o hex, roi mo bang tinh chua o do. */
  const chonTaiDiem = (cssX: number, cssY: number): void => {
    const khungNhin = cam.khung();
    const ti: number = cam.cssTrenWorld();
    const goc0: DOMRect = canvas.getBoundingClientRect();
    const wx: number = (khungNhin.x0 + khungNhin.x1) / 2 + (cssX - goc0.left - rongCss / 2) / ti - lechX;
    const wy: number = (khungNhin.y0 + khungNhin.y1) / 2 + (cssY - goc0.top - caoCss / 2) / ti - lechY;
    const h: OHex = hexTaiDiem(wx, wy, atlas.oPx());
    const idTinh: string | undefined = banDo.theoHex.get(khoa(h));
    if (idTinh === undefined) {
      oChon = '';
      bang.dong();
      return;
    }
    const t: Tinh = banDo.tinh.find((x) => x.id === idTinh) as Tinh;
    const o: OTinh | undefined = t.o.find((x) => x.hex.q === h.q && x.hex.r === h.r);
    const oXay: number = o?.oXay ?? -1;
    oChon = oXay >= 0 ? `${t.id}#${String(oXay)}` : '';
    bang.mo(t, oXay);
  };

  let truoc = 0;
  let donLuot = 0;
  let dangChay = false;
  let daCanZoom = false;

  /**
   * Lan dau mo man, dat muc thu phong vua khit BE NGANG ban do.
   *
   * `zoomDau` trong JSON chi la muc du phong: ban do tinh trai cheo rat dai, mot so cung
   * dung cho man ngang thi cam dung bi cat mat hai dau, va nguoc lai. Do khung that roi
   * tinh van chac hon doan.
   */
  const canZoomVuaKhung = (): void => {
    if (daCanZoom || rongCss <= 1) return;
    daCanZoom = true;
    // Hop `hopBanDo` chi tinh TAM cac hex; sprite tran ra khoi tam bao xa thi hoi atlas
    // (`bienDo`) - toa thanh cao gan bon o luoi va neo lech han sang trai, uoc bang tay
    // la thieu, da chup thay hai lan.
    const bien = atlas.bienDo();
    const canRong: number = hop.rong + bien.trai + bien.phai;
    const canCao: number = hop.cao + bien.tren + bien.duoi;
    const vua: number = Math.min(rongCss / canRong, caoCss / canCao);
    cam.datZoom(atlas.heSo() * vua);
    // Tam ngam lech theo dung nua do lech cua hop sprite, de le hai ben bang nhau.
    cam.datTam((bien.phai - bien.trai) / 2, W / 2 + (bien.duoi - bien.tren) / 2);
  };

  const veMotKhung = (now: number): void => {
    if (!dangChay) return;
    perf.danhDau(now);

    // Nhip chien dich: don giay that lai, du `giay_moi_luot` thi chay mot luot. Giu phan
    // le trong `donLuot` - lam tron moi khung thi o 60 fps khong bao gio du mot luot.
    const giay: number = truoc === 0 ? 0 : (now - truoc) / 1000;
    truoc = now;
    donLuot += Math.min(giay, 1);
    while (donLuot >= CAU_HINH.giay_moi_luot) {
      donLuot -= CAU_HINH.giay_moi_luot;
      cd.nhip();
    }

    const khungNhin = cam.khung();
    const ve: Ve = {
      gl, atlas, rongDev: rongCss * gl.tiLeDiemAnh(), caoDev: caoCss * gl.tiLeDiemAnh(),
      tiLe: gl.tiLeDiemAnh() * cam.cssTrenWorld(),
      camX: (khungNhin.x0 + khungNhin.x1) / 2 - lechX,
      camY: (khungNhin.y0 + khungNhin.y1) / 2 - lechY,
      dem: 0,
    };

    gl.batDauKhung();
    veBanDoTinh(ve, banDo, cd, oChon);
    const lenhVe: number = gl.ketThucKhung();
    perf.datGhiChu(
      `${PHIEN_BAN} · map · lượt ${String(cd.luot())} · ${String(ve.dem)} sprite`
      + ` · ${String(lenhVe)} lệnh vẽ · ${cam.zoom().toFixed(2)}×`,
    );
    requestAnimationFrame(veMotKhung);
  };

  // `?tinh=1` mo san bang tinh cho o xay dau tien cua thu do nuoc ta - de may ao chup
  // duoc bang ma khong phai gia bo cham tay, giong `?bang=1` cua bang cong trinh.
  if (new URLSearchParams(window.location.search).get('tinh') === '1') {
    const thuDo: Tinh | undefined = banDo.tinh.find(
      (t) => t.thuDo && t.nuoc === cd.nuocCuaTa(),
    );
    if (thuDo !== undefined) {
      oChon = `${thuDo.id}#0`;
      bang.mo(thuDo, 0);
    }
  }

  goc.hidden = true;
  return {
    hien: (): void => {
      goc.hidden = false;
      doKichThuoc();
      canZoomVuaKhung();
      truoc = 0;
      if (dangChay) return;
      dangChay = true;
      requestAnimationFrame(veMotKhung);
    },
    an: (): void => {
      dangChay = false;
      goc.hidden = true;
      bang.dong();
    },
  };
}

/** Hop bao cua ca ban do, tinh bang toa do the gioi (diem anh, chua nhan zoom). */
function hopBanDo(
  banDo: BanDoTinh, oPx: number,
): { x0: number; x1: number; y0: number; y1: number; rong: number; cao: number } {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const t of banDo.tinh) {
    for (const o of t.o) {
      const x: number = hexX(o.hex, oPx);
      const y: number = hexY(o.hex, oPx);
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
  return { x0, x1, y0, y1, rong: x1 - x0, cao: y1 - y0 };
}
