# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 07/09/2026.

## 1. Đang ở đâu

**Mẻ Quaternius ĐÃ VÀO GAME.** Đẩy `main` là https://gc1001vn-svg.github.io/quoc-chien/
chạy đồ hoạ mới: nhà tường vữa và tường gạch có hồi khung gỗ, mái ngói thấy từng viên,
bốn màu mái (đỏ · nâu · lam · rêu), cây cối sạch nét, quầy chợ · xe kéo · thùng rượu ·
hàng rào rải dọc đường. Mẻ Kenney cũ **đã xoá khỏi `public/`** — bớt 5,0 MB máy phải tải.

**Thu nhỏ được tới 0,35×** (trước là 0,60×): nhìn ~39 ô ngang thay vì 23. Trần sprite nâng
1.500 → 3.500, bản đồ nới 64×64 → **96×96** vì bản đồ cũ hẹp hơn khung nhìn ở 0,35× nên
lòi nền đen ra hai mũi hình thoi. Camera nay kẹp theo **hình thoi** chứ không theo hộp bao.

**Chưa ai đo fps trên iPhone thật.** Mới chỉ xem bằng ảnh chụp trong máy ảo.

Ba việc lớn của phiên: nhà Quaternius **chiếm 2×2 ô** (trước đó ghép vào là chồng lên
nhau), **cắt sprite theo kênh alpha** (máy nướng bỏ hẳn kênh trong suốt nên cây ra cục
đen lởm chởm), và thêm **9 đồ của làng** từ gói Fantasy Props.
Chi tiết cả phiên: `docs/NHAT_KY/PHASE_2B_2.md`.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 51 test · build ·
check:base · check:credits).

Mẻ `trung_co_2` đang chạy, **38 sprite**:

| Số đo | Bản 1× | Bản 2× | Trần |
|---|---:|---:|---|
| Trang atlas 2048² | 1 (lấp 22,0 %) | 2 (76,1 % + 10,7 %) | 4 trang |
| Bộ nhớ GPU | 16,8 MB | 33,6 MB | 67,1 MB |
| Sprite chỗ đông nhất, mức 0,35× | 3.316 | 3.236 | 3.500 |
| Lệnh vẽ | 1 | 2 | 4 |

**Chưa đo fps trên iPhone với mẻ mới.** Số cũ (18.089 sprite ở `?do=sprite`) đo bằng mẻ
Kenney và **chạm trần công cụ đo chứ không phải trần máy** — đọc lại
`docs/NHAT_KY/PHASE_2B.md` trước khi trích con số đó.

## 3. Việc của chủ dự án

1. **Mở https://gc1001vn-svg.github.io/quoc-chien/ trên iPhone và xem.** Đây là việc quan
   trọng nhất — mọi thứ dưới đây đều chờ anh nói đồ hoạ mới được hay chưa được.
   Nếu vẫn ra đồ hoạ cũ thì tắt hẳn Safari rồi mở lại — PWA giữ bản cũ trong máy.
2. **Nói rõ chỗ nào chưa ưng.** Bốn chỗ tự tôi thấy còn yếu, kê ở mục 4.
3. Quyết phiên sau: **chỉnh tiếp đồ hoạ**, hay sang **Phase 3** (thành phố sống bằng số) —
   xem mục 5.

## 4. Nợ kỹ thuật

- **Bốn chỗ đồ hoạ tôi tự thấy còn yếu**, chưa sửa:
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
- **Máy nướng chỉ có phép NHÂN màu, không có phép CỘNG.** Vì thế lá cây không bao giờ ra
  xanh tự nhiên (mọi ảnh lá Quaternius có **kênh lam = 0**) và mái không bao giờ ra xám
  (nhân không khử được bão hoà). Thêm `cong_vl` phải nới thuộc tính đỉnh trong `obj.mjs`
  và `trang_nuong.js`. Ghi lại để **khỏi thử chữa lại bằng cách nhân** — đã sập ba lần.
- **Bản 2× dùng 2 trang atlas** trong khi tổng diện tích sprite chỉ **0,867 trang**: cách
  xếp kệ (`tools/lib/xep.mjs`) bỏ phí. Xếp khít thì về 1 trang và bớt một lệnh vẽ. Chưa
  đáng vì trần là 4 trang.
- **Chưa cắt sát theo kênh alpha lúc XẾP.** Bóng đổ vẫn nới hộp bao từng sprite. Khác với
  phép cắt alpha vừa thêm vào shader: cái đó sửa **màu**, cái này sửa **chỗ**.
- **Shader nhiều trang có thể tốn băng thông trên iPhone**: GPU di động thường chạy hết
  mọi nhánh `if`, tức mỗi điểm ảnh đọc 2 ảnh thay vì 1. Chưa đo được. Rớt fps thì lùi về
  bộ 1× — sửa `coTheoDpr` trong `src/render/Atlas.ts`, một dòng.
- **`CLAUDE.md` vẫn ghi "deploy Vercel"** trong khi đã chuyển GitHub Pages từ 06/09.
  File khoá, nợ từ hai phiên trước, chưa sửa.
- **9 dòng thừa trong `.claude/settings.json`.** Tám tên skill (`dataviz` `design`
  `artifact-design` `artifact-diagramming` `artifact-capabilities` `claude-api`
  `keybindings-help` `init`) **không tồn tại** trong Claude Code, tiết kiệm **0 token**;
  `session-start-hook` khai sai tên bên trong (`startup-hook-skill`) nên nhiều khả năng
  không khớp. Phần thật sự có ăn: 6 skill `off` ≈ 945 token + 5 skill `ponytail-*` để
  `user-invocable-only` ≈ 452 token, tổng ≈ **1.400 token/phiên**. File khoá, chờ anh đồng ý.
- `tests/NganSachSprite.test.ts` **chép lại** phép cắt của `CityScene.datSprite`. Sửa một
  bên mà quên bên kia thì test hết ý nghĩa. Cảnh báo ghi ngay đầu file test.
- `src/render/BanDoDemo.ts` là bản đồ giả, Phase 3 thay bằng `src/sim/` thật.
- **KayKit City Builder Bits** đã kê trong `ASSET_CREDITS` nhưng **chưa nướng** — đồ hiện
  đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.
- `assets_source/` **mất theo container** mỗi phiên (đúng luật, không lên git). Phiên sau
  tải lại ~440 MB, mất khoảng một phút:
  `node tools/tai_itch.mjs quaternius/medieval-village-megakit quaternius/stylized-nature-megakit quaternius/fantasy-props-megakit`
  rồi `node tools/tai_hoa_tiet.mjs sparse_grass leafy_grass brown_mud_dry cobblestone_01 dry_river_pebbles coast_sand_01 aerial_rocks_02 clay_plaster clay_roof_tiles_02`.
  (`npm run tai:asset` và `npm run tai:itch` chỉ cần khi muốn dựng lại mẻ Kenney cũ.)
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên.
- **Deploy: GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`.
  Máy ảo bị chặn hết nhà cung cấp hosting → deploy giao cho máy CI. Repo phải **công khai**.
  Ba chốt chặn đã mở bằng tay 06/09: repo công khai · `Settings > Pages > Source: GitHub
  Actions` · `Settings > Environments > github-pages > Deployment branches` có `main`.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên
  máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký là tự kiểm được.

## 5. Phase kế tiếp

**Chờ chủ dự án xem trên iPhone rồi mới quyết.** Hai đường:

**A. Chỉnh tiếp đồ hoạ** (nếu anh chê chỗ nào ở mục 4): tự ghép cối xay và giếng từ mảnh
tường và mái · làm nhà nhỏ nhỏ thật · luống cho ô ruộng · tách màu mái nâu khỏi đỏ.

**B. Phase 3 — thành phố sống bằng số, chưa vẽ**: `src/sim/city/` với `Wares.ts`,
`Buildings.ts`, `Chains.ts`, cộng `Clock.ts` nhịp 10 Hz. TypeScript thuần, ESLint đã dựng
sẵn hàng rào cấm import trình duyệt. Xong thì `npm run sim:thu` chạy **10 giờ game trong
Node** trong vài giây, in bảng tài nguyên. Điều kiện đạt: không có hàng âm, không chuỗi
sản xuất nào kẹt vĩnh viễn. Chưa nhìn thấy gì mới trên màn hình — chủ ý, Luật 1 của
`TECH_SPEC` mục 1. Số cân bằng đi vào `data/`: `wares.json` · `buildings.json` ·
`chains.json`.

**Tôi đề xuất B.** Đồ hoạ giờ đã đủ đẹp để không cản việc gì; bốn chỗ yếu còn lại là tinh
chỉnh, làm lúc nào cũng được. Còn `src/sim/` rỗng thì game vẫn chưa phải là game.
