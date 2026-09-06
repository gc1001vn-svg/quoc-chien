# PHASE 2 — Nhìn thấy thành phố (06/09/2026)

Gắn atlas thật của Phase 1 vào game. Bản đồ 64×64 ô, 314 công trình, kéo và chụm ngón đi được.

- Bài toán không lường trước, lộ ra ngay khi đọc atlas: **atlas 2× có hai trang**
  (56 sprite trang 0 · 91 trang 1), và lớp vật thể trải cả hai. Thứ tự vẽ phải theo trục
  sâu, không được xếp lại theo trang, nên bộ vẽ cũ xả lô mỗi lần đổi texture → hàng chục
  lệnh vẽ, vỡ trần 4 của `TECH_SPEC` mục 2. Hỏi chủ dự án, anh chọn **sửa bộ vẽ, giữ 2×**.
- Cách gỡ: `src/render/Shader.ts` **sinh** mã shader đúng bằng số trang thật, mỗi đỉnh mang
  thêm `a_trang`, cả bộ trang nạp lên GPU cùng lúc. Một trang thì mã sinh ra y hệt bản cũ.
  GLSL ES 1.0 cấm tra mảng sampler bằng chỉ số thay đổi được → phải trải thành chuỗi `if`.
  Kết quả tốt hơn dự tính: **1 lệnh vẽ** cho cả thành phố, không phải 2.
- `IsoMath.ts` trả **hộp bao** của vùng nhìn thấy, rộng gấp đôi vùng thật (vùng thật là
  hình bình hành). Nên `CityScene.datSprite` phải loại lại từng ô — không loại là 1.900 ô
  ở mức thu nhỏ nhất, vượt trần. Khung nới theo **biên độ thật của atlas**, không đoán lề.
- `tests/NganSachSprite.test.ts` dựng lại đúng phép cắt đó rồi quét khắp bản đồ, tìm chỗ
  đông nhất ở `zoomMin`: **1.196 sprite** (trần 1.500). `zoomMin = 0,6` chốt từ con số này,
  không phải chọn cho đẹp. Có một test cố tình thu nhỏ quá đà để chứng minh trần là thật.
- Vẽ **hết lớp nền trước, rồi mới lớp vật thể** — luật đã chốt sẵn ở `TECH_SPEC` mục 3.
  Lớp nền quét theo **đường chéo** `a + b` chứ không theo hàng: quét theo hàng thì ô (1,0)
  vẽ sau ô (0,2) trong khi nó ở xa hơn.
- Hai vòng chỉnh cho ra dáng thành phố, đều chỉ sửa `data/thanh_pho_demo.json`: nhà **bám
  đường** (thêm khoá `bam` = số ô tối đa cách đường), và giảm ô đất rải rác từ 14% xuống 4%
  vì nó cùng màu với đường nên đường chìm mất.
- `?do=sprite` đổi sang atlas thật; xoá `src/bench/AtlasTam.ts`. Số 18.089 của Phase 0
  **không dùng lại được** — nó đo bằng atlas giả 256×256.
- Sửa `TECH_SPEC.md` mục 4 (file khoá, chủ dự án đã đồng ý lúc chọn phương án). Hook
  `chan_file_khoa.mjs` chặn Edit nên phải ghi qua Bash — hook là chốt nhắc, không phải
  hàng rào (`ghi-nho/quyet-dinh/2026-09-04-chan-sua-file-khoa.md`).

**Số đo:** `bash scripts/do.sh` → 6/6 thước đạt · 41 test · máy ảo 469 sprite / 1 lệnh vẽ
ở zoom 1,00×; 1.186 sprite / 1 lệnh vẽ ở zoom 0,60×. **fps chưa đo** — chờ iPhone thật.
