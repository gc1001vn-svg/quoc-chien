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

## Thêm cùng ngày — bảng gà (anh nhắc "kho-game có 3, 4 con gà")

- **Anh nói đúng**, bảng 2 bỏ sót: kho-game có ~25 gà thật trên Icosa (CC-BY), 2 gói itch, 2 gà Quaternius trên Poly Pizza (máy ảo
  403), 1 gà Quaternius trong kho chung `tayvuc` (`ultimate-monsters/Blob/Chicken.gltf`, clone thưa đúng một thư mục). Lý do bỏ
  30/09 ("lệch tay vẽ, luật 9") không được đưa lên bảng cho anh tự xem — lần này đưa.
- **Bảng gà 10 ô**, cùng chuồng 4B, cùng cao `0.2` ô (×1,7), phóng 1,5×: G1 Hen, G2 Chicken (Google, game đang dùng) · G3 Daria
  Karpenko · G4 Anya Liu (ra cục xanh) · G5 Maf'j Alvarez · G6 gà trống Neil Nathanson (trục Z, `rx -90`) · G7 lnx00 (khối vuông) ·
  G8 Michael Fuchs (không ra gà) · G9 Styloo (itch, thiếu `chicken_color.png` nên ra trắng; gói không có file LICENSE) ·
  G10 Quaternius quái Blob — **con duy nhất cùng tay vẽ Quaternius lấy được ngay**, đọc ra gà (mào đỏ).
- Mã Icosa: `8Unya0rw9tR 1YE8U35HXsI 5KdUjunuCeL 5b7e4BlUw8D 87XZ2kDlAhh 9f4AUFRblz4 cH9RfVlDQuO ceevYBgv96V`. Model Icosa
  mỗi con một gốc toạ độ, một cỡ: hệ số và độ bù tính từ hộp bao (`docGltf`), không gõ tay.
- **Anh duyệt hàng 2 "lúa lớn dần"** (05/10: "lúa đang lớn dần ok đấy") — dùng cho bước 3 kế hoạch "mọi thứ từng bước".

## Thêm cùng ngày — anh chọn gà G1 + G2; bảng gia súc, gia cầm

- **Anh chọn gà G1 + G2** (05/10) — hai con Google game đang dùng. G1 = `Mesh_Hen`, G2 = `Chicken_01`: hai **bộ thú Google** đặt
  tên theo khuôn. Bộ `Mesh_` đủ lợn, cừu, bò, dê, ngựa, vịt, ngỗng, gà tây, gà; bộ `_01` đủ lợn, bò, dê, ngựa, vịt, gà tây, thỏ —
  **không có cừu**. Quaternius chỉ có gói `farmanimal` (bò, ngựa, lạc đà, lợn, cừu…); gói 12 thú chỉ ở Drive.
- **Bảng 31 chuồng**, cùng rào Quaternius, phóng 1,5×: M1–M9 bộ `Mesh_` · S1–S7 bộ `_01` · Q1–Q5 Quaternius · K1–K10 Google lẻ.
  Cỡ theo loài (ô, trước ×1,7): lợn, cừu, dê 0,18 · bò 0,24 · ngựa 0,28 · lừa 0,24 · vịt 0,16 · ngỗng, gà 0,2 · gà tây 0,22 ·
  thỏ 0,14 — chưa chốt. Quaternius giữ hệ số gói 0,04.
- Mã Icosa: `Mesh_` lợn `6XC3XssJIU_` cừu `49Y7E6vhRxL` bò `4w-_VbcSECP` dê `bNYS7ETDNCt` ngựa `2csviMCmO46` vịt `c1fo7hQgC6J`
  ngỗng `9wn3If7Qgb4` gà tây `bMbD7yiAnML` · `_01` lợn `bbPhEBl5Bh0` bò `6vxANq01J6w` dê `cv4F0pnMLAJ` ngựa `c3lXOu8gooq` (`rx -90`)
  vịt `2KHEgw1ztVI` gà tây `b3E2cqagRPn` thỏ `5YaZxSwLgXR` (`rx -90`). K5 cừu PUSHILIN `aWFQcDSaDyo` nướng ra vụn — bỏ.
- **Vướng luật 1 art bible:** rào, chuồng Quaternius + thú Google = 2 tay vẽ trong một loại công trình, mà luật chỉ cho tay thứ hai
  vẽ cây, đá, người. Chọn thú Google thì phải thêm "thú" vào câu đó — anh quyết.
