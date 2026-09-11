/**
 * Doi toa do luoi luc giac <-> man hinh.
 *
 * Test dat nhat o day la cai cuoi: cham vao TAM mot hex phai tra ve dung hex do, va cham
 * lech ba phan tu duong kinh van phai tra ve dung no. Sai buoc luoi mot chut thi ban do
 * van ve ra dep, chi co viec cham la tro sang o ben canh - loai loi nhin anh khong thay.
 */
import { describe, expect, it } from 'vitest';
import { BUOC_DOC, BUOC_NGANG, hexTaiDiem, hexX, hexY, theGioi, truocSau } from '../src/render/HexIso';
import { vanh, type OHex } from '../src/sim/campaign/Hex';

const O_PX = 64;

describe('luoi hex trong phoi canh 2:1', () => {
  it('hex goc nam tai goc toa do', () => {
    expect(hexX({ q: 0, r: 0 }, O_PX)).toBe(0);
    expect(hexY({ q: 0, r: 0 }, O_PX)).toBe(0);
  });

  it('buoc ngang 2 o luoi, buoc doc sqrt(3) - dung thuoc cua goi KayKit', () => {
    expect(theGioi({ q: 1, r: 0 })).toEqual({ x: BUOC_NGANG, z: 0 });
    expect(theGioi({ q: 0, r: 1 }).z).toBeCloseTo(BUOC_DOC, 9);
    // Moi lan tang `r` thi hang lech NUA buoc ngang - dau hieu cua luoi pointy-top.
    expect(theGioi({ q: 0, r: 1 }).x).toBeCloseTo(BUOC_NGANG / 2, 9);
  });

  it('sau hang xom deu cach tam dung mot buoc tren man hinh', () => {
    const tam: OHex = { q: 2, r: -1 };
    const kc: number[] = vanh(tam).map((o: OHex): number =>
      Math.hypot(hexX(o, O_PX) - hexX(tam, O_PX), (hexY(o, O_PX) - hexY(tam, O_PX)) * 2),
    );
    // Nhan doi truc doc de go phoi canh 2:1 ra; luc do sau o phai cach deu nhau.
    for (const d of kc) expect(d).toBeCloseTo(kc[0] as number, 6);
  });

  it('truc sau tang dan tu xa ve gan', () => {
    expect(truocSau({ q: 0, r: 0 })).toBeLessThan(truocSau({ q: 1, r: 0 }));
    expect(truocSau({ q: 0, r: 0 })).toBeLessThan(truocSau({ q: 0, r: 1 }));
  });
});

describe('cham vao ban do', () => {
  it('cham dung tam hex thi tra ve chinh hex do', () => {
    for (let q = -4; q <= 4; q += 1) {
      for (let r = -4; r <= 4; r += 1) {
        const o: OHex = { q, r };
        expect(hexTaiDiem(hexX(o, O_PX), hexY(o, O_PX), O_PX)).toEqual(o);
      }
    }
  });

  it('cham lech mot phan ba duong kinh van tra ve dung hex', () => {
    const o: OHex = { q: 3, r: -2 };
    const x: number = hexX(o, O_PX);
    const y: number = hexY(o, O_PX);
    // Mot phan ba duong kinh theo bon phia; hex rong 2 o luoi nen buoc nay an toan.
    const lech: number = (BUOC_NGANG * O_PX) / 6;
    for (const [dx, dy] of [[lech, 0], [-lech, 0], [0, lech / 2], [0, -lech / 2]]) {
      expect(hexTaiDiem(x + (dx as number), y + (dy as number), O_PX)).toEqual(o);
    }
  });
});
