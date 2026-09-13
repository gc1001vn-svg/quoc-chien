# Phiên 12–13/09 — rà soát và đồng bộ bộ đồ nghề (không đụng game)

Chủ dự án dừng việc bàn "thứ dùng chung để ở đâu", bắt **đo thật toàn bộ lịch sử** trước
khi quyết. Phiên kéo hai ngày, không đụng một dòng nào của game.

**Đo được:** 38 phiên Claude Code (09/08→12/09) + 61 hội thoại claude.ai (09/06→26/08) —
lịch sử liền mạch. Token thật đọc được từ `external_metadata.context_usage.used_tokens`.

**Ba phát hiện đắt nhất:**
1. **Có NĂM chỗ để thứ dùng chung, không phải ba** — thiếu **cài đặt cá nhân** (tự nạp cả
   claude.ai lẫn Claude Code) và **bộ nhớ claude.ai** (Claude tự ghi, không tới Code).
   Cả 7 luật sở thích trong kho đã nằm sẵn ở cài đặt cá nhân → trả tiền hai lần.
2. **Một luật nằm 4–6 nơi.** Đã gộp: mỗi luật đúng một chỗ.
3. **`skillOverrides` 26/26 khoá đều có ăn** — 12.546 ký tự/phiên. Đo A/B làm được trong
   **một** phiên: đổi nhánh là harness nạp lại danh sách skill ngay.

**Đã làm:** gộp trùng lặp · hợp nhất ba bản `chan_file_khoa.mjs` thành một (`md5 cadf0d7e`)
· đồng bộ hook + `skillOverrides` sang **cả bốn repo** · `cong-cu/cai_dat.mjs` cài một lệnh
vào repo mới · `giam-token` thành **thước** `check:token` trong lệnh đo, hết cảnh phải nhớ
gọi · thang tra-trước-khi-viết và luật đọc file lớn vào kho, áp mọi repo.

**Số đo:** `npm run do` **6/6 → 7/7** · `CLAUDE.md` **101 dòng 2.237 token → 57 dòng 1.191**
· `ghi-nho` 27/27→28/28 · `vsp-fleet-safety` 1/3→4/4 (thiếu `httpx2` trong
`requirements.txt`, không phải lỗi code) · `tayvuc` 65→215 và 98→107 dòng hook.

**Sai của chính phiên này, đã sửa:** "42 phiên" → thật **38** · "18 skill" → **17** ·
"50 commit" → **141** (đếm trên kho nông) · "25 khoá" → **26** · "`ponytail` vô dụng" → nó
chính là thang tra-trước, thiếu là thiếu hook · "`ghi-nho` trùng 100%" → có ba luật riêng ·
lỡ commit vé duyệt lên git, đã gỡ.

**Còn treo:** bộ nhớ claude.ai lệch với kho về phương tiện du lịch (xe máy) — chờ chủ dự án.

---

## Phần hai (13/09 chiều) — đồng bộ bốn repo, dựng hai thước mới

**Đồng bộ:** `vsp-fleet-safety` và `tayvuc` nhận bản hook chuẩn + `skillOverrides`.
`tayvuc` trước chạy **hai** bản cũ: `chan_file_khoa` 65→215 dòng và `chan_bao_xong` 98→107
(bản cũ chặn NHẦM cụm từ giữa dòng — nợ ghi từ 05/09, nay trả). **Cả bốn repo giờ cùng một
bản** (`md5 cadf0d7e`). Cài vào repo mới bằng một lệnh: `cong-cu/cai_dat.mjs`.

**Hai thước mới, cả hai thay cho luật không ai giữ:**

- `check:token` — `giam-token` hết là skill phải nhớ gọi. Chạy lần đầu: `CLAUDE.md`
  **101 dòng ~2.237 token**, gấp 4,5 lần mức khuyến nghị 500. Cắt còn **53 dòng ~1.064**.
- `check:kehoach` — khuôn kế hoạch ghi "tối đa 20 dòng" mà thực tế **210** và **145** dòng.
  Trần mới **60**, hai file cũ miễn.

**Vá `vsp-fleet-safety`:** `bash scripts/do.sh` ra 1/3 trên máy ảo sạch. Không phải lỗi
code — `requirements.txt` thiếu `httpx2` (`starlette.testclient` bản mới đòi gói đó, tài
liệu ghi `httpx`). Thêm vào là 3/3.

**Gỡ chồng chéo:** xoá hai file `nang-cap/` do chính phiên này đẻ ra — ba file cùng liệt kê
một bộ đồ nghề theo ba cách chia. Sửa hai khối lạc hậu trong `trang-thai.md`.

**Sai tiếp của phiên này, đã sửa:** "`ke-hoach/` bỏ được mà không mất gì" → **sai**, một bản
được quay lại sửa khi làm lộ ra lỗi · "Memory → tìm `ways-of-working`" → **chỉ sai chỗ**, nó
nằm trong bộ nhớ **Project "Du lịch"**, không phải Memory chung · lỡ commit vé duyệt lên git.

---

## Phần ba (13/09 tối) — thứ gì MÁY kiểm được thì để máy kiểm

Rà lại theo câu hỏi "món nào đang tự chạy, món nào còn phải nhớ". Ra **hai lỗ hổng**:

**1. `tayvuc` có bốn thước mà không có lệnh đo gộp** — `check:base` `check:credits`
`check:token` `check:kehoach` nằm đó không ai chạy. Thêm `npm run do` chạy đủ tám bước.

**2. Bốn trong bảy bước đầu phiên chỉ là chữ phải tự nhớ.** Dựng hook `SessionStart`
(`scripts/dau_phien.mjs`) tự in 2–3 dòng mỗi phiên: nhánh git + file chưa commit + commit
chưa đẩy · thư viện đã cài chưa · `skillOverrides` có trống không · lệnh đo của repo là gì.
Trần cứng **dưới 10 dòng** — nó vào ngữ cảnh mỗi phiên, dài là phản tác dụng, đúng cái đang
đi chống.

**Ba bước vẫn phải nhớ, máy không kiểm được:** xác nhận trên iPhone thật (máy không biết chủ
dự án đã xem chưa) · dò asset ba bước (máy không biết định vẽ hay định dò) · Plan Mode.
Cùng bốn việc cuối phiên. Không tìm ra cách biến thành máy mà không gây phiền.

`cai_dat.mjs` giờ cài **bốn hook** + ba script đo — repo mới chạy một lệnh là có hết.

---

## Phần bốn — rà soát cuối, bắt được chính phiên này làm kho phình

Đo lại token từng khối thì lộ: giữa phiên **kho phình 32%** — `trang-thai.md` 17.252 →
**23.356**, `so-thich.md` 6.700 → **14.646**. Tăng trong đúng cái phiên đi chống phình.
Lý do: `CLAUDE.md` có thước nên không phình được, **kho thì không có thước nào**.

**Cắt:**
- `trang-thai.md` → **10.768**. Mục "Nợ kỹ thuật" phần lớn là nợ **riêng `quoc-chien`**,
  mà file này đọc mỗi phiên **mọi repo** — phiên làm ở `vsp-fleet-safety` cũng phải gánh nợ
  atlas của game. Giờ chỉ giữ nợ dùng chung, nợ riêng trỏ về file của repo đó.
- `so-thich.md` → **12.562**. Bỏ chi tiết riêng `quoc-chien` và ví dụ dài.

**Dựng `check_kho.mjs`** — trần 13.000 / 7.000 / 13.000 ký tự. Nó **bắt ngay lần đầu**:
`so-thich.md` vượt 279 ký tự; cắt xong vượt tiếp **1 ký tự**, phải cắt lần nữa.
Không nhân nhượng, đúng ý.

**Token nạp mỗi phiên, đo cuối:** cài đặt cá nhân 826 · `CLAUDE.md` 3.192 · `so-thich`
12.562 · `du-an` 6.096 · `trang-thai` 10.768 · mô tả 3 skill 718 · hook `SessionStart` 82.
**Cộng 34.244 ký tự ≈ 11.413 token** — đầu phiên là 37.071, giảm 8%.

---

## Phần năm — giảm token tiếp, và một lỗ hổng về skill

**Lỗ hổng:** `skillOverrides` **không tự phủ skill mới**. Anthropic thêm một skill dựng sẵn,
hoặc chủ dự án tải lên skill mới → nó lọt vào ngữ cảnh mỗi phiên, **không ai báo**. Vá bằng
hook `dau_phien.mjs`: so thư mục skill đồng bộ với `skillOverrides`, báo tên nào chưa có
khoá. Thử: bỏ `pptx` khỏi khoá → hook báo ngay.

**Tắt bốn skill còn bật** (`user-invocable-only`, gõ `/` vẫn chạy) → 33 khoá.
**Rồi bật lại `md`** — chủ dự án hỏi đúng chỗ, tắt nó là **sai**: nó có `convert.sh`,
**không có bản thay thế**. Gửi file mà không gọi nó thì đọc file gốc — `conversations.json`
27 MB ≈ **7 triệu token**. 73 token/phiên là bảo hiểm rẻ nhất cả bộ.
`giam-token` giữ tắt (luật đã thành thước `check:token`), `lap-ke-hoach` giữ tắt (chỉ cần
lúc mở dự án), `code-review` giữ tắt (chưa dùng lần nào trong 38 phiên).

**Tách kho làm hai tầng.** `so-thich.md` giữ thứ phải biết **trước** mỗi phiên; năm luật chỉ
cần **đúng lúc làm việc đó** (ghi `quyet-dinh/` · lập kế hoạch · `CLAUDE.md` phình · số liệu ·
in số phiên bản) sang `cong-cu/luat-chi-tiet.md`, tra bằng `grep`. `so-thich.md` giữ bảng
tóm tắt + lệnh tra — luật không mất, chỉ dời chỗ. **13.327 → 7.965 ký tự.**

**`.claude/skill_bat.txt`** — skill cố ý bật, kèm **lý do bắt buộc**. Không có nó thì hook
báo cả `md` → cảnh báo giả, mà cảnh báo giả thì phiên sau học cách bỏ qua, mất luôn tác
dụng thật.

**Token nạp mỗi phiên:** 37.071 → **25.252 ký tự** (~8.417 token). **Giảm 32%.**

---

## Phần sáu — rà soát chốt phiên

Quét 14 luật xem còn trùng không: chỗ nào xuất hiện nhiều nơi đều **khác ngữ cảnh**, không
phải chép. `cấm head/tail` 3 nơi nhưng nói về ba file khác nhau · `Plan Mode` ở `DAU_PHIEN`
chỉ nằm trong ghi chú *"bốn mục cũ đã gộp"* · `cai_dat.mjs` 5 nơi là **trỏ lệnh**.
Đường trỏ chết: **không có** (hai cái script báo là dương tính giả — `convert.sh` có thật
trong thư mục skill `md`).

Bốn repo khớp: sáu script cùng `md5`, bốn hook mỗi repo, 32 khoá (`vsp-fleet-safety` 29 —
thiếu ba khoá VSP, cố ý).

**Hai lỗi tìm ra, đều là số gõ tay lạc hậu — đúng cái luật này cấm:**
`so-thich.md` ghi "33 khoá" trong khi thật **32** · `luat-chi-tiet.md` ghi "chép sẵn **hai**
script" trong khi thật **bảy**. Sửa cả hai thành **trỏ vào nguồn**, không gõ số.
Đo lại tiết kiệm `skillOverrides` với 32 khoá: **14.349 ký tự/phiên**, không phải 12.546.

**Token nạp mỗi phiên, đo cuối:** cài đặt cá nhân 826 · `CLAUDE.md` 3.192 · `so-thich`
8.008 · `du-an` 4.869 · `trang-thai` 8.098 · mô tả `md` 220 · hook 82 =
**25.295 ký tự ≈ 8.431 token**. Đầu ngày 37.071 → giảm **11.776 ký tự, 31%**.

**Số đo cuối:** `quoc-chien` **8/8** · `ghi-nho` **30/30** · `vsp-fleet-safety` **5/5** ·
`tayvuc` `npm run do` mã 0, **742 test đạt / 56 file**.

---

## Phần bảy — vá lỗ hổng cuối: máy không cưỡng chế được việc cuối phiên

Chủ dự án hỏi lại repo `ghi-nho` có thừa không, có thật sự chống được chuyện quên không.
Đo trên máy ảo phiên này: `~/.claude/projects/` chỉ có **phiên đang chạy**, không có thư
mục bộ nhớ nào → **Claude Code không có bộ nhớ tự động giữa phiên**. Git là thứ duy nhất
sống qua phiên; `ghi-nho` đã **107 commit** từ 04/09. Kho **không trùng** với cái gì cả.

Chỗ lẫn là **skill `ghi-nho`** (trùng với mồi trong `CLAUDE.md`, đã tắt) ≠ **repo `ghi-nho`**
(nguồn duy nhất, giữ nguyên).

**Mắt xích trí nhớ 7 khâu, đo lại không đứt khâu nào:** cài đặt cá nhân có lệnh clone →
`CLAUDE.md` có mồi → kho có nội dung → kho trỏ `TIEN_DO.md` → kho trỏ `quyet-dinh/` (36 file)
→ tiến độ trỏ `NHAT_KY/` (16 file) → `tests/TaiLieu.test.ts` giữ mắt xích khỏi đứt.

**Lỗ hổng còn lại duy nhất:** ba việc cuối phiên (ghi nhật ký · ghi đè tiến độ · cập nhật
`trang-thai.md`) **không có máy nào kiểm**. Hook `chan_bao_xong` chỉ đòi dòng `Số đo:`.
Một phiên làm xong rồi quên ghi thì phiên sau **không biết chuyện đó từng xảy ra** — đúng
cái mà kho sinh ra để chống.

**Vá:** không chặn giữa phiên (làm code trước, ghi nhật ký sau là bình thường), mà bắt ở
**đầu phiên sau**. `dau_phien.mjs` so ngày commit cuối của code với ngày commit cuối của
`docs/NHAT_KY` + `docs/TIEN_DO.md`; code mới hơn thì in
`phien truoc sua code <ngay> ma nhat ky/tien do dung o <ngay> — doc git log roi ghi bu`.

Thử cả hai chiều trong repo git giả: code 12/09 + tài liệu 10/09 → **báo**; ghi bù 13/09 →
**im**. Không có cảnh báo giả.

**Vá kèm:** `cai_dat.mjs` nhận `--vsp` làm đường dẫn repo khi không truyền đường dẫn rõ —
chạy `cai_dat.mjs --vsp` trong `ghi-nho` đã đặt nhầm bộ khoá VSP (29) vào đó. Đã sửa để bỏ
qua mọi tham số bắt đầu bằng `--`, và trả `ghi-nho` về 32 khoá.

**Số đo:** bốn repo cùng `dau_phien.mjs` md5 `55e1060a` · `quoc-chien` **8/8** ·
`ghi-nho` **30/30** · `vsp-fleet-safety` **5/5** · `tayvuc` mã 0 · khoá 32/32/29/32.

---

## Phần tám — tra công cụ tiết kiệm token ngoài, đo thật, chỉ giữ một

Chủ dự án bảo lên mạng/mã nguồn mở tìm trình tiết kiệm token đáng xài. Tra xong **đo trên
chính phiên này** (`usage` trong transcript, 933 lượt gọi model) — số lật ngược phần lớn
lời khuyên trên blog:

| Khoản | Token | Theo hệ số giá quen dùng |
|---|---:|---:|
| Cache đọc (gửi lại lịch sử) | **373.501.861** | 84,5% |
| Output | 834.745 | 9,4% |
| Cache ghi | 2.134.877 | 6,0% |

**Mỗi lượt gọi model gửi lại 400.323 token.** Toàn bộ `tool_result` + `tool_use` cả phiên
chỉ ~240.297 — **đọc file không phải chỗ tốn**. Chỗ tốn là *số lượt* × *cỡ ngữ cảnh*: thứ
nạp sớm bị nhân với số lượt còn lại (8.431 token đầu phiên × 933 ≈ **7,9 triệu**).

**Giữ đúng một công cụ:** `repomix --compress` (npm, MIT) → `scripts/goi_repo.sh` ở cả bốn
repo. Đo thật: TS 84 file **134.317 → 65.774** token (−51%), Python 23 file
**16.759 → 11.551** (−31%). Chạy bằng `npx` khi cần hiểu toàn hệ thống một lần;
**không** đưa vào `package.json` — gói cả repo vẫn đắt hơn `grep` + đọc ba file.

**Loại, kèm lý do đo được:** `caveman` và mọi thứ cắt *output* (output chỉ **0,22%** token
thô) · Serena MCP (repo 55 file, mô tả tool nạp mỗi lượt là lỗ; có báo cáo ngược là tốn
hơn) · `gitingest` `code2prompt` (repomix trùm, không nén AST) · `ast-grep` để dành.

**Thứ mọi blog khuyên mà ở đây vô dụng:** hook nén output lệnh. Đo: `npm run do` in **331
ký tự**, `vitest` **176**, `tsc` **0** — `do.sh` đã in gọn từ đầu, không còn gì để cắt.

**Luật mới vào kho:** gộp lệnh vào một `Bash`, việc độc lập gọi song song một lượt; việc mới
không liên quan thì mở phiên mới. `so-thich.md` giữ bản ngắn, số đo ở
`cong-cu/luat-chi-tiet.md`, chốt ở `quyet-dinh/2026-09-13-token-dat-o-so-luot-goi.md`.

`check_kho.mjs` lại bắt đúng lúc: thêm luật là `so-thich.md` vượt trần **567 ký tự**. Cắt
bốn lần mới lọt — **8.497/8.500**. Không nới ngưỡng.
