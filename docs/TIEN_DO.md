# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — nhà kinh tế mọc lên thật, tốc độ 30×, cối xay có cánh).

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

**iPhone thật, 10/09: 59 fps · 3.253 sprite · 1 lệnh vẽ** ở mức thu nhỏ hết cỡ, có đủ nhà
kinh tế trên màn — bằng đúng con số đo trước Phase 5, khi màn còn ít hơn 94 toà nhà.

## 3. Việc của chủ dự án

**Xem hai chỗ vừa vá: bảng sự kiện góc trái, và cối xay có cánh chưa.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. Mở link. Ván tự chạy ở 8×.
2. Trả lời thẻ đầu tiên rồi nhìn **góc trái dưới**: bảng sự kiện giờ ba dòng, mỗi dòng
   một sự kiện, chiếm chưa tới nửa bề ngang. Nếu vẫn thấy che nhiều thì nhắn "LỖI".
3. Tìm **cối xay**: tháp mái nón, có **chữ X gỗ** nhô ra một bên — đó là cánh quạt.
4. Thẻ sau phải tới trong khoảng bốn phút ở 30×.

Đã đo trên iPhone 10/09: **59 fps · 3.253 sprite · 1 lệnh vẽ** ở mức thu nhỏ hết cỡ.

## 4. Nợ đang chặn phase kế tiếp

- **Người vác hàng đi tay không.** Chủ dự án nhận ra 09/09: người đi qua đi lại mà trên
  tay không có gì. Kit có sẵn thùng, bao, sọt để gắn vào tay. **Chốt: để Phase 10**, nướng
  một lần cùng bộ 8 hướng × 4 dáng.
- **Giếng chỉ là hình gần đúng** — kit Quaternius không có model giếng, hiện là cột đá có
  xô. (Cối xay đã có cánh quạt thật từ 10/09.)
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách kiểu Civ, công nghệ, quân sự, ngoại
  giao thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
