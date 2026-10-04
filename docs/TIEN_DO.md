# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, **không cộng dồn** — việc đã
> làm ghi vào `docs/NHAT_KY/`, không ghi thêm vào đây. Trần cỡ file có thước (`check:token`,
> `.claude/doc_dau_phien.txt`): dồn lịch sử vào là đỏ.
> Lịch sử trước 29/09: `docs/NHAT_KY/TIEN_DO_TRUOC_29_09.md` · nợ chưa chặn: `docs/NO_KY_THUAT.md`
> · khoá, host mạng, quyết định về môi trường: `docs/MOI_TRUONG.md`.

Cập nhật: 04/10/2026 (lần 34 — nhận ra game từ ảnh anh gửi).

## 1. Đang ở đâu

- **04/10 (lần 34): nhận ra game từ ảnh** — Kỷ Nguyên Băng Hà: 3Q, chỉ có trên điện thoại, không chơi thử được. Video lối chơi
  thật không có lúa lớn dần, không có thời kỳ; clip quảng cáo không khớp game. Anh chọn cách 2 → Claude chơi thật 2 game web
  cùng kiểu: Medieval Farms (cây lớn 5 hình, phá rừng mở đất), Castle Builders (thợ xây từng viên, giàn giáo). Không đổi game.
  `docs/NHAT_KY/NHAN_GAME_TU_ANH_04_10.md`.
- **04/10 (lần 33): cài Playwright MCP** (anh chọn B) — Claude tự chơi thử game/app web. Không đổi game. Thử 4 game nhập vai: chạy
  cả Unity 3D (4 khung/s). Chi tiết: `docs/NHAT_KY/TRINH_DUYET_04_10.md` · cách dùng: `docs/MOI_TRUONG.md` mục cuối.
- **04/10 (lần 32): sửa 3 lỗi trận luật bất biến đo ra 03/10** — đi hàng lệch lúc chạm địch (TR14) · AI xin hoà không bao giờ được
  nhận (TG14, `ti_le_xin_hoa` 0,9) · % thắng báo trước lệch tới 97,7 điểm → nay chạy thật 32 trận, lệch lớn nhất 5,5 (TR15).
  Đã đẩy `main`. **Anh chưa chơi thử** (mục 3). Chi tiết: `docs/NHAT_KY/SUA_3_LOI_TRAN_04_10.md`.
- **04/10 (lần 31): gộp 2 bản sửa đổi nhịp (lựa chọn B)** — người vác ra ngoài bản đồ, kho riêng phình mãi. `gioNoDu` 3 → 2,
  4 Eureka mốc kho → mốc số nhà. Đời 6 về giờ 260 · 272 · 263. Chi tiết: `docs/NHAT_KY/CAN_BANG_04_10.md`.
- **03/10 (lần 30): luật bất biến** — điều "game không bao giờ được phá" (`docs/LUAT_BAT_BIEN.md`), máy kiểm qua nhiều hạt
  giống. Chi tiết: `docs/NHAT_KY/LUAT_BAT_BIEN_03_10.md`.
- **30/09 (lần 26–28): Thử 1–3 hiệu ứng xong**, anh đo iPhone 59 fps cả ba, "mọi thứ ok". Chi tiết: `docs/NHAT_KY/THU_{1,2,3}_30_09.md`.
- **30/09: art bible mục 5 bước 1 (đèn)** xong phần máy, anh chưa xem máy thật. Chi tiết: `docs/NHAT_KY/DEN_30_09.md`.
- **Game: Phase 12D xong**, anh đo iPhone 28/09: 59 fps. 12E chưa mở — anh dặn làm art bible trước. `docs/NHAT_KY/PHASE_12D.md`.
- 29/09: anh báo ruộng/trại "gượng gạo" → **`docs/ART_BIBLE.md`**, anh chốt hết. `docs/NHAT_KY/ART_BIBLE_29_09.md`.
- **Pages chạy đúng bản mới trên iPhone** (anh xác nhận 29/09). Cho anh xem: link Pages sau khi đẩy `main` (`docs/DAU_PHIEN.md` mục G).
- Rà soát đồ nghề 29/09: `docs/NHAT_KY/RA_SOAT_29_09.md` · tải asset một cửa kho-game: `docs/NHAT_KY/KHO_GAME_29_09.md`.

## 2. Số đo mới nhất

**Sửa 3 lỗi trận, đo 04/10 (máy ảo):** 150 cặp đội hình × 200 trận — lệch |% báo − thắng thật| lớn nhất 97,7 → 5,5 điểm ·
`sim:tran` lệch TB 2,24 → 0,84, Brier 0,075 → 0,009 · `sim:van` (5 hạt) thống trị 3/5 · khoa học 2/5 → **5/5** · văn hoá 5/5 ·
ngoại giao 4/5 → 5/5 · một giờ thế giới max 3,6 → **25 ms** (7/3.913 giờ > 16 ms) · trận 10v10 0,75 → 0,45 ms · `npm test` 19,9 s ·
`luat:sau` 301 s · test 606. Bảng đủ: nhật ký lần 32.

**Cân bằng, đo 04/10** (`sim:congnghe -- 320 6`, bản đồ gốc · 777 · 4242): đời 6 giờ **260 · 272 · 263** · nhà giờ 320:
436 · 426 · 436 · kho 6 · Eureka 19 · 17 · 19 · đỉnh người vác 231–271. Bảng đủ: `docs/NHAT_KY/CAN_BANG_04_10.md`.

**Thử 1–3, đo 30/09 (393×852):** 2–3 lệnh vẽ có hiệu ứng, 1 khi `?tat=het`. **Đèn 30/09:** số cũ → mới ở `docs/ART_BIBLE.md`
mục 5 (**đừng chép về đây**). **12D, 28/09:** mỗi mẻ 2× 76 sprite · 2 trang; giữ 2 + 2 trang = 4 (trần), 1 lệnh vẽ.

**Mẻ trung cổ 2× coi như HẾT CHỖ.** Đo 19/09: tổng diện tích sprite 90,2 % một trang, mà
84,4 % là mức cuối còn xếp vừa — thêm **một** sprite cỡ căn nhà là tràn trang. Mẻ mới hay
sprite mới thì tính trước chỗ, đừng nướng rồi mới xem.

### Trần sprite trên iPhone thật (11/09, atlas thật 2×)

**18.089 sprite ở ≥58 fps** · 24.000 ở 50 fps — và 24.000 là **hết sức chứa công cụ đo**,
không phải hết sức máy.

**18.089 không phải trần máy, nó là một bậc của thang đo** (thang nhảy 1,35× từ 200).
Phase 0 ra đúng số này vì cùng thang — cả dự án hiểu nhầm là trần máy suốt năm phase.
`TECH_SPEC` từng ước atlas thật 2× "còn ~4.500 sprite": **sai, thấp hơn thực tế ít nhất
bốn lần**. Trần 5.000 của dự án **dư ít nhất 3,6 lần**.


## 3. Việc của chủ dự án

### ⏳ Việc 04/10 (lần 31 + 32) — anh chơi thử bản mới

Link Pages: https://gc1001vn-svg.github.io/quoc-chien/ (nhãn cạnh số fps ghi ngày giờ bản). Đổi ở nhịp và trận, không đổi hình:
thành phố thêm nhà dân dày hơn, không xây kho mới; % thắng trên nút Tấn công nay là số thật (có thể ra 0 % khi thua chắc);
nước AI yếu hơn chút có thể tự xin hoà. Anh báo: fps, nhịp lên đời ổn không, có giật lúc giờ trôi nhanh không.

### ⏳ Việc 30/09 (lần 29) — anh chọn trên bảng nông trại (art bible bước 2)

Bảng: hình nông trại hiện tại (trái) cạnh bản Quaternius một tay vẽ (phải). Anh trả lời: dùng bản Quaternius cho ruộng, trại lợn,
trại cừu? Gà thì sao (gà Quaternius ra cục, không đọc ra gà)? Chi tiết: `docs/NHAT_KY/ART_BIBLE_B2_30_09.md`. **Anh tạm dừng 30/09** — chưa chọn. Gà Quaternius chỉ ở Poly Pizza
(máy ảo bị chặn): anh tải `https://poly.pizza/m/ineV9pU5VL` + `https://poly.pizza/m/LH96IMq0rE` bằng máy thật (GLB), hoặc bỏ qua.

### ⏳ Việc 04/10 (lần 34) — anh có muốn thêm lúa lớn dần, xây từng bước vào Quốc Chiến không

Hai thứ anh khen ở quảng cáo Kỷ Nguyên Băng Hà mà Quốc Chiến chưa có (lên thời kỳ thì đã có từ 12D). Mẫu đã chơi thật,
ảnh đã gửi: Medieval Farms (lúa) · Castle Builders (xây). Anh trả lời có/không; có thì phiên sau lập kế hoạch, tính chỗ
atlas trước (mẻ cổ đại gần hết chỗ, mục 2).

### ⏳ Thành phố còn cần kho mới không — anh bảo "để sau" (04/10)

Thẻ khẩn "Đường đông nghịt" và luật thống đốc xây kho không bao giờ chạm nữa (`docs/NO_KY_THUAT.md` mục "Luật bất biến").

### ✅ Đã xong: 2 lỗi đổi nhịp anh chọn B (04/10) · Thử 3 "Fps vẫn 59. Mọi thứ ok" (30/09) · 3 lỗi trận anh duyệt (04/10)

Anh nhắn 30/09: "Làm bước 1 thôi. Hai bức kia để đấy" — **12E và hậu kỳ màn trận để đấy, đừng đề xuất lại** tới khi anh mở.

## 4. Nợ đang chặn phase kế tiếp

- **Thẻ khẩn "Đường đông nghịt" và luật thống đốc xây kho không bao giờ chạm nữa** — chờ anh (mục 3).
- **Một giờ thế giới chậm nhất 25 ms trên máy ảo** (trước 3,6 ms) — giá của % thắng chạy thật; anh báo giật thì cắt
  (`docs/NO_KY_THUAT.md` mục "Luật bất biến"). Hết giờ mà hai bên bằng phần máu: chưa luật nào kiểm.
- **Ruộng/trại "gượng gạo"** (anh báo 29/09) — gốc đo được: mẻ cổ đại ghép **6 tay vẽ**, cận đại 7
  (`docs/ART_BIBLE.md` mục 2). Độ tối đã sửa 30/09; tay vẽ còn — art bible mục 5 bước 2, 3.
- **Luật 3 (bão hoà ≥ 0,37) còn trượt:** hiện đại 0,30, tương lai 0,35 — art bible mục 5 bước 3.
- **Mẻ lính `linh_co`, `linh_sung` và bản đồ `hex_1` còn đèn cũ** — màn trận, bản đồ dùng atlas riêng nên không lệch
  trong cùng một màn; gói lính nằm ở kho `tayvuc`.
- **12E chưa làm:** đời 3–4 chung mẻ `can_dai`; mọi công trình phải đổi khi lên đời (kế hoạch
  `docs/ke-hoach/2026-09-28-phase-12d-len-doi-ro-rang.md` mục 5–6).
- Danh sách đủ (24–28/09, nguyên văn): `docs/NO_KY_THUAT.md` mục "Chuyển từ TIEN_DO.md mục 4".

## 5. Phiên sau

**Anh gửi ảnh game nữa thì làm như lần 34:** nhận ra (nhìn ảnh + `WebSearch`) → có bản web thì chơi bằng `browser_*` (hiện ở phiên
mới, kiểm 04/10) → không có thì xem video YouTube qua Gemini, gửi bảng ảnh + ghi chú.

**PHIÊN SAU: chờ anh chơi thử bản 04/10 (mục 3).** Chưa có việc máy nào đang dở. Anh mở lại art bible thì làm bảng 2 (dưới).

**Art bible bước 2: bảng 1 đã gửi, anh tạm dừng 30/09, chưa chọn (mục 3).** Mở lại thì làm bảng 2 trước: luống `Farm_Dirt` Quaternius · luống hoạ tiết `farm_soil` · trại bò/lừa (`ultimateanimatedanimals`) · gà Quaternius nếu anh gửi file. Anh chọn xong → bước 3: kế hoạch nướng lại mẻ `co_dai` (hệ số cỡ ở nhật ký), anh duyệt rồi mới nướng. Tụt fps về sau: bớt
`batOn.nguoiMoiDam`, `batOn.lua` trước; giật lúc giờ trôi: bớt `so_tran_dung_som` (`data/battle.json`).

**Art bible bước 2–3** — anh chê 30/09: "các công trình vẫn nhìn rất là chán" (màu thì ổn hơn). **Anh đã mở 30/09** — không cần hỏi lại; gốc đã đo là mẻ ghép 6–7 tay vẽ (art bible mục 2). Đừng tự mở 12E. Bước 2: bảng nông trại Quaternius (art bible mục 4) cạnh bản hiện tại, một bảng anh chọn một lần.
Bước 3: nướng lại mẻ cổ đại ≤ 2 tay vẽ — tính chỗ atlas trước. Đo bằng `node tools/do_hinh.mjs` (cần ffmpeg).
Nướng thì tải asset theo `docs/DAU_PHIEN.md` mục B (cả dòng lấy model Icosa theo mã).

Nếu anh bảo tiếp 12E:

1. Bước E: khối 4 anh chưa chốt (mục 3).
2. 12E theo kế hoạch `docs/ke-hoach/2026-09-28-phase-12d-len-doi-ro-rang.md` mục 5–6: mẻ riêng đời 4 "Công nghiệp"
   (bỏ `CHUNG_ME_CHO_12E` trong `tests/DoiTheoDoi.test.ts`), rồi lấp mỏ, lò, cối xay, đồ vật; thước "không sprite công
   trình nào y nguyên giữa hai đời kề".
3. Rồi Phase 13.

### Nhắc trước khi nướng thêm mẻ

Mẻ mới **phải nướng ra cùng số trang atlas, cùng `o_px`, cùng `heSo`** với mẻ đang chạy,
không thì `DoiMeAtlas` ném lỗi chứ không vẽ bậy — `tests/BanDo.test.ts` bắt trước ở máy.
Mẻ trung cổ 2× đã hết chỗ (mục 2). Muốn công trình khác động: nướng `<tên>_k0` `_k1`
`_k2`, `VeCanh` tự chọn khung.

**Mở phiên mới rồi hãy bắt đầu** — mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G ở kho, không bỏ bước nào.
