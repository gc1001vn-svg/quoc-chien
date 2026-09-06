# Nguồn và bản quyền asset

Mọi file trong `public/assets/` **bắt buộc** có tên trong bảng dưới.
`npm run check:credits` chặn nếu thiếu, CI chặn theo.

License chỉ nhận **CC0 · CC-BY · MIT**. **CC-BY-SA không dùng được** — nó lây license
sang cả dự án.

| File trong `public/assets/` | Nguồn | Tác giả | License | Ngày thêm |
|---|---|---|---|---|
| `atlas/trung_co_1x_0.png` | Fantasy Town Kit 2.0 · Tower Defense Kit · Castle Kit · Nature Kit, <https://kenney.nl> | Kenney | CC0 1.0 | 06/09/2026 |
| `atlas/trung_co_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 06/09/2026 |
| `atlas/trung_co_2x_0.png` | Fantasy Town Kit 2.0 · Tower Defense Kit · Castle Kit · Nature Kit, <https://kenney.nl> | Kenney | CC0 1.0 | 06/09/2026 |
| `atlas/trung_co_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 06/09/2026 |

Atlas là ảnh **nướng lại** từ model 3D CC0 của Kenney bằng `tools/nuong_sprite.mjs`, không
phải bản sao chép nguyên. CC0 cho phép dùng thương mại, không bắt buộc ghi công — vẫn ghi.
Gói gốc tải về nằm ở `assets_source/`, không lên git (xem `.gitignore`).

## Chưa tính vào bảng này

- `public/icons/*.png` — biểu tượng PWA, tự sinh bằng `python3` lúc dựng Phase 0, không
  lấy của ai.
- Atlas giả trong trang đo sprite — vẽ bằng Canvas 2D **lúc chạy**, không có file.
- `assets_source/` — gói tải về nguyên vẹn, không lên máy chủ, không lên git.
  Ghi nguồn vào đây khi nào atlas nướng ra từ nó được đưa vào `public/assets/`.
