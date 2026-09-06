/**
 * Hang rao cho atlas da nuong.
 *
 * Atlas hong kieu "hai sprite de len nhau" hay "o tran ra ngoai canh" khong lam vo build,
 * no chi lam game ve ra rac - loai loi tot nhat de test bat. Test doc thang file JSON ma
 * `tools/nuong_sprite.mjs` xuat ra, khong can trinh duyet.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** TECH_SPEC muc 2: toi da 4 atlas 2048x2048 trong bo nho cung luc. */
const TRAN_TRANG = 4;

interface O {
  trang: number;
  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number;
}

interface Atlas {
  canh: number;
  heSo: number;
  o_px: number;
  trang: string[];
  sprite: Record<string, O>;
}

const KHO = 'public/assets/atlas';
const ten: string[] = existsSync(KHO)
  ? readdirSync(KHO).filter((f) => f.endsWith('.json'))
  : [];

function doc(f: string): Atlas {
  return JSON.parse(readFileSync(join(KHO, f), 'utf8')) as Atlas;
}

describe('atlas da nuong', () => {
  it('co it nhat mot atlas, va tong so trang khong vuot tran', () => {
    expect(ten.length).toBeGreaterThan(0);
    const tong = ten.reduce((n, f) => n + doc(f).trang.length, 0);
    expect(tong).toBeLessThanOrEqual(TRAN_TRANG);
  });

  it.each(ten)('%s: moi o nam gon trong canh atlas', (f) => {
    const a = doc(f);
    for (const [k, o] of Object.entries(a.sprite)) {
      expect(o.w, `${k} rong`).toBeGreaterThan(0);
      expect(o.h, `${k} cao`).toBeGreaterThan(0);
      expect(o.x, `${k} le trai`).toBeGreaterThanOrEqual(0);
      expect(o.y, `${k} le tren`).toBeGreaterThanOrEqual(0);
      expect(o.x + o.w, `${k} le phai`).toBeLessThanOrEqual(a.canh);
      expect(o.y + o.h, `${k} le duoi`).toBeLessThanOrEqual(a.canh);
      expect(o.trang, `${k} so trang`).toBeLessThan(a.trang.length);
    }
  });

  it.each(ten)('%s: khong o nao de len o nao', (f) => {
    const a = doc(f);
    const muc = Object.entries(a.sprite);
    const de: string[] = [];
    for (let i = 0; i < muc.length; i += 1) {
      for (let j = i + 1; j < muc.length; j += 1) {
        const [ka, x] = muc[i] as [string, O];
        const [kb, y] = muc[j] as [string, O];
        if (x.trang !== y.trang) continue;
        if (x.x < y.x + y.w && y.x < x.x + x.w && x.y < y.y + y.h && y.y < x.y + x.h) {
          de.push(`${ka} de len ${kb}`);
        }
      }
    }
    expect(de).toEqual([]);
  });

  it.each(ten)('%s: diem neo la so nguyen hop ly, va file trang co that', (f) => {
    const a = doc(f);
    for (const [k, o] of Object.entries(a.sprite)) {
      // Neo CO THE nam ngoai o: model lech han sang mot ben goc the gioi thi `ox` am,
      // vi du la co treo tuong. Chi doi so nguyen va khong lech qua mot o luoi.
      expect(Number.isInteger(o.ox), `${k} neo ngang`).toBe(true);
      expect(Number.isInteger(o.oy), `${k} neo doc`).toBe(true);
      expect(o.ox, `${k} neo ngang`).toBeGreaterThanOrEqual(-a.o_px);
      expect(o.ox, `${k} neo ngang`).toBeLessThanOrEqual(o.w + a.o_px);
      expect(o.oy, `${k} neo doc`).toBeGreaterThanOrEqual(-a.o_px);
      expect(o.oy, `${k} neo doc`).toBeLessThanOrEqual(o.h + a.o_px);
    }
    for (const t of a.trang) expect(existsSync(join(KHO, t)), t).toBe(true);
  });

  it('atlas 2x to gap doi atlas 1x', () => {
    const mot = ten.find((f) => f.endsWith('_1x.json'));
    const hai = ten.find((f) => f.endsWith('_2x.json'));
    if (mot === undefined || hai === undefined) return;
    const a = doc(mot);
    const b = doc(hai);
    expect(b.o_px).toBe(a.o_px * 2);
    // Cho lech 3 diem anh: hai co lam tron doc lap nhau, khong the khop tuyet doi.
    for (const [k, o] of Object.entries(a.sprite)) {
      const o2 = b.sprite[k];
      expect(o2, `${k} thieu o ban 2x`).toBeDefined();
      expect(Math.abs((o2 as O).w - o.w * 2), `${k} rong`).toBeLessThanOrEqual(3);
      expect(Math.abs((o2 as O).h - o.h * 2), `${k} cao`).toBeLessThanOrEqual(3);
    }
  });
});
