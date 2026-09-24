# Phase 9 — trận đánh chạy ngầm (24/09)

## Bối cảnh

Đúng `KE_HOACH.md` mục 2: `Battle.ts` + `BattleScript.ts`, headless, chưa nhìn thấy gì.
Thước mục 3: `npm run sim:tran` chạy 1000 trận, **tỉ lệ thắng thật khớp dự đoán**.
Thiết kế: `GAME_SPEC.md` mục 6 (tính trước, diễn sau · 6–10 đội/bên · 40×40 ô · giáp×đạn).
Bước E đã hết treo (59 fps 24/09). Anh duyệt 24/09.

## Làm gì

1. **Dữ liệu (luật 2 — mọi số trong JSON):**
   - `data/armor_table.json`: 6 giáp (không/da/xích/tấm/xe/công sự) × 5 đạn
     (chém/đâm/xuyên/nổ/xuyên giáp) → hệ số.
   - `data/units.json`: ~8 loại đội đời 1–5 (giáo, kiếm, cung, kỵ, hoả mai, đại bác, bộ
     binh súng trường, xe tăng) — máu, giáp, đạn, sát thương, tầm, tốc độ, số lính/đội, đời.
     Tên chung chung, nguyên gốc (luật nội dung mục 12).
   - `data/battle.json`: cỡ chiến trường, nhịp, trần 60 giây, hệ số địa hình, hệ số tướng,
     độ nhiễu, dung sai của thước.
2. **`src/sim/campaign/Battle.ts`** (TS thuần, ≤300 dòng, dùng `core/Rng.ts` như `Nen.ts`):
   - `tinhTran(benA, benB, diaHinh, hatGiong)` → bên thắng · chết mỗi bên · giây kết thúc ·
     danh sách sự kiện thô. Mô phỏng **cấp đội**, không cấp lính: đội đi thẳng tới đội địch
     gần nhất, vào tầm thì đánh; sát thương = gốc × bảng giáp×đạn × địa hình × tướng × nhiễu.
     Đội tụt dưới ngưỡng tinh thần thì vỡ. Cùng hạt giống → cùng kết quả.
   - `duDoan(benA, benB, diaHinh)` → % thắng của A, tính **không chạy trận** (sức mạnh
     hiệu dụng hai bên theo luật Lanchester → hàm logistic). Đây là số hiện trước trận.
3. **`src/sim/campaign/BattleScript.ts`**: sự kiện thô → dòng thời gian cho Phase 10 diễn
   (`0s hai bên tiến · 4s cung bắn loạt đầu · 22s cánh phải vỡ · 31s kết thúc`).
4. **`scripts/sim_tran.ts` + `npm run sim:tran`**: 1000 trận ghép ngẫu nhiên, chia theo khoảng
   dự đoán (0–10 %, …, 90–100 %), in bảng dự đoán ↔ thật. **ĐẠT** khi mọi khoảng đủ mẫu lệch
   ≤ dung sai (đề xuất 10 điểm %) và không loại đội nào thắng >65 % khi đánh cân tiền.
   Chỉnh hệ số trong JSON cho tới khi đạt.
5. **Test viết trước** (`tests/Battle.test.ts`): tất định theo hạt giống · bảng giáp×đạn đủ ô
   · bên mạnh áp đảo thắng · trận luôn kết thúc ≤ trần giây · kịch bản có sự kiện đầu/cuối.

## Ngoài phạm vi (ghi nợ, không làm)

- **Quân đi giữa các tỉnh** trên bản đồ chiến dịch và nối trận vào `ChienDich.ts` — cùng
  nhóm nợ "chiến dịch chưa nối kinh tế". Phase 9 chỉ để quân đi **trên chiến trường 40×40**.
- Sprite lính, `BattleScene.ts` — Phase 10.

## Đo bằng gì

- `npm run sim:tran` ĐẠT; thời gian chạy 1000 trận in ra (mục tiêu < 10 giây).
- `npm run do` xanh (lint · typecheck · test · `check:tran` trần 300 dòng/file · `check:ten`).
- Không gì trong `src/sim/` chạm `document`/`window`/`render/` (test sẵn có bắt).

## Lùi bằng gì

Chỉ thêm file mới + một dòng `package.json`; không sửa mã chạy của game. Revert một commit.

## Rủi ro

- Dự đoán Lanchester lệch mô phỏng có di chuyển/tầm bắn → phải thêm hệ số hiệu chỉnh
  (vẫn nằm trong JSON). Nếu lệch mãi thì báo anh, không nới dung sai.
- `do:luat` chạy chậm (~10 phút phiên này, gọi Gemini) — không chặn việc, chỉ tốn giờ.
