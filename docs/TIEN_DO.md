# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 07/09/2026 (phiên 2 trong ngày — Phase 3).

## 1. Đang ở đâu

**Phase 3 xong: thành phố đã sống bằng số.** `src/sim/` hết rỗng. **21 mặt hàng · 23 loại
nhà (80 cái) · 9 chuỗi sản xuất**: bánh mì · xúc xích · gia cầm · cá · nước · rượu bia ·
đồ da · sắt-giáp-vũ khí · gỗ-đá. Dân bậc 1 ăn bảy món.

`npm run sim:thu` chạy **10 giờ game (360.000 nhịp) trong 0,47 giây**, in bảng tài nguyên
rồi tự chấm ĐẠT/HỎNG. Không hàng âm, không chuỗi nào kẹt vĩnh viễn.

**Chưa nhìn thấy gì mới trên màn hình — chủ ý.** Trang
https://gc1001vn-svg.github.io/quoc-chien/ vẫn y hệt phiên trước: bản đồ trưng bày của
Phase 2, đồ hoạ Quaternius. Phase 3 không đụng một điểm ảnh nào (`TECH_SPEC.md` mục 1,
luật 1: mô phỏng tách hẳn khỏi phần vẽ).

Chi tiết cả phiên: `docs/NHAT_KY/PHASE_3.md`. Kế hoạch đã duyệt:
`docs/ke-hoach/2026-09-07-phase-3.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test **83 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**. Chấm từng giờ game một (bỏ giờ đầu vì chuỗi còn mở máy), ba
điều kiện: không hàng âm · mọi nhà chạy được ít nhất một mẻ trong giờ · mọi mặt hàng vừa
được làm ra vừa bị dùng đến.

Đồ hoạ giữ nguyên từ phiên trước, mẻ `trung_co_2` **38 sprite**:

| Số đo | Bản 1× | Bản 2× | Trần |
|---|---:|---:|---|
| Trang atlas 2048² | 1 (lấp 22,0 %) | 2 (76,1 % + 10,7 %) | 4 trang |
| Bộ nhớ GPU | 16,8 MB | 33,6 MB | 67,1 MB |
| Sprite chỗ đông nhất, mức 0,35× | 3.316 | 3.236 | 3.500 |
| Lệnh vẽ | 1 | 2 | 4 |

**Vẫn chưa ai đo fps trên iPhone thật với mẻ mới.** Số cũ (18.089 sprite ở `?do=sprite`)
đo bằng mẻ Kenney và **chạm trần công cụ đo chứ không phải trần máy** — đọc lại
`docs/NHAT_KY/PHASE_2B.md` trước khi trích con số đó.

## 3. Việc của chủ dự án

1. **Mở https://gc1001vn-svg.github.io/quoc-chien/ trên iPhone và xem đồ hoạ.** Việc này
   treo từ phiên trước, vẫn chưa có câu trả lời. Nếu vẫn ra đồ hoạ cũ thì tắt hẳn Safari
   rồi mở lại — PWA giữ bản cũ trong máy.
2. **Xem 9 chuỗi ở mục 1 đã đủ món chưa.** Thiếu món nào thì nói tên — thêm một dòng vào
   `data/wares.json` và một dòng vào `data/buildings.json`, **không phải sửa code**.
3. Quyết phiên sau: **Phase 4 (walker)** hay **quay lại đồ hoạ** — xem mục 5.

## 4. Nợ kỹ thuật

- **23 toà nhà mới chưa có sprite.** Giếng · cối xay · lò mổ · vườn nho · nhà bia · xưởng
  thuộc da · mỏ than · mỏ đá… hiện chỉ là số trong `data/`. Phase 4 vẽ được người đi lại
  nhưng nhà thì vẫn là nhà cũ của bản đồ trưng bày cho tới khi nướng mẻ mới.
- **Bốn chỗ đồ hoạ tự thấy còn yếu**, chưa sửa:
  - **Nhà nhỏ gần bằng nhà lớn.** Mái nhỏ nhất của gói đã rộng 2 ô, nên nhà "1 ô" vẫn
    tràn sang ô bên. Muốn nhà nhỏ thật thì phải tự ghép mái từ mảnh rời.
  - **Bốn màu mái nhưng nâu và đỏ khó phân biệt** ở mức thu nhỏ.
  - **Ô ruộng mới chỉ là mảng đất trơn**, chưa có luống.
  - **Cổng làng đọc không rõ** — thanh gỗ ngang mảnh quá, nhìn ra hai cột đá lẻ.
- **Không có cối xay và giếng đúng phong cách.** Đã tìm hết: Medieval Village (176 model)
  và Stylized Nature (68 model) đều không có. Farm Buildings có đủ `Windmill` `Well`
  `Barn` `Silo` nhưng là **nông trại Mỹ thế kỷ 19**, đã nướng thử rồi bỏ (lý do ở
  `docs/ASSET_CREDITS.md`). `Ultimate Modular Ruins` **không tồn tại** trên itch của
  Quaternius — đã liệt kê đủ 30 gói. Phương án còn lại: **tự ghép từ mảnh tường và mái**.
  Nay thành nợ gấp hơn vì `data/buildings.json` đã có cả hai.
- **Node bóc kiểu TypeScript có hai điều cấm.** `src/sim/` phải ghi đủ đuôi `.ts` trong
  import, và **cấm `constructor(readonly x: T)`** (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`).
  Sai là `npm run sim:thu` chết trong khi `npm test` vẫn xanh — dễ lọt. Đường lùi nếu về
  sau vướng nữa: cài `tsx` (MIT), phải hỏi chủ dự án trước.
- **Chưa có `State.ts` và chưa lưu ván được.** `ThanhPho` giữ trạng thái trong bộ nhớ,
  chưa có cách ghi ra và đọc lại. Phase 13 mới cần, nhưng để càng lâu càng khó gỡ.
- **Máy nướng chỉ có phép NHÂN màu, không có phép CỘNG.** Vì thế lá cây không bao giờ ra
  xanh tự nhiên (mọi ảnh lá Quaternius có **kênh lam = 0**) và mái không bao giờ ra xám
  (nhân không khử được bão hoà). Thêm `cong_vl` phải nới thuộc tính đỉnh trong `obj.mjs`
  và `trang_nuong.js`. Ghi lại để **khỏi thử chữa lại bằng cách nhân** — đã sập ba lần.
- **Bản 2× dùng 2 trang atlas** trong khi tổng diện tích sprite chỉ **0,867 trang**: cách
  xếp kệ (`tools/lib/xep.mjs`) bỏ phí. Xếp khít thì về 1 trang và bớt một lệnh vẽ. Chưa
  đáng vì trần là 4 trang.
- **Chưa cắt sát theo kênh alpha lúc XẾP.** Bóng đổ vẫn nới hộp bao từng sprite. Khác với
  phép cắt alpha trong shader: cái đó sửa **màu**, cái này sửa **chỗ**.
- **Shader nhiều trang có thể tốn băng thông trên iPhone**: GPU di động thường chạy hết
  mọi nhánh `if`, tức mỗi điểm ảnh đọc 2 ảnh thay vì 1. Chưa đo được. Rớt fps thì lùi về
  bộ 1× — sửa `coTheoDpr` trong `src/render/Atlas.ts`, một dòng.
- **`CLAUDE.md` vẫn ghi "deploy Vercel"** trong khi đã chuyển GitHub Pages từ 06/09.
  File khoá, nợ từ ba phiên trước, chưa sửa.
- **9 dòng thừa trong `.claude/settings.json`.** Tám tên skill (`dataviz` `design`
  `artifact-design` `artifact-diagramming` `artifact-capabilities` `claude-api`
  `keybindings-help` `init`) **không tồn tại** trong Claude Code, tiết kiệm **0 token**;
  `session-start-hook` khai sai tên bên trong (`startup-hook-skill`) nên nhiều khả năng
  không khớp. Phần thật sự có ăn: 6 skill `off` ≈ 945 token + 5 skill `ponytail-*` để
  `user-invocable-only` ≈ 452 token, tổng ≈ **1.400 token/phiên**. File khoá, chờ anh đồng ý.
- **Không kéo được kho `ghi-nho` từ máy ảo phiên này.** `git clone` hỏi mật khẩu, gọi
  `add_repo` thì bị chặn. Đã làm việc theo bốn dòng cốt lõi thuộc lòng trong skill. Nếu
  phiên sau vẫn chặn thì phải sửa cách cấp quyền, đừng để mất kho ghi nhớ chung.
- `tests/NganSachSprite.test.ts` **chép lại** phép cắt của `CityScene.datSprite`. Sửa một
  bên mà quên bên kia thì test hết ý nghĩa. Cảnh báo ghi ngay đầu file test.
- `src/render/BanDoDemo.ts` là bản đồ giả. Phase 4 hoặc 5 mới thay bằng `src/sim/` thật —
  hai bên hiện **chưa nối với nhau chút nào**.
- **KayKit City Builder Bits** đã kê trong `ASSET_CREDITS` nhưng **chưa nướng** — đồ hiện
  đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.
- `assets_source/` **mất theo container** mỗi phiên (đúng luật, không lên git). Phiên sau
  tải lại ~440 MB, mất khoảng một phút:
  `node tools/tai_itch.mjs quaternius/medieval-village-megakit quaternius/stylized-nature-megakit quaternius/fantasy-props-megakit`
  rồi `node tools/tai_hoa_tiet.mjs sparse_grass leafy_grass brown_mud_dry cobblestone_01 dry_river_pebbles coast_sand_01 aerial_rocks_02 clay_plaster clay_roof_tiles_02`.
  (`npm run tai:asset` và `npm run tai:itch` chỉ cần khi muốn dựng lại mẻ Kenney cũ.)
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
- **Deploy: GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`.
  Máy ảo bị chặn hết nhà cung cấp hosting → deploy giao cho máy CI. Repo phải **công khai**.
  Ba chốt chặn đã mở bằng tay 06/09: repo công khai · `Settings > Pages > Source: GitHub
  Actions` · `Settings > Environments > github-pages > Deployment branches` có `main`.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên
  máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký là tự kiểm được.

## 5. Phase kế tiếp

**A. Phase 4 — walker (đề xuất).** `src/sim/city/Walkers.ts`: nhà phát ra người vác hàng
theo chu kỳ, đi theo đường, tới đâu phục vụ tới đó trong bán kính, hết việc thì quay về
(cách của Caesar III — `GAME_SPEC.md` mục 4). Thay cho kho chung chuyển tức thì hiện nay,
**không phải đổi một số cân bằng nào**. `KE_HOACH.md` gọi đây là **chỗ nặng nhất của cả
dự án** — mỗi walker là một sprite động, mà trần là 3.500 sprite. Phải đo kỹ.

**B. Nướng mẻ sprite cho 23 toà nhà mới.** Giếng, cối xay, lò mổ, vườn nho… Hiện kinh tế
có mà nhìn không thấy. Vướng: gói Quaternius không có cối xay và giếng, phải tự ghép.

**C. Chỉnh bốn chỗ đồ hoạ còn yếu** ở mục 4.

**Tôi đề xuất A.** Walker là chỗ rủi ro hiệu năng lớn nhất còn lại của cả dự án; biết sớm
thì còn đường lùi, biết muộn thì đã xây nhiều thứ lên trên nó. Đồ hoạ (B và C) làm lúc nào
cũng được, và làm sau còn biết chính xác cần vẽ những gì.

**Nhưng nếu anh đã mở iPhone xem mà thấy đồ hoạ chưa được**, thì nói ngay — chỗ đó ưu tiên
trước A, vì cả dự án đứng trên nó.
