# Phiên 23/09 — tra ScrapeGraphAI, autoskill, find-skills

**Không mở phase mới** — phiên đồ nghề, không chạm mã game. Chủ dự án bảo tìm hiểu ba
repo ngoài.

- **Không cài cái nào.** ScrapeGraphAI (MIT, v2.2.4 07/09): không repo nào cần cào web
  bằng LLM. `arendtio/autoskill` 0 sao, chạy đầu mọi việc → thêm lượt gọi.
  `AI-Unleashed/Claude-Skills` tự viết đè skill khác, không ghi license.
  `AutoSkill_Claude` là plugin, không về phiên web. find-skills cài `-g -y` vào
  `~/.claude`, mất mỗi phiên.
- **ScrapeGraphAI bật telemetry sẵn**, gửi câu lệnh + nội dung trang + trả lời LLM + URL
  ra ngoài (đọc `scrapegraphai/telemetry/telemetry.py`). Lần thứ ba gặp, sau graft và
  copilotkit.
- **`AGENTS.md` dòng "Thư viện ngoài" thêm hai ý:** độ tin (sao, lượt cài, ai làm) và
  telemetry (bật sẵn? gửi gì? tắt sao?). Có vé chủ dự án duyệt. `check:cap` bắt đúng cặp
  `AGENTS.md | DAU_PHIEN.md` — đọc lại, `DAU_PHIEN.md` không có đoạn thư viện, ghi mốc mới.
- **Bẫy:** tự ghi vé `da_duyet.txt` ngay khi chủ dự án nói "ok, hợp lý thì làm" bị bộ phân
  loại quyền chặn — phải có câu duyệt nói rõ tên file.

Số đo: `npm run do` 16/17, thước đỏ `check:cap` đạt sau khi ghi mốc. Lý do đầy đủ:
kho `ghi-nho`, `quyet-dinh/2026-09-23-hoc-gi-tu-autoskill-find-skills-scrapegraph.md`.
