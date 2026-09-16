# NGUỒN MỞ — QUỐC CHIẾN

> **Dò ở đây TRƯỚC khi tự làm bất cứ thứ gì** (CLAUDE.md mục Quy ước).
> Không có thứ cần dùng trong này → **báo chủ dự án quyết**, không tự vẽ, không tự ghép.
>
> Hai file khác nhau, đừng nhầm:
> - **File này** — nguồn ở ngoài, phần lớn **chưa tải**. Tra ngày 10/09/2026.
> - **`docs/KHO_ASSET.md`** — model **đã tải về** `assets_source/`, sinh bằng `npm run kho`.
>   Số thật ở **dòng cuối** file đó; đừng chép về đây (dòng này từng ghi một con số thứ ba,
>   khác cả hai chỗ khác, và không ai biết).
>
> Tìm nhanh theo phase: `grep -i 'P7' docs/NGUON_MO.md` · theo loại: `grep -i 'âm thanh'`

## 1. Luật lấy nguồn — đọc trước

| Được | Không |
|---|---|
| Asset **CC0** — dùng thoải mái, vẫn ghi `ASSET_CREDITS.md` | **CC-BY-SA** — lây license sang cả dự án, **cấm** |
| Asset **CC-BY** — phải ghi tên tác giả | Asset của game thương mại, dù "chỉ tham khảo" |
| Code **MIT / Apache / BSD** — dùng được, giữ nguyên file LICENSE | **Copy code GPL/AGPL** — đọc để hiểu kiến trúc thì được, chép một dòng là cấm |
| Font **OFL** | Font "free for personal use" |

License ghi trong bảng dưới là **theo trang giới thiệu, chưa mở từng file `LICENSE`**.
Trước khi thật sự dùng một nguồn: mở `LICENSE` của chính gói đó đối chiếu.

## 2. Model 3D — nướng thành sprite (P1 · P8 · P10 · P12)

| Nguồn | License | Có gì | Dùng cho | Cách lấy |
|---|---|---|---|---|
| **Kenney** <https://kenney.nl/assets> | CC0 | ~80 gói: Fantasy Town, Tower Defense, Castle, Nature, City, Factory, Space, Car, Blaster | P1 trung cổ · P12 công nghiệp, hiện đại, tương lai | `npm run tai:asset <slug>` |
| **Quaternius** <https://quaternius.com> | CC0 | ~30 gói: Medieval Village, Stylized Nature, Fantasy Props, Modular Sci-Fi Megakit (270 mảnh), Sci-Fi Essentials, Ultimate Modular Sci-Fi, Modular Street, Survival, Modular Dungeon | P1 trung cổ · P12 tương lai, hiện đại | `node tools/tai_itch.mjs quaternius/<slug>` |
| **KayKit** (Kay Lousberg) <https://kaylousberg.itch.io> | CC0 | Medieval Builder (công trình nguyên khối), City Builder Bits (hiện đại), Dungeon, Character | P1 trung cổ · P8 hiện đại | `node tools/tai_itch.mjs kaylousberg/<slug>` |
| **Poly Pizza** <https://poly.pizza> | CC0 + CC-BY (lọc) | Kho low-poly gộp nhiều tác giả, tìm theo từ khoá | Mọi phase — **chỗ tìm khi ba nguồn trên không có** | **Dò được, TẢI KHÔNG ĐƯỢC** (Cloudflare) — mục 9 |
| **Icosa Gallery** <https://icosa.gallery> | **CC-BY** (không có CC0) | Kho gương của Google Poly — hàng chục nghìn model low-poly | Mọi phase — **nguồn tải được thay Poly Pizza** | `npm run tai:icosa <từ khoá>` — mục 9 |
| **Sketchfab** (lọc CC0) <https://sketchfab.com/search> | Lọc CC0 | Kho lớn nhất, chất lượng lẫn lộn | Khi cần một model lẻ rất cụ thể | Tải tay |
| **Smithsonian Open Access** <https://3d.si.edu/cc0> | CC0 | Hiện vật bảo tàng quét 3D thật | P12 cổ đại — **hiện vật lịch sử thật** | Tải tay |
| **Blend Swap** (lọc CC0) <https://blendswap.com> | Lọc CC0 | File `.blend`, phải xuất sang OBJ | Phương án cuối | Tải tay |
| **itch.io CC0** <https://itch.io/game-assets/assets-cc0/tag-3d> | CC0 | Gói lẻ nhiều tác giả | Mọi phase | `node tools/tai_itch.mjs <tác-giả>/<gói>` |
| **Game Assets Garden** <https://gameassetsgarden.com> | Miễn phí, không cần ghi nguồn | Gói nhỏ, không cần đăng ký | Phương án dự phòng | Tải tay |

**Đã tải 10/09 — KayKit Medieval Hexagon Pack** <https://kaylousberg.itch.io/kaykit-medieval-hexagon>
· CC0 (`License.txt` đã mở đọc: "Creative Commons Zero, CC0", Kay Lousberg, 26/04/2024)
· **135 model công trình + 68 model trang trí**, cùng một hoạ sĩ với gói `builder-pack` đang
dùng nên **cùng phong cách**. Công trình đứng rời trên `y = 0`, KHÔNG dính đế lục giác, nướng
được thẳng. Có: `blacksmith` `lumbermill` (lưỡi cưa rời) `tavern` `market` `church` `barracks`
`archeryrange` `mine` `well` `windmill` (cánh quạt rời) `watermill` (bánh xe rời) `castle`
`tower_A/B` `tower_catapult` `home_A/B` `grain` `scaffolding` `bridge` `stage` — **mỗi cái bốn
màu** red · green · blue · yellow. Trang trí: `barrel` `sack` `crate_*` `pallet` `wheelbarrow`
`weaponrack` `target` `tent` `ladder` `fence_wood/stone` `resource_lumber` `resource_stone`
`rock_single_A..E` `tree_*` `hill_*` `mountain_*`.

**Chưa tải nhưng chắc chắn cần:** Kenney City Kit + Factory Kit (P12 công nghiệp/hiện đại),
Quaternius Modular Sci-Fi Megakit (P12 tương lai), KayKit City Builder Bits (P8 — đã ghi
trong `ASSET_CREDITS.md` từ 07/09 nhưng **chưa nướng**).

**Đã thử rồi bỏ, đừng tải lại:** `quaternius/lowpoly-farm-buildings` — nông trại Mỹ thế kỷ 19,
sai thời đại (lý do đầy đủ trong `ASSET_CREDITS.md`).

## 3. Hoạ tiết bề mặt (P1 ô nền · P7 bản đồ giấy da)

| Nguồn | License | Có gì | Cách lấy |
|---|---|---|---|
| **Poly Haven** <https://polyhaven.com/textures> | CC0 | PBR 1k–8k: cỏ, đất, đá, cát, gạch, **giấy da, vải** | `node tools/tai_hoa_tiet.mjs <mã>` |
| **ambientcg** <https://ambientcg.com> | CC0 | 1.500+ vật liệu PBR, nhiều hơn Poly Haven | Tải tay |
| **Texture Ninja** <https://texture.ninja> | CC0 | Ảnh chụp bề mặt thật | Tải tay |

P7 cần **giấy da** (`parchment`, `paper`, `leather`) và **vải bản đồ** — có ở cả ba nguồn.

## 4. Biểu tượng (P8 cây công nghệ, thẻ chính sách · P11 ngoại giao)

| Nguồn | License | Có gì |
|---|---|---|
| **game-icons.net** <https://game-icons.net> | **CC-BY 3.0** — phải ghi tên tác giả từng icon | 4.180 SVG: vũ khí, giáp, tài nguyên, kỹ năng, cờ, sinh vật. Nét đậm, đọc được ở cỡ nhỏ — **đúng thứ cây công nghệ cần** |
| **Openclipart** <https://openclipart.org> | CC0 | Hình vẽ vector đủ loại |
| **Lucide** <https://lucide.dev> | ISC | Icon giao diện (nút, mũi tên, đóng/mở) |

game-icons.net là CC-BY chứ không CC0 → mỗi icon dùng phải ghi tác giả vào `ASSET_CREDITS.md`.
Trang cho tải cả bộ kèm file ghi công.

## 5. Âm thanh và nhạc (P13)

| Nguồn | License | Có gì |
|---|---|---|
| **Kenney Audio** <https://kenney.nl/assets/tag:audio> | CC0 | 10 gói: Interface, Impact, RPG Audio, Sci-fi, Music Jingles. **51 tiếng đã ghi trong KE_HOACH** |
| **OpenGameArt** (lọc CC0) <https://opengameart.org> | Lọc CC0 | Tiếng động và nhạc, có ô lọc CC0 trong tìm nâng cao |
| **freesound** (lọc CC0) <https://freesound.org> | Lọc CC0 | 730.000+ tiếng, license theo từng file — **phải lọc** |
| **Sonniss GDC Bundle** <https://sonniss.com/gameaudiogdc> | Royalty-free, không cần ghi nguồn | Bộ chuyên nghiệp phát hằng năm, bản 2026: 7,47 GB / 347 WAV. Các bản từ 2015 vẫn tải được |
| **Musopen** <https://musopen.org> | CC0 / public domain | Nhạc cổ điển thu âm — nhạc nền thời đại |
| **Free Music Archive** <https://freemusicarchive.org> | Lọc CC0/CC-BY | Nhạc nền |

## 6. Font

| Nguồn | License | Ghi chú |
|---|---|---|
| **Be Vietnam Pro** <https://fonts.google.com/specimen/Be+Vietnam+Pro> | OFL | Dấu tiếng Việt vẽ riêng, 6 độ đậm. **Hợp nhất cho game này** |
| **Noto Sans** <https://fonts.google.com/noto> | OFL | Phủ tiếng Việt đầy đủ, trung tính |
| **Google Fonts** <https://fonts.google.com> | OFL | Lọc `Vietnamese` trong bộ lọc ngôn ngữ |

Hiện game dùng font hệ thống (`-apple-system`) — **chưa cần font riêng**. Nạp font là thêm
vài trăm KB vào PWA, chỉ làm khi P13 đánh bóng và chủ dự án thấy chữ xấu.

## 7. Mã nguồn — học kiến trúc, KHÔNG chép code

Chi tiết đầy đủ ở **`docs/THAM_KHAO.md`** (8 game) và **`docs/HOC_MA_NGUON_MO.md`**.
Tóm tắt để grep:

| Game | License | Học gì | Phase |
|---|---|---|---|
| Widelands | GPLv2+ | Kinh tế mạng lưới, hàng chảy trên đường | P3 P4 |
| Julius / Augustus (Caesar III) | AGPL | Hệ walker — nhà phát ra người đi bộ | P4 |
| Unknown Horizons (Anno) | GPLv2 | Dân có bậc, đủ nhu cầu thì lên bậc | P8 |
| Freeciv | GPL | Cây công nghệ hai tiền đề, trạng thái ngoại giao | P8 P11 |
| OpenRA | GPL | Giải trận bằng bảng giáp × đạn | P9 |
| 0 A.D. | GPLv2 (đồ hoạ CC-BY-SA — **cấm dùng đồ hoạ**) | AI chia lớp kinh tế/quân sự | P5 |

### Nguyên tắc quy hoạch đô thị — tra 10/09

| Nguồn | Học gì | Dùng ở |
|---|---|---|
| **Đơn vị lân cận** (Clarence Perry, 1929) <https://www.designboom.com/architecture/clarence-perry-neighborhood-unit-15-minute-city/> | Khu ở tự cấp: tiện ích ở **lõi**, đi bộ 5–10 phút là tới; đường lớn chạy **vòng quanh**, không xuyên qua; 10 % diện tích để trống | `src/sim/city/QuyHoach.ts` |
| **Thành phố 15 phút** | Bản hiện đại của cùng ý tưởng | như trên |
| Caesar III | Nhà cần **giếng hoặc đài nước** trong tầm; chợ đặt giữa khối nhà | Bố cục phường |

## 8. Chưa tìm được — cần chủ dự án quyết

Ghi vào đây mỗi khi dò không ra, **trước khi tự vẽ**:

| Cần gì | Phase | Đã dò | Kết quả |
|---|---|---|---|
| Vườn nho, chuồng thú, lò nung, nhà chài, công trường | P6B | Kenney · Quaternius · KayKit | Không có → **ghép tay, chủ dự án biết** |
| Lò rèn · xưởng cưa · xưởng rượu · xưởng vũ khí · trại lính · nhà dân | P6B vòng 2 | KayKit Medieval **Hexagon** Pack | **CÓ ĐỦ, đã dùng 10/09** — `blacksmith` `lumbermill` `tavern` `archeryrange` `barracks` `home_A/B` |
| Cối xay gió, giếng | P6B | — | **Có, ở KayKit** — 10/09 tự ghép nhầm rồi thay lại bằng model thật |
| **Lợn · gà · cừu** (3 trại chăn nuôi) | P6B | Kenney · Quaternius · KayKit ×2 · cả kho asset | **Không có con vật nào.** Ba trại tạm phân biệt bằng màu nền + màu lán + đồ chất quanh. Cần model thú thì phải tìm nguồn mới |
| **Lợn · cừu** — dò lại 11/09 | P6B | `quaternius/lowpoly-animated-animals` | **ĐÃ TẢI VÀ DÙNG 11/09.** CC0 1.0, 7 con có OBJ. `Pig` vào `trai_lon`, `Sheep` vào `trai_cuu` — hai trại nay phân biệt bằng con vật thật, không còn chỉ khác màu nền |
| **Gà** | P6B | Kenney · Quaternius ×6 · KayKit ×3 | **Vẫn không gói nào có.** `trai_ga` còn phân biệt bằng chuồng + màu nền. Cần thì phải tìm nguồn mới |
| **Gà — dò lại 15/09 bằng `npm run do:asset ga`** | P6B | + kho chung `tayvuc` · Poly Haven (521 model) | **Kho chung CÓ `Chicken`** — `quaternius/ultimate-monsters/Blob`. Kết luận "không gói nào có" ở dòng trên **thiếu bước 1b**, không sai hẳn: 11 gói đã tải thì đúng là không có. Nhưng đây là **gói quái vật kiểu blob**, dáng khác hẳn `Pig`/`Sheep` đang dùng. Poly Haven: dò 521 model, **0 trúng** |
| **Gà — GIẢI XONG 15/09, nguồn Poly Pizza** | P6B | Poly Pizza (khoá API đã có) | **`Chicken` CC0 1.0 · 2.648 tam · `.glb`** và **`ChickenCoop` CC0 1.0 · 948 tam · `.glb`**. Cả hai CC0 nên không phải ghi công tác giả; **vẫn phải ghi công Poly Pizza kèm link** theo ToS của họ. Máy nướng đọc `.glb` từ 11/09 → dùng thẳng được. `trai_ga` hết phải phân biệt bằng màu nền |
| Nhà ở · tháp canh · cổng làng (290 công trình) | P2 | `kk:house` `kk:watchtower` `kk:wall_gate` | **Có model nguyên khối, nhưng CỐ Ý không dùng** — xem dưới |

### Nhà ở: ghép tay là cố ý, đừng "sửa" lại

Rà soát 10/09 (`grep` toàn bộ 67 sprite): 20 model nguyên khối · 21 ghép nhiều mảnh ·
7 tấm nền tự sinh · 19 bản sao đổi màu. **Không sprite nào vẽ từ số không.**

Nhà ở, tháp canh, cổng làng ghép tay từ mảnh Quaternius tuy KayKit có model nguyên khối,
vì đã nướng thử và so ảnh: nhà Quaternius **299×236 px** có hoạ tiết tường đá, ngói vân,
khung gỗ; nhà KayKit chỉ **165×100 px** màu bệt. Thêm nữa hai công thức Quaternius đẻ ra
**bảy biến thể màu** bằng khoá `nhu`, model nguyên khối thì không.

Bảy ô nền là tấm phẳng tự sinh + hoạ tiết Poly Haven, lý do ở `TECH_SPEC` mục 3: Quaternius
không có ô nền, mượn ô nền gói khác thì lệch thước lưới.

## 9. Icosa Gallery — kho gương Google Poly, đo 15/09/2026

**Đây là nguồn thay Poly Pizza.** Poly Pizza dò được nhưng `static.poly.pizza` trả `403`
kèm `Just a moment...` của Cloudflare, kể cả khi lái Chromium. Icosa là kho gương của
chính Google Poly — phần lớn model nhà trên Poly Pizza gốc từ đó — và đường tải của nó
đi qua `web.archive.org`, không đụng Cloudflare.

```bash
npm run tai:icosa house building        # từ khoá tiếng Anh
npm run tai:icosa nha --tam 8000        # tiếng Việt: dịch qua tools/tu_dien_asset.json
npm run tai:icosa house --thu           # chỉ in ra sẽ tải gì
```

Model rơi vào `assets_source/icosa/<assetId>/`, kèm `ghi_cong.json` (tên · tác giả ·
license · số tam · link trang) — nguyên liệu cho `docs/ASSET_CREDITS.md`.

**License: TOÀN BỘ CC-BY, không có CC0 nào.** Đo 788 model nhà: `770 CC-BY 3.0` ·
`1 CC-BY 4.0` · `17 CC-BY-ND 3.0`. Luật repo nhận CC-BY nhưng **bắt buộc ghi tên từng tác
giả**; `tai_icosa.mjs` **tự loại ND và SA** — ND cấm tác phẩm phái sinh, mà nướng sprite
chính là phái sinh.

**Bốn bẫy đã đo, đừng "tối ưu" lại** (chi tiết ở đầu `tools/tai_icosa.mjs`):

| Bẫy | Dấu hiệu | Cách đúng |
|---|---|---|
| `fetch` của Node không tải được wayback | `403 Blocked by egress policy` | Gọi `curl` (nó đi CONNECT qua proxy phiên) |
| HTTP/2 đứt giữa chừng | `ws_closed_mid_exchange` sau ~11 giây | Thêm `--http1.1` |
| Tải thẳng URL API trả về | Mốc giả `20250101010101id_/…` trả 302, chờ `cdx.remote` ~16 giây rồi đứt | `curl -I` lấy `location` mốc thật rồi mới GET (11s đứt → 2,4s xong) |
| Host thứ hai của Icosa | `s3.us-east-005.backblazeb2.com` → từng `000 connect_rejected` | Chủ dự án mở allowlist 15/09 → `200`. Nó vớt đúng những model wayback hỏng |
| Wayback thiếu bản lưu dù CDX bảo có | `aqgXtgV8xVy`: CDX ghi `200 model/gltf-binary 1661644`, replay trả 404 cả bốn lần | Thử lần lượt GLB → GLTF2, rồi sang host backblaze |
| Bản GLTF1 lọt vào | `(j.buffers ?? []).map is not a function` | Bộ đọc chỉ hiểu glTF 2.0 — đã bỏ GLTF1 khỏi danh sách ưu tiên |

**Số model KHÔNG ghi ở đây.** Ba chỗ có số thật, mỗi chỗ một việc:

| Cần biết | Xem ở |
|---|---|
| Model Icosa **đã tải về đĩa** | dòng cuối `docs/KHO_ICOSA.md` |
| Toàn bộ model **dò được**, mọi nguồn | `kho-game/README.md` + `node cong-cu/do.mjs <từ khoá>` |
| Model trong `assets_source/` | dòng cuối `docs/KHO_ASSET.md` |

Mục 9 này từng gõ tay một con số kiểm kê và lạc hậu sau đúng một phiên —
`tests/TaiLieu.test.ts` giữ cho khỏi tái phát.

## 10. Kho mục lục chung `kho-game` — dò ở đây TRƯỚC

<https://github.com/gc1001vn-svg/kho-game> — mục lục nhiều nguồn, **không chứa file**;
dò thấy cái nào cần mới tải cái đó. Bước 1c của `npm run do:asset` tự gọi nó.

```bash
git clone --depth 1 https://github.com/gc1001vn-svg/kho-game /home/user/kho-game
node /home/user/kho-game/cong-cu/do.mjs ga --tam 8000
node /home/user/kho-game/cong-cu/lay.mjs icosa --loc chicken
```

Nguồn nào trong đó, bao nhiêu dòng, lấy bằng cách gì: `README.md` của repo đó.
**Đừng chép số về đây** — nó đổi mỗi lần quét lại.

---

Tra ngày 10/09/2026, thêm mục 9 ngày 15/09/2026, thêm mục 10 ngày 16/09/2026.
Danh sách gộp thêm từ <https://github.com/madjin/awesome-cc0>.
Thêm nguồn mới thì thêm dòng vào đây, đừng viết ra chỗ khác.
