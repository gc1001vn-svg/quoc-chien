# Art bible bước 3 — nướng lại mẻ cổ đại về 3 tay vẽ · 10/10/2026 · ANH CHỌN B 10/10

Việc: mẻ `co_dai` từ **6 tay vẽ** xuống **3**: KayKit (mọi công trình + đồ vật quanh nhà) · Quaternius (nông trại, cây, đá,
người, đồ vật rời) · Google (chỉ gà G1, G2). Nướng luôn lúa 3 bậc để bước "lúa lớn dần" khỏi nướng hai lần.
Xong là khi: `node tools/do_hinh.mjs tay-ve co_dai` ra **3** · không công trình nào trộn KayKit với Quaternius · bảng
trước/sau + ảnh cảnh thành phố gửi anh · khung đo art bible sáng ≥ 0,36, bão hoà ≥ 0,37 · lệnh vẽ vẫn 3 · sim y hệt ·
anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 10/10)
- 76 hình: 21 nền/người · 26 chỉ Quaternius · 14 chỉ KayKit · 9 KayKit + Quaternius · 3 Icosa riêng (nhà bia = đền Hy Lạp,
  lò nung = tháp Sumer, trại lính = đấu trường) · ruộng, trại gà, trại cừu trộn 3 tay.
- Atlas 2×: 87,4 % một trang; trang 2 khai sẵn nhưng rỗng 1×1. Shader đọc tới 4 trang trong **một** lệnh vẽ.
- Drive tải lại được 10/10: Ultimate Fantasy RTS đủ 128 OBJ, màu phẳng. KayKit Hexagon có sẵn: home, market, barracks,
  mine, castle, church, tavern, blacksmith, lumbermill, watermill, windmill, well, archeryrange, tower.

## Phương án
**A:** mọi công trình sang Ultimate Fantasy RTS, 2 tay vẽ. Bảng ảnh 10/10: mộc một màu gỗ, mái tường cùng màu. **Anh bỏ.**
**B (anh chọn 10/10):** giữ nhà KayKit nhiều màu, nới luật 1 lên 3 tay vẽ, gỡ hết chỗ trộn. ~1 phiên.
Rủi ro: KayKit màu bệt cạnh cây, người Quaternius có hoạ tiết vẫn khác kiểu — luật 9 chỉ cấm trộn **trong một loại công
trình**, nên được; nếu anh vẫn thấy gượng thì gốc nằm ở đây, phải đổi cây/người sang KayKit (phiên khác).

## Làm — mỗi việc một commit
1. Tải: `npm run tai:tatca` + `node /home/user/kho-game/cong-cu/lay.mjs quaternius ultimatefantasyrts farmbuildings
   farmanimal --chi obj --dich assets_source`; kiểm không file nào là HTML (bẫy `drive.mjs`).
2. **3 công trình Icosa → KayKit**, nhuộm mái rơm như nhà dân (`mau_cot`): nhà bia → `building_tavern` · trại lính →
   `building_barracks` · lò nung → `building_blacksmith` hoặc `tower` — chọn trên bảng ảnh cùng tỉ lệ.
3. **9 hình KayKit + Quaternius và `lo_mo`, `lo_gom`** (nhà MegaKit Quaternius): đồ vật Quaternius (`qp`, `qv`) → đồ
   KayKit (`khp`, `kk`) cùng chỗ; `lo_mo`, `lo_gom` → nhà KayKit nhuộm. Xe kéo, hàng rào, quầy hàng đứng rời: giữ.
4. **Nông trại một tay Quaternius màu phẳng:** ruộng 1E = `Farm_Dirt` + hình mới `ruong_lua_1..3` (lúa 3 bậc), `ruong_trong`
   (chưa vẽ vào game) · trại lợn, cừu: rào + chuồng `farmbuildings`, thú `farmanimal` (bỏ rào đá, lều KayKit, dê Google) ·
   trại gà: `ChickenCoop` + gà G1 + G2. Hệ số mỗi gói một số (luật 5): RTS ≈ 1,3 cho luống bằng cỡ ruộng bây giờ (278 px).
5. `data/ghi_cong.json` gỡ 5 model Icosa thôi dùng · `docs/ASSET_CREDITS.md` dòng mẻ cổ đại (file khoá — **anh đồng ý 10/10**, ghi vé lúc sửa).
6. `ART_BIBLE.md` mục 2, 5 số đo mới · nhật ký · `TIEN_DO.md`.

## Đo
- `tay-ve co_dai` = 3 · khung đo art bible (hiện 0,52 · 0,47) · `tests/BanDo.test.ts` (2 trang 2×, 1 trang 1×).
- Ước chỗ: 3 Icosa (5,8 % trang) đổi KayKit cỡ tương đương, ruộng/trại giữ cỡ, thêm 4 hình lúa (4,3 %) → ~92 % trang 2×,
  sát trần một trang; tràn thì sang trang 2 đã khai (dòng "trang trống" trong `ASSET_CREDITS.md` thành sai).
- HUD 3 lệnh vẽ · `sim:thu`, `sim:van` y hệt (chỉ đổi hình) · `npm run chup:man` trước/sau + ảnh zoom xa nhất ·
  ảnh Safari giả lập (`anh-ios.yml`) · anh mở Pages trên iPhone ≥ 58 fps.

## Giả sử B hỏng — ba lý do
- Mất nét riêng đời 1: đền, tháp, đấu trường là thứ duy nhất nhìn ra "cổ đại" → chặn: nhuộm mái rơm + nền đất như nhà dân,
  so bảng ảnh trước khi nướng cả mẻ; anh chê thì giữ lại đúng công trình đó và ghi là ngoại lệ.
- Trại Quaternius nhỏ/lớn lệch nhà KayKit bên cạnh → chặn: chốt hệ số trên ảnh cảnh thành phố, không trên bảng rời.
- Lò, xưởng bỏ đồ Quaternius thì giống nhau → chặn: mỗi lò một màu mái (`mau_cot`) + một món đồ KayKit riêng.

Lùi bằng: `git revert` commit nướng (atlas + `co_dai.json` cùng một commit); mẻ cũ còn nguyên trong git.
KHÔNG làm: đời 2–6 · cây, người sang KayKit · code "lúa lớn dần" (kế hoạch mẹ bước 3, phiên sau) · bò, ngựa, vịt.
Cần anh trả lời: không có (10/10 anh chọn B, đồng ý sửa `docs/ASSET_CREDITS.md`).
