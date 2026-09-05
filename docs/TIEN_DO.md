# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 05/09/2026.

## 1. Đang ở đâu

**Phase 0 — xong phần máy ảo kiểm được, chờ xác nhận trên iPhone.**

Khung repo đã dựng và chạy: Vite + TypeScript strict + ESLint + vitest + PWA + CI +
Vercel, `src/core/AssetPath.ts`, `src/core/Perf.ts`, bộ vẽ WebGL tối thiểu
`src/render/Gl.ts`, và trang đo trần sprite `?do=sprite`.

Chưa có game. Trang chính chỉ là màn hình khởi động có một nút dẫn sang trang đo.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 7 test · build ·
check:base · check:credits).

Trang đo sprite chạy trong máy ảo: **1 lệnh vẽ** (trần 4), fps kẹt 30 vì máy ảo vẽ bằng
phần mềm → **số sprite tối đa vẫn chưa biết**, phải đo trên iPhone thật.

## 3. Việc của chủ dự án

Chưa nối Vercel nên chưa có đường công khai. Tạm thời trang đo được đóng gói thành một
trang chạy trên claude.ai, không cần Vercel:
https://claude.ai/code/artifact/49ca6873-a5d2-4cf2-b0d3-1a4187933eb0

Mở trang đo trên iPhone, đợi nó chạy xong (khoảng một phút), nhắn về **một con số**:
số sprite tối đa còn giữ 60 fps. Con số đó chốt toàn bộ ngân sách đồ hoạ cho các phase sau.

Nếu số **dưới 800**: phải bàn lại, có thể phải giảm sprite động hoặc bỏ cỡ 2×.
Nếu số **trên 1.500**: đúng như trần đã đặt ở TECH_SPEC, đi tiếp bình thường.

## 4. Nợ kỹ thuật

- Trang đo dùng **atlas giả** vẽ bằng Canvas 2D lúc chạy, vì Phase 1 mới nướng atlas thật.
  Số đo ra sẽ hơi lạc quan: atlas thật 2048×2048 tốn bộ nhớ GPU hơn tấm 256×256 này.
  Đo lại một lần nữa sau Phase 1.
- `src/render/Gl.ts` mới là bản tối thiểu đủ cho trang đo (một buffer, gom theo atlas,
  xả lô khi đổi atlas). Phase 2 **mở rộng** file này, không viết lại.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên. Test hàng rào đang xanh nhờ một
  phép thử mẫu, không phải nhờ quét file thật.
- Chưa nối Vercel. `vercel.json` đã có sẵn, còn thiếu bước bấm nối repo trên trang Vercel —
  chỉ chủ dự án làm được, cần đăng nhập, và máy ảo chặn `vercel.app` (403).
  Chưa nối thì **chưa kiểm được PWA cài lên màn hình chính**; bản đóng gói trên claude.ai
  chỉ đo được sprite, không thay được việc đó.

## 5. Phase kế tiếp

**Phase 1 — nướng sprite**: `tools/nuong_sprite.mjs` biến model 3D CC0 thành atlas, nướng
mẻ trung cổ trước (nhà cửa, cây cối, ô nền). Chỉ bắt đầu sau khi có con số ở mục 3.
