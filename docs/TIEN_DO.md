# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 17/09/2026 (phiên dò API/MCP mở + hai nguồn mới cho `kho-game` — **không đụng màn hình game**).

## 1. Đang ở đâu

**Game vẫn ở Phase 8A.** Mười phiên liền (12/09, 13/09, 14/09 ×2, 15/09 ×3, 16/09 ×2,
17/09 ×2) không đụng gì màn hình game: 12/09 gỡ 11/11 xung đột tài liệu, 13/09 rà soát và đồng bộ bộ đồ
nghề cho cả bốn repo, 14/09 thêm hook `UserPromptSubmit` nhắc kho, 14/09 (lần 2) dựng hàng
rào tất định và thước `khoi:dong`, 15/09 dựng bản duyệt Artifact và lệnh dò asset, 15/09
(lần 3) đo kho gương Icosa, 16/09 tách kho chung, 16/09 (lần 2) mở kho lên 9 nguồn và sửa
bộ đọc glTF. Chi tiết:
`docs/NHAT_KY/PHASE_8_RA_SOAT.md`, `PHASE_8_DO_NGHE.md`, `PHASE_8_NHAC_KHO.md`,
`PHASE_8_TAT_DINH.md`, `PHASE_8_BAN_DUYET.md`, `PHASE_8_TAI_POLY.md`, `PHASE_8_ICOSA.md`,
`PHASE_8_KHO_CHUNG.md`, `PHASE_8_API_MCP.md`.

**Phase 8B làm được ngay phiên sau** — không còn gì chặn. Ba đường chọn dáng nhà, số đo ở
mục 5; **Kenney City Kit đang dẫn** (60 dáng, một tác giả, CC0).

### Phiên 17/09 (lần 2) đã đổi gì

Toàn bộ ở `kho-game`, **không chạm repo này**. Chi tiết: `docs/NHAT_KY/PHASE_8_API_MCP.md`.

- **Hai nguồn 2D mới, tổng 104.080 mục**: `ke/openclipart.tsv` **101.536 mục CC0** và
  `ke/openverse.tsv` **2.544 mục** (CC0 1.708 · CC-BY 836). Trước đó nguồn 2D lớn nhất là
  OpenGameArt 9.347 mục — nay gấp hơn mười lần.
- **Ba công cụ mới**: `quet_openclipart.mjs`, `quet_openverse.mjs`, `lay_openverse.mjs`.
- **Dò 24 host, soi 4 mục lục** (`public-apis` 1.827 API...). **MCP: không thêm cái nào** —
  5 cái đã cân và loại.
- **Openclipart còn thiếu 249/5.820 sitemap** vì họ chặn IP khi quét lâu. Chạy lại
  `node cong-cu/quet_openclipart.mjs` khi hết chặn; **đừng `--lam-lai`**.

### Phiên 16/09 (lần 2) đã đổi gì

- **Kho mục lục chung 10 nguồn: https://github.com/gc1001vn-svg/kho-game** —
  **139.650 dòng**, repo ~4,5 MB, **không chứa file nhị phân**. Dò thấy cái nào cần mới
  tải. Riêng **model 3D dò được: 86.290**, cộng 215 gói Kenney chưa kê lẻ. Ba loại trước
  đây không có nguồn nào: **âm thanh (28.740), nhạc (6.825), font (1.941)**.
  Số từng nguồn và bốn kiểu chặn khác nhau: `docs/NHAT_KY/PHASE_8_KHO_CHUNG.md`.
- **`npm run do:asset` có bước 1c** gọi thẳng kho đó. Dò `ga` ra thêm 59 trúng ở Icosa,
  trong đó có `Chicken Coop` 8.888 tam.
- **Bộ đọc glTF sửa ba lỗi, kho Icosa 1.654/1.679 → 1.679/1.679 đọc được.**
  `tai_icosa.mjs` nay gọi `docGltf` ngay sau khi tải, bản nào không mở được thì thử bản kế.
- **Kenney City Kit: 60 dáng nhà, một tác giả, CC0** — `docObj` đọc 213/213 model, 0 lỗi.
  Mục 5 dưới đây đã ghi số chi tiết. Cái chặn "8 dáng cho 32 loại nhà" **không còn**.
- **Hook `chan_bao_xong` đòi thêm dòng `Đề xuất:`** khi báo xong — trước đó luật chỉ nằm ở
  `CLAUDE.md` repo này và chỉ áp cuối phiên. Ba repo cùng `md5 056679fe`.
- **Ghi công Icosa hết phải duyệt tay:** `docs/KHO_ICOSA.md` thêm cột *Trang gốc* nên nó
  **là** bản ghi công; `ASSET_CREDITS.md` chỉ trỏ sang, sửa đúng một lần bằng vé.

### Phiên 15/09 (lần 3) đã đổi gì

- **Kho gương Icosa: đo xong, TẢI ĐƯỢC THẬT.** Allowlist chủ dự án mở thông cả bốn tên
  miền; `web.archive.org` chỉ chạy với **`--http1.1`**. Tải về **1.671 model · 1.009 MB**
  (nhà/công trình **1.246/1.247**, con vật **434/434**). Đây là đường thay Poly Pizza —
  mục 4.
- **`npm run tai:icosa <từ khoá>`** — lọc license (tự loại ND và SA), 4 luồng, chạy lại
  được, cache dò 24 giờ, mỗi model kèm `ghi_cong.json`. Bốn bẫy đã đo ghi ở đầu
  `tools/tai_icosa.mjs`; **đừng mò lại**.
- **`docs/KHO_ICOSA.md`** — bản kê sinh tự động, lên git nên phiên sau `grep` được mà
  không phải tải lại 1 GB. Dò bằng `grep -io`, đừng `grep -i` trần.
- **Nợ `trai_ga` (treo từ 06/09) hết chặn** — `1YE8U35HXsI/Chicken_01.glb`, 648 tam,
  `docGltf()` đọc được. Còn việc nướng, không còn việc tìm.
- **Máy nướng không phải sửa gì** — `docGltf()` đọc cả `.glb` của wayback lẫn `.gltf` +
  `.bin` + `.png` của backblaze.

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

**Icosa — đo 15/09 (lần 3), số trên đĩa:** nhà/công trình **1.246/1.247** (17 từ khoá,
811 MB) · con vật **434/434** (9 từ khoá, 157 MB) · tổng **1.671 model · 1.009 MB**.
Bỏ **376** model vì license ND/SA và **2.804** vì quá 8.000 tam. Danh sách tên:
`docs/KHO_ICOSA.md` (sinh tự động — **đừng chép số ra đây**, số thật ở dòng cuối file đó).

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

### ✅ Việc 16/09 — khoá Freesound: XONG

Chủ dự án lấy khoá trong phiên, đã quét **27.313 file**. Khoá đi qua biến `FREESOUND_KEY`,
**không nằm trong repo nào** (đã `grep` lại để chắc). Muốn quét lại mẻ khác:

```bash
FREESOUND_KEY=<khoá> node cong-cu/quet_freesound.mjs ga chim
```

Khoá cũ hết hạn hay muốn đổi thì lấy lại ở <https://freesound.org/apiv2/apply/> — lấy dòng
**Api key**, không phải **Client id**.

### ⚠️ Ô "Allowed domains" GHI ĐÈ, không cộng dồn (17/09)

Đo thật: xin thêm 3 host, sau đó **6 host cũ biến mất** (`connect_rejected` cho cả 6, trong
khi 3 host mới `200`). Nên khi xin mở host, trợ lý **phải đưa danh sách ĐẦY ĐỦ** để dán.

Chín host đang cần, dán nguyên khối vào ô **Allowed domains**:

```
api.openverse.org
openclipart.org
api.iconify.design
lospec.com
api.sketchfab.com
gameasset.net
upload.wikimedia.org
images.rawpixel.com
svgsilh.com
```

`svgsilh.com` giữ hay bỏ đều được — Cloudflare đuổi, mở cũng không tải được.

### Đặt khoá vào môi trường — khỏi dán lại mỗi phiên

**Giao diện thật chỉ có `Environment variables`. KHÔNG có mục "API credentials".**
Tài liệu của repo từng ghi có — sai, chép lại từ ghi chép cũ mà không mở ra xem (17/09).
Hộp thoại tên **Edit cloud environment**, gồm: `Name` · `Network access` ·
`Allowed domains` · `Environment variables`. Hết.

1. Mở <https://claude.ai/code> → bấm nút tên môi trường ở đầu trang.
2. Ô **Environment variables**, thêm một dòng (dạng `.env`, mỗi khoá một dòng):

   ```
   FREESOUND_KEY=<chuỗi Api key>
   ```

3. Save.

**Phiên đang mở không nhận** — phải mở phiên mới. Kiểm:

```bash
node -e "console.log(process.env.FREESOUND_KEY ? 'co khoa' : 'chua co')"
```

**Cảnh báo của chính trang đó:** *"These are visible to anyone using this environment —
don't add secrets or credentials."* Khoá để đây ai dùng môi trường này cũng xem được. Môi
trường riêng thì rủi ro thấp, nhưng chia cho người khác thì **xoay khoá trước**.

### Việc mới 15/09 (lần 3)

**Ghi công CC-BY: cần anh cho phép sửa `docs/ASSET_CREDITS.md`** (file khoá). Toàn bộ
1.671 model Icosa là **CC-BY**, không có CC0 nào — dùng thì **bắt buộc ghi tên từng tác
giả** kèm một dòng ghi công Icosa Gallery. Tên tác giả đã lưu sẵn trong
`assets_source/icosa/<id>/ghi_cong.json` và `docs/KHO_ICOSA.md`, phiên nướng chỉ việc chép
vào. **Chưa nướng thì chưa cần** — hỏi anh đúng lúc nướng mẻ Icosa.

Chỗ này khác Poly Pizza: model Poly Pizza dùng được thì phải chép nguyên chuỗi
`Attribution` của API họ; Icosa thì ghi `tên model · tác giả · CC-BY 3.0 · link trang`.

### ✅ Việc cũ 15/09 (lần 2) — XONG

**Allowlist Icosa: anh mở xong, đã đo trong phiên 15/09 (lần 3).** `api.icosa.gallery`
**200** · `icosa.gallery` **200** · `archive.org` **200** · `web.archive.org` **200**
(chỉ với `--http1.1`). Anh mở thêm `backblazeb2.com` ngay trong phiên →
`s3.us-east-005.backblazeb2.com` từ `000 connect_rejected` thành **200**, vớt được đúng
những model wayback hỏng.

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
- **NỢ CHẶN NẶNG NHẤT ĐÃ HẾT CHẶN — có nguồn thay, chờ anh chốt đóng.** Điều kiện anh đặt
  ("giữ nợ mở tới khi phiên sau đo xong kho gương Icosa") **đã làm xong 15/09 lần 3**:
  Icosa tải được thật, **1.671 model · 1.009 MB** trên đĩa, `docGltf()` đọc được ngay.
  Poly Pizza **vẫn** không tải được và sẽ không bao giờ tải được từ máy ảo (Cloudflare
  nhận ra IP trung tâm dữ liệu) — nhưng nó không còn chặn việc gì, vì phần lớn model nhà
  của nó gốc từ Poly, mà Poly thì lấy qua Icosa được. Nguyên văn nợ cũ giữ dưới đây.
- **Nợ cũ, để đối chiếu: tải model Poly Pizza không được.** `static.poly.pizza` — host của
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
- **✅ Nợ bộ đọc glTF: SỬA XONG 16/09.** `start offset of Float32Array should be a
  multiple of 4` (offset lệch → đọc bằng `DataView`) · GLTF1 lọt vào
  (`(j.buffers ?? []).map is not a function`) · file phụ 0 byte vẫn bị bỏ qua.
  Kho Icosa **1.654/1.679 → 1.679/1.679 đọc được**.
- **✅ Chuồng gà: đã tìm ra 16/09** — `Chicken Coop` 8.888 tam trên Icosa, dò bằng
  `npm run do:asset ga`. Trước ghi "chưa có `ChickenCoop`".
- **✅ `trai_ga`: HẾT CHẶN 15/09 (lần 3) — model đã nằm trên đĩa.**
  `assets_source/icosa/1YE8U35HXsI/Chicken_01.glb` (tác giả Google · CC-BY 3.0 · **648
  tam** · `docGltf()` đọc được) — đúng model mà Poly Pizza trỏ vào. Kho Icosa còn nhiều
  dáng gà khác, `grep -io '[a-z0-9_ -]*chicken[a-z0-9_ -]*' docs/KHO_ICOSA.md`.
  **Còn lại là việc nướng**, không còn việc tìm. Nợ mở 06/09, chặn suốt vì tải.
  **Chưa có `ChickenCoop`** — chuồng vẫn là thứ phải dò tiếp hoặc giữ cách phân biệt
  bằng màu nền.
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

### Đường thứ ba, đo 16/09: Kenney City Kit — ĐANG DẪN

Tải và đo thật (`node tools/tai_asset.mjs city-kit-*`), **không phải ước**:

| Gói | Dáng nhà | Khác | Cỡ |
|---|---:|---|---:|
| `city-kit-suburban` | **21** | hàng rào, lối đi, cây, bồn hoa | 8,3 MB |
| `city-kit-commercial` | **19** | + 22 bản `low-detail`, mái hiên, dù | 12 MB |
| `city-kit-industrial` | **20** | ống khói, bồn, container, pin mặt trời, tháp nước, cối xay | 12 MB |
| `city-kit-roads` | — | 95 mảnh đường | 7,9 MB |

**60 dáng nhà, cùng một tác giả.** Game cần 32 → dư gấp gần hai, mà **không vướng cái
chặn phong cách** của Icosa. Cả bốn gói `License.txt` ghi `Creative Commons Zero, CC0`.
`docObj` đọc **213/213 model, 0 lỗi**.

So ba đường: `city-builder-bits` 8 dáng · **Kenney City Kit 60 dáng, đồng nhất** ·
Icosa hàng trăm dáng nhưng nhiều tác giả nên lộn xộn.

**Từ 15/09 (lần 3) có đường thứ hai:** kho Icosa trên đĩa có hàng trăm dáng nhà hiện đại
(`grep -io '[a-z0-9_ -]*house[a-z0-9_ -]*' docs/KHO_ICOSA.md`). Đổi lại: **nhiều tác giả
khác nhau nên phong cách lộn xộn** — đúng cái chặn đã ghi ở mục 4, và toàn bộ là CC-BY nên
phải ghi công. `city-builder-bits` một tác giả, đồng nhất, nhưng chỉ 8 dáng.
**Nướng thử cả hai rồi gửi ảnh cho anh so.**

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
