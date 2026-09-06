# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 05/09/2026.

## 1. Đang ở đâu

**Phase 0 — XONG.** Chủ dự án đã mở thử trên iPhone 06/09 và gửi số đo.

Khung repo đã dựng và chạy: Vite + TypeScript strict + ESLint + vitest + PWA + CI +
Vercel, `src/core/AssetPath.ts`, `src/core/Perf.ts`, bộ vẽ WebGL tối thiểu
`src/render/Gl.ts`, và trang đo trần sprite `?do=sprite`.

Chưa có game. Trang chính chỉ là màn hình khởi động có một nút dẫn sang trang đo.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 7 test · build ·
check:base · check:credits).

**Trần sprite trên iPhone thật, đo 06/09: 18.089 sprite ở 60 fps.**
Trần TECH_SPEC là 1.500 → dư **12 lần**. Số lệnh vẽ cao nhất **1** (trần 4).
Ở 30 fps chạm đỉnh thang đo 24.000 nên con số đó là trần của thang, không phải của máy.

## 3. Việc của chủ dự án

Duyệt sang Phase 1. Không còn gì chờ.

Trang đo giữ lại, đo lại sau Phase 1 khi có atlas thật:
https://gc1001vn-svg.github.io/quoc-chien/?do=sprite

## 4. Nợ kỹ thuật

- Trang đo dùng **atlas giả** vẽ bằng Canvas 2D lúc chạy, vì Phase 1 mới nướng atlas thật.
  Số đo ra sẽ hơi lạc quan: atlas thật 2048×2048 tốn bộ nhớ GPU hơn tấm 256×256 này.
  Đo lại một lần nữa sau Phase 1.
- `src/render/Gl.ts` mới là bản tối thiểu đủ cho trang đo (một buffer, gom theo atlas,
  xả lô khi đổi atlas). Phase 2 **mở rộng** file này, không viết lại.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên. Test hàng rào đang xanh nhờ một
  phép thử mẫu, không phải nhờ quét file thật.
- **Đổi nơi phục vụ: Vercel → GitHub Pages** (chốt 06/09). Lý do: máy ảo chặn hết nhà
  cung cấp hosting (`vercel.com`, `api.vercel.com`, `github.io`, `api.netlify.com`,
  `api.cloudflare.com` đều trả `000`), chỉ `api.github.com` và `registry.npmjs.org` ra
  được. Deploy giao cho máy CI của GitHub — nó có mạng đầy đủ và chỉ cần `GITHUB_TOKEN`
  sẵn có, không cần chìa khoá ngoài nào. `BASE` đổi thành `/quoc-chien/`.
- Hệ quả: repo phải **công khai** (GitHub Pages cho repo riêng tư cần gói trả tiền).
- Ba chốt chặn phải mở bằng tay, không tự động được (làm xong 06/09): repo công khai ·
  `Settings > Pages > Source: GitHub Actions` (`GITHUB_TOKEN` không tạo được Pages site:
  `Resource not accessible by integration`) · `Settings > Environments > github-pages >
  Deployment branches` phải có `main` — luật này ghi cứng tên nhánh mặc định lúc bật Pages,
  đổi nhánh mặc định KHÔNG viết lại nó, job `dua-len` chết trong 1 giây không chạy bước nào.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`, không
  đụng gì khác.
- `CLAUDE.md` và `TECH_SPEC.md` vẫn ghi "deploy Vercel" — **chưa sửa**, cả hai là file
  khoá, phải hỏi chủ dự án.
- Máy ảo vẫn **không tự mở được trang thật** dù đổi sang Pages. Bù lại: bước cuối của
  `deploy.yml` chạy trên máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc
  nhật ký qua `api.github.com` là tự kiểm được.

## 5. Phase kế tiếp

**Phase 1 — nướng sprite**: `tools/nuong_sprite.mjs` biến model 3D CC0 thành atlas, nướng
mẻ trung cổ trước (nhà cửa, cây cối, ô nền).

Nướng và **ship cả cỡ 2×** — chốt 06/09, đã sửa vào `TECH_SPEC.md` mục 3.
Sprite 2× tốn gấp 4 lần diện tích vẽ → còn ~4.500 sprite ở 60 fps, vẫn gấp 3 lần trần 1.500.
Đo lại sau khi có atlas thật; rớt dưới 1.500 thì lùi về ship 1×.
