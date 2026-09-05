# Phase 0 — Khung repo và trang đo sprite

Ngày: 05/09/2026.

## Làm gì

- Chép `docs/QUOC_CHIEN` từ repo `tayvuc` sang; `CLAUDE_MOI.md` thành `CLAUDE.md` ở gốc.
- Dựng khung: Vite 8 + TypeScript strict + ESLint 10 + vitest 5 + `vite-plugin-pwa`.
- `vite.config.ts`: một hằng `const BASE = '/'` quyết định `base`, `start_url`, `scope`,
  icon manifest. `scripts/check_base_path.mjs` đối chiếu sau build.
- `src/core/AssetPath.ts` (chép từ Tây Vực), `src/core/Perf.ts` (nhãn fps + 4 nút tắt lớp).
- `src/render/Gl.ts` — bộ vẽ WebGL tối thiểu, một buffer, gom sprite theo atlas.
  Viết ở Phase 0 vì trang đo cần nó; Phase 2 mở rộng chứ không viết lại.
- `src/bench/` — trang đo `?do=sprite`: atlas giả vẽ bằng Canvas 2D, tăng dần N sprite,
  in ra N tối đa còn 60 fps. Cỡ sprite trộn 60% ô nền / 30% người / 10% nhà.
- ESLint chặn cứng `src/sim/` chạm trình duyệt; `tests/SimKhongDungTrinhDuyet.test.ts`
  là hàng rào thứ hai. Thêm `tests/GioiHanFile.test.ts` (trần 300 dòng/file).
- CI GitHub: lint · typecheck · test · build · check:base · check:credits · trần 95 MB.
- Ba hook chung của bộ đồ nghề: `chan_file_khoa` · `ghi_so_lenh` · `chan_bao_xong`.
- `docs/thuoc-do.md`, `docs/ASSET_CREDITS.md`, `docs/TIEN_DO.md`.

## Sửa gì giữa chừng

- Sprite chỉ phủ 1/4 màn: toạ độ tính bằng CSS px trong khi shader chia cho kích thước
  thật của canvas. Thêm `Gl.tiLeDiemAnh()` để đổi đơn vị ở đúng một chỗ.
- Trang đo in ra "0 sprite" trên máy ảo. Thêm ngưỡng thứ hai 30 fps và câu giải thích.

## Nợ lại

Atlas giả · `src/sim/` còn rỗng · chưa nối Vercel. Chi tiết ở `docs/TIEN_DO.md` mục 4.
