# Phase 10A — xem được trận, lính thời cổ (25/09)

## Bối cảnh

`KE_HOACH.md` mục 2, Phase 10: sprite lính 8 hướng × 4 dáng + `render/BattleScene.ts`.
10 loại đội (`data/units.json`) quá sức một phiên → tách: **10A** bốn đội nhóm `co`
(giáo · kiếm · cung · kỵ), **10B** sáu đội nhóm `sung`/`hien_dai` (hoả mai, đại bác, kỵ
súng, bộ binh, chống tăng, xe tăng). Bước E: không cần iPhone (Phase 9 không đổi màn hình).

## Dò asset (đủ ba bước + `kho-game`, 25/09)

- **KayKit Adventurers** (CC0, kho chung): `Knight` `Barbarian` `Ranger` `Rogue` + giáo,
  kiếm, khiên, cung rời. **KayKit Character Animations** (CC0): `Rig_Medium_MovementBasic`
  (đi) · `CombatMelee` · `CombatRanged` · `General` (trúng đòn, chết — tên clip kiểm khi tải).
- Ngựa: `Horse` ở `KHO_ASSET.md` (đã tải) và kho chung — chưa biết có xương không.
- Súng, xe tăng, đại bác: Icosa CC-BY, **không xương** → để 10B.

## Làm gì

1. **Sim ghi vị trí** (`Battle.ts`): `tinhTran` thêm vết vị trí từng đội mỗi nhịp — vẫn
   tính trước, không mô phỏng lúc vẽ. Nhịp lấy mẫu trong `data/battle.json`. Test trước.
2. **Máy nướng đọc hoạt ảnh** (`tools/lib/gltf.mjs` đã có xương, chưa có clip): lấy mẫu
   clip glTF tại thời điểm t → tư thế. Tra trước: code sẵn trong repo / thư viện đã cài.
3. **Mẻ `linh_co`**: 4 lính × 8 hướng × 4 dáng × 2 khung = **256 sprite**, atlas **riêng**
   (mẻ trung cổ 2× hết chỗ). Tính chỗ trước khi nướng; trần 4 trang (`TECH_SPEC` mục 2).
   Nhìn tận mắt atlas trước khi vào `public/`.
4. **`render/BattleScene.ts`**: phát `sinhKichBan` + vết vị trí, mỗi đội vẽ `linh` sprite
   (≤ 250 sprite động, `GAME_SPEC` mục 6), nút ×1/×4 và bỏ qua. Mở bằng `?tran=1`.
5. **Jules** (quy trình 25/09): viết test `BattleScene` phần thuần (chọn khung theo giây,
   hướng theo vector đi) · nộp `kiem_cheo.json` · Claude `--so-sanh` + cài lỗi thử.
   Thêm test `scripts/kiem_cheo.mjs`.

## Ngoài phạm vi

Sáu đội súng/hiện đại (10B) · quân đi giữa tỉnh · nối trận vào `ChienDich.ts` · âm thanh.

## Đo bằng gì

`npm run do` xanh · Claude chụp trận trong máy ảo (`npm run chup:man`) và xem · `npm run
duyet` → Artifact để anh bấm xem trên iPhone, đo fps lúc đánh.

## Lùi bằng gì

`BattleScene` chỉ mở bằng `?tran=1`; atlas lính riêng. Revert từng commit không đụng thành phố.

## Rủi ro

- Clip KayKit không có sẵn "trúng đòn"/"chết" → thay bằng tư thế nghiêng/nằm tự dựng
  từ xương, hoặc báo anh.
- Ngựa không xương → kỵ binh trượt đi, không có vó; ghi nợ.
- Dò asset mới biết kho chung ở repo `tayvuc` (private) — phải `add_repo` đọc để `kho:lay`.
