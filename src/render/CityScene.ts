/**
 * Canh thanh pho - viec chinh cua Phase 2.
 *
 * HAI LUAT VE, chot o TECH_SPEC muc 3:
 *
 * 1. VE HET LOP NEN TRUOC, ROI MOI TOI LOP VAT THE. Bong do duoc nuong san vao sprite nen
 *    no tho ra khoi o cua minh; tron hai lop lai roi xep chung theo truc sau thi o nen
 *    phia sau se de len bong cua nha phia truoc va bong bien mat. Da sap dung cai bay nay
 *    mot lan o `tools/xem_canh.mjs`.
 * 2. Trong moi lop, xep theo truc sau `a + b`, khong xep lai theo trang atlas. Bo ve nap
 *    ca hai trang cung luc nen doi trang khong ton them lenh ve (xem `Shader.ts`).
 *
 * Ket qua: ca thanh pho ton dung HAI lenh ve, tran la 4.
 */
import cauHinhTho from '../../data/thanh_pho_demo.json';
import hangTho from '../../data/wares.json';
import nhaTho from '../../data/buildings.json';
import chuoiTho from '../../data/chains.json';
import walkerTho from '../../data/walkers.json';
import chinhSachTho from '../../data/policy.json';
import { Governor } from '../sim/autoplay/Governor';
import { docChinhSach } from '../sim/autoplay/Policy';
import { Perf } from '../core/Perf';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import { Camera } from './Camera';
import { Gl } from './Gl';
import { neoX, neoY, vungONhinThay, type VungO } from './IsoMath';
import type { BanDo, CauHinhBanDo } from '../sim/city/BanDo';
import { ThanhPho } from '../sim/city/City';
import type { Walker } from '../sim/city/Walkers';
import { DongHo } from '../sim/Clock';

const CAU_HINH: CauHinhBanDo = cauHinhTho;

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

/** Duoi muc thu nho nay thi khong ve nguoi nua. Duong lui khi iPhone rot fps. */
const ZOOM_HIEN_WALKER = 0;
/** Suc chua buffer. Rong hon tran 5.000 mot chut de con dem duoc luc vuot. */
const SUC_CHUA = 6144;

/** Mo canh thanh pho trong `goc`. */
export async function chayCanhThanhPho(goc: HTMLElement): Promise<void> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const perf: Perf = new Perf(goc);

  // Nap JSON atlas TRUOC: so trang quyet dinh shader, phai biet roi moi dung duoc `Gl`.
  const bo: BoAtlas = await taiBoAtlas(CAU_HINH.me, coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  // Mo phong that chay ngay trong trinh duyet. Cung mot `src/sim/` ma `npm run sim:thu`
  // chay 10 gio game trong Node - khong co ban sao thu hai cua luat kinh te.
  const thanhPho: ThanhPho = new ThanhPho({
    hang: hangTho, nha: nhaTho, chuoi: chuoiTho, banDo: cauHinhTho, walker: walkerTho,
  });
  // Thong doc chay NGAY TU `moDau`: mo van ra la thanh pho da co kho thu hai va vai nha
  // moi, dung nhu bang so cua `npm run sim:thu`.
  thanhPho.datThongDoc(new Governor(thanhPho, docChinhSach(chinhSachTho)));
  thanhPho.moDau();
  const banDo: BanDo = thanhPho.banDo;
  const cam: Camera = new Camera(
    atlas.heSo(), CAU_HINH.canh, atlas.oPx(),
    CAU_HINH.zoomMin, CAU_HINH.zoomMax, zoomBanDau(),
  );
  cam.noiVao(canvas);

  let rongDev = 1;
  let caoDev = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    cam.datKichThuoc(goc.clientWidth, goc.clientHeight);
    rongDev = goc.clientWidth * gl.tiLeDiemAnh();
    caoDev = goc.clientHeight * gl.tiLeDiemAnh();
  };
  doKichThuoc();
  window.addEventListener('resize', doKichThuoc);

  // Sim chay 10 Hz, doc lap voi vong ve 60 fps (TECH_SPEC muc 2). PHAI di qua `DongHo`:
  // no giu phan le. Tu lam tron `giay * 10` thi o 60 fps moi khung ra 0,167 -> lam tron
  // thanh 0, va mo phong dung im MAI MAI trong khi ban ve van chay muot. Da bi mot lan.
  const nhipKe: DongHo = new DongHo();
  let truoc = 0;
  const veMotKhung = (now: number): void => {
    perf.danhDau(now);

    const giay: number = truoc === 0 ? 0 : (now - truoc) / 1000;
    truoc = now;
    thanhPho.chay(nhipKe.tien(giay));

    const ve: Ve = {
      gl, atlas, rongDev, caoDev,
      tiLe: gl.tiLeDiemAnh() * cam.cssTrenWorld(),
      camX: 0, camY: 0, dem: 0,
    };
    const khung = cam.khung();
    ve.camX = (khung.x0 + khung.x1) / 2;
    ve.camY = (khung.y0 + khung.y1) / 2;
    const vung: VungO = vungONhinThay(khung, atlas.oPx(), banDo.canh, atlas.bienDo());

    gl.batDauKhung();
    if (perf.dangBat('nen')) veLopNen(ve, banDo, vung);
    veLopVat(
      ve, banDo,
      perf.dangBat('nha'),
      perf.dangBat('nguoi') && cam.zoom() >= ZOOM_HIEN_WALKER ? thanhPho : undefined,
    );
    const lenhVe: number = gl.ketThucKhung();

    const canhBao: string = ve.dem > CAU_HINH.tranSprite ? ' ⚠ VƯỢT TRẦN' : '';
    perf.datGhiChu(
      `${String(ve.dem)} sprite · ${String(lenhVe)} lệnh vẽ · ${cam.zoom().toFixed(2)}×${canhBao}`,
    );
    requestAnimationFrame(veMotKhung);
  };
  requestAnimationFrame(veMotKhung);
}

/** Moi thu can de ve mot khung hinh, gom lai cho khoi truyen tam bien. */
interface Ve {
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
function veLopNen(ve: Ve, banDo: BanDo, vung: VungO): void {
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
 */
function veLopVat(ve: Ve, banDo: BanDo, veNha: boolean, tp: ThanhPho | undefined): void {
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
      datSprite(ve, v.a, v.b, v.ten);
    }
  }
  for (; i < nguoi.length; i += 1) {
    const w = nguoi[i] as Walker;
    datSprite(ve, w.a, w.b, spriteWalker(w));
  }
}

/**
 * Xep mot sprite vao lo ve, neu no con dinh man hinh.
 *
 * Loai o day chu khong o cho khac vi toa do man hinh dang sao cung phai tinh - phep so
 * sanh them gan nhu khong ton gi, ma cat duoc mot nua so sprite.
 */
function datSprite(ve: Ve, a: number, b: number, ten: string): void {
  if (!ve.atlas.co(ten)) return;
  const s = ve.atlas.o(ten);
  const oPx: number = ve.atlas.oPx();
  const x: number =
    (neoX(a, b, oPx) - s.ox - ve.camX) * ve.tiLe + ve.rongDev / 2;
  const y: number =
    (neoY(a, b, oPx) - s.oy - ve.camY) * ve.tiLe + ve.caoDev / 2;
  const rong: number = s.w * ve.tiLe;
  const cao: number = s.h * ve.tiLe;
  if (x + rong < 0 || x > ve.rongDev || y + cao < 0 || y > ve.caoDev) return;
  const [u0, v0, u1, v1] = ve.atlas.uv(s);
  ve.gl.them(s.trang, x, y, rong, cao, u0, v0, u1, v1);
  ve.dem += 1;
}

/**
 * Zoom mo man, lay tu `?zoom=` neu co.
 *
 * Co tham so nay de may ao chup duoc anh o dung muc thu phong muon kiem, khong phai gia
 * bo cham hai ngon. Khong co thi lay so trong JSON.
 */
function zoomBanDau(): number {
  const tho: string | null = new URLSearchParams(window.location.search).get('zoom');
  const z: number = tho === null ? Number.NaN : Number(tho);
  return Number.isFinite(z) && z > 0 ? z : CAU_HINH.zoomDau;
}
