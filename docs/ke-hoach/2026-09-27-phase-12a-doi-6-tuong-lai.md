# Phase 12A — đường lên đời 6 + mẻ atlas tương lai (27/09)

## Bối cảnh

11B anh xác nhận 27/09 (59 fps mọi màn). Anh chọn 27/09: chia Phase 12 làm hai — **12A** đời 6 + mẻ
tương lai, **12B** mẻ cổ đại + cận đại + lên 6 nước. `tech.json` có 8 công nghệ mỗi đời 1–5, đời 6
**0**; đời 5 `len: null`; `victory.json > khoa_hoc.doi` tạm 5.

## Làm gì (mỗi khối: test trước, code, `npm run do`, commit)

1. **8 công nghệ đời 6** vào `data/tech.json` (tiền đề từ đời 5, giá, lời, `thuong`) — chỉ dữ liệu.
2. **Mở đường lên đời 6** — `balance.json` đời 5 `len` = {40 công nghệ, số nhà đo bằng
   `sim:congnghe` cho tới được trong số giờ hợp lý}; bỏ ghi chú `_khoa_doi_4` đã sai.
3. **`victory.json > khoa_hoc.doi` 5 → 6** (đúng chốt 26/09), `sim:van` vẫn ĐẠT.
4. **Mẻ `tuong_lai`** — `tools/me/tuong_lai.json` chép khung `hien_dai` (đất, cây, người giữ nguyên),
   thay nhà/xưởng/mỏ bằng **Kenney Space Kit (CC0)**: hangar, structure, machine_generator,
   satelliteDish, monorail… Nướng **cùng số trang, `o_px`, `heSo`** với hai mẻ kia.
   Làm nhiều biến thể màu/tỉ lệ **một mẻ**, xem một bảng, chốt một lần.
5. **Đời 6 dùng `tuong_lai`** trong `balance.json`; `?me=tuong_lai` xem được ngay.
   Thêm vào `tai:asset` gói `space-kit`; `ASSET_CREDITS.md` thêm một dòng (file khoá → hỏi anh).

## Ngoài phạm vi

Mẻ cổ đại, cận đại, 6 nước (12B) · lính đời 6 · thẻ chính sách đời 4–6 · màn ghi công CC-BY.

## Đo bằng gì

`npm run do` xanh · test: đời 6 đọc được, đời 5 → 6 lên được, mẻ `tuong_lai` khớp trang/`o_px`/`heSo`
(`tests/BanDo.test.ts` đã bắt) · `sim:congnghe -- <giờ> 6` ĐẠT · `sim:van` ĐẠT ·
ảnh `npm run chup:man` với `?me=tuong_lai` · **anh xem trên iPhone qua bản duyệt**, báo fps.

## Lùi bằng gì

Mỗi khối một commit. Đời 6 về `me: hien_dai` là game như 11B.

## Rủi ro

- Mẻ hiện đại đã 2 trang ở 2× — mẻ tương lai phải vừa 2 trang, không thì cả ba mẻ phải đệm lên 3.
- Space Kit là căn cứ ngoài hành tinh, không phải thành phố — nhìn lạc tông thì báo anh trước khi đăng.
- Số nhà đời 4 hiện đòi 330, sim 120 giờ mới 310 — đời 6 có thể cần nhiều giờ chơi; đo trước khi chốt.
