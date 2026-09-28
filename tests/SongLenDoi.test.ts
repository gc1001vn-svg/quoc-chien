import { describe, expect, it } from 'vitest';
import cauHinh from '../data/thanh_pho_demo.json';
import { Atlas, type BoAtlas } from '../src/render/Atlas';
import { chonNguon, type Song, type Ve } from '../src/render/VeCanh';

const o = { trang: 0, x: 0, y: 0, w: 4, h: 4, ox: 0, oy: 0 };
const bo = (ten: string[], soTrang: number): BoAtlas => ({
  canh: 64, heSo: 1, o_px: 64, trang: Array.from({ length: soTrang }, (_, i) => `t${String(i)}.png`),
  sprite: Object.fromEntries(ten.map((t) => [t, o])),
});
const cu = new Atlas(bo(['nha', 'chi_cu'], 2), []);
const moi = new Atlas(bo(['nha', 'chi_moi'], 2), []);
const song: Song = { cu, tamA: 10, tamB: 10, banKinh: 20, dayChop: 6, sangToiDa: 0.2 };
const ve = (s?: Song): Ve => ({
  gl: undefined as never, atlas: moi, rongDev: 1, caoDev: 1, tiLe: 1, camX: 0, camY: 0, dem: 0, khung: 0,
  ...(s === undefined ? {} : { song: s }),
});

describe('chonNguon - lan song doi me (Phase 12D)', () => {
  it('khong co song thi ve bo dang chay, khong lech trang, khong chop', () => {
    expect(chonNguon(ve(), 50, 50, 'nha')).toEqual({ atlas: moi, lech: 0, sang: 0 });
  });

  it('ngoai ban kinh ve bo cu; sau vanh chop ve bo moi, trang danh so tiep sau bo cu', () => {
    expect(chonNguon(ve(song), 40, 40, 'nha')).toEqual({ atlas: cu, lech: 0, sang: 0 });
    expect(chonNguon(ve(song), 10, 10, 'nha')).toEqual({ atlas: moi, lech: 2, sang: 0 });
  });

  it('ngay mep song chop sang nhat, vao sau thi nhat dan', () => {
    const mep = chonNguon(ve(song), 30, 10, 'nha');
    const giua = chonNguon(ve(song), 27, 10, 'nha');
    expect(mep.sang).toBeCloseTo(0.2);
    expect(giua.sang).toBeCloseTo(0.1);
  });

  it('bo duoc chon thieu sprite thi lay bo kia', () => {
    expect(chonNguon(ve(song), 40, 40, 'chi_moi').atlas).toBe(moi);
    expect(chonNguon(ve(song), 10, 10, 'chi_cu').atlas).toBe(cu);
  });

  it('so trong data giu do chop duoi 0,45 - tren nua la shader doc sai trang', () => {
    expect(cauHinh.songLenDoi.sangToiDa).toBeGreaterThan(0);
    expect(cauHinh.songLenDoi.sangToiDa).toBeLessThanOrEqual(0.45);
  });
});
