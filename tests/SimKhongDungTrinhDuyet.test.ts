/**
 * HANG RAO CUA LUAT 1 (TECH_SPEC muc 1).
 *
 * `src/sim/` phai la TypeScript thuan de chay duoc 10 gio game trong Node va test duoc
 * toan bo logic. Tay Vuc tron mo phong voi phan ve nen khong test duoc gi, moi lan sua
 * phai nho chu du an mo iPhone thu - hon chuc lan.
 *
 * ESLint da chan, day la hang rao thu hai: no bat ca truong hop ai do tat luat ESLint.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = 'src/sim';

/** Thu cua trinh duyet ma `src/sim/` khong duoc dung. */
const CAM: readonly { readonly mau: RegExp; readonly ten: string }[] = [
  { mau: /\bdocument\b/, ten: 'document' },
  { mau: /\bwindow\b/, ten: 'window' },
  { mau: /\bnavigator\b/, ten: 'navigator' },
  { mau: /\blocalStorage\b/, ten: 'localStorage' },
  { mau: /\brequestAnimationFrame\b/, ten: 'requestAnimationFrame' },
  { mau: /\bfetch\s*\(/, ten: 'fetch(' },
  { mau: /\bWebGL|getContext\s*\(/, ten: 'WebGL / getContext' },
  { mau: /from\s+['"][^'"]*\/(render|ui|bench)\//, ten: 'import tu render/ui/bench' },
  { mau: /from\s+['"]three['"]/, ten: 'import three' },
];

function liet(duong: string): string[] {
  if (!existsSync(duong)) return [];
  const ra: string[] = [];
  for (const ten of readdirSync(duong)) {
    const day: string = join(duong, ten);
    if (statSync(day).isDirectory()) ra.push(...liet(day));
    else if (ten.endsWith('.ts')) ra.push(day);
  }
  return ra;
}

describe('src/sim/ la TypeScript thuan', () => {
  it('khong file nao cham vao trinh duyet', () => {
    const pham: string[] = [];
    for (const duong of liet(GOC)) {
      // Bo dong chu thich: chu "window" trong loi giai thich khong phai loi.
      const ma: string = readFileSync(duong, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');
      for (const { mau, ten } of CAM) {
        if (mau.test(ma)) pham.push(`${duong}: dung ${ten}`);
      }
    }
    expect(pham).toEqual([]);
  });

  it('bo bat loi that su bat duoc - de thu muc rong khong thanh mau xanh gia', () => {
    const mau: string = "import { Gl } from '../render/Gl';\nconst a = window.innerWidth;";
    const dinh: string[] = CAM.filter((c) => c.mau.test(mau)).map((c) => c.ten);
    expect(dinh).toContain('window');
    expect(dinh).toContain('import tu render/ui/bench');
  });
});
