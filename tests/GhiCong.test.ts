/**
 * Man ghi cong trong game phai khop model CC-BY THAT SU duoc nuong: moi kit Icosa trong
 * `tools/me/*.json` co mot dong trong `data/ghi_cong.json`, va khong dong nao thua.
 * CC-BY doi ghi ten tac gia o cho nguoi choi thay duoc (`docs/ASSET_CREDITS.md` muc Icosa).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ghiCong from '../data/ghi_cong.json';

const idDung = new Set<string>();
for (const f of readdirSync('tools/me')) {
  const me = JSON.parse(readFileSync(`tools/me/${f}`, 'utf8')) as { kit: Record<string, { duong?: string }> };
  for (const k of Object.values(me.kit)) {
    const bat = /assets_source\/icosa\/([^/]+)/.exec(k.duong ?? '');
    if (bat?.[1] !== undefined) idDung.add(bat[1]);
  }
}

describe('ghi_cong.json', () => {
  it('moi model Icosa dang nuong deu co ten tac gia, license, link', () => {
    const co = new Set(ghiCong.cc_by.map((d) => d.id));
    expect([...idDung].filter((id) => !co.has(id))).toEqual([]);
    for (const d of ghiCong.cc_by) {
      expect(d.tac_gia.length).toBeGreaterThan(0);
      expect(d.license).toMatch(/^CC-BY/);
      expect(d.link).toBe(`https://icosa.gallery/view/${d.id}`);
    }
  });

  it('khong ghi cong model khong con dung', () => {
    expect(ghiCong.cc_by.map((d) => d.id).filter((id) => !idDung.has(id))).toEqual([]);
  });
});
