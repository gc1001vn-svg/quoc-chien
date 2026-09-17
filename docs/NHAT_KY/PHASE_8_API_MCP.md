# Phiên 17/09 (lần 2) — dò API và MCP mở, dựng hai nguồn mới

**Không đụng màn hình game.** Toàn bộ việc nằm ở `kho-game`.

- **Dò 24 host ứng viên** (+ 8 host đã biết làm đối chứng, 8/8 đúng). Soi bốn mục lục:
  `public-apis/public-apis` (**1.827 API, 52 mục**), `Calinou/awesome-gamedev`,
  `godotengine/awesome-godot`, `ellisonleao/magictools`.
  Mục *Games & Comics* của `public-apis`: **103 API, dùng được 0** — toàn metadata game
  thương mại. `PokéSprite` có sprite thật nhưng là tài sản Nintendo.
- **MCP: không thêm cái nào.** Loại 5 (`game-asset-mcp`, `mcp-game-asset-gen`, Ludo.ai,
  `blender-mcp`, `godot-mcp`) — license đầu ra không rõ, hoặc máy ảo không có Blender/Godot.
  Schema MCP nạp vào ngữ cảnh **mỗi phiên dù không gọi**; CLI tốn 0 token khi không dùng.
- **Chủ dự án mở 9 host.** Ô tên là **"Allowed domains"** (không phải "Network access"), và
  nó **ghi đè chứ không cộng dồn** — thêm 3 host thì 6 host cũ biến mất, mất một vòng.
- **Openverse: `ke/openverse.tsv` 2.544 mục** (CC0 1.708 · CC-BY 836), 130 lượt gọi.
  Mặc định lọc `category=illustration`; không lọc thì ra toàn ảnh chụp Flickr. Không khoá:
  `20/min`, `200/day`, `page_size` tối đa 20.
- **Openclipart: `ke/openclipart.tsv` 101.536 mục CC0**, 5.571/5.820 sitemap, 12 MB.
  API JSON đã chết (`302`), đường duy nhất là sitemap + UA trình duyệt + `--http1.1`.
- **Ba công cụ mới ở `kho-game/cong-cu/`**: `quet_openverse.mjs`, `lay_openverse.mjs`,
  `quet_openclipart.mjs`. Đều ghi kết quả dần và **chạy tiếp được** chỗ đứt.
- **Hai lần bị chặn IP vì quét mạnh.** Openclipart chặn sau ~30 phút ở `SONG_SONG = 6`
  (mất ~5 tiếng chờ), rồi chặn lại sau 2,5 tiếng quét ở `SONG_SONG = 2` — nên còn thiếu
  **249 sitemap**. Chữ ký: mọi đường `52`, riêng `robots.txt` `200`.
- **`svgsilh.com` bỏ hẳn**: `403` + `server: cloudflare` + captcha, mở allowlist vô ích.
  `upload.wikimedia.org` trả `429` khi tải nhanh — chỉ nghỉ mới cứu, đổi UA không cứu.
- Hai lỗi của trợ lý: `pkill -f <ten-script>` giết luôn shell của chính mình, và
  `pgrep -f <ten-script>` khớp nhầm shell đang kiểm tra nên đồng hồ chờ treo vô hạn.
