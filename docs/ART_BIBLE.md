# ART BIBLE — QUỐC CHIẾN

> **Đọc trước mọi việc đụng hình:** chọn asset, nướng sprite, đổi đèn, đổi nền, đổi màu.
> Bản nháp 29/09, soạn từ **10 clip** quảng cáo game anh gửi (5 lần một, 5 lần hai). Mục ghi
> **[anh chốt]** là đề xuất, chưa phải luật. Clip là quảng cáo thương mại, repo công khai →
> **clip và ảnh cắt từ clip không lên repo**; ở đây chỉ có lời tả và số đo. Clip không lưu lại
> sau phiên 29/09. Tên game ghi theo chữ trên quảng cáo; quảng cáo không ghi tên thì ghi "không rõ".
> Luật gốc vẫn ở `TECH_SPEC.md` mục 3: một phong cách cho cả sáu thời đại, cùng camera, cùng
> đèn, cùng hậu kỳ. File này nói phong cách đó **trông ra sao** và **đo bằng gì**.

## 1. Bảy mốc — mỗi mốc lấy đúng một thứ

| Mốc | Là gì | Dùng cho | Lấy | Không lấy |
|---|---|---|---|---|
| **D · "Survivor Island"** | "Survivor Island – Idle Game": low-poly mặt phẳng, cỏ xanh sáng, thông khối, lều, lửa trại, cầu gỗ | **Hình khối — mốc chính** | Mức chi tiết của model low-poly CC0 đang dùng. Cùng một chỗ, cấp càng cao nhà càng to, vật liệu đổi: lều vải → nhà gỗ mái rơm → tháp đá có cờ | Vầng sáng nâng cấp, số sát thương nổi |
| **G · nông trại** | Không rõ tên. Nông trại 3D nắng chiều | **Ruộng, trại** | Luống chữ nhật đất sẫm, cây thẳng hàng, mỗi luống một loại cây. Chuồng có rào, gà rải trong chuồng. Mỗi nhà một màu mái | — |
| **B · "3Q"** | "Kỷ Nguyên Băng Hà: 3Q", Á Đông và sa mạc | **Ánh sáng** | Nắng vàng ấm, bóng mềm. Sông xanh ngọc bờ đá, cầu gỗ. Mỗi nhà trên một khoảnh sân đất | Hoạ tiết mịn kiểu phim hoạt hình |
| **A · "SLG"** | "Kỷ Nguyên Băng Hà": Viking, Arabia, Nhật, Trung Hoa | **Màu nhận diện, mật độ** | Mỗi văn hoá nhận ra ngay nhờ **một cặp màu** nền + mái. Phố dày người, xe, thùng hàng | Nét vẽ tay tới từng viên gạch |
| **F · thành phố công nghiệp** | Không rõ tên. Thành phố dựng sẵn chi tiết, có tháp Eiffel, Big Ben | **Đời 4, một phần đời 5** | Gạch đỏ, ống khói, máy hơi nước đỏ, đường ray, mỏ lộ thiên, bãi gỗ. Kỳ quan là bóng dáng cao nhất phố | Mức chi tiết dựng sẵn — model CC0 không tới |
| **C · "Viking Rise"** | "Viking Rise: Train Your Dragon" | **Bước xây** | Móng đá → giàn giáo gỗ → nhà xong | Hình gần ảnh chụp |
| **E · "Last Fiefdom"** | "Last Fiefdom": bản đồ vẽ nét mực trên nền giấy | **Bản đồ, trận** | Mỗi phe một khối màu tương phản (xanh ↔ đỏ). Số quân ghi trên nhãn. Mũi tên lệnh | — |

**Đề xuất:** hình khối theo **D**, ánh sáng theo **B + G**, nông trại theo **G**. Lần một đề
xuất B làm mốc chính; D gần model đang dùng hơn nên thay. **[anh chốt]**

## 2. Số đo — mốc so với game (đo 29/09)

Mỗi cảnh một khung, cắt bỏ chữ, nút, hộp thoại. Thô — dùng để so **hướng**, không phải mã màu
sơn. Hex là màu trung bình của từng cụm, không phải màu vật liệu.

| Cảnh | Độ sáng TB | Bão hoà TB | Sáu màu chính (cụm lớn trước) |
|---|---|---|---|
| D · đầu game | 0,60 | 0,37 | `#95b372` `#87ad6c` `#708454` `#52613c` `#a6926c` `#d9b786` |
| D · lửa trại | 0,64 | 0,38 | `#87ad6b` `#95b371` `#cbbd82` `#897c53` `#c19868` `#614430` |
| D · cấp 55 | 0,56 | 0,55 | `#6c5829` `#7db339` `#bc8638` `#6399c4` `#9b9479` `#e6ca8e` |
| G · nông trại | 0,58 | 0,49 | `#695842` `#d6a447` `#a97a4b` `#fac78b` `#7f707d` `#e1ad75` |
| B · Á Đông | 0,63 | 0,47 | `#e7be7b` `#cea869` `#aa8d53` `#7e6e48` `#8e8c7c` `#bfb543` |
| B · sa mạc | 0,46 | 0,58 | `#557a72` `#e29b54` `#986734` `#764c22` `#bd8043` `#4c3013` |
| A · Viking | 0,41 | 0,52 | `#a86f41` `#765038` `#2d5990` `#433330` `#6e8ab1` `#c9e5f5` |
| A · Arabia | 0,42 | 0,60 | `#724323` `#945f35` `#e9ad64` `#bd834b` `#4a2e20` `#46546a` |
| A · Nhật | 0,32 | 0,52 | `#33251b` `#554c2f` `#6a655d` `#93702f` `#70321b` `#c0765c` |
| A · Trung Hoa | 0,46 | 0,45 | `#583f29` `#7a603a` `#9b7a4f` `#d9b98f` `#c09c68` `#3c484b` |
| F · phố | 0,43 | 0,43 | `#866446` `#9e8068` `#624f3e` `#483828` `#aa8643` `#d7ac84` |
| F · mỏ | 0,53 | 0,53 | `#ecbd7b` `#874c30` `#b5865d` `#9f6f41` `#d1a16b` `#573226` |
| F · bãi gỗ | 0,44 | 0,47 | `#816448` `#654932` `#9a7b42` `#413326` `#d6ae7c` `#b18962` |
| C · Viking Rise | 0,30 | 0,41 | `#6e5f38` `#373224` `#55482f` `#1d1d16` `#886d53` `#ae896b` |
| E · trận bờ biển | 0,66 | 0,18 | `#72819d` `#98b0c8` `#d2d9c1` `#bcc0b2` `#a2a09c` `#8e8081` |
| E · trận đồng | 0,66 | 0,18 | `#bab69c` `#a6a28d` `#908c7d` `#c9c39c` `#ead99f` `#767066` |
| **Game · cổ đại** | **0,28** | 0,51 | `#593f31` `#3e2f24` `#594e1f` `#7a5639` `#261d17` `#c58e3e` |
| **Game · hiện đại** | 0,31 | **0,28** | `#4e4a49` `#465527` `#746560` `#35363d` `#292720` `#a39d9b` |

Đọc ra:
- **Độ sáng:** 16 cảnh mốc từ 0,30 đến 0,66; **14/16 cảnh ≥ 0,40**. Game cổ đại (0,28) tối hơn cả
  16 cảnh; hiện đại (0,31) chỉ sáng hơn một cảnh (C).
- **Bão hoà:** cảnh thành phố, nông trại từ 0,37 đến 0,60. E là bản đồ giấy, kiểu riêng (0,18).
  Game hiện đại (0,28) xám hơn mọi cảnh thành phố.

**Số tay vẽ trong từng mẻ công trình** (`node tools/do_hinh.mjs tay-ve`):
cổ đại **6** · trung cổ 2 · trung cổ mẻ 2 **4** · cận đại **7** · hiện đại **4** · tương lai 2.
Mẻ cổ đại ghép Quaternius + KayKit + 4 tác giả Icosa (gà, dê của Google…) — gốc số một của
chữ "gượng gạo" anh báo 29/09: KayKit màu bệt, Quaternius có hoạ tiết (`NO_KY_THUAT.md`),
Icosa mỗi con một kiểu. Mốc nào trong 10 clip cũng **một phong cách liền một khối**.

## 3. Luật

1. **Tay vẽ:** mỗi mẻ công trình **tối đa 2 tay vẽ**; mỗi loại công trình (nhà ở · nông trại ·
   quân sự · công cộng) **chỉ một tay vẽ**; tay thứ hai chỉ dùng cho cây, đá, người. **[anh chốt số 2]**
2. **Độ sáng:** cảnh thành phố ở zoom 1× có độ sáng TB **≥ 0,40**. **[anh chốt trên bảng đèn — mục 5]**
3. **Bão hoà:** cảnh thành phố **≥ 0,37** (cảnh thành phố nhạt nhất trong mốc: D đầu game).
4. **Màu nhận diện mỗi đời:** nền một tông, **mái một màu riêng** mà đời kề không dùng — như
   mốc A. Mặc định đề xuất **[anh chốt]**:

   | Đời | Theo mốc | Nền | Mái / điểm nhấn |
   |---|---|---|---|
   | 1 Cổ đại | D đầu game · B Á Đông | cỏ tươi, đất nắng (`#95b372` `#e7be7b`) | lều vải, rơm, gỗ mộc (`#aa8d53`) |
   | 2 Trung cổ | A Trung Hoa, Nhật · D cấp 55 | đất, đường lát (`#d9b98f` `#9b7a4f`) | mái sẫm (`#3c484b`), đỏ son (`#70321b`), tháp đá có cờ |
   | 3 Súng ống | **chưa có mốc** | — | — |
   | 4 Công nghiệp | F | đất mỏ, bãi gỗ (`#ecbd7b` `#816448`) | gạch đỏ (`#874c30`), máy hơi nước đỏ, ống khói, đường ray |
   | 5 Hiện đại | F, **một phần**: nhà cao tầng kính xanh cạnh tháp Eiffel | — | — |
   | 6 Tương lai | **chưa có mốc** | — | — |

5. **Cỡ:** cả một gói dùng **một hệ số cỡ**; không phóng to, thu nhỏ riêng từng model cho vừa.
6. **Đồ vật quanh nhà** lấy **cùng tay vẽ với nhà** (nhà Quaternius → đồ Fantasy Props MegaKit,
   hơn 200 món). Mật độ như mốc A, nhưng tính chỗ atlas **trước** khi nướng (mẻ trung cổ 2× đã
   hết chỗ — `TIEN_DO.md` mục 2).
7. **Nền liền, đường có mép rõ.** Ảnh chụp 29/09: nền cổ đại có ô tối xen ô cỏ như bàn cờ; mọi
   mốc thành phố đều nền liền. Xem lại cùng lúc với bảng đèn.
8. **Nông trại theo G:** luống chữ nhật đất sẫm, cây thẳng hàng, mỗi luống một loại cây; cây lớn
   dần theo giai đoạn (Ultimate Crops có 4); chuồng có rào, thú rải trong chuồng; mỗi nhà một màu mái.
9. **Cấm:**
   - Trộn đồ màu bệt (KayKit, Kenney) với đồ có hoạ tiết (Quaternius) trong cùng một loại công trình.
   - Lấy model rời của tay vẽ lạ chỉ vì "có đúng con đó" — tìm trong gói của tay vẽ chính trước.
   - Pixel art, ảnh AI (`ghi-nho/quyet-dinh/2026-09-29-mcp-skill-do-hoa-ai-chua-dung.md`).
   - Hình gần ảnh chụp, hoạ tiết độ phân giải cao, mức chi tiết dựng sẵn kiểu F.
   - Ảnh hay clip game thương mại lên repo.

**Đề xuất từ clip, chưa là luật — [anh chốt từng cái]:**
- **Bậc nhà và bước xây** (C, D): nhà mới đi qua móng → giàn giáo → xong; bậc cao thì to hơn,
  đổi vật liệu. Gói Ultimate Fantasy RTS (Quaternius, CC0) có sẵn mỗi nhà ba bậc `Level1–3`.
- **Nền lót** (B, D, F, G đều có): mỗi công trình, mỗi luống ruộng đứng trên một khoảnh đất/cát
  sáng hơn cỏ, nhìn là biết đâu là đất đã xây. Nhà đang nướng rời, không đế (`NGUON_MO.md`) →
  nền lót phải là ô nền riêng, không nướng dính vào nhà.
- **Bản đồ tỉnh và trận theo E:** bản đồ nền giấy nét mực, nhạt màu, tách hẳn khỏi thành phố; mỗi
  phe một khối màu, số quân trên nhãn.

## 4. Gói thay đề xuất cho đời 1–2 — cùng một tay vẽ Quaternius, CC0

Dò bằng `node /home/user/kho-game/cong-cu/do.mjs farm --nguon quaternius` (29/09):

| Gói | Có gì |
|---|---|
| `farmbuildings` | 13 model: Barn, BigBarn, ChickenCoop, Fence, OpenBarn, Silo, SmallBarn, Windmill, Well, WaterTower… |
| `farmanimal` | 7 con: Cow, Horse, Llama, Pig, Pug, Sheep, Zebra — **không có gà, dê** |
| `ultimatecrops` | 17 loại cây (Wheat, Rice, Corn, Pumpkin…) × 4 giai đoạn lớn + bản đã gặt — không có nho |
| `ultimatefantasyrts` | Houses, Farm, Market, Temple, Barracks, TownCenter… theo `FirstAge`/`SecondAge` × `Level1–3`; có `Farm_Dirt_Level1–3` làm luống |
| `cutemonsters` | Có một con `Chicken` — kiểu hoạt hình, **phải nướng thử mới biết có hợp không** |

## 5. Thứ tự làm — mỗi bước một bảng, anh chọn một lần

1. **Bảng đèn:** một cảnh cổ đại × 4 mức, nhắm độ sáng TB **0,40 · 0,47 · 0,54 · 0,61**; ghi số đo
   thật dưới từng ô. Đèn hiện ở `tools/lib/trang_nuong.js`: đèn chính `(1.05, 0.99, 0.88) × 0.72`,
   đèn nền trời `(0.40, 0.44, 0.52)`, đất `(0.22, 0.20, 0.26)`.
2. **Bảng nông trại theo G:** bản hiện tại cạnh bản Quaternius (mục 4).
3. Nướng lại mẻ cổ đại theo luật 1–8; rồi cận đại (7 tay vẽ), hiện đại (bão hoà 0,28).

## 6. Đo lại

```bash
apt-get update && apt-get install -y ffmpeg          # máy ảo không có sẵn
node tools/do_hinh.mjs mau anh_chup/<ảnh>.png 1748:370:0:80   # rộng:cao:x:y, bỏ hộp thoại
node tools/do_hinh.mjs tay-ve [mẻ ...]
```

Ảnh game: `npm run build`, `npx vite preview`, rồi
`DIA_CHI=http://127.0.0.1:4173/quoc-chien/ node scripts/chup_man.mjs "?me=co_dai" <tên>.png`.
