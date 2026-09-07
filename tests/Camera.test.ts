/**
 * Hang rao cho phep kep camera.
 *
 * HAI DIEU PHAI DUNG CUNG LUC, va lan dau viet chi lo mot:
 *   1. Tam camera khong troi ra ngoai ban do.
 *   2. MOI O cua ban do deu keo toi duoc.
 *
 * Ban dau kep sao cho ca bon goc khung nhin nam trong hinh thoi - dieu 1 chac chan dung,
 * nhung dieu 2 vo: o muc thu nho nhat tam chi di duoc trong 21% be ngang ban do. Chu du an
 * bao ngay "keo khong het cac noi, no bi ket". Test nay giu ca hai.
 */
import { describe, expect, it } from 'vitest';
import cauHinhTho from '../data/thanh_pho_demo.json';
import { Camera } from '../src/render/Camera';
import { neoX, neoY } from '../src/render/IsoMath';
import type { CauHinhBanDo } from '../src/render/BanDoDemo';

const CH: CauHinhBanDo = cauHinhTho;
/** Man hinh tham chieu: iPhone 16 Pro nam ngang, TECH_SPEC muc 6. */
const RONG = 874;
const CAO = 402;
const O_PX = 64;

function dungCamera(heSo: number, zoom: number): Camera {
  const cam = new Camera(heSo, CH.canh, O_PX * heSo, CH.zoomMin, CH.zoomMax, zoom);
  cam.datKichThuoc(RONG, CAO);
  return cam;
}

/** Tam khung nhin hien tai, doc nguoc ra tu `khung()`. */
function tam(cam: Camera): { x: number; y: number } {
  const k = cam.khung();
  return { x: (k.x0 + k.x1) / 2, y: (k.y0 + k.y1) / 2 };
}

const HE_SO = [1, 2];
const ZOOM = [CH.zoomMin, 0.5, 1.0, CH.zoomMax];

describe('camera khong troi ra ngoai ban do', () => {
  for (const heSo of HE_SO) {
    for (const zoom of ZOOM) {
      it(`bo ${String(heSo)}x, thu phong ${String(zoom)}: keo that xa van bi keo ve trong`, () => {
        const nuaRong: number = ((CH.canh - 1) * O_PX * heSo) / 2;
        const cy: number = nuaRong / 2;
        const xa: number = nuaRong * 10;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const cam = dungCamera(heSo, zoom);
          cam.datTam((dx ?? 0) * xa, cy + (dy ?? 0) * xa);
          const t = tam(cam);
          expect(
            Math.abs(t.x) / nuaRong + Math.abs(t.y - cy) / cy,
            `keo ${String(dx)},${String(dy)}`,
          ).toBeLessThanOrEqual(1 + 1e-9);
        }
      });
    }
  }
});

describe('moi o cua ban do deu keo toi duoc', () => {
  for (const heSo of HE_SO) {
    for (const zoom of ZOOM) {
      it(`bo ${String(heSo)}x, thu phong ${String(zoom)}: bon goc va giua ban do deu toi noi`, () => {
        const oPx: number = O_PX * heSo;
        const cuoi: number = CH.canh - 1;
        const giua: number = Math.floor(cuoi / 2);
        for (const [a, b] of [[0, 0], [0, cuoi], [cuoi, 0], [cuoi, cuoi], [giua, giua]]) {
          const cam = dungCamera(heSo, zoom);
          const x: number = neoX(a ?? 0, b ?? 0, oPx);
          const y: number = neoY(a ?? 0, b ?? 0, oPx);
          cam.datTam(x, y);
          const t = tam(cam);
          // Cho lech mot diem anh: so thuc, khong so nguyen.
          expect(Math.hypot(t.x - x, t.y - y), `o (${String(a)}, ${String(b)})`).toBeLessThan(1);
        }
      });
    }
  }
});
