# THAM_KHAO — tám game đã tra, học gì từ mỗi game

> Tra ngày 05/09/2026. Mục đích: **học kiến trúc và cơ chế**, giảm phần phải tự nghĩ.

---

## 1. Luật bản quyền — đọc trước, không được vi phạm

| Việc | Được / Không |
|---|---|
| Đọc mã nguồn game GPL/AGPL để **hiểu kiến trúc** | ✅ Được |
| **Copy-paste một dòng code** từ repo GPL/AGPL | ❌ Cấm tuyệt đối |
| Dùng đồ hoạ / âm thanh của họ | ❌ Cấm — phần lớn là **CC-BY-SA**, license này lây sang cả dự án |
| Dùng tên công nghệ lịch sử có thật (Luyện đồng, In ấn, Động cơ hơi nước) | ✅ Được — kiến thức chung |
| Sao chép tên đơn vị đặc chế, tên địa danh hư cấu, cốt truyện, bố cục bản đồ | ❌ Cấm |
| Chép **bảng số cân bằng** của họ | ❌ Cấm — tự viết số riêng |

Asset chỉ lấy từ nguồn **CC0 / CC-BY / MIT** (Kenney, Quaternius, KayKit), ghi vào
`docs/ASSET_CREDITS.md` **ngay lúc thêm**.

**Cảnh báo về license bên dưới:** những dòng license trong bảng là ghi theo trang giới
thiệu và README, **chưa mở từng file `LICENSE` để đối chiếu**. Trước khi ai đó thật sự
mở mã nguồn của một game nào trong đây, **kiểm lại file `LICENSE` của repo đó**. Hai chỗ
kém chắc nhất là Julius/Augustus và phiên bản GPL của OpenRA.

---

## 2. Bảng tổng — học gì từ đâu

| Game | License | Học được gì | Giảm việc chỗ nào |
|---|---|---|---|
| **Total War** (thương mại) | — | Chia lớp chiến dịch / trận đánh. Tỉnh có ô xây dựng. Auto-resolve có dự đoán. Trật tự công cộng | **Giảm việc nhiều nhất** — không phải mô phỏng mọi thành phố |
| **Civilization** (thương mại) | — | Thẻ chính sách · Eureka · điều kiện thắng · thống đốc thăng cấp · thời đại | Cho game một đích đến và một cơ chế quyết định gọn |
| **Widelands** (Settlers II) | GPLv2+, đồ hoạ nhiều license CC khác nhau | Kinh tế là mạng lưới: hàng chảy trên đường, người vác đi giao | Không phải tự nghĩ mô hình kinh tế — khuôn đã chạy 20 năm |
| **Caesar III → Julius / Augustus** | AGPL (**kiểm lại**) | **Hệ walker**: toà nhà phát ra người đi bộ, đi tới đâu phục vụ tới đó. Zeus dùng đúng hệ này | **Giảm tải máy thật sự** — rẻ hơn tìm đường đầy đủ rất nhiều |
| **Unknown Horizons** (Anno 1602) | GPLv2 | Dân có **bậc**: đủ nhu cầu thì lên bậc, mở nhà mới | Khuôn sẵn cho "thành phố tiến hoá theo thời đại" |
| **Freeciv** | GPL | Cây công nghệ 2 tiền đề. Trạng thái ngoại giao: chiến / ngừng bắn / hoà / liên minh | Khuôn cho "nhiều nước, cổ đại → tương lai" |
| **OpenRA** (Red Alert) | GPL (**kiểm lại phiên bản**) | Giải trận bằng bảng: lính có **loại giáp**, vũ khí có **loại đạn**, tra bảng nhân sát thương | Đơn giản, dễ cân bằng, không cần vật lý |
| **0 A.D.** | Code GPLv2, đồ hoạ CC-BY-SA | AI máy chia lớp: kinh tế / quân sự / xây dựng riêng | Khuôn cho Governor |
| **Majesty** (thương mại) | — | **Điều khiển gián tiếp**: không ra lệnh, chỉ treo thưởng — quân tự quyết | **Chính là** cơ chế cốt lõi của game này |

---

## 3. Ba thứ quan trọng nhất lấy được

### 3.1 Chia lớp — Total War

Total War chia làm hai: bản đồ chiến dịch (trừu tượng, quản lý đế chế) và trận đánh
(chi tiết). Ta chia ba: **chiến dịch · một thành phố chi tiết · trận đánh xem được**.

Không có cái này thì "nhiều nước, sáu thời đại, kinh tế sâu kiểu K&M" là **bất khả thi
trên iPhone** — phải mô phỏng chi tiết hàng chục thành phố.

Tỉnh chiếm được chỉ có **4-6 ô xây dựng** + vài chỉ số. Chọn xây gì là quyết định thú vị
mà máy gần như không tốn.

### 3.2 Hệ walker — Caesar III / Zeus

Widelands và K&M mô phỏng người vác hàng đi theo đường **có tìm đường đầy đủ**. Đúng
chiều sâu ta muốn, nhưng quá nặng cho iPhone.

Caesar III làm khác: toà nhà **phát ra walker** theo chu kỳ, walker đi theo đường, **tới
đâu phục vụ tới đó** trong bán kính, hết việc thì về và biến mất. Rẻ hơn nhiều mà nhìn
vẫn sống động y hệt.

**Cách gộp của Quốc Chiến:** lấy **chiều sâu chuỗi sản xuất của Widelands** + **cách vận
chuyển của Caesar III**. Đây là quyết định kỹ thuật then chốt.

### 3.3 Điều khiển gián tiếp — Majesty

Majesty không cho người chơi ra lệnh cho anh hùng. Người chơi **treo thưởng lên bản đồ**,
anh hùng tự quyết có đi hay không.

Đây chính xác là thứ chủ dự án mô tả: *"game sẽ tự làm hết, đến giai đoạn này thì hỏi tôi
với nhiều lựa chọn"*. Governor + thẻ chính sách + thẻ quyết định là cách hiện thực hoá nó.

---

## 4. Kỹ thuật đồ hoạ lấy từ các game mẫu

**Age of Empires 2, StarCraft, Red Alert, Zeus, Caesar III đều không vẽ tay sprite.**
Họ dựng model 3D độ nét cao rồi chụp lại từ một góc chéo cố định thành ảnh phẳng. Game
chỉ chở ảnh phẳng → nhẹ như 2D, đẹp như 3D.

Quốc Chiến làm y hệt bằng `tools/nuong_sprite.mjs`. Chi tiết: `TECH_SPEC.md` mục 3.

**Bản đồ chiến dịch** học Total War và Civilization: nền vẽ như bản đồ giấy da, tỉnh tô
màu theo nước, vùng chưa khám phá để trắng như giấy cũ. Đẹp, gần như không tốn máy, và
**che bớt phần chưa làm xong**.

---

## 5. Nguồn tra

Kiểm ngày 05/09/2026 — cả ba trang đều truy cập được từ máy ảo (trả 200), khác
`vercel.app` bị chặn 403.

- Kenney — <https://kenney.nl/assets/tag:isometric> · <https://kenney.nl/assets/category:3D>
- OpenGameArt — <https://opengameart.org/>
- itch.io CC0 isometric — <https://itch.io/game-assets/assets-cc0/tag-isometric>
- Widelands — <https://github.com/widelands/widelands>
- Julius (Caesar III) — <https://github.com/bvschaik/julius>
- Augustus (Caesar III) — <https://github.com/Keriew/augustus>
- Unknown Horizons — <https://en.wikipedia.org/wiki/Unknown_Horizons>
- WebKit bug 181244 (Canvas 2D chậm khi vẽ nhiều sprite nhỏ) —
  <https://bugs.webkit.org/show_bug.cgi?id=181244>
