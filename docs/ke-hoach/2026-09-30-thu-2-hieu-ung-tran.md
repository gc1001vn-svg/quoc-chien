# Thử 2 — hiệu ứng trận (30/09/2026)

Nguồn: `kho-game/docs/KY_NANG_TRANG_THAI.md` mục 4, 5, 8 · `kho-game/docs/DO_HOA.md` mục 3–4.
Anh đồng ý 3 đợt 30/09; Thử 1 anh đo 59 fps. Chỉ màn trận `?tran=1` (cổ) · `?tran=2` (súng).

## 1. Làm gì — mỗi cảnh `BattleScript` một tín hiệu

| Cảnh | Tín hiệu (báo trước → trúng → tan) | Đọc từ đâu (chỉ đọc) | Cờ tắt |
|---|---|---|---|
| `tien` | bụi nâu nhạt dưới chân lính đang đi, thưa, tan ~1 s | `linhLuc()` dáng `di` | `?tat=bui` |
| `ban` | cổ: bụi nhỏ chỗ tên cắm · súng: phụt khói xám ở nòng khi đạn rời, tan ~1,5 s | `muiTenLuc()` (tên đã có) | `?tat=khoi` |
| `giap_la_ca` | chớp trắng-vàng + 3–5 tia văng ở lính dáng `trung`, ≤ 0,2 s | `linhLuc()` dáng `trung` | `?tat=chop` |
| `vo` | cờ trắng phấp phới trên tâm đội vỡ + phủ nhạt màu lính đội đó · **khựng khung** | sự kiện `vo` + `linhLuc()` | `?tat=co,nhat,khung` |
| `ket_thuc` | cờ màu bên thắng dựng lên (nảy nhẹ) ở tâm quân thắng · khựng dài hơn | `kq.thang` + `linhLuc()` | `?tat=co,khung` |

`?tat=het` = bản gốc (cùng bộ đọc cờ `docCoTat` của Thử 1). Nút "Hiệu ứng" của thanh đo tắt cả lớp.

**Khựng khung (Sakurai):** đồng hồ PHÁT dừng khi vừa đi qua mốc `vo` (~90 ms) và `ket_thuc`
(~180 ms); **trần 200 ms** mỗi lần; nhiều mốc lọt trong một khung (tốc ×cao) chỉ khựng một lần;
"Bỏ qua" / "Xem lại" / `?giay=` không khựng. Chỉ đồng hồ xem đứng — kết quả trận không đổi.

## 2. Gắn vào bộ vẽ — dùng lại Thử 1, không viết lại

- `src/render/HieuUngTran.ts` (mới): sinh / trôi hạt từ `LinhVe` + `MuiTen` + kịch bản, đổ vào
  **`Hat`** (lô hạt Thử 1). Phần thuần (hạt nào sinh ở giây nào, khựng bao lâu) tách hàm để test Node.
- `Hat.ts`: thêm **một kiểu hình `co`** (cán + lá cờ phấp phới, sinh bằng số, màu theo đỉnh) —
  kiểu cũ giữ nguyên. Tia = hạt `tron` kéo dài theo hướng bay (thêm tham số, không kiểu mới).
- `DienTranCoBan.ts` (lớp diễn, không phải `sim/`): `LinhVe` thêm 2 trường chỉ-đọc `doi`, `dang` — nay dáng chỉ nằm trong tên sprite.
- `BattleScene.ts`: gọi hiệu ứng sau `gl.ketThucKhung()` + bọc `dt` qua hàm khựng; +~10 dòng (215 → ≤ 230, trần 299).
- **Lệnh vẽ: cảnh 1 + hạt 1 = 2 ≤ 4.** Không hậu kỳ ở trận (Thử 1 chưa đo nó ở màn này — để sau nếu anh muốn).
- **0 trang atlas thêm**, 0 ảnh, 0 thư viện.
- Số chỉnh (màu, nhịp bụi, tuổi hạt, số tia, ms khựng, trần khựng): `data/hieu_ung.json` mục `tran` (luật cứng 2).

## 3. Cờ — tự vẽ bằng số, CẦN ANH DUYỆT

Đã dò `npm run do:asset cờ`: có `Banner_1/2` (CC0, model 3D) → phải nướng vào atlas lính, mà gói
lính ở kho `tayvuc` và trang atlas đã tính sát → **không đáng cho đợt thử**. Đề xuất: cờ sinh
bằng shader như khói, chim Thử 1; khai `docs/TU_LAM.md` (không phải file khoá). **Không dùng
game-icons đợt này → không đụng `docs/ASSET_CREDITS.md`** (file khoá).

## 4. Đo — xong khi

- Mốc `sim:tran`, `sim:van` chạy TRƯỚC khi sửa (đã chạy đầu phiên), sau sửa so file: y hệt.
- Test mới (`tests/HieuUngTran.test.ts`): khựng đúng lúc qua `vo`, không quá trần, không khựng khi
  nhảy giờ; mỗi loại cảnh sinh đúng loại hạt; `?tat=` tắt đúng từng thứ; `DienTran` không bị gọi ghi.
- `npm run do` xanh (kể cả `check:tran`, dòng ≤ 299).
- Chụp máy ảo (DPR 1, `CHO_MS`): 5 cảnh × 2 trận qua `?giay=` + một ảnh `?tat=het` — gửi anh một bảng.
- Đẩy `main`, in số phiên bản; **anh đo fps iPhone** `?tran=1`, `?tran=2`, và `?tran=2&tat=het`.

## 5. Lùi

Tụt fps: giảm `toiDa` hạt + tắt bụi trước (nhiều hạt nhất) → tắt tia. Mọi thứ có cờ, không đụng
atlas, không đụng mô phỏng → gỡ sạch được.

## 6. Không làm đợt này

Rung màn, số bay, hậu kỳ ở trận · kỹ năng mục 5 (xung phong, pháo, phục kích…) — mô phỏng chưa có ·
art bible bước 2–3 · Thử 3.
