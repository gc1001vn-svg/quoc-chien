/**
 * Danh sach luat bat bien (`docs/LUAT_BAT_BIEN.md`) phai khop dung cac test luat.
 *
 * VI SAO CO FILE NAY. Luat bat bien ghi o hai cho: cau tieng Viet cho chu du an doc (file docs)
 * va test that (`tests/BatBien*.test.ts`). Hai cho tach nhau thi som muon troi: them luat
 * vao docs ma quen viet test, hoac xoa test ma docs van ghi "co luat". File nay de MAY giu
 * hai ben khop ma, khong phai chu phai nho. Ke hoach: `docs/ke-hoach/2026-10-03-luat-bat-bien.md`.
 *
 * Luat chua bat (vd cho chu du an duyet sua loi) ghi `(chưa bật)` tren dong cua no trong
 * docs va KHONG co test. Tat test tai cho bi thuoc `check:san` cam, nen day la cach duy nhat.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = new URL('..', import.meta.url).pathname;
const MA = /\[([A-Z]{2}\d{2})\]/;

/** Ma luat trong docs: ma -> co ghi "(chưa bật)" khong. */
function maTrongDocs(): Map<string, boolean> {
  const kq = new Map<string, boolean>();
  for (const dong of readFileSync(join(GOC, 'docs/LUAT_BAT_BIEN.md'), 'utf8').split('\n')) {
    const m = MA.exec(dong);
    if (m?.[1] !== undefined && dong.trimStart().startsWith('-')) kq.set(m[1], dong.includes('(chưa bật)'));
  }
  return kq;
}

/** Ma luat mo dau ten `it(...)` trong moi file `tests/BatBien*.test.ts` (tru file nay). */
function maTrongTest(): Map<string, string> {
  const kq = new Map<string, string>();
  const thuMuc = join(GOC, 'tests');
  for (const ten of readdirSync(thuMuc)) {
    if (!ten.startsWith('BatBien') || !ten.endsWith('.test.ts') || ten === 'BatBienDanhSach.test.ts') continue;
    for (const m of readFileSync(join(thuMuc, ten), 'utf8').matchAll(/\bit\(\s*['`"]\[([A-Z]{2}\d{2})\]/g)) {
      if (m[1] !== undefined) kq.set(m[1], ten);
    }
  }
  return kq;
}

describe('danh sach luat bat bien khop test', () => {
  const docs = maTrongDocs();
  const test = maTrongTest();

  it('co luat - doc nham file thi khong im lang xanh', () => {
    expect(docs.size).toBeGreaterThan(0);
    expect(test.size).toBeGreaterThan(0);
  });

  it('moi luat da bat trong docs deu co test', () => {
    const thieu = [...docs].filter(([ma, chuaBat]) => !chuaBat && !test.has(ma)).map(([ma]) => ma);
    expect(thieu).toEqual([]);
  });

  it('moi test luat deu co dong trong docs, va khong test luat dang ghi chua bat', () => {
    const lac = [...test.keys()].filter((ma) => !docs.has(ma) || docs.get(ma) === true);
    expect(lac).toEqual([]);
  });
});
