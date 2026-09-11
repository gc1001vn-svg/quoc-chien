# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 11/09/2026 (Phase 7 — bản đồ tỉnh).

## 1. Đang ở đâu

**Phase 7/13 xong, chờ anh xác nhận trên iPhone.** Game giờ có hai màn: lớp thành phố
(Phase 2–6) và **lớp chiến dịch** — bản đồ 28 tỉnh lục giác, bốn nước, bấm nút góc màn
để qua lại.

Bấm vào một mảnh đất nâu trong tỉnh của mình → hiện bảng chọn công trình (Làng · Chợ
phiên · Trại lính · Mỏ quặng) → bấm là xây, mất 3–6 lượt, mỗi lượt 3 giây thật. Bấm vào
tỉnh khác → xem tên tỉnh, nước, địa hình, số ô xây.

Ba thứ chỉ lộ khi nướng và chụp thật (chi tiết: `docs/NHAT_KY/PHASE_7.md`): thư mục
`neutral` của gói KayKit **không có nhà** như bốn màu phe · vẽ mảnh đất ở cả 143 ô xây
làm bản đồ thành một mảng nâu · mức thu phóng mở màn phải **đo từ khung thật**, số cứng
hợp màn ngang thì cầm dọc bị cắt.

Cũng vá một lỗi quy trình: `npm run tai:tatca` **thiếu gói `lowpoly-animated-animals`**
— máy ảo mới mà nướng lại mẻ `trung_co_2` là hỏng, vì kit `av` trỏ thẳng vào gói đó.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| `npm run do` | 6/6 · 133 test | **6/6 · 161 test** |
| Màn bản đồ — sprite mỗi khung | — | **283** (trần 5.000) |
| Màn bản đồ — lệnh vẽ | — | **1** (trần 4) |
| Trang atlas cùng lúc (hai màn cùng sống) | 1 | **2** (trần 4) |
| Mẻ `hex_1` — sprite · lấp trang 2× | — | 40 · **63,5 %** |
| Model trong kho — số **dùng được** | 1.222 | 1.222 (dòng cuối `KHO_ASSET.md`) |

`npm run sim:bando` → **ĐẠT**: 196 hex lát khít, 143 ô xây dựng, chạy 200 lượt không ô
nào xây hai lần, không lệnh nào kẹt.

## 3. Việc của chủ dự án

**Mở game trên iPhone và xem giúp bốn thứ**, nhắn lại "được" hay "hỏng chỗ nào":

https://gc1001vn-svg.github.io/quoc-chien/

1. Góc phải trên có nút **🗺 Bản đồ tỉnh** — bấm vào, có ra bản đồ lục giác không?
2. Trên bản đồ: thấy **hai toà thành bên trái, hai bên phải** (bốn nước, bốn màu mái) và
   vùng đất nâu ở góc trái trên (đất nước ta) không?
3. Chạm vào **một mảnh đất nâu** → có hiện bảng "Viêm Tân ★ · Hoả Nguyên · đồng bằng"
   kèm ba nút công trình không? Bấm **Làng**, đợi khoảng 10 giây, chạm lại ô đó — đã
   thành nhà chưa?
4. Bấm **⌂ Về thành phố** — có quay lại đúng chỗ cũ của thành phố không?

Và **một con số**: bản đồ tỉnh chạy được bao nhiêu fps (nhãn góc trái trên)?

## 4. Nợ đang chặn phase kế tiếp

- **Lớp chiến dịch chưa nối vào kinh tế thành phố.** Công trình tỉnh chưa đổ hàng vào kho
  thành phố — cố ý tách, để khỏi vỡ cân bằng đã cân ở Phase 3–6. Nối là việc Phase 9.
- **Chưa có AI nước khác.** Ba nước đối thủ đứng yên, không bành trướng, không ngoại giao.
- **`docs/ASSET_CREDITS.md` (file khoá) đã sửa mà chưa hỏi được** — anh đang ngủ, mà
  `check:credits` chặn build khi atlas mới chưa ghi công. Chỉ thêm bốn dòng ghi công mẻ
  `hex_1`, không đụng phần cũ. Anh xem lại giúp.
- **`trai_ga` vẫn không có model gà.** Dò hết 11 gói, không gói nào có — `NGUON_MO.md` mục 8.
- **Lò và xưởng vẫn dùng chung dáng** — chủ dự án chốt 11/09: giữ nguyên.
- **Người vác hàng đi tay không** — để Phase 10, nướng cùng bộ 8 hướng × 4 dáng.
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách, công nghệ, quân sự, ngoại giao
  thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 8: cây công nghệ và thời đại (PHIÊN MỚI)

`sim/meta/`: cây công nghệ, Eureka, lên thời đại, thẻ chính sách. Nướng mẻ **hiện đại**.
Xong thì thành phố tiến hoá trước mắt.

**Asset:** gói `city-builder-bits` (KayKit, CC0) đã nằm sẵn trong kho từ 10/09, để dành
đúng cho thời hiện đại — không phải tải thêm.

**Rủi ro phải đo trước khi hứa:** nướng mẻ hiện đại là **bộ atlas thứ ba**. Hai màn hiện
đã giữ 2 trang cùng lúc, trần là 4 — mẻ thứ ba chỉ còn đúng 2 trang để tiêu. Đo số trang
trước khi nướng cả mẻ, và tính xem có nên nhả atlas mẻ cũ khi lên thời đại không.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G, không bỏ bước nào.
