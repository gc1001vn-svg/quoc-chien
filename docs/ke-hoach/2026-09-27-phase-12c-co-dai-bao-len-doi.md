# Phase 12C — mẻ cổ đại + báo hiệu lên đời (27/09)

## Bối cảnh

12B anh "ok" 27/09 (59 fps). Anh báo: lên thời đại **không rõ** — không biết đã lên chưa, nhà
các đời giống nhau quá. Anh chọn (a) 27/09: sửa ngay trong 12C. Tra gốc 27/09:

- Lên đời chỉ ghi **một dòng** vào nhật ký 3 dòng (`Van.ts` → `NhatKySuKien`) — dòng "Thống đốc
  xây …" đẩy trôi mất trong vài giây ở tốc độ cao.
- Tên đời chỉ hiện **trong bảng công nghệ** (`BangMeta.ts`); dòng số đầu màn (`ThanhTheGioi.ts`)
  không có.
- Đời 1–2 cùng mẻ `trung_co_2`, đời 3–4 cùng `can_dai` → 1→2 và 3→4 nhà **không đổi gì**.

## Làm gì (mỗi khối: test trước, code, `npm run do`, commit)

1. **Tên đời trên dòng số đầu màn** — thêm `🏛 <tên đời>` vào dòng 💰 ⚠ ⚔, ở cả màn thành phố
   và bản đồ tỉnh. Số lấy từ `Meta`, không tự tính.
2. **Thẻ lên đời giữa màn** — khi `Meta` báo tin `thoi_dai`: hiện thẻ to "Bước sang thời đại X"
   + thứ vừa mở (ô chính phủ, mẻ nhà mới), tự tắt sau vài giây hoặc chạm tắt. Số giây trong
   `data/balance.json`. Dòng nhật ký vẫn giữ.
3. **Bảng so mẻ cổ đại** — nướng một bảng: **Kenney Fantasy Town Kit** (CC0, đã có trong
   `tai:asset`) + Retro Fantasy Kit nếu tải được, cạnh **Icosa CC-BY** (dò `kho-game`). Gửi ảnh,
   **hỏi anh chọn bên nào** — anh đã chốt 27/09 là phải hỏi.
4. **Mẻ `co_dai`** (đời 1) theo bên anh chọn — `tools/me/co_dai.json` chép khung `trung_co_2`,
   cùng số trang, `o_px`, `heSo`. Đời 1 dùng `co_dai` trong `balance.json`; `?me=co_dai` xem được.
   Chọn Icosa CC-BY thì thêm màn ghi công trong game + dòng `ASSET_CREDITS.md` (file khoá → hỏi).

## Ngoài phạm vi

Đời 3 và 4 vẫn chung `can_dai` (báo anh; tách mẻ là phase riêng) · lính riêng theo đời ·
cân lại `sim:van` 6 nước (nợ mục 4, không đụng số thắng).

## Đo bằng gì

`npm run do` xanh · test: dòng đầu màn có tên đời; `Meta` lên đời → thẻ hiện; mẻ `co_dai` khớp
trang/`o_px`/`heSo` · `check:tran` · ảnh `npm run chup:man` thẻ lên đời + `?me=co_dai` ·
**anh xem trên iPhone qua bản duyệt**, báo fps và "đã thấy rõ lên đời chưa".

## Lùi bằng gì

Mỗi khối một commit. Đời 1 về `trung_co_2`; gỡ thẻ lên đời là về nhật ký như cũ.

## Rủi ro

- Fantasy Town là kiểu trung cổ châu Âu — có thể **không khác đủ** `trung_co_2`; lúc đó bảng so
  cho anh thấy rõ, không tự quyết.
- Thẻ lên đời chồng lên thẻ quyết định / thẻ bất ổn — xếp hàng, không hiện hai thẻ cùng lúc.
- `BangMeta.ts` 274/300 dòng — thẻ mới để file riêng.
