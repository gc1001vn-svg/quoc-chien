# Nguồn và bản quyền asset

Mọi file trong `public/atlas/` **bắt buộc** có tên trong bảng dưới.
`npm run check:credits` chặn nếu thiếu, CI chặn theo.

> Atlas dời từ `public/assets/atlas/` về `public/atlas/` ngày 10/09 — workbox không bao giờ
> tải lại file nằm trong `assets/`, nên máy người chơi giữ atlas cũ vĩnh viễn.

License chỉ nhận **CC0 · CC-BY · MIT**. **CC-BY-SA không dùng được** — nó lây license
sang cả dự án.

| File trong `public/atlas/` | Nguồn | Tác giả | License | Ngày thêm |
|---|---|---|---|---|
| `trung_co_2_1x_0.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_2x_0.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_2x_1.png` | Quaternius Medieval Village + Stylized Nature + Fantasy Props MegaKit + Modular Character Outfits Fantasy + Universal Base Characters + **KayKit Medieval Builder Pack** (cối xay, giếng, mỏ, ruộng, xưởng cưa, chợ — thêm 10/09) + hoạ tiết Poly Haven, <https://quaternius.com> · <https://kaylousberg.itch.io> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Kay Lousberg · Poly Haven | CC0 1.0 | 07/09/2026, sửa 10/09/2026 |
| `trung_co_2_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |
| `trung_co_2_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |


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
| Fantasy Town Kit 2.0 · Tower Defense Kit · Castle Kit · Nature Kit | Kenney | `npm run tai:asset` |
| KayKit Medieval Builder Pack 1.0 | Kay Lousberg | `npm run tai:itch` |
| KayKit City Builder Bits 1.0 (để dành thời hiện đại, Phase 8) | Kay Lousberg | `npm run tai:itch` |

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

**Cũng thêm 10/09 (chưa nướng, để dành):** Kenney Fantasy Town Kit 2.0 — 167 model CC0,
chủ dự án yêu cầu tải về kho để sau này dùng. Là kit lắp ghép (tường, mái, cửa rời) cộng
vài model nguyên khối: `fountain*` `watermill` `windmill` `cart` `stall`.

**Đã thử rồi bỏ, đừng tải lại:** `quaternius/lowpoly-farm-buildings` (CC0, có `Windmill`,
`Well`, `Barn`, `Silo` — đúng thứ đang thiếu) nướng ra là **nông trại Mỹ thế kỷ 19**: kho
thóc đỏ mái tôn, silo bê tông, cối xay bơm nước khung thép. Lại còn màu bệt trong `.mtl`,
không hoạ tiết. Sai cả thời đại lẫn phong cách. Gói `Ultimate Modular Ruins` **không có
trên itch.io của Quaternius** — đã liệt kê hết 30 gói, không thấy.

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
