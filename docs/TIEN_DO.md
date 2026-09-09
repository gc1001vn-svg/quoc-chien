# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 09/09/2026 (Phase 6B — nhà kinh tế mọc lên thật).

## 1. Đang ở đâu

**GAME CHƠI ĐƯỢC, VÀ GIỜ NHÌN RA ĐƯỢC.** Phase 6/13 xong, cộng một phiên trả nợ.

Thành phố vẫn hỏi như Phase 6 — đường đông thì hỏi xây kho hay chặt tay thống đốc, kho
lúa mì đầy ứ thì hỏi xay bột hay vỗ béo lợn. Khác ở chỗ: **bấm xong là thấy nhà mọc lên
đúng chỗ**. Cối xay là cái tháp mái nón, lò có ống khói và mái xám, xưởng mái vàng, mỏ là
vách đá có thùng và cuốc, ruộng là luống lúa vàng.

Trước phiên này 94 nhà kinh tế vô hình — nằm trong danh sách riêng của `src/sim/`, không
bao giờ được vẽ. Vì vô hình nên cũng không ai thấy chúng **đang đặt đè lên cây và nhà
trang trí**; giờ hai bên dùng chung một tập ô đã chiếm nên hết đè.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **128 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game không người bấm (tự chọn lựa chọn đầu):
**5 thẻ đã hỏi · 94 → 102 nhà · 4 kho · 89.232 chuyến một giờ · đông nhất 325 người ·
0 lượt bỏ cuộc.** (Phase 6: 84.058 chuyến.)

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung ở 0,35× (thu nhỏ nhất) | 3.498 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Trang atlas, bản 1× | 1 | 4 |
| Trang atlas, bản 2× | 2 | 4 |

12 sprite mới không đẩy atlas sang trang nào mới, nên `ASSET_CREDITS.md` không phải sửa.

**Chưa đo trên iPhone thật.** Số fps thật gần nhất vẫn là 59 fps · 3.441 sprite · 0,35×
(đo trước Phase 5, khi chưa có nhà kinh tế trên màn).

## 3. Việc của chủ dự án

**Mở game trên iPhone, xem có thấy nhà kinh tế mọc lên không, rồi nhắn con số fps.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. Mở link, chờ thành phố hiện ra.
2. Chụm hai ngón **thu nhỏ hết cỡ** để nhìn toàn thành phố.
3. Liếc **góc trên bên trái**, nhắn lại con số fps ở đó (ví dụ "58 fps").
4. Chơi tiếp tới lúc có thẻ hỏi "kho lúa mì đầy ứ", bấm **"Xây hai cối xay"**, rồi nhìn
   quanh xem có mọc lên hai cái tháp mái nón không.

## 4. Nợ đang chặn phase kế tiếp

- **Giếng và cối xay chỉ là hình gần đúng.** Kit Quaternius không có hai model này; giếng
  là cột đá có xô, cối xay là tháp mái nón **không cánh quạt** — công thức nướng chỉ quay
  được quanh trục đứng.
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách kiểu Civ, công nghệ, quân sự, ngoại
  giao thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
