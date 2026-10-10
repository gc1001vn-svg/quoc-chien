# Art bible bước 3 — nướng lại mẻ cổ đại về 3 tay vẽ (10/10/2026, lần 45)

Theo kế hoạch anh chọn B (`docs/ke-hoach/2026-10-10-art-bible-buoc-3-co-dai.md`). Phiên mở ở kho `ghi-nho`, `add_repo`
repo này sau khi anh nhắn "Đồng ý" (Auto chặn `add_repo` push lần đầu, `[Permission Grant]`).

- **Tải:** `tai:tatca` + `lay.mjs quaternius ultimatefantasyrts farmbuildings farmanimal --chi obj` ~25 phút. 10 file HTML giả
  trong `ultimatefantasyrts` (vd `Farm_Dirt_Level3.obj`, vài `.png`) — không file nào mẻ dùng. Gà G1, G2 lấy theo mã Icosa.
- **Công trình → KayKit nhuộm rơm:** nhà bia = `building_tavern` (thùng gỗ) · trại lính = `building_barracks` · lò nung =
  `building_blacksmith` mái gỗ sẫm · lò mổ = `building_home_A` xoay 90°, mái gỗ đỏ · lò gốm = `building_tower_A` mái đất nung.
  Đồ vật Quaternius trong 8 công trình KayKit → đồ KayKit cùng chỗ (`khp:` thùng, bao, xô, xe cút kít…).
- **Nông trại Quaternius:** ruộng = nền lót màu phẳng + `Farm_Dirt_Level1` + `Farm_FirstAge_Level{1,2,3}_Wheat`. **Level 1–3
  của RTS là luống được gieo dần (⅓ → ⅔ → đủ), cùng chiều cao 0,19** — không phải cây lớn dần; phiên "lúa lớn dần" quyết
  dùng thẳng hay nhuộm thêm. Trại lợn, cừu, gà: rào `Fence` + `OpenBarn`/`ChickenCoop`, mái đen nhuộm rơm (`mau_vl`).
- **`farmanimal` (Drive) = `lowpoly-animated-animals` (itch), cùng file** → giữ kit `av` cũ. `SmallBarn.mtl` rỗng (ra
  trắng toát) → không dùng.
- **Haystack Icosa vẫn ở `trung_co_2`** → `ghi_cong.json` gỡ 4 model (đền, tháp, đấu trường, dê), không phải 5 như kế hoạch.
- **Ruộng thử 1 chìm:** luống sẫm trên ô `o_ruong` sẫm, ở zoom 0,6 không nhận ra. Lót hoạ tiết Poly Haven thì sáng nhưng
  phạm luật 9 (lý do loại 1C, 1D) → lót màu phẳng `[0.62, 0.47, 0.3]`.
- **Đo:** `tay-ve co_dai` 6 → 3 · khung đo 0,48 · 0,56 trước = sau · 3 lệnh vẽ · `sim:thu`, `sim:van` y hệt (chỉ khác giây) ·
  atlas 2× tràn sang trang 2 (3,8 %) như ước — dòng `ASSET_CREDITS.md` sửa bằng vé (anh đồng ý 10/10).
- **Chưa:** anh xem ảnh, đo iPhone ≥ 58 fps; ảnh Safari giả lập `anh-ios.yml`.
