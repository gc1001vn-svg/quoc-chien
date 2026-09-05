# Nguồn và bản quyền asset

Mọi file trong `public/assets/` **bắt buộc** có tên trong bảng dưới.
`npm run check:credits` chặn nếu thiếu, CI chặn theo.

License chỉ nhận **CC0 · CC-BY · MIT**. **CC-BY-SA không dùng được** — nó lây license
sang cả dự án.

| File trong `public/assets/` | Nguồn | Tác giả | License | Ngày thêm |
|---|---|---|---|---|
| _(chưa có)_ | | | | |

## Chưa tính vào bảng này

- `public/icons/*.png` — biểu tượng PWA, tự sinh bằng `python3` lúc dựng Phase 0, không
  lấy của ai.
- Atlas giả trong trang đo sprite — vẽ bằng Canvas 2D **lúc chạy**, không có file.
- `assets_source/` — gói tải về nguyên vẹn, không lên máy chủ, không lên git.
  Ghi nguồn vào đây khi nào atlas nướng ra từ nó được đưa vào `public/assets/`.
