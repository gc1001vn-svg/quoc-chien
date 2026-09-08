# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 08/09/2026 (Phase 6 — thẻ quyết định).

## 1. Đang ở đâu

**GAME CHƠI ĐƯỢC.** Mốc lớn thứ nhất của kế hoạch (Phase 6/13).

Thành phố tự chạy và tự lớn như Phase 5, nhưng giờ nó **hỏi**: đường đông thì hỏi xây kho
hay bắt thống đốc chặt tay; kho lúa mì đầy ứ thì hỏi xay thành bột hay vỗ béo lợn; cá ươn
thì hỏi xây lò ướp. Mỗi thẻ 2–3 lựa chọn, **mặt được và mặt mất in ngay trên nút** — không
có lựa chọn nào hiển nhiên đúng.

Thẻ là tấm chắn trượt lên từ đáy màn, che dưới một nửa: vẫn nhìn thấy thành phố mà quyết.
Sim dừng lúc thẻ hiện, chạy lại đúng tốc độ cũ lúc bấm xong.

Thêm **nút tốc độ** (dừng · 1× · 2× · 4× · 8×) và **nhật ký sự kiện** bốn dòng góc trái.

Chi tiết: `docs/NHAT_KY/PHASE_6.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **124 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game không người bấm (tự chọn lựa chọn đầu):
**5 thẻ đã hỏi · 94 → 105 nhà · 4 kho · 84.058 chuyến một giờ · đông nhất 321 người ·
0 lượt bỏ cuộc.** (Phase 5: 71.156 chuyến.)

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung, bản 1× | 3.326 | 5.000 |
| Sprite một khung, bản 2× | 3.247 | 5.000 |
| Sprite lúc chụp máy ảo (1,00×) | 547 | 5.000 |
| Lệnh vẽ | **1** | 4 |

Tấm chắn và nút tốc độ là HTML, không đụng gì tới phần vẽ. Con số fps trong ảnh máy ảo
không có nghĩa gì — máy ảo vẽ bằng phần mềm.

**iPhone thật, 08/09: chủ dự án đã chơi và duyệt — "đã test ok".** Không có số fps mới;
số fps thật gần nhất vẫn là 59 fps · 3.441 sprite · 0,35× (đo trước Phase 5).

## 3. Việc của chủ dự án

**Không có việc gì đang chờ.** Đã chơi thật trên iPhone 08/09 và duyệt — "đã test ok".
Không nhắn số fps, nên Phase 6 chưa có fps đo trên máy thật; lần sau liếc góc trái trên
rồi nhắn con số là đủ.

## 4. Nợ đang chặn phase kế tiếp

- **32 toà nhà của kinh tế vẫn chưa có sprite.** Bấm nút "xây hai cối xay" mà trên màn
  không thấy gì mọc lên, chỉ thấy đông người hơn. Đây giờ là nợ **nặng nhất**: nó làm hỏng
  chính cái vòng phản hồi mà Phase 6 vừa dựng.
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, và đều là thẻ kinh tế. Thẻ chính sách kiểu Civ, công nghệ, quân sự,
  ngoại giao thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase. Phiên 08/09 đã phá
luật này (làm liền Phase 5 và Phase 6 trong một phiên), đừng lặp lại.

**Cân nhắc chen trước Phase 7:** nướng sprite cho 32 nhà kinh tế. Xong Phase 6 thì đây là
việc trả về nhiều nhất — thấy nhà mọc lên đúng chỗ mình vừa quyết. Chủ dự án chốt.
