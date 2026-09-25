# PHASE 10A — xem được trận, lính thời cổ (25/09/2026)

Kế hoạch: `docs/ke-hoach/2026-09-25-phase-10a-linh-co.md` (anh duyệt 25/09: tách 10A/10B).

- **Asset (dò đủ ba bước + `kho-game`):** KayKit Adventurers · Character Animations ·
  Fantasy Weapons (Kay Lousberg) + ngựa Quaternius Animals — **cả bốn CC0**, lấy từ kho
  chung bằng `npm run kho:lay`. Ghi công vào `ASSET_CREDITS.md` (file khoá, anh cho sửa).
- **Máy nướng** (`tools/lib/gltf.mjs`): đọc **clip hoạt ảnh** (khớp xương theo TÊN, nên
  người và cử động ở hai file khác nhau vẫn ghép được) · **gắn model vào xương** (vũ khí vào
  tay, người cưỡi vào lưng ngựa) · `gamma` cho màu phẳng glTF (ngựa ra gần đen nếu thiếu).
  Mẻ tự khai hệ số bóng (`me.bong`) — bóng kiểu nhà chiếm nửa ô sprite lính.
- **Mẻ `linh_co`:** 4 đội × 8 hướng × 4 dáng × 2 khung = 256 sprite + nền + đế phe = **260**.
  2× lấp **68,6 %** một trang, 1× 17,9 %. Atlas riêng, không đụng mẻ thành phố.
- **Sim:** `tinhTran` ghi thêm **vết vị trí** mỗi `giay_mau_vet` (0,5 s). `sim:tran` vẫn ĐẠT,
  số không đổi (2,24 · 85,2 % · Brier 0,075).
- **Màn trận** `?tran=1` (nút "⚔ Xem trận" ở bản đồ tỉnh): `DienTran.ts` (thuần, test được)
  + `BattleScene.ts`. ×1/×4, bỏ qua, xem lại, nhật ký trận, dòng dự đoán. Máy ảo chụp:
  **344 sprite · 1 lệnh vẽ** (trần 4). fps máy ảo không tính — chờ iPhone.
- **Jules (lần đầu trọn quy trình):** test `DienTran` 23 phút, kiểm chéo **KHỚP**. Bắt
  **5/7** lỗi cài thử → Claude thêm 2 test → 7/7. Jules đánh `it.fails` đúng chỗ **đề của
  Claude sai** (trọng tâm đội hình ≠ 0 khi hàng cuối thiếu người — đúng ý đồ). Lộ lỗi của
  `kiem_cheo`: gặp `expected fail` thì không đọc được số test, hai máy cùng `{}` mà báo KHỚP
  — đã sửa + 6 test `--so-sanh` (bắt 4/4 lỗi cài thử).
- **Còn nợ:** 10B (6 đội súng/hiện đại) · ngựa to so với người · giáo cầm ngang khi đi ·
  người cưỡi một dáng ngồi · cung thủ chưa có mũi tên bay · trận chưa nối bản đồ chiến dịch.
