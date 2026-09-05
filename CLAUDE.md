# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline chạy web, cài lên iPhone dạng PWA, deploy Vercel.
**Máy ảo bị chặn `vercel.app` (403)** — không tự xem được trang thật.
Nhưng máy ảo **có Chromium**: chạy `npm run dev` rồi `npm run chup:man` là tự nhìn được.
Chỉ **fps** mới phải nhờ chủ dự án mở iPhone.

## Đọc tài liệu — đúng mục, không đọc cả file

- `docs/TIEN_DO.md`: **đọc cả file, đầu mỗi phiên**.
- `docs/KE_HOACH.md`: đọc mục 1 (cách làm việc) + dòng của phase đang làm.
- `docs/GAME_SPEC.md` (thiết kế, nguồn sự thật) · `docs/TECH_SPEC.md` (kỹ thuật, trần
  hiệu năng) · `docs/THAM_KHAO.md` (tám game mẫu) · `docs/NHAT_KY/PHASE_*` (lịch sử):
  `grep -n '^#'` xem mục lục → `Read` với `offset`/`limit` đúng mục.
- Người dùng nói gì mâu thuẫn với GAME_SPEC/TECH_SPEC → **hỏi lại**, không tự quyết.

## Làm việc với chủ dự án

Chủ dự án **không biết lập trình**, làm **trên iPhone**, không có máy tính bên cạnh.

- Trả lời **tiếng Việt đơn giản**, từng bước bấm gì ở đâu, không thuật ngữ.
  In **link đầy đủ** lấy từ `git remote`.
- **Mỗi phiên đúng một phase.** Đầu phiên: đọc `TIEN_DO.md` → **Plan Mode** chờ duyệt.
- **TIẾP** = phase trước xong, sang phase kế · **ĐỔI ...** = sửa trong phase hiện tại,
  không đụng phase sau · **LỖI** = dừng, sửa lỗi trước.
- **Có ảnh thì gửi ảnh.** Việc gì nhìn được thì tự chụp bằng `npm run chup:man` rồi gửi
  file vào phiên — đừng bắt chủ dự án mở máy để xem hộ.
- **KHÔNG BAO GIỜ** báo phase "hoàn thành" khi chưa có xác nhận mở thử trên iPhone thật
  — ghi "chờ xác nhận". Gộp code **không phải** là hoàn thành.
- **Tự tạo và tự gộp PR.** Chỉ gộp khi **cả** lệnh kiểm tra trong máy **và** CI GitHub
  đều xanh. Dừng lại hỏi khi: xung đột, CI đỏ, hoặc thay đổi cần họ quyết.
- Cuối phiên cập nhật **hai chỗ**, rồi **bắt buộc** in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`:
  1. `docs/NHAT_KY/PHASE_<đang làm>.md` — **tối đa ~15 dòng**: làm gì, sửa file nào, nợ gì.
  2. `docs/TIEN_DO.md` mục 1–5 — **ghi đè**, không cộng dồn, dưới ~10.000 ký tự.

## Luật code

- TypeScript strict, khai kiểu mọi tham số và giá trị trả về. **Cấm `any`** (ESLint chặn).
- **Mỗi file tối đa 300 dòng**, vượt thì tách module.
- **`src/sim/` là TypeScript thuần** — cấm import `document`, `window`, canvas, WebGL,
  hay bất cứ thứ gì của trình duyệt. ESLint chặn cứng, `tests/SimKhongDungTrinhDuyet.test.ts`
  bắt đỏ. Đây là luật quan trọng nhất của dự án: nó cho phép chạy 10 giờ game trong Node
  và test được toàn bộ logic.
- **Cấm hardcode số cân bằng trong `.ts`** — sát thương, sản lượng, chi phí, tỉ lệ, nhịp
  hỏi quyết định… đều đọc từ `data/*.json`. Thấy số cân bằng trong code → sai.
- Test **bắt buộc** năm chỗ: tính sát thương · sinh chỉ số ngẫu nhiên · bảng rơi đồ ·
  chuỗi sản xuất chạy 10 giờ không kẹt · kịch bản trận khớp kết quả đã tính.
- Comment và tài liệu tiếng Việt; tên biến, tên hàm tiếng Anh.
- Mỗi commit một việc, message tiếng Việt **không dấu**: `feat: them he thong walker`.
- Trước khi viết code render, đọc **TECH_SPEC mục 2** (trần lệnh vẽ, sprite, atlas, dpr).

## Trần hiệu năng — vượt là lỗi, không phải "tối ưu sau"

≤ **4 lệnh vẽ** mỗi khung hình · ≤ **1.500 sprite động** · ≤ **4 atlas 2048×2048** trong
bộ nhớ cùng lúc (đổi thời đại thì `deleteTexture` atlas cũ) · `setPixelRatio(min(dpr,2))` ·
sim **10 Hz** tách khỏi vòng vẽ · bản build ≤ 95 MB · **không thư viện đồ hoạ ngoài**.

## Đường dẫn gốc — sai là PWA mở ra trang trắng

`vite.config.ts` khai **một hằng số duy nhất** `const BASE = '/'` quyết định `base` của
Vite, `start_url`, `scope`, icon manifest — đổi nơi phục vụ thì **chỉ sửa đúng dòng đó**.
Mọi đường dẫn asset **bắt buộc** đi qua `assetUrl()` của `src/core/AssetPath.ts`; cấm viết
`'/assets/...'` hay `'/icons/...'` thẳng trong code hay CSS. `npm run check:base` (build
trước) đối chiếu, CI chặn nếu lệch.

## Asset và bản quyền

- Hai kho tách riêng: `assets_source/` (gói tải về nguyên vẹn, **không** lên máy chủ) và
  `public/assets/` (chỉ atlas game **thật sự dùng**).
- **Sprite nướng từ model 3D** bằng `npm run nuong:sprite` — không đi nhặt sprite 2D rời
  rạc. Lý do và cách làm: `TECH_SPEC.md` mục 3.
- License **chỉ CC0 · CC-BY · MIT**, ghi ngay vào `docs/ASSET_CREDITS.md` lúc thêm.
  **CC-BY-SA không dùng được** — lây license sang cả dự án.
- Nhân vật và quái phải cử động được. Bộ chuyển động chung khớp xương **theo tên**
  (`data/animations.json`, `data/bone_map.json`) — model xương lạ mà không ánh xạ lại là
  **đứng đờ ra mà không báo lỗi gì**. `tests/AnimationRetarget.test.ts` bắt đỏ nếu thiếu.
- Nội dung **nguyên gốc** — không sao chép tên đơn vị đặc chế, tên địa danh hư cấu, cốt
  truyện, model, texture, bố cục bản đồ từ game thương mại. Repo GPL/AGPL **chỉ đọc học
  kiến trúc, không copy-paste code**. Chi tiết: `docs/THAM_KHAO.md` mục 1.
- Thư viện ngoài **TECH_SPEC mục 9** → đề xuất tên + license + lý do, **chờ đồng ý**,
  không tự cài.

## Lệnh

**Trước khi commit luôn chạy đủ:** `npm run lint && npm run typecheck && npm test && npm run build`

Còn lại: `dev` · `preview` · `lint:fix` · `check:base` · `check:credits` · `nuong:sprite`
(nướng atlas) · `sim:thu` (10 giờ game trong Node) · `sim:tran` (1000 trận) · `chup:man`
(chụp màn hình bằng Chromium) · `test:watch`.

Vercel tự deploy mỗi lần `main` đổi.

## Hỏi chủ dự án trước khi đụng vào

`docs/GAME_SPEC.md` · `docs/TECH_SPEC.md` · `docs/KE_HOACH.md` · `docs/THAM_KHAO.md` ·
`docs/ASSET_CREDITS.md` · `CLAUDE.md` · `.github/workflows/ci.yml` · `vercel.json` ·
`scripts/check_base_path.mjs` · `vite.config.ts`

`docs/TIEN_DO.md`, `docs/KE_HOACH.md` mục 4 và `docs/NHAT_KY/*.md`: chỉ được **thêm**,
**không xoá lịch sử**.
