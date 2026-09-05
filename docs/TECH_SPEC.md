# TECH_SPEC — QUỐC CHIẾN

> Kỹ thuật. Đọc **mục 1 và 2** trước khi viết bất kỳ dòng code render nào.

Lập 05/09/2026.

---

## 1. Ba luật rút từ thất bại của Tây Vực

Tây Vực dừng 04/09/2026 ở 17 fps, máy nóng sau 10-20 giây, sau 43 phiên. Ba nguyên nhân
gốc, và ba luật để không lặp lại:

### Luật 1 — Mô phỏng tách hẳn khỏi phần vẽ

`src/sim/` là **TypeScript thuần**, không import `canvas`, `document`, `window`, WebGL,
hay bất cứ thứ gì của trình duyệt. Hệ quả:

- Chạy được trong Node → `npm run sim:thu` mô phỏng 10 giờ game trong vài giây
- Test tự động được toàn bộ logic — Tây Vực trộn hai thứ nên **không test được gì**,
  mỗi lần sửa phải nhờ chủ dự án mở iPhone thử, hơn chục lần

ESLint phải chặn cứng: file trong `src/sim/` không được import từ `src/render/`,
`src/ui/`, hay API trình duyệt.

### Luật 2 — Đo trước, làm sau

Tây Vực làm ngược: sửa hiệu năng 15 phiên rồi mới dựng công cụ đo, và **chưa ai chạy nó
lần nào**. Lần này:

- **Phase 0 giao trang đo `?do=sprite`**: vẽ N sprite, tăng dần, in ra N tối đa còn 60 fps.
  Chủ dự án mở một lần, nhắn về **một con số**. Con số đó chốt toàn bộ ngân sách đồ hoạ.
- `core/Perf.ts` có mặt từ phiên đầu: nhãn fps + chạm để tắt từng lớp (nền / nhà /
  người / hiệu ứng).
- Máy ảo **không đo được fps** (vẽ bằng phần mềm, luôn 1-5 fps). Nhưng máy ảo **chụp ảnh
  được** bằng Chromium — mọi việc về hình ảnh Claude tự kiểm, chỉ fps mới nhờ người.

### Luật 3 — Trần cứng đặt trước, không đặt sau

Xem mục 2. Vượt trần là lỗi, không phải "tối ưu sau".

---

## 2. Trần hiệu năng — con số cứng

| Hạng mục | Trần | Vì sao |
|---|---:|---|
| Lệnh vẽ mỗi khung hình | **≤ 4** | 1 lệnh cho mỗi atlas, gom hết sprite |
| Sprite động mỗi khung hình | **≤ 1.500** | Ước tính từ màn hình 874×402, dpr chặn ở 2 |
| Atlas trong bộ nhớ cùng lúc | **≤ 4 × (2048×2048)** | ≈ 67 MB bộ nhớ GPU (4 × 2048² × 4 byte). Tây Vực chết một phần vì 322 tấm ảnh rác |
| `setPixelRatio` | `min(dpr, 2)` | Giống Tây Vực — dpr 3 trên iPhone là gấp 2,25 lần công vẽ |
| Nhịp mô phỏng | **10 Hz**, tách khỏi vòng vẽ | Vẽ 60 fps, sim 10 Hz, nội suy vị trí giữa hai nhịp |
| Kích thước bản build | ≤ 95 MB | CI chặn |
| Mỗi file `.ts` | ≤ 300 dòng | Vượt thì tách module |
| Thư viện đồ hoạ ngoài | **0** | Xem mục 4 |

**Đổi thời đại thì nhả atlas cũ** (`gl.deleteTexture`), không giữ lại "phòng khi cần".

---

## 3. Nướng sprite từ model 3D

### Vì sao

Age of Empires 2, StarCraft, Red Alert, Zeus, Caesar III **đều không vẽ tay sprite** —
họ dựng model 3D rồi chụp từ góc chéo cố định. Ta làm y hệt vì:

1. **Một phong cách duy nhất cho cả 6 thời đại** — cùng camera, cùng đèn, cùng hậu kỳ.
   Không có bộ sprite 2D miễn phí nào phủ được cổ đại → tương lai bằng cùng nét vẽ.
2. **Đẹp hơn mà không tốn hiệu năng**: bóng mềm, khuất sáng, viền nét nướng sẵn vào ảnh.
3. **Tái dùng 269 MB model CC0** đã tải cho Tây Vực.
4. **Claude tự nhìn được kết quả** trong máy ảo.

### Cách chạy

`tools/nuong_sprite.mjs`:

1. Mở Chromium sẵn có (`/opt/pw-browsers/chromium`) qua `tools/lib/cdp.mjs` —
   **chép từ Tây Vực, không cần thư viện nào**
2. Trang tạm dựng model bằng three.js, camera **trực giao**, góc chéo cố định
3. Chụp mỗi model ở **8 hướng xoay** × N khung chuyển động
4. Cắt nền trong suốt, xếp vào atlas, xuất PNG + `.json` toạ độ
5. In bảng: model nào, bao nhiêu khung, atlas chiếm bao nhiêu phần trăm

Chạy **một lần lúc chuẩn bị asset**, không chạy lúc chơi.

### Góc camera

Isometric chuẩn 2:1 — ô nền `64×32` px ở cỡ 1×. Camera trực giao, xoay 45° quanh trục
đứng, nghiêng 30° (`atan(0.5)` ≈ 26,57° cho 2:1 chính xác; dùng 30° cho dễ nhìn, chốt
bằng mắt ở Phase 1).

### Cỡ sprite

| Loại | Cỡ 1× | Cỡ 2× |
|---|---|---|
| Ô nền | 64×32 | 128×64 |
| Nhà nhỏ | 128×128 | 256×256 |
| Nhà lớn | 256×256 | 512×512 |
| Người / lính | 48×64 | 96×128 |

Nướng cả hai cỡ. **Ship 1× mặc định**; 2× chỉ bật nếu trang đo Phase 0 cho phép.

### Ngân sách atlas cho lính

8 hướng × 4 dáng (đi, đánh, trúng đòn, chết) × 6 khung = **192 khung** mỗi loại lính.
Ở 48×64 px là ≈ 590.000 px². Một atlas 2048² chứa 4.190.000 px² → **khoảng 7 loại lính
mỗi atlas**.

Chật. Phương án lùi nếu vượt trần: **giảm còn 4 hướng** (như nhiều game 2D cũ) → 96 khung
→ ~14 loại lính mỗi atlas. Quyết định bằng số thật ở Phase 10, không đoán trước.

### Gắn chuyển động — tái dùng của Tây Vực

Tây Vực đã có hệ ánh xạ xương **theo tên** (`data/animations.json`, `data/bone_map.json`)
để gắn một bộ chuyển động chung vào nhiều model xương khác nhau, cùng
`tests/AnimationRetarget.test.ts` bắt đỏ nếu thiếu ánh xạ. **Chép nguyên sang dùng trong
công cụ nướng.** Đây là phần khó nhất của việc nướng lính và nó đã làm xong.

Cảnh báo giữ nguyên từ Tây Vực: model xương lạ mà không ánh xạ lại thì **đứng đờ ra mà
không báo lỗi gì**.

### Nguồn model — đã kiểm tra tải được từ máy ảo

`kenney.nl`, `opengameart.org`, `itch.io` đều trả 200 (khác `vercel.app` bị chặn 403).

| Thời đại | Nguyên liệu | Đánh giá |
|---|---|---|
| Cổ đại | Lều, chòi gỗ từ KayKit / Quaternius | Yếu, chỉnh nhiều |
| Trung cổ | KayKit `medieval-builder` + Quaternius `medieval-village-megakit` | **Rất mạnh, có sẵn** |
| Súng ống / cận đại | Chắp từ trung cổ + city kit | **Yếu nhất** |
| Công nghiệp | Kenney Factory Kit, City Kit (Industrial) | Tốt |
| Hiện đại | Kenney City Kit (Commercial/Roads), Car Kit, Quaternius `street` | Tốt |
| Tương lai | Kenney Modular Space Kit, Blaster Kit | Tốt |

Nên nướng **trung cổ trước**, rồi hiện đại, tương lai, cuối cùng vá cổ đại và cận đại.

### Hai kho tách riêng (giữ luật của Tây Vực)

- `assets_source/` — gói tải về nguyên vẹn, **không lên máy chủ**
- `public/assets/` — chỉ atlas đã nướng mà game thật sự dùng

---

## 4. Bộ vẽ — WebGL tự viết, không thư viện

WebKit có lỗi hiệu năng đã ghi nhận (bug 181244): gọi `drawImage()` hàng nghìn lần với
ảnh nhỏ thì Safari chậm. Đó **đúng là** việc game này làm mỗi khung hình → **không dùng
Canvas 2D cho lớp sprite**.

`render/Gl.ts` (~300 dòng):

- Một buffer đỉnh động, mỗi sprite là 2 tam giác
- Gom toàn bộ sprite cùng atlas → **một lệnh `drawArrays`**
- Sắp xếp theo trục sâu isometric (`y + x`) trước khi nạp buffer
- Không depth buffer, dùng thứ tự vẽ (painter's algorithm)

Phương án lùi nếu trang đo Phase 0 cho thấy không đạt: **PixiJS** (MIT).
Theo luật, phải **hỏi chủ dự án trước khi cài**, không tự quyết.

Canvas 2D vẫn dùng được cho: HUD, thẻ quyết định, bản đồ chiến dịch (ít phần tử, tĩnh).

---

## 5. Cấu trúc thư mục

```
src/
  sim/                    ← TypeScript thuần, ESLint chặn import trình duyệt
    Clock.ts              nhịp 10 Hz; tốc độ 0 / 1× / 2× / 4× / 8×
    State.ts              trạng thái toàn ván
    city/                 Wares · Walkers · Buildings · Chains · Citizens · Order
    campaign/             Provinces · Armies · Battle · BattleScript · Diplomacy · Rival
    meta/                 Research · Eras · Policies · Victory
    autoplay/             Governor · Policy
  decision/               Engine · Effects
  render/
    Gl.ts                 bộ vẽ WebGL, 1 lệnh vẽ mỗi atlas
    IsoMath.ts            lưới ô ↔ toạ độ màn hình
    Atlas.ts              nạp / nhả atlas
    CityScene.ts · MapScene.ts · BattleScene.ts
  ui/                     Hud · DecisionCard · PolicyBar · SpeedBar · Log
  core/
    AssetPath.ts          chép từ Tây Vực — luật đường dẫn gốc
    Perf.ts               nhãn fps + nút tắt từng lớp
  save/Save.ts            localStorage, offline hoàn toàn

tools/
  nuong_sprite.mjs        model 3D → atlas PNG
  lib/cdp.mjs             chép từ Tây Vực — điều khiển Chromium, không cần thư viện
  do_sprite.mjs           dựng trang đo

data/                     ← MỌI số cân bằng, cấm hardcode trong .ts
  eras · nations · wares · buildings · chains · provinces · units
  armor_table · tech · eureka · policies · victory · decisions · balance   (.json)
```

---

## 6. iOS và PWA

Giữ nguyên những gì Tây Vực đã làm được (chủ dự án xác nhận chạy tốt):

- PWA cài lên màn hình chính, **không thanh địa chỉ**
- Tự xoay ngang, tôn trọng vùng an toàn (trên 62 px, dưới 34 px trên iPhone 16 Pro)
- Màn hình tham chiếu **874×402** CSS px nằm ngang
- Offline hoàn toàn — không gọi mạng lúc chơi

---

## 7. Đường dẫn gốc — sai là PWA mở ra trang trắng

Chép nguyên luật của Tây Vực:

- `vite.config.ts` khai **một hằng số duy nhất** `const BASE = '/'`, quyết định `base`
  của Vite, `start_url`, `scope`, icon manifest. Đổi nơi phục vụ thì **chỉ sửa đúng dòng đó**.
- Mọi đường dẫn asset **bắt buộc** đi qua `assetUrl()` của `src/core/AssetPath.ts`.
  Cấm viết `'/assets/...'` hay `'/icons/...'` thẳng trong code hay CSS.
- `npm run check:base` (build trước) đối chiếu, CI chặn nếu lệch.

---

## 8. Test bắt buộc

Ba chỗ **phải** có test, giống luật Tây Vực, cộng thêm hai chỗ riêng của game này:

| Chỗ | Test gì |
|---|---|
| Tính sát thương | Bảng giáp × đạn ra đúng số |
| Sinh chỉ số ngẫu nhiên | Cùng hạt giống → cùng kết quả |
| Bảng rơi đồ / phần thưởng | Tỉ lệ đúng như khai trong JSON |
| **Chuỗi sản xuất** | Chạy 10 giờ game, không có hàng âm, không kẹt vĩnh viễn |
| **Kịch bản trận** | Kết quả kịch bản khớp đúng kết quả `Battle.ts` đã tính |

Thêm: `tests/SimKhongDungTrinhDuyet.test.ts` — quét `src/sim/` bắt lỗi nếu có import
trình duyệt (đây là hàng rào của Luật 1).

---

## 9. Thư viện ngoài

Cho phép sẵn: `vite`, `typescript`, `eslint`, `vitest`, `vite-plugin-pwa`.
`three` chỉ dùng trong `tools/` (nướng sprite), **không vào bản build của game**.

Mọi thư viện khác: đề xuất tên + license + lý do, **chờ chủ dự án đồng ý**, không tự cài.

---

## 10. Lệnh

**Trước khi commit luôn chạy đủ:**
```
npm run lint && npm run typecheck && npm test && npm run build
```

| Lệnh | Việc |
|---|---|
| `dev` · `preview` · `lint:fix` | như thường |
| `check:base` | đối chiếu đường dẫn gốc (build trước) |
| `check:credits` | mọi asset trong `public/` có mặt trong `ASSET_CREDITS.md` |
| `nuong:sprite` | nướng một mẻ atlas từ model 3D |
| `sim:thu` | chạy 10 giờ game trong Node, in bảng số |
| `sim:tran` | chạy 1000 trận, in tỉ lệ thắng so với dự đoán |
| `chup:man` | chụp màn hình game bằng Chromium trong máy ảo |
