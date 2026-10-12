/**
 * Ruong lua lon dan (Buoc 3, 12/10): `src/render/LuaLon.ts` la ham thuan cua nhip mo phong.
 * Ke hoach `docs/ke-hoach/2026-10-12-buoc-3-lua-lon-dan.md`.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SO_LUA, phanMua, spriteChang } from '../src/render/LuaLon.ts';

const T = SO_LUA.chuKyNhip;

describe('LuaLon - lua lon theo nhip', () => {
  it('so trong data hop le: chang tang dan, het o 1, mua bat dau va ket thuc bang dat trong', () => {
    expect(T).toBeGreaterThan(0);
    const den = SO_LUA.giaiDoan.map((g) => g.den);
    for (let i = 1; i < den.length; i += 1) expect(den[i]).toBeGreaterThan(den[i - 1] as number);
    expect(den[den.length - 1]).toBe(1);
    expect(spriteChang(0)).toBe(SO_LUA.giaiDoan[0]?.sprite);
    expect(spriteChang(0.9999)).toBe(SO_LUA.giaiDoan[0]?.sprite);
  });

  it('cung nhip cung hinh, dung nhip thi dung chang, sau mot mua quay lai dung cho cu', () => {
    for (const [a, b] of [[3, 7], [40, 12], [0, 0]] as const) {
      for (const n of [0, 777, 36_000, 123_456]) {
        const t = phanMua(n, a, b);
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThan(1);
        expect(phanMua(n, a, b)).toBe(t);
        expect(phanMua(n + T, a, b)).toBeCloseTo(t, 9);
      }
    }
  });

  it('mot mua di qua moi chang dung thu tu: cay, ma, lua xanh, lua vang, gat', () => {
    const da: string[] = [];
    for (let n = 0; n < T; n += 1) {
      const s = spriteChang(n / T);
      if (da[da.length - 1] !== s) da.push(s);
    }
    expect(da).toEqual(SO_LUA.giaiDoan.map((g) => g.sprite).filter((s, i, ds) => i === 0 || ds[i - 1] !== s));
  });

  it('chi giu lua chin tu luc gat: gatTu nam trong mua, dung chang lua vang', () => {
    expect(SO_LUA.gatTu).toBeGreaterThan(0);
    expect(SO_LUA.gatTu).toBeLessThan(1);
    expect(spriteChang(SO_LUA.gatTu - 1e-6)).toBe(SO_LUA.spriteTac);
  });

  it('cac ruong lech pha nhau - ca canh dong khong doi mau cung luc', () => {
    const t = new Set([[3, 7], [40, 12], [0, 0], [21, 5], [9, 30]].map(([a, b]) => spriteChang(phanMua(0, a as number, b as number))));
    expect(t.size).toBeGreaterThan(1);
  });

  it('me co dai nuong du moi chang va hinh luc tac', () => {
    const me = JSON.parse(readFileSync('tools/me/co_dai.json', 'utf8')) as { sprite: Record<string, unknown> };
    const can = new Set([...SO_LUA.giaiDoan.map((g) => g.sprite), SO_LUA.spriteTac, SO_LUA.sprite]);
    for (const ten of can) expect(Object.keys(me.sprite), ten).toContain(ten);
  });
});
