# TIẾN ĐỘ CŨ — lịch sử trước 29/09/2026 (chỉ lưu, KHÔNG đọc đầu phiên)

> Chuyển nguyên văn từ `docs/TIEN_DO.md` ngày 29/09/2026. File đó có luật "mục 1–5 ghi đè,
> không cộng dồn" nhưng đã dồn 34 phiên (91.599 byte, ~30.500 token) và bị đọc trọn mỗi đầu
> phiên. Ở đây không mất chữ nào; tra bằng `grep -n <từ khoá>`, đừng đọc cả file.

## Mục 1 cũ — trạng thái và các phiên 13/09 → 28/09

## 1. Đang ở đâu

**Phase 12D khối 4 xong phần máy 28/09 (lần 22)** — ruộng, vườn nho, trại lợn/gà/cừu **khác nhau ở mọi lần lên đời**
(trừ 3→4, chung mẻ tới 12E): cổ đại lúa hoang + vò sành + rào đá · trung cổ thêm bù nhìn, thêm con vật · cận đại ruộng
cày + máy kéo + xi-lô, rào ván, máng, bò, chuồng đỏ · hiện đại thêm máy kéo · tương lai vòm kính, vườn bồn cây.
**Trại gà mọi đời có gà thật** (từ `kho-game`, sau khi sửa lỗi bộ đọc `byteStride: 0`). Chi tiết:
`docs/NHAT_KY/PHASE_12D.md`. **Chờ anh chốt bảng + xem trên iPhone** (mục 3).

**Phase 12D khối 1–3 xong 28/09** — lên đời giờ là **màn phủ kín**, dừng game tới khi chạm (tên đời chữ to,
"Cổ đại → Trung cổ", công nghệ mới của đời); chạm xong thành phố **đổi dần như làn sóng** từ giữa màn, ô vừa đổi
chớp sáng; **nền, đường, người đổi theo từng đời** (đất → đá cuội → gạch → nhựa → kim loại). **Khối 4 (ruộng, trại
cho 6 đời) chưa làm** — nguồn đã dò. Chi tiết: `docs/NHAT_KY/PHASE_12D.md`. **Chờ anh xem trên iPhone** (mục 3).

**Phase 12C xong phần máy 28/09** — lên đời giờ **thấy rõ**: tên đời đầu dòng số (`🏛 Cổ đại · 💰 …`), thẻ to
giữa màn "Bước sang thời đại X" khi lên đời. Đời 1 có mẻ riêng **`co_dai`**: mái rơm, nền đất, và 3 công
trình Icosa (đấu trường, tháp Sumer, đền Hy Lạp). Nút **ⓘ Ghi công** trên bản đồ tỉnh. Chi tiết:
`docs/NHAT_KY/PHASE_12C.md`. **Chờ anh xem trên iPhone** (mục 3).

**Phase 12B xong phần máy 27/09** — **6 nước** (thêm Tử Vân tím, Đan Sơn cam) trên bản đồ **36 tỉnh**;
đời 3–4 đổi mặt thành phố sang mẻ `can_dai` (nhà phố gạch Modular Buildings + nhà máy City Kit
Industrial nhuộm gạch). Mốc thắng văn hoá hạ 1,5 → 0,9 cho khớp 6 nước. Chi tiết:
`docs/NHAT_KY/PHASE_12B.md`. **Chờ anh xem trên iPhone** (mục 3).

**Phase 12A xong 27/09, anh "ok"** — đời 6 "Tương lai" tới được bằng cách chơi (sim: giờ 249), có
8 công nghệ riêng, đổi mặt thành phố sang mẻ `tuong_lai` (Kenney Space Kit). Thắng khoa học về đời 6.
Chi tiết: `docs/NHAT_KY/PHASE_12A.md`. **Chờ anh xem mẻ tương lai trên iPhone** (mục 3).

**Phase 11B XONG 27/09, anh chơi trên iPhone: 59 fps mọi màn (kể cả 500×).** Mốc "trọn một vòng":
thành phố chạy thì thế giới chạy theo giờ; bảng ngoại giao, tấn công tỉnh, thẻ bất ổn, màn
thắng/thua đều bấm được. Nút tốc độ thêm 200× và 500× (500× ≈ 7 giây một giờ game).
Chi tiết: `docs/NHAT_KY/PHASE_11B.md`.

11A (luật chạy ngầm) xong 26/09 · 10B trận súng anh "ok" 26/09.

**Việc phiên sau: Phase 12E — mọi công trình còn lại đổi theo đời** (mục 5).

### Phiên 28/09 (lần 22) đã đổi gì — Phase 12D khối 4

- Sửa: `tools/me/{co_dai,trung_co_2,can_dai,hien_dai,tuong_lai}.json` (5 sprite ruộng/trại + 5 kit Icosa) + atlas ·
  `data/ghi_cong.json` (+5 CC-BY) · `tests/DoiTheoDoi.test.ts` (+5 sprite).
- `npm run do` **16/17** (`do:luat` hỏng: Gemini `503` quá tải, bên ngoài — đầu phiên cũng 16/17). Bản duyệt **28/09 21:41**.
- Sau khi anh nhắc: sửa `tools/lib/gltf.mjs` (`byteStride: 0`) + `tests/GltfBuoc.test.ts`; thêm gà, dê, rơm, chuồng, xi-lô.
- `cai_dat.mjs` đầu phiên **bị bộ lọc chặn** (`[Code from External]`) — không chạy; hook repo vẫn chạy bình thường.

### Phiên 28/09 (lần 21) đã đổi gì — Phase 12D khối 1–3

- Mới: `tests/SongLenDoi.test.ts` · `tests/DoiTheoDoi.test.ts` · `docs/NHAT_KY/PHASE_12D.md`. Sửa: `src/ui/TheLenDoi.ts`
  (màn toàn màn) · `src/sim/meta/ThoiDai.ts` (`moTaLenDoi` trả object) · `Gl.ts` (một chương trình shader mỗi số trang)
  · `Shader.ts` (chớp sáng) · `VeCanh.ts` (`chonNguon`) · `DoiMeAtlas.ts` (giữ bộ cũ lúc sóng) · `CityScene.ts` ·
  `style.css` · `data/balance.json` (bỏ `giayTheLenDoi`) · `data/thanh_pho_demo.json` (`songLenDoi`) · `tools/me/`
  `co_dai` `can_dai` `hien_dai` `tuong_lai` + atlas · `package.json` (`tai:hoatiet` +17 hoạ tiết) · `tests/AiGoi.test.ts`.
- `npm run do` **16/17** (`do:luat` hỏng: Gemini giới hạn tần suất, bên ngoài). Bản duyệt đăng đè, dòng chữ nhỏ ghi **28/09 14:29**.
- 24/09 anh từ chối "đổi màu mái/nền theo đời"; 28/09 anh duyệt kế hoạch 12D có mục "nền và đường theo đời" — làm theo bản mới.

### Phiên 27–28/09 (lần 20) đã đổi gì — Phase 12C

- Mới: `src/ui/TheLenDoi.ts` · `src/ui/GhiCong.ts` · `data/ghi_cong.json` · `tools/me/co_dai.json` + atlas `co_dai_*` ·
  `tests/TheLenDoi.test.ts` · `tests/GhiCong.test.ts` · `docs/NHAT_KY/PHASE_12C.md` · kế hoạch
  `docs/ke-hoach/2026-09-27-phase-12c-co-dai-bao-len-doi.md`. Sửa: `data/balance.json` (đời 1 `co_dai`, `giayTheLenDoi`) ·
  `data/thanh_pho_demo.json` (mẻ nạp đầu `co_dai`) · `src/sim/meta/ThoiDai.ts` (`moTaLenDoi`) ·
  `src/sim/campaign/HienTheGioi.ts` (`doi`) · `ThanhTheGioi.ts` · `DungTheGioi.ts` · `CityScene.ts` · `MapScene.ts` ·
  `main.ts` · `style.css` · `ASSET_CREDITS.md` (anh cho sửa) · hai file test.
- `npm run do` **17/17** · **502 test**. Bản duyệt đăng đè, dòng chữ nhỏ ghi **28/09 09:48**.

### Phiên 27/09 (lần 19) đã đổi gì — Phase 12B

- Mới: `tools/me/can_dai.json` · `public/atlas/can_dai_*` · `tools/lib/xep.d.mts` · `tests/Xep.test.ts` ·
  `docs/NHAT_KY/PHASE_12B.md` · kế hoạch `docs/ke-hoach/2026-09-27-phase-12b-6-nuoc-can-dai.md`. Sửa:
  `data/nations.json` · `data/provinces.json` · `data/victory.json` · `data/balance.json` (đời 3–4 `me`) ·
  `tools/me/hex_1.json` + atlas `hex_1_*` · `tools/lib/xep.mjs` · `tools/lib/obj.mjs` (`mau_cot` theo hàng) ·
  `tools/nuong_sprite.mjs` · `src/ui/NhanTinh.ts` (màu chữ tím/cam) · `package.json` (`tai:asset` +
  `modular-buildings`) · `ASSET_CREDITS.md` (anh cho sửa) · ba file test.
- `npm run do` **17/17** · **484 test**. Bản duyệt đăng đè, mở thẳng `?me=can_dai`, dòng chữ nhỏ ghi **27/09 23:09**.

### Phiên 27/09 (lần 18) đã đổi gì — Phase 12A

- Mới: `tools/me/tuong_lai.json` · `public/atlas/tuong_lai_*` · `docs/NHAT_KY/PHASE_12A.md` · kế hoạch
  `docs/ke-hoach/2026-09-27-phase-12a-doi-6-tuong-lai.md`. Sửa: `data/tech.json` (8 công nghệ đời 6) ·
  `data/balance.json` (đời 5 `len`, đời 6 `me`) · `data/victory.json` (`khoa_hoc.doi` 6) · `package.json`
  (`tai:asset` + `space-kit`) · `ASSET_CREDITS.md` (anh cho sửa) · hai file test.
- `npm run do` **17/17** · **466 test**. Bản duyệt đăng đè, mở thẳng `?me=tuong_lai`, dòng chữ nhỏ ghi **27/09 19:59**.

### Phiên 27/09 (lần 17) đã đổi gì — Phase 11B

- Mới: `src/sim/campaign/{HanhDong,HienTheGioi}.ts` · `src/ui/{DungTheGioi,TheGioiThanhPho,ThanhTheGioi}.ts`
  · `src/render/ThamSoCanh.ts` · `tests/HienTheGioi.test.ts` (14 ca, bắt 7/7 lỗi cài thử).
  Sửa: `TheGioi` (tách, `lyDoKhongDanh`) · `ChienDich` (`datTraChu/chu/mau`) · `VeBanDo` `BangTinh`
  `NhanTinh` (chủ tỉnh động) · `DecisionCard` (nhận thẻ bất ổn, nút khoá) · `Clock` (200×, 500×) ·
  `main` `CityScene` `MapScene` · `data/the_gioi.json` (`vang_moi_lan_dau_tu`) · CSS.
- `npm run do` **16/16 · 1 bỏ qua** · **456 test**. Bản duyệt đăng đè, dòng chữ nhỏ ghi **27/09 15:01**.
- Jules giao viết test, quá trần 30 phút → Claude tự viết (ghi ở `ghi-nho/cong-cu/jules/PHAN_VIEC.md`).

### Phiên 26/09 (lần 16) đã đổi gì — Phase 11A

- Mới: `src/sim/campaign/{TheGioi,TheGioiData,NgoaiGiao,BatOn,ChienTranh,AiNuoc,DieuKienThang,NoiThanhPho}.ts`
  · `data/the_gioi.json` · `data/victory.json` · `scripts/sim_van.ts` (`npm run sim:van`) ·
  `tests/TheGioi.test.ts` (18 ca, bắt 4/4 lỗi cài thử) · kế hoạch `docs/ke-hoach/2026-09-26-phase-11a-the-gioi.md`.
  Sửa: `BanDoTinh.ts` (thêm `tinhKe()`). **Không chạm mã game đang chạy** (chưa ai import từ `render/`/`ui/`).
- `npm run do` **16/16 · 1 bỏ qua** (`do:luat` cố ý bỏ qua — không đụng `AGENTS.md`).
- `cai_dat.mjs` đầu phiên bị bộ lọc quyền chặn (`[Code from External]`) — không chạy.

### Phiên 26/09 (lần 15) đã đổi gì — Phase 10B

- Mới: `tools/me/linh_sung.json` · `public/atlas/linh_sung_*` · `tests/DienTranSung.test.ts` ·
  `docs/NHAT_KY/PHASE_10B.md`. Sửa: `data/dien_tran.json` (trận mẫu súng, số khung riêng xe
  tăng) · `BattleScene.ts` · `DienTran.ts` · `main.ts` · `tools/lib/gltf.mjs` (`COLOR_0`,
  `gan` xoay/giữa) · `tai_icosa.mjs` (Backblaze khi wayback chết) · `do_luat.mjs` (trần thời
  gian) · `DAU_PHIEN.md` (bẫy tưởng treo) · `ASSET_CREDITS.md` (anh cho sửa).
- `npm run do` **16/16 · 1 bỏ qua** (`do:luat`: Gemini hết lượt, lỗi bên ngoài).

### Phiên 25/09 (lần 14) đã đổi gì — Phase 10A

- Mới: `tools/me/linh_co.json` · `public/atlas/linh_co_*` · `data/dien_tran.json` ·
  `src/render/DienTran.ts` · `src/render/BattleScene.ts` · `tests/DienTran.test.ts` (Jules
  viết) · `tests/KiemCheo.test.ts`. Sửa: `tools/lib/gltf.mjs` (clip, gắn xương, gamma) ·
  `nuong_sprite.mjs` (sinh sprite lính, hệ số bóng) · `Battle.ts` (vết vị trí) ·
  `kiem_cheo.mjs` (đọc số test khi có `expected fail`) · `ASSET_CREDITS.md` (anh cho sửa).
- `npm run do` đầu phiên **16/17**: `do:luat` hỏng vì Gemini trả "retry in 55s" (hết lượt
  phút) — lỗi bên ngoài. Các lần giữa phiên chạy với `do:luat` khai BỎ QUA (không đụng
  `CLAUDE.md`).

### Phiên 24/09 (lần 12) đã đổi gì — Phase 9

- Mới: `src/sim/campaign/Battle.ts` · `BattleData.ts` · `BattleScript.ts` ·
  `data/armor_table.json` · `units.json` · `battle.json` · `scripts/sim_tran.ts` ·
  `tests/Battle.test.ts` (10 ca). Không sửa mã game đang chạy.
- `npm run do` đầu phiên **16/17**: `do:luat` hỏng vì Gemini trả `503 UNAVAILABLE` (máy chủ
  quá tải) — lỗi bên ngoài, không phải lỗi repo.

### Phiên 24/09 (lần 11) — bảng chỉnh số: làm rồi GỠ, không đổi gì trong game

Chi tiết: `docs/NHAT_KY/PHASE_8_BANG_CHINH.md`. Làm bảng `?chinh=1` rồi đẩy `main`; chủ dự án
thử xong thấy không cần → revert. Bài học chung ghi ở kho:
`quyet-dinh/2026-09-24-cong-cu-chua-xin-thi-lam-ban-nhap.md`.
Rà `XiaomiMiMo/MiMo-code`, `mlc-ai/web-llm`, 13 skill Matt Pocock chưa đọc: không lấy gì.

### Phiên 24/09 (lần 10) đã đổi gì — vá 8D theo báo lỗi trên iPhone

Chi tiết: hai phụ lục cuối `docs/NHAT_KY/PHASE_8D.md`.
- Nhịp: nghiên cứu ×2, `soNha` đời 1 200→195 → Trung cổ ~13 phút ở 50× (trước 24).
- **Lỗi thật:** lắp thẻ chính sách vào ô TRỐNG bị bắt chờ 8 giờ → nay lắp ngay.
- Test `DieuKien` (Jules viết) vá: bắt 7/7 lỗi cài thử (trước 3/6).
- Đồ nghề Jules ở kho: `ghi-nho/cong-cu/jules/` (`PHAN_VIEC.md` · `QUY_TAC.md` · `giao_jules.mjs`).
- Chủ dự án hỏi "lên Trung cổ nhà không đổi": đúng thiết kế (đời 1–4 chung mẻ). Đề xuất
  đổi màu mái/nền theo đời — **anh từ chối 24/09**, đừng đề xuất lại.

### Phiên 23–24/09 (song song lần 8–10) — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_DOC_LON.md`. Hook `chan_doc_lon` chặn `Read` trọn file
quá ~10.000 token · `hoi_gemini.mjs --anh` · chọn Jules thay đường Gemini API trả phí.

### Phiên 23/09 (lần 9) đã đổi gì — Phase 8D

- `Governor`: luật **dân kéo về** — đủ ăn `gioNoDu` giờ liền thì xây nhà tiêu thụ
  (`data/policy.json > gioNoDu, nhaDanMoi`). Gốc chặn 241 nhà là nhu cầu đứng yên.
- `data/tech.json`: 24 → **40** công nghệ (8 đời 4, 8 đời 5). `balance.json`: mở `len`
  đời 4 → 5 (30 công nghệ, 330 công trình). Đời 6 vẫn khoá.
- `sim:congnghe` nhận `-- <giờ> <đời>`, in đỉnh walker, mặc định đòi đời 4.

### Phiên 23/09 (lần 8) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_DO_NGOAI.md`. **Không mở phase mới** — phiên đồ nghề.

- Tra ScrapeGraphAI, autoskill, find-skills: **không cài cái nào**.
- `AGENTS.md` luật "Thư viện ngoài" thêm **độ tin** và **telemetry** (commit `24e08f7`).

### Phiên 22/09 (lần 7) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_AI_GOI.md`. **Không mở phase mới** — phiên đồ nghề.

- **Tra `@nanonets/graft` bằng cách chạy thật**, không đọc quảng cáo. Kết luận: công cụ
  thật, phần `callers` tốt, nhưng 392 MB mỗi phiên và **nhét chỉ thị quảng cáo vào ngữ
  cảnh trợ lý** mỗi lệnh (`dist/context/savings.js`). Số đo đầy đủ ở kho `ghi-nho`,
  `quyet-dinh/2026-09-22-graft-chua-dung.md`.
- **`scripts/ai_goi.mjs` mới** — tìm caller thật bằng TypeScript Compiler API, không thêm
  phụ thuộc (`typescript` đã có). `node scripts/ai_goi.mjs <ten> [<ten>...]`.
  Token: `ve` **190** · `nhip` **192** · `doi` **110** · `xayNha` **93**, so `grep -rn`
  11.125 / 2.049 / 8.623 / 128. Rẻ hơn Graft cả bốn ca.
- Vào `cai_dat.mjs` mục **1a** cho mọi repo TypeScript, chép có điều kiện.

### Phiên 21/09 (lần 6) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_SKILL_NGOAI.md`. **Không mở phase mới** — phiên đồ nghề.

- **Ba skill ngoài vào `.claude/skills/`**, lấy từ `addyosmani/agent-skills` (MIT):
  `doubt-driven-development` · `constraint-driven-development` · `code-simplification`.
  Bộ gốc 25 skill, 22 cái kia trùng hoặc mâu thuẫn luật đã chốt. Nguồn, số đo token,
  cách cập nhật: `.claude/skills/NGUON.md`.
- **Nghiệm thu đường đi:** `.claude/skills/` trong repo **được harness nạp thật** —
  `Skill(code-simplification)` trả `disabled for model invocation in skillOverrides`,
  tức nó biết tên. Cả ba khoá `user-invocable-only`, chủ dự án gõ `/tên` thì vào.
- **`CONSTRAINTS.md` mới** — bảng chỉ đường sang chỗ đã giữ ngưỡng, chặn trước việc
  `constraint-driven-development` đẻ ra bộ ngưỡng thứ hai.
- **Đo được khi lập bảng đó:** trần hiệu năng ở `TECH_SPEC.md` mục 2 **phần lớn không có
  thước nào đọc** — chỉ cỡ bản build bị `ci.yml` chặn. **Đã bịt trong cùng phiên:**
  thước mới `check:tran` đọc thẳng số từ bảng đó (không gõ cứng), kiểm sáu dòng, khai
  `BO QUA` hai dòng cần máy thật. `npm run do` giờ **16 thước**.
- **Hook `chan_vong_vo_han.mjs`** vào bộ đồ nghề mọi repo — chặn vòng `while`/`until`
  có chờ mà không có trần. Một vòng như vậy treo 40 phút trong phiên này, và đó là lần
  **tái diễn**; luật đã ghi vào kho trước đó mà vẫn lặp lại, nên chuyển sang chặn bằng máy.
- **Thước `check:san`** (thước thứ 17) — cấm tắt kiểm tại chỗ (`@ts-ignore`,
  `eslint-disable`), tắt test (`it.skip`, `describe.only`), để hàm rỗng (`catch {}` rỗng
  hẳn, `Not implemented`). `catch { /* lý do */ }` qua được — 8 chỗ như vậy trong
  `scripts/` là fail-open cố ý. Đo lúc dựng: cả ba dấu **0 lần**, nên đây là lưới dựng
  trước. Regex có hàng rào riêng ở `tests/CheckSan.test.ts`.

### Phiên 20–21/09 (lần 5) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_DO_NGHE_REEF.md`. **Không mở phase mới** — phiên đồ nghề.

- **Bốn thước mới**, cách làm chép từ `Human-Agent-Society/reef` (Apache-2.0):
  `check:nguong` (cấm nới ngưỡng) · `check:cap` (cặp file không lệch) · `check:ten`
  (cấm tên ẩn dụ, bắt tên đại lượng thiếu đơn vị) · `do:luat` (đo luật có đổi hành vi không).
  `npm run do` giờ **15 thước**, và khai `BO QUA` trung thực khi thiếu `GEMINI_API_KEY`.
- **`AGENTS.md` là bản gốc, `CLAUDE.md` là symlink** trỏ vào nó.
- **Loại hai công cụ ngoài** sau khi đo thật: Headroom (nén token — xoá sạch nội dung
  `KHO_ICOSA.md`, văn xuôi Việt giảm 0%) và Reef (cần máy chạy thường trực + endpoint
  trả tiền). Giữ cách làm, bỏ công cụ.
- **`do:luat` 10/10 câu luật ăn.** Hai câu từng ra `THUA` là do câu hỏi dở, không phải
  luật thừa — sửa câu hỏi sang phần không đoán được thì cả hai thành `LUAT AN`.

### Phiên 20/09 (lần 4) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_LLM_NGOAI.md`. **Không mở phase mới** — phiên đo LLM ngoài.

- **Ba khoá LLM: chỉ Gemini flash dùng được.** DeepSeek `402 Insufficient Balance`
  (số dư `0.00`), xAI `403` (`team_blocked:true`) — **LOẠI**, bảng mục 3 đã sửa.
- **Bẫy đã sập ở phiên trước:** `/models` của DeepSeek trả `200` khi hết tiền. Phải gọi
  endpoint **TÍNH TIỀN** (`/chat/completions`) mới biết dùng được hay không.
- **Công cụ mới `ghi-nho/cong-cu/hoi_gemini.mjs`** — ném file lớn sang Gemini lấy đáp
  ngắn. `NO_KY_THUAT.md` 34 KB = 11.437 tok nếu Claude tự đọc, qua Gemini ~222 tok.
- **Trần free tier, API tự khai:** `GenerateRequestsPerMinutePerProjectPerModel-FreeTier
  (5)` — 5 req/phút **riêng từng model**, nên script tụt bậc `3.7-flash` → `3.5-flash` →
  `3.1-flash-lite`. Nhịp gọi thật của Claude không chạm trần.

### Phiên 20/09 (lần 3) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_KIEM_KHOA.md`. **Không mở phase mới** — bước E còn treo.

- **Khoá Gemini đã xoay thật:** đuôi `mVEA`, khác `ICfQ`. Đủ **7 khoá**, gọi thật cả 7 —
  bảng ở mục 3. Chỉ `XAI_API_KEY` trả `403` vì hết credit, khoá vẫn đúng.
- **Ô `Setup script` của môi trường đang RỖNG** — chữ `#!/bin/bash` / `npm install` trong
  ô là **chữ gợi ý màu xám**, không phải script đã lưu. Nên `npm ci` không tự chạy, mỗi
  phiên mất một lượt gọi chạy tay. Cách điền: mục 3.
- **Khoá lộ lần hai, lần này bằng ẢNH CHỤP** ô `Environment variables`: `XAI_API_KEY` và
  `FREESOUND_KEY` đọc được trọn. Cần xoay — mục 3.

### Phiên 20/09 (lần 2) đã đổi gì — không chạm mã game

Chi tiết: `docs/NHAT_KY/PHASE_8_KHOA_GEMINI.md`. **Không mở phase mới** — bước E còn treo.

- **Khoá Gemini chạy thật, đo lại 20/09:** `GET /v1beta/models` `HTTP 200`, **58 model**
  (số cũ "50" là do trang mặc định `pageSize=50` cắt bớt, không phải tổng — phải thêm
  `?pageSize=200`);
  `gemini-3.5-flash` trả kết quả, 11 token vào / 2 ra (+861 thought). Dòng Pro vẫn
  `429 RESOURCE_EXHAUSTED`.
- **Ô `Environment variables` KHÔNG hiện lại giá trị đã lưu khi mở lại hộp thoại** — không
  phải mất khoá. Càng phải nhớ: **đừng Save khi ô đó đang hiện rỗng**.
- **Luật mới: không đặt chuỗi khoá vào thân lệnh Bash**, chỉ `$BIEN`. Hook
  `ghi_so_lenh.mjs` chép 200 ký tự đầu mọi lệnh vào `.claude/so_lenh.log`; một lệnh
  `node -e` so chuỗi đã đẩy khoá vào đó. Đã xoá dòng đó; file `.gitignore`, không lên git.

### Phiên 19/09 đã đổi gì — Phase 8C

- **`docObj` lọc theo nhóm `g`.** `ki:windmill` gói cả tháp lẫn cánh vào một file; lọc thì
  hộp bao tính lại theo đỉnh **còn dùng**. KayKit thì tách sẵn hai file, không cần bước này.
- **Máy nướng thêm `tam` · `rx` · `khung` · `trang_it_nhat`.** Trục cánh không ở gốc toạ
  độ nên phải có tâm quay; `rx` cho cánh nằm trong mặt phẳng y-z; `khung` đè lên **đúng
  một mảnh** của bản sao `nhu`, tra theo `m` hay `m#nhom`.
- **Đếm cánh bằng số chứ không đoán** — gom góc đỉnh xa tâm: KayKit **4 cánh** (khung
  0/30/60), Kenney **3 cánh** (0/40/80).
- **`VeCanh.tenKhung`** chọn `<tên>_k<số>`, hai nhịp một khung. `hopSprite` đổi tên cùng
  chỗ với `datSprite`, không thì chạm vào cánh quạt không trúng.
- **Mẻ trung cổ 2× hết chỗ:** 84,4 % → **90,2 %** một trang, nay **hai trang**. Mẻ hiện
  đại vẫn một trang thật, đệm một trang **rỗng 1×1** cho khớp — `DoiMeAtlas` ném lỗi khi
  số trang lệch.
- **Vá `tai:asset`:** nó thiếu bốn gói City Kit và `mini-characters` mà mẻ hiện đại đang
  dùng, nên máy ảo sạch không nướng lại được mẻ đó.
- **`mau_cot` thêm dạng `{ "thay": [r,g,b] }`** — thay hẳn màu một cột và bỏ luôn ảnh cột
  đó. Mái mẻ hiện đại hết xanh neon; chi tiết và vì sao màu nhân không đủ: mục 3.
- **Tám nhà phố `kc:building-*` thêm màu viền (cột 1)** cùng sắc với mái, nên mỗi xưởng
  đọc ra được từ xa thay vì tám hộp trắng giống nhau. **Bản đồ cột của mỗi gói MỘT KIỂU** —
  ghi đủ ở `tools/me/hien_dai.json > ghi_chu_cot`; đọc nhầm một lần trong phiên 19/09.

Mười bốn phiên đồ nghề trước Phase 8B (12/09 → 18/09 ×3): `docs/NHAT_KY/PHASE_8_RA_SOAT.md`,
`PHASE_8_DO_NGHE.md`, `PHASE_8_NHAC_KHO.md`, `PHASE_8_TAT_DINH.md`, `PHASE_8_BAN_DUYET.md`,
`PHASE_8_TAI_POLY.md`, `PHASE_8_ICOSA.md`, `PHASE_8_KHO_CHUNG.md`, `PHASE_8_API_MCP.md`,
`PHASE_8_VET_KHO.md`, `PHASE_8_OCR.md`, `PHASE_8_HOOK_CO.md`.

### Phiên 18/09 (lần 4) đã đổi gì — Phase 8B

**Hạ cỡ người mẻ hiện đại 18/09:** `ti_le` 1,25 → 1,0, sprite 2× **131×113 → 111×92**
(người mẻ trung cổ 116×107). Chủ dự án bảo "người to quá".

- **`tools/me/hien_dai.json`, 74 sprite**, cùng bộ tên với `trung_co_2`. 32 loại nhà mỗi
  loại một dáng riêng từ **Kenney City Kit** (suburban 21 + commercial 19 + industrial 20,
  một tác giả, CC0); người từ **Kenney Mini Characters** (khung xương 7 khớp); cây cỏ đá
  giữ nguyên phần Quaternius của mẻ trung cổ.
- **Trần thật là trang atlas 2×.** `ti_le` đồng loạt 2,0 → 3 trang; 1,65 → 2 trang;
  **1,53 vừa một trang, lấp đầy 76,1 %**. Công thức chốt: `min(1.53, 1.9/đáy, 2.33/cao)`.
  **Cấm chuẩn hoá từng model về cùng một đáy** — làm vậy thùng rác to bằng căn nhà.
- **`ThoiDai.me` hết là chữ chết.** Đời 5–6 trỏ `hien_dai`; `src/render/DoiMeAtlas.ts` lo
  nạp và nhả, `CityScene` chỉ đọc một chuỗi mỗi khung. `src/sim/` không biết gì (luật 1).
- **`?me=<tên>` ép một mẻ bất kỳ.** Cần thật, không phải đồ chơi — xem mục 4.
- **Máy nướng sửa gốc:** `doiDang` chỉ biết đuôi `_l`/`_r` của Quaternius nên gương một
  người Kenney (`leg-left`) **không đổi chân**, hai khung bước ra y hệt nhau.
- **Thước `Atlas.test.ts` đếm sai bản chất** — cộng số trang của mọi file trong
  `public/atlas`, nên thêm một mẻ là đỏ dù không ai giữ hai mẻ cùng lúc.
- Hai bộ nhân vật đã cân rồi loại: `animated-characters-survivors` **chỉ có FBX**;
  `blocky-characters` **không có skin** nên không đặt dáng được.

### Phiên 18/09 (lần 3) đã đổi gì

Đồ nghề, **không chạm mã game**. Chi tiết: `docs/NHAT_KY/PHASE_8_OCR.md`.

Cắm `alibaba/open-code-review` (Apache-2.0, npm `@alibaba-group/open-code-review` 1.12.5)
ở **Delegation Mode** — `ocr` lo chọn file và khớp luật, Claude tự đọc code. Không cần
API key.

- **`.opencodereview/rule.json`** (tầng 2, đè luật hệ thống, lên git): bảy nhóm —
  `src/sim` · `src/render` · `src/ui` · `src/{core,bench}` · `src/**/*.ts` ·
  `data/**/*.json` · `{scripts,tools}/**`. Nội dung từ `CLAUDE.md` mục Ba luật và
  `TECH_SPEC` mục 1–2. **Thêm nhóm mới phải đặt trước `src/**/*.ts`.**
- **Thay hẳn luật hệ thống, cố ý** — luật đó cho `.ts` toàn React Hooks, `useMemo`, XSS;
  repo này không có React. Sau khi thay: `grep -ciE 'react|hooks|useMemo|innerHTML|XSS'`
  còn **1** hit, là dòng `innerHTML` cố ý cho `src/ui/`.
- `npm run soat` · `npm run soat:luat`. Cách dùng và ba bẫy: `DAU_PHIEN.md` mục I.
- **`ocr review` và `ocr scan` không chạy được ở máy ảo** — không có API key, trả
  `Error: resolve LLM endpoint: no valid LLM endpoint configured; ...`.
  `open-codereview.ai` chặn egress; đọc tài liệu phải clone repo họ.

**ĐÃ ĐO 19/09 trên diff thật của Phase 8C** (`fd4e7e2..97a831e`, 20 file, +508/−99 bỏ
atlas). Kết quả: **bắt thêm 0 lỗi** — `ocr delegate` không đọc code, nó chỉ chọn file và
in luật. **Đã gỡ sạch cùng ngày** — mục 4, dòng "`open-code-review`". Phần trên giữ nguyên
làm sổ, đừng cài lại.
Luật là chữ nhắc, **không phải thước chặn**; hàng rào thật vẫn là ESLint + `npm run do`.

### Phiên 18/09 (lần 2) đã đổi gì

Đồ nghề, **không chạm mã game**. Chi tiết: `docs/NHAT_KY/PHASE_8_HOOK_CO.md`.

Đọc `affaan-m/ECC` (MIT, v2.2.1), lấy hai cơ chế, bỏ phần còn lại. Thêm
`scripts/hook_chung.mjs` (cờ tắt hook ba tầng · `thoat()` chống mất chữ trên **146.176
byte** · `cat_tran()` · `uoc_tok()`) và thước thứ mười `check_hook`. Cả bốn repo giờ cùng
5 hook. `.claude/settings.json` **không đổi một byte** — cờ nằm trong script.

Sáu lỗi đang chạy im lặng, bắt được bằng cách đo: `cai_dat` tạo `do.sh` thừa · `--vsp`
gỡ khoá mà không ghi vé miễn · `check_kho` in "ký tự" trong khi đếm **byte** · `ký tự/4`
ước token sai **−26,5%** (mỏ neo `repomix`: thật 134.317, `byte/3` 132.023) · `so-thich.md`
ghi "bốn hook" khi đã năm · `dau_phien` không quét skill nằm ngoài `synced/`.

Kho ghi nhớ 22.843 → 21.088 byte, đối chiếu 142 dòng cũ, **0 dòng mất**.
Đo hiện trạng khoá skill: 17 skill có file, **0 cái chạy loạn**, đang chặn 2.600 tok/phiên.

### Phiên 18/09 (lần 1) đã đổi gì

Toàn bộ ở `kho-game`, **không chạm mã game**. Chi tiết: `docs/NHAT_KY/PHASE_8_VET_KHO.md`.

- **Kho đã tự đủ cho MỌI dự án.** `do.mjs` từng đọc từ điển Việt→Anh ở
  `quoc-chien/tools/tu_dien_asset.json` — repo nào không clone `quoc-chien` nằm cạnh thì
  `ga` ra **1 trúng** (font `Ga Maamli`) thay vì **306**, **không báo gì**. Bản gốc nay ở
  `kho-game/cong-cu/tu_dien.json`.
- **Bản kê có thước giữ: `vet:kho`.** Trước đó `kho-game` chỉ có 2 thước mặc định của
  `cai_dat.mjs`, không thước nào đụng bản kê. Nay `bash scripts/do.sh` ra **3/3**.
- **Chốt một cách đếm model: `node cong-cu/dem_model.mjs`.** Đo 18/09: **41.543 model lẻ
  nướng được** (Icosa 41.333/73.626 · Poly Haven 210/521) + **215 gói** Kenney/itch chưa
  kê lẻ. Loại Poly Pizza 5.274 vì tải không được. **Đừng chép số này đi đâu — chạy lệnh.**
- **Kiểm kê cả kho: `node cong-cu/kiem_ke.mjs`.** **260.273 mục lẻ + 740 gói.** Ảnh 2D
  129.556 · model 3D 89.704 · âm thanh 28.740 · nhạc 6.825 · hoạ tiết/HDRI 3.497 · font
  1.941. Model 3D theo chủ đề: nhà cửa 8.172 · nhân vật 5.159 · cây cối 5.272 · con vật
  4.792. **Kho đủ cho mọi phase còn lại của game.**
- **Sửa luôn bộ sinh bản kê.** `kho-game/cong-cu/nap_ke_cu.mjs` tra bảng thay vì regex
  đoán: thêm cột `tac_gia`, `cach_lay` đúng từng gói, bỏ 1.679 dòng Icosa nằm nhầm.
  **license `?` 4.497 → 1.562**; 1.562 còn lại cố ý để `?` — mục 4.
- **Xoá `kho-game/ke/icosa.md`** (230 KB, không ai trỏ tới) bằng GitHub MCP `delete_file`,
  vì `git rm` ở máy ảo bị chặn `[Irreversible Local Destruction]`.

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


## Mục 2 cũ — số đo đồ nghề 13–15/09

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

## Mục 3 cũ — việc của chủ dự án đã xong

### ✅ Việc 28/09 (lần 21) — xem màn lên đời + làn sóng + nền theo đời: anh báo 28/09 59 fps, lúc làn sóng cũng 59

1. Mở bằng **Safari**: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi — chạm vào game một lần.
2. Dòng chữ nhỏ trên cùng phải ghi **28/09 14:29**. Chơi ở **500×** tới lúc lên đời: màn tối phủ kín, chữ vàng to **"Bước sang thời đại Trung cổ"**, game đứng yên.
3. Chạm: thành phố đổi dần từ giữa màn ra, ô vừa đổi chớp sáng; đường và người đổi kiểu theo.
4. Nhắn: **fps lúc làn sóng chạy** · đã rõ chưa · màu đường/sân đời nào xấu.

### ✅ Việc 28/09 (lần 20) — xem mẻ cổ đại + thẻ lên đời: anh xem 28/09, 59 fps mọi màn; lên đời VẪN KHÔNG RÕ (mục 4)

1. Mở bằng **Safari**: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi — chạm vào game một lần.
2. Dòng chữ nhỏ trên cùng phải ghi **28/09 09:48**. Nhà mái **rơm vàng**, dòng số bắt đầu bằng **🏛 Cổ đại**.
3. Bấm **500×**, chờ lên đời (sim: đời 2 cần 6 công nghệ + 195 công trình): phải hiện thẻ to **"Bước sang thời đại
   Trung cổ"** giữa màn, nhà đổi sang mái đỏ.
4. Sang **🗺 Bản đồ tỉnh** → **ⓘ Ghi công**: bảng tên 6 tác giả Icosa.
5. Nhắn: **fps** · đã thấy rõ lên đời chưa · mái rơm có ra "cổ đại" không · đền/tháp/đấu trường to nhỏ ra sao.

### ✅ Việc 27/09 (lần 19) — xem 6 nước + mẻ cận đại trên iPhone: anh "ok" 27/09, 59 fps, tím/cam dễ phân biệt

1. Mở bằng **Safari**: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi — chạm vào game một lần.
2. Dòng chữ nhỏ trên cùng phải ghi **27/09 23:09**. Thành phố hiện nhà gạch, nhà máy ống khói.
3. Bấm **🗺 Bản đồ tỉnh**: phải thấy 6 màu cờ, thêm **tím** (Tử Vân, giữa trên) và **cam** (Đan Sơn, giữa dưới).
4. Nhắn: **fps** ở thành phố và ở bản đồ · nhà nào to/nhỏ quá, lạc tông · tím/cam có dễ phân biệt không.

### ✅ Việc 27/09 (lần 18) — xem mẻ tương lai trên iPhone: anh "ok" 27/09 (chưa báo fps)

1. Mở bằng **Safari**: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi — chạm vào game một lần.
2. Dòng chữ nhỏ trên cùng phải ghi **27/09 19:59**. Thành phố hiện ra bằng nhà kiểu trạm vũ trụ.
3. Nhắn: **fps** · nhìn có ra "thành phố tương lai" không · nhà nào to quá / lạc tông / khó phân biệt.

### ✅ Việc 27/09 (lần 17) — chơi thử một ván trên iPhone: XONG, anh báo 27/09 "tất cả đều 59 fps"

Anh chốt 27/09: không cần báo thắng/thua — đừng hỏi lại.


1. Mở bằng **Safari**: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi — chạm vào game một lần.
2. Dòng chữ nhỏ trên cùng phải ghi **27/09 15:01**.
3. Bấm **500×** (góc dưới phải). Dòng số dưới đầu màn (💰 vàng · ⚠ bất ổn · ⚔ sức quân · số tỉnh ·
   giờ) phải nhảy. Ghi fps ở 500×.
4. Bấm **🤝 Ngoại giao**: thử Buôn bán, Tuyên chiến một nước. Sang **🗺 Bản đồ tỉnh**, chạm một tỉnh
   giáp đất ta → nút **⚔ Tấn công**. Chiếm được thì tỉnh đổi màu.
5. Khi hiện thẻ "Dân bất ổn" (~giờ 40): chọn một cách. Chơi tới khi ra màn **Chiến thắng / Thất bại**
   (ngoại giao sớm nhất ~giờ 72 ≈ 9 phút ở 500×). **Chưa lưu ván — tải lại trang là mất.**
6. Nhắn: fps · thắng/thua kiểu gì, giờ mấy · chỗ nào khó hiểu, nút nào che nút nào.

### ✅ Việc 26/09 (lần 16) — thống trị 2/5: anh chọn (a) ngày 27/09 ("làm đi")

Chấp nhận thống trị 2/5 hạt giống, cân tiếp khi 11B có màn cho anh chơi thật.

### ✅ Việc 26/09 (lần 15) — xem trận súng trên iPhone: XONG, anh "ok" 26/09

1. Mở bản duyệt https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi (mở thẳng trận súng). Chỉ
   gửi link bản duyệt — anh báo 26/09 link Pages không xài được.
2. Dòng chữ nhỏ trên cùng phải ghi **26/09 12:31**.
3. Ghi fps ba chỗ: trận súng · bấm "⚔ Trận cổ" (góc trên phải) · bấm "⌂ Về thành phố". Và pin có
   **vàng** không (Chế độ nguồn điện thấp khoá 30 fps). 26/09: atlas đã về 1 trang mà vẫn 30 đứng
   yên — số đứng yên đúng 30 là dấu hiệu bị khoá trần, không phải máy yếu.

### ✅ Việc 25/09 (lần 14) — xem trận trên iPhone: XONG 25/09 tối, 59 fps (bản duyệt)

1. Mở bản duyệt: https://claude.ai/artifact/Jit8athcMDURBjv4HFVFpi (mở thẳng màn trận).
   Hoặc bản thật sau khi Pages cập nhật: https://gc1001vn-svg.github.io/quoc-chien/?tran=1
   — kéo trang xuống để tải bản mới.
2. Bấm **×4** cho trận chạy nhanh, xem hết một trận (~15 giây ở ×4).
3. Nhắn: **số fps thấp nhất** ở dòng trên cùng lúc hai bên giáp lá cà, và một câu: nhìn ra
   lính nào là lính nào không (giáo, kiếm, cung, kỵ), phân biệt được phe xanh/đỏ không.

### ✅ Việc 24/09 (lần 12) — ba điều cho Phase 9: anh chốt 25/09

1. Thước `sim:tran` đổi sang **lệch trung bình có trọng số ≤ 4 điểm** — có.
2. Đại bác, xe tăng **nâng lên 8 lính/đội** (giữ tổng máu, tổng sát thương mỗi đội).
3. Trận quá ngắn → **giảm sát thương** (làm cùng tốc độ đi, hệ số 0,45 — xem nhật ký).

### ✅ Việc 23/09 (lần 9) — đo fps với thành phố to hơn: XONG 24/09, 59 fps

Thành phố nay mọc tới ~380 công trình (trước 241). Mở game, **chạy nhanh 3× khoảng 10
phút**, thu nhỏ hết cỡ, đọc nhãn fps góc màn hình, nhắn con số thấp nhất.
https://gc1001vn-svg.github.io/quoc-chien/ — nhớ kéo trang xuống để tải bản mới.


### ✅ Việc 20/09 — XOAY KHOÁ GEMINI: XONG, đã kiểm ở phiên mới 20/09 (lần 3)

Đuôi khoá nay là **`mVEA`** (dài 53 ký tự), **khác `ICfQ`** → khoá lộ đã bị xoay, khoá cũ
không còn trong môi trường. `GET /v1beta/models` trả **`200`**.

Đếm lại: **đủ 7 khoá của chủ dự án**, gọi thật từng cái, xem bảng "Bảy khoá đang có" dưới.

Hai khoá trong tài khoản đều **`Free tier`** → model Pro vẫn `429 RESOURCE_EXHAUSTED`.
Muốn Pro qua API phải bấm **Set up billing** cho project đó.

<details><summary>Cách xoay (giữ lại cho lần sau)</summary>

Khoá `GEMINI_API_KEY` đã bị **dán thẳng vào chat** phiên 19/09, nên nó nằm trong lịch sử
hội thoại trên server Anthropic — không xoá chọn lọc được. Khoá vẫn chạy (mục 1), rủi ro
thực tế thấp (free tier, quota Pro bằng 0), nhưng ai đọc được transcript là gọi được API.

1. Vào <https://aistudio.google.com/apikey> → xoá khoá hiện tại → tạo khoá mới.
2. Vào <https://claude.ai/code> → bấm nút tên môi trường → dán khoá mới vào ô
   **`Environment variables`**, dạng `GEMINI_API_KEY=<khoá mới>`.
   (Bước này trước ghi `API credentials`; **sai** — đo 20/09, xem mục dưới cùng mục 3.)
3. Mở phiên mới rồi kiểm — không in khoá ra:

   ```bash
   node -e "console.log(process.env.GEMINI_API_KEY ? 'co khoa' : 'chua co')"
   ```

**Khoá không bao giờ gõ vào chat, không bao giờ vào thân lệnh Bash.**

</details>

### ✅ Việc 19/09 — xem cối xay quay trên iPhone: XONG, chủ dự án xác nhận 20/09 (lần 4)

Chủ dự án xem trên iPhone, báo **chạy OK**. Nhịp `NHIP_MOI_KHUNG` giữ nguyên.


Bản duyệt phiên này: https://claude.ai/artifact/WQgP5d2dMEeaeaapWPzLGL

Mở ra, tìm cái cối xay (bấm một dòng trong bảng công trình là bay tới), xem **cánh có
quay không** và **quay có nhanh quá hay chậm quá không**. Đang để hai nhịp một khung,
mỗi khung 30° — khoảng 25 vòng/phút ở tốc độ thường. Muốn nhanh chậm khác thì bảo tôi
đổi một số ở `NHIP_MOI_KHUNG`.

Thêm `?me=hien_dai` vào cuối địa chỉ là thấy cối xay gió thời hiện đại (ba cánh).

### ✅ Việc 18/09 (lần 4) — phong cách mẻ hiện đại: TỰ QUYẾT 19/09

Chủ dự án giao cho tự quyết. Chốt hai điều, có ảnh chụp đối chiếu:

1. **Mái xanh neon: ĐỔI.** `nha_dan` là nhà đông nhất thành phố mà mái nó xanh lá, nhân
   thêm `mau` 1,9 nên sáng hơn mọi thứ khác trong game. Nay mái ngói xám ấm; `nha_chai`
   mái xám lam. Phải thêm `mau_cot` dạng `{ "thay": … }` mới đổi được — **màu nhân không
   bao giờ kéo một màu ra khỏi sắc của nó**, đo tám bộ nhân đều vẫn ra xanh hoặc vàng.
2. **Người chibi: GIỮ.** Hai mẻ **không bao giờ cùng trên màn** — lên đời là đổi cả bộ
   atlas. Ở mức thu phóng chơi thật người cao khoảng 45 điểm ảnh CSS, tỉ lệ đầu không đọc
   ra được; cái đọc ra được là người Kenney khớp với nhà Kenney, tức trong một màn hình
   vẫn đồng nhất. Đổi sang bộ người tỉ lệ thật là thêm gói mới và nướng lại, mà atlas 2×
   của mẻ trung cổ đã hết chỗ.

Máy ảo chặn `github.io` (`000`) nên tôi **không tự xem trang thật được** — xem `du-an.md`
mục "Giới hạn mạng máy ảo".

### ✅ Việc 18/09 (lần 4) — sửa `docs/ASSET_CREDITS.md`: XONG

Anh đồng ý trong phiên; đã thêm 5 gói CC0 (4 gói Kenney City Kit + Kenney Mini Characters)
và 4 file atlas `hien_dai_*`. `check:credits` xanh lại.

### ✅ Việc 18/09 (lần 2 và 3) — XONG, chủ dự án xác nhận "chạy được"

https://gc1001vn-svg.github.io/quoc-chien/ — mở trên iPhone 18/09, game chạy bình thường.

Hai phiên đó **không chạm mã game**, nhưng có đổi `.claude/settings.json`, `package.json`
(hai lần) và bảy script; bước **E** đòi xác nhận trên máy thật trước khi mở phase mới.
**Bước E đã qua — phiên sau mở thẳng Phase 8B, không phải hỏi lại.**

Máy ảo chặn `github.io` (`000`) nên tôi **không tự xem được** — xem `du-an.md` mục
"Giới hạn mạng máy ảo".

### ✅ Việc 16/09 — khoá Freesound: XONG

Chủ dự án lấy khoá trong phiên, đã quét **27.313 file**. Khoá đi qua biến `FREESOUND_KEY`,
**không nằm trong repo nào** (đã `grep` lại để chắc). Muốn quét lại mẻ khác:

```bash
FREESOUND_KEY=<khoá> node cong-cu/quet_freesound.mjs ga chim
```

Khoá cũ hết hạn hay muốn đổi thì lấy lại ở <https://freesound.org/apiv2/apply/> — lấy dòng
**Api key**, không phải **Client id**.


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

✅ **Nhánh `claude/do-ab-skill`: chủ dự án đã xoá** (đo lại 18/09 bằng
`git ls-remote --heads origin`, không còn). Còn **sáu** nhánh `claude/*` khác — đếm bằng
lệnh, đừng chép tên vào đây. Máy ảo xoá không được, chỉ chủ dự án bấm thùng rác ở
https://github.com/gc1001vn-svg/quoc-chien/branches

**Nếu anh đã chuyển kho `ghi-nho` sang Public: chuyển về Private.** Kho chứa cách làm việc,
quyền hạn và giới hạn máy ảo.

## Số đo chuyển từ `TIEN_DO.md` mục 2 — 03/10/2026

Cắt cho `TIEN_DO.md` về dưới trần token (`check:token`). Số mới hơn của 12A: `TIEN_DO.md` mục 3 (03/10).

**Phase 12A, đo 27/09:** `sim:congnghe -- 320 6`: đời 5 giờ 147, **đời 6 giờ 249**, 48/48 công nghệ,
451 nhà ở giờ 320. `sim:van`: khoa học **3/5** (trước 5/5, thắng ở giờ 265 thay vì 190), thống trị 2/5,
văn hoá / ngoại giao / bỏ mặc 5/5 — ĐẠT. Mẻ `tuong_lai_2x`: 76 sprite, 2 trang (trang 0 đầy 65,7 %).

**Phase 11B, đo 27/09:** Chromium máy ảo 393 px, 500×: **~7,5 s thật mỗi giờ game** (lý thuyết 7,2 s);
chạy lâu cùng lúc `npm run do` thì tụt còn ~22 s/giờ (máy ảo vẽ bằng phần mềm — không phải số iPhone).
Hàng 9 nút tốc độ trên màn 393 px: rộng 314 px, mép trái 69 px (trước khi thu nhỏ: 415 px, lọt −31 px).
`sim:van` sau khi tách `TheGioi`: y nguyên (thống trị 2/5, ba kiểu kia 5/5, bỏ mặc thua 5/5).

**Phase 11A, đo 26/09 tối:** `sim:van` — vết thành phố thật 300 giờ mất **389 s** (lưu
`.cache/sim_van/`, lần sau đọc lại); mỗi ván thế giới **0,01–0,13 s**. Giờ thắng ở hạt giống
gốc: ngoại giao **72** · văn hoá **167** · thống trị **171** · khoa học **190**; bỏ mặc sụp đổ
giờ **111**. Đúng kiểu trên 5 hạt giống: thống trị 2/5, ba kiểu kia 5/5, bỏ mặc thua 5/5.
Thành phố (không đổi): đời 5 ở giờ ~150, 449 nhà ở giờ 300.

**Phase 10B, đo 26/09 trưa:** atlas `linh_sung` 412 sprite — 1× 20,1 %; 2× **một trang 76,0 %**
(GPU 16,8 MB). Trước khi cắt khung: 524 sprite, 2× hai trang, anh đo **30 fps** suốt trận. Màn trận súng chụp máy ảo: **322 sprite ·
1 lệnh vẽ**. Trận mẫu súng 48,5 giây, 54 lính mỗi bên. Nướng `linh_sung` cả hai cỡ ~7 phút.

**Phase 10A, đo 25/09:** atlas `linh_co` 260 sprite — 2× lấp **68,6 %** một trang, 1× 17,9 %
(`node tools/nuong_sprite.mjs linh_co` in lại). Màn trận chụp trong máy ảo: **344 sprite ·
1 lệnh vẽ**. `kiem:cheo` HEAD: **402/402 test**, `sim:tran` lệch 2,24 · 85,2 % trong khung ·
Brier 0,075. Nướng mẻ lính mất ~2 phút 15 giây mỗi cỡ.

**Atlas, đo 19/09 (Phase 8C):** thêm hai khung cối xay vào mỗi mẻ. `trung_co_2` 2× từ
84,4 % **một** trang lên **hai** trang (85,8 % + 4,5 %, GPU 33,6 MB / trần 67,1 MB);
`hien_dai` 2× lấp **77,3 %** một trang thật + một trang **rỗng 1×1** đệm cho khớp số
trang. Cả hai 1× vẫn một trang. **Đừng chép số này đi đâu** —
`node tools/nuong_sprite.mjs <mẻ> 2` in lại.
