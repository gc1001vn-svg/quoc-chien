# Đồ nghề đợt 9, 10/10 (lần 42) — không đổi cách chơi

Kế hoạch anh duyệt 10/10 ("làm hết", 3 món): kho `ghi-nho` `docs/ke-hoach/2026-10-10-nang-cap-dot-9.md`. Nguồn: agent Haiku
đọc lại 78 lượt gọi cuối phiên đợt 8 — chỉ 1 lượt lỗi (hook chặn `pkill -f`, cố ý thử). Đầu phiên `npm run do`: 17 đạt, 2 bỏ qua.

- **Món 1 — hook chặn ngủ chờ việc nền:** `scripts/chan_vong_vo_han.mjs` (đồng bộ từ kho) chặn `sleep ≥ 30` đầu lệnh và vòng
  `sleep` đọc `…/tasks/*.output` — việc nền, agent con tự báo khi xong. Gốc: 4 lần/giờ cuối đợt 8, một vòng chạy thừa 85 s sau khi
  báo cáo đã về. Kho 90 → 96/96 mẫu; chặn đúng lệnh thật trong phiên.
- **Món 2 — `cho_ci.sh` mốc `CHO_SAU`:** không mốc thì lệnh in ngay CI cũ của `main` (đo: `CI=success Deploy=success` tức thì) —
  chờ `anh-ios` ngay sau khi bấm là đọc nhầm. Có mốc: chạy `anh-ios` thật (run tạo ~05:41, đẩy ảnh 05:50:31 UTC), lệnh chờ in
  `Anh iOS=success`; bấm → có ảnh 3 lượt gọi. Ảnh: iPhone 17, `daVe:"1"`, 405 sprite, 188 nhà — chỉ để đo công cụ, không xem lỗi game.
- **Món 3 — chặn 6 máy chủ MCP hỏng của plugin `data`:** `.claude/settings.json` thêm `deniedMcpServers` (do `cai_dat.mjs` ghi,
  tên đủ `plugin:data:<máy>`). `claude mcp list` từ thư mục repo: hỏng 6 → 0; skill `data` còn đủ 10.
- Gộp `main` `3251e69`, CI + Deploy xanh (chờ bằng `cho_ci.sh`, 2 lượt).
- Hook báo "xong" chặn nhầm câu "chạy xong" lần 2 — giữ chốt đợt 8 (không thêm ngoại lệ).
