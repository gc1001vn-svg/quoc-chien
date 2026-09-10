# PHASE 6C — trả nợ rà soát: số liệu sai, quy trình thủng

Ngày 11/09/2026. Không phải phase mới. Phiên này định mở Phase 7, nhưng chủ dự án hỏi
hai câu làm lộ ra chuỗi lỗi rà soát kéo dài nhiều phiên.

## Con số model sai suốt từ đầu

`kho_asset.mjs` khử trùng tên **trong từng thư mục**, mà mỗi gói xuất ra `fbx/` `gltf/`
`obj/` là ba thư mục riêng ⇒ mỗi model đếm ba lần. Đo lại trên kho đầy đủ: **3.960 lượt
file · 1.482 tên khác nhau · 1.222 tên có `.obj`**. Chỉ số cuối mới đáng tin, vì máy nướng
chỉ đọc OBJ. Con số 3.946 đang dùng phồng **3,2 lần**.

Số này còn bị gõ tay ở ba file nên lệch nhau qua các phiên: **1.855 → 2.781 → 3.946**.
Đã bỏ hết số cứng khỏi `CLAUDE.md` và `TIEN_DO.md`, chỉ trỏ về dòng cuối `KHO_ASSET.md`.

## Ba lỗ hổng chỉ lộ khi CHẠY, không lộ khi đọc code

1. `tai_itch.mjs` không xử lý **429**. Nâng `tai:itch` từ 2 lên 8 gói (~32 lượt gọi) là
   chắc chắn sập — gặp ngay lần chạy đầu. Thêm thử lại có nghỉ tăng dần.
2. `tai:tatca` **không tải hoạ tiết**. `tools/tai_hoa_tiet.mjs` tồn tại mà không script
   nào gọi ⇒ nướng sập vì thiếu `leafy_grass.jpg`. Thêm `tai:hoatiet`.
3. `check:credits` chỉ so **tên file atlas**, mà tên file không đổi khi thêm gói model
   mới ⇒ thêm gói CC-BY quên ghi công thì thước vẫn ĐẠT. Nay đọc `kit[].duong` trong
   `tools/me/*.json` và so tên gói sau khi chuẩn hoá.

Thêm chốt: `kho_asset.mjs` dừng khi số model tụt quá 20% (`KHO_EP=1` để ép).

## Lợn và cừu thật

Chủ dự án chỉ ra ba trại chăn nuôi dùng chung một hàng rào, chỉ khác màu nền — đúng.
Tải `quaternius/lowpoly-animated-animals` (CC0, 7 con, có OBJ): `Pig` vào `trai_lon`,
`Sheep` vào `trai_cuu`. **Ba vòng chỉnh vì ước sai `ti_le`**: 0,30 thì con vật to bằng cả
ô che hết trại; 0,075–0,095 mới vừa. Cừu ra xanh lam không phải lỗi model —
`Sheep.mtl` chỉ có xám `0.64`, ánh sáng cảnh làm ngả xanh; bù bằng `mau` ấm.
**`trai_ga` vẫn không có gà** — không gói nào trong 10 gói có. Ghi `NGUON_MO.md` mục 8.

## Bài học

Mọi sai sót phiên này cùng một dạng: **đo bằng thứ dễ đo, không phải thứ cần biết** —
đếm tên file thay vì model dùng được, `head` file thay vì đọc hết, tin tài liệu thay vì
chạy lại. Và cả bốn lần đều **chỉ lộ ra khi chủ dự án hỏi**.

Chốt chặn dựng bằng code chứ không bằng lời hứa: bảy bước đầu phiên `docs/DAU_PHIEN.md`,
ba chốt trong script, và ba quyết định trong kho `ghi-nho` (đọc hết ba file · bảy bước
đầu phiên · số liệu phải sinh từ lệnh).

Atlas sau khi thêm con vật: **2 trang / trần 4**, 74 sprite. `npm run do` 6/6, 133 test.
Chủ dự án đã xác nhận thấy lợn và cừu trên iPhone.
