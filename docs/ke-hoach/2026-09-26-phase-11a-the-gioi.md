# Phase 11A — thế giới chạy ngầm, ván có kết thúc (26/09)

## Bối cảnh

`KE_HOACH.md` Phase 11: ngoại giao + trật tự công cộng + 4 điều kiện thắng. Anh chốt 26/09:
tách **11A** (luật chạy ngầm, chưa vẽ) / **11B** (màn ngoại giao, thẻ bất ổn, màn thắng/thua) ·
thắng Khoa học **tạm lấy đời 5** (ghi trong JSON, Phase 12 đổi số) · hai nợ "chiến dịch chưa
nối kinh tế" và "chưa có AI nước khác" vào 11A. Bước E: 10B anh "ok" 26/09.

## Làm gì (mỗi khối: test trước, rồi code, rồi commit)

1. **Dữ liệu** — `data/victory.json` (4 ngưỡng + điều kiện thua, `khoa_hoc.doi: 5`) ·
   `data/diplomacy.json` (4 trạng thái, điểm quan hệ, giá/lợi 3 cách tác động, bất ổn, AI).
   Mọi số ở đây, `.ts` chỉ đọc (luật 2). Đọc qua `city/DocJson.ts` có sẵn.
2. **`sim/campaign/SucNuoc.ts`** — mỗi nước: vàng, quân (đội trong `units.json` theo đời),
   ảnh hưởng văn hoá, điểm khoa học. **Nước người chơi đọc thật từ `ThanhPho` + `Meta`**
   (số nhà → vàng, đời → đội mở, công nghệ → khoa học) — đây là chỗ nối kinh tế.
   Nước AI: kinh tế rút gọn theo số tỉnh + đời, tất định theo hạt giống (`core/Rng.ts`).
3. **`sim/campaign/NgoaiGiao.ts`** — 4 trạng thái mỗi cặp nước, quan hệ −100..100,
   thương mại / đàm phán / đe doạ; đe doạ tính theo tương quan sức quân (yếu thì phản tác
   dụng). Bầu minh chủ cho thắng Ngoại giao.
4. **`sim/campaign/BatOn.ts`** — bất ổn từ thứ sim đang có: thiếu lương thực, thẻ thuế,
   vừa mất tỉnh. Vượt ngưỡng → thẻ quyết định mới trong `decisions.json` (đàn áp / giảm
   thuế / xây nhà hát); kệ N lượt → nổi loạn, mất một tỉnh.
5. **`sim/campaign/ChienTranh.ts`** — quân đi giữa tỉnh kề (`Hex.khoangCach` giữa tâm),
   đánh bằng `tinhTran()` có sẵn ở `Battle.ts`; thắng thì chiếm tỉnh; mất thủ đô = bị loại.
6. **`sim/campaign/AiNuoc.ts`** — AI theo luật, không học: đánh tỉnh kề khi mạnh hơn hệ số
   X, đe doạ/đàm phán theo quan hệ, xây ô tỉnh bằng `ChienDich.datLenhXay` (nới cho AI).
7. **`sim/campaign/TheGioi.ts`** — gom 2–6, nhịp theo `giay_moi_luot`, `ketQua()`:
   `dang_choi` / thắng kiểu gì / thua.
8. **`npm run sim:van`** (`scripts/sim_van.ts`) — chạy trọn ván không người bấm với 4 chiến
   lược tự động + 1 ván bỏ mặc. **ĐẠT khi cả 4 kiểu thắng đều tới được** trong trần giờ, ván
   bỏ mặc thì thua hoặc AI thắng, không ván nào treo. Cân số tới khi đạt.

## Ngoài phạm vi

Mọi thứ trên màn hình (11B) · vẽ quân đi trên bản đồ · đời 6 · dân bậc cao (sim chưa có
bậc dân — ghi nợ, bất ổn chưa tính khoản này).

## Đo bằng gì

`npm run do` xanh · `npm run sim:van` ĐẠT, in giờ game và giây thật mỗi ván · test mới cho
từng file · game đang chạy không đổi (khối mới chưa ai import từ `render/`/`ui/`).

## Lùi bằng gì

Toàn file mới + JSON mới; chỉ sửa nhỏ `ChienDich.ts` (cho AI xây) và `decisions.json`
(thẻ bất ổn). Revert từng commit, thành phố không bị đụng.

## Rủi ro

- Cân cho **cả bốn** kiểu thắng đến được có thể mất nhiều vòng → trần: mỗi kiểu ≤ 3 lần chỉnh
  số, quá thì báo anh số đo và hỏi.
- Ván đầy đủ kéo thành phố thật chạy nhiều giờ game → nếu một ván > 60 giây trong Node thì
  cho nước người chơi dùng số tổng hợp mỗi giờ thay vì chạy từng nhịp — báo trước khi đổi.
- Chỉ số văn hoá chưa có trong spec chi tiết → tạm: công trình tỉnh + công nghệ + thẻ, hệ số
  ở JSON; 11B anh xem rồi chỉnh.
- Cuối phiên: `docs/ke-hoach/2026-09-26-phase-11a-the-gioi.md` (≤ 60 dòng), nhật ký
  `PHASE_11A.md`, `TIEN_DO.md` mục 1–5, gộp `main`.
