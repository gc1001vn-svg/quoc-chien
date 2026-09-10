# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — bỏ nhà trang trí che tầm, mở lộ công trình, ghim vàng).

## 1. Đang ở đâu

**TÌM RA NGUYÊN NHÂN THẬT.** Phase 6/13 xong, cộng một phiên trả nợ.

Suốt phiên chủ dự án báo: bấm gì cũng **không thấy giếng, mỏ, xưởng, cối xay**. Bốn vòng
đầu chữa nhầm chỗ (nướng lại sprite · quy hoạch · bảng công trình · bỏ nhà che tầm). Vòng
năm chụp máy ảo **cùng khung iPhone cầm dọc, cùng góc bản đồ, cùng mức thu phóng** với ảnh
của anh — cây khô, xe kéo, thùng trùng khít từng cái, chỉ thiếu đúng các công trình. Rồi
mở `dist/sw.js` ra đọc:

```
{url:"assets/atlas/trung_co_2_2x.json", revision: null}
```

**`revision: null`** — workbox coi mọi file trong `dist/assets/` là đã có băm nội dung
trong tên nên **không bao giờ tải lại**. Tên file atlas thì **cố định**. Máy anh chạy
**mã mới + dữ liệu mới + atlas cũ, vĩnh viễn**. Atlas cũ không có 12 hình nướng ở Phase 6B,
`datSprite` bỏ qua im lặng → giếng, cối xay, mỏ, xưởng biến mất, còn nhà, cây, người vẫn
hiện. Không một dòng báo lỗi.

Vá ba lớp:

1. **`public/assets/atlas/` → `public/atlas/`** — ra khỏi `assets/` thì workbox băm nội
   dung thật. Đổi đường dẫn cũng làm mục nhớ cũ trên máy anh thành vô dụng, nên máy đang
   kẹt tự thoát.
2. **`npm run check:sw`** chạy ngay trong `npm run build`: atlas nào còn `revision: null`
   là **build hỏng**, CI chặn.
3. **Dải đỏ báo "ATLAS CŨ — thiếu N hình"** trên đầu màn, liệt kê tên. Lỗi câm thành lỗi
   nói được.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md`.

## 2. Số đo mới nhất

`npm run do` → **6/6 thước đạt** (lint · typecheck · test **132 test** · build ·
check:base · check:credits · check:sw nằm trong build).

`npm run sim:thu` → **ĐẠT**, 10 giờ game không người bấm:
**188 → 196 nhà · 8 kho · 321.009 chuyến · đông nhất 659 người · 0 lượt bỏ cuộc.**

| Số đo | Đo được | Trần |
|---|---:|---:|
| Sprite một khung ở 0,35× (thu nhỏ nhất) | 3.343 | 5.000 |
| Lệnh vẽ | **1** | 4 |
| Trang atlas, bản 2× | 2 | 4 |
| File atlas có `revision: null` trong `sw.js` | **0** | 0 |

## 3. Việc của chủ dự án

**Mở lại và xem có còn dải đỏ không.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. **Đóng hẳn tab cũ** (vuốt bỏ), rồi mở link. Mở **hai lần**.
2. Nhìn **đầu màn hình**:
   - **Có dải đỏ "ATLAS CŨ — thiếu N hình"** → chụp ảnh gửi lại. Dải đỏ ghi rõ thiếu hình
     nào, tôi sẽ biết ngay phải làm gì — không phải đoán nữa.
   - **Không có dải đỏ** → atlas đã đúng. Đi tiếp bước 3.
3. Bấm nút **`⌂`** góc trái dưới → danh sách công trình → bấm dòng **Giếng**. Màn hình bay
   tới, tự phóng to, **ghim vàng "đây"** chỉ thẳng vào nó; cái gì đứng trước che nó thì tự
   biến mất trong lúc soi.
4. Bấm lại dòng đó → sang cái giếng kế tiếp. Làm y vậy với **Cối xay · Mỏ · Xưởng · Ruộng**.
5. Vẫn không thấy → chụp màn gửi lại, ghi rõ bấm dòng nào.

Chưa có xác nhận trên iPhone thật thì phiên này **chưa xong** — mới là "chờ xác nhận".

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
