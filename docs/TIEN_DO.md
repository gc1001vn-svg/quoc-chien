# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase nằm ở `docs/NHAT_KY/PHASE_*.md`.

Cập nhật: 06/09/2026.

## 1. Đang ở đâu

**Phase 1 — XONG phần máy ảo kiểm được.** Đã có atlas sprite thật đầu tiên.

Công cụ nướng chạy được đầu-cuối: tải model CC0 → đọc OBJ → ghép mảnh thành nhà →
vẽ bằng WebGL tự viết trong Chromium → xuất atlas PNG + JSON toạ độ.
`tools/tai_asset.mjs` (Kenney) · `tools/tai_itch.mjs` (itch.io) · `tools/lib/obj.mjs` ·
`tools/lib/xep.mjs` · `tools/lib/trang_nuong.js` · `tools/nuong_sprite.mjs` ·
`tools/xem_atlas.mjs`.

Atlas nằm ở `public/assets/atlas/`. **Chưa gắn vào game** — trang chính và trang đo vẫn
như Phase 0, vẫn dùng atlas giả. Gắn vào là việc của Phase 2.

## 2. Số đo mới nhất

`bash scripts/do.sh` → **6/6 thước đạt** (lint · typecheck · test 15 test · build ·
check:base · check:credits).

Mẻ trung cổ: **147 sprite** nướng từ 4 gói CC0 của Kenney + KayKit Medieval Builder Pack.

| | 1× | 2× |
|---|---:|---:|
| Trang atlas 2048² | 1 | 2 |
| Lấp đầy | 29,7% | 82,8% + 32,9% |

Tổng **3 trang / trần 4** của TECH_SPEC mục 2. Bóng đổ nới hộp bao từng sprite nên ăn
thêm chỗ — thêm mẻ nữa là vượt trần, xem nợ kỹ thuật.

Trần sprite iPhone (đo 06/09, Phase 0, **atlas giả**): 18.089 sprite ở 60 fps.
Chưa đo lại với atlas thật — xem mục 3.

## 3. Việc của chủ dự án

1. **Xem ảnh 147 sprite** đã gửi trong phiên. Ưng nét vẽ chưa? Không ưng thì nói **ĐỔI …**
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
- Mẻ trung cổ có 147 sprite, đã có công trình 2×2 của KayKit. Còn thiếu: nhà thờ,
  quảng trường, kho. Thêm là sửa `tools/me/trung_co.json` rồi `npm run nuong`.
- **KayKit City Builder Bits** đã tải về `assets_source/` nhưng **chưa nướng** — là đồ
  hiện đại (ô tô, nhà cao tầng, đèn giao thông), để dành Phase 8.
- **Atlas đã dùng 3/4 trang.** Bóng đổ nới hộp bao mỗi sprite. Muốn hạ xuống thì cắt sát
  theo kênh alpha thay vì theo hộp bao hình học — chưa làm, làm khi nào chạm trần.
- `tools/xem_canh.mjs` mới dựng cảnh bằng CSS. Nó đã kiểm đúng phần toán `ox`/`oy` mà
  Phase 2 sẽ dùng, nhưng **chưa phải** `IsoMath.ts` — Phase 2 vẫn phải viết bản TypeScript
  có test.
- Chưa tìm được kho **gigalomania** (SourceForge, `api.github.com/search` bị khoá theo
  phiên). Đó là game đáng đọc nhất về một ván đi suốt nhiều thời kỳ — tìm lại phiên sau.
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

Hai luật đã chốt sẵn cho Phase 2, xem `TECH_SPEC.md` mục 3:
1. **Vẽ hết lớp nền trước, rồi mới tới lớp vật thể.** Trộn hai lớp theo độ sâu thì ô nền
   phía sau đè lên bóng đổ của nhà phía trước.
2. Vị trí sprite: `x = (a − b) · o_px/2 − ox`, `y = (a + b) · o_px/4 − oy`.

Xong Phase 2 thì chủ dự án mở PWA trên iPhone, đọc nhãn fps, chạm nút tắt từng lớp,
nhắn về 4 con số. Đó là lần đo thật đầu tiên với atlas thật.
