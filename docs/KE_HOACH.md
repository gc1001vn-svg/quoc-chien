# KẾ HOẠCH — QUỐC CHIẾN

> **Mỗi phiên đúng một phase.** Đầu phiên đọc file này. Đổi ý giữa chừng thì **thêm một
> dòng vào mục 4 ở cuối**, không viết lại cả file.

Lập 05/09/2026. Duyệt bởi chủ dự án cùng ngày.

---

## 1. Cách làm việc

### Anh nhìn thấy kết quả sớm, không phải đợi

Máy ảo có sẵn Chromium. **Claude tự chụp màn hình rồi gửi ảnh thẳng vào phiên** — chủ dự
án không phải mở gì, chỉ nhìn ảnh rồi nói ưng hay không.

| Phase | Nhìn thấy gì |
|---|---|
| 1 | Ảnh atlas sprite đã nướng — nhà cửa trung cổ. Ưng nét vẽ chưa? |
| 2 | Ảnh thành phố isometric. Giống hình mẫu chưa? |
| 6 | Ảnh thẻ quyết định. Câu hỏi có thú vị không? |
| 10 | Ảnh trận đánh |

**Chỉ fps là không tự đo được** — chỗ đó phải nhờ mở iPhone.

### Ba chữ dùng trong phiên

| Chủ dự án gõ | Claude làm gì |
|---|---|
| **TIẾP** | Phase này ổn, sang phase sau |
| **ĐỔI ...** | Sửa trong phase hiện tại, **không đụng phase sau** |
| **LỖI** | Dừng ngay, sửa lỗi trước mọi thứ khác |

Một phase làm xong mà không ưng → **sửa trong phase đó**, không kéo theo sửa kế hoạch
của các phase còn lại.

### Đổi rẻ và đổi đắt

Toàn bộ nội dung game nằm trong `data/*.json`, không nằm trong code. Nên **phần lớn thứ
muốn đổi là đổi rẻ**:

| Đổi RẺ — nói lúc nào cũng được | Sửa ở đâu |
|---|---|
| Thêm/bớt tài nguyên, chuỗi sản xuất | `chains.json` |
| Thêm/bớt toà nhà, lính, công nghệ | JSON + nướng thêm sprite |
| Nội dung và tần suất thẻ quyết định | `decisions.json` |
| Thẻ chính sách, điều kiện thắng | `policies.json`, `victory.json` |
| Thời đại nào làm trước | Đổi thứ tự phase |
| Tên nước, đặc tính, bối cảnh | `nations.json` |
| Trận đánh dài ngắn, bao nhiêu lính | `balance.json` |
| Màu sắc, góc camera, cỡ sprite | Nướng lại một mẻ |

| Đổi ĐẮT — nói càng sớm càng tốt | Vì sao |
|---|---|
| 2D → 3D | Vứt gần hết phần vẽ. **Đây là thứ đã giết Tây Vực** |
| Bỏ chia ba lớp, làm một bản đồ liền | Viết lại `src/sim/` |
| Người chơi điều khiển trực tiếp | Đổi bản chất game |
| Chơi mạng, nhiều người | Cả kiến trúc phải khác từ đầu |

---

## 2. Mười ba phase

| Phase | Nội dung | Xong thì có gì |
|---|---|---|
| **0** | Khung repo: Vite + TS strict + ESLint + vitest + PWA + CI + Vercel + `AssetPath` + `Perf` + **trang đo sprite** | Cài được lên iPhone. Chủ dự án nhắn về **N sprite tối đa còn 60 fps** |
| **1** | `tools/nuong_sprite.mjs`: model 3D → atlas. Nướng mẻ **trung cổ** (nhà cửa, cây cối, ô nền) | Claude tự xem ảnh, chỉnh tới khi đẹp, rồi gửi ảnh |
| **2** | `render/Gl.ts` + `IsoMath` + `CityScene`. Bản đồ 64×64 ô, ~300 toà nhà tĩnh | **Nhìn thấy thành phố.** Chủ dự án đo fps thật |
| **3** | `sim/city/`: `Wares`, `Buildings`, `Chains`. Headless, chưa vẽ | `npm run sim:thu` chạy 10 giờ game trong Node, in bảng tài nguyên |
| **4** | `sim/city/Walkers.ts` — người đi bộ giao hàng, phục vụ. Chiều sâu K&M | Thành phố sống động. **Chỗ nặng nhất — đo kỹ** |
| **5** | `sim/autoplay/Governor.ts` + `Policy.ts` + thống đốc thăng cấp | Thành phố tự lớn, không cần ai bấm |
| **6** | `decision/Engine.ts` + `ui/DecisionCard.ts` + nhật ký sự kiện | **GAME CHƠI ĐƯỢC** — lớp thành phố, thời trung cổ |
| **7** | `sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, nước khác | Nhìn thấy thế giới ngoài thành phố |
| **8** | `sim/meta/`: cây công nghệ, Eureka, lên thời đại, thẻ chính sách. Nướng mẻ **hiện đại** | Thành phố tiến hoá trước mắt |
| **9** | `sim/campaign/Battle.ts` + `BattleScript.ts`: bảng giáp×đạn, quân đi trên bản đồ. Headless | `npm run sim:tran` chạy 1000 trận, cân bằng. Chưa nhìn thấy gì |
| **10** | Nướng sprite lính 8 hướng × 4 dáng + `render/BattleScene.ts` | **Xem được trận đánh**, 30-60 giây |
| **11** | Ngoại giao đầy đủ + trật tự công cộng + 4 điều kiện thắng | **GAME TRỌN MỘT VÒNG, có kết thúc** |
| **12** | Nướng nốt cổ đại / cận đại / tương lai + thêm nước | Đi suốt tới tương lai |
| **13** | Âm thanh (51 tiếng Kenney có sẵn), lưu ván, đánh bóng | Hoàn chỉnh |

**Ba mốc:** Phase 6 (chơi được) · Phase 10 (xem được trận) · Phase 11 (trọn một vòng).

Đến Phase 6 mà thấy chán thì dừng được, không mất trắng.

---

## 3. Cách kiểm tra từng phase

| Phase | Kiểm bằng gì |
|---|---|
| Mọi phase | `npm run lint && npm run typecheck && npm test && npm run build` xanh **và** CI GitHub xanh |
| 0 | Chủ dự án mở trang đo trên iPhone, nhắn N tối đa còn 60 fps |
| 1 | Claude mở ảnh atlas trong máy ảo, **nhìn tận mắt** trước khi đưa vào `public/`. Gửi ảnh cho chủ dự án |
| 2, 4 | Chủ dự án mở PWA, đọc nhãn fps, chạm nút tắt từng lớp, nhắn 4 con số |
| 3 | `npm run sim:thu` — không có hàng âm, không chuỗi nào kẹt vĩnh viễn |
| 5 | Chạy sim 10 giờ không người bấm, thành phố phải tự lớn hợp lý |
| 6 | Chủ dự án chơi thật 20 phút, xem thẻ quyết định có thú vị không |
| 9 | `npm run sim:tran` — tỉ lệ thắng thật khớp với dự đoán |
| 10 | Claude tự xem trận trong máy ảo. Chủ dự án đo fps lúc đánh |
| 11 | Chạy hết một ván tới lúc thắng — **cả bốn kiểu thắng đều đến được** |

---

## 4. Nhật ký thay đổi kế hoạch

> Chỉ **thêm** dòng, **không xoá**, **không viết lại** các dòng cũ.

| Ngày | Đổi gì | Vì sao |
|---|---|---|
| 05/09/2026 | Lập kế hoạch bản 1: 2D isometric, repo mới `quoc-chien`, kinh tế sâu K&M, một ván đi suốt 6 thời đại | Chủ dự án chốt qua 6 câu hỏi |
| 05/09/2026 | Bản 2: thêm **nướng sprite từ model 3D**; học 7 game mã nguồn mở | Chủ dự án yêu cầu tra game mã nguồn mở và nâng chất lượng đồ hoạ |
| 05/09/2026 | Bản 3: thêm **chia ba lớp** (Total War) và **thẻ chính sách / Eureka / điều kiện thắng** (Civilization) | Chủ dự án bổ sung hai game mẫu |
| 05/09/2026 | Bản 4: **sân khấu trận đánh** — trận phải xem được, không chỉ ra một con số | Bản 3 cắt nhầm phần này. Chủ dự án chỉ ra |
| 05/09/2026 | Bản 5: thêm mục 1 của file này — cách sửa kế hoạch giữa chừng, đổi rẻ / đổi đắt | Chủ dự án muốn tránh cảnh sửa đi sửa lại quy trình như dự án trước |
| 11/09/2026 | **Phase 8 tách làm 8A và 8B.** 8A: `sim/meta/` (cây công nghệ, Eureka, thời đại, thẻ chính sách). 8B: nướng mẻ sprite hiện đại | Dò kho thấy `city-builder-bits` chỉ có **8 dáng nhà** mà game có **32 loại**. Ghép 32 về 8 là quyết định phải nhìn ảnh thật, không nên chốt mù cùng phiên với việc viết luật chơi. Chủ dự án chốt 11/09 |
