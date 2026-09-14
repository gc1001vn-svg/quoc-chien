import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Luat ESLint cua Quoc Chien.
 *
 * Hai hang rao quan trong nhat:
 *   1. Cam `any` - CLAUDE.md muc "Luat code".
 *   2. `src/sim/` la TypeScript thuan: cam import phan ve, phan giao dien, va cam
 *      dung bien toan cuc cua trinh duyet. Nho vay chay duoc 10 gio game trong Node.
 */
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'dev-dist/**', '*.config.js'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Doc so tu JSON thi kieu la `unknown`; ep kieu co kiem tra van la cach lam dung.
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },

  // Phan chay trong trinh duyet.
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },

  // HANG RAO LUAT 1 - TECH_SPEC muc 1.
  {
    files: ['src/sim/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'src/sim/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'document', message: 'src/sim/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'navigator', message: 'src/sim/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'localStorage', message: 'src/sim/ la TypeScript thuan, cam dung trinh duyet.' },
        { name: 'requestAnimationFrame', message: 'src/sim/ chay theo nhip 10 Hz, khong theo vong ve.' },
        { name: 'fetch', message: 'src/sim/ khong duoc goi mang.' },
        { name: 'process', message: 'src/sim/ khong duoc doc moi truong — ket qua se khac nhau theo may.' },
      ],
      // Sim phai TAT DINH: cung mot ban do, cung mot chuoi lenh, moi may ra
      // cung mot ket qua. Ba nguon lam lech, khong cai nao la "trinh duyet"
      // nen hang rao tren khong bat duoc:
      //   dong ho  — doc gio la ket qua doi theo luc chay
      //   ngau nhien — `Math.random` khong co hat giong, khong phat lai duoc
      //   locale   — `localeCompare` sap xep theo may, byte xuat ra doi theo may
      // Can gio hay so ngau nhien thi NHAN QUA THAM SO, giong `Clock` hien co.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="Math"][property.name="random"]',
          message: 'src/sim/ phai tat dinh: dung `Rng` (src/core/Rng) co hat giong, truyen vao qua tham so.',
        },
        {
          selector: ':matches(MemberExpression[object.name="Date"], NewExpression[callee.name="Date"], MemberExpression[object.name="performance"])',
          message: 'src/sim/ khong duoc doc dong ho. Nhan thoi gian qua tham so (xem Clock).',
        },
        {
          selector: ':matches(MemberExpression[property.name="localeCompare"], MemberExpression[property.name=/^toLocale/], MemberExpression[object.name="Intl"])',
          message: 'src/sim/ cam locale: so sanh va dinh dang theo locale lam ket qua khac nhau giua cac may.',
        },
        {
          selector: 'CallExpression[callee.property.name="sort"][arguments.length=0]',
          message: 'src/sim/ phai sap xep co ham so sanh ro rang — `.sort()` tran sap theo chuoi UTF-16.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/render/**', '**/ui/**', '**/bench/**', 'three', '**/core/AssetPath*'],
              message: 'src/sim/ khong duoc import phan ve hay phan giao dien.',
            },
          ],
        },
      ],
    },
  },

  // Test va cong cu chay trong Node.
  {
    files: ['tests/**/*.ts', 'scripts/**/*.ts', 'scripts/**/*.mjs', 'tools/**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: {
      // Cong cu Node viet bang .mjs, kieu khai qua JSDoc - khong ep khai kieu TypeScript.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'tools/**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Phan cua cong cu nuong sprite chay TRONG trinh duyet, khong phai trong Node.
  // Tach lam hai khoi: gop chung mot khoi thi `languageOptions` cua khoi sau de mat
  // `parserOptions` ma disableTypeChecked vua tat, ESLint doi file phai nam trong tsconfig.
  {
    files: ['tools/lib/trang_nuong.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['tools/lib/trang_nuong.js'],
    languageOptions: { globals: globals.browser },
    rules: {
      // File .js chay trong trinh duyet, khai kieu bang JSDoc nhu cac cong cu Node khac.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
);
