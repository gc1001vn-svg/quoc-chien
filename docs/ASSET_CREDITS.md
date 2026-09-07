# Nguồn và bản quyền asset

Mọi file trong `public/assets/` **bắt buộc** có tên trong bảng dưới.
`npm run check:credits` chặn nếu thiếu, CI chặn theo.

License chỉ nhận **CC0 · CC-BY · MIT**. **CC-BY-SA không dùng được** — nó lây license
sang cả dự án.

| File trong `public/assets/` | Nguồn | Tác giả | License | Ngày thêm |
|---|---|---|---|---|
| `atlas/trung_co_2_1x_0.png` | Quaternius Medieval Village MegaKit + Stylized Nature MegaKit + hoạ tiết Poly Haven, <https://quaternius.com> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Poly Haven | CC0 1.0 | 07/09/2026 |
| `atlas/trung_co_2_2x_0.png` | Quaternius Medieval Village MegaKit + Stylized Nature MegaKit + hoạ tiết Poly Haven, <https://quaternius.com> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Poly Haven | CC0 1.0 | 07/09/2026 |
| `atlas/trung_co_2_2x_1.png` | Quaternius Medieval Village MegaKit + Stylized Nature MegaKit + hoạ tiết Poly Haven, <https://quaternius.com> · <https://polyhaven.com> | Quaternius (Tomás Laulhé) · Poly Haven | CC0 1.0 | 07/09/2026 |
| `atlas/trung_co_2_1x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |
| `atlas/trung_co_2_2x.json` | Toạ độ do `tools/nuong_sprite.mjs` sinh ra | Dự án | MIT | 07/09/2026 |


Atlas là ảnh **nướng lại** từ model 3D CC0 bằng `tools/nuong_sprite.mjs`, không phải bản
sao chép nguyên. CC0 cho phép dùng thương mại, không bắt buộc ghi công — vẫn ghi.
Gói gốc tải về nằm ở `assets_source/`, không lên git (xem `.gitignore`).

Gói nguồn đang dùng, **tất cả CC0 1.0**, license đọc thẳng trong `License.txt` của mỗi gói:

| Gói | Tác giả | Tải bằng |
|---|---|---|
| **Medieval Village MegaKit** — đang dùng cho toàn bộ công trình | Quaternius | `node tools/tai_itch.mjs quaternius/medieval-village-megakit` |
| **Stylized Nature MegaKit** — đang dùng cho cây cỏ đá | Quaternius | `node tools/tai_itch.mjs quaternius/stylized-nature-megakit` |
| Fantasy Town Kit 2.0 · Tower Defense Kit · Castle Kit · Nature Kit | Kenney | `npm run tai:asset` |
| KayKit Medieval Builder Pack 1.0 | Kay Lousberg | `npm run tai:itch` |
| KayKit City Builder Bits 1.0 (để dành thời hiện đại, Phase 8) | Kay Lousberg | `npm run tai:itch` |

**Từ 07/09/2026 game chạy mẻ `trung_co_2` (Quaternius).** Mẻ Kenney/KayKit cũ
(`trung_co_1x*`, `trung_co_2x*`) đã **xoá khỏi `public/`** — bớt 5,0 MB PWA phải tải về
máy. Mẻ cũ vẫn dựng lại được bất cứ lúc nào từ `tools/me/trung_co.json`; hai gói Kenney và
KayKit giữ trong bảng này vì lý do đó, và vì City Builder Bits để dành Phase 8.

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
  Ghi nguồn vào đây khi nào atlas nướng ra từ nó được đưa vào `public/assets/`.
