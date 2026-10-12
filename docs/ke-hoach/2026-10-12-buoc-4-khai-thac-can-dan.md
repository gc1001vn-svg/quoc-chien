# Bước 4 — Khai thác cạn dần · 12/10/2026 · ANH DUYỆT 12/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 4.
Việc: quanh trại gỗ, mỏ có bãi cây/đá thưa dần khi nhà làm việc; hết thì bãi trống, rồi mọc lại.
Xong là khi: bảng ảnh các chặng gửi anh; `sim:van` y hệt; anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 12/10, thành phố mở màn)
- 4 trại gỗ (`rung`, sprite `trai_go`) + 12 mỏ (6 loại × 2). Cây trang trí rải tự do: quanh trại gỗ 0–1 cây trong
  3 ô, quanh mỏ 0–3 đá → không có gì sẵn để thưa. Quanh mỗi nhà còn 4–16 ô trống trong 2 ô.
- Cả 4 mẻ (cổ đại → hiện đại) có sẵn `cay_thong`, `cay_soi`, `cay_soi_2`, `cay_kho`, `da_lon`, `da_nho`.
- Sim không đếm nhà đã làm bao lâu. `VeCanh.ts` 299/300 dòng.

## Anh chọn 12/10
- **Câu 1 — chỉ đổi hình:** chặt hết rồi mọc lại, quay vòng; sản lượng, cân bằng giữ nguyên.
- **Câu 2 — một vòng ~30 s ở 10×** (3.000 nhịp nhà thật sự làm): kho đầy, thiếu hàng thì bãi đứng.
- **Câu 3 — dùng lại hình có sẵn**, 0 hình mới.

## Làm
1. Sim chỉ GHI `nhipDaLam()` của nhà sản xuất (nhịp đang làm mẻ, không tính lúc tắc, lúc đợi hàng) — như `nhipTac`.
2. `data/tung_buoc.json` mục `khaiThac`: chu kỳ, các chặng, bán kính, số vật tối đa, bãi nào cho nhà nào.
3. `src/render/KhaiThac.ts`: chọn ô trống phía sau/ngang nhà (không che nhà), xếp chung với `banDo.vat` theo trục sâu;
   chặt: hình → `cay_kho`/`da_nho` → mất; trống; mọc lại từ dưới lên (cắt sprite như bước 1). Thống đốc xây lên ô
   nào thì vật ở đó mất. `?tat=khaiThac` tắt, `?khaiThacTien=<0..1>` ghim chặng để chụp.
4. `VeCanh.ts` chỉ đổi nguồn vật và hai lời gọi, không thêm dòng.
5. Trại lợn, gà, cừu không đụng.

## Đo
- `npm run do` (gồm `luat:sau` vì `src/sim/` đổi); `sim:van` y hệt; test mới `tests/KhaiThac.test.ts`.
- Bảng ảnh các chặng (`chup:man`), đếm sprite thêm (≤ 16 nhà × 4 vật).

## Rủi ro
- Vật trên ô sát đường nhìn như chắn chỗ xây — chỉ là hình, thống đốc vẫn xây, vật mất.
- Lùi: `git revert`; tắt tạm `?tat=khaiThac`.
