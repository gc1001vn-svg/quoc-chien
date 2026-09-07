# PHASE 4C — Nướng sprite người vác hàng (07/09/2026)

Không phải phase mới: đây là việc chen vào trước Phase 5 theo ý chủ dự án — muốn nhìn
người thật rồi mới đánh giá cử động.

## Kế hoạch cũ sai ba chỗ, sửa ngay trong phiên

1. Gói **"Ultimate Animated Character Pack" không tồn tại**. Gói đúng là **Modular
   Character Outfits – Fantasy** (CC0, tag `Medieval` `peasant`), bản miễn phí có 2 bộ đồ.
2. Gói **không có OBJ**, chỉ `.gltf` + `.bin` → phải viết `tools/lib/gltf.mjs`.
3. Model nằm ở **tư thế chữ T, không kèm cử động** → phải trộn da (skinning) và tự đặt
   dáng. Và **bộ đồ nông dân không có đầu**: Quaternius để đầu ở gói *Universal Base
   Characters* riêng, cùng bộ xương 65 khớp — nên phải cắt lấy cái đầu từ gói kia ghép vào.

## Đã làm

- `tools/lib/gltf.mjs` (~250 dòng): đọc glTF, trộn da theo `JOINTS_0`/`WEIGHTS_0`, xoay
  xương theo bảng dáng, và cắt mesh theo tên xương. Không dùng thư viện ngoài.
- Bảng dáng nằm trong `tools/me/trung_co_2.json`, không nằm trong code. Dáng thứ hai chỉ
  là **bản gương** của dáng thứ nhất — khỏi chép số hai lần.
- 16 sprite mới: nam/nữ × 4 hướng × 2 dáng. `Walker` mang thêm `huong` và `kieu`.
- `dong_thung` và `thung_ruou` trở lại bản đồ.

## Số đo

`npm run do` **6/6 đạt**, 96 test (trước 88). `npm run sim:thu` **ĐẠT**: 64.184 chuyến một
giờ · đông nhất 324 người · 0 bỏ cuộc — y hệt trước, thêm hai trường vào `Walker` không
đụng gì tới kinh tế.

Máy ảo, mức thu nhỏ 0,35×: **3.488 sprite · 1 lệnh vẽ** (trần 5.000 · 4). Ở 0,41×: 2.597.
Atlas 2× lên 2 trang nhưng vẫn **một lệnh vẽ**.

**fps trên iPhone: chờ chủ dự án xác nhận.** Máy ảo vẽ bằng phần mềm, số fps của nó vô nghĩa.
