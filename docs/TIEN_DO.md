# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — bỏ nhà trang trí che tầm, mở lộ công trình, ghim vàng).

## 1. Đang ở đâu

**GAME CHƠI ĐƯỢC, VÀ GIỜ NHÌN RA ĐƯỢC THẬT.** Phase 6/13 xong, cộng một phiên trả nợ.

Suốt phiên chủ dự án báo đi báo lại: bấm bảng công trình mà **không thấy giếng, mỏ, xưởng,
kho, gian hàng**. Ba vòng đầu chữa nhầm chỗ. Vòng thứ tư đo bằng số và ra thủ phạm:

| Sprite | Cao | Sprite | Cao |
|---|---:|---|---:|
| `thap_canh` (trang trí) | 8,9 hàng ô | `coi_xay` | 4,7 hàng ô |
| `nha_ngoi_do` (trang trí) | 7,4 hàng ô | `mo` | 3,0 hàng ô |
| `nha_nho_do` (nhà dân) | 5,6 hàng ô | `gieng` | **2,4 hàng ô** |

Ở góc chéo, cái đứng **trước** vẽ **đè** lên cái đứng sau. Nhà trang trí cao 7–9 hàng ô
nuốt trọn cái giếng cao 2,4 hàng đứng sau nó. Đếm ra **26 trong 120 nhà kinh tế bị che quá
nửa**. Chúng vẫn luôn ở đó — chỉ là không bao giờ nhìn thấy.

Ba việc đã làm:

1. **Bỏ 12 loại nhà trang trí** (381 → 224 vật). Chúng không có chức năng gì mà cao nhất
   bản đồ. Từ nay mọi mái nhà trên màn đều là nhà **thật** của `src/sim/`.
2. **Mở lộ** (`src/render/VeCanh.ts`): đang soi một công trình thì mọi vật đứng trước nó
   và trùm lên nó bị giấu đi một khung.
3. **Ghim vàng** (`src/ui/Ghim.ts`): thẻ chữ nằm trên canvas, treo đúng nóc công trình, chỉ
   thẳng vào nó. Không bao giờ bị che, không tốn sprite nào.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md`.

## 2. Số đo mới nhất

`npm run do` → **6/6 thước đạt** (lint · typecheck · test **131 test** · build ·
check:base · check:credits).

`npm run sim:thu` → **ĐẠT**, 10 giờ game không người bấm:
**188 → 196 nhà · 8 kho · 321.009 chuyến · đông nhất 659 người · 0 lượt bỏ cuộc.**

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung ở 0,35× (thu nhỏ nhất) | 3.343 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Trang atlas, bản 1× | 1 | 4 |
| Trang atlas, bản 2× | 2 | 4 |
| `CityScene.ts` | 206 dòng | 300 |
| `VeCanh.ts` (mới, tách ra) | 167 dòng | 300 |

**iPhone thật, 10/09: 59 fps · 3.253 sprite · 1 lệnh vẽ** ở mức thu nhỏ hết cỡ — đo trước
lần vá này, số sprite giờ còn thấp hơn vì đã bỏ 157 vật trang trí.

## 3. Việc của chủ dự án

**Kiểm đúng cái đã báo bốn lần: bấm bảng công trình có thấy công trình không.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. Mở link. **Mở HAI LẦN** — lần đầu máy còn dùng bản cũ đã lưu, lần sau mới thấy bản mới.
2. Bấm nút **`⌂`** góc trái dưới → danh sách công trình.
3. Bấm dòng **Giếng**. Màn hình bay tới, tự phóng to, và có **ghim vàng chỉ thẳng vào nó**.
   Cái gì đứng trước che nó sẽ tự biến mất trong lúc soi.
4. Bấm lại dòng đó → sang cái giếng kế tiếp. 12 giếng xem hết bằng 12 lần bấm.
5. **Làm y như vậy với năm dòng đầu** — Giếng, Cối xay, Mỏ, Xưởng, Ruộng. Cái nào không
   thấy thì chụp màn gửi lại, ghi rõ bấm dòng nào.
6. Bảng sự kiện ẩn sau nút `☰`. Nút **50×** có sẵn, không cần `?test=1`.

Đây là chỗ duy nhất cần anh xác nhận. Chưa có xác nhận trên iPhone thật thì phiên này
**chưa xong** — mới là "chờ xác nhận".

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
