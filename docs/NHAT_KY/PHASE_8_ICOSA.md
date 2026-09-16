# Phiên 15/09/2026 (lần 3) — đo kho gương Icosa, tải 1.671 model

**Việc:** đo allowlist Icosa chủ dự án mở 15/09, rồi tải hết model tải được.

## Đo allowlist — thông cả bốn

`api.icosa.gallery` **200** · `icosa.gallery` **200** · `archive.org` **200** ·
`web.archive.org` **200** nhưng **chỉ với `--http1.1`**; HTTP/2 qua proxy đứt giữa chừng
(`ws_closed_mid_exchange` sau ~11 giây). Chủ dự án mở thêm `backblazeb2.com` trong phiên →
`s3.us-east-005.backblazeb2.com` từ `000 connect_rejected` thành **200**.

## Bốn bẫy, đã ghi vào đầu `tools/tai_icosa.mjs`

1. **`fetch` của Node không tải được wayback** — `403 Blocked by egress policy` (nó không
   đi CONNECT qua proxy phiên). Phải gọi `curl`. API `api.icosa.gallery` thì `fetch` chạy tốt.
2. **Phải `--http1.1`.**
3. **Cấm tải thẳng URL API trả về** — mốc giả `20250101010101id_/…` trả 302, chờ
   `cdx.remote` ~16 giây thì tunnel đã đứt. Phải `curl -I` lấy `location` mốc thật rồi mới
   GET: **11s đứt → 2,4s xong**.
4. **Wayback thiếu bản lưu thật dù CDX bảo có.** `aqgXtgV8xVy`: CDX ghi
   `200 model/gltf-binary 1661644`, replay trả trang 404 cả bốn lần thử. Vì vậy phải thử
   lần lượt GLB → GLTF2 → GLTF1, rồi mới sang host backblaze. Từ khoá `windmill`
   **7/11 → 11/11** sau khi thêm bước này.

## Số đo

| | |
|---|---:|
| Model nhà/công trình (17 từ khoá) | **1.246 / 1.247** · 811 MB |
| Con vật (9 từ khoá) | **434 / 434** · 157 MB |
| Tổng trên đĩa | **1.671 model · 1.009 MB** |
| Bỏ vì license ND/SA | 283 + 93 |
| Bỏ vì quá 8.000 tam | 2.263 + 541 |

**Máy nướng đọc được ngay:** `docGltf()` đọc `Small House` ra 3.810 tam,
`Windmill.gltf` (bản backblaze, kèm `.bin` + `.png`) ra 908 tam, `Chicken_01.glb` ra 648 tam.
Không phải sửa gì ở `nuong_sprite.mjs`.

**Nợ `trai_ga` (treo từ 06/09) hết chặn:** `1YE8U35HXsI/Chicken_01.glb` — đúng model
Google mà Poly Pizza trỏ vào, nay tải được thật.

**License: toàn bộ CC-BY, không có CC0 nào.** ND và SA bị lọc từ đầu — ND cấm phái sinh mà
nướng sprite là phái sinh, và "chơi một mình, không buôn bán" không gỡ được điều đó.
Trước khi nướng mẻ Icosa phải thêm tên từng tác giả vào `docs/ASSET_CREDITS.md` (file khoá).

## Để lại

- `tools/tai_icosa.mjs` + `npm run tai:icosa` — lọc license, 4 luồng, chạy lại được,
  cache dò 24 giờ, mỗi model kèm `ghi_cong.json`.
- `docs/KHO_ICOSA.md` — bản kê sinh tự động, **lên git** nên phiên sau `grep` được mà
  không phải tải lại 1 GB.
- `docs/NGUON_MO.md` mục 9.

## Phiên 16/09 — kho chung tách repo, và ba lỗi lộ ra khi đo vòng tải lại

**Kho chung mới: https://github.com/gc1001vn-svg/kho-game** (Public, ~1,5 MB). Chủ dự án
chốt: repo giữ **bản kê + manifest**, không giữ nhị phân. Lý do bỏ hai đường kia:
đẩy 1 GB vào git thì lịch sử phình vĩnh viễn; Releases thì **máy ảo bị chặn** —
`Creating, editing, or deleting releases is not permitted for this session type`.
Tạo repo cũng chặn: `403 sessions are bound to their configured repositories` (chủ dự án
tạo tay, rồi `add_repo`).

Đo vòng tải lại từ manifest, 415 model: **377 khớp chính xác số tam · lệch số tam 0 ·
chỉ 1/415 hỏng riêng ở bản tải lại**. 20 cái còn lại hỏng ở **cả bản gốc**, tức tải lại
chỉ phơi nợ có sẵn ra.

**Ba lỗi thật, đã sửa gốc ở `tools/tai_icosa.mjs`:**

1. Manifest bản đầu chỉ giải mốc thật cho file gốc, `.bin` giữ mốc giả → **146 model**
   tải về file phụ **0 byte**; `.gltf` vẫn mở được nhưng `docGltf` gãy
   `Invalid typed array length: 3`.
2. **API không luôn khai `resources`** → 15 model có `.gltf` trỏ `model.bin` mà không có
   file nào. Nay đọc thẳng `buffers`/`images` trong `.gltf` rồi suy URL.
3. Model Tilt Brush trỏ shader ở `tiltbrush.com` — tham chiếu ngoài, nay bỏ qua thay vì
   báo hỏng.

Thêm: bảy thư mục có model mà **thiếu `ghi_cong.json`** (di sản bản tool cũ) đã tải lại
sạch. Kho nay **1.679 model · 0 thiếu ghi công**.

**Ghi công hết phải duyệt tay:** `docs/KHO_ICOSA.md` thêm cột *Trang gốc* → nó **là** bản
ghi công CC-BY. `docs/ASSET_CREDITS.md` (file khoá) chỉ trỏ sang, sửa đúng một lần bằng vé.

**Nợ để lại:** 5 model gãy `start offset of Float32Array should be a multiple of 4` —
lỗi căn lề trong `tools/lib/gltf.mjs`, thuộc bộ đọc chứ không phải khâu tải.
