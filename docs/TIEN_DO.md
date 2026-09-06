# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 06/09/2026.

## 1. Đang ở đâu

**Phase 2 XONG và đã gộp vào `main`** — thành phố isometric chạy trên
https://gc1001vn-svg.github.io/quoc-chien/ , đó là thứ đang có trên iPhone chủ dự án.

**Phase 2B — đổi hẳn đồ hoạ sang Quaternius. Đang làm dở, chưa vào game.**
Mẻ mới `tools/me/trung_co_2.json` có **22 sprite**: 6 ô nền (mặt phẳng liền, cỏ đồng
màu), 5 công trình (nhà lớn vữa/gạch, nhà dài, tháp canh, nhà nhỏ), 11 cây cối và đá.
Nhìn đẹp hơn hẳn mẻ Kenney — mái ngói thấy từng viên, tường đá có vân, hồi khung gỗ.

Máy nướng đã đổi sang **ảnh theo từng đỉnh** (`e57a97d`), thêm mảnh `phang` để tự sinh
ô nền, thêm `tools/tai_hoa_tiet.mjs` tải hoạ tiết CC0 của Poly Haven.

Chi tiết cả phiên: `docs/NHAT_KY/PHASE_2B.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 49 test · build ·
check:base · check:credits).

Mẻ mới `trung_co_2`: 22 sprite, **1 trang atlas** mỗi cỡ, 16,8 MB GPU (trần 4 trang
≈ 67 MB). Còn rất nhiều chỗ cho phần công trình còn thiếu.

Số của game **đang chạy** (mẻ Kenney cũ, không đổi trong phiên này):

| Mức thu phóng | Sprite mỗi khung | Lệnh vẽ | Trần |
|---|---:|---:|---|
| 2,00× | ~150 | 1 | 1.500 sprite · 4 lệnh vẽ |
| 1,00× | 469 | 1 | |
| 0,60× (nhỏ nhất) | 1.186 | 1 | |

**fps trên iPhone: 18.089 sprite ở trang `?do=sprite`** — nhưng đó là **bậc áp chót của
dãy đo**, bậc sau là 24.000 = đúng sức chứa bộ đệm. Con số **chạm trần công cụ đo, không
phải trần máy**. Trần dự án 1.500, chỗ đông nhất thật 1.186 → **dư hơn 15 lần**.
Đã chốt **ship cỡ 2×**, bỏ phương án lùi 1×.

## 3. Việc của chủ dự án

1. **Duyệt tiếp Phase 2B** — phiên sau làm: nhà nhiều màu mái và kiểu tường (giờ 5 nhà
   đều mái đỏ tường xám), bịt trần nhà nhỏ (đang nhìn xuyên vào thấy rỗng), thêm cối xay
   / giếng / chợ / ruộng, và thử gói `Ultimate Modular Ruins` làm lâu đài với tường thành.
2. **Quyết lúc nào ráp mẻ mới vào game.** Đổi vài hằng số `ME` trong
   `src/render/CityScene.ts` và `src/bench/DoSprite.ts`, cộng `data/thanh_pho_demo.json`
   đổi sang tên sprite mới. Nhưng cần sửa `docs/TECH_SPEC.md` mục 3 và
   `docs/ASSET_CREDITS.md` — **hai file khoá, phải anh cho phép**.
3. Ba việc còn treo ở mục 4 dưới: `CLAUDE.md` ghi nhầm Vercel · 9 dòng thừa trong
   `.claude/settings.json` · công trình 2×2 ô cần khái niệm "chiếm nhiều ô" trong bản đồ.

## 4. Nợ kỹ thuật

- **`skillOverrides` có ăn — nhưng ghi chép 06/09 đã sai, nay sửa lại.** Kiểm bằng cách
  đối chiếu danh sách skill harness in ra với file trên đĩa:
  - Chạy thật: 6 skill `off` (`pptx` `docx` `xlsx` `pdf` `vsp-safety-expert` `vsp-van-ban`)
    ≈ **945 token/phiên**, và 5 skill `ponytail-*` để `user-invocable-only` ≈ **452 token**.
    Tổng đang tiết kiệm ≈ **1.400 token/phiên**.
  - **Không chạy**: 9 dòng thêm 06/09. Tám tên (`dataviz` `design` `artifact-design`
    `artifact-diagramming` `artifact-capabilities` `claude-api` `keybindings-help` `init`)
    **không tồn tại** trong Claude Code — không có file trên đĩa, không có trong danh sách.
    Đó là skill của claude.ai hoặc lệnh gạch chéo. Tiết kiệm **0 token**.
    `session-start-hook` có file thật nhưng tên khai bên trong là `startup-hook-skill`
    nên khoá override nhiều khả năng không khớp.
  - Con số "~1.285 token/phiên" ghi hôm 06/09 là **ước đoán sai**. Nên bỏ 9 dòng thừa
    trong `.claude/settings.json` cho khỏi hiểu nhầm — file khoá, chờ chủ dự án đồng ý.
- **`CLAUDE.md` vẫn ghi "deploy Vercel"** trong khi đã chuyển GitHub Pages từ 06/09.
  File khoá, nợ từ phiên trước, chưa sửa.
- **Chưa cắt sát theo kênh alpha.** Atlas dùng 3/4 trang vì bóng đổ nới hộp bao từng
  sprite. Thêm một mẻ nữa là vượt trần. Cắt theo alpha thay vì theo hộp bao hình học sẽ
  hạ xuống — làm khi nào chạm trần, không làm trước.
- **Shader nhiều trang có thể tốn băng thông trên iPhone**: GPU di động thường chạy hết
  mọi nhánh `if`, tức mỗi điểm ảnh đọc 2 ảnh thay vì 1. Chưa đo được. Rớt fps thì lùi về
  bộ 1× — sửa `coTheoDpr` trong `src/render/Atlas.ts`, một dòng.
- `tests/NganSachSprite.test.ts` **chép lại** phép cắt của `CityScene.datSprite`. Sửa một
  bên mà quên bên kia thì test hết ý nghĩa. Đã ghi cảnh báo ngay đầu file test.
- `src/render/BanDoDemo.ts` là bản đồ giả, Phase 3 thay bằng `src/sim/` thật.
- **KayKit City Builder Bits** đã tải về `assets_source/` nhưng **chưa nướng** — đồ hiện
  đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.
- **Mẻ Quaternius mới còn thiếu nhiều**: lâu đài, tường thành, cối xay, giếng, chợ,
  ruộng đồng, cầu, vách núi. Mẻ Kenney cũ có 147 sprite, mẻ mới mới 22.
- **Nhà Quaternius chiếm 2×2 ô** nhưng `data/thanh_pho_demo.json` đặt mỗi vật một ô.
  Ráp vào game thì nhà sẽ chồng lên nhau — cần thêm khái niệm "công trình chiếm nhiều ô"
  vào bản đồ. Đây là việc BẮT BUỘC trước khi ráp, không phải việc tinh chỉnh.
- **Nhà nhỏ nhìn xuyên vào thấy rỗng** — chỉ có 4 mặt tường, không có trần.
- **Năm nhà đều mái đỏ tường xám** — cần thêm màu mái và kiểu tường cho đỡ đơn điệu.
- `assets_source/` **mất theo container** mỗi phiên (đúng luật, không lên git). Phiên sau
  phải tải lại ~500 MB: `npm run tai:asset`, `npm run tai:itch`,
  `node tools/tai_itch.mjs quaternius/medieval-village-megakit quaternius/stylized-nature-megakit`,
  `node tools/tai_hoa_tiet.mjs sparse_grass leafy_grass brown_mud_dry cobblestone_01 dry_river_pebbles coast_sand_01 aerial_rocks_02 clay_plaster clay_roof_tiles_02`.
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên.
- **Deploy: GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`.
  Máy ảo bị chặn hết nhà cung cấp hosting → deploy giao cho máy CI. Repo phải **công khai**.
  Ba chốt chặn phải mở bằng tay (làm xong 06/09): repo công khai ·
  `Settings > Pages > Source: GitHub Actions` · `Settings > Environments > github-pages >
  Deployment branches` phải có `main`.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên
  máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký qua
  `api.github.com` là tự kiểm được.

## 5. Phase kế tiếp

**Phase 2B tiếp — cho xong mẻ Quaternius.** Chủ dự án đã duyệt (`TIẾP`, 06/09):

1. Nhà nhiều màu mái và kiểu tường; bịt trần nhà nhỏ.
2. Thêm cối xay · giếng · chợ · quầy hàng · ruộng đồng · hàng rào.
3. Tải thử `Ultimate Modular Ruins` (90 model, CC0, có texture) làm lâu đài và tường
   thành. **Khác dòng MegaKit nên phải nhìn ảnh mới biết có khớp phong cách không** —
   không khớp thì ghép tháp vuông từ mảnh tường của Medieval Village.
4. Thêm khái niệm **công trình chiếm nhiều ô** vào `data/thanh_pho_demo.json` và
   `src/render/BanDoDemo.ts` — bắt buộc, xem mục 4.
5. Ráp vào game: đổi hằng `ME`, đổi tên sprite trong `data/`. Đụng hai file khoá.

**Rồi mới tới Phase 3 — thành phố sống bằng số, chưa vẽ**: `src/sim/city/` với `Wares.ts`,
`Buildings.ts`, `Chains.ts`, cộng `Clock.ts` nhịp 10 Hz. TypeScript thuần, ESLint đã dựng
sẵn hàng rào cấm import trình duyệt. Xong thì `npm run sim:thu` chạy **10 giờ game trong
Node** trong vài giây, in bảng tài nguyên. Điều kiện đạt: không có hàng âm, không chuỗi
sản xuất nào kẹt vĩnh viễn. Chưa nhìn thấy gì mới trên màn hình — chủ ý, Luật 1 của
`TECH_SPEC` mục 1. Số cân bằng đi vào `data/`: `wares.json` · `buildings.json` ·
`chains.json`.
