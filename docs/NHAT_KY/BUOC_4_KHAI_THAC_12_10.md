# Bước 4 — Khai thác cạn dần (12/10/2026, lần 48)

Kế hoạch anh duyệt 12/10: `docs/ke-hoach/2026-10-12-buoc-4-khai-thac-can-dan.md` (mẹ: `2026-10-04-moi-thu-tung-buoc.md` việc 4).
Anh chọn: chỉ đổi hình · một vòng ~30 s ở 10× · dùng lại hình có sẵn.

- **Dò trước (đo 12/10, thành phố mở màn):** 4 trại gỗ + 12 mỏ. Cây trang trí rải tự do nên quanh trại gỗ chỉ 0–1 cây
  trong 3 ô, quanh mỏ 0–3 đá → không có gì để thưa. Cả 5 mẻ thành phố có sẵn `cay_thong`, `cay_soi`, `cay_soi_2`,
  `cay_kho`, `da_lon`, `da_nho` → 0 hình mới.
- **Làm:** `src/render/KhaiThac.ts` + `data/tung_buoc.json` mục `khaiThac`. Quanh mỗi trại gỗ/mỏ chọn tối đa 4 ô trống
  phía sau hoặc ngang nhà (không che nhà), cách ≤ 2 ô, không đường, không ai chiếm. Một vòng 3.000 nhịp nhà **thật sự
  làm**: 70 % đầu chặt lần lượt (cây → `cay_kho` → mất · `da_lon` → `da_nho` → mất), 10 % trống, 20 % mọc lại từ dưới
  lên (cắt sprite như bước 1). Thống đốc xây lên ô nào thì vật đó mất. `?tat=khaiThac` tắt, `?khaiThacTien=<0..1>` ghim.
- **Sim chỉ ghi** `ThuNha.nhipDaLam()` (nhịp đang làm mẻ, không tính lúc tắc, lúc đợi hàng) — kho đầy thì bãi đứng.
  `VeCanh.ts` chỉ đổi nguồn vật + hai lời gọi (vẫn 299/300 dòng).
- **Đo:** `npm run do` xanh (gồm `luat:sau`) · test +4 (`tests/KhaiThac.test.ts`) · `sim:van` y hệt `main` trừ cột giây ·
  60 vật trên 16 nhà (2–4 mỗi nhà), lệnh vẽ vẫn 3. Ảnh: `anh_chup/kt_go_bang.png`, `kt_mo_bang.png` (không lên git).
- **Nhìn thấy:** `cay_kho` cao, sẫm hơn cây xanh nên lúc "đang chặt" nổi bật; lúc mọc lại cây bị cắt ngang thân
  (giống nhà mọc bước 1). Đá trang trí sẵn có vẫn nằm cạnh mỏ lúc bãi trống.
- **Chưa:** anh đo iPhone ≥ 58 fps. Hai hình lúa xanh bước 3 vẫn chưa nướng.
- **Sơ suất:** đẩy `main` 03e2f53 khi thước `test` HỎNG — đọc "17/18 thước đạt · 1 bỏ qua" tưởng là xanh (18 = 17 đạt + 1
  hỏng; bỏ qua không tính vào mẫu). `tests/AiGoi.test.ts` ghim số dòng nơi gọi `doi` trong `Buildings.ts`, thêm 4 dòng
  là lệch. Sửa ở d65239d, CI 03e2f53 đỏ ~3 phút, Pages vẫn lên (Deploy không chạy test). Đọc dòng `HONG`, đừng đọc tổng.
