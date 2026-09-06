# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 06/09/2026.

## 1. Đang ở đâu

**Phase 2 — XONG phần máy ảo kiểm được. Chờ anh đo fps trên iPhone.**

Atlas thật đã gắn vào game. Mở trang là thấy **thành phố isometric**: bản đồ 64×64 ô,
314 công trình, đường kẻ ô bàn cờ, nhà bám hai bên đường. Kéo một ngón để đi, chụm hai
ngón để thu phóng. Nhãn fps góc trái, bốn nút tắt lớp góc phải.

File mới: `src/render/Shader.ts` · `Atlas.ts` · `IsoMath.ts` · `Camera.ts` ·
`BanDoDemo.ts` · `CityScene.ts` · `src/core/Rng.ts` · `data/thanh_pho_demo.json`.
`src/render/Gl.ts` mở rộng sang đa trang. `src/bench/AtlasTam.ts` **đã xoá** —
trang đo `?do=sprite` giờ dùng atlas thật.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 41 test · build ·
check:base · check:credits).

Đo trong máy ảo, màn 874×402 @2×:

| Mức thu phóng | Sprite mỗi khung | Lệnh vẽ | Trần |
|---|---:|---:|---|
| 2,00× | ~150 | 1 | 1.500 sprite · 4 lệnh vẽ |
| 1,00× | 469 | 1 | |
| 0,60× (nhỏ nhất) | 1.186 | 1 | |

`tests/NganSachSprite.test.ts` quét khắp bản đồ tìm chỗ đông nhất ở mức 0,60×:
**1.196 sprite**. Đó là lý do `zoomMin` chốt ở 0,6, không phải chọn cho đẹp.

Bộ nhớ GPU: 2 trang 2048² ≈ 33,5 MB (trần 4 trang ≈ 67 MB).

**fps: chưa có số thật.** Máy ảo vẽ bằng phần mềm nên luôn 12 fps, vô nghĩa.
Số 18.089 sprite của Phase 0 **bỏ đi** — nó đo bằng atlas giả 256×256.

## 3. Việc của chủ dự án

1. **Xem ba ảnh thành phố** đã gửi trong phiên. Ưng chưa? Không ưng thì nói **ĐỔI …**
   (đổi bố cục đường, thêm/bớt loại nhà, đổi mật độ, đổi màu ô nền) — toàn đổi rẻ,
   chỉ sửa `data/thanh_pho_demo.json`.
2. **Mở PWA trên iPhone và nhắn về 4 con số** — đây là việc quan trọng nhất của phase này:
   - Mở https://gc1001vn-svg.github.io/quoc-chien/ , bấm nút **Chia sẻ** → **Thêm vào MH chính**
   - Mở từ màn hình chính, xoay ngang, chờ 5 giây rồi đọc nhãn góc trái: **fps** và **ms**
   - Chụm hai ngón thu nhỏ hết cỡ, chờ 5 giây, đọc lại **fps** lúc đó
   - Bấm nút **Nền** để tắt lớp nền, đọc **fps** lần nữa
   Nhắn 4 số đó về. Nếu ở mức thu nhỏ nhất mà **dưới 50 fps** thì phải lùi về atlas 1×.
3. Duyệt sang **Phase 3** nếu ưng.

## 4. Nợ kỹ thuật

- **`skillOverrides` có ăn — nhưng ghi chép 06/09 đã sai, nay sửa lại.** Kiểm bằng cách
  đối chiếu danh sách skill harness in ra với file trên đĩa:
  - Chạy thật: 6 skill `off` (`pptx` `docx` `xlsx` `pdf` `vsp-safety-expert` `vsp-van-ban`)
    ≈ **945 token/phiên**, và 5 skill `ponytail-*` để `user-invocable-only` ≈ **452 token**.
    Tổng đang tiết kiệm ≈ **1.400 token/phiên**.
  - **Không chạy**: 9 dòng thêm 06/09. Tám tên (`dataviz` `design` `artifact-design`
    `artifact-diagramming` `artifact-capabilities` `claude-api` `keybindings-help` `init`)
    **không tồn tại** trong Claude Code — không có file trên đĩa, không có trong danh sách.
    Đó là skill của claude.ai hoặc lệnh gạch chéo. Tiết kiệm **0 token**.
    `session-start-hook` có file thật nhưng tên khai bên trong là `startup-hook-skill`
    nên khoá override nhiều khả năng không khớp.
  - Con số "~1.285 token/phiên" ghi hôm 06/09 là **ước đoán sai**. Nên bỏ 9 dòng thừa
    trong `.claude/settings.json` cho khỏi hiểu nhầm — file khoá, chờ chủ dự án đồng ý.
- **`CLAUDE.md` vẫn ghi "deploy Vercel"** trong khi đã chuyển GitHub Pages từ 06/09.
  File khoá, nợ từ phiên trước, chưa sửa.
- **Chưa cắt sát theo kênh alpha.** Atlas dùng 3/4 trang vì bóng đổ nới hộp bao từng
  sprite. Thêm một mẻ nữa là vượt trần. Cắt theo alpha thay vì theo hộp bao hình học sẽ
  hạ xuống — làm khi nào chạm trần, không làm trước.
- **Shader nhiều trang có thể tốn băng thông trên iPhone**: GPU di động thường chạy hết
  mọi nhánh `if`, tức mỗi điểm ảnh đọc 2 ảnh thay vì 1. Chưa đo được. Rớt fps thì lùi về
  bộ 1× — sửa `coTheoDpr` trong `src/render/Atlas.ts`, một dòng.
- `tests/NganSachSprite.test.ts` **chép lại** phép cắt của `CityScene.datSprite`. Sửa một
  bên mà quên bên kia thì test hết ý nghĩa. Đã ghi cảnh báo ngay đầu file test.
- `src/render/BanDoDemo.ts` là bản đồ giả, Phase 3 thay bằng `src/sim/` thật.
- **KayKit City Builder Bits** đã tải về `assets_source/` nhưng **chưa nướng** — đồ hiện
  đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.
- Mẻ trung cổ 147 sprite còn thiếu nhà thờ, quảng trường, kho. Thêm là sửa
  `tools/me/trung_co.json` rồi `npm run nuong`.
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên.
- **Deploy: GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`.
  Máy ảo bị chặn hết nhà cung cấp hosting → deploy giao cho máy CI. Repo phải **công khai**.
  Ba chốt chặn phải mở bằng tay (làm xong 06/09): repo công khai ·
  `Settings > Pages > Source: GitHub Actions` · `Settings > Environments > github-pages >
  Deployment branches` phải có `main`.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên
  máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký qua
  `api.github.com` là tự kiểm được.

## 5. Phase kế tiếp

**Phase 3 — thành phố sống bằng số, chưa vẽ**: `src/sim/city/` với `Wares.ts`,
`Buildings.ts`, `Chains.ts`, cộng `Clock.ts` nhịp 10 Hz. TypeScript thuần, ESLint đã dựng
sẵn hàng rào cấm import trình duyệt.

Xong Phase 3 thì `npm run sim:thu` chạy **10 giờ game trong Node** trong vài giây, in bảng
tài nguyên. Điều kiện đạt: không có hàng âm, không chuỗi sản xuất nào kẹt vĩnh viễn.
Chưa nhìn thấy gì mới trên màn hình — đó là chủ ý, Luật 1 của `TECH_SPEC` mục 1.

Số cân bằng đi vào `data/`: `wares.json` · `buildings.json` · `chains.json`.
