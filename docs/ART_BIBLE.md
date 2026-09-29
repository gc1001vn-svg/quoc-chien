# ART BIBLE — QUỐC CHIẾN

> **Đọc trước mọi việc đụng hình:** chọn asset, nướng sprite, đổi đèn, đổi nền, đổi màu.
> Bản nháp 29/09, soạn từ 5 clip quảng cáo game xây thành anh gửi. Mục ghi **[anh chốt]** là
> đề xuất, chưa phải luật. Clip là quảng cáo thương mại, repo công khai → **clip và ảnh cắt từ
> clip không lên repo**; ở đây chỉ có lời tả và số đo. Clip không lưu lại sau phiên 29/09.
> Luật gốc vẫn ở `TECH_SPEC.md` mục 3: một phong cách cho cả sáu thời đại, cùng camera, cùng
> đèn, cùng hậu kỳ. File này nói phong cách đó **trông ra sao** và **đo bằng gì**.

## 1. Ba mốc

| Mốc | Là gì | Lấy | Không lấy |
|---|---|---|---|
| **A · "SLG"** | Quảng cáo "Kỷ Nguyên Băng Hà", 4 nền văn hoá: Viking, Arabia, Nhật, Trung Hoa | Mỗi văn hoá nhận ra ngay nhờ **một cặp màu** (nền + mái). Phố dày: người, xe, thùng hàng, thú. Đường lát, quảng trường có mép rõ | Nét vẽ tay tới từng viên gạch — không model CC0 nào tới |
| **B · "3Q"** | Quảng cáo "Kỷ Nguyên Băng Hà: 3Q", bản Á Đông và bản sa mạc | **Nắng vàng ấm, bóng mềm.** Người bầu bĩnh, đầu to. Sông xanh ngọc có bờ đá, cầu gỗ. Ruộng lúa thành luống, có rào. Bóng xanh trong suốt chỗ sắp xây | — |
| **C · "Viking Rise"** | Quảng cáo "Viking Rise: Train Your Dragon" | **Xây qua ba bước nhìn thấy được:** móng đá → giàn giáo gỗ → nhà xong | Hình gần như ảnh chụp: model CC0 không tới, iPhone không kham |

**Mốc chính đề xuất: B** — gần với model low-poly CC0 đang dùng nhất. A cho màu nhận diện và
mật độ, C cho bước xây. **[anh chốt]**

## 2. Số đo — mốc so với game (đo 29/09)

Mỗi cảnh một khung, cắt bỏ chữ, nút, hộp thoại. Thô — dùng để so **hướng**, không phải mã màu
sơn. Hex là màu trung bình của từng cụm, không phải màu vật liệu.

| Cảnh | Độ sáng TB | Bão hoà TB | Sáu màu chính (cụm lớn trước) |
|---|---|---|---|
| A · Viking | 0,41 | 0,52 | `#a86f41` `#765038` `#2d5990` `#433330` `#6e8ab1` `#c9e5f5` |
| A · Arabia | 0,42 | 0,60 | `#724323` `#945f35` `#e9ad64` `#bd834b` `#4a2e20` `#46546a` |
| A · Nhật | 0,32 | 0,52 | `#33251b` `#554c2f` `#6a655d` `#93702f` `#70321b` `#c0765c` |
| A · Trung Hoa | 0,46 | 0,45 | `#583f29` `#7a603a` `#9b7a4f` `#d9b98f` `#c09c68` `#3c484b` |
| B · Á Đông | **0,63** | 0,47 | `#e7be7b` `#cea869` `#aa8d53` `#7e6e48` `#8e8c7c` `#bfb543` |
| B · sa mạc | 0,46 | 0,58 | `#557a72` `#e29b54` `#986734` `#764c22` `#bd8043` `#4c3013` |
| C · Viking Rise | 0,30 | 0,41 | `#6e5f38` `#373224` `#55482f` `#1d1d16` `#886d53` `#ae896b` |
| **Game · cổ đại** | **0,28** | 0,51 | `#593f31` `#3e2f24` `#594e1f` `#7a5639` `#261d17` `#c58e3e` |
| **Game · hiện đại** | 0,31 | **0,28** | `#4e4a49` `#465527` `#746560` `#35363d` `#292720` `#a39d9b` |

Đọc ra: game **tối hơn mọi mốc A, B** (0,28–0,31 so với 0,32–0,63); đời hiện đại **xám**
(0,28, mốc thấp nhất 0,41).

**Số tay vẽ trong từng mẻ công trình** (`node tools/do_hinh.mjs tay-ve`):
cổ đại **6** · trung cổ 2 · trung cổ mẻ 2 **4** · cận đại **7** · hiện đại **4** · tương lai 2.
Mẻ cổ đại ghép Quaternius + KayKit + 4 tác giả Icosa (gà, dê của Google…) — đây là gốc số
một của chữ "gượng gạo" anh báo 29/09: KayKit màu bệt, Quaternius có hoạ tiết
(`NO_KY_THUAT.md`), Icosa mỗi con một kiểu.

## 3. Luật

1. **Tay vẽ:** mỗi mẻ công trình **tối đa 2 tay vẽ**; mỗi loại công trình (nhà ở · nông trại ·
   quân sự · công cộng) **chỉ một tay vẽ**; tay thứ hai chỉ dùng cho cây, đá, người. **[anh chốt số 2]**
2. **Độ sáng:** cảnh thành phố ở zoom 1× có độ sáng TB **≥ 0,40**. **[anh chốt trên bảng đèn — mục 4]**
3. **Bão hoà:** mọi đời **≥ 0,45** (mốc A, B thấp nhất 0,45).
4. **Màu nhận diện mỗi đời:** nền một tông, **mái một màu riêng** mà đời kề không dùng — như
   mốc A. Mặc định đề xuất **[anh chốt]**:

   | Đời | Theo mốc | Nền | Mái / điểm nhấn |
   |---|---|---|---|
   | 1 Cổ đại | B · Á Đông | cỏ khô, đất nắng (`#e7be7b` `#cea869`) | rơm, gỗ mộc (`#aa8d53`) |
   | 2 Trung cổ | A · Trung Hoa, Nhật | đất, đường lát (`#d9b98f` `#9b7a4f`) | mái sẫm (`#3c484b`), đỏ son (`#70321b`) |
   | 3–6 | **chưa có mốc** | — | — |

   Năm clip chỉ có thời trước thuốc súng. Đời 3–6 cần thêm mốc: một clip game thời thuộc địa,
   công nghiệp, hay thành phố hiện đại anh thấy đẹp.
5. **Cỡ:** cả một gói dùng **một hệ số cỡ**; không phóng to, thu nhỏ riêng từng model cho vừa.
6. **Đồ vật quanh nhà** lấy **cùng tay vẽ với nhà** (nhà Quaternius → đồ Fantasy Props MegaKit,
   hơn 200 món). Mật độ như mốc A, nhưng tính chỗ atlas **trước** khi nướng (mẻ trung cổ 2× đã
   hết chỗ — `TIEN_DO.md` mục 2).
7. **Nền liền, đường có mép rõ.** Ảnh chụp 29/09: nền cổ đại có ô tối xen ô cỏ như bàn cờ; mốc
   A, B đều nền liền. Xem lại cùng lúc với bảng đèn.
8. **Cấm:**
   - Trộn đồ màu bệt (KayKit, Kenney) với đồ có hoạ tiết (Quaternius) trong cùng một loại công trình.
   - Lấy model rời của tay vẽ lạ chỉ vì "có đúng con đó" — tìm trong gói của tay vẽ chính trước.
   - Pixel art, ảnh AI (`ghi-nho/quyet-dinh/2026-09-29-mcp-skill-do-hoa-ai-chua-dung.md`).
   - Hình gần ảnh chụp, hoạ tiết độ phân giải cao.
   - Ảnh hay clip game thương mại lên repo.

**Đề xuất, chưa là luật — bước xây (mốc C):** nhà mới lên đi qua móng → giàn giáo → xong.
Gói Ultimate Fantasy RTS (Quaternius, CC0) có sẵn mỗi nhà ba bậc `Level1–3`. **[anh chốt có làm không]**

## 4. Gói thay đề xuất cho đời 1–2 — cùng một tay vẽ Quaternius, CC0

Dò bằng `node /home/user/kho-game/cong-cu/do.mjs farm --nguon quaternius` (29/09):

| Gói | Có gì |
|---|---|
| `farmbuildings` | 13 model: Barn, BigBarn, ChickenCoop, Fence, OpenBarn, Silo, SmallBarn, Windmill, Well, WaterTower… |
| `farmanimal` | 7 con: Cow, Horse, Llama, Pig, Pug, Sheep, Zebra — **không có gà, dê** |
| `ultimatecrops` | 17 loại cây (Wheat, Rice, Corn, Pumpkin…) × 4 giai đoạn lớn + bản đã gặt — không có nho |
| `ultimatefantasyrts` | Houses, Farm, Market, Temple, Barracks, TownCenter… theo `FirstAge`/`SecondAge` × `Level1–3` |
| `cutemonsters` | Có một con `Chicken` — kiểu hoạt hình, **phải nướng thử mới biết có hợp không** |

## 5. Thứ tự làm — mỗi bước một bảng, anh chọn một lần

1. **Bảng đèn:** một cảnh cổ đại × 4 mức (sáng nền, ấm đèn); ghi độ sáng TB dưới từng ô.
   Đèn hiện ở `tools/lib/trang_nuong.js`: đèn chính `(1.05, 0.99, 0.88) × 0.72`, đèn nền trời
   `(0.40, 0.44, 0.52)`, đất `(0.22, 0.20, 0.26)`.
2. **Bảng nông trại:** bản hiện tại cạnh bản Quaternius (mục 4).
3. Nướng lại mẻ cổ đại theo luật 1–7; rồi cận đại (7 tay vẽ), hiện đại (bão hoà 0,28).

## 6. Đo lại

```bash
apt-get update && apt-get install -y ffmpeg          # máy ảo không có sẵn
node tools/do_hinh.mjs mau anh_chup/<ảnh>.png 1748:370:0:80   # rộng:cao:x:y, bỏ hộp thoại
node tools/do_hinh.mjs tay-ve [mẻ ...]
```

Ảnh game: `npm run build`, `npx vite preview`, rồi
`DIA_CHI=http://127.0.0.1:4173/quoc-chien/ node scripts/chup_man.mjs "?me=co_dai" <tên>.png`.
