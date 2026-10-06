# ART BIBLE — QUỐC CHIẾN

> **Đọc trước mọi việc đụng hình:** chọn asset, nướng sprite, đổi đèn, đổi nền, đổi màu.
> Soạn 29/09 từ **10 clip** quảng cáo game anh gửi (5 lần một, 5 lần hai), cộng 9 game
> thật tra thêm (mục 7). **Anh chốt 29/09 ("ok làm hết"):** mốc hình khối D · tối đa 2 tay vẽ ·
> bước xây · nền lót · màu đời 1–2. **Lần hai ("1 ok hết"):** màu đời 3–6 · bản đồ kiểu giấy nét mực ·
> đời 6 tương lai xanh sạch. Mục còn ghi **[anh chốt]** vẫn là đề xuất. Clip là quảng cáo
> thương mại, repo công khai →
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

**Chốt:** hình khối theo **D**, ánh sáng theo **B + G**, nông trại theo **G**. Lần một đề xuất B
làm mốc chính; D gần model đang dùng hơn nên thay — anh chốt 29/09.

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
   quân sự · công cộng) **chỉ một tay vẽ**; tay thứ hai chỉ dùng cho cây, đá, người. Anh chốt 29/09.
2. **Độ sáng:** cảnh thành phố có độ sáng TB **≥ 0,36** (game thật thấp nhất mục 7: Forge of Empires).
   **Đích: ô 4C — sáng 0,52 · ấm 0,26**, đo ở khung bảng đèn (mục 5). Anh giao Claude tự chọn 29/09.
3. **Bão hoà:** cảnh thành phố **≥ 0,37** (cảnh thành phố nhạt nhất trong mốc: D đầu game).
   **Luật 2–3 chỉ đo ảnh BAN NGÀY** (anh chốt 05/10, bước 2 ngày/đêm): đêm cố ý tối. Khung đo thêm `&gio=12`
   hoặc `&tat=dem`; hai ảnh này phải ra cùng số (đo 05/10: 0,48 · 0,56 · 0,32 cả hai).
4. **Màu nhận diện mỗi đời:** nền một tông, **mái một màu riêng** mà đời kề không dùng — như
   mốc A. **Một chủ đề mỗi đời, không trộn** — như Forge of Empires (mục 7). Cả sáu đời anh chốt
   29/09 (đời 3–6 lấy từ game thật):

   | Đời | Theo mốc | Nền | Mái / điểm nhấn |
   |---|---|---|---|
   | 1 Cổ đại | D đầu game · B Á Đông | cỏ tươi, đất nắng (`#95b372` `#e7be7b`) | lều vải, rơm, gỗ mộc (`#aa8d53`) |
   | 2 Trung cổ | A Trung Hoa, Nhật · D cấp 55 | đất, đường lát (`#d9b98f` `#9b7a4f`) | mái sẫm (`#3c484b`), đỏ son (`#70321b`), tháp đá có cờ |
   | 3 Súng ống | AoE III · Anno 1701 (mục 7) | cỏ xanh đậm, cát bờ biển (`#8a983d` `#d8c49b`), biển ngọc (`#6d99a9`) | pháo đài sao tường trắng xám, mái nâu, tàu buồm, hàng rào gỗ |
   | 4 Công nghiệp | F · Anno 1800 | đất mỏ, bãi gỗ (`#ecbd7b` `#816448`) | gạch đỏ (`#874c30`), máy hơi nước đỏ, ống khói, đường ray — có bồ hóng nhưng **không tối, không bẩn** |
   | 5 Hiện đại | F một phần · Forge of Empires đời Modern | — | bê tông, kính xanh, kiểu Mỹ thập niên 50 (Forge of Empires) — **thiếu số đo** |
   | 6 Tương lai | Forge of Empires đời Tomorrow, Future · Anno 2070 phe Eco | trắng kem (`#b7ad96`) | kính xanh ngọc, **cây phủ mái**, vòm trắng — tương lai "xanh sạch", không gỉ khói |

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

10. **Bậc nhà và bước xây** (C, D) — anh chốt 29/09: nhà mới đi qua móng → giàn giáo → xong; bậc
    cao thì to hơn, đổi vật liệu. Gói Ultimate Fantasy RTS (Quaternius, CC0) có sẵn mỗi nhà ba bậc
    `Level1–3`.
11. **Nền lót** (B, D, F, G đều có) — anh chốt 29/09: mỗi công trình, mỗi luống ruộng đứng trên một
    khoảnh đất/cát sáng hơn cỏ, nhìn là biết đâu là đất đã xây. Nhà đang nướng rời, không đế
    (`NGUON_MO.md`) → nền lót là ô nền riêng, không nướng dính vào nhà.
12. **Đọc được ở zoom xa** (Civilization VI, mục 7): người chơi ngắm cả thành phố từ xa → ở zoom nhỏ
    nhất phải nhận ra đời, loại nhà bằng **màu mái và bóng dáng**, không cần chi tiết.

13. **Bản đồ tỉnh và trận theo E** — anh chốt 29/09: bản đồ nền giấy nét mực, nhạt màu, tách hẳn khỏi
    thành phố; mỗi phe một khối màu, số quân trên nhãn. Civilization VI làm đúng kiểu này cho vùng
    chưa khám phá (mục 7). Luật 3 (bão hoà) không áp cho bản đồ.

## 4. Gói thay đề xuất cho đời 1–2 — cùng một tay vẽ Quaternius, CC0

Dò bằng `node /home/user/kho-game/cong-cu/do.mjs farm --nguon quaternius` (29/09):

| Gói | Có gì |
|---|---|
| `farmbuildings` | 13 model: Barn, BigBarn, ChickenCoop, Fence, OpenBarn, Silo, SmallBarn, Windmill, Well, WaterTower… |
| `farmanimal` | 7 con: Cow, Horse, Llama, Pig, Pug, Sheep, Zebra — **không có gà, dê** |
| `ultimatecrops` | 17 loại cây (Wheat, Rice, Corn, Pumpkin…) × 4 giai đoạn lớn + bản đã gặt — không có nho |
| `ultimatefantasyrts` | Houses, Farm, Market, Temple, Barracks, TownCenter… theo `FirstAge`/`SecondAge` × `Level1–3`; có `Farm_Dirt_Level1–3` làm luống |
| `cutemonsters` | Có một con `Chicken` — kiểu hoạt hình, **phải nướng thử mới biết có hợp không** |

**Lấy ở đâu (05/10):** cả năm gói trên mặc định tải từ Google Drive — 05/10 Drive báo hết hạn mức mọi file. Đường thay:
`farmbuildings` = itch `quaternius/lowpoly-farm-buildings` · `farmanimal` = itch `quaternius/lowpoly-animated-animals` (**game đã
dùng** cho lợn, cừu) · cây = OpenGameArt `lowpoly-crops-pack` (bản 01/2020 của `ultimatecrops`). `ultimatefantasyrts`,
`ultimateanimatedanimals`, `cutemonsters` chỉ có trên Drive. Chi tiết: `docs/NHAT_KY/ART_BIBLE_B2_05_10.md`.

## 5. Thứ tự làm — mỗi bước một bảng, anh chọn một lần

1. **Bảng đèn — xong 29/09, chọn ô 4C.** 20 ô = 5 mức sáng (hiện tại 0,28 ·
   0,36 · 0,44 · 0,52 · 0,60) × 4 mức ấm (0,13 mát như D · 0,19 giữ như hiện tại · 0,26 như A, F ·
   0,34 như B, G). Mã ô: hàng 1–5, cột A–D (1B = hiện tại). **Xem trước bằng chỉnh ảnh chụp, chưa
   nướng lại:** nhân lượng sáng (`exposure` của ffmpeg — giữ bóng đậm; cách `gamma` làm hình mờ như
   sương, đã thử và bỏ) + ấm ở vùng sáng, bóng hơi xanh (`colorbalance`). Khung đo: `AN_SU_KIEN=1
   DIA_CHI=http://127.0.0.1:4173/quoc-chien/ node scripts/chup_man.mjs "?me=co_dai&zoom=0.6" <tên>.png`,
   cắt `1100:460:450:240` (hiện tại đo ra sáng 0,28 · ấm 0,19).
   **Vì sao 4C:** 0,52 nằm giữa dải mốc (0,36–0,66), hàng 5 (0,60) đã cháy sáng mái vàng. Ấm 0,26 nằm giữa
   D (0,13–0,20, mốc hình khối) và B, G (0,34–0,35, mốc ánh sáng); cột D ấm quá làm cỏ ngả vàng, và cả
   sáu đời dùng chung một đèn — thử 4C lên đời tương lai: sáng 0,55 · ấm −0,11, trắng sạch, không ngả cam
   (hiện tại 0,29 · −0,03). Ô 4C trên ảnh = `exposure` +1,01 EV + `colorbalance` −0,044.
   **Đèn thật chỉnh 30/09, nướng lại 5 mẻ thành phố** (`tools/lib/trang_nuong.js`): độ phơi ×2,0 nhân đều đèn
   chính và đèn nền · vùng sáng bớt ngả ấm `(1.08, 1.02, 0.90)` → `(1.03, 1.00, 0.96)` · cân trắng cuối `(0.92, 1.0, 1.08)` ·
   bão hoà giữ 1,30. Đo trên khung trên, cũ → mới (sáng · bão hoà · ấm): cổ đại 0,28 · 0,52 · 0,19 → **0,52 · 0,47 · 0,28** ·
   trung cổ 2 0,28 · 0,39 · 0,13 → 0,53 · 0,37 · 0,18 · cận đại 0,23 · 0,43 · 0,11 → 0,44 · 0,41 · 0,16 · hiện đại
   0,31 · 0,28 · 0,05 → 0,59 · 0,30 · 0,08 · tương lai 0,29 · 0,36 · −0,03 → 0,55 · 0,35 · −0,07. Luật 2 đạt cả 5 đời;
   luật 3 còn trượt hiện đại, tương lai (bước 3). Đổi màu đèn chính gần như không kéo được độ ấm; hạ bão hoà xuống
   1,15 thì kéo được nhưng trung cổ 2 tụt 0,35 — 14 mức đã thử: `docs/NHAT_KY/DEN_30_09.md`.
2. **Bảng nông trại theo G:** bản hiện tại cạnh bản Quaternius (mục 4).
3. Nướng lại mẻ cổ đại theo luật 1–12; rồi cận đại (7 tay vẽ), hiện đại (bão hoà 0,28).

## 6. Đo lại

```bash
apt-get update && apt-get install -y ffmpeg          # máy ảo không có sẵn
node tools/do_hinh.mjs mau anh_chup/<ảnh>.png 1748:370:0:80   # rộng:cao:x:y, bỏ hộp thoại
node tools/do_hinh.mjs tay-ve [mẻ ...]
```

Ảnh game: `npm run build`, `npx vite preview`, rồi
`DIA_CHI=http://127.0.0.1:4173/quoc-chien/ node scripts/chup_man.mjs "?me=co_dai" <tên>.png`.

## 7. Học từ game thật (tra 29/09)

Ảnh: bìa video gameplay trên YouTube (`i.ytimg.com/vi/<mã>/maxresdefault.jpg` — máy ảo mở được),
có thể đã được chỉnh màu; **không lên repo**. Chữ: wiki, phỏng vấn — nguồn cuối mục.

| Game | Học gì | Sáng · bão hoà (ảnh bìa) |
|---|---|---|
| **Forge of Empires** — thành phố isometric đi qua hơn 20 đời | Mọi đời **cùng camera, cùng đèn, cùng mức chi tiết** — vẫn là một thành phố. Mỗi đời một chủ đề rõ: Modern theo Mỹ thập niên 50, Contemporary theo Đông Á. Mái đổi theo đời: rơm → ngói cam → đá xám → gạch đỏ → kính → vòm trắng phủ cây | 0,37 · 0,42 (ảnh ghép mọi đời, `1VjuYQpe3hI`) · 0,36 · 0,43 (đời Tomorrow, `SQFHLchfwuo`) |
| **Rise of Nations** | Nhà đổi hình theo đời **chỉ hai lần** (thời thuốc súng, thời công nghiệp), cộng kiểu kiến trúc theo nước. Thiếu chỗ atlas thì đổi **mái và màu** trước, đổi model sau | — |
| **DomiNations** | Lên đời = nâng cấp nhà trung tâm; nhà đổi hình theo đời và theo nền văn minh | — |
| **Civilization VI** | Art director Brian Busatti xem ảnh chụp của người chơi → họ ngắm thế giới **từ xa** → phong cách phải đẹp cả xa lẫn gần (luật 12). Vùng chưa khám phá vẽ như bản đồ giấy cổ, nét mực | — |
| **Anno 1800** | Công nghiệp có bồ hóng thế kỷ 19 nhưng **không quá tối, không bẩn** — giữ cảm giác thích thú khi ngắm thành phố mình xây | — |
| **Anno 2070** | Tương lai hai giọng: phe Eco sạch, cong, xanh; phe Tycoon gỉ và khói. Đời 6 lấy **chủ đề** Eco, còn độ bão hoà theo Forge of Empires — ảnh Anno 2070 mờ sương, dưới luật 3 | 0,43 · 0,23 (`U-blbw587dc`) |
| **Age of Empires III DE** | Đời 3: thuộc địa ven biển, pháo đài, tàu buồm, cỏ xanh đậm | 0,50 · 0,44 (`m4Gdyt6VfHg`) |
| **Anno 1701** | Đời 3: đảo nhiệt đới, bãi cát, biển ngọc, nhà gỗ mái nâu | 0,39 · 0,78 (`JMEPiy-Hc0s`, ảnh nhỏ 480 px) |
| **Kingdoms and Castles** | Low-poly gần mốc D: mái đỏ cam nổi trên nền cỏ, ruộng vàng thành ô | — |

**Rút ra:**
- **Game thật tối hơn quảng cáo:** Forge of Empires 0,36–0,37, Anno 1701 0,39 — dưới mức 0,40 đo từ
  quảng cáo. Luật 2 hạ xuống 0,36. Game cổ đại (0,28) vẫn tối hơn **mọi** game đã đo.
- **Không game nào đổi phong cách giữa các đời** — chỉ đổi chủ đề, vật liệu, màu mái.

Nguồn chữ: [Forge of Empires — Modern Era](https://forgeofempires.fandom.com/wiki/Modern_Era) ·
[Contemporary Era](https://forgeofempires.fandom.com/wiki/Contemporary_Era) ·
[Rise of Nations — Building Styles](https://riseofnations.fandom.com/wiki/Building_Styles) ·
[DomiNations — Ages](https://dominations.fandom.com/wiki/Ages) ·
[Civilization VI — Digital Trends](https://www.digitaltrends.com/gaming/art-civilization-vi/) ·
[Anno 1800 — Ubisoft News](https://news.ubisoft.com/en-us/article/69SwK8nqv5rDUdEzqbNt6h/create-the-unknown-how-anno-1800-put-a-creative-spin-on-the-industrial-revolution) ·
[Anno 2070 — Factions](https://anno2070.fandom.com/wiki/Factions)

Lấy ảnh bìa để đo lại: `curl -s -A Mozilla/5.0 "https://www.youtube.com/results?search_query=<từ khoá>"`,
nhặt `"videoId":"…"`, tải `https://i.ytimg.com/vi/<mã>/maxresdefault.jpg`, rồi `node tools/do_hinh.mjs mau`.
