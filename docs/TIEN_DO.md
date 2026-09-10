# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 10/09/2026 (Phase 6B — quy hoạch bốn vành đồng tâm, viền giữa các khu).

## 1. Đang ở đâu

**THÀNH PHỐ CÓ QUY HOẠCH THẬT.** Phase 6/13 xong, cộng một phiên trả nợ.

Trước phiên này **6 trong 12 giếng nằm chung một phường** — chủ dự án gọi đúng tên là "một
đống giếng nước ở cùng với nhau". Tôi hiểu sai Perry: một đơn vị lân cận có MỘT trung tâm,
nên 12 giếng nghĩa là 12 đơn vị lân cận chứ không phải 4.

Dựng lại theo ba nguồn:

- **Kevin Lynch, *The Image of the City*** — mỗi khu một chất nền riêng, và **viền** giữa
  các khu: liên tục, nhìn thấy được, **nhưng đường vẫn cắt qua** nên người vác hàng đi
  bình thường.
- **Ped shed** — mỗi **khối phố 8×8 chỉ một giếng**, đặt gần giữa khối.
- **Poisson-disk** — mỗi loại nhà giữ khoảng cách tối thiểu với chính nó.

Bốn vành đồng tâm: **lõi thành** (nhà dân, giếng, công trường) → **thủ công** → **công
nghiệp nặng** → **nông nghiệp**, quân sự bốn góc. Kho đặt ở **cửa thành** — chỗ trục đường
chính cắt qua viền, đúng cách thành trấn trung cổ đặt cổng và chợ.

**Công cụ mới `npm run xem:quyhoach`** vẽ bản quy hoạch cả thành phố ra một tấm ảnh. Trong
game ở mức thu nhỏ nhất chỉ thấy 39 ô trên 96 — cả ngày hôm nay tôi sửa quy hoạch rồi chụp
một góc màn và đoán, ba lần chữa nhầm chỗ vì thế.

Chi tiết: `docs/NHAT_KY/PHASE_6B.md` · kế hoạch: `docs/ke-hoach/2026-09-10-quy-hoach-lai.md`.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| Cặp giếng cách nhau ≤4 ô | 10/21 | **0/66** (gần nhất 9 ô) |
| Sản lượng một giờ | 86.148 | **87.658** (+1,8% — cao nhất từ trước tới nay) |
| Chuyến một giờ | 321.009 | 253.984 (−21%) |
| Sprite ở 0,35× | 3.343 | 3.464 (trần 5.000) |
| Trang atlas | 2 | 2 (trần 4) |

`npm run do` → **6/6 thước** · **133 test** · `sim:thu` ĐẠT, 0 lượt bỏ cuộc.

**Một ngưỡng tôi tự đặt đã không đạt:** "≥300.000 chuyến". Dò tới cùng — 4 kho 243k, 6 kho
276k, 8 kho 277k, 10 kho 287k — quy hoạch theo vành làm quãng đi dài hơn **về bản chất**.
Nhưng sản lượng chỉ giảm 0,6%: mỗi chuyến chở nhiều hơn 31%. **Số chuyến là phương tiện,
sản lượng mới là kết quả** — lần sau đặt ngưỡng vào cái thành phố làm ra được.

## 3. Việc của chủ dự án

**Xem quy hoạch có ra hình hài chưa.**

<https://gc1001vn-svg.github.io/quoc-chien/>

1. **Đóng hẳn tab cũ** rồi mở link, mở **hai lần**.
2. Góc trái trên phải thấy **`11/09 00:38`** hoặc mới hơn (ngày giờ bản build).
3. Thu nhỏ hết cỡ rồi **kéo từ giữa ra rìa**. Phải đi qua bốn vùng khác nhau, và **chất
   đất, cây cỏ, đồ đạc mỗi vùng một kiểu**: nhà dân dày + ghế + hoa ở giữa → xưởng và lò +
   thùng rượu → mỏ và lò nung + đá sỏi → ruộng và trại thú + cỏ cao, hàng rào gỗ.
4. Giữa hai vùng có một **dải viền**: đổi màu nền, có hàng rào và bụi cây chạy dọc.
   Đường vẫn cắt qua viền — người vác hàng đi bình thường.
5. Bấm **`⌂`** → **Giếng nước**, bấm liên tiếp 12 lần. **Không hai cái nào sát nhau nữa.**
   Bấm **không còn phóng to** nữa — màn chỉ trượt tới và hiện tên chỉ vào công trình, anh
   giữ nguyên mức thu phóng đang xem.
6. Chỗ nào còn thấy dồn cục thì chụp gửi, ghi rõ ngày giờ trên màn.

## 4. Nợ đang chặn phase kế tiếp

- **Người vác hàng đi tay không.** Chủ dự án nhận ra 09/09: người đi qua đi lại mà trên
  tay không có gì. Kit có sẵn thùng, bao, sọt để gắn vào tay. **Chốt: để Phase 10**, nướng
  một lần cùng bộ 8 hướng × 4 dáng.
- ~~Bản đồ thưa hơn trước~~ — **ĐÃ TRẢ 11/09**: lấp 530 vật thấp vào **ruột khối phố**,
  chỗ mà nhà không bao giờ dùng tới nên không tranh chỗ xây. Mỗi vành một bộ vật riêng.
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
