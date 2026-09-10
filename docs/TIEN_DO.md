# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — nhà kinh tế mọc lên thật, 30×, model KayKit, thành phố ×2).

## 1. Đang ở đâu

**GAME CHƠI ĐƯỢC, VÀ GIỜ NHÌN RA ĐƯỢC.** Phase 6/13 xong, cộng một phiên trả nợ.

Thành phố vẫn hỏi như Phase 6 — đường đông thì hỏi xây kho hay chặt tay thống đốc, kho
lúa mì đầy ứ thì hỏi xay bột hay vỗ béo lợn. Khác ở chỗ: **bấm xong là thấy nhà mọc lên
đúng chỗ**. Cối xay là cối xay gió có cánh, lò có ống khói và mái xám, chợ có quầy, mỏ là
vách đá có thùng và cuốc, ruộng là luống lúa vàng.

Trước phiên này 94 nhà kinh tế vô hình — nằm trong danh sách riêng của `src/sim/`, không
bao giờ được vẽ. Vì vô hình nên cũng không ai thấy chúng **đang đặt đè lên cây và nhà
trang trí**; giờ hai bên dùng chung một tập ô đã chiếm nên hết đè.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **128 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game không người bấm (tự chọn lựa chọn đầu):
**6 thẻ đã hỏi · 188 → 201 nhà · 6 kho · 215.217 chuyến một giờ · đông nhất 655 người ·
0 lượt bỏ cuộc.** (Trước khi nhân đôi: 89.232 chuyến, 94 nhà.)

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung ở 0,35× (thu nhỏ nhất) | 3.546 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Trang atlas, bản 1× | 1 | 4 |
| Trang atlas, bản 2× | 2 | 4 |

12 sprite mới không đẩy atlas sang trang nào mới, nên `ASSET_CREDITS.md` không phải sửa.

**iPhone thật, 10/09: 59 fps · 3.253 sprite · 1 lệnh vẽ** ở mức thu nhỏ hết cỡ, có đủ nhà
kinh tế trên màn — bằng đúng con số đo trước Phase 5, khi màn còn ít hơn 94 toà nhà.

## 3. Việc của chủ dự án

**Xem hai chỗ vừa vá: bảng sự kiện góc trái, và cối xay có cánh chưa.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. Mở link. Ván tự chạy ở 8×.
2. **Mở link HAI LẦN** — lần đầu máy còn dùng bản cũ đã lưu, lần sau mới thấy bản mới.
3. Trả lời thẻ đầu tiên rồi nhìn **góc trái dưới**: bảng sự kiện nằm TRÊN hàng nút tốc
   độ, không đè lên nút nào nữa. Cầm dọc cũng phải không đè.
4. Bấm thẻ xây nhà → **màn hình tự trượt tới chỗ nhà vừa mọc**.
5. Thành phố giờ **gấp đôi**: 188 nhà, 6 cối xay thay vì 3. Tìm cối xay gió thân đá cánh
   quạt gỗ, ruộng lúa vàng có hàng rào, hầm mỏ trong vách đá, xưởng cưa có đống gỗ.

Đã đo trên iPhone 10/09: **59 fps · 3.253 sprite · 1 lệnh vẽ** ở mức thu nhỏ hết cỡ.

## 4. Nợ đang chặn phase kế tiếp

- **Người vác hàng đi tay không.** Chủ dự án nhận ra 09/09: người đi qua đi lại mà trên
  tay không có gì. Kit có sẵn thùng, bao, sọt để gắn vào tay. **Chốt: để Phase 10**, nướng
  một lần cùng bộ 8 hướng × 4 dáng.
- ~~Giếng và cối xay chỉ là hình gần đúng~~ — **ĐÃ TRẢ 10/09**: sáu toà nhà lấy model
  thật của KayKit (cối xay gió, giếng, hầm mỏ, ruộng lúa, xưởng cưa, chợ).
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách kiểu Civ, công nghệ, quân sự, ngoại
  giao thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

**Trước khi làm bất cứ thứ gì trong các phase sau, dò hai file này:**
`docs/KHO_ASSET.md` (1.855 model đã tải) → `docs/NGUON_MO.md` (nguồn ngoài đã tra) →
không có thì hỏi chủ dự án. Luật ba bước ở `CLAUDE.md` mục Quy ước.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
