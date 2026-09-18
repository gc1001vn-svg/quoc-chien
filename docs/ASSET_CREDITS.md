# Nguồn và bản quyền asset

Mọi file trong `public/atlas/` **bắt buộc** có tên trong bảng dưới.
`npm run check:credits` chặn nếu thiếu, CI chặn theo.

> Atlas dời từ `public/assets/atlas/` về `public/atlas/` ngày 10/09 — workbox không bao giờ
> tải lại file nằm trong `assets/`, nên máy người chơi giữ atlas cũ vĩnh viễn.

License chỉ nhận **CC0 · CC-BY · MIT**. **CC-BY-SA không dùng được** — nó lây license
sang cả dự án.

| File trong `public/atlas/` | Nguồn | Tác giả | License | Ngày thêm |
|---|---|---|---|---|
| `trung_co_2_1x_0.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + **LowPoly Animated Animals** (lợn, cừu — thêm 11/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_2x_0.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + **LowPoly Animated Animals** (lợn, cừu — thêm 11/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_2x_1.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + **LowPoly Animated Animals** (lợn, cừu — thêm 11/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |
| `trung_co_2_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |
| `hex_1_1x_0.png` | KayKit Medieval Hexagon Pack 1.0 FREE — ô lục giác, bờ biển, núi, rừng, công trình bốn màu phe, cờ hiệu (mẻ bản đồ tỉnh, Phase 7), <https://kaylousberg.itch.io/kaykit-medieval-hexagon-pack> | Kay Lousberg | CC0 1.0 | 11/09/2026 |
| `hex_1_2x_0.png` | KayKit Medieval Hexagon Pack 1.0 FREE — ô lục giác, bờ biển, núi, rừng, công trình bốn màu phe, cờ hiệu (mẻ bản đồ tỉnh, Phase 7), <https://kaylousberg.itch.io/kaykit-medieval-hexagon-pack> | Kay Lousberg | CC0 1.0 | 11/09/2026 |
| `hex_1_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 11/09/2026 |
| `hex_1_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 11/09/2026 |
| `hien_dai_1x_0.png` | Kenney City Kit Suburban + Commercial + Industrial + Roads (32 loại nhà, hàng rào, thùng hàng, bồn, tháp nước, cối xay gió) + Kenney Mini Characters (người đi đường) + Quaternius Stylized Nature MegaKit (cây cỏ đá) + hoạ tiết Poly Haven, <https://kenney.nl> · <https://quaternius.com> · <https://polyhaven.com> | Kenney (Kenney Vleugels) · Quaternius (Tomás Laulhé) · Poly Haven | CC0 1.0 | 18/09/2026 |
| `hien_dai_2x_0.png` | Kenney City Kit Suburban + Commercial + Industrial + Roads (32 loại nhà, hàng rào, thùng hàng, bồn, tháp nước, cối xay gió) + Kenney Mini Characters (người đi đường) + Quaternius Stylized Nature MegaKit (cây cỏ đá) + hoạ tiết Poly Haven, <https://kenney.nl> · <https://quaternius.com> · <https://polyhaven.com> | Kenney (Kenney Vleugels) · Quaternius (Tomás Laulhé) · Poly Haven | CC0 1.0 | 18/09/2026 |
| `hien_dai_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 18/09/2026 |
| `hien_dai_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 18/09/2026 |


Atlas là ảnh **nướng lại** từ model 3D CC0 bằng `tools/nuong_sprite.mjs`, không phải bản
sao chép nguyên. CC0 cho phép dùng thương mại, không bắt buộc ghi công — vẫn ghi.
Gói gốc tải về nằm ở `assets_source/`, không lên git (xem `.gitignore`).

Gói nguồn đang dùng, **tất cả CC0 1.0**, license đọc thẳng trong `License.txt` của mỗi gói:

| Gói | Tác giả | Tải bằng |
|---|---|---|
| **Medieval Village MegaKit** — đang dùng cho toàn bộ công trình | Quaternius | `node tools/tai_itch.mjs quaternius/medieval-village-megakit` |
| **Stylized Nature MegaKit** — đang dùng cho cây cỏ đá | Quaternius | `node tools/tai_itch.mjs quaternius/stylized-nature-megakit` |
| **Fantasy Props MegaKit** — quầy chợ, thùng, ghế, nồi (thêm 07/09) | Quaternius | `node tools/tai_itch.mjs quaternius/fantasy-props-megakit` |
| **Modular Character Outfits – Fantasy** — thân người nông dân nam/nữ (thêm 07/09) | Quaternius | `node tools/tai_itch.mjs quaternius/modular-character-outfits-fantasy` |
| **Universal Base Characters** — cái đầu ghép vào thân nông dân (thêm 07/09) | Quaternius | `node tools/tai_itch.mjs quaternius/universal-base-characters` |
| **KayKit Medieval Hexagon Pack 1.0** — 135 công trình + 68 vật trang trí (thêm 10/09) | Kay Lousberg | `node tools/tai_itch.mjs kaylousberg/kaykit-medieval-hexagon` |
| **LowPoly Animated Animals** — lợn và cừu cho trại chăn nuôi (thêm 11/09). 7 con: `Cow` `Horse` `Llama` `Pig` `Pug` `Sheep` `Zebra`, thư mục `lowpoly-animated-animals` | Quaternius | `node tools/tai_itch.mjs quaternius/lowpoly-animated-animals` |
| Fantasy Town Kit 2.0 · Tower Defense Kit · Castle Kit · Nature Kit | Kenney | `npm run tai:asset` |
| KayKit Medieval Builder Pack 1.0 | Kay Lousberg | `npm run tai:itch` |
| KayKit City Builder Bits 1.0 (để dành thời hiện đại, Phase 8) | Kay Lousberg | `npm run tai:itch` |
| **City Kit (Suburban)** — 21 dáng nhà ở, hàng rào, lối đi, bồn hoa, cây (mẻ `hien_dai`, thêm 18/09) | Kenney | `node tools/tai_asset.mjs city-kit-suburban` |
| **City Kit (Commercial)** — 19 dáng nhà phố, mái hiên, dù che (mẻ `hien_dai`, thêm 18/09) | Kenney | `node tools/tai_asset.mjs city-kit-commercial` |
| **City Kit (Industrial)** — 20 dáng nhà xưởng, ống khói, bồn, thùng hàng, tháp nước, cối xay gió (mẻ `hien_dai`, thêm 18/09) | Kenney | `node tools/tai_asset.mjs city-kit-industrial` |
| **City Kit (Roads)** — thùng rác, rào công trường, đèn công trường (mẻ `hien_dai`, thêm 18/09) | Kenney | `node tools/tai_asset.mjs city-kit-roads` |
| **Mini Characters** — 6 nam + 6 nữ thời hiện đại, khung xương 7 khớp (mẻ `hien_dai`, thêm 18/09) | Kenney | `node tools/tai_asset.mjs mini-characters` |

**Từ 18/09/2026 game chạy HAI mẻ:** `trung_co_2` cho đời 1–4 và `hien_dai` cho đời 5–6
(`data/balance.json > thoiDai`). Lên đời là `CityScene` đổi cả bộ atlas và nhả bộ cũ bằng
`gl.deleteTexture`, nên chỉ một mẻ nằm trên GPU cùng lúc.

**Từ 07/09/2026 game chạy mẻ `trung_co_2` (Quaternius).** Mẻ Kenney/KayKit cũ
(`trung_co_1x*`, `trung_co_2x*`) đã **xoá khỏi `public/`** — bớt 5,0 MB PWA phải tải về
máy. Mẻ cũ vẫn dựng lại được bất cứ lúc nào từ `tools/me/trung_co.json`; hai gói Kenney và
KayKit giữ trong bảng này vì lý do đó, và vì City Builder Bits để dành Phase 8.

**Từ 10/09/2026 mẻ `trung_co_2` dùng THÊM KayKit Medieval Builder Pack** cho sáu toà nhà
kinh tế mà Quaternius không có model: `mill` + `mill_blades` (cối xay gió có cánh thật),
`well` (giếng), `mine` (hầm mỏ), `farm_plot` + `farm_wheat` (ruộng lúa), `lumbermill`
(xưởng cưa), `market` (quầy chợ). Chủ dự án chốt 10/09 sau khi xem ảnh so sánh: hình tự
ghép từ mảnh tường và mái "xấu quá". KayKit màu bệt còn Quaternius có hoạ tiết, nên hai
phong cách không khớp tuyệt đối — đánh đổi đã biết trước khi chốt.

**Từ 10/09/2026, vòng hai — THÊM KayKit Medieval Hexagon Pack** (CC0, `License.txt` đọc
thẳng: "Creative Commons Zero, CC0", Kay Lousberg, 26/04/2024). Chủ dự án nhìn ra 23 loại
nhà đang dùng chung 5 hình và chốt làm hết. Gói này **cùng một hoạ sĩ** với Builder Pack
nên cùng phong cách, và công trình đứng rời trên `y = 0`, không dính đế lục giác.

Dùng: `blacksmith` (lò rèn, lò thép) · `lumbermill` + saw + top (xưởng cưa) · `tavern`
(xưởng rượu, nhà bia) · `archeryrange` (xưởng vũ khí) · `market` (xưởng dệt) · `home_A`
(xưởng thuộc da, lán ba trại thú) · `home_B` (nhà dân) · `barracks` (trại lính) · và vật
trang trí `barrel` `sack` `crate_*` `pallet` `wheelbarrow` `weaponrack` `target` `tent`
`resource_lumber` `resource_stone` `rock_single_*`.

Sáu hầm mỏ dùng chung model `mine` nhưng **khác màu quặng và khác đồ chất quanh nó** —
than đen, muối trắng, đất sét cam, đá vôi kem, quặng xanh thép, đá xám. Tám lò dùng chung
hai khuôn tường gạch nhưng **khác cỡ** (lò lớn 224 px, lò nhỏ 173 px) **và khác màu mái**.
Kho không có model lợn, gà, cừu — ghi vào `NGUON_MO.md` mục 8.

**Từ 11/09/2026, mẻ thứ hai `hex_1` cho BẢN ĐỒ TỈNH (Phase 7)** — cùng gói KayKit Medieval
Hexagon Pack, lần này lấy phần chưa dùng tới: `tiles/base` (`hex_grass`, `hex_water`) ·
`tiles/coast` (5 ô bờ biển) · `decoration/nature` (`mountain_A/C`, bốn cụm cây) ·
`buildings/{red,green,blue,yellow}` (castle, home_A, mine, barracks, market — bốn màu phe) ·
`buildings/neutral` (`building_grain`, `building_dirt`, `building_scaffolding`) ·
`decoration/props` (`flag_red/green/blue/yellow`).

Hai điều đo được khi nướng mẻ này, ghi lại kẻo lần sau lại dò:

- Thư mục `buildings/neutral` **không có nhà** như bốn màu phe — chỉ có tường, cầu, giàn
  giáo, ruộng, đất. Nên tỉnh trung lập vẽ bằng ruộng, ô xây trống vẽ bằng mảnh đất, ô đang
  xây vẽ bằng giàn giáo. Câu "5 màu = 4 phe + trung lập" ghi trong `TIEN_DO.md` 11/09 là
  **đúng với ô lục giác, sai với nhà**.
- Hai sprite đồi (`hills_*`) đã bỏ: mặt trên lấy ô olive của bảng màu nền nên ra vàng chói
  cạnh núi đá xám. Máy nướng chỉ có phép nhân màu, không khử được bão hoà — đừng thử lại.

**Cũng thêm 10/09 (chưa nướng, để dành):** Kenney Fantasy Town Kit 2.0 — 167 model CC0,
chủ dự án yêu cầu tải về kho để sau này dùng. Là kit lắp ghép (tường, mái, cửa rời) cộng
vài model nguyên khối: `fountain*` `watermill` `windmill` `cart` `stall`.

**Đã thử rồi bỏ, đừng tải lại:** `quaternius/lowpoly-farm-buildings` (CC0, có `Windmill`,
`Well`, `Barn`, `Silo` — đúng thứ đang thiếu) nướng ra là **nông trại Mỹ thế kỷ 19**: kho
thóc đỏ mái tôn, silo bê tông, cối xay bơm nước khung thép. Lại còn màu bệt trong `.mtl`,
không hoạ tiết. Sai cả thời đại lẫn phong cách. Gói `Ultimate Modular Ruins` **không có
trên itch.io của Quaternius** — đã liệt kê hết 30 gói, không thấy.

## Icosa Gallery — nguồn thứ năm, ghi công SINH TỰ ĐỘNG (15/09/2026)

**Model trong game này một phần lấy từ Icosa Gallery, kho gương của Google Poly:
<https://icosa.gallery>** — toàn bộ **CC-BY**, không có CC0.

**Bản ghi công đầy đủ: `docs/KHO_ICOSA.md`** — tên model · tác giả · license · link trang
gốc, sinh tự động bằng `npm run tai:icosa`. Nướng thêm model Icosa thì **chạy lại lệnh đó,
KHÔNG phải sửa file này** — đó là lý do bảng nằm ở file khác: file này khoá, mỗi lần sửa là
một vòng hỏi chủ dự án, mà danh sách thì đổi mỗi mẻ.

Hai việc vẫn phải làm tay khi nướng mẻ đầu có model Icosa:

1. Thêm dòng atlas vào bảng đầu file này, cột *Nguồn* ghi `Icosa Gallery` kèm link và trỏ
   `docs/KHO_ICOSA.md`. Một dòng cho cả mẻ, không phải một dòng mỗi model.
2. **Ghi công ở chỗ người chơi thấy được** (màn hình credit trong game), như Poly Pizza.
   CC-BY đòi ghi tên tác giả, không đòi ghi ngay trên màn chơi.

`tai_icosa.mjs` **tự loại ND và SA** ngay từ bước dò — ND cấm tác phẩm phái sinh, mà nướng
model thành sprite là phái sinh; chơi phi thương mại không gỡ được điều đó.

## Poly Pizza — nguồn thứ tư, cấp phép 15/09/2026

**Model trong game này một phần lấy từ Poly Pizza: <https://poly.pizza>**

Dòng trên là **nghĩa vụ theo điều khoản API của họ**, không phải theo license từng model.
Hai điều đã đồng ý khi tạo khoá API ngày 15/09: *"Provide appropriate attribution for
models used"* và *"Clearly mention that models are provided by Poly Pizza and if possible
include a link"*. **CC0 cũng phải ghi** — đây là điều kiện dùng API, tách khỏi license.

Hai điều khác đã đồng ý, ràng buộc cách dùng: **không bán lại content** và **không dùng
thương mại nếu thu trên 50.000 USD/năm**. Game phi thương mại nên không vướng; đổi ý định
đó thì phải đọc lại điều khoản trước.

Truy cập bằng biến môi trường **`POLY_PIZZA_KEY`** — **khoá KHÔNG bao giờ vào git**, repo
này Public. Dò bằng `npm run do:asset <từ khoá>`.

Đo 15/09 trên 16 từ khoá loại nhà: **127 dáng `Buildings` duy nhất · 103 dáng ≤ 8.000 tam ·
52 CC0 · 0 model CC-BY-SA**. Tải về luôn là **`.glb`**, máy nướng đọc được.

**Chưa model nào của Poly Pizza vào `public/atlas/`.** Khi nướng mẻ đầu có model của họ thì
phải làm đủ ba việc, không được bỏ việc nào:

1. Thêm dòng vào bảng atlas ở đầu file này, cột *Nguồn* ghi rõ Poly Pizza kèm link.
2. **Model CC-BY phải chép nguyên chuỗi `Attribution` API trả về** — nó đã có sẵn tên tác
   giả, link model và link license. Đừng tự viết lại.
3. **Ghi công Poly Pizza ở chỗ người chơi thấy được**, không chỉ trong file này — điều
   khoản đòi *"clearly mention"*. Chỗ đặt do chủ dự án chốt.

Hai model đầu tiên đã nhắm, cả hai CC0 1.0, cho `trai_ga` (nợ treo từ 06/09):
`Chicken` (2.648 tam) và `ChickenCoop` (948 tam).

## Hoạ tiết bề mặt

**Mẻ Kenney cũ (`trung_co`)** không có toạ độ ảnh trải phẳng (`roof-point.obj` chỉ có 5
toạ độ `vt`, cả 5 đều `u = 0.21875`), nên hoạ tiết phải **chiếu ba phương** lúc nướng.
Model Quaternius có toạ độ trải phẳng thật (672 toạ độ `vt`) nên **mẻ `trung_co_2` bỏ hẳn
phép chiếu ba phương** — hoạ tiết chỉ còn dùng để **tự sinh ô nền** (mảnh `phang`).

| Hoạ tiết | Dùng cho | Nguồn | License |
|---|---|---|---|
| `leafy_grass` | Ô nền `o_co` | <https://polyhaven.com/a/leafy_grass> | CC0 1.0 |
| `brown_mud_dry` | Ô nền `o_dat` | <https://polyhaven.com/a/brown_mud_dry> | CC0 1.0 |
| `dry_river_pebbles` | Ô nền `o_duong` | <https://polyhaven.com/a/dry_river_pebbles> | CC0 1.0 |
| `cobblestone_01` | Ô nền `o_duong_lat` (ngã tư) | <https://polyhaven.com/a/cobblestone_01> | CC0 1.0 |
| `coast_sand_01` | Ô nền `o_cat` | <https://polyhaven.com/a/coast_sand_01> | CC0 1.0 |
| `aerial_rocks_02` | Ô nền `o_da` | <https://polyhaven.com/a/aerial_rocks_02> | CC0 1.0 |
| `clay_plaster` | Chiếu ba phương, chỉ mẻ `trung_co` cũ | <https://polyhaven.com/a/clay_plaster> | CC0 1.0 |
| `clay_roof_tiles_02` | Chiếu ba phương, chỉ mẻ `trung_co` cũ | <https://polyhaven.com/a/clay_roof_tiles_02> | CC0 1.0 |
| `sparse_grass` | Tải sẵn, chưa dùng | <https://polyhaven.com/a/sparse_grass> | CC0 1.0 |

Tải về `assets_source/hoa_tiet/`, không lên git. Poly Haven ghi rõ toàn bộ kho là CC0:
<https://polyhaven.com/license>. CC0 không bắt buộc ghi công — vẫn ghi, theo luật dự án.

## Chưa tính vào bảng này

- `public/icons/*.png` — biểu tượng PWA, tự sinh bằng `python3` lúc dựng Phase 0, không
  lấy của ai.
- Trang đo sprite `?do=sprite` **từ Phase 2 dùng atlas thật**, không còn atlas giả vẽ
  bằng Canvas 2D nữa. Nó đọc chính các file đã kê ở bảng trên.
- `assets_source/` — gói tải về nguyên vẹn, không lên máy chủ, không lên git.
  Ghi nguồn vào đây khi nào atlas nướng ra từ nó được đưa vào `public/atlas/`.
