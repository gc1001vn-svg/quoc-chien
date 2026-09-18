# Phase 8B — mẻ sprite hiện đại, lên đời là thành phố đổi mặt (18/09/2026)

**Xong.** Mười bốn phiên liền không chạm màn hình game; phiên này chạm.

- **Mẻ `hien_dai`, 74 sprite**, cùng bộ tên với `trung_co_2` nên đổi qua lại được.
  32 loại nhà mỗi loại một dáng riêng, lấy từ **Kenney City Kit** (suburban 21 +
  commercial 19 + industrial 20 dáng, một tác giả, CC0). Người: **Kenney Mini
  Characters**, khung xương 7 khớp. Cây cỏ đá giữ nguyên phần Quaternius của mẻ trung cổ.
- **Trần thật là trang atlas 2×, không phải model.** `ti_le` đồng loạt 2,0 → **3 trang**;
  1,65 → **2 trang**; **1,53 vừa một trang, lấp đầy 76,1 %** (mẻ trung cổ 84,4 %).
  Chốt công thức `min(1.53, 1.9/đáy, 2.33/cao)` — **cấm chuẩn hoá từng model về cùng một
  đáy**, làm vậy thì thùng rác to bằng căn nhà.
- **`ThoiDai.me` hết là chữ chết.** Đời 5–6 trỏ `hien_dai`; `CityScene` đọc
  `meta.thoiDai.doi.me` mỗi khung, khác mẻ đang chạy thì `DoiMeAtlas` nạp bộ mới rồi
  **nhả bộ cũ bằng `gl.deleteTexture`** (TECH_SPEC mục 2). `src/sim/` không biết gì.
- **Bẫy đã sập rồi sửa:** ép mẻ một lần lúc mở màn **không ăn thua** — vòng vẽ gọi lại mỗi
  khung với mẻ của đời hiện tại và kéo ngược về mẻ đời 1. Cờ ép phải nằm trong `DoiMeAtlas`
  và mọi lời gọi `theoDoi` đều về nó.
- **`?me=<tên>` ép một mẻ bất kỳ — cần thật, không phải đồ chơi.** Đời 4 trở đi còn
  `len: null`, đời 3 đòi 270 nhà mà thành phố mới tới 241 → **đời 5 chưa tới được bằng
  cách chơi**. Không có đường ép thì mẻ nướng xong vẫn không ai nhìn được trên máy thật.
- **Máy nướng sửa gốc:** `doiDang` chỉ biết đuôi `_l`/`_r` của Quaternius, nên gương một
  người Kenney (`leg-left`) **không đổi chân** — hai khung bước ra y hệt nhau.
- **Thước `Atlas.test.ts` đếm sai bản chất:** nó cộng số trang của *mọi* file trong
  `public/atlas`, nên thêm một mẻ là đỏ dù không ai giữ hai mẻ cùng lúc. Nay đếm đúng thứ
  nằm trên GPU cùng lúc: một bộ bản đồ + một bộ thành phố, một cỡ.
- Hai bộ nhân vật đã cân rồi loại: `animated-characters-survivors` **chỉ có FBX**;
  `blocky-characters` **không có skin** nên không đặt dáng được.

Số đo: **10/10 thước**. Atlas `hien_dai` 1 trang mỗi cỡ, 16,8 MB GPU / trần 67,1 MB.
Màn thật ở `?me=hien_dai`: **501 sprite · 1 lệnh vẽ**.

## Chủ dự án xem xong (18/09, cùng phiên)

- **"Người to quá"** → `ti_le` 1,25 → 1,0, sprite 2× **131×113 → 111×92** (người mẻ trung
  cổ 116×107). Atlas 2× 76,1 % → **74,1 %**, vẫn một trang.
- **"Cối xay không quay nhỉ"** → đúng, và **chưa bao giờ quay**, kể cả mẻ trung cổ: sprite
  công trình chỉ một khung, chỉ người đi đường có hai. Chủ dự án chốt **làm ở phiên sau** —
  ba bước ghi ở `docs/TIEN_DO.md` mục 5.
- **"Nhà xám xanh quá, đổi màu sáng hơn"** → 28 mảnh nhà (kc, ki, ks) thêm
  `"mau": [1.9, 1.85, 1.7]`. Phải dùng `mau` (nhân, giữ vân hoạ tiết) chứ **không phải
  `mau_vl`**: cả gói City Kit chỉ có **đúng một** material tên `colormap`, nên `mau_vl`
  sơn hết cả nhà lẫn mái lẫn cửa sổ, không tách được. Ba số lệch nhau để kéo màu khỏi
  phía xanh lam. Atlas 2× vẫn **74,1 %**, một trang — nhân màu không đổi kích thước.
- **"Xem có sửa được điều đáng ghi không"** → **sửa được một nửa**, đo thật. `docObj` thêm
  tham số `sonCot`, mẻ khai `"mau_cot"`: bảng màu `colormap.png` chia **16 cột**, toạ độ
  `u` của đỉnh cho biết nó lấy màu ở cột nào — **cột mới là "material" thật của gói này**.
  `ki:building-a` tách được: cột 9 · 11 · 15 là ba mảng khác nhau. Nhưng
  `ks:building-type-a` thì **cột 1 ôm cả mái lẫn tường** nên model đó vẫn không tách được.
  Bốn test ở `tests/Obj.test.ts` dựng file OBJ tí hon, không cần `assets_source/`.
