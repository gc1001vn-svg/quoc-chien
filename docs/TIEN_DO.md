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

1. **Xem lại trang trên iPhone** — giờ phải thấy dòng người đi trên đường. Lần trước đứng
   im vì hai lỗi đã sửa.
2. **Quyết phiên sau**: xem mục 5. Gõ **TIẾP** là chọn phương án A.

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

## 5. Phase kế tiếp

**A. Phase 5 — thống đốc tự xây (đề xuất).** `src/sim/autoplay/Governor.ts` + `Policy.ts`:
thành phố tự lớn theo chính sách người chơi đặt, không cần ai bấm. Đây là thứ biến đống số
hiện tại thành một thành phố **sống**: thấy thiếu bánh mì thì xây thêm lò bánh, thấy walker
quá tải thì xây thêm kho. `KE_HOACH.md` mục 2 giao đúng việc này cho Phase 5.

**B. Nướng sprite cho 32 toà nhà kinh tế + người vác hàng.** Để nhìn ra nhà nào là lò bánh,
và để walker thôi là cái thùng rượu biết đi. Vướng: gói Quaternius không có cối xay, giếng,
lẫn model người — phải tự ghép hoặc tìm gói khác.

**C. Nối nhà kinh tế với vật thể trang trí làm một.** Hiện là hai danh sách riêng.

**Tôi đề xuất A** nếu anh báo iPhone chạy mượt. **Nếu iPhone giật thì B và C đều phải chờ**
— thêm sprite lúc đang quá tải là làm nặng thêm. Lúc đó việc đầu tiên là hạ tải, một dòng.
