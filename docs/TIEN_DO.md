# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — 23 loại nhà thôi dùng chung năm cái hình).

## 1. Đang ở đâu

**MỖI LOẠI NHÀ MỘT HÌNH RIÊNG.** Phase 6/13 xong, cộng một phiên trả nợ.

Trước phiên này **23 loại nhà dùng chung 5 hình** — sáu loại mỏ y hệt nhau, sáu loại xưởng
y hệt nhau, tám cái lò y hệt nhau. Lý do: kho chỉ có 15 công trình nguyên khối.

Dò đủ ba bước rồi tìm được **KayKit Medieval Hexagon Pack** (CC0, **cùng hoạ sĩ** với gói
đang dùng): 135 công trình + 68 vật trang trí. Kho 1.855 → **2.781 model**.

**25 sprite mới, không tự vẽ một nét nào:**

| Nhóm | Cách phân biệt |
|---|---|
| Lò rèn · xưởng cưa · xưởng rượu · nhà bia · xưởng vũ khí · xưởng dệt · trại lính · nhà dân | **Model riêng hẳn** |
| 6 hầm mỏ | Cùng model, khác **màu quặng** + khác **đồ chất quanh** |
| 8 lò | Khác **cỡ** (lò lớn 224 px, lò nhỏ 173 px) + khác **màu mái** + khác đồ nghề |
| 3 trại thú | Thêm **lán**, khác màu nền và màu lán |

Dọn luôn 11 sprite nhà trang trí không ai dùng. Kho không có model lợn, gà, cừu — ghi vào
`NGUON_MO.md` mục 8.

Cũng tải sẵn **Kenney Fantasy Town Kit 2.0** (167 model CC0) để dành, theo yêu cầu.

**Bắt được một lỗi tự gây ra sáng nay:** `check:credits` **chạy rỗng** — nó quét
`public/assets/`, mà sáng nay atlas đã dời về `public/atlas/`, script thấy thư mục không có
thì báo ĐẠT. Sửa: thư mục biến mất là **HỎNG**.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md`.

## 2. Số đo mới nhất

`npm run do` → **6/6 thước đạt** · `npm run sim:thu` → **ĐẠT**, 321.009 chuyến · 0 bỏ cuộc.

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung ở 0,35× | 3.343 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Trang atlas (1× và 2× cộng lại) | 3 | 4 |
| Loại nhà dùng chung hình với loại khác | **0** | 0 |

## 3. Việc của chủ dự án

**Xem 32 loại nhà giờ có khác nhau không.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. **Đóng hẳn tab cũ** rồi mở link. Mở **hai lần**.
2. Đầu màn có dải đỏ "ATLAS CŨ" thì chụp gửi lại — không có thì đi tiếp.
3. Bấm **`⌂`** → bấm lần lượt **Mỏ than · Mỏ muối · Mỏ đá · Mỏ quặng**. Bốn cái phải
   **khác màu nhau** và có đồ chất quanh khác nhau.
4. Bấm **Lò rèn** rồi **Lò thép** — hai cái lò tròn có ống khói, mái đỏ và mái xanh.
5. Bấm **Xưởng cưa** (có lưỡi cưa) · **Xưởng rượu** (thùng rượu khổng lồ) · **Xưởng vũ khí**
   (bia bắn) · **Trại lính** (như một cái pháo đài nhỏ).
6. Cái nào vẫn thấy giống nhau thì chụp gửi, ghi rõ hai cái nào.

## 4. Nợ đang chặn phase kế tiếp

- **Người vác hàng đi tay không.** Chủ dự án nhận ra 09/09: người đi qua đi lại mà trên
  tay không có gì. Kit có sẵn thùng, bao, sọt để gắn vào tay. **Chốt: để Phase 10**, nướng
  một lần cùng bộ 8 hướng × 4 dáng.
- **Bản đồ thưa hơn trước** — bỏ 157 vật trang trí thì thành phố trống ra. Cần bù bằng vật
  **thấp** (bụi, đá, hàng rào, thùng, luống rau), không bằng nhà. Chưa làm.
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách kiểu Civ, công nghệ, quân sự, ngoại
  giao thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

**Trước khi làm bất cứ thứ gì trong các phase sau, dò hai file này:**
`docs/KHO_ASSET.md` (1.855 model đã tải) → `docs/NGUON_MO.md` (nguồn ngoài đã tra) →
không có thì hỏi chủ dự án. Luật ba bước ở `CLAUDE.md` mục Quy ước.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
