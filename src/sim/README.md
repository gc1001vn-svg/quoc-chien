# `src/sim/` — TypeScript thuần

Luật quan trọng nhất của dự án (TECH_SPEC mục 1, Luật 1).

Mọi file ở đây **cấm** import `document`, `window`, `navigator`, `localStorage`,
`requestAnimationFrame`, `fetch`, WebGL, hay bất cứ gì trong `src/render/`, `src/ui/`,
`src/bench/`, `three`.

Vì sao: nhờ vậy mô phỏng chạy được thẳng trong Node — `npm run sim:thu` chạy 10 giờ game
trong vài giây, và toàn bộ logic test tự động được. Tây Vực trộn hai thứ nên không test
được gì, mỗi lần sửa phải nhờ chủ dự án mở iPhone thử hơn chục lần.

Hai hàng rào giữ luật này: ESLint (`eslint.config.js`) và
`tests/SimKhongDungTrinhDuyet.test.ts`.

Phase 0 chưa có file nào ở đây. Phase 3 mở màn với `Clock.ts`, `State.ts`, `city/`.
