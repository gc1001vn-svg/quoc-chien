# Phase 10B — lính súng và xe có hình (26/09/2026)

- **Xong:** `?tran=2` (nút "⚔ Trận súng" trong màn trận) xem trận 6 đội súng/hiện đại mỗi bên:
  hoả mai, đại bác, kỵ súng, bộ binh, chống tăng, xe tăng. Mẻ riêng `linh_sung`.
- **Asset:** anh chọn xe tăng `tang_vs` và đại bác `phao_rev` từ bảng so sánh một mẻ. Súng
  tự chọn (vài điểm ảnh khi chơi). Ba model Icosa CC-BY, còn lại Quaternius CC0.
- **Bộ động tác có sẵn `Pistol_Shoot` · `Push_Loop` · `Crouch_Idle_Loop`** — rủi ro "không có
  dáng bắn" trong kế hoạch không xảy ra. Pháo = khẩu pháo + một pháo thủ đẩy/ngắm.
- **Sửa công cụ:** `tai_icosa` chuyển sang Backblaze khi `web.archive.org` ngắt kết nối (1 model
  1 phút 44 giây → 18 model 64 giây) · `gltf.mjs` đọc màu từng đỉnh `COLOR_0` (model Blocks ra
  trắng) · `gan` có `xoay` và `giua`. `linh_co` nướng lại **y hệt từng byte** sau cả ba sửa.
- **Số đo:** atlas `linh_sung` 524 sprite — 1× 33,8 % một trang; 2× **hai trang** (87,9 % +
  40,8 %, GPU 33,6 MB / trần 67,1 MB). Chụp máy ảo: 322 sprite · **1 lệnh vẽ**. Trận mẫu 48,5 s.
- **Còn nợ:** chưa có màn ghi công trong game (CC-BY đòi) · trận chỉ một mẻ, chưa trộn cổ với
  súng · xe tăng không có khung giật · đạn là chấm vàng nhỏ · súng cầm một tay (dáng súng lục).
- **Bẫy:** `pkill -f <mẫu>` giết luôn lệnh của chính mình vì mẫu nằm trong dòng lệnh — dùng
  `pgrep` rồi `kill` theo PID. `tai_icosa` ghi đè `docs/KHO_ICOSA.md` bằng số model trên đĩa
  máy ảo — `git checkout docs/KHO_ICOSA.md` sau mỗi lần tải lẻ.
