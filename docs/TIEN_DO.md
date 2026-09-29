# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, **không cộng dồn** — việc đã
> làm ghi vào `docs/NHAT_KY/`, không ghi thêm vào đây. Trần cỡ file có thước (`check:token`,
> `.claude/doc_dau_phien.txt`): dồn lịch sử vào là đỏ.
> Lịch sử trước 29/09: `docs/NHAT_KY/TIEN_DO_TRUOC_29_09.md` · nợ chưa chặn: `docs/NO_KY_THUAT.md`
> · khoá, host mạng, quyết định về môi trường: `docs/MOI_TRUONG.md`.

Cập nhật: 29/09/2026 (lần 24 — art bible bản nháp, **không chạm mã game**).

## 1. Đang ở đâu

- **Game: Phase 12D xong phần máy (khối 1–4).** Lên đời là màn phủ kín, thành phố đổi dần như
  làn sóng; nền, đường, người, ruộng/trại đổi theo từng đời. Anh đo iPhone 28/09: **59 fps**, cả
  lúc làn sóng. Chi tiết: `docs/NHAT_KY/PHASE_12D.md`.
- **29/09 anh xem bảng ruộng/trại: "nhìn vẫn gượng gạo quá"** — tạm dừng 12D. Cùng ngày anh gửi 5 clip
  game xây thành, gõ "ok art bible" → **`docs/ART_BIBLE.md` bản nháp** (lần 24), chờ anh chốt (mục 3).
  Chi tiết: `docs/NHAT_KY/ART_BIBLE_29_09.md`.
- 11B (27/09): chơi trọn một vòng, 59 fps mọi màn kể cả 500×.
- **Pages chạy đúng bản mới trên iPhone** — anh xác nhận 29/09 (bản `29/09 11:32`, mở lại vẫn đúng).
  Cho anh xem: link Pages sau khi đẩy `main` (`docs/DAU_PHIEN.md` mục G).
- Phiên 29/09 (lần 23): rà soát toàn bộ đồ nghề, sửa hook/công cụ, cắt file này từ 91.599 byte;
  anh duyệt, 6 việc file khoá đã sửa cùng phiên. Chi tiết: `docs/NHAT_KY/RA_SOAT_29_09.md`.
- 29/09 (phiên ở kho-game): tải asset gọi một cửa kho-game; tự vẽ bằng số phải khai `docs/TU_LAM.md`
  (`check:credits` giữ). Chi tiết: `docs/NHAT_KY/KHO_GAME_29_09.md`.

## 2. Số đo mới nhất

**Phase 12D, đo 28/09:** 4 mẻ nướng lại, mỗi mẻ 2× **76 sprite · 2 trang** (trang 0: `co_dai` 88,7 % · `can_dai`
83,2 % · `hien_dai` 77,3 % · `tuong_lai` 65,7 %), ~2,5 phút mỗi mẻ. Làn sóng: giữ 2 + 2 trang = 4 (trần), **1 lệnh vẽ**,
máy ảo ~30 fps (phần mềm, không phải số iPhone). `DoiTheoDoi`: 0 ô nền / 0 dáng người y nguyên ở 4 cặp đời khác mẻ.

**Phase 12A, đo 27/09:** `sim:congnghe -- 320 6`: đời 5 giờ 147, **đời 6 giờ 249**, 48/48 công nghệ,
451 nhà ở giờ 320. `sim:van`: khoa học **3/5** (trước 5/5, thắng ở giờ 265 thay vì 190), thống trị 2/5,
văn hoá / ngoại giao / bỏ mặc 5/5 — ĐẠT. Mẻ `tuong_lai_2x`: 76 sprite, 2 trang (trang 0 đầy 65,7 %).

**Phase 11B, đo 27/09:** Chromium máy ảo 393 px, 500×: **~7,5 s thật mỗi giờ game** (lý thuyết 7,2 s);
chạy lâu cùng lúc `npm run do` thì tụt còn ~22 s/giờ (máy ảo vẽ bằng phần mềm — không phải số iPhone).
Hàng 9 nút tốc độ trên màn 393 px: rộng 314 px, mép trái 69 px (trước khi thu nhỏ: 415 px, lọt −31 px).
`sim:van` sau khi tách `TheGioi`: y nguyên (thống trị 2/5, ba kiểu kia 5/5, bỏ mặc thua 5/5).

**Phase 11A, đo 26/09 tối:** `sim:van` — vết thành phố thật 300 giờ mất **389 s** (lưu
`.cache/sim_van/`, lần sau đọc lại); mỗi ván thế giới **0,01–0,13 s**. Giờ thắng ở hạt giống
gốc: ngoại giao **72** · văn hoá **167** · thống trị **171** · khoa học **190**; bỏ mặc sụp đổ
giờ **111**. Đúng kiểu trên 5 hạt giống: thống trị 2/5, ba kiểu kia 5/5, bỏ mặc thua 5/5.
Thành phố (không đổi): đời 5 ở giờ ~150, 449 nhà ở giờ 300.

**Phase 10B, đo 26/09 trưa:** atlas `linh_sung` 412 sprite — 1× 20,1 %; 2× **một trang 76,0 %**
(GPU 16,8 MB). Trước khi cắt khung: 524 sprite, 2× hai trang, anh đo **30 fps** suốt trận. Màn trận súng chụp máy ảo: **322 sprite ·
1 lệnh vẽ**. Trận mẫu súng 48,5 giây, 54 lính mỗi bên. Nướng `linh_sung` cả hai cỡ ~7 phút.

**Phase 10A, đo 25/09:** atlas `linh_co` 260 sprite — 2× lấp **68,6 %** một trang, 1× 17,9 %
(`node tools/nuong_sprite.mjs linh_co` in lại). Màn trận chụp trong máy ảo: **344 sprite ·
1 lệnh vẽ**. `kiem:cheo` HEAD: **402/402 test**, `sim:tran` lệch 2,24 · 85,2 % trong khung ·
Brier 0,075. Nướng mẻ lính mất ~2 phút 15 giây mỗi cỡ.

**Atlas, đo 19/09 (Phase 8C):** thêm hai khung cối xay vào mỗi mẻ. `trung_co_2` 2× từ
84,4 % **một** trang lên **hai** trang (85,8 % + 4,5 %, GPU 33,6 MB / trần 67,1 MB);
`hien_dai` 2× lấp **77,3 %** một trang thật + một trang **rỗng 1×1** đệm cho khớp số
trang. Cả hai 1× vẫn một trang. **Đừng chép số này đi đâu** —
`node tools/nuong_sprite.mjs <mẻ> 2` in lại.

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

### ✅ Việc 29/09 (lần 24) — art bible chốt hết, bảng đèn chọn ô 4C

Anh giao Claude tự chọn ô: **4C — sáng 0,52 · ấm 0,26** (lý do: `docs/ART_BIBLE.md` mục 5). Không còn việc chờ anh.
Phiên sau có ảnh game thật sau khi chỉnh đèn thì anh xem, nhắn "ok" hoặc chỗ chưa ưng.

## 4. Nợ đang chặn phase kế tiếp

- **Ruộng/trại "gượng gạo"** (anh báo 29/09) — gốc đo được: mẻ cổ đại ghép **6 tay vẽ**, cận đại 7; cảnh
  tối hơn mọi mốc (`docs/ART_BIBLE.md` mục 2). Sửa theo art bible mục 5 — anh đã chốt 29/09.
- **12E chưa làm:** đời 3–4 chung mẻ `can_dai`; mọi công trình phải đổi khi lên đời (kế hoạch
  `docs/ke-hoach/2026-09-28-phase-12d-len-doi-ro-rang.md` mục 5–6).
- Danh sách đủ (24–28/09, nguyên văn): `docs/NO_KY_THUAT.md` mục "Chuyển từ TIEN_DO.md mục 4".

## 5. Phiên sau — bảng đèn (art bible mục 5)

**Anh chốt art bible 29/09 ("ok làm hết").** Đừng tự mở 12E. Phiên sau làm đúng `docs/ART_BIBLE.md` mục 5, mỗi bước
một bảng cho anh chọn một lần: (1) chỉnh đèn máy nướng tới khi ảnh game đo ra **sáng 0,52 · ấm 0,26** (ô 4C, art bible mục 5) — ảnh 4C chỉ là chỉnh
ảnh, đèn thật phải nướng lại cả mẻ rồi đo, (2) bảng nông trại Quaternius cạnh bản hiện
tại, (3) nướng lại mẻ cổ đại ≤ 2 tay vẽ — tính chỗ atlas trước. Đo bằng `node tools/do_hinh.mjs` (cần ffmpeg).

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
