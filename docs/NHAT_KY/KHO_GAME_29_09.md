# 29/09 — nối quoc-chien vào kho-game một cửa (phiên mở ở kho-game, anh duyệt B1–B5)

**Không chạm mã game.** Việc: kho-game bị bỏ qua nhiều lần → sửa gốc ở kho-game, phía này gọn lại.

- `tools/tai_asset.mjs` · `tai_itch.mjs` · `tai_hoa_tiet.mjs`: còn là vỏ gọi `kho-game/cong-cu/lay.mjs`
  (giữ tên vì `docs/ASSET_CREDITS.md` — file khoá — ghi các lệnh này). Logic chung: `tools/kho_game.mjs`.
- `tools/tai_icosa.mjs` 424 → 141 dòng: tải qua kho-game; còn hai việc riêng — kiểm model mới đọc được
  bằng `docGltf` (hỏng thì xoá) và ghi `docs/KHO_ICOSA.md`.
- `tools/do_asset.mjs`: bỏ từ điển riêng (`tools/tu_dien_asset.json` đã xoá) và hai bước dò sống
  Poly Haven / Poly Pizza — trùng bản kê kho-game. Dịch bằng từ điển kho-game (khoá có dấu).
- **`check:credits` thêm luật TỰ LÀM PHẢI KHAI**: sprite vẽ bằng số thuần (không mảnh model, không hoạ
  tiết tải về) hay file `public/` ngoài atlas không có trong sổ ghi công → phải có dòng `docs/TU_LAM.md`
  (lệnh dò + ngày anh duyệt). 16 sprite có sẵn (nền, đế phe, vệt đạn) ghi "có từ trước 29/09".
- Hook mới từ `ghi-nho`: câu anh gõ có từ asset → tự dò kho-game, chèn ~200 token.

Đo: `npm run do` 16/16 đạt · 1 bỏ qua (`do:luat`: `AGENTS.md` không đổi). Thử `check:credits`: xoá một
dòng `TU_LAM.md` → đỏ; để trống ô "Lệnh dò" → đỏ.
