# ĐẦU PHIÊN — QUỐC CHIẾN

> **Bảy bước chung A–G ở `so-thich.md` của kho `ghi-nho`** — chạy theo bảng đó.
> File này chỉ ghi thứ **riêng repo này**: lệnh cụ thể và bẫy đang còn sống.
> Chi tiết đo đạc cũ (khoá, host mạng, Poly Pizza, Chromium): `docs/MOI_TRUONG.md` — tra khi
> đụng đúng việc đó, **không đọc đầu phiên**. Cắt 29/09: file này từng 25 KB và tự mâu thuẫn
> (một mục nói "đã gỡ", mục khác vẫn dạy "coi như tắc").

## A. Nạp bối cảnh

```bash
cat docs/TIEN_DO.md
```

**Cấm cắt.** `skillOverrides` thì máy kiểm (hook đầu phiên + `check:hook` trong `npm run do`),
không phải `cat` `settings.json` nữa.

## B. Dựng lại máy ảo

| Lệnh | Khi nào | Ghi chú |
|---|---|---|
| `npm ci` | hook đầu phiên báo `CHUA npm ci` | 29/09 máy ảo mở ra đã có `node_modules` — đừng cài lại khi không cần |
| `npm run do` | **luôn luôn**, trước khi động vào code và trước mỗi commit | số thước lệnh tự in, đừng chép vào đây |
| `npm run tai:tatca` | chỉ khi phiên có **nướng sprite** | 1,1 GB (đo 30/09, kể cả 14 model Icosa của 5 mẻ thành phố), 9 gói itch + 9 gói Kenney + 23 hoạ tiết Poly Haven, chạy `npm run kho` ở cuối. Model Icosa của mẻ lấy riêng theo mã: `node /home/user/kho-game/cong-cu/lay.mjs icosa --id <mã…> --dich assets_source` (mã: `grep -o 'icosa/[^"]*' tools/me/<mẻ>.json`) |

**Cỡ kho chỉ ghi ở đúng dòng trên** — `tests/TaiLieu.test.ts` giữ luật này.

`npm run do` chạy ra file rồi `grep`, **đừng `| tail`** (không in gì tới lúc xong, trông như treo):
`npm run do > <scratchpad>/do.txt 2>&1`. `do:luat` (gọi Gemini, ~4 phút) **chỉ chạy khi `AGENTS.md`
hay `docs/BO_DE.md` khác `main`**, còn lại in `BO QUA`; ép chạy: `DO_LUAT=1 npm run do`.
Đỏ vì `429` / `KHONG DO` là lỗi bên ngoài — khai rõ, chạy lại phần kia bằng `GEMINI_API_KEY= npm run do`.

`assets_source/` **không lên git**. `npm run kho` và `npm run tai:icosa` **gộp dần** bản kê: gói
chưa tải phiên này thì giữ nguyên đoạn cũ (sửa 29/09 — trước đó hai lệnh này ghi đè, mất cả
nghìn dòng). `npm run tai:tatca` không tải `assets_source/icosa`; lấy riêng bằng
`npm run tai:icosa <từ khoá>`.

## C. Khoá API — repo này Public, lộ một lần là lộ vĩnh viễn

- Khoá chỉ đi qua **biến môi trường** (ô `Environment variables` của môi trường). Không bao giờ vào
  git, không gõ vào chat, **không đặt chuỗi khoá vào thân lệnh Bash** — `ghi_so_lenh` chép 200 ký
  tự đầu mỗi lệnh vào `.claude/so_lenh.log`. Gọi API thì truyền khoá bằng header, đừng nhét vào URL.
- `check:khoa` (trong `npm run do`) quét mọi file git đang theo dõi tìm hình dạng khoá, kể cả
  kiểu mới `AQ.…` của AI Studio. Đỏ là không commit được.
- Lộ rồi thì **xoay khoá trước**, xoá sau — máy ảo không sửa được lịch sử git.
- Biến môi trường mới đặt: mặc định phải **mở phiên mới** mới thấy. Kiểm bằng lệnh, đừng đoán.
- Tên khoá đang có, host nào thông, model Gemini nào gọi được, bẫy ô `Environment variables`:
  `docs/MOI_TRUONG.md`.

## D. Chi phí token — phần riêng repo này

Đừng `grep -i` trần vào `docs/KHO_ASSET.md` (dòng dài 4.870 ký tự, trúng một dòng ~3.300 token).
Dò asset bằng lệnh ở mục F — nó chỉ in tên model.

## F. Dò asset — MỘT lệnh, chạy đủ mọi nguồn

```bash
npm run do:asset ga            # tiếng Việt cũng được, có từ điển dịch sẵn
npm run do:asset hien_dai nha
```

Lệnh chạy lần lượt: `KHO_ASSET.md` → `KHO_CHUNG.md` → **kho mục lục chung `kho-game`** (mọi
nguồn, gồm Poly Haven, Poly Pizza, Quaternius) → `NGUON_MO.md`. Chưa có
`/home/user/kho-game` thì **lệnh tự clone** (sửa 29/09 — 28/09 phiên bỏ bước này vì lệnh chỉ in
dòng nhắc, kết luận sai "không có gà"). Clone hỏng thì lệnh in `HONG` — khi đó **chưa được kết
luận "không có"**. Từ 29/09 hook `nhac_kho` còn tự dò kho-game khi câu anh gõ có từ asset.

- **Chọn asset, nướng, đổi đèn, đổi màu: theo `docs/ART_BIBLE.md`** — mốc, luật tay vẽ, số đo.
- Dò hụt thì thêm từ vào `/home/user/kho-game/cong-cu/tu_dien.json` (khoá **có dấu**), đừng sửa
  mã nguồn. Repo này không còn từ điển riêng.
- Trúng ở kho-game: `node /home/user/kho-game/cong-cu/lay.mjs <nguồn> ...` — icosa · kenney · itch
  · polyhaven · quaternius · 2d-assets · 3dtextures. `npm run tai:*` gọi sang đó, giữ tên cũ.
- **Tự làm (vẽ bằng số, không mảnh model nào) phải khai `docs/TU_LAM.md`**: lệnh dò đã chạy +
  ngày anh duyệt. Thiếu thì `check:credits` đỏ.
- Trúng ở kho chung (`KHO_CHUNG.md`, file kê nằm trong repo này): model thật ở repo **`tayvuc` —
  Private**, gọi `add_repo` (`access: read`) trước rồi mới clone, rồi
  `npm run kho:lay <gói>`. Kho chung giữ gói **đã lọc** (phần lớn chỉ còn `glTF/`).
- **Máy nướng đọc được cả ba: `.obj` · `.gltf` · `.glb`** (`tools/nuong_sprite.mjs`). `.fbx` thì đổi
  sang `.glb` trước: `node /home/user/kho-game/cong-cu/mo_hinh.mjs fbx <thư mục>` (giữ clip chuyển động).
- Tải gói mới từ itch xong chạy `npm run kho`; lấy từ kho chung xong chạy `npm run kho:chung`.
- Poly Pizza **dò được, tải không được** (Cloudflare chặn, kể cả Chromium) — chủ dự án tải bằng máy
  mình. Chi tiết: `docs/MOI_TRUONG.md`.

## G. Bản duyệt — cho chủ dự án xem game mà không cần đẩy `main`

Máy ảo **không mở được trang thật** (`github.io` và mọi hosting đều `000`).

```bash
npm run duyet
```

Build lại với `--base=./`, bỏ service worker, gói vào `.duyet/` kèm `xem.html` bọc iframe.
Rồi **đăng bằng công cụ Artifact** — chủ dự án bấm link là mở game thật trên iPhone.

Ba chỗ dễ sập, đã ghi đủ trong đầu `scripts/duyet.mjs`:

- **Đừng đẩy thẳng `dist/`** — nó viết cứng `/quoc-chien/`, đăng lên là 404 sạch.
- **Đừng đăng thẳng một file HTML đủ đầu đủ đuôi** — Artifact tự bọc nó vào khung
  `<!doctype html>` của nó. Phải qua `xem.html` + iframe.
- **`.nojekyll` phải bỏ** — Artifact từ chối đuôi file không ứng với kiểu nội dung nào.

Lệnh tự đối chiếu trần Artifact (16 MB trang · 15 MB mỗi file nhị phân · 64 MB · 255 file)
và **thoát mã 1** khi vượt.

**Bản duyệt KHÔNG thay `main`.** Bản thật vẫn là GitHub Pages; `.duyet/` không lên git.

**Chuyển động** (trận, hiệu ứng, hoạt cảnh): `npm run quay -- "?tran=1" "×4"` → clip MP4, gửi bằng `SendUserFile`.
**Việc cho anh xem trên iPhone:** đã đẩy `main` thì đưa **link Pages**
https://gc1001vn-svg.github.io/quoc-chien/ — từ 29/09 mở lại app là lên bản mới (sửa service
worker trong `src/main.ts`, anh xác nhận trên iPhone 29/09); mở thẳng, không qua khung, nên đo
fps đúng. Chữ số phiên bản cạnh số fps cho anh biết đang xem bản nào.
**Bản duyệt** khi cần anh xem TRƯỚC khi đẩy `main`: đăng đè đúng link cũ
`https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi` (đọc nó trước, rồi `url` + `root: .duyet`);
muốn mở thẳng màn nào thì sửa `src` của iframe trong `.duyet/xem.html` (vd `?tran=2`).
**Đo fps qua bản duyệt:** Safari khoá trang lồng khung ở **30 fps tới lần chạm đầu**, app Claude
khoá 30 luôn (đo 26/09) — dặn anh mở bằng Safari và chạm vào game một lần rồi mới đọc số.

## H. Cho Chromium ra Internet — chạy lại mỗi phiên khi cần

```bash
npm run mo:mang
```

Nạp đúng một CA của proxy phiên vào kho tin cậy của Chromium (đo 24/09 ở `Auto`: 0/4 → **4/4**
trang mở được). **Cấm `--ignore-certificate-errors*`.** Bị chặn thì đừng mò đường vòng
(`[Auto-Mode Bypass]`): nhờ chủ dự án đổi nút chế độ cạnh ô soạn tin sang `Accept edits`,
chạy lại, xong đổi về `Auto`. Lịch sử gỡ lỗi này: `docs/MOI_TRUONG.md`.

**Chơi thử game, app: công cụ `browser_*`** (Playwright MCP, `.mcp.json`, tự gọi `mo:mang`). `docs/MOI_TRUONG.md` mục cuối.

## I. Soát code — không dùng công cụ ngoài

`alibaba/open-code-review` gỡ 19/09 (bắt thêm 0 lỗi trên diff thật). Dùng thứ đã có:

```bash
git diff --stat <từ>..<đến> -- . ':!public/atlas'   # danh sách file
npm run do                                          # hàng rào thật
```

Luật soát ở `AGENTS.md` mục "Ba luật cứng" và `docs/TECH_SPEC.md` mục 1–2 — **một chỗ duy nhất**.

## J. Thước cấm lách

`AGENTS.md` là **bản gốc**, `CLAUDE.md` là symlink trỏ vào nó. Sửa `AGENTS.md`.

| Thước | Giữ cái gì | Sửa khi đỏ |
|---|---|---|
| `check:nguong` | cấm nới ngưỡng / phình danh sách miễn cho thước khác xanh | **cắt cho vừa mốc**, không sửa mốc. Mốc: `.claude/nguong_goc.txt` |
| `check:cap` | cặp file phụ thuộc nhau không được sửa một bên rồi quên bên kia | đọc lại **cả hai**, khớp rồi thì `node scripts/check_cap.mjs --ghi`. Danh sách cặp: `.claude/cap_file.txt` |
| `check:ten` | cấm tên ẩn dụ (`gate` `verdict` `ledger` `sidecar` `provenance` `evidence`) | đổi tên trong mã. Chỉ quét định danh, comment tiếng Việt không dính |
| `check:token` | trần token của `AGENTS.md` và các file đọc mỗi đầu phiên (`.claude/doc_dau_phien.txt`) | **cắt** — lịch sử sang `docs/NHAT_KY/`, chi tiết sang `docs/MOI_TRUONG.md` |
| `check:hook` | bộ hook đúng luật, skill nạp mỗi phiên phải có khoá | skill thiếu khoá: thêm vào `ghi-nho/cong-cu/skill_overrides.json` rồi chạy `cai_dat.mjs` |
| `do:luat` | đo xem luật trong `AGENTS.md` có thật sự đổi hành vi không | sửa **lời luật**, đừng sửa bộ đề cho vừa câu trả lời. Bộ đề: `docs/BO_DE.md` |
| `check:tran` | trần hiệu năng `TECH_SPEC.md` mục 2 phải có máy đọc | **cắt cho vừa trần**. Số đọc thẳng từ bảng đó |
| `check:san` | cấm tắt kiểm tại chỗ (`@ts-ignore`, `eslint-disable`), tắt test (`it.skip`, `describe.only`), để hàm rỗng | sửa gốc. Nuốt lỗi có chủ đích thì viết lý do vào trong ngoặc: `catch { /* vì sao bỏ qua */ }` |
| `luat:sau` | luật bất biến `docs/LUAT_BAT_BIEN.md` qua ≥ 50 hạt giống, ván dài — chỉ chạy khi `src/sim/` hay `data/` khác `main` (`npm test` chạy bản ngắn) | **sửa mã** cho đúng luật. Luật sai thật thì sửa câu luật + test, ghi lý do vào nhật ký — không nới cho xanh |
