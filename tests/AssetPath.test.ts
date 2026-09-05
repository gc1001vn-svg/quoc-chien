/** Duong dan goc sai la PWA mo ra trang trang - nen phai co test. */
import { describe, expect, it } from 'vitest';
import { joinBase } from '../src/core/AssetPath';

describe('joinBase', () => {
  it('ghep duoc khi base la goc ten mien', () => {
    expect(joinBase('/', 'assets/atlas.png')).toBe('/assets/atlas.png');
  });

  it('ghep duoc khi base la thu muc con', () => {
    expect(joinBase('/quoc-chien/', 'assets/atlas.png')).toBe('/quoc-chien/assets/atlas.png');
  });

  it('khong bao gio sinh ra hai dau gach cheo', () => {
    expect(joinBase('/quoc-chien/', '/assets/atlas.png')).toBe('/quoc-chien/assets/atlas.png');
    expect(joinBase('/quoc-chien', '//assets/atlas.png')).toBe('/quoc-chien/assets/atlas.png');
  });

  it('them dau gach cheo neu base thieu', () => {
    expect(joinBase('/quoc-chien', 'icons/icon-192.png')).toBe('/quoc-chien/icons/icon-192.png');
  });
});
