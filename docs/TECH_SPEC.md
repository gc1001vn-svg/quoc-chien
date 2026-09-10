# TECH_SPEC — QUỐC CHIẾN

> Kỹ thuật. Đọc **mục 1 và 2** trước khi viết bất kỳ dòng code render nào.

Lập 05/09/2026.

---

## 1. Ba luật rút từ thất bại của Tây Vực

Tây Vực dừng 04/09/2026 ở 17 fps, máy nóng sau 10-20 giây, sau 43 phiên. Ba nguyên nhân
gốc, và ba luật để không lặp lại:

### Luật 1 — Mô phỏng tách hẳn khỏi phần vẽ

`src/sim/` là **TypeScript thuần**, không import `canvas`, `document`, `window`, WebGL,
hay bất cứ thứ gì của trình duyệt. Hệ quả:

- Chạy được trong Node → `npm run sim:thu` mô phỏng 10 giờ game trong vài giây
- Test tự động được toàn bộ logic — Tây Vực trộn hai thứ nên **không test được gì**,
  mỗi lần sửa phải nhờ chủ dự án mở iPhone thử, hơn chục lần

ESLint phải chặn cứng: file trong `src/sim/` không được import từ `src/render/`,
`src/ui/`, hay API trình duyệt.

### Luật 2 — Đo trước, làm sau

Tây Vực làm ngược: sửa hiệu năng 15 phiên rồi mới dựng công cụ đo, và **chưa ai chạy nó
lần nào**. Lần này:

- **Phase 0 giao trang đo `?do=sprite`**: vẽ N sprite, tăng dần, in ra N tối đa còn 60 fps.
  Chủ dự án mở một lần, nhắn về **một con số**. Con số đó chốt toàn bộ ngân sách đồ hoạ.
- `core/Perf.ts` có mặt từ phiên đầu: nhãn fps + chạm để tắt từng lớp (nền / nhà /
  người / hiệu ứng).
- Máy ảo **không đo được fps** (vẽ bằng phần mềm, luôn 1-5 fps). Nhưng máy ảo **chụp ảnh
  được** bằng Chromium — mọi việc về hình ảnh Claude tự kiểm, chỉ fps mới nhờ người.

### Luật 3 — Trần cứng đặt trước, không đặt sau

Xem mục 2. Vượt trần là lỗi, không phải "tối ưu sau".

---

## 2. Trần hiệu năng — con số cứng

| Hạng mục | Trần | Vì sao |
|---|---:|---|
| Lệnh vẽ mỗi khung hình | **≤ 4** | 1 lệnh cho mỗi atlas, gom hết sprite |
| Sprite động mỗi khung hình | **≤ 5.000** | Nâng 1.500 → 3.500 → 5.000 trong ngày 07/09 — xem hai mục "Vì sao nâng trần" dưới |
| Atlas trong bộ nhớ cùng lúc | **≤ 4 × (2048×2048)** | ≈ 67 MB bộ nhớ GPU (4 × 2048² × 4 byte). Tây Vực chết một phần vì 322 tấm ảnh rác |
| `setPixelRatio` | `min(dpr, 2)` | Giống Tây Vực — dpr 3 trên iPhone là gấp 2,25 lần công vẽ |
| Nhịp mô phỏng | **10 Hz**, tách khỏi vòng vẽ | Vẽ 60 fps, sim 10 Hz, nội suy vị trí giữa hai nhịp |
| Kích thước bản build | ≤ 95 MB | CI chặn |
| Mỗi file `.ts` | ≤ 300 dòng | Vượt thì tách module |
| Thư viện đồ hoạ ngoài | **0** | Xem mục 4 |

### Vì sao nâng trần sprite 1.500 → 3.500 (07/09)

Nhà Quaternius chiếm **2×2 ô** nên to gấp bốn nhà cũ; ở mức thu nhỏ cũ 0,60× màn hình
chỉ còn **23 ô ngang** — chủ dự án báo "nhìn được khoảng nhỏ quá". Muốn nhìn toàn cảnh
phải hạ `zoomMin`, mà hạ thì số sprite tăng theo bình phương. Đo thật trên bản đồ đang
chạy (quét mọi vị trí camera, màn hình 874×402):

| Thu phóng | Sprite chỗ đông nhất | Trong đó là ô nền | Ô ngang màn hình |
|---:|---:|---:|---:|
| 0,60× | 1.184 | 1.057 (89 %) | 23 |
| 0,55× | 1.344 | 1.199 | 25 |
| 0,50× | 1.673 | 1.510 | 27 |
| 0,45× | 2.042 | 1.858 | 30 |
| **0,35×** | **3.100** | **2.841 (92 %)** | **39** |
| 0,30× | 3.662 | 3.369 | 46 |

(Đo trên bản đồ 64×64. Bản đồ nay nới lên 96×96 nên chỗ đông nhất là **3.316** — vẫn dưới
trần 3.500, còn dư 5 %.)

**Chín phần mười là ô nền.** Bỏ bớt cây cỏ vặt không cứu được gì — đã đo, ở 0,35× chúng
chỉ chiếm 57 sprite. Nên cách duy nhất để nhìn rộng hơn là chấp nhận vẽ nhiều ô nền hơn.

Ô nền là sprite **rẻ nhất có thể**: cùng một atlas, một hình chữ nhật, không chồng lấn,
không trong suốt. Trần 1.500 cũ là ước tính từ kích thước màn hình chứ không phải đo máy
thật; số đo máy thật duy nhất đang có là **18.089 sprite ở 60 fps** trên iPhone — và con
số đó **chạm trần công cụ đo, không phải trần máy** (xem `docs/NHAT_KY/PHASE_2B.md`).
3.500 vẫn còn thấp hơn năm lần số đó.

**Vẫn chưa đo lại trên iPhone với mẻ mới.** Rớt fps thì đường lùi là nâng `zoomMin` trong
`data/thanh_pho_demo.json` về 0,45 — một dòng, không đụng mã.

### Vì sao nâng tiếp 3.500 → 5.000 (07/09, Phase 4)

Walker của Phase 4 là **sprite động thật đầu tiên** của dự án. `npm run sim:thu` đo được
chỗ đông nhất là **324 người cùng lúc** trên cả bản đồ — nhưng đó là toàn bản đồ, màn hình
chỉ thấy một phần. Ở 0,35× nền đã ăn 3.316 sprite, trần 3.500 chỉ còn dư 184 chỗ, không đủ.

Hai đường: **ẩn walker khi thu nhỏ dưới 0,6×** (cách của Caesar III và Zeus, không đổi trần),
hay **nâng trần**. Chủ dự án chọn nâng trần ngày 07/09 sau khi đã được nêu rõ rủi ro.

> **Rủi ro chưa đóng:** nâng trần khi **chưa ai đo fps trên iPhone** với mẻ đồ hoạ hiện tại
> là đúng cách Tây Vực chết (mục 1). Đường lùi đã dựng sẵn: `ZOOM_HIEN_WALKER` trong
> `src/render/CityScene.ts` — đổi từ 0 lên 0,6 là walker biến mất khi thu nhỏ, một dòng.

**Bản đồ phải đủ to cho mức thu nhỏ.** `o_px` là **64** ở bộ 1× và **128** ở bộ 2×, nên
bản đồ 64×64 chỉ rộng `63 × 128 / 2 = 4.032` đơn vị — ở 0,35× màn hình nhìn được 2.497
đơn vị ngang và 1.149 dọc, tức rộng hơn nửa hình thoi. Nới lên **96×96**; số vật thể nhân
theo diện tích (×2,25) để mật độ không loãng ra.

**Camera kẹp TÂM, không kẹp khung nhìn — sai một lần rồi mới rõ.** Bản đồ ở góc chéo là
hình thoi, nên kẹp theo `|x| / W + |y − cy| / cy ≤ 1`. Câu hỏi là **áp lên cái gì**:

- Áp lên **cả bốn góc khung nhìn** thì màn hình không bao giờ thấy nền — nhưng tâm chỉ đi
  được trong một hình thoi nhỏ hơn đúng nửa khung nhìn. Ở 0,35× còn **21 %** bề ngang bản
  đồ. Đã làm thế ngày 07/09 và chủ dự án báo ngay "kéo không hết các nơi, nó bị kẹt".
- Áp lên **tâm** thì mọi ô đều kéo tới được, đổi lại gần mép thấy một ít nền — đúng như
  mọi game ở góc chéo khác. **Đây là cách đúng.**

`tests/Camera.test.ts` giữ cả hai điều: kéo thật xa vẫn bị kéo về trong, **và** bốn góc
cùng giữa bản đồ đều tới nơi được, ở bốn mức thu phóng, cả hai bộ atlas.

**Đổi thời đại thì nhả atlas cũ** (`gl.deleteTexture`), không giữ lại "phòng khi cần".

---

## 3. Nướng sprite từ model 3D

### Vì sao

Age of Empires 2, StarCraft, Red Alert, Zeus, Caesar III **đều không vẽ tay sprite** —
họ dựng model 3D rồi chụp từ góc chéo cố định. Ta làm y hệt vì:

1. **Một phong cách duy nhất cho cả 6 thời đại** — cùng camera, cùng đèn, cùng hậu kỳ.
   Không có bộ sprite 2D miễn phí nào phủ được cổ đại → tương lai bằng cùng nét vẽ.
2. **Đẹp hơn mà không tốn hiệu năng**: bóng mềm, khuất sáng, viền nét nướng sẵn vào ảnh.
3. **Tái dùng 269 MB model CC0** đã tải cho Tây Vực.
4. **Claude tự nhìn được kết quả** trong máy ảo.

### Cách chạy

`tools/nuong_sprite.mjs`:

1. Mở Chromium sẵn có (`/opt/pw-browsers/chromium`) qua `tools/lib/cdp.mjs` —
   **chép từ Tây Vực, không cần thư viện nào**
2. Trang tạm dựng model bằng **WebGL tự viết** (`tools/lib/trang_nuong.js`), camera
   **trực giao**, góc chéo cố định. **Không three.js** — chốt 06/09, xem dưới
3. Chụp mỗi model ở góc cố định (lính 8 hướng × N khung là việc của Phase 10)
4. Xếp vào atlas theo kệ (`tools/lib/xep.mjs`), xuất PNG + `.json` toạ độ
5. In bảng: bao nhiêu sprite, mỗi atlas lấp bao nhiêu phần trăm, tốn bao nhiêu bộ nhớ GPU

### Vì sao không dùng three.js — chốt 06/09

Model Kenney chỉ có **một** material trỏ tới **một** ảnh `Textures/colormap.png`, file OBJ
chỉ có `v` `vt` `vn` `f` `usemtl`. Đọc và vẽ bằng tay hết chưa tới 300 dòng, giữ đúng luật
"thư viện đồ hoạ ngoài = 0" ở mục 2, và đúng tiền lệ `tools/lib/cdp.mjs` (tự viết thay
Playwright). Đánh đổi: OBJ **không mang chuyển động** — nướng lính có xương ở Phase 10 thì
xin cài three.js lúc đó, không xin trước.

### Số thật của mẻ trung cổ — đo 06/09

**147 sprite**, nướng từ bốn gói CC0 của Kenney và một gói của KayKit. Công thức ghép ở `tools/me/trung_co.json`.

| Gói | Dùng vào | Ghi chú |
|---|---|---|
| Fantasy Town Kit 2.0 | Nhà ở, chợ, giếng, cối xay | **Bộ lắp ghép** — tường, mái là mảnh rời, không có sẵn cái nhà nào |
| Tower Defense Kit | Ô nền, đường, sông, cầu | Ô nền có bề dày, đọc hình tốt ở góc chéo |
| Castle Kit | Tháp, tường thành, cổng, **máy công thành** | Có 7 bảng màu `variation-*.png` → cùng model, khác màu, dùng cho nước khác |
| Nature Kit | Cây, hoa, đá, vách, **ruộng đồng**, lều, tượng | Không có ảnh, màu nằm thẳng trong `.mtl` |
| KayKit Medieval Builder | **Công trình nguyên khối 2×2**: lâu đài, chợ, trại lính, trường bắn, xưởng gỗ, mỏ, cối xay | Ô lưới của KayKit rộng **2 đơn vị**, Kenney rộng 1 → phải `ti_le` |

Ba nước cờ để **không đơn điệu**, đều không phải nướng thêm model:

1. **Màu nhân và sơn đè theo mảnh** (`mau`, `thay_mau` trong mẻ). Bốn màu mái ngói từ
   cùng một mảnh `roof-point`. Màu nhân không kéo được xanh sang đỏ, nên mái dùng
   `thay_mau` — bỏ hoạ tiết, sơn một màu phẳng.
2. **Màu nhân theo tên material** (`mau_vl`). Lá của Nature Kit là xanh ngọc, lệch hẳn
   với ba gói kia; kéo riêng `leafsGreen`/`grass` về xanh lá mà **không** đụng `woodBark`,
   nếu không thân cây đỏ quạch theo.
3. **Đổi bảng màu cả gói**: khai thêm một kit trỏ cùng thư mục nhưng khác `anh`.
   `thap_vuong` và `thap_vuong_dich` là cùng model, khác bảng màu.

Hai cái bẫy khi trộn gói của hai tác giả, đã sập rồi mới biết:

- **Thước đo khác nhau.** Ô lưới Kenney rộng 1 đơn vị, KayKit rộng 2. Không có `ti_le`
  thì nhà KayKit to gấp đôi cả thành phố.
- **Không gian màu khác nhau.** KayKit xuất từ Blender nên `Kd` là màu **tuyến tính**;
  Kenney ghi màu sRGB. Để nguyên thì đá xám của KayKit ra xanh đen như than. Kit khai
  `"gamma": true` thì bộ đọc đổi `Kd` sang sRGB bằng `v ** (1/2.2)`.

Đèn: đèn chính ấm chéo trên-trái + đèn nền nửa cầu (mặt ngửa ăn sáng trời lạnh, mặt cúi
ăn sáng đất ấm) + viền lạnh mỏng ở rìa, rồi kéo bão hoà lên 1,30. Đèn nền phải để **tối**;
sáng quá thì mọi thứ bạc ra xám xịt như nhau.

Thêm 06/09 sau khi so với game thương mại (Million Lords — cùng phối cảnh 2:1):

- **Bóng đổ nướng sẵn** — một hình elip mềm trên mặt đất, lệch theo hướng đèn, to dần
  theo chiều cao vật. Không dùng hình chiếu thật của model: các tam giác chiếu xuống đè
  nhau, chỗ đè ra đậm hơn, thành vệt loang lổ.
- **Tối chân** — càng gần mặt đất càng tối (`0.62 + 0.38 * smoothstep(0, 0.55, y)`).
  Thiếu cái này thì khối nhìn như dán lên nền chứ không đứng trên đất.
- **Nâng tông** — vùng sáng ngả ấm, vùng tối ngả lạnh. Cùng một màu mà tách hai đầu ra
  thì hình khối nổi hẳn, không cần thêm đa giác nào.

### Mẻ đang chạy — `trung_co_2`, Quaternius, đo 07/09

**Từ 07/09 game chạy mẻ này**, mẻ Kenney/KayKit 147 sprite ở trên **không còn trong
`public/`** (dựng lại được bất cứ lúc nào từ `tools/me/trung_co.json`).

**38 sprite**, ba gói CC0 của Quaternius. Công thức ở `tools/me/trung_co_2.json`.

| Số đo | Bản 1× | Bản 2× | Trần |
|---|---:|---:|---|
| Sprite | 38 | 38 | — |
| Trang atlas 2048² | 1 (lấp 22,0 %) | 2 (76,1 % + 10,7 %) | 4 trang |
| Bộ nhớ GPU | 16,8 MB | 33,6 MB | 67,1 MB |
| Sprite một khung, chỗ đông nhất ở 0,35× | 3.316 | 3.236 | 5.000 |
| Lệnh vẽ | 1 | 2 | 4 |

Bản 2× tràn sang trang thứ hai một phần vì **cách xếp kệ bỏ phí**: tổng diện tích sprite
là **0,867 trang**, xếp khít thì vừa. Nợ này ghi ở `docs/TIEN_DO.md`; chưa đáng đổi thuật
toán vì còn cách trần 4 trang khá xa, và mẻ Kenney trước cũng đã chạy 2 trang ở 2×.

**Cắt theo kênh alpha — sửa 07/09.** Trước đó `gl_FragColor` đặt cứng `alpha = 1.0`, tức
kênh trong suốt của ảnh bị bỏ hoàn toàn. Cây Quaternius làm bằng **tấm lá có alpha**, nên
mỗi tấm vẽ ra nguyên hình chữ nhật và phần lẽ ra phải thủng thì hiện màu nền tối của
chính ảnh đó — cây sun thành cục đen lởm chởm, và đó mới là lý do thật của "cây ra khối
đen" ghi ở `docs/NHAT_KY/PHASE_2B.md`, không phải do màu. Nay `discard` khi `alpha < 0.5`.
Cắt cứng chứ **không trộn**: trộn thì rìa nửa trong suốt vẫn nhân màu tối của ảnh, ra
đúng cái viền đen cũ.

**Thước:** 2 đơn vị model Quaternius = **1 ô lưới** (`ti_le` 0,5); Stylized Nature dùng
`ti_le` 0,2–0,34 tuỳ vật. Đỉnh tường ở **y = 1,56 ô** (3,12 đơn vị × 0,5) — mọi mảnh mái
neo đúng số này, đặt thấp hơn thì tường chọc lên khỏi mái.

**Công trình chiếm nhiều ô.** Nhà Quaternius rộng **2×2 ô**. Trong mẻ, các mảnh của nó
dịch **+0,5** trên cả `x` và `z` để khối trải đúng ô `(a,b)` → `(a+1,b+1)` chứ không lệch
nửa ô quanh tâm ô. Trong `data/thanh_pho_demo.json` khai `"o": 2`; `src/render/BanDoDemo.ts`
đòi **cả khối** trống và không chạm đường mới đặt, và xếp theo **góc trước**
`sau(a+o-1, b+o-1)` — lấy ô neo mà xếp thì nhà to vẽ trước cả thứ đứng cạnh nó và bị đè.

**Nhân bản sprite** (`nhu` trong mẻ): năm ngôi nhà chỉ khác màu mái mà mỗi cái 17 mảnh.
Khai `{"nhu": "nha_ngoi_do", "mau_vl": {...}, "xoay": 90}` thì biến thể còn ba dòng.
`xoay` quay cả sprite quanh trục dứng — đổi hướng nóc nhà, nhìn từ trên xuống là khác hẳn.

**Bẫy màu nhân, đã sập ba lần, ghi cho khỏi sập lần thứ tư.** Màu nhân **không thêm được
gì vào kênh bằng 0**. Đo thật ảnh gốc:

| Ảnh | RGB trung bình | Nhân được sang |
|---|---|---|
| `T_RoundTiles_BaseColor` (ngói) | 178, 84, 48 | nâu · lam sẫm · ô liu — kênh lam 48/255 đủ cao |
| `Leaves_NormalTree_C` (lá sồi) | 56, 78, 0 | **chỉ vàng-lục**; kênh lam bằng 0 |
| `Leaf_Pine_C` (lá thông) | 28, 48, 0 | **chỉ vàng-lục**; kênh lam bằng 0 |
| `Leaves_TwistedTree_C` (cây vặn) | 95, 13, 13 | **chỉ đỏ** — bỏ, không cứu được |

Nên **lá phải giảm chứ không tăng** (`[0,95 · 1,10 · 1,00]`): kéo sáng lên thì ra vàng
chanh bệt, đúng lỗi đã ghi ở `docs/NHAT_KY/PHASE_2B.md`. Muốn lá xanh thật thì máy nướng
phải có phép **cộng** chứ không chỉ phép nhân — chưa làm, ghi ở mục nợ.

Cũng vì lý do đó, mái "xám" nướng ra **lam sẫm** chứ không ra xám: muốn xám phải khử bão
hoà, mà nhân không khử được. Trong mẻ nó tên đúng là `nha_ngoi_lam`.

### Luật vẽ cho Phase 2: nền vẽ hết trước, vật vẽ sau

Bóng nướng trong sprite thò ra khỏi ô của nó. Nếu trộn hai lớp lại rồi sắp theo độ sâu
`x + z`, ô nền phía sau sẽ **đè lên bóng** của nhà phía trước và bóng biến mất.
Nên `CityScene` phải vẽ **toàn bộ lớp nền trước**, rồi mới tới lớp vật thể.
Đã sập đúng bẫy này khi dựng `tools/xem_canh.mjs`.

| | 1× | 2× |
|---|---:|---:|
| Trang atlas 2048² | 1 | 2 |
| Lấp đầy | 29,7% | 82,8% + 32,9% |

Tổng 3 trang / trần 4. Bóng đổ nới hộp bao của từng sprite nên ăn thêm chỗ; muốn hạ
xuống thì cắt sát theo kênh alpha thay vì theo hộp bao hình học — chưa làm.

Tổng 2 trang / trần 4. Còn chỗ cho các mẻ sau.

### Góc camera

Isometric chuẩn 2:1 — ô nền `64×32` px ở cỡ 1×. Camera trực giao, xoay 45° quanh trục
đứng, nghiêng **30°**.

Sửa lại chỗ ghi nhầm (06/09): bản đầu ghi "`atan(0.5)` ≈ 26,57° cho 2:1 chính xác". Sai.
Chiều cao chiếu xuống = chiều ngang × `sin(nghiêng)`, nên 2:1 cần `sin = 0,5` → **đúng 30°**.
Đo lại trên atlas đã nướng: ô nền ra `64×32` px, khớp.

### Cỡ sprite

| Loại | Cỡ 1× | Cỡ 2× |
|---|---|---|
| Ô nền | 64×32 | 128×64 |
| Nhà nhỏ | 128×128 | 256×256 |
| Nhà lớn | 256×256 | 512×512 |
| Người / lính | 48×64 | 96×128 |

Nướng cả hai cỡ. **Ship cả 2×** — chốt 06/09 sau khi trang đo Phase 0 cho số thật trên
iPhone: **18.089 sprite ở 60 fps**, dư 5 lần so với trần 3.500. Sprite 2× tốn gấp 4 lần
diện tích vẽ → còn ~4.500 sprite ở 60 fps, vẫn trên trần.

Cảnh báo: số đó đo với atlas giả 256×256 và **chạm trần công cụ đo, không phải trần máy**;
atlas thật 2048×2048 nặng băng thông hơn nhiều. **Vẫn chưa đo lại.** Rớt dưới 3.500 ở cỡ
2× thì lùi về ship 1×, hoặc nâng `zoomMin` về 0,45.

### Ngân sách atlas cho lính

8 hướng × 4 dáng (đi, đánh, trúng đòn, chết) × 6 khung = **192 khung** mỗi loại lính.
Ở 48×64 px là ≈ 590.000 px². Một atlas 2048² chứa 4.190.000 px² → **khoảng 7 loại lính
mỗi atlas**.

Chật. Phương án lùi nếu vượt trần: **giảm còn 4 hướng** (như nhiều game 2D cũ) → 96 khung
→ ~14 loại lính mỗi atlas. Quyết định bằng số thật ở Phase 10, không đoán trước.

### Gắn chuyển động — tái dùng của Tây Vực

Tây Vực đã có hệ ánh xạ xương **theo tên** (`data/animations.json`, `data/bone_map.json`)
để gắn một bộ chuyển động chung vào nhiều model xương khác nhau, cùng
`tests/AnimationRetarget.test.ts` bắt đỏ nếu thiếu ánh xạ. **Chép nguyên sang dùng trong
công cụ nướng.** Đây là phần khó nhất của việc nướng lính và nó đã làm xong.

Cảnh báo giữ nguyên từ Tây Vực: model xương lạ mà không ánh xạ lại thì **đứng đờ ra mà
không báo lỗi gì**.

### Nguồn model — đã kiểm tra tải được từ máy ảo

`kenney.nl`, `opengameart.org`, `itch.io` đều trả 200 (khác `vercel.app` bị chặn 403).

| Thời đại | Nguyên liệu | Đánh giá |
|---|---|---|
| Cổ đại | Lều, chòi gỗ từ KayKit / Quaternius | Yếu, chỉnh nhiều |
| Trung cổ | KayKit `medieval-builder` + Quaternius `medieval-village-megakit` | **Rất mạnh, có sẵn** |
| Súng ống / cận đại | Chắp từ trung cổ + city kit | **Yếu nhất** |
| Công nghiệp | Kenney Factory Kit, City Kit (Industrial) | Tốt |
| Hiện đại | Kenney City Kit (Commercial/Roads), Car Kit, Quaternius `street` | Tốt |
| Tương lai | Kenney Modular Space Kit, Blaster Kit | Tốt |

Nên nướng **trung cổ trước**, rồi hiện đại, tương lai, cuối cùng vá cổ đại và cận đại.

### Hai kho tách riêng (giữ luật của Tây Vực)

- `assets_source/` — gói tải về nguyên vẹn, **không lên máy chủ**
- `public/assets/` — chỉ atlas đã nướng mà game thật sự dùng

**Danh mục kho: `docs/KHO_ASSET.md`** — tên thật của cả 1.855 model, sinh bằng `npm run kho`.
**Dò ở đó trước khi ghép bất cứ sprite nào.** Bảng gói ngay trên đây ghi "KayKit Medieval
Builder: … xưởng gỗ, mỏ, cối xay" từ 06/09, nhưng ghi chung chung nên không grep được —
ngày 10/09 vẫn ngồi ghép cối xay gió bằng tay năm lượt trong khi `mill` + `mill_blades`
nằm sẵn trong kho. Danh mục sinh tự động là để chuyện đó không xảy ra lần nữa.

---

## 4. Bộ vẽ — WebGL tự viết, không thư viện

WebKit có lỗi hiệu năng đã ghi nhận (bug 181244): gọi `drawImage()` hàng nghìn lần với
ảnh nhỏ thì Safari chậm. Đó **đúng là** việc game này làm mỗi khung hình → **không dùng
Canvas 2D cho lớp sprite**.

`render/Gl.ts` (~300 dòng):

- Một buffer đỉnh động, mỗi sprite là 2 tam giác
- **Nạp mọi trang của atlas lên GPU cùng lúc**, mỗi đỉnh mang thêm số hiệu trang
  (`a_trang`), shader chọn ảnh theo số đó → **một lệnh `drawArrays` cho cả một lớp vẽ,
  dù atlas có mấy trang**
- Sắp xếp theo trục sâu isometric (`y + x`) trước khi nạp buffer
- Không depth buffer, dùng thứ tự vẽ (painter's algorithm)

**Sửa 06/09 sau khi gắn atlas thật vào (Phase 2).** Bản đầu ghi "gom toàn bộ sprite
**cùng atlas** → một lệnh `drawArrays`", ngầm hiểu một atlas là một tấm ảnh. Không đúng:
mẻ trung cổ cỡ 2× cần **hai** trang 2048², và lớp vật thể trải cả hai. Thứ tự vẽ phải
theo trục sâu, không được xếp lại theo trang, nên xả lô mỗi lần đổi trang là hàng chục
lệnh vẽ — vỡ trần 4 ở mục 2.

Cách gỡ: `src/render/Shader.ts` **sinh** mã shader đúng bằng số trang thật của atlas, trải
thành chuỗi `if` (GLSL ES 1.0 cấm tra mảng sampler bằng chỉ số thay đổi được). Một trang
thì mã sinh ra y hệt bản một texture cũ, không tốn thêm gì. Nhiều trang thì mỗi điểm ảnh
có thể phải đọc nhiều ảnh — đó là cái giá, đo trên iPhone mới biết đắt hay rẻ. Rớt fps thì
lùi về bộ 1× (một trang), sửa đúng một dòng trong `Atlas.ts`.

Số đo Phase 2 trong máy ảo: cả thành phố — nền và vật thể — vẽ hết trong **1 lệnh vẽ**,
vì hai lớp gom chung một lô 4.096 sprite và không còn gì bắt phải cắt lô giữa chừng.

Phương án lùi nếu trang đo Phase 0 cho thấy không đạt: **PixiJS** (MIT).
Theo luật, phải **hỏi chủ dự án trước khi cài**, không tự quyết.

Canvas 2D vẫn dùng được cho: HUD, thẻ quyết định, bản đồ chiến dịch (ít phần tử, tĩnh).

---

## 5. Cấu trúc thư mục

```
src/
  sim/                    ← TypeScript thuần, ESLint chặn import trình duyệt
    Clock.ts              nhịp 10 Hz; tốc độ 0 / 1× / 2× / 4× / 8× / 30×, mở ván 8×
    State.ts              trạng thái toàn ván
    city/                 Wares · Walkers · Buildings · Chains · Citizens · Order
    campaign/             Provinces · Armies · Battle · BattleScript · Diplomacy · Rival
    meta/                 Research · Eras · Policies · Victory
    autoplay/             Governor · Policy
  decision/               Engine · Effects
  render/
    Gl.ts                 bộ vẽ WebGL, 1 lệnh vẽ mỗi atlas
    IsoMath.ts            lưới ô ↔ toạ độ màn hình
    Atlas.ts              nạp / nhả atlas
    CityScene.ts · MapScene.ts · BattleScene.ts
  ui/                     Hud · DecisionCard · PolicyBar · SpeedBar · Log
  core/
    AssetPath.ts          chép từ Tây Vực — luật đường dẫn gốc
    Perf.ts               nhãn fps + nút tắt từng lớp
  save/Save.ts            localStorage, offline hoàn toàn

tools/
  nuong_sprite.mjs        model 3D → atlas PNG
  lib/cdp.mjs             chép từ Tây Vực — điều khiển Chromium, không cần thư viện
  do_sprite.mjs           dựng trang đo

data/                     ← MỌI số cân bằng, cấm hardcode trong .ts
  eras · nations · wares · buildings · chains · provinces · units
  armor_table · tech · eureka · policies · victory · decisions · balance   (.json)
```

---

## 6. iOS và PWA

Giữ nguyên những gì Tây Vực đã làm được (chủ dự án xác nhận chạy tốt):

- PWA cài lên màn hình chính, **không thanh địa chỉ**
- Tự xoay ngang, tôn trọng vùng an toàn (trên 62 px, dưới 34 px trên iPhone 16 Pro)
- Màn hình tham chiếu **874×402** CSS px nằm ngang
- Offline hoàn toàn — không gọi mạng lúc chơi

---

## 7. Đường dẫn gốc — sai là PWA mở ra trang trắng

Chép nguyên luật của Tây Vực:

- `vite.config.ts` khai **một hằng số duy nhất** `const BASE = '/'`, quyết định `base`
  của Vite, `start_url`, `scope`, icon manifest. Đổi nơi phục vụ thì **chỉ sửa đúng dòng đó**.
- Mọi đường dẫn asset **bắt buộc** đi qua `assetUrl()` của `src/core/AssetPath.ts`.
  Cấm viết `'/assets/...'` hay `'/icons/...'` thẳng trong code hay CSS.
- `npm run check:base` (build trước) đối chiếu, CI chặn nếu lệch.

---

## 8. Test bắt buộc

Ba chỗ **phải** có test, giống luật Tây Vực, cộng thêm hai chỗ riêng của game này:

| Chỗ | Test gì |
|---|---|
| Tính sát thương | Bảng giáp × đạn ra đúng số |
| Sinh chỉ số ngẫu nhiên | Cùng hạt giống → cùng kết quả |
| Bảng rơi đồ / phần thưởng | Tỉ lệ đúng như khai trong JSON |
| **Chuỗi sản xuất** | Chạy 10 giờ game, không có hàng âm, không kẹt vĩnh viễn |
| **Kịch bản trận** | Kết quả kịch bản khớp đúng kết quả `Battle.ts` đã tính |

Thêm: `tests/SimKhongDungTrinhDuyet.test.ts` — quét `src/sim/` bắt lỗi nếu có import
trình duyệt (đây là hàng rào của Luật 1).

---

## 9. Thư viện ngoài

Cho phép sẵn: `vite`, `typescript`, `eslint`, `vitest`, `vite-plugin-pwa`.
`three` chỉ dùng trong `tools/` (nướng sprite), **không vào bản build của game**.

Mọi thư viện khác: đề xuất tên + license + lý do, **chờ chủ dự án đồng ý**, không tự cài.

---

## 10. Lệnh

**Trước khi commit luôn chạy đủ:**
```
npm run lint && npm run typecheck && npm test && npm run build
```

| Lệnh | Việc |
|---|---|
| `dev` · `preview` · `lint:fix` | như thường |
| `check:base` | đối chiếu đường dẫn gốc (build trước) |
| `check:credits` | mọi asset trong `public/` có mặt trong `ASSET_CREDITS.md` |
| `nuong:sprite` | nướng một mẻ atlas từ model 3D |
| `sim:thu` | chạy 10 giờ game trong Node, in bảng số |
| `sim:tran` | chạy 1000 trận, in tỉ lệ thắng so với dự đoán |
| `chup:man` | chụp màn hình game bằng Chromium trong máy ảo |
