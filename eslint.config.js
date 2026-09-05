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
    files: ['tests/**/*.ts', 'scripts/**/*.mjs', 'tools/**/*.mjs'],
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
);
