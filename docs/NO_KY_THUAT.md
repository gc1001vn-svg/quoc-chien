# NỢ KỸ THUẬT — QUỐC CHIẾN

> Tách khỏi `docs/TIEN_DO.md` ngày 07/09/2026 để đầu phiên khỏi phải nạp cả danh sách này
> (~2.000 token mỗi phiên, phần lớn là nợ chưa động tới). `TIEN_DO.md` mục 4 chỉ giữ nợ
> **đang chặn phase hiện tại**; mọi thứ còn lại nằm đây.
>
> Chỉ **thêm**, không xoá. Trả xong một nợ thì ghi "ĐÃ TRẢ + ngày" chứ đừng xoá dòng.

## Đồ hoạ

- ~~**28 toà nhà của kinh tế chưa có sprite.**~~ — **ĐÃ TRẢ 09/09 (Phase 6B).** 12 sprite
  mới phủ cả 32 loại nhà: giếng · cối xay · ruộng · vườn nho · nhà chài · trại thú · lò
  nhỏ · lò lớn · mỏ · xưởng · trại gỗ · công trường (nhà dân và trại lính dùng sprite cũ).
  **Trả nốt 10/09:** cối xay, giếng, mỏ, ruộng, xưởng cưa và chợ lấy thẳng model thật của
  **KayKit Medieval Builder Pack** (`mill` + `mill_blades`, `well`, `mine`, `farm_plot` +
  `farm_wheat`, `lumbermill`, `market`). Nợ này từng ghi "đã tìm hết, không gói nào có cối
  xay và giếng đúng phong cách" — sai: KayKit vẫn nằm trong `ASSET_CREDITS` suốt, chỉ vì
  mẻ cũ bỏ đi nên không ai nghĩ tới nữa. **Bài học: rà lại gói CŨ trước khi kết luận
  không có.** Đánh đổi: KayKit màu bệt, Quaternius có hoạ tiết — hai phong cách không
  khớp tuyệt đối, chủ dự án chốt 10/09 sau khi xem ảnh.
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

- ~~**Người vác hàng dồn thành một dãy nối đuôi**~~ — **ĐÃ TRẢ 08/09 (Phase 5).** Thống
  đốc xây kho thứ hai ở ngã tư xa kho cũ nhất, người vác hàng đi tới kho **gần nhất**:
  71.156 chuyến một giờ, tăng 10,9 % so với 64.184 khi còn một kho. Còn nợ lại: mỗi kho
  vẫn dùng **chung một túi hàng**, chưa phải kho riêng như Caesar III — hàng coi như dịch
  chuyển tức thì giữa các kho. Chủ dự án đã chốt cách này 08/09 để khỏi phải viết lại
  toàn bộ kinh tế Phase 3–4.

- ~~**Walker chưa có sprite người**~~ — **ĐÃ TRẢ 07/09 (phiên nướng người).** 16 sprite:
  nông dân nam và nữ × 4 hướng × 2 dáng. `dong_thung` và `thung_ruou` đã **trở lại** làm
  đồ trang trí. Còn nợ lại: 8 hướng × 4 dáng vẫn để Phase 10, và bộ đồ **Ranger** trong gói
  chưa nướng (mới chỉ dùng Peasant).
- ~~**Chưa đo fps trên iPhone với sprite người**~~ — **ĐÃ TRẢ 08/09: 59 fps · 3.441 sprite ·
  1 lệnh vẽ · 0,35×.** Đường lùi nếu về sau tụt: `ZOOM_HIEN_WALKER` trong
  `src/render/CityScene.ts` đổi 0 → 0,6 là người biến mất khi thu nhỏ.
- **Người vác hàng đi tay không** (09/09, chủ dự án nhận ra). 16 sprite người hiện có đều
  là dáng đi tay không; đi lấy hàng hay đang vác hàng về cũng một hình. Kit Fantasy Props
  có `Crate_Wooden` `Barrel` `Bag` `FarmCrate_*` gắn vào tay được. **Chốt để Phase 10**,
  nướng một lần cùng bộ 8 hướng × 4 dáng cho khỏi nướng hai lượt.
- ~~**Nhà kinh tế và vật thể trang trí là hai danh sách riêng**~~ (07/09) — **ĐÃ TRẢ 09/09
  (Phase 6B).** Mỗi `ThuNha` chèn một `OVat` vào bản đồ, và hai bên dùng **chung một
  `daChiem`**. Hoá ra nợ này còn giấu một lỗi: hai tập ô đã chiếm riêng nghĩa là nhà kinh
  tế vẫn đang đặt **đè lên** cây và nhà trang trí — không ai thấy chỉ vì nhà kinh tế vô
  hình. `tests/NhaKinhTeHien.test.ts` canh chỗ này.

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

- **ĐÃ TRẢ 07/09 — `CLAUDE.md` ghi "deploy Vercel".** Nợ này đã hết từ trước: file hiện
  ghi đúng GitHub Pages. Dòng nợ cũ sai, giữ lại đây cho khỏi tưởng là còn.
- **ĐÃ TRẢ MỘT PHẦN 07/09 — `CLAUDE.md` 698 → 621 token.** Vẫn trên mức khuyến nghị 500.
  Cắt tiếp thì phải bỏ nghi thức đầu/cuối phiên hoặc ba luật — **không đáng**, để nguyên.
  Cùng lúc thêm hai luật mới: tự gộp `main`, và sửa file bằng công cụ Edit.
- **SỬA LẠI NHẬN ĐỊNH SAI 07/09 — "9 dòng thừa trong `.claude/settings.json`".** Nhận định
  cũ sai hai chỗ. Một: `settings.json` là **cấu hình của máy, không nạp vào ngữ cảnh**, nên
  dòng thừa tốn **0 token**, xoá đi cũng chẳng lãi gì. Hai: `artifact-design`
  `artifact-diagramming` `artifact-capabilities` **có thật** (công cụ Artifact gọi tên
  chúng) — xoá khỏi danh sách `off` là **mất thêm** token chứ không tiết kiệm.
  Chỗ thật sự có ăn là **tắt thêm skill dự án không dùng**: `update-config`
  `fewer-permission-prompts` `security-review` `off`, `loop` `user-invocable-only`
  ≈ **300 token/phiên** (ước lượng theo độ dài mô tả, không đo trực tiếp được). Đã làm 07/09.
- **PWA giữ atlas cũ** — **ĐÃ TRẢ 08/09.** `skipWaiting` + `clientsClaim` trong
  `vite.config.ts`. Trước đó service worker cũ phục vụ atlas cũ với code mới: sprite người
  không có trong atlas, `datSprite` bỏ qua im lặng, không ai hiện trên đường. Chủ dự án
  phải xoá dữ liệu trang 2-3 lần mới thấy.
- `session-start-hook` trong `settings.json` khai sai tên bên trong (`startup-hook-skill`)
  nên nhiều khả năng không khớp với skill nào. Vô hại, chưa sửa.
- ~~**Không kéo được kho `ghi-nho` từ máy ảo**~~ — **ĐÃ TRẢ 07/09.** `git clone` thẳng vẫn
  hỏi mật khẩu, nhưng gọi `add_repo` (owner `gc1001vn-svg`, repo `ghi-nho`, access `push`)
  rồi clone lại thì được. Đúng cách skill `ghi-nho` mô tả — phiên trước gọi hụt.
- `assets_source/` **mất theo container** mỗi phiên (đúng luật, không lên git). Phiên sau
  tải lại ~860 MB, mất vài phút:
  `node tools/tai_itch.mjs quaternius/medieval-village-megakit quaternius/stylized-nature-megakit quaternius/fantasy-props-megakit quaternius/modular-character-outfits-fantasy quaternius/universal-base-characters`
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
