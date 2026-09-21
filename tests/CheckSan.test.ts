/**
 * Hang rao cho thuoc `check:san`.
 *
 * Thuoc do song bang ba bieu thuc chinh quy. Regex la thu sua mot ky tu la mat
 * mot nua pham vi ma khong ai thay - nen moi mau co ca ca PHAI BAT va ca
 * PHAI CHO QUA. Ba ca cho qua duoi day la ma that dang chay trong repo:
 * `catch { /* ly do *\/ }` (fail-open co y cua hook, 8 cho), `disableTypeChecked`
 * (eslint.config.js), va `.skip(` la ten ham that chu khong phai test bi tat.
 */
import { describe, expect, it } from 'vitest';
import { MAU } from '../scripts/check_san.mjs';

const tim = (ten: string): RegExp => {
  const m = MAU.find((x) => x.ten === ten);
  if (m === undefined) throw new Error(`khong co mau "${ten}"`);
  return m.re;
};

describe('check:san — tat kiem tai cho', () => {
  const re = tim('tat kiem tai cho');

  it.each(['// @ts-ignore', '// @ts-expect-error', '/* eslint-disable no-console */', '# noqa'])(
    'bat: %s',
    (dong) => {
      expect(re.test(dong)).toBe(true);
    },
  );

  it('cho qua disableTypeChecked cua eslint.config.js', () => {
    expect(re.test('...tseslint.configs.disableTypeChecked,')).toBe(false);
  });
});

describe('check:san — test bi tat', () => {
  const re = tim('test bi tat');

  it.each(['it.skip("x", () => {});', 'describe.only("x", () => {});', 'xit("x", () => {});'])(
    'bat: %s',
    (dong) => {
      expect(re.test(dong)).toBe(true);
    },
  );

  it('cho qua ten ham that co chu skip', () => {
    expect(re.test('const y = mang.skip(2);')).toBe(false);
  });
});

describe('check:san — ham rong de do', () => {
  const re = tim('ham rong de do');

  it.each(['try { f(); } catch {}', 'try { f(); } catch (e) { }', 'throw new Error("Not implemented");'])(
    'bat: %s',
    (dong) => {
      expect(re.test(dong)).toBe(true);
    },
  );

  it('cho qua catch co ghi ly do', () => {
    expect(re.test('try { f(); } catch { /* fail-open co y */ }')).toBe(false);
  });
});
