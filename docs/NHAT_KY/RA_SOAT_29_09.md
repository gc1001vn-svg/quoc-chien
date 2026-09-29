# Rà soát bộ đồ nghề — 29/09/2026 (lần 23, không chạm mã game)

Anh báo "lần nào chạy cũng xuất hiện lỗi", sửa cái này hỏng cái khác, kho lúc nhớ lúc quên.
Rà 7 repo + kho + hook + skill + connector, rồi sửa. Mỗi lỗi có lệnh bắt đỏ trước khi sửa.

- **Lỗi lặp mỗi phiên — sổ file khoá:** `chan_file_khoa` đoán "lệnh ghi" theo chữ, ghi sổ cả
  lệnh chỉ đọc (`node -e`, `git add` dính mẫu `dd `, `CLAUDE.md` của repo khác). Sổ nằm trong git
  → git bẩn → hook Stop của máy ảo báo `There are uncommitted changes…`. Phiên này 10 dòng, cả 10
  sai. Sửa: chụp mtime trước/sau lệnh (PreToolUse + PostToolUse), chỉ ghi khi file khoá đổi thật
  và khác HEAD. `tests/ChanFileKhoa.test.ts` 13 ca, chạy lệnh thật giữa hai lần gọi hook.
- **`chan_bao_xong`** chặn nhầm khi "Số đo:" nằm giữa dòng → nhận ở mọi vị trí.
- **Kiểm skill** chạy ở SessionStart trước khi skill tải về → sót `google-workspace` (~310 tok/phiên,
  connector Drive đang ngắt). Hàm dùng chung vào `check_hook` (lệnh đo) + khoá ở bản mẫu kho.
- **Đầu phiên ~48.800 token** (ước byte/3): `TIEN_DO.md` 91.599 byte dồn 34 phiên dù luật "ghi đè".
  Cắt còn 9.349 byte; lịch sử nguyên văn sang `TIEN_DO_TRUOC_29_09.md`, nợ sang `NO_KY_THUAT.md`,
  môi trường sang `docs/MOI_TRUONG.md`. `DAU_PHIEN.md` 25.268 → 9.495 byte, bỏ đoạn tự mâu thuẫn.
  Thước mới: `.claude/doc_dau_phien.txt` (bản cũ đỏ 30.533 > 4.500, bản mới xanh).
- **`npm run do` 7 phút 13 giây**: `do:luat` (Gemini ~4 phút) giờ chỉ chạy khi `AGENTS.md`/`BO_DE.md`
  khác `main`.
- **Công cụ ghi đè kho** (bẫy "ngoài việc giao" từ 28/09): `kho_asset` giữ gói chưa tải (vòng đo:
  bản cũ mất cả mục icosa), `tai_icosa` gộp dần (bản cũ còn 2 dòng, bản mới 1.681). Bù 12 model Icosa
  dùng trong game mà `KHO_ICOSA.md` làm rơi.
- **Dò asset quên kho-game** (28/09 kết luận sai "không có gà"): `do:asset` tự clone kho-game.
- **Pages giữ bản cũ trên iPhone:** vòng đo Chromium (build V1 → mở → build V2 → "hiện lại") ĐỎ.
  Gốc: plugin tự chèn `registerSW.js` không hỏi bản mới, không tải lại. Sửa `src/main.ts`: đăng ký
  qua `virtual:pwa-register`, hỏi bản mới mỗi lần trang hiện lại → XANH. **iPhone thật chưa đo.**
- **kho-game:** `lay.mjs --id` 0/2 → 2/2 (wayback đứt qua proxy, lùi sang backblaze); cài bộ đồ nghề,
  nối 4 thước (7/7). **ghi-nho:** gỡ luật đá nhau (gộp main, tayvuc, bước A/D/F), 3 quyết định.
- **Bẫy:** bộ lọc máy ảo chặn trợ lý tự ghi vé file khoá (`[Self-Modification]`) khi anh chưa nói.
  Anh gõ "sửa file khoá theo TIEN_DO mục 3" thì ghi vé qua được. Commit `87bc2a8` phiên này ghi
  "hai dòng" sổ, thật là 10 — hook cũ ghi nhầm.
- **Lượt 2 (anh duyệt):** `ASSET_CREDITS.md` thêm dòng 11 model Icosa khối 4 · `AGENTS.md` dò asset
  một lệnh · xoá `vercel.json` · CI chỉ `main` + PR · workflow `Don nhanh` xoá nhánh `claude/*` đã gộp
  và cũ hơn 2 ngày (03:17 hằng ngày) · `kho-game/CLAUDE.md` gọi `add_repo` trước khi clone.
- **Anh xác nhận 29/09:** Pages trên iPhone lên đúng bản `29/09 11:32`, mở lại vẫn đúng. DAU_PHIEN
  mục G đổi lại: đẩy `main` xong thì đưa link Pages (đo fps đúng), bản duyệt chỉ để xem trước.
