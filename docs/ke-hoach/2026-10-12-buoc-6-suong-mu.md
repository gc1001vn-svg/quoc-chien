# Bước 6 — Sương mù bản đồ tỉnh · 12/10/2026 · ANH DUYỆT 12/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 6 ("mở đất / sương mù").
Xong là khi: ảnh có/không sương gửi anh; anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 12/10)
- Thành phố kín nhà khắp bản đồ từ đầu ván (mỏ, trại gỗ sát mép) → không có đất để "mở".
- Bản đồ tỉnh 36 tỉnh, nước ta 5; có sẵn bảng tỉnh giáp nhau (`tinhKe`). Thấy tỉnh mình + giáp: 9/36 lúc đầu.

## Anh chọn 12/10
- **Câu 1 — bản đồ tỉnh:** chỉ thấy tỉnh mình + tỉnh giáp; chiếm thêm thì sương quanh nó tan.
- **Câu 2 — đất nhạt, giấu hết:** dưới sương còn mặt đất, giấu nhà, thành, cây, cờ, tên tỉnh.
- **Câu 3 — tan dần ~2 s.**

## Làm
1. `data/tung_buoc.json` mục `suong`: hình nền dưới sương, độ sáng, giây tan.
2. `VeBanDo.ts`: tính tỉnh nhìn thấy mỗi khung; dưới sương chỉ vẽ nền; tỉnh vừa vào tầm nhìn thì nền đổi dần, vật mọc từ
   chân (cắt sprite có sẵn). `MapScene.ts` giấu tên tỉnh dưới sương. Sim không đổi. `?tat=suong` tắt.

## Đo
- `npm run do`; test tỉnh nhìn thấy + độ tan. Ảnh có/không sương.

## Rủi ro
- Bấm vào ô dưới sương vẫn mở bảng tỉnh (lộ tên) — chỉ là hình, chưa chặn bấm.
- Lùi: `git revert`; tắt tạm `?tat=suong`.
