# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 11/09/2026 (Phase 8A — lớp meta, **đã xác nhận trên iPhone, 59 fps**).

## 1. Đang ở đâu

**Phase 8A xong và đã xác nhận trên iPhone (59 fps, bản 11/09 12:35).** Phase 8 tách làm
hai, anh chốt 11/09: 8A là phần ruột, 8B là nướng mẻ sprite hiện đại (phiên sau).

Ảnh anh gửi cho thấy cả ba thứ đều chạy: bảng công nghệ (2/24, đang học Nông nghiệp
19/30 điểm) · thẻ **Tích trữ** lắp được vào ô chính phủ, đếm ngược "Đổi thẻ sau 5 giờ
nữa" · hệ số nghiên cứu tụt xuống **95 %** đúng bằng mặt hại của thẻ.

Màn thành phố có thêm nút **🔬** ở góc trái dưới, cạnh nút ☰ và ⌂. Bấm vào hiện bảng
**Nghiên cứu**, hai thẻ chữ:

- **Công nghệ** — thời đại đang ở, thanh tiến độ, danh sách công nghệ học được (bấm là
  chọn học), và câu Eureka của từng cái ("Làm ra 680 thép trong một giờ").
- **Chính sách** — số ô chính phủ, thẻ đã mở. Chạm một thẻ là lắp vào ô trống, chạm lại là
  tháo ra. Mỗi thẻ ghi rõ **mặt lợi và mặt hại**.

Lên thời đại là **tự động** khi đủ công nghệ và đủ công trình — không có nút bấm, vì lên
đời không có mặt trái nào để cân nhắc. Nhật ký sự kiện ghi lại bằng chữ xanh lá.

Thành phố **chưa đổi mặt** khi lên đời: chưa có mẻ sprite hiện đại, cả sáu đời cùng dùng
`trung_co_2`. Đó là Phase 8B.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| `npm run do` | 6/6 · 166 test | **6/6 · 194 test** |
| `npm run sim:congnghe` (mới) | — | **ĐẠT** · 120 giờ game |
| Lên Trung cổ · lên Súng ống | — | giờ **21** · giờ **65** |
| Công nghệ học xong trong 120 giờ | — | **21/24** |
| Điểm nghiên cứu mỗi giờ (241 nhà) | — | **11** ở hệ số 100 % |
| Model trong kho — số **dùng được** | 1.222 | 1.222 (dòng cuối `KHO_ASSET.md`) |

Kho asset **không tải phiên này** — 8A không nướng sprite.

## 3. Việc của chủ dự án

**Phase 8A không còn gì phải kiểm.** Anh đã xem trên iPhone 11/09 và xác nhận: 59 fps,
bảng nghiên cứu đọc được, thẻ chính sách lắp/tháo ăn.

Phiên bản anh đã xác nhận: **11/09 12:35**.

**Hai việc anh quyết giúp:**

1. **Nhãn fps bị hàng nút đè lên.** Ảnh anh gửi hiện `1414 sprite` — bốn chữ số làm nhãn
   dài ra, chữ `0.44×` chui xuống dưới nút "Nền". Máy ảo chỉ có `503 sprite` nên không
   lộ ra. Ba cách sửa, mỗi cách một mặt trái — xem `NO_KY_THUAT.md` mục "Lớp meta".
2. **`docs/ASSET_CREDITS.md` (file khoá) đã sửa mà chưa hỏi được.** Phiên trước sửa lúc
   anh đang ngủ — thêm bốn dòng ghi công mẻ `hex_1`, không đụng phần cũ, vì
   `check:credits` chặn build. Anh xem có giữ không.

## 4. Nợ đang chặn phase kế tiếp

- **Phase 8B chưa làm: chưa có mẻ sprite hiện đại.** Khớp nối dựng sẵn, việc khó là dữ
  liệu: gói `city-builder-bits` chỉ có **8 dáng nhà** cho **32 loại nhà** của game.
- **Thưởng công nghệ chưa đổi được thành phố.** Đo ra: trần nhà 398 mà thành phố chỉ tới
  241 — trần không phải cái chặn, nhu cầu mới là. Hạ ngưỡng chờ 40→28 cũng vẫn 241.
- **Thẻ chính sách chưa đụng được kinh tế** — cố ý, để hiệu ứng tháo ra được đúng bằng cái
  đã lắp vào. Thẻ "+15 % lương thực" của GAME_SPEC mục 7 phải chờ Phase 9.
- **Lớp chiến dịch chưa nối vào kinh tế thành phố** — việc Phase 9.
- **Chưa có AI nước khác.** Ba nước đối thủ đứng yên.
- **`trai_ga` vẫn không có model gà.** Dò hết 11 gói, không gói nào có — `NGUON_MO.md` mục 8.
- **Người vác hàng đi tay không** — để Phase 10.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 8B: nướng mẻ hiện đại (PHIÊN MỚI)

Nướng mẻ sprite thời hiện đại từ `city-builder-bits` (KayKit, CC0 — đã nằm sẵn trong kho
từ 10/09, không phải tải thêm), rồi nối vào `ThoiDai.me` để lên đời là thành phố đổi mặt.

**Việc phải quyết trước khi nướng:** gói chỉ có **8 dáng nhà** (`building_A`…`building_H`)
cộng đường, xe, cột đèn — mà game có **32 loại nhà**. Hai đường: ghép 32 về 8 dáng phân
biệt bằng màu và vật trang trí (mọi nhà đổi mặt, nhưng nhà khác chức năng trông giống
nhau), hay chỉ đổi mặt nhóm `do_thi` (không nhà nào sai chức năng, nhưng thành phố lẫn lộn
hai thời). **Nướng xong gửi ảnh cho anh chọn.**

**Rủi ro phải đo trước khi hứa:** mẻ hiện đại là **bộ atlas thứ ba**. Hai màn hiện giữ 2
trang cùng lúc, trần là 4 — còn đúng 2 trang để tiêu. Đo số trang trước khi nướng cả mẻ.
TECH_SPEC mục 2 đã chốt cách lùi: đổi đời thì `gl.deleteTexture` nhả atlas cũ.

**Phiên có nướng sprite** nên phải chạy `npm run tai:tatca` (~1 GB, 5–10 phút).

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G, không bỏ bước nào.
