# PHASE 1 — Nướng sprite, mẻ trung cổ (06/09/2026)

Làm ra atlas thật đầu tiên: model 3D CC0 → ảnh phẳng isometric → atlas PNG + JSON toạ độ.

- `tools/tai_asset.mjs` moi link zip giấu trong HTML của kenney.nl rồi tải về
  `assets_source/`. Lấy 4 gói CC0: **Fantasy Town Kit 2.0** (167 model) ·
  **Tower Defense Kit** (160) · **Castle Kit** (76) · **Nature Kit** (329).
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
- Vòng ĐỔI (chủ dự án chê đơn điệu): thêm Castle Kit + Nature Kit, và ba nước cờ tạo
  biến thể mà không nướng thêm model — màu nhân/sơn đè theo mảnh (`mau`, `thay_mau`),
  màu nhân theo tên material (`mau_vl`, để kéo lá xanh ngọc về xanh lá mà không làm
  thân cây đỏ quạch), và đổi bảng màu cả gói (Castle Kit có 7 bảng → tháp của nước khác).
  Đèn cũng làm lại: đèn chính ấm + đèn nền nửa cầu + viền lạnh + kéo bão hoà.
- Kết quả: **120 sprite**, 1 trang atlas 2048² cho mỗi cỡ (1× lấp 9,1%, 2× lấp 35,1%).
  Tổng 2 trang / trần 4 của TECH_SPEC mục 2. Có cả máy công thành và ruộng đồng,
  để dành cho Phase 8-10.
- Vòng ĐỔI thứ hai: viết `tools/tai_itch.mjs` để tải gói CC0 từ itch.io. itch giấu đường
  dẫn file sau bốn bước có `csrf_token` và cookie; bước cuối phải gọi vào đường **không**
  mang khoá, gọi vào đường có khoá thì itch trả 404. Lấy **KayKit Medieval Builder Pack**
  (30 công trình nguyên khối: lâu đài, chợ, trại lính, trường bắn, xưởng gỗ, mỏ) và
  **City Builder Bits** (để dành thời hiện đại).
- Hai cái bẫy khi trộn gói của hai tác giả: thước đo khác nhau (ô lưới KayKit rộng 2 đơn
  vị, Kenney rộng 1 → thêm `ti_le`), và không gian màu khác nhau (KayKit xuất từ Blender
  ghi `Kd` tuyến tính → đá xám ra xanh đen; thêm `"gamma": true` đổi sang sRGB).
- Cũng sửa `tools/lib/cdp.mjs`: Chromium chưa hề khai proxy của phiên nên **không mở được
  trang nào ngoài localhost**. Từ trước tới giờ không ai để ý vì chỉ dùng để chụp
  `localhost`. Nay khai `--proxy-server`, giữ nguyên kiểm tra chứng chỉ.
- Đọc mã nguồn mở lấy ý tưởng, ghi ở `docs/HOC_MA_NGUON_MO.md`: Widelands (chuỗi sản xuất
  viết bằng dữ liệu, có cả `return=skipped unless economy needs X`) và Unciv (hiệu ứng
  viết thành câu có tham số, một máy đọc tất). Cả hai chỉ đọc cách nghĩ, không chép code.
- Vòng ĐỔI thứ ba: chủ dự án gửi hai game thương mại. **Heroes of History** dùng máy ảnh
  phối cảnh 3D thật — không cùng kỹ thuật, đuổi theo là quay lại 3D. **Million Lords**
  dùng đúng iso 2:1 sprite nướng sẵn — đó mới là đích so được. Tách ra ba thứ nó hơn,
  đều làm được trong máy nướng: **bóng đổ** (elip mềm trên mặt đất, lệch theo hướng đèn,
  to dần theo chiều cao — thử hình chiếu thật của model trước, các tam giác đè nhau ra
  vệt loang lổ), **tối chân** (`0.62 + 0.38 * smoothstep(0, 0.55, y)` — thiếu nó thì khối
  như dán lên nền), **nâng tông** (sáng ngả ấm, tối ngả lạnh).
- Thêm `tools/xem_canh.mjs` dựng một mảnh làng để nhìn thật. Nó cũng kiểm sớm phần toán
  `ox`/`oy` mà Phase 2 sẽ dùng.
- Bẫy đã sập: trộn lớp nền với lớp vật thể rồi sắp theo độ sâu thì ô nền phía sau **đè
  lên bóng** của nhà phía trước, bóng biến mất sạch. Nền phải vẽ hết trước. Ghi thành
  luật cho Phase 2 ở `TECH_SPEC.md` mục 3.
- Không đuổi kịp chỗ nào: **nét vẽ model**. Kenney và KayKit là CC0 cho không, Million
  Lords có hoạ sĩ ăn lương. Ánh sáng và tông màu thì bắt kịp; hình khối thì không.
- Tổng cuối: **147 sprite**. Bóng đổ nới hộp bao nên atlas 2× cần 2 trang —
  1× lấp 29,7%, 2× lấp 82,8% + 32,9%. Tổng **3 trang / trần 4**.
- `tests/Atlas.test.ts` bắt đỏ nếu ô đè nhau, tràn cạnh, thiếu file trang, hay 2× không
  gấp đôi 1×. `npm run do` → 6/6.

Chưa làm: atlas mới **chưa gắn vào game** — trang đo vẫn dùng atlas giả. Đó là Phase 2.
