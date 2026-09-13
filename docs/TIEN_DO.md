# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 13/09/2026 (phiên đồng bộ bộ đồ nghề — **không đụng màn hình game**).

## 1. Đang ở đâu

**Game vẫn ở Phase 8A.** Hai phiên liền (12/09 và 13/09) không đụng gì màn hình game:
12/09 gỡ 11/11 xung đột tài liệu, 13/09 rà soát và đồng bộ bộ đồ nghề cho cả bốn repo.
Chi tiết: `docs/NHAT_KY/PHASE_8_RA_SOAT.md` và `docs/NHAT_KY/PHASE_8_DO_NGHE.md`.

**Phase 8B làm được ngay phiên sau** — không còn gì chặn.

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
| `npm run do` | 6/6 | **8/8** (thêm `check:token`, `check:kehoach`) |
| `CLAUDE.md` | 101 dòng · 2.237 token | **53 dòng · 1.064 token** |
| Repo chạy bản hook chuẩn | 1/4 | **4/4** |
| Repo có `skillOverrides` | 1/4 | **4/4** |
| `skillOverrides` tiết kiệm | chưa đo | **14.349 ký tự/phiên** (~4.783 token) |
| **Token nạp mỗi phiên** | 37.071 ký tự | **25.295 ≈ 8.431 token** · **−31%** |

Lệnh đo ba repo kia: `ghi-nho` **30/30** · `vsp-fleet-safety` **5/5** ·
`tayvuc` `npm run do` mã 0 (**742 test / 56 file**).

Chia nhỏ token nạp mỗi phiên: cài đặt cá nhân 826 · `CLAUDE.md` 3.192 · `so-thich` **8.008** ·
`du-an` **4.869** · `trang-thai` **8.098** · mô tả skill `md` 220 · hook `SessionStart` 82.
**Ba file kho: 20.975 ký tự ~6.991 token** — đọc HẾT mỗi phiên, mọi repo.

**Kho tách hai tầng:** `so-thich.md` giữ thứ phải biết **trước** mỗi phiên; năm luật chỉ cần
đúng lúc làm việc đó sang `cong-cu/luat-chi-tiet.md`, tra bằng `grep`.

**Bốn hook chạy ở cả bốn repo:** `SessionStart` (kiểm đầu phiên) · `PreToolUse`
(chặn sửa file khoá) · `PostToolUse` (ghi sổ lệnh) · `Stop` (chặn báo "xong" thiếu `Số đo:`).

**Ba bước vẫn phải nhớ, máy không kiểm được:** xác nhận trên iPhone thật · dò asset ba bước ·
Plan Mode. Cùng bốn việc cuối phiên.

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

**Hai phiên liền không đụng màn hình game — không có gì phải kiểm trên iPhone.**

Còn một việc treo từ 11/09, nhỏ: ⏳ **nút "Đo trần sprite" ở màn dọc** — anh bấm được,
nhưng chưa có ảnh nào cho thấy bốn nút ☰ ⌂ 🔬 📏 thẳng hàng. Lúc nào mở game thì liếc một cái.

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

- **Phase 8B chưa làm: chưa có mẻ sprite hiện đại.** Khớp nối dựng sẵn, việc khó là dữ
  liệu: `city-builder-bits` chỉ có **8 dáng nhà** cho **32 loại nhà** của game.
- **Thưởng công nghệ chưa đổi được thành phố.** Trần nhà 398 mà thành phố chỉ tới 241 —
  trần không phải cái chặn, nhu cầu mới là. Hạ ngưỡng chờ 40→28 cũng vẫn 241.
- **Thẻ chính sách chưa đụng được kinh tế** — cố ý, để hiệu ứng tháo ra đúng bằng cái đã
  lắp vào. Thẻ "+15 % lương thực" của GAME_SPEC mục 7 chờ Phase 9.
- **Lớp chiến dịch chưa nối vào kinh tế thành phố** — việc Phase 9.
- **Chưa có AI nước khác.** Ba nước đối thủ đứng yên.
- **`trai_ga` vẫn không có model gà.** Dò hết 11 gói, không gói nào có — `NGUON_MO.md` mục 8.
- **Người vác hàng đi tay không** — để Phase 10.
- **`KHO_ASSET.md` còn con số đếm kiểu cũ** (chỉ tính `.obj`, trong khi máy nướng đọc cả
  `.gltf` và `.glb`). File **sinh tự động**, sửa tay là sai luật — nó tự đúng ở lần
  `npm run kho` đầu tiên có đủ kho, tức phiên Phase 8B.
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
