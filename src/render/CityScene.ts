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
import { Perf } from '../core/Perf';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import { Camera } from './Camera';
import { Gl } from './Gl';
import { neoX, neoY, vungONhinThay, type VungO } from './IsoMath';
import { sinhBanDo, type BanDo, type CauHinhBanDo } from './BanDoDemo';

const CAU_HINH: CauHinhBanDo = cauHinhTho;
/** Suc chua buffer. Rong hon tran 3.500 mot chut de con dem duoc luc vuot. */
const SUC_CHUA = 4096;

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

  const banDo: BanDo = sinhBanDo(CAU_HINH);
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

  const veMotKhung = (now: number): void => {
    perf.danhDau(now);
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
    if (perf.dangBat('nha')) veLopVat(ve, banDo);
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

/** Ve lop vat the. Danh sach da xep san theo truc sau luc sinh ban do. */
function veLopVat(ve: Ve, banDo: BanDo): void {
  for (const v of banDo.vat) datSprite(ve, v.a, v.b, v.ten);
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
