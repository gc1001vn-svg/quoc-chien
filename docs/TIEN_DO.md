# TIẾN ĐỘ — QUỐC CHIẾN

> Đọc cả file, đầu mỗi phiên. Mục 1–5 **ghi đè** mỗi cuối phiên, không cộng dồn.
> Lịch sử từng phase: `docs/NHAT_KY/PHASE_*.md`. Nợ chưa động tới: `docs/NO_KY_THUAT.md`.

Cập nhật: 12/09/2026 (phiên rà soát — gỡ 7/11 xung đột, **không đụng màn hình game**).

## 1. Đang ở đâu

**Game vẫn ở Phase 8A** — phiên 12/09 không đụng gì màn hình game. Anh chốt lùi Phase 8B
một phiên để dọn xung đột trước. Việc đó **xong**.

**Gỡ 10/11 xung đột** (cái thứ 11 chờ anh bấm — mục 3). Nặng nhất là ba cái:

- **`CLAUDE.md` hết ngõ cụt.** Nó bảo "sửa bằng `Edit`", mà file khoá thì `Edit` bị chặn,
  và không chỗ nào nhắc vé duyệt. Giờ có dòng chỉ thẳng đường `.claude/da_duyet.txt`, và
  có test giữ cho khỏi mất lại.
- **Hook thôi chặn đường shell, chỉ ghi sổ** (anh chốt 12/09). Đo phiên thật: 13 lần chặn
  thì **4 lần chặn nhầm**, mà cái được bằng không — shell có mười đường ghi file.
- **Có test giữ tài liệu**, thứ trước nay không có: 27 file test, không cái nào đối chiếu
  số trong `docs/` với thực tế. Nên số gõ tay trôi tự do.

**Bốn cái trong kho `ghi-nho` cũng gỡ xong** — nhưng suýt bị bỏ lại, và lý do đáng ghi:
phiên kết luận "không có quyền" sau khi clone hỏng, trong khi lỗi thật là **xin sai loại
quyền** (xin quyền *ghi* thay vì *đọc*). Câu sai đó nằm sẵn trong skill `ghi-nho` nên
phiên nào cũng vấp; đã sửa. Bài học 11/09 "một lần bị chặn không phải kết luận" vẫn đúng
nhưng chưa đủ: **thử lại cùng một cách hai lần không phải là thử lại.**

**Hai thứ mới lộ ra khi gỡ, đáng nhớ hơn cả việc gỡ:**

1. **Xung đột thứ 11, chưa ai ghi.** `docs/DAU_PHIEN.md` dạy *"máy nướng chưa đọc được
   `.glb`"* — sai từ 11/09. File này đọc **mỗi đầu phiên**, nên nó dạy sai ngay bước đầu
   và làm phiên sau bỏ qua phần `.glb` của kho chung.
2. **Con số gõ tay thứ ba.** Hàng rào vừa dựng bắt ngay `NGUON_MO.md` ghi "1.855 model" —
   khác **cả** 1.222 lẫn 1.310. Đợt rà 12/09 soi bằng mắt không thấy; test bắt trong vài
   phút.
3. **Chỗ dạy sai về `.glb` có hai, không phải một.** Chính `TIEN_DO.md` này cũng kết một
   đoạn bằng *"`.glb` thì vẫn chưa đọc được"* — ngay dưới đoạn nói "120/120 file `.glb`
   đọc được". Tự mâu thuẫn trong cùng một đoạn.

Tức là: **rà bằng mắt không đủ, phải có máy giữ.** Cả ba cái đều lọt qua một đợt rà có
chủ đích hẳn hoi.

## 2. Số đo mới nhất

| Thước | Trước | Sau |
|---|---:|---:|
| `npm run do` | 6/6 · 211 test | **6/6 · 222 test** |
| Xung đột đã gỡ | 0/11 | **7/11** (4 treo vì quyền) |
| Test kiểm tài liệu | **0** | **11** (`tests/TaiLieu.test.ts`) |
| Hook chặn nhầm mỗi phiên | 4 lần | **0** — đường `Bash` chỉ ghi sổ |

Số model **không đo phiên này** (kho không tải). Số thật luôn nằm ở **dòng cuối**
`docs/KHO_ASSET.md` và `docs/KHO_CHUNG.md` — từ 12/09 có test cấm chép số đó ra tài liệu
luật, vì chép về là trôi.

Số đo game giữ nguyên từ 11/09 (Phase 8A): `sim:congnghe` **ĐẠT** 120 giờ · lên Trung cổ
giờ **21**, Súng ống giờ **65** · **21/24** công nghệ trong 120 giờ · **11** điểm nghiên
cứu mỗi giờ ở 241 nhà. Trần sprite ngay dưới.

### Đo trần sprite trên iPhone thật (11/09, atlas thật 2×)

| Số sprite | fps |
|---:|---|
| **18.089** | **≥ 58** — giữ 60 fps |
| 24.000 | 50 — và 24.000 là **hết sức chứa công cụ đo**, không phải hết sức máy |

**18.089 không phải trần máy, nó là một bậc của thang đo** (thang nhảy 1,35× từ 200).
Phase 0 ra đúng con số này vì cùng thang đo — cả dự án đã hiểu nhầm là trần máy suốt năm
phase. Trần thật nằm giữa 18.089 và 24.000.

Điều đáng giá: Phase 0 đo bằng **atlas giả** 256×256 và `TECH_SPEC` ước tính atlas thật cỡ
2× "còn ~4.500 sprite". **Ước tính đó sai, thấp hơn thực tế ít nhất bốn lần** — atlas thật
không tụt một bậc nào. **Trần 5.000 của dự án dư ít nhất 3,6 lần.**

## 3. Việc của chủ dự án

**Phiên 12/09 không đụng gì màn hình game, nên không có gì phải kiểm trên iPhone.**

Còn đúng **một việc treo từ 11/09**, nhỏ: ⏳ **nút "Đo trần sprite" ở màn dọc** — anh bấm
được, nhưng chưa có ảnh nào cho thấy bốn nút ☰ ⌂ 🔬 📏 thẳng hàng. Lúc nào mở game thì
liếc một cái.

### Hai việc cần anh quyết

**1. Tải skill `ghi-nho` bản mới lên claude.ai** — xung đột duy nhất còn lại, và **chỉ anh
làm được** (trợ lý không sửa được skill trên tài khoản). Bản trên tài khoản còn thiếu hai
thứ: luật "đọc hết ba file, cấm cắt", và chỗ sửa `access: read` — chính chỗ khiến phiên
12/09 tưởng là không vào được kho ghi nhớ rồi bỏ dở bốn việc. Chưa tải lên thì phiên sau
vấp lại đúng chỗ đó. File `.zip` đã gửi kèm.

**Nếu anh đã chuyển kho `ghi-nho` sang Public: chuyển về lại Private.** Việc đó không chữa
được gì (nguyên nhân là xin sai loại quyền, không phải quyền riêng tư), mà kho này chứa
cách làm việc, quyền hạn và giới hạn máy ảo — không nên để công khai.

**2. Kho chung cho game — anh nêu 12/09, chưa làm.** Anh muốn một repo riêng cho mọi thứ
liên quan làm game (tài nguyên, đồ hoạ, gameplay, cách xây dựng) để các dự án dùng chung,
khỏi tải đi tải lại. Anh đã chốt để **phiên sau**. Hai số anh hỏi, trả lời rồi:

- **Phình tối đa:** file đơn >50 MB GitHub cảnh báo, **>100 MB chặn cứng**; cả kho khuyến
  nghị <1 GB, khuyên mạnh **<5 GB** (quá 5 GB GitHub liên hệ bắt giảm, không chặn cứng).
  Kho hiện **326 MB** → còn dư khoảng **15 lần** nữa.
- **Tải lại tốn bao nhiêu token: gần như không.** File tải về **không đi qua trợ lý** —
  lệnh chạy trên máy ảo, trợ lý chỉ đọc mấy dòng kết quả, tốn **~200–500 token** dù 1 MB
  hay 1 GB. Cái tải lại thật sự tốn là **5–10 phút chờ**, itch.io **chặn tốc độ (429)**
  làm tải hay hỏng, và **nguồn có thể biến mất** (itch gỡ gói là mất vĩnh viễn).

Tức lý do đáng làm kho chung **không phải tiết kiệm token** như anh nghĩ, mà là ba cái sau
cùng, cộng với việc gom kiến thức làm game một chỗ — phần kiến thức thì nhẹ, vài MB.

### Một việc quy trình — giữ lại vì bài học còn dùng

**Bài học 11/09: một lần bị chặn không phải kết luận.** Phiên đó bỏ đọc kho `ghi-nho` sau
khi bị chặn một lần, hoá ra thử lần hai là được. Phiên 12/09 đã theo đúng bài học này —
thử clone hai lần, thêm một đường xin quyền khác — nhưng lần này **chặn thật**, nên ghi
lại là chặn thật chứ không phải bỏ cuộc sớm.

## 4. Nợ đang chặn phase kế tiếp

- **Phase 8B chưa làm: chưa có mẻ sprite hiện đại.** Khớp nối dựng sẵn, việc khó là dữ
  liệu: gói `city-builder-bits` chỉ có **8 dáng nhà** cho **32 loại nhà** của game.
- **Thưởng công nghệ chưa đổi được thành phố.** Đo ra: trần nhà 398 mà thành phố chỉ tới
  241 — trần không phải cái chặn, nhu cầu mới là. Hạ ngưỡng chờ 40→28 cũng vẫn 241.
- **Thẻ chính sách chưa đụng được kinh tế** — cố ý, để hiệu ứng tháo ra được đúng bằng cái
  đã lắp vào. Thẻ "+15 % lương thực" của GAME_SPEC mục 7 phải chờ Phase 9.
- **Lớp chiến dịch chưa nối vào kinh tế thành phố** — việc Phase 9.
- **Chưa có AI nước khác.** Ba nước đối thủ đứng yên.
- **`trai_ga` vẫn không có model gà.** Dò hết 11 gói, không gói nào có — `NGUON_MO.md` mục 8.
- **Người vác hàng đi tay không** — để Phase 10.
- **Skill `ghi-nho` trên tài khoản còn bản cũ** — chỉ chủ dự án tải lên được. Nó dạy phiên
  sau xin sai loại quyền, nên phiên nào cũng có thể vấp lại và bỏ dở việc trong kho ghi nhớ.
- **`KHO_ASSET.md` còn con số đếm kiểu cũ** (chỉ tính `.obj`, trong khi máy nướng đọc cả
  `.gltf` và `.glb`). File **sinh tự động** nên sửa tay là sai luật — nó tự đúng ở lần
  `npm run kho` đầu tiên có đủ kho, tức phiên Phase 8B.

Toàn bộ nợ còn lại: **`docs/NO_KY_THUAT.md`**.

## 5. Phase 8B — nướng mẻ hiện đại (rà soát xong rồi, làm được)

Nướng mẻ sprite thời hiện đại từ `city-builder-bits` (KayKit, CC0), rồi nối vào
`ThoiDai.me` để lên đời là thành phố đổi mặt.

**Việc phải quyết trước khi nướng:** gói chỉ có **8 dáng nhà** (`building_A`…`building_H`)
cộng đường, xe, cột đèn — mà game có **32 loại nhà**. Hai đường: ghép 32 về 8 dáng phân
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

### Kho model dùng chung — có thật, nằm trong git của `tayvuc`

Chủ dự án nhắc 11/09 và **anh đúng**: luật **hai kho** đã chốt cho mọi dự án, ghi ở
`tayvuc/CLAUDE.md` mục Asset — `assets_source/` giữ gói tải về nguyên vẹn (không lên máy
chủ), `public/assets/` chỉ giữ thứ game thật sự dùng (có lên máy chủ).

Kho chung nằm **trong git của `tayvuc`**: **2.677 file, 326 MB** — `kaykit` `quaternius`
`kenney` `polyhaven` `effekseer` `game-icons`. Và `tayvuc/docs/TIEN_DO.md` ghi thẳng:
*"Quốc Chiến tái dùng ba thứ của Tây Vực: 269 MB model 3D trong `assets_source/`"*.

**ĐÃ NỐI 11/09** (chủ dự án chốt). Cách nối:

| Lệnh | Việc |
|---|---|
| `npm run kho:chung` | sinh `docs/KHO_CHUNG.md` — bản kê model máy nướng đọc được (số ở **dòng cuối** file đó) |
| `npm run kho:lay <gói>` | chép một gói từ kho chung sang `assets_source/` |

`docs/KHO_CHUNG.md` **lên git** (36 KB) nên **mọi phiên dò được bằng `grep` mà không phải
clone 326 MB**. Chỉ khi trúng mới clone `tayvuc` rồi lấy gói thật. Luật dò giờ có **bước
1b** — xem `docs/DAU_PHIEN.md` mục F.

**Nối được tới đâu, nói thẳng:** kho chung giữ gói **đã lọc**, phần lớn chỉ còn `glTF/`,
**không có `OBJ/`**. Các mẻ hiện tại của dự án trỏ vào thư mục OBJ nên **không thay thế
được** — nối này **không giảm việc tải cho mẻ cũ**. Giá trị thật là **mở rộng nguồn dò**:
cả một kho model mà trước nay dự án không biết có, dùng được ngay cho Phase 10 (lính) và
Phase 12 (thời đại khác). Số cụ thể ở dòng cuối `KHO_CHUNG.md`.

Kho chung nhảy lên hơn gấp đôi vì **cùng phiên đã trả luôn nợ bộ đọc `.glb`**. Tài liệu
ước nợ đó "~200 dòng" — ước sai, hết **30 dòng**, vì phần khó đã nằm sẵn trong
`tools/lib/gltf.mjs` và GLB chỉ là glTF gói nhị phân. Đo thật: **120/120 file `.glb` ngẫu
nhiên đọc được, 0 hỏng**. Kit khai `"loai": "glb"` là nướng được.

**Máy nướng đọc được cả ba: `.obj` · `.gltf` · `.glb`.** `.fbx` thì chưa.
`tools/nuong_sprite.mjs` có `docObj`, `docGltf` và nhánh `laGlb`; mẻ `trung_co_2` **đang
dùng glTF thật** cho hai kit. `scripts/kho_asset.mjs` đã sửa cách đếm "dùng được" theo cả
ba đuôi. **Con số ở dòng cuối `KHO_ASSET.md` vẫn là số CŨ** (đếm theo luật chỉ-`.obj`) —
nó tự đúng sau lần `npm run kho` đầu tiên có đủ kho, tức phiên này.

> Đoạn này từng kết bằng câu *"`.glb` thì vẫn chưa đọc được"* — ngược hẳn với chính đoạn
> ngay trên nó ("120/120 file `.glb` đọc được"). Sửa 12/09. Cùng loại với xung đột thứ 11
> ở `DAU_PHIEN.md`, và lọt qua đợt rà vì rà bằng mắt.

`city-builder-bits` **không có** trong kho chung → Phase 8B vẫn phải tải gói đó từ itch.

**Mở phiên mới rồi hãy bắt đầu** — CLAUDE.md: mỗi phiên một phase.
Đầu phiên chạy `docs/DAU_PHIEN.md`, bảy bước A–G, không bỏ bước nào.
