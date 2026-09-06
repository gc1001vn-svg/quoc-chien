# PHASE 1 — Nướng sprite, mẻ trung cổ (06/09/2026)

Làm ra atlas thật đầu tiên: model 3D CC0 → ảnh phẳng isometric → atlas PNG + JSON toạ độ.

- `tools/tai_asset.mjs` moi link zip giấu trong HTML của kenney.nl rồi tải về
  `assets_source/`. Lấy **Fantasy Town Kit 2.0** (167 model) + **Tower Defense Kit**
  (160 model), cả hai CC0.
- `tools/lib/obj.mjs` đọc OBJ + MTL. `tools/lib/xep.mjs` xếp atlas kiểu kệ.
  `tools/nuong_sprite.mjs` tính hết ở Node rồi mở Chromium vẽ bằng **WebGL tự viết**
  (`tools/lib/trang_nuong.js`) — **không three.js**, chốt với chủ dự án đầu phiên.
- Bất ngờ lớn nhất: Fantasy Town Kit là **bộ lắp ghép** — tường, mái là từng mảnh rời,
  không có sẵn cái nhà nào. Nên phải thêm công thức ghép ở `tools/me/trung_co.json`.
  Nhà, tháp canh, cổng thành đều ghép từ 5–25 mảnh.
- Hai chỗ vấp: 10 model có material `Water` không dùng ảnh, bỏ qua thì giếng và bể nước
  ra loang lổ đen–đỏ → mỗi đỉnh phải mang thêm màu phẳng. Và mái `roof-flat` có màu cỏ
  xanh, làm sàn tháp canh trông sai → đổi sang `planks`.
- Sửa `TECH_SPEC.md` mục 3 chỗ ghi nhầm: 2:1 cần nghiêng **30°**, không phải 26,57°
  (chiều cao chiếu = chiều ngang × sin(nghiêng)). Đo lại trên atlas: ô nền ra đúng 64×32.
- Kết quả: **43 sprite**, 1 trang atlas 2048² cho mỗi cỡ (1× lấp 4,9%, 2× lấp 19,1%).
  Tổng 2 trang / trần 4 của TECH_SPEC mục 2.
- `tests/Atlas.test.ts` bắt đỏ nếu ô đè nhau, tràn cạnh, thiếu file trang, hay 2× không
  gấp đôi 1×. `npm run do` → 6/6.

Chưa làm: atlas mới **chưa gắn vào game** — trang đo vẫn dùng atlas giả. Đó là Phase 2.
