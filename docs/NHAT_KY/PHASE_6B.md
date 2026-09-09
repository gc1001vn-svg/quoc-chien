# PHASE 6B — Nhà kinh tế mọc lên thật (09/09/2026)

Chen trước Phase 7, chủ dự án chốt. Phase 6 dựng thẻ quyết định nhưng bấm "xây hai cối
xay" thì chỉ bảng số đổi, trên màn không có gì mọc lên — nợ đó làm hỏng đúng cái vòng
phản hồi vừa dựng.

## Đã làm

- **12 sprite mới** trong `tools/me/trung_co_2.json`, phủ cả 32 loại nhà: giếng · cối xay ·
  ruộng · vườn nho · nhà chài · trại thú · lò nhỏ · lò lớn · mỏ · xưởng · trại gỗ · công
  trường. Nhà dân dùng `nha_nho_do`, trại lính dùng `thap_canh` — hai cái đã có sẵn.
  Tất cả **rộng một ô**: `datMotNha` chỉ cấp một ô, sprite hai ô sẽ tràn sang nhà bên.
- Mái đổi màu bằng **`thay_mau`**, không bằng phép nhân: `NO_KY_THUAT` đã ghi máy nướng
  không có phép cộng nên nhân xám vào ngói đỏ vẫn ra đỏ. Lò xám, nhà chài xanh, xưởng
  vàng nâu — ở mức thu nhỏ 0,35× vẫn phân biệt được nhau.
- **Nối sim với bản đồ**: mỗi `ThuNha` chèn một `OVat` qua `chenVat`, kể cả nhà thống đốc
  xây lúc đang chạy (`XayThem.dungNha`). Tên sprite khai trong `data/buildings.json`.
- **Gộp `daChiem` làm một.** Trước phiên này `sinhBanDo` và `City` mỗi bên giữ một tập
  riêng, nên 94 nhà kinh tế đang đặt đè lên cây và nhà trang trí mà không ai biết — chỉ
  vì chúng vô hình nên không nhìn ra. `veKho` cũng đánh dấu ô của nó.
- Bỏ `datNhaKinhTe` (không ai gọi từ Phase 5). `npm run nuong` trỏ sang mẻ `trung_co_2`
  đang dùng thật — trước đó nó trỏ vào mẻ Phase 1 và chạy là chết.

## Số đo

`npm run do` **6/6 đạt**, **128 test** (trước 124). `npm run sim:thu` **ĐẠT**, 10 giờ game:
**5 thẻ đã hỏi · 94 → 102 nhà · 4 kho · 89.232 chuyến một giờ · đông nhất 325 người ·
0 bỏ cuộc.** (Phase 6: 84.058 chuyến — bố trí nhà đổi vì hết cảnh đặt chồng.)

Ảnh máy ảo: **3.498 sprite · 1 lệnh vẽ** ở 0,35× (trần 5.000 và 4). Số fps trong máy ảo
không có nghĩa — máy ảo vẽ bằng phần mềm.

## Còn nợ

Giếng và cối xay vẫn là **hình gần đúng tự ghép**, không phải model thật: kit Quaternius
không có. Cối xay là cái tháp mái nón, **không có cánh quạt** — công thức nướng chỉ quay
được quanh trục đứng (`ry`), không dựng nổi cánh đứng.
