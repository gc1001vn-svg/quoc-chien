# PHASE 5 — Thống đốc tự xây (08/09/2026)

Thành phố tự lớn: mỗi giờ game, thống đốc nhìn bảng số của giờ vừa xong rồi xây thêm
**đúng một** thứ — kho hoặc nhà.

## Đã làm

- `src/sim/autoplay/Policy.ts` + `data/policy.json`: ngưỡng, trần, bảng cấp thống đốc.
  Không một con số cân bằng nào nằm trong `.ts` (luật 2).
- `src/sim/autoplay/Governor.ts`: **kho trước, nhà sau**. Đường đang tắc mà xây thêm nhà
  thì chỉ thêm người vào chỗ đông. Nhà chỉ xây khi kho **rỗng** mà vẫn có nhà phải chờ món
  đó — kho còn hàng mà nhà phải chờ là kẹt giao thông, xây thêm lò bánh không chữa được.
- Cấp thống đốc lên theo số nhà; mỗi cấp nới trần nhà và trần kho. Trần cấp trước bằng
  `tuNha` cấp sau nên không cấp nào kẹt cứng.
- **Nhiều kho**: `DoiWalker` giữ mảng kho, người vác hàng đi tới kho **gần nhất** (đo theo
  đường đi, không đo đường chim bay). Túi hàng vẫn là một `Kho` chung — nhiều kho chỉ là
  nhiều điểm bốc dỡ, kinh tế Phase 3–4 không đụng tới. Chủ dự án đã chốt cách này.
- Kho hiện ra màn hình bằng sprite `dong_thung` đặt cạnh ngã tư; trước Phase 5 kho vô hình.
- `ThanhPho.xayNha` / `xayKho` đặt nhà lúc đang chạy, dùng lại `datMotNha` tách từ
  `datNhaKinhTe` — cùng hạt giống thì bản đồ y hệt trước.
- Tách `XayThem.ts`, và chuyển `hangHong` sang `Wares.ts`, để `City.ts` dưới trần 300 dòng.

## Số đo

`npm run do` **6/6 đạt**, **108 test** (trước 96). `npm run sim:thu` **ĐẠT**, 10 giờ game:
**94 → 102 nhà · 1 → 2 kho · 71.156 chuyến một giờ · đông nhất 324 người · 0 bỏ cuộc.**

Chuyến một giờ **tăng 10,9 %** so với 64.184 của Phase 4C, dù thành phố đông nhà hơn: kho
thứ hai kéo ngắn quãng đường, đúng như dự đoán khi lập kế hoạch.

Ngân sách sprite máy ảo: **3.326 (bản 1×) · 3.247 (bản 2×)**, y hệt trước Phase 5 — sprite
kho không rơi vào ô đông nhất. Ảnh chụp máy ảo: **1 lệnh vẽ**.

## Bẫy đã sập, ghi lại

Ngưỡng `nguongDinh` để 540 (90 % trần walker 600) thì **không bao giờ chạm** — đỉnh thật
chỉ 324 người, và kho thứ hai không bao giờ được xây. Hạ xuống 300 mới ra kết quả trên.
Đặt ngưỡng theo con số **đã đo**, đừng đặt theo trần lý thuyết.
