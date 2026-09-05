/**
 * Trang do sprite - `?do=sprite`.
 *
 * VIEC CUA TRANG NAY: ve N sprite, tang N dan len, tim N lon nhat ma may van giu 60 fps.
 * Con so do chot toan bo ngan sach do hoa cua game (TECH_SPEC muc 1, Luat 2).
 *
 * May ao Claude ve bang phan mem, luon 1-5 fps -> so do o day VO NGHIA. Phai mo tren
 * iPhone that. Xong trang in ra mot cau ngan de chu du an nhan lai.
 */
import { Gl } from '../render/Gl';
import { Perf } from '../core/Perf';
import { SO_O, toaDoO, veAtlasTam } from './AtlasTam';

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

/**
 * Tron ba co sprite theo dung ti le mot khung hinh thanh pho that co, tinh bang CSS px
 * (TECH_SPEC muc 3): phan lon la o nen, roi den nguoi, it nhat la nha.
 *
 * Do bang mot co duy nhat se ra so vo nghia: 1.500 toa nha 128x128 khong bao gio cung
 * xuat hien tren mot man hinh 874x402.
 */
const CO_SPRITE: readonly { readonly rong: number; readonly cao: number; readonly phan: number }[] = [
  { rong: 64, cao: 32, phan: 0.6 },
  { rong: 48, cao: 64, phan: 0.3 },
  { rong: 128, cao: 128, phan: 0.1 },
];

interface DiemVe {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rong: number;
  cao: number;
  o: number;
}

/** Chon mot co sprite theo ti le da khai o `CO_SPRITE`. */
function chonCo(): { readonly rong: number; readonly cao: number } {
  let r: number = Math.random();
  for (const c of CO_SPRITE) {
    r -= c.phan;
    if (r <= 0) return c;
  }
  return CO_SPRITE[0] ?? { rong: 64, cao: 32 };
}

/** Mo trang do sprite trong `goc`. */
export function chayDoSprite(goc: HTMLElement): void {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const bang: HTMLDivElement = document.createElement('div');
  bang.className = 'do-bang';
  goc.appendChild(bang);

  const perf: Perf = new Perf(goc);
  const gl: Gl = new Gl(canvas, SUC_CHUA);
  const atlas: WebGLTexture = gl.napAtlas(veAtlasTam());

  // Toa do va co sprite deu tinh bang DIEM ANH CUA KHUNG VE, khong phai CSS px -
  // shader chia cho kich thuoc that cua canvas. Nham cho nay la sprite don ve mot goc.
  let rong = 0;
  let cao = 0;
  let tiLe = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    tiLe = gl.tiLeDiemAnh();
    rong = goc.clientWidth * tiLe;
    cao = goc.clientHeight * tiLe;
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
      const co = chonCo();
      diem.push({
        x: Math.random() * rong,
        y: Math.random() * cao,
        vx: (Math.random() - 0.5) * 40 * tiLe,
        vy: (Math.random() - 0.5) * 40 * tiLe,
        rong: co.rong * tiLe,
        cao: co.cao * tiLe,
        o: Math.floor(Math.random() * SO_O),
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
      const [u0, v0, u1, v1] = toaDoO(d.o);
      gl.them(atlas, d.x, d.y, d.rong, d.cao, u0, v0, u1, v1);
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

    perf.datGhiChu(`${String(soSprite)} sprite · ${String(lenhVe)} lệnh vẽ`);
    bang.innerHTML = xong ? ketQua(nMax60, nMax30, lenhVeMax) : dangDo(soSprite, perf.fps());
    requestAnimationFrame(veMotKhung);
  };

  requestAnimationFrame(veMotKhung);
}

function dangDo(n: number, fps: number): string {
  return `<p class="do-cho">Đang đo… đang vẽ <b>${String(n)}</b> sprite,
    hiện <b>${fps.toFixed(0)}</b> fps. Giữ máy yên, đừng chuyển ứng dụng.</p>`;
}

function ketQua(nMax60: number, nMax30: number, lenhVe: number): string {
  const chan: string = `<p class="do-phu">Số lệnh vẽ cao nhất: ${String(lenhVe)} (trần là 4).</p>`;
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
