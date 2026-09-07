# PHASE 4 — Walker vác hàng (07/09/2026)

Hàng **không còn chuyển tức thì**. Mỗi nhà có kho riêng, và cách duy nhất để hàng đi từ nhà
này sang nhà kia là **một người đi bộ trên đường**. Nhà xa đường thì hàng tới chậm — đây là
lần đầu bố trí nhà cửa ảnh hưởng tới kinh tế.

Số đo: `npm run do` **6/6 thước, 88 test** · `npm run sim:thu` **ĐẠT**, 10 giờ game trong
4,2 giây · **64.184 chuyến một giờ, đông nhất 324 người cùng lúc, 0 lượt bỏ cuộc** ·
ảnh chụp **3.217 sprite ở 0,35×**, 1 lệnh vẽ.

## Bốn lần kẹt cứng trước khi chạy được

Cả bốn đều là **bế tắc im lặng**: không lỗi, không sập, chỉ là thành phố đứng hình và bảng
số toàn số 0. Ghi lại vì kiểu lỗi này sẽ còn quay lại ở Phase 5.

1. **400 người đi lấy hàng từ cái kho rỗng** chiếm hết chỗ, không còn chỗ cho người **chở
   hàng tới** kho, nên kho mãi mãi rỗng. Sửa: không phát người đi lấy khi kho không có món đó.
2. **Người giao và người lấy chung một trần.** Bên giao chiếm hết 600 chỗ, bên lấy không bao
   giờ được đi — kho đầy ự mà nhà vẫn đói. Sửa: `tranLay` và `tranGiao` đếm **riêng**.
3. **`buocToiDa: 400` đếm cả chuyến đi lẫn chuyến về**, mà bản đồ 96×96 cần tới 384 bước.
   Cả đội bỏ cuộc ngay trước khi tới nơi: 17.941 lượt bỏ cuộc một giờ.
4. **`buocKeTiep` đi sai trục.** Đích nằm trên cột đường thì phải vào đúng cột đó **trước**
   rồi mới đi dọc. Đi trục kia trước thì tới ô `(a, 48)` với `a` không chia hết cho
   `duongCach` là hết đổi được `b`, người cứ đi qua đi lại giữa đó với ngã tư.

## Đường đi: không tìm đường đầy đủ

Đường là lưới đều, nên mỗi bước chỉ là vài phép so sánh trong `buocKeTiep` —
không BFS, không A\*, không hàng đợi. Rẻ như vậy mới gánh nổi 324 người cùng lúc.
Đúng `GAME_SPEC.md` mục 4: cách của Caesar III, không phải cách của Widelands.

## Trần sprite 3.500 → 5.000

Chủ dự án chọn nâng trần thay vì ẩn walker khi thu nhỏ, **sau khi đã được nêu rõ**: nâng
trần lúc chưa ai đo fps trên iPhone là đúng cách Tây Vực chết. Đường lùi đã dựng sẵn —
`ZOOM_HIEN_WALKER` trong `src/render/CityScene.ts`, đổi 0 thành 0,6 là walker biến mất khi
thu nhỏ. Một dòng.

## Chưa làm

**Chưa có sprite người** — walker đang mượn tạm `thung_ruou`. Phân biệt được vì đồ trang trí
không bao giờ đặt lên đường, nhưng nhìn vẫn sai. Nướng người 8 hướng là Phase 10.
**Chưa ai đo fps trên iPhone** với walker — chờ xác nhận.
`src/render/BanDoDemo.ts` đã chuyển thành `src/sim/city/BanDo.ts`; render giờ đọc bản đồ và
danh sách walker thẳng từ `src/sim/`, đúng chiều cho phép.

## Hai lỗi nữa, lộ ra khi chủ dự án mở iPhone (07/09)

Anh báo **"mượt nhưng không thấy cái gì di chuyển cả"**. Hai nguyên nhân chồng lên nhau:

**1. Mô phỏng đứng im trong trình duyệt, mãi mãi.** `Math.round(giay * NHIP_MOI_GIAY)` — ở
60 fps mỗi khung là 0,0167 giây, nhân 10 ra 0,167, làm tròn thành **0**. Không nhịp nào
chạy. `DongHo` đã viết sẵn để giữ phần lẻ đúng cho việc này mà lại không dùng tới. Sửa:
`thanhPho.chay(nhipKe.tien(giay))`. Bài học: **có sẵn thì dùng**, đừng tự làm tròn lại.

**2. Mở ván ra kho nhà nào cũng đầy** nên gần như không ai phải đi. 324 người là trạng thái
sau vài giờ game; ở tốc độ 1× phải chờ hàng **giờ thật** mới thấy. Sửa: `ThanhPho.moDau()`
chạy sẵn **36.000 nhịp (một giờ game)** trước khung hình đầu tiên, tốn khoảng một phần tư
giây lúc mở. Sau đó màn hình có ngay 160–180 người.

Cả hai đều không làm test nào đỏ: `sim:thu` gọi `chay()` thẳng nên không đi qua chỗ hỏng.
**Lỗi chỉ có trên màn hình thật.** Đây đúng là loại lỗi mà `TECH_SPEC` mục 1 luật 2 nói tới.

`City.ts` chạm trần 300 dòng nên tách phần đọc kết quả sang `src/sim/city/Cham.ts`.
