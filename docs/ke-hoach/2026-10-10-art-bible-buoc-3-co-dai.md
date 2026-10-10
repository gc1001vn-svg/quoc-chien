# Art bible bước 3 — nướng lại mẻ cổ đại về 2 tay vẽ · 10/10/2026 · CHỜ ANH DUYỆT

Việc: mẻ `co_dai` từ **6 tay vẽ** xuống **2**: Quaternius (nhà, xưởng, ruộng, trại, đồ vật, cây, người) + Google (chỉ gà
G1, G2 — luật 1 thêm "gà" 10/10). Nướng luôn lúa 3 bậc để bước "lúa lớn dần" khỏi nướng hai lần.
Xong là khi: `node tools/do_hinh.mjs tay-ve co_dai` ra **2** · bảng trước/sau + ảnh cảnh thành phố gửi anh · khung đo
art bible sáng ≥ 0,36, bão hoà ≥ 0,37 · lệnh vẽ vẫn 3 · sim y hệt · anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 10/10)
- 76 hình: 21 nền/người · 26 chỉ Quaternius · 14 chỉ KayKit · 9 KayKit + Quaternius · 3 Icosa riêng (nhà bia = đền Hy Lạp,
  lò nung = tháp Sumer, trại lính = đấu trường) · ruộng, trại gà, trại cừu trộn 3 tay. Phần sẽ thay: 33 hình, 63,6 % trang.
- Atlas 2×: 87,4 % một trang; trang 2 khai sẵn nhưng rỗng 1×1 ở mọi mẻ. Shader đọc tới 4 trang trong **một** lệnh vẽ →
  dùng thật trang 2 không thêm lệnh vẽ, tốn thêm 16,8 MB bộ nhớ hình.
- **Drive tải lại được 10/10:** Ultimate Fantasy RTS đủ 128 model, 0 file HTML giả. Màu phẳng (chỉ `Kd`), không hoạ tiết.
- Bảng thử 22 hình, một hệ số 2,2 (bảng ảnh gửi anh 10/10): nhà dân bằng cỡ bây giờ; đền, cối xay, mỏ, kho to 1,5–1,8 lần.
  Nhà chỉ có 2 vật liệu (gỗ, đá): **mái và tường cùng màu**, `mau_vl` không tô riêng mái. Cối xay một khối liền.

## Phương án
**A (đề xuất):** công trình đời 1 theo Ultimate Fantasy RTS · ruộng = `Farm_Dirt` (đúng kiểu luống nổi 1E, model gốc thay
tấm ghép tay) + lúa `Farm_FirstAge_Level1–3_Wheat` + ruộng trống · trại: rào `farmbuildings`, lợn, cừu `farmanimal`, gà
G1 + G2 · cây, đá, người, đồ vật rời giữ MegaKit đang có · **một hệ số cỡ** (luật 5). ~1–2 phiên.
Rủi ro: hình mộc một màu gỗ — đúng màu đời 1 (lều, rơm, gỗ mộc) nhưng mất màu mái riêng từng nhà (luật 8); 20 xưởng/lò
chỉ có ~10 model → phân biệt bằng bậc 1–3 và đồ vật quanh nhà (Barrel, Crate, Logs cùng gói).
**B:** giữ nhà KayKit (23 hình), chỉ thay 3 công trình Icosa + ruộng, trại → **3 tay vẽ**. ~1 phiên. Rủi ro: trái luật 1
anh chốt 29/09; vẫn trộn màu bệt KayKit với hoạ tiết Quaternius — chính gốc chữ "gượng gạo" (art bible mục 2).
Vì sao chọn A: chỉ A đạt luật 1; B là sửa nửa vời, phiên sau lại phải làm.

## Làm — mỗi việc một commit
1. Tải: `npm run tai:tatca` + `node /home/user/kho-game/cong-cu/lay.mjs quaternius ultimatefantasyrts farmbuildings
   farmanimal --chi obj --dich assets_source`; kiểm không file nào là HTML (bẫy `drive.mjs`).
2. **Chọn hệ số trước khi nướng cả mẻ** — ước diện tích 76 hình: 2,2 → 145 % trang 2× · **1,8 → 105 %** · 1,6 → 88 %
   (1× đều ≤ 36 %, một trang). Đề xuất 1,8; chốt trên ảnh cảnh thành phố `?me=co_dai&zoom=0.6`, không trên bảng rời.
3. `tools/me/co_dai.json`: bảng vai trò → model ghi vào `ghi_chu`. Nhà dân = Houses 1–3 · xưởng, lò = Houses bậc 2–3,
   Market, Storage, TowerHouse + đồ vật riêng · 6 mỏ = Mine, Resource_Rock/Gold tô theo khoáng (`mau_vl`) · nhà bia =
   Temple · lò nung = Wonder · trại lính = Barracks · công trường = TownCenter · trại gỗ = cây đốn + Logs · giếng = Well.
   Cối xay: `farmbuildings` Windmill nếu cánh rời; không thì đứng yên (3 khung giống nhau), ghi nợ.
4. Ruộng `ruong` + hình mới `ruong_lua_1..3`, `ruong_trong` (chưa vẽ vào game) · trại cừu bỏ dê Google · vườn nho giữ.
5. `data/ghi_cong.json` gỡ 5 model Icosa thôi dùng · `docs/ASSET_CREDITS.md` sửa dòng mẻ cổ đại (**file khoá**, cần anh).
6. `ART_BIBLE.md` mục 2, 5 số đo mới · nhật ký · `TIEN_DO.md`.

## Đo
- `tay-ve co_dai` = 2 · khung đo art bible (hiện 0,52 · 0,47) · `tests/BanDo.test.ts` (2 trang 2×, 1 trang 1×).
- HUD 3 lệnh vẽ · `sim:thu`, `sim:van` y hệt (chỉ đổi hình) · `npm run chup:man` trước/sau + một ảnh zoom xa nhất
  (luật 12: mái, tường cùng màu thì phải nhận ra loại nhà bằng bóng dáng — Gemini phản biện 10/10) · ảnh Safari giả lập
  (`anh-ios.yml`) · anh mở Pages trên iPhone ≥ 58 fps.

## Giả sử A hỏng — ba lý do
- Hình to tràn ô bên, che đường → chặn: chốt hệ số trên ảnh cảnh thành phố (việc 2), vẫn một hệ số cả gói.
- Bão hoà tụt dưới 0,37 vì gỗ nâu một màu → chặn: đo khung art bible trước khi gửi; tụt thì `mau_vl` theo vật liệu cho
  **cả gói**, không từng nhà.
- Thành phố nhìn đơn điệu hơn bây giờ (anh chê "chán" 30/09) → chặn: bảng ảnh 10/10 cho anh thấy trước khi nướng; ảnh
  cảnh thành phố gửi anh trước khi đẩy `main` (bản duyệt `npm run duyet`).

Lùi bằng: `git revert` commit nướng (atlas + `co_dai.json` cùng một commit); mẻ cũ còn nguyên trong git.
KHÔNG làm: đời 2 (bản SecondAge cho `trung_co`, `trung_co_2`) · code "lúa lớn dần" (kế hoạch mẹ bước 3, phiên sau) · bò,
ngựa, vịt.
Cần anh trả lời: (1) nhìn bảng ảnh — chịu hướng A (mộc, đúng luật) hay B (giữ nhà KayKit nhiều màu, nới luật 1 lên 3 tay
vẽ)? (2) đồng ý cho sửa `docs/ASSET_CREDITS.md` dòng mẻ cổ đại không?
