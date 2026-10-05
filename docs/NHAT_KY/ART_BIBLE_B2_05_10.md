# Art bible bước 2 — bảng nông trại 2 (05/10/2026)

Anh chọn 05/10 làm tiếp bảng nông trại. Như bảng 1: **chỉ là bảng ảnh, không đổi game** — mẻ thử `thu_nong_trai_2` nướng tạm
rồi xoá, không file nào vào git ngoài nhật ký này. Bảng 1 (30/09): `ART_BIBLE_B2_30_09.md`.

- **Google Drive hết hạn mức** ("Quota exceeded", mọi file của 5 gói Quaternius, 4 đường tải thử, lặp lại cuối phiên). `lay.mjs`
  vẫn báo xong và ghi trang HTML thành `.obj` — lỗi ở `kho-game/cong-cu/drive.mjs`, chưa sửa (repo khác).
- **Đường thay, cùng tác giả, CC0:** nhà trại `lowpoly-farm-buildings` (itch) · cây `nature_crops_pack_by_quaternius.zip` và thú
  `Farm Animals by @Quaternius.zip` (OpenGameArt). **Lợn, cừu trong game đã là Quaternius** (`lowpoly-animated-animals` = gói
  `farmanimal`) — cái "gượng gạo" ở trại là rào đá, lều KayKit và gà, dê Icosa, không phải con lợn.
- **Không lấy được:** luống `Farm_Dirt` (`ultimatefantasyrts`), lừa (`ultimateanimatedanimals`), gà `cutemonsters` — chỉ có trên
  Drive. "Animal Pack Vol.2" trên OpenGameArt là chó, mèo, sói — không phải gói 12 thú. Gà Poly Pizza: anh chưa gửi file.
- **Bảng 23 ô, 5 hàng:** ruộng (hiện tại · đất màu phẳng · `farm_soil` · `farm_furrows` · luống nổi ghép từ tấm có bề dày) ·
  lúa lớn dần 4 giai đoạn + đã gặt · trại lợn, cừu · chuồng gà `ChickenCoop` (không có gà) · bò · ngựa + lạc đà · nhìn xa ½.
- **Hệ số, một hệ số mỗi gói (luật 5)**, rồi nhân 1,7 cho bằng hình hiện tại: nhà trại `0.155` · cây `0.3` · thú `0.04`.
  Bảng 1 dùng mỗi cây một hệ số — sai luật 5. Lúa chín nhuộm `mau [1.3, 1.18, 0.75]` (Kd gốc ra màu kaki xám trên cỏ).
- **Đo sprite (sáng · bão hoà, công thức `do_hinh.mjs`, chỉ điểm ảnh của sprite):** ruộng hiện tại 0,54 · 0,61 → mới 0,35–0,44 ·
  0,56–0,66; trại lợn 0,59 · 0,36 → 0,40 · 0,40; trại cừu 0,63 · 0,35 → 0,50 · 0,53. Bản mới tối hơn vì đất sẫm (mốc G).
- **Bẫy:** `nuong_sprite.mjs` vỡ `Maximum call stack` khi một sprite quá ~120 nghìn đỉnh (`doBong`, `Math.max(...)`) — 224 thân
  `Wheat_3` (738 đỉnh/thân) là vỡ. Ruộng dày ở bước 3 phải tính đỉnh trước. `khoi:dong` đỏ một lần đầu phiên (Chromium chưa mở
  cổng sau 10 s lúc máy ảo vừa lên), chạy lại xanh 4,3 s.
- **Chờ anh chọn mã ô** (`TIEN_DO.md` mục 3). Chọn xong → bước 3: kế hoạch nướng lại mẻ `co_dai`, anh duyệt rồi mới nướng.
