# Bước 5 — Bản đồ tỉnh xây theo lượt (12/10/2026, lần 49)

Kế hoạch anh duyệt 12/10: `docs/ke-hoach/2026-10-12-buoc-5-xay-tinh-theo-luot.md` (mẹ: `2026-10-04-moi-thu-tung-buoc.md` việc 5).
Anh chọn: mượt theo giây · loé sáng ~0,5 s · không bụi, không que gỗ.

- **Làm:** `src/render/VeBanDo.ts` — ô đang xây vẽ nhà màu phe cắt từ dưới lên theo `(luot − conLai + phần lượt) / luot`
  (dùng `catTren` của bước 1), giàn giáo `gian_giao` đè lên; ô vừa hết `dangXay` mà có `congTrinh` thì loé sáng giảm dần
  `loeGiay` 0,5 s (độ sáng `sangLoe` chung bước 1). `MapScene.ts` truyền `donLuot / giay_moi_luot`. Sim không đổi.
  `?tat=xayTinh` về kiểu cũ. Số mới: `data/tung_buoc.json` mục `xayTinh`.
- **Đo:** `npm run do` xanh · test +2 (`tests/XayTinh.test.ts`) · lệnh vẽ bản đồ vẫn 1.
  Ảnh 12 chặng trại lính (5 lượt, 15 s): `anh_chup/xt_bang.png` (không lên git). Chụp (script tạm, không lên git):
  `npm run build` + `vite preview`, dùng `tools/lib/cdp.mjs` mở `?man=ban-do&tinh=1`, bấm nút "5 lượt" (mỏ không xây được ở đồng bằng), cuộn để phóng to.
- **Nhìn thấy:** trại lính to hơn giàn giáo nên phần thấy mọc là mái nhô lên khỏi giàn giáo; đường cắt ngang thẳng như
  nhà thành phố bước 1. Loé rõ ở khung xong.
- **Chưa:** anh đo iPhone ≥ 58 fps.
- **Anh đo 12/10: 60 fps, nhưng hỏi "sao tự nhiên có cái hình kia trước"** — lỗi: nhà vẽ SAU giàn giáo, làng/chợ nhỏ hơn
  giàn giáo nên bị che kín tới lúc xong (chỉ trại lính to mới lộ mái). Đo giữa lúc xây làng (5 s): bản lỗi lộ 601 điểm
  ảnh nhà so với `?tat=xayTinh`, bản sửa (nhà đè trước giàn giáo) 4.421. Giàn giáo còn là dấu "ô đang chọn" (có từ
  Phase 7) nên hiện ngay khi chạm ô trống, trước khi chọn công trình. Bẫy: script chụp gửi mã vào trang thì biến Node
  (`process.env`) phải nội suy `${…}`, không thì nút không bấm mà hai ảnh vẫn "giống nhau" — trông như bắt được lỗi.
