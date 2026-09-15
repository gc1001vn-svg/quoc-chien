# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 15/09/2026 (phiên bản duyệt Artifact + lệnh dò asset — **không đụng màn hình game**).

## 1. Đang ở đâu

**Game vẫn ở Phase 8A.** Năm phiên liền (12/09, 13/09, 14/09 ×2, 15/09) không đụng gì màn
hình game: 12/09 gỡ 11/11 xung đột tài liệu, 13/09 rà soát và đồng bộ bộ đồ nghề cho cả bốn
repo, 14/09 thêm hook `UserPromptSubmit` nhắc kho, 14/09 (lần 2) dựng hàng rào tất
định và thước `khoi:dong`, 15/09 dựng bản duyệt Artifact và lệnh dò asset. Chi tiết:
`docs/NHAT_KY/PHASE_8_RA_SOAT.md`, `PHASE_8_DO_NGHE.md`, `PHASE_8_NHAC_KHO.md`,
`PHASE_8_TAT_DINH.md`, `PHASE_8_BAN_DUYET.md`, `PHASE_8_TAI_POLY.md`.

**Phase 8B làm được ngay phiên sau** — không còn gì chặn.

### Phiên 15/09 (lần 2) đã đổi gì

- **`npm run mo:mang` chết ở container mới, đã vá.** `~/.pki/nssdb` **không tồn tại** khi
  container chưa từng mở Chromium, `certutil -L` thoát
  `SEC_ERROR_BAD_DATABASE: security library: bad database.` — **giống hệt lúc thiếu
  `libnss3-tools`**, nên script đi `apt-get` rồi chết. Nay tự `certutil -N --empty-password`.
  Lần 1 tưởng xong vì kho NSS đã tạo tay lúc mò.
- **Đọc dấu vết để biết ai chặn** — hai loại, đừng lẫn: `000` kèm
  `connect_rejected (organization policy)` là **allowlist môi trường** (chủ dự án sửa được);
  `HTTP/2 403` kèm `server: cloudflare` và `cf-mitigated: challenge` là **đích từ chối**,
  request đã tới nơi nên thêm allowlist vô ích. `static.poly.pizza` thuộc loại thứ hai.
- **Đo lại toàn bộ đường tải Poly Pizza, không thêm được gì.** Chi tiết và danh sách đã thử:
  `docs/NHAT_KY/PHASE_8_TAI_POLY.md`. **Đừng mò lại.**

### Phiên 15/09 (lần 1) đã đổi gì

- **Chromium ra được Internet — lỗi sống sót nhiều phase, nay vá.** Kho NSS của trình duyệt
  (`~/.pki/nssdb`) **RỖNG HOÀN TOÀN** dù README của proxy nói đã dựng sẵn, nên `cdp.mjs`
  xưa nay chỉ mở được file cục bộ; thước `khoi:dong` vẫn xanh vì nó chỉ mở bản build trong
  máy. `npm run mo:mang` nạp CA của proxy vào kho NSS — **chạy lại mỗi phiên**, và chủ dự
  án phải đổi chế độ quyền sang `Accept edits` trước. Đo sau khi vá: mở được **4/4**
  (`kenney.nl` · `polyhaven.com` · `itch.io` · `quaternius.com`). Chi tiết: `DAU_PHIEN.md` mục H.

- **`npm run duyet` + Artifact — hết phải đẩy `main` để chủ dự án nhìn game.** Build
  `--base=./`, bỏ service worker, `xem.html` bọc iframe, tự đối chiếu trần Artifact và
  thoát mã 1 khi vượt. Đo: **15 file · 4,2 MB**. Cách dùng và ba bẫy: `docs/DAU_PHIEN.md` mục G.
- **`npm run do:asset <từ khoá>` — ba bước dò asset gộp một lệnh**, cộng Poly Haven
  (521 model CC0, API mở) và Poly Pizza (10.400+ model, cần `POLY_PIZZA_KEY`).
  Từ điển Việt→Anh ở `tools/tu_dien_asset.json` — **dò hụt thì thêm từ, đừng sửa mã nguồn.**
- **Lần chạy đầu đã ra thứ sáu phiên trước bỏ sót:** `Chicken` nằm ở
  `quaternius/ultimate-monsters/Blob` trong kho chung. Nợ `trai_ga` xem mục 4.
- **MCP đã tra và loại**, kèm số đo: `docs/NHAT_KY/PHASE_8_BAN_DUYET.md`. Đừng tra lại từ đầu.

### Phiên 14/09 (lần 2) đã đổi gì

- **Luật tất định thành thước.** `eslint.config.js` khối `src/sim/**` chặn `Math.random`
  `Date` `performance` `Intl` `localeCompare` `toLocale*` `.sort()` trần `process`; cùng
  bộ mẫu đó vào `tests/SimKhongDungTrinhDuyet.test.ts` theo lệ hai hàng rào của repo.
- **Thước `khoi:dong`** — mở bản đã build bằng Chromium thật trước khi đẩy, hỏng khi có
  ngoại lệ chưa bắt, `console.error`, request từ HTTP 400 trở lên, hoặc canvas không hiện.
  Bịt chỗ hở: bước curl trong `deploy.yml` chạy sau khi đẩy và trang trắng cũng trả 200.
- **`Network.loadingFailed` không báo HTTP 404** — phải đọc `Network.responseReceived`.
- Sáu luật nguồn ở kho: `ghi-nho/cong-cu/luat-chi-tiet.md` mục "Lõi thuần · cổng chết ·
  test tự lừa"; vì sao: `quyet-dinh/2026-09-14-loi-thuan-cong-chet-test-tu-lua.md`.

### Phiên 14/09 (lần 1) đã đổi gì

- **Hook thứ năm: `UserPromptSubmit` → `scripts/nhac_kho.mjs`.** Tra bốn file kho
  theo từ khoá câu vừa gõ, chèn 1–2 khối, không lặp trong cùng phiên. Ý tưởng từ
  `supermemoryai/claude-supermemory` (MIT); **không cài plugin của họ** — plugin
  không đồng bộ xuống phiên web, và auto-capture đẩy hội thoại lên server họ.
- **`dau_phien.mjs` in giá token của chính nó** (2 dòng ≈ 26 tok).
- **Bốn hook cũ fail-open khi chính hook hỏng**, không còn đổ vệt stack vào ngữ cảnh.

### Phiên 13/09 đã đổi gì

- **Hai luật không ai giữ, nay thành thước.** `giam-token` hết là skill phải nhớ gọi →
  `check:token`. Khuôn kế hoạch "tối đa 20 dòng" chưa lần nào đạt (thực tế 210 và 145) →
  `check:kehoach`, trần 60. Vượt ngưỡng là lệnh đo đỏ, không commit được.
- **Cả bốn repo cùng một bản hook** (`md5 cadf0d7e`) và cùng `skillOverrides`. Trước đó
  chạy ba bản khác nhau, bản gốc để chép đi thì lạc hậu 41 dòng.
- **Cài vào repo mới bằng một lệnh:** `node /home/user/ghi-nho/cong-cu/cai_dat.mjs`
  (`--vsp` cho repo việc VSP).
- **Gộp trùng lặp: mỗi luật đúng một chỗ.** Trước đó một luật nằm 4–6 nơi — sửa một nơi là
  lệch với năm nơi kia.
- **Luật chung chuyển sang kho**, `CLAUDE.md` chỉ giữ mồi + luật riêng repo.
- **Vá `vsp-fleet-safety`:** lệnh đo ra 1/3 trên máy ảo sạch vì `requirements.txt` thiếu
  `httpx2` — không phải lỗi code.
- **Bốn bước đầu phiên hết phải nhớ.** Hook `SessionStart` (`scripts/dau_phien.mjs`) tự in
  2–3 dòng: nhánh git + file chưa commit · thư viện đã cài chưa · `skillOverrides` có trống
  không · lệnh đo là gì. Trước đó cả bốn chỉ là chữ trong bảy bước.
- **`tayvuc` có bốn thước mà không có lệnh đo gộp** — thước nằm đó không ai chạy. Thêm
  `npm run do`.
- **Kho có thước rồi.** Rà cuối phiên bắt được chính phiên này làm kho phình 32%
  (`trang-thai.md` 17.252 → 23.356) — `CLAUDE.md` có thước nên không phình được, kho thì
  không. Cắt, tách hai tầng, dựng `check_kho.mjs` chặn.
- **`skillOverrides` không tự phủ skill mới** — skill mới xuất hiện là lọt vào ngữ cảnh mà
  không ai báo. Hook `dau_phien` giờ so thư mục skill với khoá và báo tên chưa có khoá;
  skill cố ý bật ghi vào `.claude/skill_bat.txt` kèm **lý do bắt buộc**.
- **Skill: chỉ `md` còn bật.** Nó có `convert.sh`, không có bản thay thế — gửi file mà
  không gọi thì đọc file gốc (một `.json` 27 MB ≈ 7 triệu token). `giam-token`
  `lap-ke-hoach` `code-review` tắt, gõ `/` vẫn chạy.
- **Tra công cụ tiết kiệm token ngoài, đo thật, chỉ giữ một.** Đo `usage` phiên này: cache
  đọc **373.501.861** token, **400.323 mỗi lượt gọi model**; toàn bộ `tool_result` cả phiên
  chỉ ~240.297 → **đọc file không phải chỗ tốn, số lượt mới là**. Giữ `repomix --compress`
  (`scripts/goi_repo.sh`, cả bốn repo, chạy `npx` khi cần): TS **134.317 → 65.774** (−51%),
  Python **16.759 → 11.551** (−31%). Loại `caveman` (output chỉ 0,22% token thô), Serena
  MCP, `gitingest`, `code2prompt`. Hook nén output lệnh mà mọi blog khuyên thì ở đây vô
  dụng: `npm run do` in **331 ký tự**, `vitest` **176**, `tsc` **0**.
- **Lỗ hổng cuối đã vá: phiên quên ghi nhật ký.** Máy không cưỡng chế được ba việc cuối
  phiên; `chan_bao_xong` chỉ đòi dòng `Số đo:`. Nay `dau_phien` so ngày commit cuối của
  code với ngày commit cuối của `docs/NHAT_KY` + `docs/TIEN_DO.md` — code mới hơn thì
  **đầu phiên sau** báo đọc `git log` ghi bù. Không chặn giữa phiên.

### Ba thứ mới biết, dùng được cho mọi phiên sau

1. **Có NĂM chỗ để thứ dùng chung, không phải ba.** Thiếu **cài đặt cá nhân**
   (tự nạp ở *cả* claude.ai lẫn Claude Code, chủ dự án sửa trên iPhone) và **bộ nhớ
   claude.ai** (Claude tự ghi, **không** tới Claude Code). Bảy luật sở thích đã nằm sẵn ở
   cài đặt cá nhân mà kho vẫn chép lại → trả tiền hai lần.
2. **Đo A/B skill làm được trong MỘT phiên.** `git checkout -b <nhánh tạm>`, bỏ khoá khỏi
   `.claude/settings.json`, commit → harness **nạp lại danh sách skill ngay**.
3. **`skillOverrides` khớp theo tên thư mục**, không theo `name:` trong frontmatter.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| `npm run do` | 6/6 | **9/9** (thêm `check:token`, `check:kehoach`, `khoi:dong`) |
| `CLAUDE.md` | 101 dòng · 2.237 token | **53 dòng · 1.064 token** |
| Repo chạy bản hook chuẩn | 1/4 | **4/4** |
| Repo có `skillOverrides` | 1/4 | **4/4** |
| `skillOverrides` tiết kiệm | chưa đo | **14.349 ký tự/phiên** (~4.783 token) |
| **Token nạp mỗi phiên** | 37.071 ký tự | **25.295 ≈ 8.431 token** · **−31%** |

Lệnh đo ba repo kia: `ghi-nho` **30/30** · `vsp-fleet-safety` **5/5** ·
`tayvuc` `npm run do` mã 0 (**742 test / 56 file**).

Chia nhỏ token nạp mỗi phiên (đo lại 14/09 lần 2): cài đặt cá nhân 826 · `CLAUDE.md` 3.192 ·
`so-thich` **8.492** · `du-an` **4.449** · `trang-thai` **8.983** · mô tả skill `md` 220 ·
hook `SessionStart` 82. **Ba file kho: 21.924 ký tự ~7.308 token** — đọc HẾT mỗi phiên,
mọi repo. Sinh lại bằng `node scripts/check_kho.mjs` ở `ghi-nho`, đừng chép tay.

**Kho tách hai tầng:** `so-thich.md` giữ thứ phải biết **trước** mỗi phiên; năm luật chỉ cần
đúng lúc làm việc đó sang `cong-cu/luat-chi-tiet.md`, tra bằng `grep`.

**Bốn hook chạy ở cả bốn repo** (`dau_phien.mjs` cùng `md5 55e1060a`)**:** `SessionStart` (kiểm đầu phiên) · `PreToolUse`
(chặn sửa file khoá) · `PostToolUse` (ghi sổ lệnh) · `Stop` (chặn báo "xong" thiếu `Số đo:`).

**Ba bước vẫn phải nhớ, máy không kiểm được:** xác nhận trên iPhone thật · dò asset ba bước ·
Plan Mode. Việc cuối phiên thì **máy bắt được ở đầu phiên sau** — commit code mới hơn commit
`docs/NHAT_KY` + `docs/TIEN_DO.md` là hook `dau_phien` báo ghi bù (thử hai chiều, không có
cảnh báo giả).

**Rà soát chốt phiên: không còn trùng lặp, chồng chéo hay xung đột.** Quét 14 luật — chỗ
xuất hiện nhiều nơi đều khác ngữ cảnh. Không có đường trỏ chết. Bốn repo cùng sáu script
(`md5` khớp), bốn hook, 32 khoá (`vsp-fleet-safety` 29 — thiếu ba khoá VSP, cố ý).

**Phiên sau thêm skill mới:** hook `SessionStart` tự báo skill chưa có khoá. Giữ bật thì ghi
vào `.claude/skill_bat.txt` **kèm lý do**; muốn tắt thì thêm vào `cong-cu/skill_overrides.json`
rồi chạy `cai_dat.mjs` cho cả bốn repo.

**Nguồn xa đã đo 15/09, đừng tra lại:** `api.polyhaven.com` HTTP 200, không cần khoá,
**521 model toàn bộ CC0** — `props 176 · nature 110 · industrial 97 · furniture 85 ·
containers 68` nhưng `structures` chỉ **26**, tức **mạnh đồ dùng, yếu nhà**.
`api.poly.pizza` HTTP 401 (thông, thiếu khoá), 10.400+ model, lọc được `licence=CC0`.
Chặn `000`: `sketchfab.com` `huggingface.co` `fab.com`.

Số model **không đo phiên này** (kho không tải). Số thật luôn ở **dòng cuối**
`docs/KHO_ASSET.md` và `docs/KHO_CHUNG.md` — có test cấm chép số đó ra tài liệu luật.

Số đo game giữ nguyên từ 11/09 (Phase 8A): `sim:congnghe` **ĐẠT** 120 giờ · lên Trung cổ
giờ **21**, Súng ống giờ **65** · **21/24** công nghệ trong 120 giờ · **11** điểm nghiên
cứu mỗi giờ ở 241 nhà.

### Trần sprite trên iPhone thật (11/09, atlas thật 2×)

**18.089 sprite ở ≥58 fps** · 24.000 ở 50 fps — và 24.000 là **hết sức chứa công cụ đo**,
không phải hết sức máy.

**18.089 không phải trần máy, nó là một bậc của thang đo** (thang nhảy 1,35× từ 200).
Phase 0 ra đúng số này vì cùng thang — cả dự án hiểu nhầm là trần máy suốt năm phase.
`TECH_SPEC` từng ước atlas thật 2× "còn ~4.500 sprite": **sai, thấp hơn thực tế ít nhất
bốn lần**. Trần 5.000 của dự án **dư ít nhất 3,6 lần**.

## 3. Việc của chủ dự án

### Việc mới 15/09 (lần 2)

**Mở allowlist cho kho gương Icosa — ANH BÁO ĐÃ LÀM XONG 15/09, phiên sau đo lại.**
Bốn dòng thêm vào **Allowed domains** của môi trường (`claude.ai/code` → bộ chọn môi trường
→ **Update cloud environment** → **Network**): `icosa.gallery` · `*.icosa.gallery` ·
`archive.org` · `*.archive.org`.

Phiên sau **việc đầu tiên** là đo, đừng giả định đã thông:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://api.icosa.gallery/v1/assets?limit=1"
```

`200` thì có đường lấy model `"Poly by Google"` mà không đụng Cloudflare — phần lớn model
nhà trên Poly Pizza gốc từ kho đó. Vẫn `000` thì báo anh, đừng mò cách khác.

### Việc cũ 15/09 (lần 1)

**1. ✅ Lấy khoá Poly Pizza — XONG.** Khoá đã có, `POLY_PIZZA_KEY` chạy tốt
(`api.poly.pizza` trả `200`). **Khoá là mật khẩu. Repo này Public — không bao giờ commit
khoá vào git.**

**2. ✅ Bản duyệt Artifact — XONG, anh xác nhận chạy được** trên iPhone (15/09).
Đường này dùng được, khỏi đẩy `main` chỉ để anh nhìn game:
https://claude.ai/artifact/9qbdDmdrqPkMNiAyVcMGZt

**✅ Nút "Đo trần sprite" ở màn dọc — XONG**, anh xác nhận ổn (treo từ 11/09).

### Một việc còn treo

✅ **Bộ nhớ Project "Du lịch" — chủ dự án sửa xong 13/09.** Chốt: **không tự lái**.

✅ **Mồi đã dán vào cài đặt cá nhân 13/09** (Settings → General → *Instructions for Claude*).
**376 ký tự ≈ 125 token/phiên.** Từ phiên sau, **repo mới cũng tự có đủ đồ nghề** — không
còn phụ thuộc repo đã sửa `CLAUDE.md` hay chưa. Nội dung ghi ở `ghi-nho/so-thich.md`.

**Còn lại: nhánh tạm `claude/do-ab-skill` trên GitHub.** Nó là bản sao `main` với
`.claude/settings.json` bỏ 15 khoá, dựng để đo A/B xem harness nạp thêm skill nào khi tắt.
Đo xong, **hết tác dụng**, vô hại. Máy ảo xoá không được. Muốn dọn thì vào
https://github.com/gc1001vn-svg/quoc-chien/branches bấm thùng rác.

**Nếu anh đã chuyển kho `ghi-nho` sang Public: chuyển về Private.** Kho chứa cách làm việc,
quyền hạn và giới hạn máy ảo.

## 4. Nợ đang chặn phase kế tiếp

- **Phase 8B chưa làm: chưa có mẻ sprite hiện đại.** Khớp nối dựng sẵn. Việc khó **không
  còn là thiếu model**: Poly Pizza đo 15/09 cho **127 dáng nhà duy nhất** (`Category`
  bắt đầu bằng `Buildings`), **103 dáng ≤ 8.000 tam** tức nướng được, trong đó **52 dáng
  CC0**. Game cần 32 → dư. `city-builder-bits` chỉ 8 dáng nên **không còn là cái chặn**.
  Cái chặn mới là **phong cách**: 127 dáng đó của nhiều tác giả khác nhau, ghép vào một
  thành phố có thể nhìn lộn xộn. Phải nướng thử vài dáng rồi gửi ảnh chủ dự án so.
- **Thưởng công nghệ chưa đổi được thành phố.** Trần nhà 398 mà thành phố chỉ tới 241 —
  trần không phải cái chặn, nhu cầu mới là. Hạ ngưỡng chờ 40→28 cũng vẫn 241.
- **Thẻ chính sách chưa đụng được kinh tế** — cố ý, để hiệu ứng tháo ra đúng bằng cái đã
  lắp vào. Thẻ "+15 % lương thực" của GAME_SPEC mục 7 chờ Phase 9.
- **Lớp chiến dịch chưa nối vào kinh tế thành phố** — việc Phase 9.
- **Chưa có AI nước khác.** Ba nước đối thủ đứng yên.
- **NỢ CHẶN NẶNG NHẤT: tải model Poly Pizza không được.** `static.poly.pizza` — host của
  **mọi** đường `Download` — trả `403` với thân `Just a moment...` của **Cloudflare**.
  Không phải proxy phiên chặn. Đã thử hết bộ header trình duyệt, vẫn `403`.
  Lái Chromium **nay làm được** (`npm run mo:mang`, mục 1 ở trên) nhưng **vẫn không tải
  được**: `poly.pizza` kẹt ở `Just a moment...` suốt 60 giây, Cloudflare nhận ra IP trung
  tâm dữ liệu. Đã thử User-Agent thật, ẩn `navigator.webdriver`, điều hướng thẳng tới
  `.glb` — 0 file. Bước tiếp theo là bê cookie `cf_clearance` ra ngoài trình duyệt, **cố ý
  không làm**: đó là né kiểm soát truy cập của bên thứ ba.
  **Hệ quả: Poly Pizza dò được, không tải được** — muốn model thì chủ dự án tải bằng máy
  mình. Chi tiết: `docs/DAU_PHIEN.md` mục H.
  **CHƯA CHỐT** — chủ dự án giữ nợ này mở tới khi phiên sau đo xong kho gương Icosa
  (mục 3). Đừng ghi là đã đóng.
  **Đo lại toàn bộ 15/09 (lần 2): y nguyên, đừng mò lại** — `v1.1/download/<id>`,
  `v1.1/model/<id>/download`, `v1.1/asset/<id>` đều `404 Not Found`; `cdn.` `files.`
  `assets.poly.pizza` không tồn tại; Chromium có `cf_clearance@.poly.pizza` rồi vẫn kẹt.
  Đường còn lại là **kho gương Icosa**, chờ allowlist — mục 3.
- **`trai_ga`: đã tìm ra model, chưa tải về được.** Poly Pizza có `Chicken` (CC0 1.0 ·
  2.648 tam · `.glb`) và `ChickenCoop` (CC0 1.0 · 948 tam · `.glb`) — đúng thứ cần, nhưng
  vướng đúng cái nợ ngay trên. Kho chung có `Chicken` của
  `quaternius/ultimate-monsters/Blob` (**tải được ngay**) nhưng là gói quái vật kiểu blob,
  dáng khác `Pig`/`Sheep`. Nợ treo từ 06/09. `NGUON_MO.md` mục 8.
- **Người vác hàng đi tay không** — để Phase 10.
- **`KHO_ASSET.md` còn con số đếm kiểu cũ** (chỉ tính `.obj`, trong khi máy nướng đọc cả
  `.gltf` và `.glb`). File **sinh tự động**, sửa tay là sai luật — nó tự đúng ở lần
  `npm run kho` đầu tiên có đủ kho, tức phiên Phase 8B.
- **Nhánh `claude/*` chết trên remote.** Máy ảo xoá không được (`HTTP 403`, đo lại 14/09)
  — chỉ chủ dự án bấm ở trang `branches`. **Đừng chép số nhánh vào đây**, nó đổi mỗi lần
  anh bấm; đếm bằng lệnh, và `git branch -r --merged origin/main` nói cái nào xoá được:

  ```bash
  git ls-remote --heads origin | sed 's#.*refs/heads/##'
  ```

  Một ngoại lệ đáng ghi, vì đọc `--merged` sẽ ra kết luận sai: `caveman-mode-tetfj7` git
  báo **chưa gộp** nhưng đừng tưởng là việc còn treo — `main` đã có cả Phase 2B và đi xa
  hơn; nhánh chỉ còn bản công thức mẻ CŨ đã bị thay. Giữ hay xoá đều được.
- **`tayvuc`: `CLAUDE.md` 2.322 token**, vượt ngưỡng chung 1.600. Không cắt vì repo dừng
  hẳn; đặt ngưỡng tạm 2.400 kèm lý do trong `.claude/nguong_token.txt`, cắt khi mở lại.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase 8B — nướng mẻ hiện đại (làm được ngay)

Nướng mẻ sprite thời hiện đại từ `city-builder-bits` (KayKit, CC0), rồi nối vào
`ThoiDai.me` để lên đời là thành phố đổi mặt.

**Việc phải quyết trước khi nướng:** gói chỉ có **8 dáng nhà** (`building_A`…`building_H`)
cộng đường, xe, cột đèn — mà game có **32 loại nhà**. Hai đường: ghép 32 về 8 dáng, phân
biệt bằng màu và vật trang trí (mọi nhà đổi mặt, nhưng nhà khác chức năng trông giống
nhau), hay chỉ đổi mặt nhóm `do_thi` (không nhà nào sai chức năng, nhưng thành phố lẫn lộn
hai thời). **Nướng xong gửi ảnh cho anh chọn.**

**Rủi ro phải đo trước khi hứa:** mẻ hiện đại là **bộ atlas thứ ba**. Hai màn hiện giữ 2
trang cùng lúc, trần là 4 — còn đúng 2 trang để tiêu. Đo số trang trước khi nướng cả mẻ.
TECH_SPEC mục 2 đã chốt cách lùi: đổi đời thì `gl.deleteTexture` nhả atlas cũ.

**Asset — KHÔNG cần `npm run tai:tatca` (~1 GB).** Mẻ hiện đại chỉ cần **một gói**:

```bash
node tools/tai_itch.mjs kaylousberg/city-builder-bits
```

**Tải lẻ thì CẤM chạy `npm run kho`** — nó ghi đè `docs/KHO_ASSET.md` bằng đúng những gì
đang có trên đĩa, mà lúc đó kho chỉ có một gói. `KHO_ASSET.md` đã có sẵn mục
`city-builder-bits` từ 10/09.

`city-builder-bits` **không có** trong kho chung của `tayvuc` → vẫn phải tải từ itch.
Luật dò và cách lấy từ kho chung: `docs/DAU_PHIEN.md` mục F.

**Mở phiên mới rồi hãy bắt đầu** — mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G ở kho, không bỏ bước nào.
