# Art bible bước 2 — bảng nông trại (30/09/2026)

Anh chọn mục 1 ("art bible bước 2–3") cuối phiên Thử 3, bảo làm luôn trong phiên đó. Bước 2 chỉ là bảng ảnh —
**không đổi game**: mẻ thử nướng tạm rồi xoá, không file nào vào git ngoài nhật ký này.

- **Tải:** `node /home/user/kho-game/cong-cu/lay.mjs quaternius farmbuildings farmanimal ultimatecrops cutemonsters --chi obj --dich assets_source`
  (+ `--chi gltf` cho `cutemonsters`). `farmbuildings`, `farmanimal`, `ultimatecrops` **màu phẳng** (chỉ `Kd` trong `.mtl`,
  kit `anh: false`) — cùng kiểu KayKit, **khác** nhà dân Quaternius có hoạ tiết. Không có gói nào có luống đất → tấm `phang` tô màu.
- **Mẻ thử `thu_nong_trai`** (6 sprite, 2×, 1 trang 2,1 %): ruộng lúa mì / ngô / cà rốt trên đất `[0.5, 0.34, 0.2]`, trại gà / lợn / cừu
  rào `Fence` ba mặt. Hệ số cỡ mỗi gói (đã nhân 1,7 cho bằng cỡ hình hiện tại ~2 ô): nhà trại `0.2635` · lúa mì `0.714` · ngô `0.34` ·
  cà rốt `0.425` · lợn `0.0646` · cừu `0.0714` · gà `0.153` · tấm đất `phang 1.734`.
- **Thấy trên bảng:** ruộng Quaternius đúng mốc G (luống đất sẫm, cây thẳng hàng, mỗi luống một loại). Trại lợn, cừu gọn, một tay vẽ.
  **Gà `cutemonsters` ra cục xám-ô liu, không đọc ra gà** — gói hoạt hình, như art bible mục 4 đã ngờ. Lúa mì thân mảnh, thưa.
- Hình hiện tại chiếm ~2 ô dù nhà chỉ giữ 1 ô (`o: 1`); bản thử 1 ô đầu tiên trông nhỏ hẳn → phóng 1,7.
- Chụp bảng: trang HTML cắt sprite thẳng từ hai atlas, cùng tỉ lệ, cùng nền cỏ; Chromium `TrinhDuyet` (máy ảo không có PIL, ffmpeg).
- Bẫy: bộ kiểm lệnh máy ảo lỗi tạm 6 lần liền giữa phiên → dừng, chờ anh nhắn "tiếp" (tới 10 lần thì lượt tự dừng).
- **Chờ anh chọn** (`TIEN_DO.md` mục 3). Chưa nướng lại mẻ `co_dai` — đó là bước 3, cần kế hoạch và anh duyệt.
