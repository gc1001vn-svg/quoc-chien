/**
 * Hang rao cho TRAN 1.500 SPRITE cua TECH_SPEC muc 2.
 *
 * Luat 3 cua CLAUDE.md: vuot tran hieu nang la LOI, khong phai "toi uu sau". Nhung tran
 * do chi kiem duoc tren may that, ma may that thi phai nho chu du an mo iPhone. Test nay
 * dem TRUOC bang so hoc: dem dung so sprite ma `CityScene` se ve, tren dung man hinh tham
 * chieu 874x402, o muc thu nho nhat cho phep - luc dong sprite nhat.
 *
 * Phep dem o day lap lai y het phep cat cua `CityScene.datSprite`; doi mot ben ma quen ben
 * kia thi test nay het y nghia. Neu sua `datSprite`, sua ca day.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import cauHinhTho from '../data/thanh_pho_demo.json';
import { Atlas, docBoAtlas } from '../src/render/Atlas';
import { neoX, neoY, vungONhinThay } from '../src/render/IsoMath';
import { sinhBanDo, type BanDo, type CauHinhBanDo } from '../src/sim/city/BanDo.ts';

const CAU_HINH: CauHinhBanDo = cauHinhTho;
/** Man hinh tham chieu cua du an: iPhone 16 Pro nam ngang, TECH_SPEC muc 6. */
const RONG_CSS = 874;
const CAO_CSS = 402;

/** Atlas that, khong co texture - phan toan cua `Atlas` khong can GPU. */
function atlasThat(co: string): Atlas {
  const bo = docBoAtlas(JSON.parse(readFileSync(`public/atlas/${CAU_HINH.me}_${co}.json`, 'utf8')));
  return new Atlas(bo, []);
}

/** Dem so sprite phai ve khi camera dat o `(tamX, tamY)` voi muc thu phong `zoom`. */
function demSprite(atlas: Atlas, banDo: BanDo, zoom: number, tamX: number, tamY: number): number {
  const oPx: number = atlas.oPx();
  const ti: number = zoom / atlas.heSo();
  const nuaX: number = RONG_CSS / 2 / ti;
  const nuaY: number = CAO_CSS / 2 / ti;
  const khung = { x0: tamX - nuaX, x1: tamX + nuaX, y0: tamY - nuaY, y1: tamY + nuaY };
  const vung = vungONhinThay(khung, oPx, banDo.canh, atlas.bienDo());

  let dem = 0;
  const thu = (a: number, b: number, ten: string | undefined): void => {
    if (ten === undefined || !atlas.co(ten)) return;
    const s = atlas.o(ten);
    const x: number = (neoX(a, b, oPx) - s.ox - tamX) * ti + RONG_CSS / 2;
    const y: number = (neoY(a, b, oPx) - s.oy - tamY) * ti + CAO_CSS / 2;
    const rong: number = s.w * ti;
    const cao: number = s.h * ti;
    if (x + rong < 0 || x > RONG_CSS || y + cao < 0 || y > CAO_CSS) return;
    dem += 1;
  };

  for (let a = vung.aMin; a <= vung.aMax; a += 1) {
    for (let b = vung.bMin; b <= vung.bMax; b += 1) thu(a, b, banDo.nen[a * banDo.canh + b]);
  }
  for (const v of banDo.vat) thu(v.a, v.b, v.ten);
  return dem;
}

describe('ngan sach sprite mot khung hinh', () => {
  const banDo: BanDo = sinhBanDo(CAU_HINH);

  for (const co of ['1x', '2x']) {
    it(`bo ${co}: khong cho nao vuot tran ${String(CAU_HINH.tranSprite)} o muc thu nho nhat`, () => {
      const atlas: Atlas = atlasThat(co);
      const oPx: number = atlas.oPx();
      let caoNhat = 0;
      let cho = '';
      // Quet khap ban do chu khong chi doan giua: cho dong nha nhat moi la cho de vo tran.
      for (let a = 0; a < CAU_HINH.canh; a += 4) {
        for (let b = 0; b < CAU_HINH.canh; b += 4) {
          const n: number = demSprite(
            atlas, banDo, CAU_HINH.zoomMin, neoX(a, b, oPx), neoY(a, b, oPx),
          );
          if (n > caoNhat) {
            caoNhat = n;
            cho = `(${String(a)}, ${String(b)})`;
          }
        }
      }
      // In ra de con biet dang con bao nhieu cho, khong chi biet dat hay hong.
      console.log(`  ${co}: cao nhat ${String(caoNhat)} sprite tai o ${cho}`);
      expect(caoNhat).toBeLessThanOrEqual(CAU_HINH.tranSprite);
    });
  }

  it('thu phong sau hon zoomMin thi vuot tran - day dung la ly do phai chan', () => {
    const atlas: Atlas = atlasThat('2x');
    const giua: number = ((CAU_HINH.canh - 1) * atlas.oPx()) / 4;
    expect(demSprite(atlas, banDo, CAU_HINH.zoomMin / 2, 0, giua))
      .toBeGreaterThan(CAU_HINH.tranSprite);
  });
});
