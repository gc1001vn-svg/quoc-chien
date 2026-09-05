# GAME_SPEC — QUỐC CHIẾN

> **Nguồn sự thật về thiết kế.** Người dùng nói gì mâu thuẫn với file này → hỏi lại,
> không tự quyết. Đổi thiết kế thì sửa file này trước, viết code sau.

Lập 05/09/2026.

---

## 1. Game này là gì

Chiến thuật offline, chạy web, cài lên iPhone dạng PWA. Một người chơi.

**Điều làm nó khác mọi game chiến thuật khác:** người chơi **không xây, không điều khiển
lính, không bấm từng toà nhà**. Game tự làm hết. Người chơi ngồi xem thành phố lớn lên,
và **chỉ ra quyết định** ở những khúc rẽ quan trọng.

Cơ chế này lấy từ **Majesty: The Fantasy Kingdom Sim** — điều khiển gián tiếp: không ra
lệnh, chỉ đặt hướng và để quân tự quyết.

Một ván đi suốt **sáu thời đại**: cổ đại → trung cổ → súng ống → công nghiệp → hiện đại
→ tương lai.

### Game mẫu

| Game | Lấy gì |
|---|---|
| Knights and Merchants | Chiều sâu kinh tế: chuỗi sản xuất nhiều bước, dân vác hàng |
| Zeus / Poseidon (Caesar III) | Hệ walker, dáng thành phố isometric |
| Civilization | Thời đại, cây công nghệ, thẻ chính sách, điều kiện thắng |
| Total War | Chia lớp chiến dịch / trận đánh, tỉnh có ô xây dựng, trật tự công cộng |
| Age of Empires | Lên thời đại, tài nguyên |
| Red Alert / StarCraft | Bảng giáp × đạn để giải trận, phe phái khác nhau |
| Majesty | **Điều khiển gián tiếp** — cốt lõi của game này |

Chi tiết học gì từ đâu: [`THAM_KHAO.md`](THAM_KHAO.md).

---

## 2. Ba lớp

| Lớp | Người chơi thấy gì | Mô phỏng sâu bao nhiêu |
|---|---|---|
| **Chiến dịch** | Bản đồ các tỉnh như bản đồ giấy da, cờ hiệu từng nước, quân đi lại | Trừu tượng — tỉnh chỉ có vài ô xây dựng và vài chỉ số |
| **Thành phố** | **Một** thành phố isometric chi tiết — dân đi lại, vác hàng, khói bốc | Sâu: từng toà nhà, từng người vác hàng |
| **Trận đánh** | Chiến trường isometric, quân tự đánh, 30-60 giây | Diễn lại kịch bản đã tính sẵn |

**Chỉ một thành phố được mô phỏng chi tiết** — thủ đô. Các tỉnh chiếm được dùng cách của
Total War: mỗi tỉnh 4-6 **ô xây dựng**, chọn xây gì vào ô, không mô phỏng từng người.

Đây là quyết định thiết kế quan trọng nhất. Không có nó thì "nhiều nước, sáu thời đại,
kinh tế sâu" là bất khả thi trên iPhone.

---

## 3. Vòng lặp game

1. Chọn nước → sinh bản đồ chiến dịch từ hạt giống
2. Mô phỏng chạy tự động (tốc độ 0 / 1× / 2× / 4× / 8×):
   - Governor xây nhà theo chính sách người chơi đặt
   - Walker đi giao hàng, phục vụ nhà dân
   - Nước đối thủ lớn lên trên bản đồ chiến dịch
3. Đến ngưỡng → **dừng, hiện thẻ quyết định** 2-4 lựa chọn
4. Người chơi bấm → áp dụng hậu quả → chạy tiếp
5. Có xung đột → hiện dự đoán "thắng 62%" → chọn **đánh / rút / gửi sứ**.
   Chọn đánh thì **xem trận 30-60 giây**
6. Nghiên cứu đủ (Eureka đẩy nhanh) → **lên thời đại**: atlas sprite đổi, mở toà nhà và
   lính mới, mở thêm ô chính sách
7. Đạt một trong bốn điều kiện thắng → hết ván

---

## 4. Kinh tế thành phố — chiều sâu Knights and Merchants

### Chuỗi sản xuất

Hàng hoá đi qua nhiều bước, mỗi bước một toà nhà. Ví dụ thời trung cổ:

```
Ruộng lúa  → lúa mì  → Cối xay  → bột   → Lò bánh   → bánh mì → dân ăn
Mỏ quặng   → quặng   → Lò nung  → sắt   → Lò rèn    → giáp    → lính
Rừng       → gỗ thô  → Xưởng cưa→ ván   → Công trường→ nhà mới
Đồng cỏ    → cỏ      → Trại bò  → da    → Xưởng thuộc→ áo da   → lính
```

Định nghĩa nằm trong `data/chains.json`, **không nằm trong code**.

### Vận chuyển — hệ walker của Caesar III, không phải tìm đường đầy đủ

Widelands và K&M mô phỏng người vác hàng đi theo đường có tìm đường đầy đủ. **Quá nặng
cho iPhone.** Ta dùng cách của Caesar III / Zeus:

- Toà nhà **phát ra walker** theo chu kỳ
- Walker đi theo đường, **tới đâu phục vụ tới đó** trong bán kính
- Hết nhiệm vụ thì quay về, biến mất

Rẻ hơn nhiều mà nhìn vẫn sống động y hệt. Đây là cách gộp then chốt của game này.

### Dân cư có bậc — học Unknown Horizons

Nhà dân có bậc. Đủ nhu cầu thì lên bậc, mở nhu cầu mới và đóng thuế nhiều hơn.

| Bậc | Cần gì | Cho gì |
|---|---|---|
| 1 — Lều | Nước | Ít dân, ít thuế |
| 2 — Nhà tranh | Nước, bánh mì | Thêm dân |
| 3 — Nhà gỗ | + quần áo | Thợ thủ công |
| 4 — Nhà đá | + rượu, đền thờ | Thuế cao, học giả |

Số bậc và nhu cầu đọc từ `data/buildings.json`. Bậc cao mở khoá theo thời đại.

### Trật tự công cộng — học Total War

Chỉ số **bất ổn** tăng khi: thuế cao, thiếu lương thực, vừa mất tỉnh, dân bậc cao không
đủ nhu cầu. Vượt ngưỡng → sinh thẻ quyết định khó (đàn áp / giảm thuế / xây nhà hát).
Kệ nó → nổi loạn, mất một tỉnh.

---

## 5. Lớp chiến dịch

- Bản đồ chia thành **tỉnh**. Mỗi tỉnh thuộc một nước, có địa hình và tài nguyên riêng.
- Mỗi tỉnh có **4-6 ô xây dựng**. Xây gì vào ô là một quyết định (`data/provinces.json`).
- Quân đội đi giữa các tỉnh, mất thời gian theo khoảng cách và địa hình.
- Vùng chưa khám phá vẽ như giấy da cũ — vừa đẹp vừa che phần chưa làm.

### Ngoại giao — học Freeciv

Bốn trạng thái với mỗi nước: **chiến tranh · ngừng bắn · hoà bình · liên minh**.

Ba cách tác động, đúng như chủ dự án nói: **thương mại · đàm phán · đe doạ**.

| Cách | Tốn gì | Được gì | Rủi ro |
|---|---|---|---|
| Thương mại | Mở tuyến, chia lợi | Vàng đều, quan hệ tăng | Đối phương giàu lên theo |
| Đàm phán | Thời gian, có khi cống nạp | Ngừng bắn, hoà bình, liên minh | Bị coi là yếu |
| Đe doạ | Uy tín quân sự | Đối phương lùi, cống nạp | Thất bại thì mất mặt, có khi thành chiến |

Kết quả đe doạ tính từ **tương quan sức mạnh** — đe doạ khi yếu thì phản tác dụng.

---

## 6. Trận đánh — xem được, không điều khiển

### Tính trước, diễn sau

1. **Tính kết quả** (`sim/campaign/Battle.ts`): bảng giáp × đạn kiểu OpenRA + địa hình +
   tướng → ai thắng, mỗi bên chết bao nhiêu, kết thúc ở giây thứ mấy.
   Con số này cũng là **dự đoán % thắng** hiện ra trước trận.
2. **Sinh kịch bản** (`sim/campaign/BattleScript.ts`): danh sách sự kiện có mốc thời gian.
   ```
   0s   hai bên tiến
   4s   cung thủ bắn loạt đầu
   9s   kỵ binh vòng sườn trái
   22s  cánh phải địch vỡ
   31s  tàn quân chạy — kết thúc
   ```
3. **Diễn lại** (`render/BattleScene.ts`): phát kịch bản trên chiến trường isometric.
   Có nút **tăng tốc** và **bỏ qua**.

Vì kết quả tính trước nên: nhẹ máy (không tìm đường, không AI từng lính), test được
(chạy 1000 trận trong Node), và **con số dự đoán không bao giờ lệch với cái người chơi xem**.

### Quy mô — cố ý giữ nhỏ

- Mỗi bên 6-10 **đội**, mỗi đội 8-12 lính → 150-250 sprite động
- Chiến trường 40×40 ô, nền phẳng + vài cụm cây
- Lính cần 8 hướng × 4 dáng: đi, đánh, trúng đòn, chết

### Bảng giáp × đạn — học OpenRA

Mỗi lính có **loại giáp** (không giáp / da / xích / tấm / xe / công sự). Mỗi vũ khí có
**loại đạn** (chém / đâm / xuyên / nổ / xuyên giáp). Tra bảng ra hệ số nhân sát thương.
Bảng nằm trong `data/armor_table.json`. Đơn giản, dễ cân bằng, không cần vật lý.

---

## 7. Quyết định — thứ duy nhất người chơi làm

### Sáu loại

| Loại | Ví dụ |
|---|---|
| **Nâng cấp** | "Kho gỗ đầy. Xây xưởng cưa thứ hai, hay chuyển thợ sang mỏ đá?" |
| **Hướng phát triển** | Đổi thẻ chính sách: dồn nông nghiệp / thủ công / quân sự |
| **Khoa học kỹ thuật** | Chọn nhánh công nghệ; Eureka nào đáng đi săn |
| **Quân sự** | "Nước B dồn quân biên giới. Dự đoán thắng 62%: đánh / rút / gửi sứ" |
| **Ngoại giao** | "Thương mại, đàm phán, hay đe doạ" |
| **Loại lính** | "Đầu tư cung thủ hay kỵ binh" |

### Cách một thẻ quyết định ra đời

Mỗi thẻ trong `data/decisions.json` có: **điều kiện kích hoạt** (ví dụ: kho gỗ > 90% và
đã có xưởng cưa) · **văn bản** · **2-4 lựa chọn**, mỗi lựa chọn có hậu quả.

Engine quét điều kiện mỗi N nhịp, chọn thẻ điểm cao nhất chưa hỏi gần đây, tạm dừng sim,
hiện thẻ.

**Luật nhịp độ** (chỉnh trong `data/balance.json`):
- Không hỏi quá dày — tối thiểu vài phút giữa hai thẻ, trừ thẻ khẩn cấp
- Không hỏi lại cùng một thẻ trong một khoảng thời gian
- Mọi lựa chọn phải **có đánh đổi thật**, không có lựa chọn hiển nhiên đúng

### Thẻ chính sách — học Civilization VI

Chính phủ có **N ô**. Người chơi chọn N thẻ trong bộ 20+. Lên thời đại thì mở thêm ô và
thẻ mới. Đổi thẻ lúc nào cũng được (có phí).

Ví dụ: *Khẩn hoang* (+15% lương thực, −10% sản xuất) · *Cưỡng bách tòng quân*
(+25% lính, +bất ổn) · *Bảo trợ học thuật* (+20% nghiên cứu, −vàng).

Đây là cơ chế ra quyết định gọn nhất: ảnh hưởng sâu, chọn lại được, không phải bấm từng nhà.

---

## 8. Governor — AI tự xây

Là linh hồn của game. Chia lớp như 0 A.D.:

| Lớp | Lo việc gì |
|---|---|
| Kinh tế | Chuỗi sản xuất nào đang tắc, xây thêm nhà nào |
| Xây dựng | Đặt nhà ở đâu cho hợp lý, đường nối vào |
| Quân sự | Tuyển lính gì, đóng ở đâu |

Governor **tuân theo chính sách** người chơi đặt (thẻ chính sách + hướng thăng cấp thống
đốc). Người chơi lái bằng chính sách, không bấm từng nhà.

**Thống đốc có thăng cấp** (học Civ VI): mỗi vài cấp người chơi chọn một hướng thăng cấp
— đó chính là cách lái AI mà không micromanage.

**Cân bằng khó nhất của cả game:** xây dở thì chán, xây quá giỏi thì người chơi không còn
gì để quyết. Nguyên tắc: Governor lo việc **lặp lại và hiển nhiên**; mọi việc có **đánh
đổi thật** thì đẩy thành thẻ quyết định.

---

## 9. Thời đại và công nghệ

### Sáu thời đại

| # | Thời đại | Đặc trưng |
|---|---|---|
| 1 | Cổ đại | Lều, chòi gỗ, giáo đá, đổi chác |
| 2 | Trung cổ | Lâu đài, thợ rèn, kỵ binh, cung thủ |
| 3 | Súng ống / cận đại | Hoả mai, thành sao, hàng hải, thuộc địa |
| 4 | Công nghiệp | Nhà máy, đường sắt, đại bác, than |
| 5 | Hiện đại | Xe tăng, máy bay, điện, tuyên truyền |
| 6 | Tương lai | Rô-bốt, năng lượng nhiệt hạch, phòng thủ quỹ đạo |

Lên thời đại: nghiên cứu đủ số công nghệ mốc + đủ dân + đủ vàng. Lên xong thì **atlas
sprite đổi** — thành phố trông khác hẳn.

### Cây công nghệ — học Freeciv

Mỗi công nghệ có **tối đa 2 tiền đề**, mở khoá toà nhà / lính / thẻ chính sách. Tên công
nghệ dùng tên lịch sử có thật (Luyện đồng, Bánh xe, In ấn, Động cơ hơi nước…) — đây là
kiến thức chung, không phải nội dung của game nào.

### Eureka — học Civilization VI

Làm một việc cụ thể → giảm ~40% chi phí một công nghệ. Ví dụ: xây cảng đầu tiên → Eureka
cho Hàng hải. Làm việc lên thời đại thành thứ **kiếm được**, không phải ngồi đợi.
Danh sách trong `data/eureka.json`.

---

## 10. Các nước

Mỗi nước có **hai đặc tính** và **một lính riêng**. Ví dụ khung (nội dung cụ thể viết sau,
phải nguyên gốc):

| Nước | Đặc tính 1 | Đặc tính 2 |
|---|---|---|
| A — thảo nguyên | Kỵ binh rẻ hơn 25% | Quân đi nhanh hơn trên đồng bằng |
| B — ven biển | Thương mại đường biển lợi hơn | Cảng cho thêm Eureka |
| C — miền núi | Mỏ cho nhiều quặng hơn | Phòng thủ tốt hơn trên núi |

Định nghĩa trong `data/nations.json`. Thêm nước = thêm một mục JSON, không sửa code.

---

## 11. Điều kiện thắng

Bốn đích, chọn đích nào là do người chơi chơi ra:

| Thắng bằng | Đạt thế nào |
|---|---|
| **Thống trị** | Chiếm thủ đô của mọi nước còn lại |
| **Khoa học** | Hoàn thành công nghệ cuối của thời đại 6 |
| **Văn hoá** | Chỉ số ảnh hưởng vượt tổng các nước khác |
| **Ngoại giao** | Được đa số nước bầu làm minh chủ |

Ngưỡng trong `data/victory.json`. Thua: mất thủ đô, hoặc bất ổn làm sụp cả nước.

---

## 12. Luật nội dung — không được vi phạm

- **Nội dung nguyên gốc.** Không sao chép tên công nghệ đặc chế, tên đơn vị, tên địa
  danh, cốt truyện, bố cục bản đồ từ game thương mại. Tên lịch sử có thật thì dùng được.
- **Asset chỉ CC0 / CC-BY / MIT**, ghi nguồn vào `docs/ASSET_CREDITS.md` **ngay lúc thêm**.
  CC-BY-**SA** không dùng được vì lây license sang cả dự án.
- **Repo GPL/AGPL chỉ đọc học kiến trúc, không copy-paste code.**
- **Mọi số cân bằng nằm trong `data/*.json`**, cấm hardcode trong `.ts`.
