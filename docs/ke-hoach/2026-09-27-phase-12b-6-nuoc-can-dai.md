# Phase 12B — lên 6 nước + mẻ atlas cận đại (27/09)

## Bối cảnh

12A anh "ok" 27/09. Anh chốt 27/09 (lần 19): 12B = **6 nước + cận đại**; cổ đại sang **12C**
(dò 27/09: kho-game không có bộ CC0 cổ đại; Poly Pizza vẫn `403` Cloudflare → chọn Icosa CC-BY
hoặc Kenney gần giống ở 12C). Hiện: 4 nước × 5 tỉnh + 8 trung lập = 28 tỉnh trên lưới cụm 7×4;
KayKit hex chỉ có 4 màu phe (đỏ/lá/lam/vàng) — **cùng hình khối, chỉ khác UV trên một ảnh bảng
màu** `hexagons_medieval.png`. Đời 1–4 dùng mẻ `trung_co_2`.

## Làm gì (mỗi khối: test trước, code, `npm run do`, commit)

1. **Nhuộm 2 màu phe mới (tím, cam)** — máy nướng thêm khoá kit `doi_mau_anh`: chép ảnh bảng
   màu, đổi đúng các ô màu đỏ sang màu mới (canvas trong Chromium lúc nướng, không thêm thư viện).
   Mẻ `hex_1` thêm `thanh_/nha_/mo_/trai_linh_/cho_/co_` × `tim`, `cam` (12 sprite). Nhiều sắc
   độ một mẻ, xem một bảng, chốt một lần. Vừa 1 trang atlas như cũ.
2. **6 nước** — `data/nations.json` thêm 2 nước (tên tạm **Tử Vân** tím · **Đan Sơn** cam, hai đặc
   tính mỗi nước). `data/provinces.json` lưới cụm **9×4 = 36 tỉnh: 6 × 5 + 6 trung lập** — giữ 5
   tỉnh/nước nên số cân bằng mỗi nước không đổi. Sửa test cứng số 4/28.
3. **Cân lại luật thắng** — `sim:van` với 6 nước: thống trị/ngoại giao/văn hoá/khoa học. Số nào
   lệch thì chỉnh trong `data/*.json`, không chỉnh code.
4. **Mẻ `can_dai`** (đời 3–4) — `tools/me/can_dai.json` chép khung `trung_co_2` (đất, cây, người
   giữ nguyên), nhà/xưởng ghép từ **Kenney Retro Urban Kit (CC0)** (tường gạch `wall-a/b`, mái,
   cửa sổ, đường đất) + **City Kit Industrial** cho lò/xưởng. Cùng số trang, `o_px`, `heSo`.
5. **Đời 3–4 dùng `can_dai`** trong `balance.json`; `?me=can_dai` xem được. `tai:asset` thêm
   `retro-urban-kit`; `ASSET_CREDITS.md` thêm một dòng (file khoá → hỏi anh).

## Ngoài phạm vi

Mẻ cổ đại (12C) · lính riêng đời 3–4 · màn ghi công CC-BY · AI khác nhau theo đặc tính nước.

## Đo bằng gì

`npm run do` xanh · test: 6 nước, 36 tỉnh, hex không trùng, mỗi nước đủ sprite màu; mẻ
`can_dai` khớp trang/`o_px`/`heSo` · `sim:van` ĐẠT · `check:tran` (36 tỉnh ≈ 252 hex) ·
ảnh `npm run chup:man` bản đồ + `?me=can_dai` · **anh xem trên iPhone qua bản duyệt**, báo fps.

## Lùi bằng gì

Mỗi khối một commit. Đời 3–4 về `trung_co_2`; `nations.json` + `provinces.json` về bản 4 nước.

## Rủi ro

- Ghép ~38 công trình từ mảnh tường là việc to nhất — lệch tông thì dừng ở bảng xem, báo anh.
- `TheGioi.ts` 299/300 dòng — thêm gì phải tách trước.
- 6 nước làm ván dài hơn; thống trị có thể tụt dưới 2/5 hạt giống — đo rồi báo, không tự hạ luật.
- Bản đồ 9 cụm ngang có thể không vừa màn dọc 393 px ở `zoomDau` cũ — chụp màn kiểm.
