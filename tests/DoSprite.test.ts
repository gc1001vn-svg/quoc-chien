/**
 * Hang rao cho trang do tran sprite (`?do=sprite`).
 *
 * VI SAO CO FILE NAY. Chu du an bam nut "Do tran sprite" ngay 11/09 va gap mot trang DEN
 * THUI: khong hinh, bang so rong, khong mot dong bao. Nguyen nhan: `DoSprite.ts` xin ba
 * sprite `o_co` · `bui_ram` · `nha_ngoi_do`, ma tu me Phase 6B/6C hai cai sau da doi ten
 * thanh `bui` va `nha_dan`. `Atlas.o()` nem loi khi ten sai, nhung no nem TRONG
 * `requestAnimationFrame` nen khong ai bat duoc.
 *
 * Cai dang so khong phai loi, ma la no song im lang bao lau: trang do la thuoc do hieu
 * nang CHINH cua du an (KE_HOACH muc 3, Phase 0), hong tu Phase 6 ma khong ai biet. CI
 * chi goi `?do=sprite` va xem HTTP 200 - ma 200 do la `index.html`, luon tra ve 200 du
 * trang ben trong co chay hay khong.
 *
 * Test nay doc thang JSON atlas, khong can trinh duyet.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TRON } from '../src/bench/DoSprite.ts';
import cauHinh from '../data/thanh_pho_demo.json';

interface Atlas {
  sprite: Record<string, unknown>;
}

/** Doc atlas da nuong trong `public/atlas/`. */
function docAtlas(me: string, co: string): Atlas {
  const duong = new URL(`../public/atlas/${me}_${co}.json`, import.meta.url);
  return JSON.parse(readFileSync(duong, 'utf8')) as Atlas;
}

describe('trang do tran sprite', () => {
  it('ba ti le cong lai bang 1 - khong thi `chonTen` lech ti le am tham', () => {
    const tong: number = TRON.reduce((a, c) => a + c.phan, 0);
    expect(tong).toBeCloseTo(1, 6);
  });

  it('moi ten sprite deu CO THAT trong atlas dang dung, ca hai co', () => {
    for (const co of ['1x', '2x']) {
      const sprite = docAtlas(cauHinh.me, co).sprite;
      for (const c of TRON) {
        expect(sprite, `atlas ${cauHinh.me}_${co} thieu "${c.ten}"`).toHaveProperty(c.ten);
      }
    }
  });
});
