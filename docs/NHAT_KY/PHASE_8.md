# PHASE 8A — Cây công nghệ, Eureka, thời đại, thẻ chính sách (11/09/2026)

Phase 8 tách làm hai. **8A (phiên này):** phần ruột — `sim/meta/`, dữ liệu, bảng bấm được.
**8B (phiên sau):** nướng mẻ sprite hiện đại. Chủ dự án chốt tách sau khi em dò kho: gói
`city-builder-bits` chỉ có **8 dáng nhà** (`building_A`…`H`) mà game đang có **32 loại nhà** —
ghép 32 về 8 là quyết định phải nhìn ảnh thật mới chốt được, không nên chốt mù cùng phiên
với việc viết luật chơi.

## Làm được gì

`sim/meta/` năm file thuần TS: `CongNghe.ts` (24 công nghệ, tối đa 2 tiền đề, học Freeciv) ·
`Eureka.ts` · `ThoiDai.ts` (sáu đời) · `TheChinhSach.ts` (20 thẻ, N ô chính phủ) · `Meta.ts`
gom lại, là **cửa duy nhất** `Van.ts` gọi tới. Bảng 🔬 trên màn thành phố, hai thẻ chữ
Công nghệ / Chính sách. Thước đo mới `npm run sim:congnghe`.

Tách `DieuKien.ts` khỏi `Engine.ts` để Eureka dùng **đúng** bộ luật chấm điều kiện của thẻ
quyết định — không có bản sao thứ hai để trôi khác đi. Phần thưởng công nghệ đi qua **đúng**
`apHauQua` của thẻ quyết định, cùng lý do.

## Ba thứ chỉ lộ ra khi đo thật, không đoán ra được

1. **Ngưỡng Eureka đặt theo `ton` (tồn kho) là vô nghĩa.** Chụp màn thấy cả 19 mốc sáng
   "đã đạt" ngay giờ 0. Đo 120 giờ mới rõ vì sao: thành phố demo mở màn đã có **188 công
   trình** nên gần như mặt hàng nào cũng **chạm trần kho từ giờ đầu** (lúa mì 1600/1600,
   gỗ thô 400/400). `ton` không phải tín hiệu — nó là trần kho.
2. **`lamRa` cũng gần đỉnh ngay giờ 1**, cùng lý do. Chỉ chín mặt hàng thực sự tăng khi
   thống đốc xây thêm: muối 1422→2128 · thép 537→802 · cá muối 1256→1774 · gốm 994→1292 ·
   bột 4220→4670 · vải · áo da · bánh mì · rượu. Mốc Eureka giờ chỉ đặt vào chín cái đó,
   cộng `soNha` (188→241) và `soKho`. Có test chặn việc quay lại đặt theo `ton`.
3. **Nới trần gần như vô tác dụng.** Thưởng công nghệ ban đầu chỉ nới trần nhà; đo ra trần
   398 mà thành phố chỉ tới 241 — trần không phải cái chặn, **nhu cầu** mới là. Đã đổi một
   phần sang `doiNguong` (ngưỡng chờ 40→28), nhưng đo lại thì số nhà **vẫn 241**: thưởng
   công nghệ hiện chưa đổi được thành phố. Ghi vào `NO_KY_THUAT.md`.

## Số đo

`npm run do` **6/6 · 194 test** (trước: 166). `npm run sim:congnghe` **ĐẠT**: 120 giờ game,
lên Trung cổ giờ 21, Súng ống giờ 65, xong 21/24 công nghệ, Eureka rải từ giờ 1 tới giờ 75.

Chưa có mẻ hiện đại nên cả sáu đời cùng trỏ `trung_co_2` trong `balance.json` — khớp nối
dựng sẵn, Phase 8B chỉ sửa một cột.
