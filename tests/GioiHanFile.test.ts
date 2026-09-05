/** CLAUDE.md: moi file .ts toi da 300 dong. Vuot thi tach module, khong de "sua sau". */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const TRAN_DONG = 300;

function liet(duong: string): string[] {
  const ra: string[] = [];
  for (const ten of readdirSync(duong)) {
    const day: string = join(duong, ten);
    if (statSync(day).isDirectory()) ra.push(...liet(day));
    else if (ten.endsWith('.ts')) ra.push(day);
  }
  return ra;
}

describe('gioi han do dai file', () => {
  it('khong file .ts nao vuot 300 dong', () => {
    const qua: string[] = [];
    for (const duong of [...liet('src'), ...liet('tests')]) {
      const soDong: number = readFileSync(duong, 'utf8').split('\n').length;
      if (soDong > TRAN_DONG) qua.push(`${duong}: ${String(soDong)} dong`);
    }
    expect(qua).toEqual([]);
  });
});
