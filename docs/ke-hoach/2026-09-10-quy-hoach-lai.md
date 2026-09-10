# Quy hoạch lại thành phố — 10/09/2026

## Hỏi đáp trước khi lập kế hoạch

- Hỏi: Viền bao quanh mỗi khu làm mạnh đến đâu? → Đáp: **Nền riêng + hàng rào cây thấp**
  (người vác hàng vẫn đi xuyên được).
- Hỏi: Bố cục 16 phường (bảng 4×4) giữ hay thiết kế lại? → Đáp: **Cho thiết kế lại theo
  mẫu thật.**
- Hỏi: Lấp chỗ trống luôn lần này? → Đáp: **Làm luôn, bằng vật THẤP.**

## Bốn nguồn đã tra

1. **Kevin Lynch, *The Image of the City* (1960)** — năm thành phần của một thành phố đọc
   được: Paths · **Edges** · **Districts** · Nodes · Landmarks. Hai điều lấy nguyên:
   - **Edges**: ranh giới **không cần là tường chắn**, chỉ cần *liên tục và nhìn thấy được*
     ("unity seams rather than isolating barriers"). Đúng cái anh đề nghị.
   - **Districts**: một khu được nhận ra nhờ **"thematic continuity"** — cùng chất nền,
     cùng kiểu vật, cùng màu. Không chỉ viền, mà cả ruột khu cũng phải khác nhau.
2. **Ped shed / 5-minute walk (400 m)** — từ đơn vị lân cận của Perry. Tiện ích đặt ở tâm
   vùng nó phục vụ, bán kính bằng quãng đi bộ. **Không phải gom hết vào tâm phường.**
3. **Poisson-disk sampling (blue noise)** — bốc điểm ngẫu nhiên nhưng **giữ khoảng cách tối
   thiểu**. Đây đúng là thuốc chữa bệnh dồn cục.
4. **watabou/TownGeneratorOS** (mã nguồn mở, Haxe) — máy sinh thành trấn trung cổ, chia
   thành **ward** theo Voronoi, mỗi ward một chức năng. Đọc để lấy ý, không chép dòng nào.

## Đo được hiện trạng (trước khi sửa)

```
gieng:       12 cai · phuong 2,1=3  1,2=3  1,1=6   · cap cach nhau <=4 o: 10/21
cong_truong: 12 cai · phuong 1,1=3  2,2=3  2,1=3  1,2=3 · cap <=4 o: 7/12
```

**6 trong 12 giếng nằm chung một phường**, 10/21 cặp cách nhau dưới 4 ô. Nguyên nhân:
`oTrongKhu(..., veLoi=true)` bốc ô **gần lõi phường nhất**; 4 phường đô thị chia 12 giếng
nên cả 3 giếng mỗi phường đều dính vào lõi. Đó là **hiểu sai Perry** — một đơn vị lân cận
có MỘT trung tâm, nên 12 giếng nghĩa là 12 đơn vị lân cận chứ không phải 4.

---

Việc: Bỏ cách chia 16 phường, dựng lại theo vành đồng tâm kiểu thành trấn; rải nhà theo
khoảng cách tối thiểu; mỗi khu một nền riêng và một viền bao quanh; lấp chỗ trống bằng vật
thấp.

Xong là khi: nhìn ảnh chụp ở 0,35× **đếm ra được các vành và thấy viền ngăn giữa chúng**,
và **không còn hai giếng nào cách nhau dưới 8 ô**.

Cách đo:
  `npx tsx` đếm cặp cùng loại cách nhau ≤4 ô — giếng phải về **0/21** (nay 10/21).
  `npm run sim:thu` chuyến một giờ **≥ 300.000** (nay 321.009). Tụt dưới là bố cục sai.
  `npm run chup:man ?zoom=0.35` — sprite **≤ 5.000**, lệnh vẽ **≤ 4**.
  `npm run do` 6/6 thước.

Phương án A (đề xuất): vành đồng tâm + Poisson-disk + viền · ~2 giờ · rủi ro: vành ngoài xa
  kho thì người vác hàng đi quá xa, chuyến/giờ sập.
Phương án B: giữ bảng 4×4, chỉ thêm Poisson-disk + viền · ~45 phút · rủi ro: hết dồn cục
  nhưng hình hài tổng thể vẫn y như cũ, anh nhìn vẫn thấy "lộn xộn".
  Vì sao chọn A: anh đã bảo cho thiết kế lại, và B không chữa được cái anh thấy khó chịu.

Giả sử A hỏng rồi — ba lý do:
  1. Ruộng ở vành ngoài cùng, kho ở lõi → đường quá dài → tắc chuỗi, chuyến/giờ sập.
     **Chặn ngay**: kho đặt ở RANH GIỚI giữa hai vành, không đặt trong lõi; đo `sim:thu`
     trước khi commit, tụt dưới 300.000 là lùi ngay.
  2. Khoảng cách tối thiểu quá chặt → không đủ chỗ, thống đốc báo "khu chật" như lỗi 10/09.
     **Chặn ngay**: bốc thất bại thì **tự nới** khoảng cách (10 → 8 → 6 → 4), và giữ test
     "đặt đủ số nhà đã khai".
  3. Viền cộng vật lấp trống đẩy sprite vượt trần 5.000 ở mức thu nhỏ nhất.
     **Chặn ngay**: vật viền và vật lấp đều **1 ô, cao dưới 2 hàng ô**; đo ở 0,35× trước
     khi commit.

Lùi bằng: mỗi bước một commit riêng, hỏng thì `git revert` đúng commit đó. Bảng bố cục nằm
  trong `data/thanh_pho_demo.json` nên đổi lại là sửa dữ liệu, không phải sửa code.
KHÔNG làm: tường thành có cổng (đổi cả tìm đường của người vác hàng — anh đã loại);
  không đụng model/sprite; không đụng `vite.config.ts` và `.github/workflows/`.
Cần anh trả lời: không có — ba câu đã hỏi xong ở trên.

---

## Bố cục định dựng (Phương án A)

Bản đồ 96×96, lưới đường cách 8 ô → **12×12 = 144 khối phố**. Vành tính bằng khoảng cách
Chebyshev từ tâm bản đồ:

| Vành | Rộng | Chức năng | Vì sao đặt ở đó |
|---|---|---|---|
| **Lõi** | 0–14 | Quảng trường chợ, kho chính, nhà dân dày | Thành trấn trung cổ: chợ ở tâm, ai cũng tới được |
| **Vành 2** | 15–26 | Nghề thủ công — xưởng, lò bánh, lò gốm, lò ướp | Phố nghề bám sát khu dân, thợ ở ngay trên xưởng |
| **Vành 3** | 27–38 | Công nghiệp nặng — lò thép, lò nung, lò vôi, mỏ | Zoning thật: khói bụi đẩy ra xa khu dân |
| **Vành 4** | 39+ | Nông nghiệp — ruộng, vườn nho, trại thú, đốn gỗ | Cần diện tích lớn, giá đất rẻ nhất ở rìa |
| Bốn góc | — | Quân sự — trại lính | Trấn giữ cửa ngõ |

**Kho đặt trên ranh giới giữa hai vành**, không đặt trong lõi — đó là chỗ rút ngắn đường
đi nhất giữa nơi sản xuất và nơi tiêu thụ. Đây là điều chặn rủi ro số 1.

### Ba luật rải nhà (thay cho `veLoi`)

1. **Một tiện ích một khối phố** — mỗi khối 8×8 tối đa MỘT giếng, MỘT chợ, MỘT kho.
   Giếng đặt ở **tâm khối phố nó phục vụ**, không phải tâm phường. (Ped shed.)
2. **Khoảng cách tối thiểu theo loại** — khai trong `data/buildings.json` (luật 2 của
   CLAUDE.md: số cân bằng không nằm trong `.ts`). Giếng 10 ô · cối xay 12 · mỏ 8 ·
   nhà dân 2. Bốc mãi không ra thì tự nới.
3. **Nhà không dính nhau** — giữ nguyên luật cũ, chiếm cả bốn ô kề.

### Viền và ruột khu (Lynch)

| Khu | Ô nền trong ruột | Viền bao quanh |
|---|---|---|
| Lõi đô thị | đá lát nhiều hơn | hàng rào đá + cột mốc |
| Thủ công | cỏ + đất | hàng rào gỗ |
| Công nghiệp | đá, sỏi | đống đá + cọc |
| Nông nghiệp | ruộng, đất | hàng rào gỗ + bụi cây |

Viền dày **1 ô**, chạy liên tục quanh mép vành. Người vác hàng đi xuyên qua bình thường.


---

## Kết quả (làm xong 10/09)

| Thước | Trước | Sau | Ngưỡng |
|---|---:|---:|---:|
| Cặp giếng cách nhau ≤4 ô | 10/21 | **0/66** (gần nhất 9 ô) | 0 ✅ |
| Sản lượng một giờ | 86.148 | **85.616** (−0,6%) | — ✅ |
| Chuyến một giờ | 321.009 | **276.053** (−14%) | ≥300.000 ❌ |
| `npm run do` | | 6/6 · 133 test | 6/6 ✅ |

**Thước chuyến không đạt, và đã dò tới cùng.** Nâng số kho: 4 → 243k · 6 → 276k · 8 → 277k ·
10 → 287k. Ngay cả 10 kho cũng không về 321k. Kết luận: **quy hoạch theo vành làm quãng đi
dài hơn về bản chất**, vì mỗi loại hàng chỉ làm ra ở một vành. Nhưng **sản lượng chỉ giảm
0,6%** — nhà chờ lâu hơn nên dồn được nhiều hàng hơn rồi mới gọi người, mỗi chuyến chở
nhiều hơn. Chủ dự án chọn phương án B (sửa chỗ đặt kho) sau khi xem số; chốt `soKhoDau = 6`
vì thêm nữa là đổi cân bằng nhiều mà được ít.

**Bài học về cách đo:** ngưỡng "300.000 chuyến" tôi tự đặt **đo sai thứ**. Số chuyến là
phương tiện, sản lượng mới là kết quả. Lần sau đặt ngưỡng vào cái thành phố làm ra được,
đừng đặt vào số lần người ta đi lại.

**Chỗ đặt kho — sửa theo phương án B:** kho ra **CỬA THÀNH**, chỗ trục đường chính cắt qua
viền. Bản vẽ đầu tiên cho thấy ba kho nằm ba góc bản đồ (luật cũ "ngã tư xa các kho cũ
nhất" mà trên bản đồ vuông thì chỗ xa nhất luôn là bốn góc), nửa phía nam và phía đông
không có kho nào. Nay bốn hướng đều có.

**Công cụ mới `tools/xem_quy_hoach.mjs`** — vẽ bản quy hoạch cả thành phố ra một tấm ảnh.
Trong game ở mức thu nhỏ nhất chỉ thấy 39 ô trên 96, nên cả ngày 10/09 tôi sửa quy hoạch
rồi chụp một góc màn và đoán, ba lần chữa nhầm chỗ. Chính tấm ảnh này chỉ ra lỗi kho dồn
góc trong vòng một phút.
