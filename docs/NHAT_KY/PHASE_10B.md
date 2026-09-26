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
  `pkill -f "[v]ite preview"` (ngoặc vuông để mẫu không khớp chính dòng lệnh) — `pgrep -f "\.bin/vite"` trong cùng lệnh Bash cũng tự giết, mắc 3 lần 26/09. `tai_icosa` ghi đè `docs/KHO_ICOSA.md` bằng số model trên đĩa
  máy ảo — `git checkout docs/KHO_ICOSA.md` sau mỗi lần tải lẻ.

## Phụ lục 26/09 trưa — anh xem bản duyệt: 30 fps suốt trận, pháo thủ đứng trước, xe tăng đồ chơi

- **Pháo thủ đứng trước — lỗi máy nướng:** `moRongLinh` xoay model theo 8 hướng mà **không
  xoay độ dời `x/z`** của mảnh. Hướng 0 đúng, hướng khác khẩu pháo văng ra cạnh / ra trước.
  Sửa gốc trong `nuong_sprite.mjs`; `linh_co` (không có độ dời) nướng lại y hệt từng byte.
- **Xe tăng:** đổi sang "Tank" của Nico _ (Icosa CC-BY, màu cát, dáng xe thật). Dò thêm OGA:
  `heavy_tank00.glb` (CC0) dáng viễn tưởng; các gói khác chỉ có `.blend`/`.dae` — máy nướng
  không đọc.
- **fps 30 — giả thuyết: atlas 2 trang.** Shader chọn trang bằng chuỗi `if`; trận cổ 1 trang
  anh đo 59. Cắt khung pháo/chống tăng (đi, đánh 2 · trúng, chết 1), kỵ súng (trúng, chết 1),
  thu pháo → 2× **một trang 76,0 %**, GPU 33,6 → 16,8 MB. **Chưa biết có đúng không** — chờ anh
  đo cả hai trận trên cùng bản duyệt.
- **Kết đo 26/09 chiều:** atlas 1 trang vẫn 30; **trận súng · trận cổ · thành phố đều 30 đứng
  yên**, không bật tiết kiệm pin. Thành phố từng 59 → **không phải lỗi game, bị khoá trần 30
  ở chỗ xem** (khung xem bản duyệt / trình duyệt). Giả thuyết atlas 2 trang: SAI. Việc cắt khung
  vẫn giữ (GPU giảm nửa, không mất gì anh chê). Chờ anh đo lại bằng Safari.
- **Kết thật (26/09 chiều, anh đo bằng Safari):** trận mở ra 30, **bấm ×4 lên 59 ngay**; thành
  phố 59. Safari khoá trang lồng khung (bản duyệt) ở 30 fps tới lần chạm đầu; app Claude khoá 30
  luôn. **Game 59 fps — không có lỗi hiệu năng.** `duyet.mjs`: dòng nhắc "mở Safari, chạm một
  lần" + khung game tự lấp chiều cao (trước cố định `100dvh - 44px`, tiêu đề xuống hai dòng trên
  iPhone đẩy hàng nút dưới ra ngoài — lý do anh "không thấy trận cổ").
