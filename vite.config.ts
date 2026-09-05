// `vitest/config` de khai duoc muc `test` ngay trong file nay, khong can file cau hinh thu hai.
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * DUONG DAN GOC - MOT HANG SO DUY NHAT.
 *
 * Doi noi phuc vu trang thi CHI sua dong nay. No quyet dinh:
 * `base` cua Vite, `start_url`, `scope` va duong dan icon trong manifest PWA.
 * Sai cho nay la PWA mo ra trang trang. `npm run check:base` doi chieu lai sau khi build.
 */
const BASE = '/';

export default defineConfig({
  base: BASE,
  build: {
    // Tran build 95 MB (TECH_SPEC muc 2). Canh bao som truoc khi cham tran.
    chunkSizeWarningLimit: 1024,
    target: 'es2022',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // Choi offline hoan toan: khong goi mang luc choi.
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,json,webp,ogg,mp3}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        name: 'Quốc Chiến',
        short_name: 'Quốc Chiến',
        description: 'Game chiến thuật offline, chơi trên iPhone.',
        lang: 'vi',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#12100e',
        theme_color: '#12100e',
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${BASE}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          {
            src: `${BASE}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
