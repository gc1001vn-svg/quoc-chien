/**
 * Hang rao cho phep kep camera.
 *
 * Test dat nhat: KHUNG NHIN KHONG BAO GIO LOI RA NGOAI BAN DO. Ban do o goc cheo la hinh
 * THOI chu khong phai hinh chu nhat, nen kep theo hop bao chu nhat trong vo hai mui thoi
 * ra nen den - da lo dung nhu vay o muc thu nho 0,35x truoc khi sua.
 */
import { describe, expect, it } from 'vitest';
import cauHinhTho from '../data/thanh_pho_demo.json';
import { Camera } from '../src/render/Camera';
import type { CauHinhBanDo } from '../src/render/BanDoDemo';

const CH: CauHinhBanDo = cauHinhTho;
/** Man hinh tham chieu: iPhone 16 Pro nam ngang, TECH_SPEC muc 6. */
const RONG = 874;
const CAO = 402;
const O_PX = 128;

function dungCamera(heSo: number, zoom: number): Camera {
  const cam = new Camera(heSo, CH.canh, O_PX * heSo, CH.zoomMin, CH.zoomMax, zoom);
  cam.datKichThuoc(RONG, CAO);
  return cam;
}

/** Goc nao cua khung nhin cung phai nam trong hinh thoi cua ban do. */
function ngoaiBanDo(cam: Camera, heSo: number): boolean {
  const nuaRong: number = ((CH.canh - 1) * O_PX * heSo) / 2;
  const cy: number = nuaRong / 2;
  const k = cam.khung();
  for (const x of [k.x0, k.x1]) {
    for (const y of [k.y0, k.y1]) {
      // Cho lech mot phan nghin: so thuc, khong so nguyen.
      if (Math.abs(x) / nuaRong + Math.abs(y - cy) / cy > 1 + 1e-9) return true;
    }
  }
  return false;
}

describe('camera khong cho khung nhin loi ra ngoai ban do', () => {
  for (const heSo of [1, 2]) {
    for (const zoom of [CH.zoomMin, 0.5, 1.0, CH.zoomMax]) {
      it(`bo ${String(heSo)}x, thu phong ${String(zoom)}: keo het bon huong van trong ban do`, () => {
        // Keo that xa ve moi huong - xa hon ca ban do - roi doi camera tu kep lai.
        const xa: number = (CH.canh + 40) * O_PX * heSo;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const cam = dungCamera(heSo, zoom);
          cam.datTam((dx ?? 0) * xa, (dy ?? 0) * xa);
          expect(ngoaiBanDo(cam, heSo), `keo ${String(dx)},${String(dy)}`).toBe(false);
        }
      });
    }
  }

  it('thu nho het co van con di chuyen duoc, khong dinh cung mot cho', () => {
    const a = dungCamera(1, CH.zoomMin);
    a.datTam(1e9, 0);
    const b = dungCamera(1, CH.zoomMin);
    b.datTam(-1e9, 0);
    expect(a.khung().x0).not.toBe(b.khung().x0);
  });
});
