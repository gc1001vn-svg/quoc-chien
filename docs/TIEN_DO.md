# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 07/09/2026 (Phase 4).

## 1. Đang ở đâu

**Phase 4 xong: thành phố có người đi lại.** Hàng **không còn chuyển tức thì** — mỗi nhà có
kho riêng, và cách duy nhất để hàng đi từ nhà này sang nhà kia là **một người vác nó đi bộ
trên đường**. Nhà xa đường thì hàng tới chậm; đây là lần đầu bố trí nhà cửa ảnh hưởng tới
kinh tế. Không tìm đường đầy đủ — lưới đường đều nên mỗi bước chỉ là vài phép so sánh
(`GAME_SPEC.md` mục 4, cách của Caesar III).

Kinh tế giữ nguyên Phase 3: **30 mặt hàng · 32 loại nhà (94 cái) · 14 chuỗi**, hàng để lâu
thì hỏng.

`src/render/BanDoDemo.ts` đã thành `src/sim/city/BanDo.ts`. Phần vẽ giờ đọc bản đồ và danh
sách người đi đường **thẳng từ `src/sim/`** — đúng chiều cho phép (`TECH_SPEC` luật 1).

Chi tiết: `docs/NHAT_KY/PHASE_4.md`. Ý tưởng chuỗi còn hoãn: `docs/Y_TUONG_CHUOI.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **88 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game trong 4,2 giây:
**64.184 chuyến một giờ · đông nhất 324 người cùng lúc · 0 lượt bỏ cuộc.**

Ảnh chụp trong máy ảo, mức thu nhỏ 0,35×:

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung | **3.217** | 5.000 (nâng từ 3.500 ngày 07/09) |
| Lệnh vẽ | **1** | 4 |
| Bộ nhớ GPU (bản 1×) | 16,8 MB | 67,1 MB |

**iPhone thật, 07/09: 59 fps · 2.551 sprite · 1 lệnh vẽ · 0,41×.** Trần 5.000 giữ nguyên,
không phải lùi.
Máy ảo vẽ bằng phần mềm nên con số fps trong ảnh máy ảo (12–15) **không có nghĩa gì**.

Ở mức 0,60×: **1.157 sprite là nền và nhà**, tổng dao động **1.315–1.335** ⇒ khoảng
**160–180 người trên màn hình**, con số nhảy liên tục.

## 3. Việc của chủ dự án

**Không có việc gì đang chờ.** Phase 4 đã xem trên iPhone và duyệt: 59 fps, người đi đúng
sau nhà, không ai đứng yên.

**Quy ước đã chốt, khỏi hỏi lại:** đẩy xong là **tự gộp vào `main`**, không hỏi, không mở
pull request. Chủ dự án không phải bấm gì để code lên trang.

## 4. Nợ đang chặn phase kế tiếp

- **ĐÃ TRẢ 07/09 — fps trên iPhone.** Chủ dự án báo **mượt** với walker ở trần 5.000.
- **Người vác hàng dồn thành một dãy nối đuôi** vì cả thành phố chỉ có **một kho ở giữa**.
  Trục vào tâm đông nghịt, đường rìa vắng tanh. Caesar III rải nhiều kho — sửa ở Phase 5.
- **Walker chưa có sprite người**, đang mượn `thung_ruou`. Nhìn ra được vì đồ trang trí
  không bao giờ nằm trên đường, nhưng vẫn sai.
- **32 toà nhà của kinh tế chưa có sprite**, và nhà kinh tế đặt độc lập với vật thể trang
  trí nên nhìn không ra nhà nào là lò bánh. Gói Quaternius **không có cối xay và giếng**.

Toàn bộ nợ còn lại (đồ hoạ, code, môi trường, deploy): **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — ĐÃ CHỐT: nướng sprite người

Chủ dự án chốt cuối phiên 07/09: **phiên sau nướng sprite người**, không làm thống đốc.
Lý do anh ấy đưa ra: *"vì không phải người nên chưa đánh giá cử động có mượt không"*.

**Việc của phiên sau:**

1. Tải lại `assets_source/` (mất theo container — lệnh trong `docs/NO_KY_THUAT.md`).
2. **Tìm gói có model người CC0.** Quaternius có **Ultimate Animated Character Pack** —
   *chưa tải bao giờ, chưa chắc có, chưa chắc hợp phong cách trung cổ*. Không có thì phải
   tìm gói khác; **đừng nướng bừa một model hiện đại vào mẻ trung cổ**.
3. Nướng **4 hướng** (đủ để nhìn ra người đi hướng nào; 8 hướng × 4 dáng để Phase 10).
4. Thay `SPRITE_WALKER` trong `src/render/CityScene.ts`, chọn sprite theo hướng đi.
5. **Trả `dong_thung` và `thung_ruou` về** `data/thanh_pho_demo.json` — đã phải bỏ chúng
   khỏi trang trí vì trùng sprite với người.
6. Kiểm lại trần sprite: thêm hướng là thêm sprite trong atlas, không thêm sprite mỗi khung.

**Sau đó mới tới Phase 5 — thống đốc tự xây** (`src/sim/autoplay/Governor.ts` + `Policy.ts`):
thành phố tự lớn, thiếu bánh mì thì xây thêm lò bánh, đường kẹt thì xây thêm kho. Việc thêm
kho sẽ chữa luôn cảnh người dồn thành một dãy đổ về cái kho duy nhất ở giữa.
