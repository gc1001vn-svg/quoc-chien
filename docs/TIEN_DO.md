# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 11/09/2026 (Phase 6C — trả nợ rà soát, lợn và cừu thật).

## 1. Đang ở đâu

Phase 6/13 xong. Phiên 11/09 định mở Phase 7 nhưng **dừng lại để vá quy trình** — chủ dự
án hỏi hai câu làm lộ ra chuỗi lỗi rà soát kéo dài nhiều phiên.

**Con số model trong kho sai suốt từ đầu.** `kho_asset.mjs` khử trùng tên trong từng thư
mục, mà mỗi gói xuất ra `fbx/` `gltf/` `obj/` là ba thư mục riêng nên mỗi model đếm ba
lần. Số này lại còn gõ tay ở ba file nên lệch nhau qua các phiên: **1.855 → 2.781 →
3.946**, trong khi thật sự dùng được chỉ **1.222**. Kế hoạch dựa trên số phồng nên luôn
lạc quan sai: tưởng kho thừa model, hoá ra thiếu.

**Ba lỗ hổng chỉ lộ khi chạy thật**, không lộ khi đọc code: `tai_itch.mjs` không chịu
được 429 của itch · `tai:tatca` không tải hoạ tiết nên nướng sập · `check:credits` chỉ
kiểm tên file atlas nên thêm gói mới quên ghi công vẫn ĐẠT.

**Lợn và cừu thật.** Chủ dự án chỉ ra ba trại chăn nuôi dùng chung một hàng rào chỉ khác
màu nền — đúng. Đã tải `quaternius/lowpoly-animated-animals` (CC0) và gắn `Pig`, `Sheep`.
**`trai_ga` vẫn không có gà**, không gói nào có.

Chi tiết: `docs/NHAT_KY/PHASE_6C.md`.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| Model trong kho — số **dùng được** | ghi 3.946 (sai) | **1.222** (3.960 lượt file · 1.482 tên) |
| Gói asset đã tải | 9 | **10** + 6 hoạ tiết Poly Haven (~1 GB) |
| Trang atlas | 2 | 2 (trần 4) |
| Sprite trong mẻ `trung_co_2` | 74 | 74 |

`npm run do` → **6/6 thước** · **133 test**.

**Chốt chặn mới, dựng bằng code chứ không bằng lời hứa:**

| Chốt | Ở đâu |
|---|---|
| Đếm ba số riêng, nói rõ số nào được trích dẫn | `kho_asset.mjs` |
| Dừng khi số model tụt >20% (ép bằng `KHO_EP=1`) | `kho_asset.mjs` |
| Chịu được 429, nghỉ tăng dần 5/10/15/20s | `tai_itch.mjs` |
| Kiểm cả **gói nguồn**, không chỉ tên file atlas | `check_credits.mjs` |
| Bảy bước đầu phiên A–G | `docs/DAU_PHIEN.md` |
| Bỏ hết số gõ tay, chỉ trỏ nguồn sinh tự động | `CLAUDE.md` · `TIEN_DO.md` |

Kho `ghi-nho` thêm ba quyết định: đọc hết ba file cấm cắt · bảy bước đầu phiên · số liệu
phải sinh từ lệnh và phải đếm đúng đơn vị.

## 3. Việc của chủ dự án

**Không có việc gì phải kiểm.** Lợn và cừu anh đã xác nhận thấy trên iPhone 11/09.

Phiên sau mở Phase 7 — xem mục 5.

## 4. Nợ đang chặn phase kế tiếp

- **`trai_ga` không có model gà.** Dò hết 10 gói: Kenney · Quaternius ×6 · KayKit ×3, đều
  không có. Trại gà còn phân biệt bằng chuồng + màu nền. Muốn có gà phải tìm nguồn mới —
  `NGUON_MO.md` mục 8.
- **Lò và xưởng vẫn dùng chung dáng.** `lo_mo` và `lo_gom` cùng `qv:Floor_Brick` màu chênh
  3%; `lo_thep` là tháp canh tô xám; `lo_banh` và `xuong_det` đều là chợ. Kho không có
  `kiln` `furnace` `forge` `oven` `bakery` `tannery` `weaver` — cả 12 từ khoá đều 0 kết
  quả. **Chủ dự án chốt 11/09: giữ nguyên.**
- **Người vác hàng đi tay không** — chốt để Phase 10, nướng cùng bộ 8 hướng × 4 dáng.
- **Mỗi kho chưa có túi hàng riêng** (chốt tạm 08/09).
- Mới có **6 thẻ**, đều là thẻ kinh tế. Thẻ chính sách, công nghệ, quân sự, ngoại giao
  thuộc Phase 8/9/11.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase kế tiếp — Phase 7: bản đồ tỉnh (PHIÊN MỚI)

`sim/campaign/` + `render/MapScene.ts`: bản đồ tỉnh giấy da, ô xây dựng, các nước khác.
Nhìn thấy thế giới ngoài thành phố.

**Asset đã dò sẵn:** gói `kaykit-medieval-hexagon` có ô lục giác và nhà theo **5 màu**
(xanh dương · xanh lá · đỏ · vàng · trung lập) — bốn phe cộng bên trung lập, đúng thứ
Phase 7 cần. Không phải tải thêm.

**Ba điều chủ dự án chốt trước khi lập kế hoạch:**

1. Bản đồ tỉnh dùng **ô lục giác** (theo gói có sẵn) hay **ô vuông isometric** như thành phố?
2. Bao nhiêu **nước**, bao nhiêu **tỉnh** cho bản đầu?
3. Phase 7 chỉ **nhìn được** bản đồ, hay bấm vào tỉnh **xây được luôn**?

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G, không bỏ bước nào.
