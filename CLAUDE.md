# CLAUDE.md — QUỐC CHIẾN

Game chiến thuật offline, 2D isometric, PWA. Đẩy `main` là tự lên
https://gc1001vn-svg.github.io/quoc-chien/ — **xong việc tự gộp `main`**, không hỏi, không PR.

## Đầu phiên — đọc kho ghi nhớ trước hết

Ba file, **đọc HẾT, cấm `head`/`tail`/`sed -n`** (thứ đắt nhất nằm cuối `trang-thai.md`):

```bash
git -C /home/user/ghi-nho pull -q 2>/dev/null \
  || git clone --depth 1 https://github.com/gc1001vn-svg/ghi-nho /home/user/ghi-nho
cat /home/user/ghi-nho/{so-thich,du-an,trang-thai}.md
```

Kho **Private**, clone hỏng thì gọi `add_repo` với `access: read` — **đừng xin `push`**,
xin quyền ghi cho repo ngoài phạm vi phiên là bị chặn thẳng, còn `read` qua ngay. Hỏng
tiếp thì **đổi cách hỏi**, đừng thử lại y hệt rồi kết luận là không có quyền: đã mất
nguyên một phiên vì nghĩ vậy (12/09), và một phiên khác vì cắt `head -120` (11/09).

Rồi chạy `docs/DAU_PHIEN.md` — lệnh và bẫy riêng repo này.

**Bảy bước đầu phiên · cách trả lời · luật báo "xong" · sở thích chủ dự án: ĐỀU Ở KHO,
không chép về đây.** Gộp 13/09 — trước đó cùng một luật nằm 4–6 nơi, sửa một nơi là lệch
với năm nơi kia.

**Mỗi phiên một phase.** **TIẾP** = phase kế · **ĐỔI…** = sửa trong phase này ·
**LỖI** = dừng sửa trước. Nhìn được thì `npm run chup:man` gửi ảnh.
Cuối phiên: `docs/NHAT_KY/PHASE_<n>.md` (~15 dòng), ghi đè `docs/TIEN_DO.md` mục 1–5,
in khối `=== VIỆC CỦA ANH BÂY GIỜ ===`.

## Ba luật không được phá

1. **`src/sim/` TypeScript thuần** — cấm `document` `window` WebGL, cấm import `render/`
   `ui/` `bench/`. Import ghi đủ đuôi `.ts`; cấm `constructor(readonly x: T)`.
2. **Cấm số cân bằng trong `.ts`** — mọi tỉ lệ vào `data/*.json`.
3. **Vượt trần hiệu năng là lỗi**, không "tối ưu sau" — `docs/TECH_SPEC.md` mục 2.

## Tra trước, đừng tự viết — luật đắt nhất về token

**Trước khi viết bất cứ dòng code nào**, leo thang, dừng ở bậc đầu tiên đỡ được:

1. **Việc này có cần tồn tại không?** Nhu cầu phỏng đoán → bỏ, nói một dòng.
2. **Repo này đã có chưa?** Hàm, util, kiểu, mẫu sẵn có → dùng lại. Viết lại thứ nằm cách
   vài file là lỗi hay gặp nhất. Bộ đọc GLB từng bị ước "~200 dòng" nên bỏ qua nhiều phiên
   — làm thật hết **30 dòng** vì phần khó đã nằm sẵn trong `tools/lib/gltf.mjs`.
3. **Thư viện chuẩn của ngôn ngữ làm được?** Dùng.
4. **Nền tảng có sẵn?** CSS hơn JS, API trình duyệt hơn thư viện.
5. **Thư viện ĐÃ cài giải quyết được?** Dùng. Đừng thêm thư viện mới cho thứ vài dòng làm xong.
6. **Một dòng được không?** Một dòng.
7. Chỉ khi hết bậc trên: viết tối thiểu cho chạy được.

Không có trong repo → tra **mã nguồn mở, npm, GitHub** trước. Vẫn không có → tìm công cụ,
hoặc học cách người ta làm. **Tự viết là bậc cuối, không phải bậc đầu.**
Với asset thì theo luật dò ba bước ở mục Quy ước.

**Đừng lười phần hiểu bài.** Thang này rút ngắn lời giải, không rút ngắn phần đọc. Diff nhỏ
đặt sai chỗ không phải lười, là thêm một lỗi nữa.

**Sửa lỗi thì sửa gốc.** `grep` mọi nơi gọi hàm sắp sửa. Một chốt chặn trong hàm dùng chung
là diff nhỏ hơn chốt chặn ở từng nơi gọi.

## Đọc file lớn — cấm đọc trọn

Ước trên **~10.000 token** thì **không** `Read` cả file. Lấy dàn bài (`grep -n '^#'`), rồi
`grep` kèm `-A`/`-B` hoặc `Read` với `offset`/`limit` đúng đoạn cần.
File dữ liệu lớn thì trích bằng `node -e` chứ đừng đọc thô — `conversations.json` 27 MB
(~7 triệu token) trích bằng `node` hết vài nghìn token.

## Trước khi hỏi chủ dự án

Tra ba file kho, rồi tra chính máy (`~/.claude/skills/synced/*/manifest.json`, tài liệu
chính thức, `git log`). **Chỉ hỏi thứ không tra được.** Anh làm trên iPhone, mỗi câu hỏi
thừa là một vòng chờ.

## Quy ước

- Comment tiếng Việt; tên biến, tên hàm tiếng Anh.
- Commit tiếng Việt **không dấu**, mỗi việc một commit: `feat: them he thong walker`.
- Asset CC0 · CC-BY · MIT. **CC-BY-SA cấm.** Không copy từ game thương mại.
- **Dò trước khi làm, ba bước, không được bỏ bước nào:**
  1. `grep -io '[a-z0-9_]*<từ khoá>[a-z0-9_]*' docs/KHO_ASSET.md | sort -u` — có thì dùng ngay.
     **Không ra thì dò tiếp `docs/KHO_CHUNG.md`** (cùng lệnh): kho model dùng chung, nằm
     trong git của `tayvuc`, số model đọc được ghi ở **dòng cuối `KHO_CHUNG.md`**. Trúng thì
     `git clone --depth 1 https://github.com/gc1001vn-svg/tayvuc /home/user/tayvuc`
     rồi `npm run kho:lay <gói>`. Kho đó giữ gói **đã lọc** — hầu hết chỉ có `glTF/`, mẻ
     mới trỏ thẳng vào đó (`"loai": "gltf"` hoặc `"glb"`).
     Kho to bao nhiêu thì **đọc dòng cuối `KHO_ASSET.md`**, đừng nhớ số — số gõ tay vào
     tài liệu đã sai ba lần. Chỉ tin dòng "model dùng được"; "lượt file" phồng ~3 lần
     vì mỗi model xuất ra `fbx/` `gltf/` `obj/`. **Cấm `grep -i` trần**: dòng dài 4.870
     ký tự, trúng một dòng mất ~3.300 token thay vì ~180.
  2. Không có → `grep -i '<từ khoá>' docs/NGUON_MO.md` — nguồn ngoài đã tra sẵn. Có thì tải về.
  3. Vẫn không có → **báo chủ dự án quyết**, ghi một dòng vào `NGUON_MO.md` mục 8.
  **Cấm tự vẽ, tự ghép khi chưa đi hết ba bước.** Tải gói mới xong chạy `npm run kho`.
- Thư viện ngoài: đề xuất tên + license + lý do, **chờ đồng ý**.
- **Trước mỗi commit `npm run do`**. Sửa bằng Edit, đừng `python`/`sed` — tốn token.
- File khoá: `.claude/file_khoa.txt`. `KE_HOACH.md` mục 4 và `NHAT_KY/*` chỉ thêm.
  **Hỏi chủ dự án trước; anh đồng ý rồi thì ghi một dòng đường dẫn vào
  `.claude/da_duyet.txt` là `Edit` qua được** — vé dùng một lần, mọi lần đụng đều vào sổ
  `.claude/nhat_ky_file_khoa.log`. Chưa hỏi thì không được tự ghi vé.
- Mâu thuẫn `GAME_SPEC.md` / `TECH_SPEC.md` → hỏi lại, không tự quyết.
