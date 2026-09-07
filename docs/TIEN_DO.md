# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 07/09/2026 (phiên 2 trong ngày — Phase 3).

## 1. Đang ở đâu

**Phase 3 xong: thành phố sống bằng số.** `src/sim/` hết rỗng. **26 mặt hàng · 28 loại nhà
(86 cái) · 12 chuỗi sản xuất**: bánh mì · xúc xích · gia cầm · cá · nước · rượu bia · muối ·
len-vải · gốm · đồ da · sắt-giáp-vũ khí · gỗ-đá. Dân bậc 1 ăn mặc dùng **chín món**.

`npm run sim:thu` chạy **10 giờ game (360.000 nhịp) trong 0,5 giây**, in bảng tài nguyên
rồi tự chấm ĐẠT/HỎNG.

**Chưa nhìn thấy gì mới trên màn hình — chủ ý.** https://gc1001vn-svg.github.io/quoc-chien/
vẫn là bản đồ trưng bày của Phase 2. `TECH_SPEC.md` mục 1 luật 1: mô phỏng tách hẳn khỏi
phần vẽ. Chủ dự án đã xem đồ hoạ Quaternius trên iPhone và **không chê** (06-07/09).

Chi tiết: `docs/NHAT_KY/PHASE_3.md`. Kế hoạch đã duyệt: `docs/ke-hoach/2026-09-07-phase-3.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **83 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**. Chấm từng giờ game (bỏ giờ đầu vì chuỗi còn mở máy), ba điều:
không hàng âm · mọi nhà chạy được ít nhất một mẻ trong giờ · mọi mặt hàng vừa được làm ra
vừa bị dùng đến.

Đồ hoạ giữ nguyên, mẻ `trung_co_2` **38 sprite**:

| Số đo | Bản 1× | Bản 2× | Trần |
|---|---:|---:|---|
| Trang atlas 2048² | 1 (lấp 22,0 %) | 2 (76,1 % + 10,7 %) | 4 trang |
| Bộ nhớ GPU | 16,8 MB | 33,6 MB | 67,1 MB |
| Sprite chỗ đông nhất, mức 0,35× | 3.316 | 3.236 | 3.500 |
| Lệnh vẽ | 1 | 2 | 4 |

**Chưa ai đo fps trên iPhone với mẻ mới.** Số cũ (18.089 sprite ở `?do=sprite`) đo bằng mẻ
Kenney và **chạm trần công cụ đo chứ không phải trần máy** — đọc `docs/NHAT_KY/PHASE_2B.md`
trước khi trích con số đó.

## 3. Việc của chủ dự án

1. **Xem 12 chuỗi ở mục 1 đã đủ chưa.** Thiếu món nào thì nhắn tên — thêm hai dòng vào
   `data/`, không phải sửa code.
2. **Quyết phiên sau**: xem mục 5. Gõ **TIẾP** là chọn phương án A.
3. **Hai file khoá cần anh đồng ý mới sửa được**, cả hai đều để giảm token mỗi phiên —
   xem mục "Môi trường và cấu hình" trong `docs/NO_KY_THUAT.md`.

**Quy ước đã chốt, khỏi hỏi lại:** đẩy xong là **tự gộp vào `main`**, không hỏi, không mở
pull request. Chủ dự án không phải bấm gì để code lên trang.

## 4. Nợ đang chặn phase kế tiếp

- **28 toà nhà của kinh tế chưa có sprite** — kinh tế có mà nhìn không thấy. Gói Quaternius
  **không có cối xay và giếng**, phải tự ghép từ mảnh tường và mái.
- **`src/sim/` và `src/render/` chưa nối với nhau chút nào.** `BanDoDemo.ts` vẫn là bản đồ
  giả của Phase 2. Phase 4 phải nối, và đó là chỗ dễ vỡ hiệu năng nhất.
- **Chưa đo fps trên iPhone với mẻ đồ hoạ mới** — mà Phase 4 sẽ thêm hàng trăm sprite động.
  Không có số nền thì rớt fps không biết tại ai.

Toàn bộ nợ còn lại (đồ hoạ, code, môi trường, deploy): **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp

**A. Phase 4 — walker (đề xuất).** `src/sim/city/Walkers.ts`: nhà phát ra người vác hàng
theo chu kỳ, đi theo đường, tới đâu phục vụ tới đó trong bán kính, hết việc thì quay về
(cách của Caesar III — `GAME_SPEC.md` mục 4). Thay cho kho chung chuyển tức thì hiện nay,
**không phải đổi một số cân bằng nào**. `KE_HOACH.md` gọi đây là **chỗ nặng nhất của cả dự
án** — mỗi walker là một sprite động, trần là 3.500 sprite. Phải đo kỹ.

**B. Nướng mẻ sprite cho 28 toà nhà mới.** Để nhìn thấy kinh tế trên màn hình.

**C. Chỉnh bốn chỗ đồ hoạ còn yếu** (`docs/NO_KY_THUAT.md`).

**Tôi đề xuất A.** Walker là chỗ rủi ro hiệu năng lớn nhất còn lại; biết sớm thì còn đường
lùi, biết muộn thì đã xây nhiều thứ lên trên nó. Đồ hoạ làm sau còn biết chính xác cần vẽ gì.
