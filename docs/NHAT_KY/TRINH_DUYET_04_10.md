# Nhật ký 04/10 (lần 33) — Claude lái trình duyệt chơi thử game: cài Playwright MCP

**Việc anh giao:** Claude tự vào game chơi thử để học đồ hoạ, hiệu ứng, âm thanh, cách chơi; đo A (script tự viết)
với B (Playwright MCP); anh chọn B, bảo thử thêm game nhập vai.

**Làm:** `.mcp.json` + `scripts/mcp_trinh_duyet.mjs` (nạp CA rồi `npx @playwright/mcp@0.0.83`) +
`tools/lib/moc_am_thanh.js` (nhật ký tiếng, vá AAC). Không thêm gói vào `package.json`. Ghi `docs/MOI_TRUONG.md` mục cuối.

**Đo (máy ảo, cùng kịch bản):** A và B ngang nhau ở bấm, phím, chụp (0,04–0,9 s), 2 lượt gọi mỗi bước "làm + nhìn".
B hơn: báo hộp thoại, lỗi console, mạng kèm mã lỗi, bấm theo tên nút. B tốn 44 công cụ / 31.527 ký tự mô tả.
**Sửa kết luận sai cùng ngày:** Unity không treo vì vẽ CPU — thiếu bộ giải mã AAC làm game `alert()` đứng trang.

**Game nhập vai (4 game itch.io, qua đúng script repo, 76 + 11 bước, 0 bước lỗi, khởi động 2,0 s):**
RPG Maker 14,7 khung/s · Pokémon Overlord 13,7 · Dungeons & Dynasties 60 (bấm theo tên qua màn) ·
Stoneheart Archive Unity 3D 4,0 (vào được đảo, 8 file AAC thay im lặng). Chuỗi phím bấm mù kẹt ở menu
Petrichor — chơi thật phải nhìn từng bước.

**Chưa kiểm:** công cụ `browser_*` có hiện ở phiên mới không — `.mcp.json` chỉ nạp lúc mở phiên.
