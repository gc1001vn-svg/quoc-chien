# PHASE 8C — cối xay quay (19/09/2026)

Sprite công trình nhiều khung, chủ dự án chốt 18/09. Làm đúng ba bước ở `TIEN_DO` mục 5.

- **`docObj` lọc theo nhóm `g`.** `ki:windmill` của Kenney gói cả tháp (`g windmill`) lẫn
  cánh (`g blades`) vào một file. Lọc thì hộp bao phải tính lại theo đỉnh **còn dùng** —
  giữ hộp bao cả file là tâm sprite cánh nhảy về giữa căn nhà. Mẻ trung cổ không cần bước
  này: KayKit tách sẵn `mill.obj` / `mill_blades.obj`.
- **Máy nướng thêm `tam`, `rx`, `khung`.** Trục cánh không nằm ở gốc toạ độ
  (`kk:mill_blades` tâm y = 1,268) nên phải có tâm quay, không thì cả cụm cánh **vòng
  quanh chân tháp**. `rx` cho cánh Kenney vì chúng nằm trong mặt phẳng y-z, `rz` không với
  tới. `khung` trong bản sao `nhu` đè lên **đúng một mảnh**, tra theo `m` hay `m#nhom`.
- **Đếm cánh bằng số, không đoán:** gom góc các đỉnh xa tâm thành cụm — KayKit **4 cánh**
  (chu kỳ 90° → khung 0/30/60), Kenney **3 cánh** (chu kỳ 120° → 0/40/80).
- **`VeCanh.tenKhung` chọn khung theo `DongHo`**, hai nhịp một khung. Công trình thường
  không có `_k0` nên chỉ tốn một phép tra atlas. `hopSprite` đổi tên **cùng chỗ** với
  `datSprite` — vẽ khung này mà đo hộp bao khung khác thì chạm vào cánh quạt không trúng.
- **Giá phải trả, đo được:** mẻ trung cổ 2× từ **84,4 % một trang** lên **90,2 %**, không
  xếp vừa một trang nữa → **hai trang** (trang 1 lấp 4,5 %, nặng 272 KB, GPU 33,6/67,1 MB).
  Mẻ hiện đại vẫn một trang thật, đệm một trang **rỗng 1×1** cho khớp số trang —
  `DoiMeAtlas` ném lỗi khi số trang lệch vì shader dịch theo số đó.
- **Bẫy gặp giữa đường:** `npm run tai:tatca` **không** kéo bốn gói City Kit và
  `mini-characters` mà mẻ hiện đại đang dùng từ 18/09 — máy ảo sạch không nướng lại được
  mẻ đó. Vá `tai:asset`. `npm run kho` vẫn dừng ở "tụt quá 20 %" vì `assets_source/icosa`
  đi đường riêng — đúng, không phải lỗi; ghi vào `DAU_PHIEN.md`.

## Phụ lục 19/09 — phong cách mẻ hiện đại, chủ dự án giao tự quyết

- **Mái `nha_dan` xanh neon: đổi.** Gốc là màu mái xanh lá của `ks:building-type-a` nhân
  `mau` 1,9 → sáng hơn mọi thứ khác trong game, mà `nha_dan` lại là nhà đông nhất.
- **Màu nhân không đổi được sắc.** Đo tám bộ nhân trên cột mái: tất cả vẫn ra xanh hoặc
  vàng. Thêm `mau_cot` dạng `{ "thay": [r,g,b] }` (thay hẳn, bỏ luôn ảnh cột đó) mới ra
  được ngói xám, nâu, đỏ.
- **Dò cột bằng cách sơn đỏ từng cột. MỖI GÓI MỘT KIỂU — đừng suy từ gói này sang gói kia.**
  `ks:building-type-a` (nhà mái dốc): cột 1 = mái + khung cửa + chân tường, 3 = cửa ra vào,
  7 = tường, 11 = kính. `kc:building-*` (nhà mái bằng): cột 1 = viền trang trí quanh từng
  tầng + gờ mái, 3 = **mặt mái và tầng trệt**, 7 = tường, 11 = kính.
  > **Sửa lại điều đã ghi sai trong chính phiên này:** tôi đọc cột 3 của `nha_dan` ra cửa
  > rồi kết luận tám sprite thương mại "sơn nhầm cột", và báo vậy với chủ dự án. **Sai** —
  > ở `kc:building-*` cột 3 đúng là mặt mái, tám sprite đó vẫn đang sơn mái. Cùng một con
  > số cột mà hai gói hiểu khác nhau.
- **Tám nhà phố: thêm màu viền (cột 1) cùng sắc với mái.** Không phải sửa lỗi mà là thêm:
  trước đó thân nhà trắng, chỉ mái có màu, nhìn từ trên xuống ra tám hộp trắng giống nhau.
  Nay mỗi xưởng một màu viền quấn quanh mặt tiền, đọc ra được loại nhà từ xa.
- **Người chibi: giữ.** Hai mẻ không bao giờ cùng trên màn; ở mức thu phóng chơi thật
  người cao khoảng 45 điểm ảnh CSS nên tỉ lệ đầu không đọc ra được.

## Phụ lục 19/09 (2) — đo rồi gỡ `alibaba/open-code-review`

Cắm 18/09, gỡ 19/09. Đo trên diff thật `fd4e7e2..97a831e`.

- **Bắt thêm 0 lỗi.** `ocr delegate` không đọc code — nó chỉ in danh sách file và luật
  theo đường dẫn. `ocr review` và `ocr scan` vẫn trả
  `Error: resolve LLM endpoint: no valid LLM endpoint configured; ...`.
- **Loại đúng hai chỗ cần soát nhất.** `tests/**` bị loại `default_path`; `.d.mts` bị loại
  `unsupported_ext` và `ocr rules check tools/lib/obj.d.mts` cho nó rơi về
  `Source: System built-in` — đúng bộ luật React/XSS mà repo này cố ý thay. Mà `obj.d.mts`
  là **chỗ duy nhất hỏng trong phiên** (`TS2554: Expected 1-5 arguments, but got 6`).
- **Token: tăng, không giảm.** Nó in ra 5.881 byte (preview 2.170 + rule 3.711), trong khi
  `git diff --stat` cho cùng danh sách file hết **1.012 byte**. Phần tốn thật — đọc diff —
  không giảm chút nào. Cộng thêm 2–3 **lượt gọi**, thứ đắt nhất (kho đo 13/09).
- **Luật nằm hai nơi.** `rule.json` 10.160 byte chép lại `TECH_SPEC` mục 1–2 và `CLAUDE.md`
  mục Ba luật. Chưa lệch, nhưng sửa trần một lần là lệch.

Bài học giữ lại: **luật theo đường dẫn là ý hay, công cụ ngoài để chở nó thì không đáng.**
Luật đã nằm sẵn ở hai file đọc mỗi phiên.
