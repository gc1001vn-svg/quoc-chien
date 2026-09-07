/**
 * Trang do sprite - `?do=sprite`.
 *
 * VIEC CUA TRANG NAY: ve N sprite, tang N dan len, tim N lon nhat ma may van giu 60 fps.
 * Con so do chot toan bo ngan sach do hoa cua game (TECH_SPEC muc 1, Luat 2).
 *
 * Tu Phase 2 do bang ATLAS THAT, khong con atlas gia 256x256 nua. So cu cua Phase 0
 * (18.089 sprite) do bang atlas gia nen KHONG so sanh duoc: atlas that la 2048x2048, nang
 * bang thong hon nhieu, va o co 2x moi sprite chiem gap bon lan dien tich ve.
 *
 * May ao Claude ve bang phan mem, luon 1-5 fps -> so do o day VO NGHIA. Phai mo tren
 * iPhone that. Xong trang in ra mot cau ngan de chu du an nhan lai.
 */
import cauHinhTho from '../../data/thanh_pho_demo.json';
import { Gl } from '../render/Gl';
import { Perf } from '../core/Perf';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from '../render/Atlas';

/** Suc chua buffer. Dat cao hon tran 1.500 de tim ra tran that cua may. */
const SUC_CHUA = 24000;
/** Bat dau tu bao nhieu sprite. */
const BAT_DAU = 200;
/** Moi bac tang them bao nhieu phan tram. */
const BUOC = 1.35;
/** Do bao nhieu khung hinh o moi bac roi moi ket luan. Bo 20 khung dau cho may on dinh. */
const KHUNG_MOI_BAC = 70;
const KHUNG_BO_DAU = 20;
/** Duoi nguong nay coi nhu truot 60 fps. De 58 cho do sai so dong ho. */
const NGUONG_60 = 58;
/**
 * Nguong thu hai. Duoi day thi dung han.
 *
 * Can hai nguong vi may ao Claude ve bang phan mem, khong bao gio cham 60 fps - do o do
 * ma chi ghi mot con so 60 fps se luon ra 0, khong biet trang do co chay dung khong.
 */
const NGUONG_30 = 29;

/** Ten me atlas: doc tu cung mot cho voi game, khoi do mot me ma game chay me khac. */
const ME: string = cauHinhTho.me;

/**
 * Tron ba co sprite theo dung ti le mot khung hinh thanh pho that co (TECH_SPEC muc 3):
 * phan lon la o nen, roi den vat nho, it nhat la nha.
 *
 * Do bang mot co duy nhat se ra so vo nghia: 1.500 toa nha khong bao gio cung xuat hien
 * tren mot man hinh 874x402.
 */
const TRON: readonly { readonly ten: string; readonly phan: number }[] = [
  { ten: 'o_co', phan: 0.6 },
  { ten: 'bui_ram', phan: 0.3 },
  { ten: 'nha_ngoi_do', phan: 0.1 },
];

interface DiemVe {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rong: number;
  cao: number;
  trang: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

/** Mo trang do sprite trong `goc`. */
export async function chayDoSprite(goc: HTMLElement): Promise<void> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const bang: HTMLDivElement = document.createElement('div');
  bang.className = 'do-bang';
  goc.appendChild(bang);

  const perf: Perf = new Perf(goc);
  // Nap JSON truoc: so trang quyet dinh shader cua `Gl`.
  const bo: BoAtlas = await taiBoAtlas(ME, coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  // Toa do va co sprite deu tinh bang DIEM ANH CUA KHUNG VE, khong phai CSS px -
  // shader chia cho kich thuoc that cua canvas. Nham cho nay la sprite don ve mot goc.
  let rong = 0;
  let cao = 0;
  let tiLe = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    // Sprite 2x to gap doi ma phai hien ra cung mot co CSS px -> chia cho `heSo`.
    tiLe = gl.tiLeDiemAnh() / atlas.heSo();
    rong = goc.clientWidth * gl.tiLeDiemAnh();
    cao = goc.clientHeight * gl.tiLeDiemAnh();
  };
  doKichThuoc();
  window.addEventListener('resize', doKichThuoc);

  const diem: DiemVe[] = [];
  let soSprite: number = BAT_DAU;
  let khungCuaBac = 0;
  let msCong = 0;
  let msDem = 0;
  let nMax60 = 0;
  let nMax30 = 0;
  let xong = false;
  let lenhVeMax = 0;

  const themDiemChoDu = (): void => {
    while (diem.length < soSprite) {
      const s = atlas.o(chonTen());
      const [u0, v0, u1, v1] = atlas.uv(s);
      diem.push({
        x: Math.random() * rong,
        y: Math.random() * cao,
        vx: (Math.random() - 0.5) * 40 * tiLe,
        vy: (Math.random() - 0.5) * 40 * tiLe,
        rong: s.w * tiLe,
        cao: s.h * tiLe,
        trang: s.trang,
        u0, v0, u1, v1,
      });
    }
  };

  const veMotKhung = (now: number): void => {
    perf.danhDau(now);
    themDiemChoDu();

    gl.batDauKhung();
    for (let i = 0; i < soSprite; i += 1) {
      const d: DiemVe | undefined = diem[i];
      if (d === undefined) continue;
      // Cho sprite chay lien tuc: dung yen thi GPU co the bo qua phan viec that.
      d.x += d.vx * 0.016;
      d.y += d.vy * 0.016;
      if (d.x < -d.rong) d.x = rong;
      if (d.x > rong) d.x = -d.rong;
      if (d.y < -d.cao) d.y = cao;
      if (d.y > cao) d.y = -d.cao;
      gl.them(d.trang, d.x, d.y, d.rong, d.cao, d.u0, d.v0, d.u1, d.v1);
    }
    const lenhVe: number = gl.ketThucKhung();
    if (lenhVe > lenhVeMax) lenhVeMax = lenhVe;

    if (!xong) {
      khungCuaBac += 1;
      if (khungCuaBac > KHUNG_BO_DAU) {
        msCong += perf.msKhung();
        msDem += 1;
      }
      if (khungCuaBac >= KHUNG_MOI_BAC) {
        const fps: number = msDem === 0 ? 0 : 1000 / (msCong / msDem);
        if (fps >= NGUONG_60) nMax60 = soSprite;
        if (fps >= NGUONG_30) nMax30 = soSprite;
        if (fps >= NGUONG_30 && soSprite < SUC_CHUA) {
          soSprite = Math.min(SUC_CHUA, Math.round(soSprite * BUOC));
        } else {
          xong = true;
        }
        khungCuaBac = 0;
        msCong = 0;
        msDem = 0;
      }
    }

    perf.datGhiChu(`${String(soSprite)} sprite · ${String(lenhVe)} lệnh vẽ · atlas ${String(atlas.heSo())}×`);
    bang.innerHTML = xong ? ketQua(nMax60, nMax30, lenhVeMax, atlas.heSo()) : dangDo(soSprite, perf.fps());
    requestAnimationFrame(veMotKhung);
  };

  requestAnimationFrame(veMotKhung);
}

/** Chon ten mot sprite theo ti le da khai o `TRON`. */
function chonTen(): string {
  let r: number = Math.random();
  for (const c of TRON) {
    r -= c.phan;
    if (r <= 0) return c.ten;
  }
  return TRON[0]?.ten ?? 'o_co';
}

function dangDo(n: number, fps: number): string {
  return `<p class="do-cho">Đang đo… đang vẽ <b>${String(n)}</b> sprite,
    hiện <b>${fps.toFixed(0)}</b> fps. Giữ máy yên, đừng chuyển ứng dụng.</p>`;
}

function ketQua(nMax60: number, nMax30: number, lenhVe: number, heSo: number): string {
  const chan: string = `<p class="do-phu">Số lệnh vẽ cao nhất: ${String(lenhVe)} (trần là 4).
    Đo bằng atlas thật cỡ ${String(heSo)}×.</p>`;
  if (nMax60 === 0) {
    return `<div class="do-xong">
      <p>Máy này <b>không giữ nổi 60 fps</b> ngay cả với ${String(BAT_DAU)} sprite.</p>
      <p>Ở mức 30 fps thì được nhiều nhất <b>${String(nMax30)}</b> sprite.</p>
      <p class="do-phu">Bình thường trên iPhone thật. Gặp màn này là đang mở trên máy ảo.</p>
      ${chan}
    </div>`;
  }
  return `<div class="do-xong">
    <p class="do-so">${String(nMax60)}</p>
    <p>sprite là nhiều nhất mà máy này vẫn giữ 60 fps.</p>
    <p class="do-phu">Ở mức 30 fps thì được ${String(nMax30)} sprite.</p>
    ${chan}
    <p class="do-phu">Nhắn con số <b>${String(nMax60)}</b> lại là xong việc đo.</p>
  </div>`;
}
