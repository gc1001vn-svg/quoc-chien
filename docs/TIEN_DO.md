# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 06/09/2026.

## 1. Đang ở đâu

**Phase 1 — XONG phần máy ảo kiểm được.** Đã có atlas sprite thật đầu tiên.

Công cụ nướng chạy được đầu-cuối: tải model CC0 → đọc OBJ → ghép mảnh thành nhà →
vẽ bằng WebGL tự viết trong Chromium → xuất atlas PNG + JSON toạ độ.
`tools/tai_asset.mjs` · `tools/lib/obj.mjs` · `tools/lib/xep.mjs` ·
`tools/lib/trang_nuong.js` · `tools/nuong_sprite.mjs` · `tools/xem_atlas.mjs`.

Atlas nằm ở `public/assets/atlas/`. **Chưa gắn vào game** — trang chính và trang đo vẫn
như Phase 0, vẫn dùng atlas giả. Gắn vào là việc của Phase 2.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 15 test · build ·
check:base · check:credits).

Mẻ trung cổ: **120 sprite** nướng từ 4 gói CC0 của Kenney (732 model).

| | 1× | 2× |
|---|---:|---:|
| Trang atlas 2048² | 1 | 1 |
| Lấp đầy | 9,1% | 35,1% |

Tổng 2 trang / trần 4 của TECH_SPEC mục 2. Bản build 920 KB / trần 95 MB.

Trần sprite iPhone (đo 06/09, Phase 0, **atlas giả**): 18.089 sprite ở 60 fps.
Chưa đo lại với atlas thật — xem mục 3.

## 3. Việc của chủ dự án

1. **Xem ảnh 120 sprite** đã gửi trong phiên. Ưng nét vẽ chưa? Không ưng thì nói **ĐỔI …**
   (đổi góc camera, đổi đèn, đổi cỡ, bỏ/thêm sprite) — đổi rẻ, chỉ nướng lại một mẻ.
2. Duyệt sang **Phase 2** nếu ưng.

Chưa cần mở iPhone lần này: atlas chưa gắn vào game nên chưa có gì mới để đo.
Đo lại trần sprite là việc cuối Phase 2, khi thành phố vẽ bằng atlas thật.

## 4. Nợ kỹ thuật

- **Đã tắt thêm 9 skill** trong `.claude/settings.json` (`dataviz` · `design` ·
  `artifact-design` · `artifact-diagramming` · `artifact-capabilities` · `claude-api` ·
  `keybindings-help` · `session-start-hook` · `init`), ước ~1.285 token/phiên.
  **Chưa kiểm chứng** `skillOverrides` có ăn với skill sẵn có của Claude Code không —
  đầu phiên sau đối chiếu danh sách skill mà harness in ra thì biết.
- Atlas **chưa gắn vào game**. `src/bench/AtlasTam.ts` vẫn là atlas giả vẽ bằng Canvas 2D.
- Số 18.089 sprite đo bằng atlas giả 256×256. Atlas thật 2048×2048 nặng băng thông hơn
  nhiều → **phải đo lại cuối Phase 2**. Rớt dưới 1.500 ở cỡ 2× thì lùi về ship 1×.
- Mẻ trung cổ có 120 sprite. Còn thiếu để xây thành phố thật: nhà 2×2 và 3×2, nhà xưởng,
  kho, nhà thờ, quảng trường. Thêm là sửa `tools/me/trung_co.json` rồi `npm run nuong` —
  không đụng code.
- Nature Kit dùng bảng màu khác ba gói kia (lá xanh ngọc), đang chỉnh bằng `mau_vl`.
  Nếu Phase 2 đặt cạnh nhau thấy vẫn lệch thì chỉnh tiếp hệ số, không phải đổi gói.
- `src/render/Gl.ts` vẫn là bản tối thiểu của Phase 0. Phase 2 **mở rộng**, không viết lại.
- `src/sim/` còn rỗng — Phase 3 mới có file đầu tiên.
- **Deploy: GitHub Pages tự động từ `main`** (chốt 06/09), `BASE = '/quoc-chien/'`.
  Máy ảo bị chặn hết nhà cung cấp hosting, chỉ `api.github.com` và `registry.npmjs.org`
  ra được → deploy giao cho máy CI. Repo phải **công khai**.
  Ba chốt chặn phải mở bằng tay (làm xong 06/09): repo công khai ·
  `Settings > Pages > Source: GitHub Actions` · `Settings > Environments > github-pages >
  Deployment branches` phải có `main`.
- `vercel.json` giữ lại, chưa dùng. Muốn quay về Vercel thì sửa `BASE` về `'/'`.
- `CLAUDE.md` vẫn ghi "deploy Vercel" — **chưa sửa**, là file khoá, phải hỏi chủ dự án.
  (`TECH_SPEC.md` đã sửa xong trong phiên này.)
- Máy ảo **không tự mở được trang thật**. Bù lại: bước cuối của `deploy.yml` chạy trên
  máy CI, gọi thử 4 đường và in mã HTTP ra nhật ký — Claude đọc nhật ký qua
  `api.github.com` là tự kiểm được.

## 5. Phase kế tiếp

**Phase 2 — nhìn thấy thành phố**: mở rộng `src/render/Gl.ts`, thêm `IsoMath.ts`
(lưới ô ↔ toạ độ màn hình), `Atlas.ts` (nạp/nhả atlas), `CityScene.ts`.
Bản đồ 64×64 ô, ~300 toà nhà tĩnh vẽ bằng atlas trung cổ vừa nướng.

Xong Phase 2 thì chủ dự án mở PWA trên iPhone, đọc nhãn fps, chạm nút tắt từng lớp,
nhắn về 4 con số. Đó là lần đo thật đầu tiên với atlas thật.
