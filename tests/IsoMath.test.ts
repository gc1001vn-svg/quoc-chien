/**
 * Hang rao cho phan toan cua luoi cheo.
 *
 * Sai mot dau tru o day thi ca thanh pho lech, ma khong co gi bao loi - loai loi chi
 * nhin anh moi thay. Test bang so bat duoc som hon nhieu.
 */
import { describe, expect, it } from 'vitest';
import {
  neoX, neoY, oTaiDiem, sau, vungONhinThay, type NoiKhung,
} from '../src/render/IsoMath';

const O_PX = 64;
const KHONG_NOI: NoiKhung = { trai: 0, tren: 0, phai: 0, duoi: 0 };

describe('neo o tren luoi cheo', () => {
  it('goc luoi nam o goc toa do', () => {
    expect(neoX(0, 0, O_PX)).toBe(0);
    expect(neoY(0, 0, O_PX)).toBe(0);
  });

  it('o ben canh cach nhau nua o ngang, mot phan tu o doc - dung ti le 2:1', () => {
    expect(neoX(1, 0, O_PX)).toBe(32);
    expect(neoY(1, 0, O_PX)).toBe(16);
    expect(neoX(0, 1, O_PX)).toBe(-32);
    expect(neoY(0, 1, O_PX)).toBe(16);
  });

  it('truc sau la tong hai truc', () => {
    expect(sau(3, 4)).toBe(7);
    expect(sau(0, 0)).toBe(0);
  });
});

describe('di va ve', () => {
  it('doi sang man hinh roi doi nguoc lai thi ra dung o cu', () => {
    for (const [a, b] of [[0, 0], [1, 0], [0, 1], [7, 3], [63, 63], [12, 40]] as const) {
      const lai = oTaiDiem(neoX(a, b, O_PX), neoY(a, b, O_PX), O_PX);
      expect(lai.a).toBeCloseTo(a, 10);
      expect(lai.b).toBeCloseTo(b, 10);
    }
  });

  it('dung voi ca atlas 2x', () => {
    const lai = oTaiDiem(neoX(9, 5, 128), neoY(9, 5, 128), 128);
    expect(lai.a).toBeCloseTo(9, 10);
    expect(lai.b).toBeCloseTo(5, 10);
  });
});

describe('vung o nhin thay', () => {
  it('phu het moi o that su nam trong khung', () => {
    const khung = { x0: -300, y0: 100, x1: 500, y1: 400 };
    const vung = vungONhinThay(khung, O_PX, 64, KHONG_NOI);
    for (let a = 0; a < 64; a += 1) {
      for (let b = 0; b < 64; b += 1) {
        const x: number = neoX(a, b, O_PX);
        const y: number = neoY(a, b, O_PX);
        const trong: boolean = x >= khung.x0 && x <= khung.x1 && y >= khung.y0 && y <= khung.y1;
        if (!trong) continue;
        expect(a).toBeGreaterThanOrEqual(vung.aMin);
        expect(a).toBeLessThanOrEqual(vung.aMax);
        expect(b).toBeGreaterThanOrEqual(vung.bMin);
        expect(b).toBeLessThanOrEqual(vung.bMax);
      }
    }
  });

  it('noi khung theo bien do sprite thi phu ca nha cao neo o ngoai man', () => {
    const khung = { x0: 0, y0: 0, x1: 200, y1: 100 };
    const chat = vungONhinThay(khung, O_PX, 64, KHONG_NOI);
    const rong = vungONhinThay(khung, O_PX, 64, { trai: 40, tren: 200, phai: 40, duoi: 20 });
    // Neo o duoi chan nha, nha cao thi neo nam duoi day man -> phai lay them o phia truoc.
    expect(rong.aMax).toBeGreaterThanOrEqual(chat.aMax);
    expect(rong.bMax).toBeGreaterThanOrEqual(chat.bMax);
    expect(rong.aMin).toBeLessThanOrEqual(chat.aMin);
  });

  it('khong bao gio tra ve o nam ngoai ban do', () => {
    const vung = vungONhinThay({ x0: -99999, y0: -99999, x1: 99999, y1: 99999 }, O_PX, 64, KHONG_NOI);
    expect(vung.aMin).toBe(0);
    expect(vung.bMin).toBe(0);
    expect(vung.aMax).toBe(63);
    expect(vung.bMax).toBe(63);
  });
});
