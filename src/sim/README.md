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

## Đang có gì (từ Phase 3)

| File | Việc |
|---|---|
| `Clock.ts` | Nhịp 10 Hz, tốc độ 0/1×/2×/4×/8×, giữ phần lẻ nên không trôi nhịp |
| `city/DocJson.ts` | Đọc số và chữ từ JSON có kiểm tra, sai thì báo kèm đường dẫn tới chỗ sai |
| `city/Wares.ts` | Kho chung: không bao giờ âm, không bao giờ vượt trần |
| `city/Buildings.ts` | Toà nhà. `san_xuat` ăn hết `vao` cùng lúc; `tieu_thu` ăn từng món độc lập |
| `city/Chains.ts` | Kiểm ba file `data/*.json` khớp nhau trước khi chạy nhịp nào |
| `city/City.ts` | Gom lại, đếm, chấm điểm một giờ game |

**Mọi số cân bằng nằm ở `data/wares.json` · `buildings.json` · `chains.json`**, không nằm
trong `.ts` (CLAUDE.md luật 2).

## Hai điều phải nhớ khi viết thêm

1. **Import phải ghi đủ đuôi `.ts`** và **cấm `constructor(readonly x: T)`** — Node bóc kiểu
   TypeScript (`--experimental-strip-types`) không nuốt được lối viết tắt đó. Sai là
   `npm run sim:thu` chết ngay, `npm test` thì vẫn xanh nên dễ lọt.
2. **Đọc file là việc của người gọi.** `scripts/sim_thu.ts` đọc JSON bằng `fs` rồi truyền
   object vào; trong trình duyệt thì Vite `import` thẳng JSON. `src/sim/` không biết file
   nằm ở đâu.

Phase 4 thêm `city/Walkers.ts` — người vác hàng thật thay cho kho chung chuyển tức thì.
