# Bước 1 — Xây nhà từng bước · 04/10/2026 · ANH DUYỆT 04/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` mục "Việc" 1. Anh chọn: chạy luôn
(nhà đang xây vẫn sản xuất, chỉ đổi hình) · xây nhanh ~2 s · giàn giáo vẽ bằng hạt.

## Hiện trạng (đo 04/10)
- Nhà/kho thống đốc xây thêm hiện NGAY: `XayThem.ts` `dungNha`/`veKho` → `chenVat`. Lớp vẽ đọc `banDo.vat` (`VeCanh.ts`).
- Tốc độ mở màn 10× = 100 nhịp/giây thật (`Clock.ts`) → "~2 s" = 200 nhịp.
- Shader sprite có sẵn độ chớp sáng (phần lẻ số trang, sóng đổi mẻ 12D) → loé sáng không cần shader mới.
- Dò asset 04/10: có `building_scaffolding` (KayKit), `scaffold_*` (Kenney) — model 3D, phải nướng vào mẻ đã 90,2 %
  một trang → theo lựa chọn anh, vẽ bằng hạt.
- `City.ts` 299 dòng, `CityScene.ts` 299, `VeCanh.ts` 289 (trần 300) → logic mới vào file mới.

## Làm — mỗi việc một commit
1. **Sim chỉ ghi:** `OVat.nhipXay?` (`BanDo.ts`); `dungNha`, `veKho` nhận nhịp hiện tại khi thống đốc xây. Sim không đọc
   lại trường này → `sim:van`, `sim:tran`, TP15 ra y hệt (so số trước/sau).
2. **`data/tung_buoc.json`:** `thoiLuongNhip` 200 · mốc giai đoạn (móng 0–15 %, mọc 15–85 %, loé 85–100 %) · độ sáng
   loé · trần số công trường vẽ hạt cùng lúc · số hạt, màu que gỗ, bụi.
3. **`src/render/TungBuoc.ts` (thuần, không GL):** `tienDoXay(nhipXay, soNhip)` → 0..1 + giai đoạn. Chỉ phụ thuộc
   hiệu nhịp → dừng, tua 500× hình vẫn khớp.
4. **Mọc từ dưới lên:** `datSprite` nhận phần hiện, thu `y0`/`v0` theo %, nhưng **giữ trọn dải đáy cao `oPx/2`** (mặt
   nền ô) ngay từ đầu để không ra "cắt lát" (Gemini 04/10). Loé: cộng độ sáng vào số trang như sóng 12D.
5. **`src/render/HieuUngXay.ts`** (lô `Hat` sẵn có, 0 lệnh vẽ thêm): vạch móng (4 que theo cạnh ô) · giàn giáo (cột
   đứng + ván chéo theo iso, cao tới mép đang mọc) · bụi ở chân · mạt gỗ lúc gõ · vòng sáng lúc xong. Thêm kiểu
   hình `que` vào shader `Hat.ts`.
6. **Thợ đứng gõ:** sprite người vác có sẵn đứng trước cổng quay vào nhà, đổi chân theo nhịp gõ — trộn vào `veLopVat`
   như đám đông bất ổn (giữ đúng thứ tự trước sau).
7. `?tat=xay` tắt hết (nhà hiện ngay như cũ); `?tat=het` gồm `xay`. `?xay=<loại nhà>`: thống đốc xây ngay lúc mở —
   chỉ để chụp, quay clip.
8. **Luật TP16** (`LUAT_BAT_BIEN.md` + `BatBienThanhPho.test.ts`): nhà/kho xây thêm mang nhịp khởi công trong
   [0, nhịp hiện tại], không nằm trên đường, vẫn nhận và làm hàng lúc đang xây, đủ hình đúng `thoiLuongNhip` nhịp sau.
9. `TU_LAM.md` dòng `hieu_ung:xay` · nhật ký · `TIEN_DO.md`.

## Đo
- `npm run do` mỗi commit (có `luat:sau` vì đụng `src/sim/`, `data/`). `sim:van` trước/sau phải khớp từng số.
- Lệnh vẽ thành phố giữ 3 (`check:tran`); atlas không đổi (`BanDo.test.ts`).
- `npm run chup:man` bảng 4 ảnh (móng · mọc 50 % · loé · xong) + `npm run quay` clip MP4 gửi anh.
- Anh: iPhone ≥ 58 fps, nhìn nhà mọc.

## Rủi ro
- Hạt vẽ sau mọi sprite → giàn giáo đè lên vật đứng trước (Gemini 04/10). Chặn: có vật đứng trước trùm lên công trường
  (phép `cheMuc` có sẵn) thì bỏ que, giữ bụi; thợ đứng ngoài hộp giàn giáo.
- Thời lượng theo nhịp: 1× = 20 s · 10× = 2 s · 50× = 0,4 s · từ 200× gần như tức thì. Giữ — đúng luật "dừng, tua
  hình vẫn khớp" của kế hoạch mẹ; số nằm trong data, anh chỉnh được.
- Nhiều nhà cùng xây → trần công trường trong data; quá trần thì chỉ cắt sprite, không hạt.
- Lùi: `git revert` từng commit; `?tat=xay`.
