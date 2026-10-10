# Đồ nghề đợt 7, 09/10 (lần 41) — không đổi cách chơi

Kế hoạch anh duyệt 09/10 (cả 4 món, thứ tự 3 → 1 → 4 → 2): kho `ghi-nho` `docs/ke-hoach/2026-10-09-nang-cap-dot-7.md`.
**Bản nháp ở nhánh `claude/upbeat-brown-ma61w8`, chưa gộp `main`** — anh xem rồi mới gộp. Đầu phiên `npm run do`: 16 đạt, 2 bỏ qua.

- **Món 3 — game tự báo đã vẽ (`34891b0`):** `#app[data-da-ve]` sau khung đầu, `window.__qc.trangThai()` chỉ đọc
  (`gio, doToi, doi, soNha, nhaDangXay, nguoiVac, sprite, zoom, theMo`). `chup:man`, `quay` chờ cờ thay vì chờ cứng 2,5 s, in
  `Trang thai:`. Đo: 5,3–5,8 → **3,5–3,7 s/ảnh**, ảnh y hệt. `CityScene.ts` đang đúng trần 300 dòng → dời `zoomBanDau` sang
  `ThamSoCanh.ts` (file đó sinh ra để chứa tham số URL tách khỏi `CityScene`).
- **Món 1 — ảnh Safari iPhone giả lập (`27e6b1c`), CHƯA CHẠY:** `?kiem=1` game gửi một GET `__da-ve?<trạng thái>` (Safari giả lập
  không cho máy đọc trang); `scripts/anh_ios.sh` bật `python3 -m http.server`, mở Safari bằng `simctl`, chờ dòng đó rồi chụp.
  Thử phần máy chủ trên máy ảo bằng Chromium: bắt đúng trạng thái. Workflow soạn sẵn `scripts/anh_ios.yml` — **chế độ Auto chặn
  ghi vé file khoá** (`[Instruction Poisoning]`), không lách; chờ anh (TIEN_DO mục 3).
- **Món 4 — độ chắc của test (bản sao scratchpad, không commit):** knip 6.41.0: **0 hàm chết** trong `src/` — 24 "export thừa" đều
  dùng trong chính file; 13 "file không dùng" là báo nhầm (hook gọi từ `.claude/settings.json`, `.mcp.json`, file `.d.mts`).
  StrykerJS 10.0.0 với **vitest 5.0.0 ra 0 % (0/4.293) — sai**: sửa tay `Clock.ts` thì test đỏ ngay. Hạ vitest 4.1.11 trong bản sao:
  `Clock.ts` 78,95 %. **Toàn `src/sim/` không chạy nổi:** lượt đầu có máy đo 16 phút 39 giây, ước ~31 giờ (bỏ 3 file test mô phỏng
  dài Governor, Decision, ThanhPho: vẫn ~2 giờ) — `city/`, `campaign/` để sau. Đo được `decision/` `meta/` `autoplay/` `Clock.ts`
  (bỏ 3 file kia, nên là cận dưới), 938 đột biến, 127 s: **61 %** — decision 63 · meta 66 · autoplay 38 (thấp vì bỏ chính
  `Governor.test.ts`). Ví dụ sót thật: `meta/CongNghe.ts:83` bỏ đọc phần thưởng công nghệ, `:52 :60 :64` bỏ chốt kiểm `tech.json`
  (rỗng, trùng id, quá tiền đề) — không test nào đỏ. Đọc mã trước khi chạy: chỉ reporter `dashboard` gửi ra ngoài (không bật).
- **Món 2 — người chấm độc lập:** `docs/THANG_CHAM_HINH.md`, 4 tiêu chí bằng lời anh. Dựng lại 5 ảnh từ commit cũ anh đã phán,
  Haiku chấm mù: **khớp 4/5**; lệch duy nhất là lỗi thật anh bỏ qua (nút tốc độ hiện mờ xuyên thẻ thứ ba, còn ở bản 09/10).
  Bài học: ảnh phải chứa phần đổi; ghi "ánh sáng" chứ đừng ghi "đèn".
- **Bổ sung 09/10 (sau khi anh đổi chế độ sang `Accept edits`):** anh nhắn "ghi vé anh-ios, rồi gộp main" → ghi vé, tạo
  `.github/workflows/anh-ios.yml` (y bản mẫu, bản mẫu `scripts/anh_ios.yml` xoá), gộp `main`.
- **Chạy thật lần đầu 09/10 11:37 (run 37924853555):** ~10 phút tới lúc có ảnh. Runner không có iPhone 16 Pro → tự lấy iPhone 17
  (iOS 26). WebGL vẽ được, game báo `daVe:"1"`, 405 sprite, 59 fps (GPU Mac). Vướng: bảng gợi ý lần đầu của Safari che thẻ quyết định.
- **Anh bảo "làm luôn" 09/10:** (1) thẻ quyết định nền đặc (`rgba 0,95` → `rgb`) — hết lộ nút tốc độ; (2) `anh_ios.sh` mở nháp
  Safari 15 s rồi tắt, mới mở game — chạy lại trên nhánh: bảng gợi ý **không hiện nữa**, thẻ sạch. Còn: thanh Safari che nửa thẻ thứ ba (kéo được).
- **10/10, anh "dồn thẻ lên cao hơn":** đo trên ảnh iOS — khung game 714 = cửa sổ 714 (`caoApp`, `caoCuaSo` thêm vào trạng thái),
  không phải thanh Safari che; thẻ hụt vì trần 46 % = 327 px mà ba lựa chọn cần 396. Màn dọc trần 62 %, thẻ cao vừa nội dung → đủ ba.
  Đoán đầu (`100svh`) sai, đã gỡ. Mở nháp Safari quá hạn 28 s một lần (máy vừa bật) → thử lại tới 4 lần.
