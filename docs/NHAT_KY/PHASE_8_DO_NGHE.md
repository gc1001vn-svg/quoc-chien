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

**Số đo cuối:** `quoc-chien` **8/8** · `ghi-nho` **30/30** · `vsp-fleet-safety` **5/5** ·
`tayvuc` `npm run do` mã 0, **742 test đạt / 56 file**.
