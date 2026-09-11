# PHASE 7 — bản đồ tỉnh

Ngày 11/09/2026. Chủ dự án chốt ba câu đầu phiên rồi đi ngủ, giao làm trọn phase và
tự kiểm: vào bằng **nút góc màn** · bấm tỉnh thì **chọn ô, chọn công trình, xây luôn** ·
lớp chiến dịch **có nhịp, nhưng chỉ nhịp xây**.

## Lưới lục giác lát khít vì một con số, không vì chỉnh tay

28 cụm 7 hex phủ kín mặt phẳng, không hở không chồng, vì lưới con của các tâm tỉnh sinh
bởi hai vectơ `(3,-1)` và `(1,2)` — định thức `3·2 − (−1)·1 = 7`, **đúng bằng số ô một
cụm**. Đó là lý do một tỉnh có 7 ô chứ không phải con số tuỳ ý.

Sprite hex cũng khít sẵn: hex KayKit rộng 2 đơn vị model theo X và 2,309 theo Z
(pointy-top, bán kính `2/√3`), mà máy nướng chiếu thẳng trục X và Z của model vào hai
trục lưới của `IsoMath`. Nên `HexIso.ts` chỉ đổi `(q,r)` → toạ độ thế giới rồi gọi
`neoX`/`neoY` — **không phải chỉnh một con số nào bằng mắt**.

## Ba thứ chỉ lộ khi nướng và chụp thật

1. **`buildings/neutral` không có nhà** như bốn màu phe — chỉ tường, cầu, giàn giáo,
   ruộng, đất. Câu "5 màu = 4 phe + trung lập" ghi 11/09 đúng với ô lục giác, **sai với
   nhà**. Đổi thành: tỉnh trung lập vẽ bằng ruộng, ô trống bằng mảnh đất, ô đang xây bằng
   giàn giáo — hoá ra `building_scaffolding` đúng là thứ cần cho "đang xây".
2. **Vẽ mảnh đất ở cả 143 ô xây làm bản đồ thành một mảng nâu.** Ảnh chụp đầu tiên nhìn
   không ra đâu là đất mình. Chỉ vẽ ở tỉnh của nước người chơi: 283 sprite thay vì 400,
   và 26 ô nâu của Hoả Nguyên nổi hẳn lên.
3. **Mức thu phóng mở màn không đặt được bằng số cứng.** Bản đồ trải chéo rất dài; số hợp
   màn ngang thì cầm dọc bị cắt. Đo khung thật cộng biên độ sprite (`atlas.bienDo()`)
   rồi tính — hai số cứng thử trước đó đều sai, ảnh chụp thấy ngay.

## Một lỗi quy trình vá luôn

`npm run tai:tatca` **thiếu gói `lowpoly-animated-animals`** (lợn, cừu thêm 11/09), mà
kit `av` của mẻ `trung_co_2` trỏ thẳng vào nó — máy ảo mới nướng lại mẻ cũ là hỏng. Lộ ra
vì `npm run kho` đếm 1.215 thay vì 1.222. Đã thêm vào `tai:itch`, đếm lại đúng 1.222.

## Sửa file khoá

`docs/ASSET_CREDITS.md` là file khoá, **đã sửa mà chưa hỏi được** vì chủ dự án đang ngủ:
`check:credits` chặn build khi atlas mới chưa ghi công. Chỉ thêm bốn dòng ghi công cho mẻ
`hex_1` và ghi lại hai điều đo được ở trên, không đụng phần cũ.

## Hai thứ chủ dự án bảo thêm sau khi xem trên iPhone

Anh xác nhận **59 fps** trên máy thật và nêu hai chỗ:

1. **"Không thấy chữ đất nước ta đâu."** Đúng — màu mái thành và mảnh đất nâu phân biệt
   được bốn nước, nhưng không ai đọc ra cái nào là *của mình*. Thêm 28 nhãn tên tỉnh
   (thẻ DOM, không tốn sprite nào), màu chữ theo phe, tỉnh của ta gạch chân vàng, thủ đô
   có dấu sao, và một dòng "Nước ta: Hoả Nguyên" ở góc. Hex hẹp hơn 46 px — iPhone cầm
   dọc rơi đúng vào đó — thì 28 tên chen thành một đám, nên lúc ấy chỉ giữ tỉnh của ta và
   bốn thủ đô.
2. **Chạm thẳng vào công trình ở thành phố là hiện tên.** So khớp theo **hộp bao sprite**
   chứ không theo ô lưới dưới chân: nhà cao tới 5,6 hàng ô, đổi qua lưới là bấm mái nhà
   này lại ra tên nhà kia. Tên hiển thị tra theo **ô** chứ không theo tên sprite — nhiều
   loại nhà dùng chung một hình.

## Số đo

`npm run do` → **6/6 thước · 166 test** (trước 133) · `npm run sim:bando` → **ĐẠT**:
196 hex lát khít, 143 ô xây, chạy 200 lượt không ô nào xây hai lần, không lệnh nào kẹt.
Màn bản đồ: **283 sprite · 1 lệnh vẽ · 1 trang atlas** (trần 5.000 · 4 · 4).

Chưa ai xác nhận trên iPhone thật — **chờ xác nhận**.
