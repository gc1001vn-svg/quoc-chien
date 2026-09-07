# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 07/09/2026 (phiên nướng sprite người, chen giữa Phase 4 và Phase 5).

## 1. Đang ở đâu

**Người vác hàng giờ là người thật.** Nông dân trung cổ, nam và nữ, quay mặt đúng hướng
đang đi, chân đổi bên mỗi bước. Trước đó họ mượn sprite `thung_ruou` — cái thùng biết đi.

Ba điều kế hoạch cũ đoán sai, phát hiện ngay trong phiên: gói *"Ultimate Animated Character
Pack"* **không tồn tại**; gói đúng (**Modular Character Outfits – Fantasy**, CC0) **không có
file OBJ**; và model nằm ở **tư thế chữ T, không kèm cử động**, lại **không có đầu** (đầu ở
gói *Universal Base Characters* riêng, cùng bộ xương 65 khớp). Nên phải viết
`tools/lib/gltf.mjs`: đọc glTF, trộn da theo xương, tự đặt dáng, và cắt mesh theo xương để
lấy cái đầu ghép sang.

Bảng góc xoay xương nằm trong `tools/me/trung_co_2.json`, không nằm trong code (luật 2).
Dáng thứ hai chỉ là bản gương của dáng thứ nhất.

Kinh tế giữ nguyên Phase 3–4: **30 mặt hàng · 32 loại nhà (94 cái) · 14 chuỗi**, mỗi nhà một
kho riêng, hàng chỉ đi được khi có người vác trên đường.

Chi tiết: `docs/NHAT_KY/PHASE_4C.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **96 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game trong 3,3 giây:
**64.184 chuyến một giờ · đông nhất 324 người cùng lúc · 0 lượt bỏ cuộc** — y hệt trước khi
thêm hướng và kiểu vào `Walker`.

Ảnh chụp trong máy ảo:

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung (0,35×) | **3.488** | 5.000 |
| Sprite một khung (0,41×) | 2.597 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Bộ nhớ GPU (bản 1×) | 16,8 MB | 67,1 MB |

Atlas 2× lên **2 trang** (54 sprite) nhưng vẫn **một lệnh vẽ** — cơ chế atlas nhiều trang
chốt 06/09 chạy đúng.

Số sprite tăng so với 07/09 (3.217 → 3.488) vì `dong_thung` và `thung_ruou` đã trở lại làm
đồ trang trí. Máy ảo vẽ bằng phần mềm nên con số fps trong ảnh máy ảo (12) **không có nghĩa gì**.

## 3. Việc của chủ dự án

**Xem trang trên iPhone và cho biết có mượt không** — https://gc1001vn-svg.github.io/quoc-chien/
Nhìn hai thứ: (1) fps ở góc trái còn 55–60 không, (2) người trên đường có ra người không,
có quay đúng hướng đi không.

**Quy ước đã chốt, khỏi hỏi lại:** đẩy xong là **tự gộp vào `main`**, không hỏi, không mở
pull request. Chủ dự án không phải bấm gì để code lên trang.

## 4. Nợ đang chặn phase kế tiếp

- **Người vác hàng dồn thành một dãy nối đuôi** vì cả thành phố chỉ có **một kho ở giữa**.
  Trục vào tâm đông nghịt, đường rìa vắng tanh. Caesar III rải nhiều kho — sửa ở Phase 5.
- **32 toà nhà của kinh tế chưa có sprite**, và nhà kinh tế đặt độc lập với vật thể trang
  trí nên nhìn không ra nhà nào là lò bánh. Gói Quaternius **không có cối xay và giếng**.
- **Chưa đo fps trên iPhone với sprite người.** Đường lùi nếu tụt: `ZOOM_HIEN_WALKER` trong
  `src/render/CityScene.ts` đổi 0 → 0,6.

Toàn bộ nợ còn lại (đồ hoạ, code, môi trường, deploy): **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 5: thống đốc tự xây

`src/sim/autoplay/Governor.ts` + `Policy.ts`: thành phố tự lớn, thiếu bánh mì thì xây thêm
lò bánh, đường kẹt thì xây thêm kho. Việc thêm kho sẽ chữa luôn cảnh người dồn thành một
dãy đổ về cái kho duy nhất ở giữa.

Việc nhỏ có thể làm kèm: nướng nốt bộ đồ **Ranger** trong gói (đã tải sẵn) để thành phố có
ba kiểu người thay vì hai.
