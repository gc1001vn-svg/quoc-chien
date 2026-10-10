# Art bible bước 3 — trả lời 3 việc chờ, bảng thử, kế hoạch (10/10/2026)

Phiên mở ở kho `ghi-nho`, `add_repo` repo này sau khi anh nhắn "ok làm đi". **Không đổi game**: mẻ thử `thu_co_dai_3`
nướng tạm rồi xoá, không file nào vào git ngoài docs.

- **Anh trả lời 10/10** ("cái này bạn tự chọn tôi đã lướt qua fps đều 59"): ngày/đêm 59 fps · bản 04/10 59 fps, không báo
  giật · bảng nông trại giao Claude chọn. Độ tối đêm giữ nguyên (anh xem rồi, không chê). Câu "đời hiện đại xanh quá không":
  anh không trả lời, giữ nguyên.
- **Claude chọn:** ruộng **1E** (1C, 1D là hoạ tiết ảnh chụp Poly Haven — luật 9 cấm; 1B đất phẳng, zoom xa khó nhận ra
  ruộng) · lợn, cừu **Q** (game đang dùng, cùng tay rào; gượng gạo 05/10 là rào đá, lều, dê — không phải lợn) · luật 1
  thêm **"gà"**, không thêm "thú" (Quaternius không có gà dùng được; mở "thú" thì mọi bộ thú lạ lọt vào).
- **Drive tải lại được:** `lay.mjs quaternius ultimatefantasyrts --chi obj` ra 259 file, 128 OBJ, 0 file HTML giả (hết
  hạn mức 05/10). Lệnh hết giờ 300 s nhưng đã đủ OBJ. Gói **màu phẳng** (chỉ `Kd`, 0 `map_Kd`) như `farmbuildings`.
- **Bảng thử 22 hình, hệ số 2,2:** 70,4 % một trang 2×. Nhà dân 335–398 px rộng (bây giờ `nha_dan` 381); đền 717 (nhà bia
  390), cối xay 566 (408), mỏ 512 (321), luống 466 (ruộng 278). Nhà chỉ có vật liệu `Stone`, `Wood` → mái, tường cùng màu.
  Cối xay một `o`, không `g` → cánh không tách để quay. Lúa `Farm_FirstAge_Level1–3_Wheat` đọc ra 3 bậc lớn dần.
- **Ước cả mẻ** (33 hình thay theo bảng vai trò, 4 hình lúa thêm, 43 hình giữ = 23,9 % trang): 2,2 → 145 % · 1,8 → 105 % ·
  1,6 → 88 % trang 2×; 1× ≤ 36 %. Chỉ diện tích hình, chưa tính hao khi xếp.
- **Gemini phản biện kế hoạch** (rơi xuống `flash-lite` vì 429): 3 ý — "105 % gây tràn bộ nhớ" sai (trang 2 khai sẵn,
  shader đọc 4 trang một lệnh vẽ) · "mái tường cùng màu khó nhìn ở khung nhỏ" đúng một nửa → thêm ảnh zoom xa nhất vào
  phần đo · "hitbox lệch logic" không áp (sim tính theo ô, không theo hình).
- `docs/ASSET_CREDITS.md` dòng `co_dai_2x_1.png` ghi "trang trống" — dùng thật trang 2 là dòng đó sai → file khoá, cần anh.
