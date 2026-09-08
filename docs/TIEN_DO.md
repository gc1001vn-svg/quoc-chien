# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 08/09/2026 (Phase 5 — thống đốc tự xây).

## 1. Đang ở đâu

**Thành phố tự lớn, không cần ai bấm.** Mỗi giờ game, thống đốc nhìn bảng số của giờ vừa
xong rồi xây thêm **đúng một** thứ: kho nếu đường tắc, nhà nếu kho rỗng mà vẫn có nhà phải
chờ hàng. Trong 10 giờ game: **94 → 102 nhà, 1 → 2 kho**.

Kho thứ hai chữa luôn cái nợ nặng nhất của Phase 4 — người vác hàng dồn thành một dãy nối
đuôi về cái kho duy nhất ở giữa. Người vác hàng giờ đi tới kho **gần nhất**, và số chuyến
một giờ **tăng 10,9 %** dù thành phố đông nhà hơn.

Kho dùng **chung một túi hàng** (nhiều điểm bốc dỡ, một sổ hàng) — chủ dự án chốt 08/09 để
khỏi viết lại toàn bộ kinh tế Phase 3–4. Mặt trái: hàng coi như dịch chuyển tức thì giữa
các kho, chưa thật như Caesar III.

Cấp thống đốc lên theo số nhà (lý trưởng → tri huyện → tri phủ), mỗi cấp nới trần nhà và
trần kho. Mọi ngưỡng và trần nằm trong `data/policy.json`, không nằm trong code.

Chi tiết: `docs/NHAT_KY/PHASE_5.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **108 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game trong 2,3 giây:
**94 → 102 nhà · 1 → 2 kho · 71.156 chuyến một giờ · đông nhất 324 người cùng lúc ·
0 lượt bỏ cuộc.** (Phase 4C: 64.184 chuyến một giờ.)

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung, bản 1× | **3.326** | 5.000 |
| Sprite một khung, bản 2× | 3.247 | 5.000 |
| Lệnh vẽ (ảnh máy ảo) | **1** | 4 |

Ngân sách sprite **không đổi** so với trước Phase 5: sprite đánh dấu kho không rơi vào ô
đông nhất. Con số fps trong ảnh máy ảo không có nghĩa gì — máy ảo vẽ bằng phần mềm.

**iPhone thật, 08/09: chủ dự án đã xem sau Phase 5 và duyệt — "ok".** Không nhắn con số
fps, nên số fps mới nhất có thật vẫn là lần đo trước Phase 5: **59 fps · 3.441 sprite ·
1 lệnh vẽ · 0,35×**. Đừng chép con số đó thành số của Phase 5.

## 3. Việc của chủ dự án

**Không có việc gì đang chờ.** Đã xem trên iPhone 08/09 sau Phase 5 và duyệt.

Đã gật xong trong phiên: tắt hai skill trùng `run` và `simplify` trong `.claude/settings.json`.

## 4. Nợ đang chặn phase kế tiếp

- **32 toà nhà của kinh tế vẫn chưa có sprite.** Nhà kinh tế đặt độc lập với vật thể trang
  trí nên nhìn không ra nhà nào là lò bánh — thống đốc xây thêm nhà mà trên màn hình không
  thấy gì mọc lên, chỉ thấy đông người hơn. Gói Quaternius không có cối xay và giếng.
- **Mỗi kho chưa có túi hàng riêng.** Chốt tạm 08/09; làm thật thì phải viết lại cách nhà
  tìm hàng và thêm người vác kho-sang-kho.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 6: quyết định, game chơi được

`decision/Engine.ts` + `ui/DecisionCard.ts` + nhật ký sự kiện. Đây là **mốc lớn**: xong
Phase 6 là game **chơi được**, không chỉ nhìn.

Việc nhỏ có thể làm kèm: nướng nốt bộ đồ **Ranger** (đã tải sẵn) để thành phố có ba kiểu
người thay vì hai.

**Việc token đã làm xong 08/09:** `CLAUDE.md` đo được **621 token** (31 dòng) — trên mức
khuyến nghị 500 nhưng **không cắt**, mỗi dòng là một luật đã cứu một lỗi. Đã tắt hai skill
trùng trong `.claude/settings.json`: `run` (trùng `npm run chup:man` + `npm run preview`)
và `simplify` (trùng `ponytail`) — ước ~120 token mỗi phiên.

Một chỗ ghi chép cũ **sai, đã sửa**: 8 dòng `skillOverrides` (`dataviz` `design`
`artifact-design` `artifact-diagramming` `artifact-capabilities` `claude-api`
`keybindings-help` `init`) **không phải tên chết**. Xoá thử thì cả 8 skill hiện ngay ra
danh sách, mô tả dài. Đã trả lại đủ. Muốn kiểm một tên có thật không thì tắt/bật rồi nhìn
danh sách skill, đừng đối chiếu file trên đĩa — skill dựng sẵn không nằm trên đĩa.
