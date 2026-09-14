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
  // TECH_SPEC muc 8: "cung hat giong -> cung ket qua". Ba nguon lam lech ma hang rao
  // tren KHONG bat duoc, vi khong cai nao la thu cua trinh duyet:
  //   dong ho   - ket qua doi theo luc chay
  //   ngau nhien - `Math.random` khong co hat giong, khong phat lai duoc (dung `Rng`)
  //   locale     - sap xep theo may, byte xuat ra khac nhau giua cac may
  // ESLint da chan (khoi `src/sim/**`); day van la hang rao thu hai nhu ca bo tren.
  { mau: /\bMath\.random\b/, ten: 'Math.random' },
  { mau: /\bDate\.now\b|\bnew\s+Date\b/, ten: 'dong ho (Date)' },
  { mau: /\bperformance\.\w/, ten: 'performance' },
  { mau: /\blocaleCompare\b|\btoLocale\w*/, ten: 'locale' },
  { mau: /\bIntl\./, ten: 'Intl' },
  { mau: /\.sort\(\s*\)/, ten: '.sort() tran' },
  { mau: /\bprocess\.\w/, ten: 'process' },
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

  it('bat duoc ca ba nguon lam lech tat dinh', () => {
    // Moi dong mot vi pham, doi chieu voi dung ten no phai dinh - de trong mot mau
    // gop thi mot bieu thuc hong van xanh nho bieu thuc khac dinh.
    const thu: readonly (readonly [string, string])[] = [
      ['const x = Math.random();', 'Math.random'],
      ['const t = Date.now();', 'dong ho (Date)'],
      ['const t = new Date();', 'dong ho (Date)'],
      ['const t = performance.now();', 'performance'],
      ["a.localeCompare(b);", 'locale'],
      ['n.toLocaleString();', 'locale'],
      ["new Intl.NumberFormat('vi');", 'Intl'],
      ['ds.sort();', '.sort() tran'],
      ['const v = process.env.X;', 'process'],
    ];
    for (const [ma, ten] of thu) {
      expect(CAM.filter((c) => c.mau.test(ma)).map((c) => c.ten)).toContain(ten);
    }
  });
});
