# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, **không cộng dồn** — việc đã
> làm ghi vào `docs/NHAT_KY/`, không ghi thêm vào đây. Trần cỡ file có thước (`check:token`,
> `.claude/doc_dau_phien.txt`): dồn lịch sử vào là đỏ.
> Lịch sử trước 29/09: `docs/NHAT_KY/TIEN_DO_TRUOC_29_09.md` · nợ chưa chặn: `docs/NO_KY_THUAT.md`
> · khoá, host mạng, quyết định về môi trường: `docs/MOI_TRUONG.md`.

Cập nhật: 03/10/2026 (lần 30 — luật bất biến).

## 1. Đang ở đâu

- **03/10 (lần 30): luật bất biến** — 56 luật "game không bao giờ được phá" (`docs/LUAT_BAT_BIEN.md`), máy kiểm qua nhiều hạt
  giống; 53 đã bật. Bắt được 5 lỗi thật + 3 lỗi nằm im: đã sửa và đẩy 4 (thùng kho đè vật, thẻ bất ổn, mua quân, bộ đọc trận),
  **2 lỗi đổi nhịp game: anh chọn B (04/10)** — chỉnh cân bằng trước, đẩy một lần (mục 5). Chi tiết: `docs/NHAT_KY/LUAT_BAT_BIEN_03_10.md`.

- **30/09 (lần 28): Thử 3 xong phần máy** — bất ổn báo trước trong thành phố (khói đen → đám đông + cờ đỏ → lửa), chấm xem trước
  kiểu Reigns trên thẻ quyết định, bảng tách nguồn chính sách; 3 lệnh vẽ; `sim:van`/`sim:tran` y như trước. **Anh chơi thử iPhone: 59 fps, "mọi thứ ok"** (mục 3).
  Đợt 3/3 — **cả 3 đợt thử xong**, kết quả đã ghi `kho-game/docs/KY_NANG_TRANG_THAI.md` mục 8. Chi tiết: `docs/NHAT_KY/THU_3_30_09.md`.
- **30/09 (lần 27): Thử 2 xong phần máy** — màn trận: bụi · tên cắm / khói súng · chớp + tia · cờ trắng + nhạt màu đội vỡ ·
  cờ bên thắng · khựng khung (trần 200 ms); 2 lệnh vẽ; `sim:van`/`sim:tran` y như trước. **Anh đo iPhone: 59 fps** cả 3 link (mục 3).
  Đợt 2/3. Chi tiết: `docs/NHAT_KY/THU_2_30_09.md`.
- **30/09 (lần 26): Thử 1 xong** — hậu kỳ, khói bếp, chim, icon nhà tắc ở màn thành phố; 3 lệnh vẽ;
  `sim:van`/`sim:tran` y như trước. **Anh đo iPhone: 59 fps** cả có lẫn không hiệu ứng, "nhìn ổn hơn bản gốc". Đợt 1/3 của phần thử hiệu ứng
  (`kho-game/docs/KY_NANG_TRANG_THAI.md` mục 8). Chi tiết: `docs/NHAT_KY/THU_1_30_09.md`.
- **30/09: art bible mục 5 bước 1 xong phần máy** — đèn máy nướng sáng lên theo ô 4C anh giao chọn, nướng
  lại 5 mẻ thành phố. Cổ đại đo **sáng 0,52 · ấm 0,28** (ô 4C 0,52 · 0,26; trước 0,28 · 0,19). **Anh chưa xem
  trên máy thật** (mục 3). Chi tiết: `docs/NHAT_KY/DEN_30_09.md`.
- **Game: Phase 12D xong phần máy (khối 1–4)**, anh đo iPhone 28/09: **59 fps**. 12E chưa mở — anh dặn
  làm art bible trước. Chi tiết: `docs/NHAT_KY/PHASE_12D.md`.
- 29/09: anh báo ruộng/trại "nhìn vẫn gượng gạo quá" → **`docs/ART_BIBLE.md`**, anh chốt hết cùng ngày.
  Chi tiết: `docs/NHAT_KY/ART_BIBLE_29_09.md`.
- 11B (27/09): chơi trọn một vòng, 59 fps mọi màn kể cả 500×.
- **Pages chạy đúng bản mới trên iPhone** — anh xác nhận 29/09 (bản `29/09 11:32`, mở lại vẫn đúng).
  Cho anh xem: link Pages sau khi đẩy `main` (`docs/DAU_PHIEN.md` mục G).
- Phiên 29/09 (lần 23): rà soát toàn bộ đồ nghề, sửa hook/công cụ, cắt file này từ 91.599 byte;
  anh duyệt, 6 việc file khoá đã sửa cùng phiên. Chi tiết: `docs/NHAT_KY/RA_SOAT_29_09.md`.
- 29/09 (phiên ở kho-game): tải asset gọi một cửa kho-game; tự vẽ bằng số phải khai `docs/TU_LAM.md`
  (`check:credits` giữ). Chi tiết: `docs/NHAT_KY/KHO_GAME_29_09.md`.

## 2. Số đo mới nhất

**Luật bất biến, đo 03/10 (máy ảo 4 nhân):** test 543 → 599, `npm test` 35,6 → 38,1 s · `npm run luat:sau` 56/56 xanh trong
**564 s** (phần lớn `BatBienThanhPho`) — `do.sh` chỉ gọi khi `src/sim/` hay `data/` khác `main` · hơn 150 lỗi giả, luật nào
cũng có lỗi giả làm nó đỏ.

**Thử 3, đo 30/09 (máy ảo, 393×852 DPR 1):** **3 lệnh vẽ** có hiệu ứng, 1 khi `?tat=het` · test mới 10/10 (`tests/DeChoi.test.ts`) ·
`npm run do` 16/16 · `sim:van`, `sim:tran` khác trước đúng cột giây chạy máy.

**Thử 2, đo 30/09 (máy ảo, 393×852 DPR 1):** **2 lệnh vẽ** có hiệu ứng, 1 khi `?tat=het` · zoom vừa khít trận màn dọc 0,18× ·
`npm run do` xanh · `sim:tran`, `sim:van` khác trước đúng cột giây chạy máy.

**Thử 1, đo 30/09 (máy ảo, 393×852):** **3 lệnh vẽ** có hiệu ứng, 2 khi `?tat=hauky` · 0,35×: 3.313 sprite, tilt tắt ·
máy ảo 5–7 fps cả có lẫn không hiệu ứng (vẽ phần mềm — không phải số iPhone) · test 524/524.

**Đèn, đo 30/09:** độ sáng, bão hoà, độ ấm cũ → mới của cả 5 đời ở `docs/ART_BIBLE.md` mục 5 (**đừng chép
về đây**). Luật 2 (sáng ≥ 0,36) đạt 5/5 đời, trước 0/5. 10 file `.json` atlas y hệt trước — cùng số trang, cùng
chỗ sprite, chỉ ảnh đổi màu.

**Phase 12D, đo 28/09:** 4 mẻ nướng lại, mỗi mẻ 2× **76 sprite · 2 trang** (trang 0: `co_dai` 88,7 % · `can_dai`
83,2 % · `hien_dai` 77,3 % · `tuong_lai` 65,7 %), ~2,5 phút mỗi mẻ. Làn sóng: giữ 2 + 2 trang = 4 (trần), **1 lệnh vẽ**,
máy ảo ~30 fps (phần mềm, không phải số iPhone). `DoiTheoDoi`: 0 ô nền / 0 dáng người y nguyên ở 4 cặp đời khác mẻ.

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

### ✅ Việc 03/10 (lần 30) — 2 lỗi đổi nhịp game: anh chọn **B** (04/10)

Sửa thì đúng thiết kế nhưng game chậm hơn. Giờ lên đời 6, `sim:congnghe -- 320 6`, ba bản đồ (gốc · hạt 777 · hạt 4242):

| | Đời 6 ở giờ | Nhà giờ 320 | Kho | Đỉnh người vác |
|---|---|---|---|---|
| Hiện tại (`main`) | 249 · 261 · 281 | 451 · 445 · 433 | 37–38 | 657–675 |
| + sửa người vác ra ngoài bản đồ | 276 · 285 · 291 | 439 · 433 · 420 | 38 | 655–741 |
| + sửa kho riêng phình mãi | **không tới trong 320 giờ** (đời 5 ở 184 · 205 · 202) | 395 · 377 · 377 | 6 | 142–215 |

`sim:van` (một bản đồ, 5 hạt): thống trị 3/5 → 1/5, ba kiểu kia y nguyên. Mã sửa ở nhánh `claude/gracious-curie-pm0flr`.
**A** đẩy hết rồi phiên sau chỉnh số cân bằng · **B** chỉnh số cân bằng trước, đẩy một lần khi đời 6 về lại ~giờ 250–280 ·
**C** chỉ đẩy sửa người vác (đời 6 vẫn tới), giữ kho riêng. → Anh nhắn 04/10: **"qua phiên mới chọn B"**.

### ✅ Việc 30/09 (lần 28) — anh chơi thử Thử 3 trên iPhone

Bản `30/09 20:08`, anh nhắn nguyên văn: **"Fps vẫn 59. Mọi thứ ok"** → Thử 3 qua.

### ⏳ Việc 30/09 (lần 29) — anh chọn trên bảng nông trại (art bible bước 2)

Bảng: hình nông trại hiện tại (trái) cạnh bản Quaternius một tay vẽ (phải). Anh trả lời: dùng bản Quaternius cho ruộng, trại lợn,
trại cừu? Gà thì sao (gà Quaternius ra cục, không đọc ra gà)? Chi tiết: `docs/NHAT_KY/ART_BIBLE_B2_30_09.md`. **Anh tạm dừng 30/09** — chưa chọn. Gà Quaternius chỉ ở Poly Pizza
(máy ảo bị chặn): anh tải `https://poly.pizza/m/ineV9pU5VL` + `https://poly.pizza/m/LH96IMq0rE` bằng máy thật (GLB), hoặc bỏ qua.

### ✅ Anh chọn bước kế 30/09: art bible bước 2–3

Anh nhắn: "Làm bước 1 thôi. Hai bức kia để đấy" — **12E và hậu kỳ màn trận để đấy, đừng đề xuất lại** tới khi anh mở.

## 4. Nợ đang chặn phase kế tiếp

- **Hai lỗi đổi nhịp game** (luật TP04, TP06, TP14 `(chưa bật)`) — anh chọn B: phiên sau chỉnh cân bằng rồi mới gộp (mục 5). Ba việc luật đo ra mà chưa sửa (trận đi theo
  hàng phụ thuộc thứ tự, AI xin hoà không bao giờ được nhận, % dự đoán lệch): `docs/NO_KY_THUAT.md` mục "Luật bất biến".

- **Ruộng/trại "gượng gạo"** (anh báo 29/09) — gốc đo được: mẻ cổ đại ghép **6 tay vẽ**, cận đại 7
  (`docs/ART_BIBLE.md` mục 2). Độ tối đã sửa 30/09; tay vẽ còn — art bible mục 5 bước 2, 3.
- **Luật 3 (bão hoà ≥ 0,37) còn trượt:** hiện đại 0,30, tương lai 0,35 — art bible mục 5 bước 3.
- **Mẻ lính `linh_co`, `linh_sung` và bản đồ `hex_1` còn đèn cũ** — màn trận, bản đồ dùng atlas riêng nên không lệch
  trong cùng một màn; gói lính nằm ở kho `tayvuc`.
- **12E chưa làm:** đời 3–4 chung mẻ `can_dai`; mọi công trình phải đổi khi lên đời (kế hoạch
  `docs/ke-hoach/2026-09-28-phase-12d-len-doi-ro-rang.md` mục 5–6).
- Danh sách đủ (24–28/09, nguyên văn): `docs/NO_KY_THUAT.md` mục "Chuyển từ TIEN_DO.md mục 4".

## 5. Phiên sau

**PHIÊN SAU: chỉnh cân bằng cho 2 bản sửa đổi nhịp — anh đã chọn B (04/10), không hỏi lại.** `git fetch origin
claude/gracious-curie-pm0flr` rồi gộp vào bản làm (nhánh đã bật sẵn 3 luật), **chưa đẩy `main`**. Chỉnh số `data/` cho đời 6 về
~giờ 250–280 trên cả ba bản đồ của bảng mục 3 (`sim:congnghe -- 320 6`; bản đồ 777, 4242: đổi `hatGiong` trong `thanh_pho_demo.json`
và `hatGiongDatNha` = hạt + 1 trong `walkers.json`, làm ở bản chép), so `sim:van -- --lam-lai` với thống trị 3/5 hiện tại.
Kế hoạch trình anh trước khi đổi số. Xong mới đẩy `main` một lần; nhánh tự xoá sau khi gộp (workflow `Don nhanh`).

**Art bible bước 2: bảng 1 đã gửi, anh tạm dừng 30/09, chưa chọn (mục 3).** Mở lại thì làm bảng 2 trước: luống `Farm_Dirt` Quaternius · luống hoạ tiết `farm_soil` · trại bò/lừa (`ultimateanimatedanimals`) · gà Quaternius nếu anh gửi file. Anh chọn xong → bước 3: kế hoạch nướng lại mẻ `co_dai` (hệ số cỡ ở nhật ký), anh duyệt rồi mới nướng. 12E, hậu kỳ màn trận: anh bảo để đấy. Tụt fps về sau: bớt
`batOn.nguoiMoiDam`, `batOn.lua` trước.

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
