# Phiên 16/09/2026 (lần 2) — kho mục lục chung 9 nguồn, và ba lỗi bộ đọc glTF

**Việc:** chủ dự án chốt kho chung chỉ ghi mục lục, cần cái nào tải cái đó. Mở rộng từ
1 nguồn lên 9, sửa nợ bộ đọc, nối vào `do:asset`.

## Kho chung — https://github.com/gc1001vn-svg/kho-game

**112.336 dòng mục lục, 9 nguồn, repo 4,4 MB.** Icosa 73.626 · OpenGameArt 22.714 ·
Poly Pizza 6.136 · `assets_source` 3.960 · Poly Haven 2.378 · Google Fonts 1.941 ·
kho chung `tayvuc` 1.347 · Kenney 215 gói · mã nguồn mở 10.

Ba loại tài nguyên trước đây **không có nguồn nào**: âm thanh, nhạc, font.

## Bốn cách lấy, bốn kiểu chặn khác nhau — đừng mò lại

| Nguồn | Cách chạy được | Đã thử mà hỏng |
|---|---|---|
| Icosa | API + `curl --http1.1`, giải mốc thật trước khi GET | — |
| OpenGameArt | `curl` trang `art-search-advanced`, **query phải dùng chỉ số `[0]`** | `[]` vẫn trả `200` nhưng không lọc gì, chỉ ra 8 mục sidebar · `/api/entity/node` → `404` |
| Kenney | **lái Chromium**, lọc `a[href*="kenney.nl/assets/"]` | `curl` chỉ thấy khung trang · `/data/assets.json`, `/api/assets`, `/assets.json` → `404` · `a[href^="/assets/"]` ra 0 dòng vì href là URL tuyệt đối |
| Google Fonts | `raw.githubusercontent.com` + `tags/all/families.csv` | `fonts.google.com/metadata/fonts` → `000` · `api.fontsource.org` → `000` · `api.github.com` → `403 GitHub access to this repository is not enabled for this session`, kể cả có `GITHUB_TOKEN` |

Chưa lấy được: **ambientCG** (request đầu `200`, sau đó `000 ws_closed_mid_exchange` cả
trang chủ) · **game-icons.net** (`000`) · **Freesound** (thông, `401`, chờ khoá — lệnh
`quet_freesound.mjs` viết sẵn).

## Ba lỗi bộ đọc glTF — kho từ 1.654/1.679 lên 1.679/1.679

1. `RangeError: start offset of Float32Array should be a multiple of 4` — file thật có chỗ
   lệch; nay đọc từng số bằng `DataView` khi offset không căn lề.
2. Bản **GLTF1** lọt vào: glTF 1.0 để `buffers` là object nên `(j.buffers ?? []).map is
   not a function`. Bỏ GLTF1 khỏi danh sách ưu tiên.
3. Thư mục có model mà **file phụ 0 byte** vẫn bị bỏ qua — 25 model `.gltf` trỏ `.bin` rỗng.

`tai_icosa.mjs` nay gọi `docGltf` ngay sau khi tải: bản nào không mở được thì thử bản kế.

## Kenney City Kit — đổi thế cờ Phase 8B

Tải và đếm thật: `suburban 21 dáng nhà · commercial 19 (+22 bản low-detail) ·
industrial 20 · roads 95 mảnh đường`. **60 dáng nhà, một tác giả**, game cần 32 → dư gần
hai lần, không vướng cái chặn phong cách của Icosa. Cả bốn `License.txt` ghi
`Creative Commons Zero, CC0`. `docObj` đọc **213/213 model, 0 lỗi**.

Cái chặn cũ ở `TIEN_DO.md` mục 5 — "8 dáng cho 32 loại nhà" — **không còn**.

## Máy bắt thay người

Hook `chan_bao_xong` nay đòi **thêm dòng `Đề xuất:`** khi báo xong. Trước đó luật chỉ nằm
ở `CLAUDE.md` của repo này và chỉ áp cuối phiên, nên xong việc giữa phiên thì không ai
bắt — chủ dự án phải tự nghĩ ra việc tiếp. Ba repo cùng `md5 056679fe`, kho 32/32 mẫu đúng.

## Nợ để lại

- **Tác giả OpenGameArt để `?`** — trang danh sách không hiện, lấy lười bằng
  `cong-cu/tac_gia.mjs <đường dẫn>`. CC-BY đòi ghi tên, **chạy trước khi dùng**.
- `npm run kho` **vẫn cấm chạy**: `assets_source/` giờ chỉ có `icosa` + 4 City Kit, chạy
  là ghi đè `KHO_ASSET.md` mất phần còn lại.

## Bổ sung cuối phiên — Freesound và chốt số

**Freesound vào kho: 27.313 file** (CC0 14.587 · CC-BY 4.0 10.753 · CC-BY 3.0 1.973).
Chủ dự án lấy khoá API trong phiên. Quét 41 từ khoá — kho họ có 735.011 file nên đây là
phần liên quan tới game, không phải cả kho. Khác OpenGameArt: Freesound **có sẵn tên tác
giả** trong kết quả API, khỏi mở từng trang. Khoá đi qua biến `FREESOUND_KEY`, đã `grep`
lại repo để chắc nó không lọt vào file nào.

**Chốt: 139.650 dòng mục lục, 10 nguồn.** Riêng **model 3D dò được: 86.290**
(Icosa 73.626 · Poly Pizza 6.136 · OpenGameArt 3D Art 3.475 · `assets_source` 1.222 ·
kho chung `tayvuc` 1.310 · Poly Haven 521), cộng **215 gói Kenney** chưa kê lẻ từng model.

Phần còn lại: âm thanh 28.740 · nhạc 6.825 · 2D 9.347 · hoạ tiết 3.497 · HDRI 996 ·
font 1.941 · mã nguồn mở 10.

## Vòng cuối — 2D, Kenney chia loại, kho asset đầy đủ trở lại

Chủ dự án hỏi "model 2D đâu" — **có, nhưng mục lục không nói ra**. Ba sửa:

1. **Kenney chia theo loại:** `2D 145 · 3D 50 · Audio 10 · Textures 9 · Other 1`. Trước
   quét chung một danh sách nên 215 gói không ai biết `tiny-factory` là sprite hay model.
   Lần quét đầu chỉ lấy `2D/3D/Audio` thì **mất 10 gói hoạ tiết** (`pattern-pack`,
   `prototype-textures`, `road-textures`, `skyboxes`…) — phải thêm `Textures` và `Other`.
2. **Thêm itch.io CC0: 525 gói** (`tag-2d 360` · `tag-3d 165`). Bước **quét** không cần
   Chromium — trang duyệt ra ở máy chủ; chỉ bước **tải** mới cần (danh sách file nạp bằng
   JS). Hai cảnh báo: license **tác giả tự khai**, itch không kiểm; và bộ lọc
   `assets-cc0` lọc theo license **chứ không theo giá** nên gói $19.95 vẫn lọt vào.
3. **Nợ `npm run kho` hết:** chạy `npm run tai:tatca` (2,1 GB, 17 gói) rồi `npm run kho` →
   `KHO_ASSET.md` **2.164 model** (trước bị cắt còn 1.222 vì đĩa chỉ có `icosa` + 4 City
   Kit). Mục lục nạp lại: 3.960 → **6.288 dòng**.

**Chốt cuối phiên: 142.504 dòng · 11 nguồn · repo ~4,5 MB.** Tìm 2D thì có OpenGameArt
9.347 mục · itch.io 360 gói · Kenney 145 gói.

Nợ cố ý giữ: **tác giả OpenGameArt để `?`** — lấy lười bằng `cong-cu/tac_gia.mjs` đúng lúc
dùng, quét sẵn 22.714 mục là 22.714 lượt gọi cho thứ 99% không đụng tới.
