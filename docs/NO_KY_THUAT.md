# NỢ KỸ THUẬT — QUỐC CHIẾN

> Tách khỏi `docs/TIEN_DO.md` ngày 07/09/2026 để đầu phiên khỏi phải nạp cả danh sách này
> (~2.000 token mỗi phiên, phần lớn là nợ chưa động tới). `TIEN_DO.md` mục 4 chỉ giữ nợ
> **đang chặn phase hiện tại**; mọi thứ còn lại nằm đây.
>
> Chỉ **thêm**, không xoá. Trả xong một nợ thì ghi "ĐÃ TRẢ + ngày" chứ đừng xoá dòng.

## Đồ hoạ

- **28 toà nhà của kinh tế chưa có sprite.** Giếng · cối xay · lò mổ · vườn nho · nhà bia ·
  xưởng thuộc da · trại cừu · xưởng dệt · mỏ than · mỏ đá · mỏ muối · mỏ đất sét · lò gốm.
  Hiện chỉ là số trong `data/`.
- **Không có cối xay và giếng đúng phong cách.** Đã tìm hết: Medieval Village (176 model)
  và Stylized Nature (68 model) đều không có. Farm Buildings có đủ `Windmill` `Well`
  `Barn` `Silo` nhưng là **nông trại Mỹ thế kỷ 19**, đã nướng thử rồi bỏ (lý do ở
  `docs/ASSET_CREDITS.md`). `Ultimate Modular Ruins` **không tồn tại** trên itch của
  Quaternius — đã liệt kê đủ 30 gói. Phương án còn lại: **tự ghép từ mảnh tường và mái**.
- **Bốn chỗ tự thấy còn yếu**, chưa sửa:
  - **Nhà nhỏ gần bằng nhà lớn.** Mái nhỏ nhất của gói đã rộng 2 ô, nên nhà "1 ô" vẫn tràn
    sang ô bên. Muốn nhà nhỏ thật thì phải tự ghép mái từ mảnh rời.
  - **Bốn màu mái nhưng nâu và đỏ khó phân biệt** ở mức thu nhỏ.
  - **Ô ruộng mới chỉ là mảng đất trơn**, chưa có luống.
  - **Cổng làng đọc không rõ** — thanh gỗ ngang mảnh quá, nhìn ra hai cột đá lẻ.
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
- **KayKit City Builder Bits** đã kê trong `ASSET_CREDITS` nhưng **chưa nướng** — đồ hiện
  đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.

## Code

- **Node bóc kiểu TypeScript có hai điều cấm.** `src/sim/` phải ghi đủ đuôi `.ts` trong
  import, và **cấm `constructor(readonly x: T)`** (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`).
  Sai là `npm run sim:thu` chết trong khi `npm test` vẫn xanh — dễ lọt. Đường lùi nếu về
  sau vướng nữa: cài `tsx` (MIT), phải hỏi chủ dự án trước.
- **Chưa lưu ván được.** `ThanhPho` giữ trạng thái trong bộ nhớ, chưa có cách ghi ra và
  đọc lại. Phase 13 mới cần, nhưng để càng lâu càng khó gỡ.
- **`src/sim/` và `src/render/` chưa nối với nhau chút nào.** `src/render/BanDoDemo.ts` vẫn
  là bản đồ giả của Phase 2. Phase 4 hoặc 5 mới nối.
- `tests/NganSachSprite.test.ts` **chép lại** phép cắt của `CityScene.datSprite`. Sửa một
  bên mà quên bên kia thì test hết ý nghĩa. Cảnh báo ghi ngay đầu file test.

## Môi trường và cấu hình

- **`CLAUDE.md` vẫn ghi "deploy Vercel"** trong khi đã chuyển GitHub Pages từ 06/09.
  File khoá, nợ từ ba phiên trước.
- **`CLAUDE.md` nặng 698 token**, nạp mỗi phiên, trên mức khuyến nghị 500. File khoá.
- **9 dòng thừa trong `.claude/settings.json`.** Tám tên skill (`dataviz` `design`
  `artifact-design` `artifact-diagramming` `artifact-capabilities` `claude-api`
  `keybindings-help` `init`) **không tồn tại** trong Claude Code, tiết kiệm **0 token**;
  `session-start-hook` khai sai tên bên trong (`startup-hook-skill`) nên nhiều khả năng
  không khớp. Phần thật sự có ăn: 6 skill `off` ≈ 945 token + 5 skill `ponytail-*` để
  `user-invocable-only` ≈ 452 token, tổng ≈ **1.400 token/phiên**. File khoá.
- **Không kéo được kho `ghi-nho` từ máy ảo (07/09).** `git clone` hỏi mật khẩu, gọi
  `add_repo` thì máy chặn. Đã làm theo bốn dòng cốt lõi thuộc lòng trong skill. Nếu phiên
  sau vẫn chặn thì phải sửa cách cấp quyền, đừng để mất kho ghi nhớ chung.
- `assets_source/` **mất theo container** mỗi phiên (đúng luật, không lên git). Phiên sau
  tải lại ~440 MB, mất khoảng một phút:
  `node tools/tai_itch.mjs quaternius/medieval-village-megakit quaternius/stylized-nature-megakit quaternius/fantasy-props-megakit`
  rồi `node tools/tai_hoa_tiet.mjs sparse_grass leafy_grass brown_mud_dry cobblestone_01 dry_river_pebbles coast_sand_01 aerial_rocks_02 clay_plaster clay_roof_tiles_02`.
  (`npm run tai:asset` và `npm run tai:itch` chỉ cần khi muốn dựng lại mẻ Kenney cũ.)
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.

## Deploy — đã chốt, không phải nợ, để đây cho khỏi quên

- **GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`. Máy ảo bị chặn
  hết nhà cung cấp hosting → deploy giao cho máy CI. Repo phải **công khai**.
- Ba chốt chặn đã mở bằng tay 06/09: repo công khai · `Settings > Pages > Source: GitHub
  Actions` · `Settings > Environments > github-pages > Deployment branches` có `main`.
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên máy
  CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký là tự kiểm được.
