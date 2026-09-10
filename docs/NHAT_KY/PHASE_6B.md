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

## Vá thêm 10/09 — tốc độ 30×

Chủ dự án chơi thật: **59 fps**, nhưng "chờ mãi không thấy hỏi". Một giờ game dài 36.000
nhịp, tức đúng **một giờ thật** ở 1×, mà giãn cách hai thẻ là hai giờ. Ở 8× vẫn 15 phút.

Đã thử hướng **rút ngắn giờ game** (36.000 → 1.200 nhịp) và **bỏ**: mọi ngưỡng đếm "mỗi
giờ" của thống đốc và của thẻ (`nguongCho` 20 lượt, `day` 20.000) nhỏ theo 30 lần nên
không bao giờ chạm nữa — đo được thống đốc **ngừng xây hẳn** (94 → 94 nhà) và thẻ đầu
lùi từ giờ 1 tới giờ 23.

Làm thay: **thêm mức 30×** vào dải tốc độ, và mở ván ở **8×** thay vì 1×. Mọi thứ nhanh
đều nên cân bằng không đổi một chút nào — `sim:thu` vẫn ra đúng 89.232 chuyến, 94 → 102
nhà, 5 thẻ. `GAME_SPEC` mục 3 và `TECH_SPEC` sửa theo (hai file khoá, chủ dự án đã chốt).

## Vá thêm 10/09 — cối xay có cánh, bảng sự kiện gọn lại

Chủ dự án chơi tiếp: **59 fps · 3.253 sprite · 1 lệnh vẽ**, nhưng "tìm không thấy cối xay
gió" và "chữ góc trái dưới to quá che hết màn hình".

- **Cánh quạt**: thêm phép quay `rz` cho từng mảnh trong `ghep()` — quay quanh trục dựng
  màn hình, áp trước `ry`. Nợ kỹ thuật ghi chỗ này là đường cùng vì `ry` không dựng nổi
  cánh đứng; hoá ra chỉ cần thêm một phép xoay. Ba lần thử bỏ đi: cánh đặt thấp thì mái
  che hết, `Roof_FrontSupports` là nhiều mảnh rời nên quay ra mấy mẩu gỗ bay lơ lửng,
  cánh ngắn thì chìm trong lòng mái nón.
- **Bảng sự kiện**: ba dòng thay vì bốn, 42 % bề ngang thay vì 62 %, mỗi sự kiện một dòng
  cắt bằng `...`. Thêm `text-size-adjust: 100%` — Safari trên iPhone tự phóng chữ. Nút
  "Đo trần sprite" đẩy lên trên hàng tốc độ, trước đó hai cái chồng lên nhau.

## Vá thêm 10/09 (lần hai) — dùng model thật của KayKit

Chủ dự án: cánh quạt tự ghép "xấu quá", và "mấy phase trước bạn có đưa hình cối xay rất
đẹp". Nhớ đúng: mẻ Kenney/KayKit cũ (`tools/me/trung_co.json`) có `coi_xay_gio`,
`coi_xay_lon`, `gieng_lang` — dựng từ **KayKit Medieval Builder Pack**, gói vẫn nằm trong
`ASSET_CREDITS` suốt, chỉ vì mẻ cũ bỏ đi nên không ai nghĩ tới nữa.

Sáu toà nhà giờ lấy thẳng model thật: `mill` + `mill_blades` (cối xay gió có cánh),
`well` (giếng có mái), `mine` (hầm mỏ trong vách đá), `farm_plot` + `farm_wheat` (ruộng
lúa có hàng rào), `lumbermill` (xưởng cưa có đống gỗ), `market` (quầy chợ có xe).

Đánh đổi chủ dự án đã chốt sau khi xem ảnh: KayKit màu bệt, Quaternius có hoạ tiết — hai
phong cách không khớp tuyệt đối.

**Chủ dự án phê bình, đúng:** anh đã dặn từ đầu — tự tìm nguồn mở, tải về, tách kho lưu
trữ với kho vào game, và **dò kho trước rồi mới làm**. `TECH_SPEC` mục 3 thậm chí đã có
bảng gói tự tay ghi từ 06/09, dòng "KayKit Medieval Builder: … xưởng gỗ, mỏ, cối xay".
Không đọc, ngồi ghép tay năm lượt nướng.

Vá bằng cơ chế chứ không bằng lời hứa:

- `scripts/kho_asset.mjs` + `npm run kho` sinh **`docs/KHO_ASSET.md`**: tên thật của cả
  **1.855 model** trong `assets_source/`, grep một lệnh là ra. Bảng cũ trong `TECH_SPEC`
  ghi chung chung ("công trình nguyên khối 2×2") nên không grep được — đó là lỗ hổng.
- `CLAUDE.md` mục Quy ước thêm một dòng: **dò `KHO_ASSET.md` trước, cấm ghép tay khi kho
  có model sẵn**. CLAUDE.md đọc đầu mọi phiên nên không bỏ sót được như `TECH_SPEC` mục 3.
- Dò lại ngay bằng danh mục mới: `trai_linh` đổi từ `thap_canh` sang model `barracks` thật.
  Sáu sprite còn tự ghép (vườn nho, trại thú, lò nhỏ, lò lớn, nhà chài, công trường) đã
  grep — kho **không có** model tương ứng, nên ghép tay là đúng.

## Còn nợ

**Người vác hàng đi tay không** — chủ dự án nhận ra 09/09. Kit có thùng, bao, sọt gắn được
vào tay. Chốt để **Phase 10**, nướng một lần cùng bộ 8 hướng × 4 dáng.
