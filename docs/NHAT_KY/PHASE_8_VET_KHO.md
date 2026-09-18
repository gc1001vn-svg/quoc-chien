# PHASE 8 — RÀ SOÁT VÀ CHỐT `kho-game` (18/09/2026)

Không đụng màn hình game. Toàn bộ thay đổi ở repo `kho-game`; repo này chỉ ghi nhật ký.

## Hỏng nặng nhất: kho KHÔNG tự đủ, và hỏng lặng

`cong-cu/do.mjs` đọc từ điển Việt→Anh ở `../../quoc-chien/tools/tu_dien_asset.json`. Đo
bằng cách giấu file đó đi: `ga` ra **1 trúng** (font `Ga Maamli`) thay vì **306**, không
một dòng cảnh báo. Dự án mới nào không clone `quoc-chien` nằm cạnh thì mọi từ khoá tiếng
Việt câm lặng — đúng cái bẫy đã làm mất sáu phiên với `trai_ga`.

Sửa: bản gốc về `kho-game/cong-cu/tu_dien.json`, bản `quoc-chien` vẫn gộp thêm nếu có.
Đo lại sau khi sửa: **306 trúng dù không có `quoc-chien`**.

## Hỏng thứ hai: bản kê không có thước nào giữ

`scripts/do.sh` của `kho-game` chỉ có 2 thước mặc định `cai_dat.mjs` sinh ra. Thứ duy nhất
repo đó có là bản kê, mà không thước nào đụng tới — ba luật ở `CLAUDE.md` chỉ là chữ phải
nhớ. Thêm `cong-cu/vet_kho.mjs` → thước `vet:kho`: cột `ten`/`license` bắt buộc · số cột
đều · **SA/ND** · `id` trùng · nhị phân trong git · từ điển lệch · license `?` **chỉ được
tụt** (trần `cong-cu/nguong_vet.json`, tụt thì tự hạ).

## Chốt một cách đếm model — `cong-cu/dem_model.mjs`

Bốn điều kiện: license CC0·CC-BY·MIT · `.obj`/`.gltf`/`.glb` (**`.fbx` chưa**) · ≤ 8.000
tam · **tải được từ máy ảo**. Đo 18/09: Icosa **41.333/73.626** · Poly Haven **210/521** =
**41.543 model lẻ**, cộng **215 gói** Kenney/itch chưa kê lẻ. Loại Poly Pizza **5.274** vì
`static.poly.pizza` trả 403 của Cloudflare. **Cái chặn Phase 8B chưa bao giờ là số model**
— là phong cách: 41.333 model Icosa của hàng nghìn tác giả, và toàn bộ CC-BY.

## Sạch sẵn, không phải sửa

0 dòng lệch cột · 0 `id` trùng · **0 license SA/ND lọt** · hook 5/5 khớp md5 với
`quoc-chien` và `ghi-nho` · 14/14 số trong README khớp file thật.

## Nợ để lại, đã ghi vào README của `kho-game`

`ke/quoc-chien-assets.tsv` không đủ tư cách bản ghi công (luật 2): 6.288 dòng, **không có
cột `tac_gia`**, license `?` **4.497/6.288** — toàn bộ số `?` của cả kho nằm ở đây — và
`cach_lay` chỉ đúng **một** chuỗi `tai_itch.mjs` cho cả 6.288 dòng, sai với 4 gói Kenney và
sai với **1.689 dòng Icosa nằm nhầm** (trùng `ke/icosa.tsv`, ở đó đủ tác giả + số tam).
Sửa ở **gốc** là `tools/kho_asset.mjs` của repo này, không sửa tay. 13/15 nhóm lấp được
license từ `ke/kenney.tsv` + `ke/itch.tsv`.

Còn: `ke/icosa.md` 230 KB không ai trỏ tới (`git rm` bị chặn `[Irreversible Local
Destruction]`) · license 8 kiểu viết cho cùng một thứ · `do.mjs chicken --tam 8000` in
**26 KB ≈ 7.000 token**.

## Ba thứ mới biết

1. **`add_repo` với `access: read` KHÔNG đủ để push repo public.** Git proxy trả
   `access denied by the git proxy: ... is not in this session's authorized repository set`.
   Phải `access: "push"`, và lần đầu gọi bị bộ lọc chặn `[Permission Grant]` — chủ dự án
   bấm cho qua. Khác với `ghi-nho`, nơi `read` đủ để đẩy.
2. **Hook chỉ chạy cho repo mở phiên.** Sửa `kho-game/CLAUDE.md` (file khoá) từ phiên mở ở
   `quoc-chien` thì `chan_file_khoa` **không chạy**: vé không tiêu, sổ không ghi. Đã xoá vé
   tay sau khi sửa.
3. **`git rm` bị bộ lọc chặn `[Irreversible Local Destruction]`** ở chế độ `Auto`.
