# PHASE 6B — Nhà kinh tế mọc lên thật (09/09/2026)

Chen trước Phase 7, chủ dự án chốt. Phase 6 dựng thẻ quyết định nhưng bấm "xây hai cối
xay" thì chỉ bảng số đổi, trên màn không có gì mọc lên — nợ đó làm hỏng đúng cái vòng
phản hồi vừa dựng.

## Đã làm

- **12 sprite mới** trong `tools/me/trung_co_2.json`, phủ cả 32 loại nhà: giếng · cối xay ·
  ruộng · vườn nho · nhà chài · trại thú · lò nhỏ · lò lớn · mỏ · xưởng · trại gỗ · công
  trường. Nhà dân dùng `nha_nho_do`, trại lính dùng `thap_canh` — hai cái đã có sẵn.
  Tất cả **rộng một ô**: `datMotNha` chỉ cấp một ô, sprite hai ô sẽ tràn sang nhà bên.
- Mái đổi màu bằng **`thay_mau`**, không bằng phép nhân: `NO_KY_THUAT` đã ghi máy nướng
  không có phép cộng nên nhân xám vào ngói đỏ vẫn ra đỏ. Lò xám, nhà chài xanh, xưởng
  vàng nâu — ở mức thu nhỏ 0,35× vẫn phân biệt được nhau.
- **Nối sim với bản đồ**: mỗi `ThuNha` chèn một `OVat` qua `chenVat`, kể cả nhà thống đốc
  xây lúc đang chạy (`XayThem.dungNha`). Tên sprite khai trong `data/buildings.json`.
- **Gộp `daChiem` làm một.** Trước phiên này `sinhBanDo` và `City` mỗi bên giữ một tập
  riêng, nên 94 nhà kinh tế đang đặt đè lên cây và nhà trang trí mà không ai biết — chỉ
  vì chúng vô hình nên không nhìn ra. `veKho` cũng đánh dấu ô của nó.
- Bỏ `datNhaKinhTe` (không ai gọi từ Phase 5). `npm run nuong` trỏ sang mẻ `trung_co_2`
  đang dùng thật — trước đó nó trỏ vào mẻ Phase 1 và chạy là chết.

## Số đo

`npm run do` **6/6 đạt**, **128 test** (trước 124). `npm run sim:thu` **ĐẠT**, 10 giờ game:
**5 thẻ đã hỏi · 94 → 102 nhà · 4 kho · 89.232 chuyến một giờ · đông nhất 325 người ·
0 bỏ cuộc.** (Phase 6: 84.058 chuyến — bố trí nhà đổi vì hết cảnh đặt chồng.)

Ảnh máy ảo: **3.498 sprite · 1 lệnh vẽ** ở 0,35× (trần 5.000 và 4). Số fps trong máy ảo
không có nghĩa — máy ảo vẽ bằng phần mềm.

## Vá thêm 10/09 — tốc độ 30×

Chủ dự án chơi thật: **59 fps**, nhưng "chờ mãi không thấy hỏi". Một giờ game dài 36.000
nhịp, tức đúng **một giờ thật** ở 1×, mà giãn cách hai thẻ là hai giờ. Ở 8× vẫn 15 phút.

Đã thử hướng **rút ngắn giờ game** (36.000 → 1.200 nhịp) và **bỏ**: mọi ngưỡng đếm "mỗi
giờ" của thống đốc và của thẻ (`nguongCho` 20 lượt, `day` 20.000) nhỏ theo 30 lần nên
không bao giờ chạm nữa — đo được thống đốc **ngừng xây hẳn** (94 → 94 nhà) và thẻ đầu
lùi từ giờ 1 tới giờ 23.

Làm thay: **thêm mức 30×** vào dải tốc độ, và mở ván ở **8×** thay vì 1×. Mọi thứ nhanh
đều nên cân bằng không đổi một chút nào — `sim:thu` vẫn ra đúng 89.232 chuyến, 94 → 102
nhà, 5 thẻ. `GAME_SPEC` mục 3 và `TECH_SPEC` sửa theo (hai file khoá, chủ dự án đã chốt).

## Vá thêm 10/09 — cối xay có cánh, bảng sự kiện gọn lại

Chủ dự án chơi tiếp: **59 fps · 3.253 sprite · 1 lệnh vẽ**, nhưng "tìm không thấy cối xay
gió" và "chữ góc trái dưới to quá che hết màn hình".

- **Cánh quạt**: thêm phép quay `rz` cho từng mảnh trong `ghep()` — quay quanh trục dựng
  màn hình, áp trước `ry`. Nợ kỹ thuật ghi chỗ này là đường cùng vì `ry` không dựng nổi
  cánh đứng; hoá ra chỉ cần thêm một phép xoay. Ba lần thử bỏ đi: cánh đặt thấp thì mái
  che hết, `Roof_FrontSupports` là nhiều mảnh rời nên quay ra mấy mẩu gỗ bay lơ lửng,
  cánh ngắn thì chìm trong lòng mái nón.
- **Bảng sự kiện**: ba dòng thay vì bốn, 42 % bề ngang thay vì 62 %, mỗi sự kiện một dòng
  cắt bằng `...`. Thêm `text-size-adjust: 100%` — Safari trên iPhone tự phóng chữ. Nút
  "Đo trần sprite" đẩy lên trên hàng tốc độ, trước đó hai cái chồng lên nhau.

## Vá thêm 10/09 (lần hai) — dùng model thật của KayKit

Chủ dự án: cánh quạt tự ghép "xấu quá", và "mấy phase trước bạn có đưa hình cối xay rất
đẹp". Nhớ đúng: mẻ Kenney/KayKit cũ (`tools/me/trung_co.json`) có `coi_xay_gio`,
`coi_xay_lon`, `gieng_lang` — dựng từ **KayKit Medieval Builder Pack**, gói vẫn nằm trong
`ASSET_CREDITS` suốt, chỉ vì mẻ cũ bỏ đi nên không ai nghĩ tới nữa.

Sáu toà nhà giờ lấy thẳng model thật: `mill` + `mill_blades` (cối xay gió có cánh),
`well` (giếng có mái), `mine` (hầm mỏ trong vách đá), `farm_plot` + `farm_wheat` (ruộng
lúa có hàng rào), `lumbermill` (xưởng cưa có đống gỗ), `market` (quầy chợ có xe).

Đánh đổi chủ dự án đã chốt sau khi xem ảnh: KayKit màu bệt, Quaternius có hoạ tiết — hai
phong cách không khớp tuyệt đối.

**Chủ dự án phê bình, đúng:** anh đã dặn từ đầu — tự tìm nguồn mở, tải về, tách kho lưu
trữ với kho vào game, và **dò kho trước rồi mới làm**. `TECH_SPEC` mục 3 thậm chí đã có
bảng gói tự tay ghi từ 06/09, dòng "KayKit Medieval Builder: … xưởng gỗ, mỏ, cối xay".
Không đọc, ngồi ghép tay năm lượt nướng.

Vá bằng cơ chế chứ không bằng lời hứa:

- `scripts/kho_asset.mjs` + `npm run kho` sinh **`docs/KHO_ASSET.md`**: tên thật của cả
  **1.855 model** trong `assets_source/`, grep một lệnh là ra. Bảng cũ trong `TECH_SPEC`
  ghi chung chung ("công trình nguyên khối 2×2") nên không grep được — đó là lỗ hổng.
- `CLAUDE.md` mục Quy ước thêm một dòng: **dò `KHO_ASSET.md` trước, cấm ghép tay khi kho
  có model sẵn**. CLAUDE.md đọc đầu mọi phiên nên không bỏ sót được như `TECH_SPEC` mục 3.
- Dò lại ngay bằng danh mục mới: `trai_linh` đổi từ `thap_canh` sang model `barracks` thật.
  Sáu sprite còn tự ghép (vườn nho, trại thú, lò nhỏ, lò lớn, nhà chài, công trường) đã
  grep — kho **không có** model tương ứng, nên ghép tay là đúng.

## Vá thêm 10/09 (lần ba) — thành phố lớn gấp đôi, và đường tới nhà mới

Chủ dự án: "vẫn chưa thấy cối xay gió, ruộng lúa, hầm mỏ, xưởng cưa". Đếm ra lý do: cả ván
chỉ có **3 cối xay · 2 xưởng cưa · 2 vườn nho · 5 ruộng**, lẫn giữa **760 vật trang trí**
trên bản đồ 96×96. Ở mức thu nhỏ nhất màn hình chỉ thấy 39 ô — gần như không bao giờ trúng.

Hai việc:

1. **Camera kéo tới nhà vừa mọc** sau khi bấm thẻ (`ThanhPho.layOVuaDung`). Bấm "xây hai
   cối xay" là màn hình trượt tới đó.
2. **Nhân đôi cả thành phố**: 94 → **188 nhà**, cối xay 3 → **6**. Nhân ĐỀU mọi loại nên
   tỉ lệ giữa các nhà không đổi — cân bằng giữ nguyên. Nhưng phải nhân theo cả bốn thứ
   khác, thiếu cái nào cũng vỡ (đo từng bước):
   - **Trần kho chung** (`wares.json > tran`) — không nhân thì kho đầy, cối xay đứng im.
   - **Trần người vác hàng** — không nhân thì chạm `tranGiao` 300, kho riêng ứ.
   - **Ngưỡng thẻ và ngưỡng thống đốc** — `ton lua_mi >= 760` vốn là 95 % trần cũ, với
     trần mới chỉ còn 47 %, thẻ hỏi sai lúc.
   - **`soKhoDau` = 4 kho ngay lúc mở ván** (mới, trong `walkers.json`) — một kho cho 188
     nhà thì đường quá dài, dây chuyền tắc ngay cả khi có thống đốc.

**×2,5 và ×3 đều HỎNG** — "mỏ đá kho đầy": bản đồ 96×96 chật, chuyến quá dài. Muốn đông
hơn nữa phải nới bản đồ, không phải nhân tiếp.

Số đo: **215.217 chuyến một giờ** (trước 89.232) · 188 → 201 nhà · 6 kho · đông nhất 655
người · 0 bỏ cuộc · **3.546 sprite ở 0,35×** (trần 5.000) · 1 lệnh vẽ.

`City.ts` chạm trần 300 dòng hai lần trong lúc sửa → tách `BangSo.ts` (hàm thuần dựng bảng số).

## Vá thêm 10/09 (lần bốn) — quy hoạch năm khu

Chủ dự án chơi tiếp: vẫn không tìm ra cối xay, và đề xuất ba việc. Cả ba đã làm.

**1. Bảng sự kiện ẩn sẵn**, nút `☰` góc trái dưới bật/tắt. Chữ 11px → 10px.

**2. Dải tốc độ** `0 · 1× · 5× · 10× · 20× · 30×`, mở ván ở 10×. Thêm **50× chỉ khi mở
bằng `?test=1`** — để thử game cho nhanh, bản chơi thật không có.

**3. Quy hoạch năm khu vòng đồng tâm** (`src/sim/city/QuyHoach.ts`), chủ dự án chốt bố cục:

| Khu | Bán kính Chebyshev | Có gì |
|---|---:|---|
| Đô thị | < 15 | Nhà dân, chợ, giếng, công trường |
| Sản xuất | 15–24 | Cối xay, lò bánh, lò ướp, xưởng rượu, xưởng dệt, lò gốm |
| Nông nghiệp | 25–34 | Ruộng lúa, vườn nho, trại thú, nhà chài, trại đốn gỗ |
| Công nghiệp | 35–42 | Sáu mỏ, lò mổ, lò nung, lò thép, lò rèn, xưởng vũ khí |
| Quân sự | ≥ 43 | Trại lính |

Khoảng cách đo bằng **Chebyshev** chứ không Euclid: lưới iso nghiêng 45° nên hình vuông
Chebyshev hiện ra màn thành hình **thoi** — đúng cái mắt đọc ra là "vòng trong, vòng ngoài".

**Nhà cùng loại đứng thành cụm**: mỗi loại bốc một hạt trong khu của nó, cả đàn xúm quanh
(`oGanHat`, toả ra từng vòng vuông). Tìm một cối xay là thấy cả sáu.

**Trang trí giảm nửa**: 760 → 381, và cây cối dồn ra rìa (`tuXa: 30`) thành rừng thay vì
rải khắp thành phố.

Hai chỗ đo mới lộ ra:

- `oTrongKhu` bốc ngẫu nhiên trên **cả** bản đồ thì khu đô thị (9 % diện tích) trượt chín
  lần trong mười → phải bốc trong **hộp bao** của khu.
- `soKhoDau` = 4 đã **bằng** trần kho cấp lý trưởng, thống đốc hết chỗ xây kho. Nới trần
  lên 7/9/11.

Số đo: **252.006 chuyến một giờ** (trước quy hoạch 215.217 — đường ngắn lại nên hàng chảy
nhanh hơn) · 188 → 197 nhà · 8 kho · đông nhất 638 người · 0 bỏ cuộc · **3.561 sprite ở
0,35×** · 1 lệnh vẽ.

Quy hoạch còn làm dây chuyền trơn tới mức **thống đốc không còn nhà nào phải xây** — chỉ
thêm kho cho đường bớt đông. Test "thành phố lớn lên" sửa theo: nhà **hoặc** kho.

## Vá thêm 10/09 (lần năm) — quy hoạch LẠI cho đúng nghĩa

Chủ dự án nhìn ảnh và gọi đúng tên: **"đây là dồn cục chứ không phải quy hoạch"**. Đúng —
bản trước gom mọi nhà cùng loại vào một cụm quanh một hạt, mái chồng mái thành một khối đỏ.
Anh bảo lên mạng học cách quy hoạch thật.

Tra được **đơn vị lân cận** (neighbourhood unit, Clarence Perry 1929 — nền của "thành phố
15 phút" ngày nay). Ba luật lấy nguyên:

1. **Phường tự cấp** — tiện ích ở **lõi** phường, đi bộ vài bước là tới. Không gom hết
   giếng cả thành phố vào một chỗ.
2. **Đường lớn chạy vòng quanh phường, không xuyên qua** — lưới đường sẵn có làm việc đó.
3. **Nhà rải đều, không dính nhau** — đặt xong một nhà thì bốn ô kề bị đánh dấu luôn.

Bản đồ 96 ô chia **4×4 = 16 phường** (mỗi phường 24 ô = ba khối đường). Chức năng từng
phường khai thẳng trong `data/thanh_pho_demo.json > phuong` — một bảng chữ nhật đọc được
bằng mắt, sửa bố cục không phải động tới code:

```
nông nghiệp · sản xuất  · sản xuất  · nông nghiệp
công nghiệp · ĐÔ THỊ    · ĐÔ THỊ    · sản xuất
sản xuất    · ĐÔ THỊ    · ĐÔ THỊ    · công nghiệp
nông nghiệp · công nghiệp· quân sự  · nông nghiệp
```

`veLoi` trong `buildings.json` chia hai loại: giếng và công trường về **lõi** phường, nhà ở
và nhà xưởng rải ra **vành ngoài**.

Một lỗi chỉ đo mới thấy: `diemTot` khởi `-1` trong khi điểm là khoảng cách lấy dấu âm nên
**luôn** âm — không ô nào vượt qua được, hàm báo "khu chật" ngay ở nhà đầu tiên.

Số đo: **313.370 chuyến một giờ** — cao nhất từ trước tới nay (dồn cục: 252.006; chưa quy
hoạch: 215.217). 188 → 196 nhà · 8 kho · đông nhất 658 người · 0 bỏ cuộc · **3.368 sprite
ở 0,35×** · 1 lệnh vẽ.

Nút **50× giữ luôn** trong bản chơi thật, không còn phải mở bằng `?test=1`.

## Vá thêm 10/09 (lần sáu) — bảng công trình, và cái thật sự che giếng

Chủ dự án gửi clip: **vẫn không thấy giếng, mỏ, xưởng, kho, gian hàng**. Bốn lần trước tôi
chữa sai chỗ — không phải chúng thiếu, mà **không có đường đến**. Lần này kiểm bằng số
thay vì đoán:

1. **Đối chiếu tên sprite với atlas đã nướng**: đủ cả 32 loại nhà và 31 vật trang trí.
   `datSprite` bỏ qua im lặng khi thiếu tên — nếu thiếu thì đây là chỗ chết câm.
2. **Đếm và in toạ độ**: 12 giếng, 6 cối xay, 12 mỏ, 18 quầy chợ, 13 kho — có đủ.
3. **Chụp đúng ô (34,33) ở 1,00×**: hai cái giếng hiện rõ. Chúng **vẫn luôn ở đó**.

Nhưng tìm ra một lỗi thật: **nhà trang trí 2 ô đứng sát nhà kinh tế 1 ô**. Hai bên có cùng
độ sâu vẽ (`a+b+2*o` bằng nhau) nên thứ tự bấp bênh, mà mái nhà trang trí cao gấp đôi —
giếng và cối xay bị mái đè lên, nhìn như không tồn tại. Vá: `sinhBanDo` chiếm cả **viền một
ô** quanh mỗi khối trang trí.

Và làm cái đáng ra phải làm từ đầu:

- **`src/ui/BangCongTrinh.ts`** — nút `⌂` mở danh sách công trình, mỗi dòng một loại kèm số
  lượng. **Bấm một dòng là camera bay tới**, bấm lại thì sang cái kế tiếp, xoay vòng. Sáu
  cái cối xay xem hết bằng sáu lần bấm.
- `?o=a,b` đặt camera lúc mở màn, `?bang=1` mở sẵn bảng — để máy ảo tự kiểm được thay vì
  đoán bằng mắt trên ảnh toàn cảnh.

Số đo: 315.692 chuyến một giờ · 188 → 197 nhà · 8 kho · 0 bỏ cuộc · 6/6 thước.

## Còn nợ

**Người vác hàng đi tay không** — chủ dự án nhận ra 09/09. Kit có thùng, bao, sọt gắn được
vào tay. Chốt để **Phase 10**, nướng một lần cùng bộ 8 hướng × 4 dáng.


## Vòng ba — đo được thủ phạm thật

Chủ dự án gửi clip rồi năm tấm ảnh: bấm năm dòng đầu bảng công trình, **không cái nào
hiện**. Bảng bay đúng toạ độ, sprite có trong atlas, vật thể có trong `banDo.vat` — vậy mà
màn hình trống. Ba vòng trước đều chữa nhầm chỗ. Vòng này đo bằng số:

```
o_px = 64 -> mot o cao 32 px tren man
nha_ngoi_do  236 px = 7,4 hang o      gieng     78 px = 2,4 hang o
thap_canh    285 px = 8,9 hang o      mo        96 px = 3,0 hang o
nha_nho_do   178 px = 5,6 hang o      coi_xay  151 px = 4,7 hang o
```

Ở góc chéo, cái đứng **trước** vẽ **đè** lên cái đứng sau. Nhà trang trí cao 7–9 hàng ô
nuốt trọn giếng cao 2,4 hàng đứng sau nó. Đếm ra: **26 trong 120 nhà kinh tế bị che quá
nửa**. Chúng luôn ở đó, chỉ là không bao giờ nhìn thấy.

Ba việc, làm cả ba:

1. **Bỏ 12 loại nhà trang trí** khỏi `data/thanh_pho_demo.json` — 381 → 224 vật. Chúng
   không có chức năng gì mà là thủ phạm cao nhất. Từ nay mọi mái nhà trên bản đồ đều là
   nhà **thật** của `src/sim/`.
2. **`src/render/VeCanh.ts` — mở lộ.** Đang soi một công trình thì mọi vật đứng trước nó
   **và trùm lên nó** bị bỏ qua một khung. Tính bằng hộp bao thật, không phải bán kính đoán.
3. **`src/ui/Ghim.ts` — ghim vàng.** Thẻ DOM nằm trên canvas nên không bao giờ bị che và
   không tốn sprite nào. Treo đúng mép trên sprite (lấy thẳng hộp bao `VeCanh` vừa đo —
   mỗi loại neo một kiểu `oy`, tự tính là ghim treo lệch, đã lệch một lần).

Thêm hai chỗ chỉnh vì đo mới thấy:

- Bay tới đặt công trình ở **38 %** chiều cao màn, không phải 72 %. Thẻ quyết định ăn 46 %
  màn từ dưới lên — ảnh chụp đầu tiên cho ra một vạt cỏ xanh, giếng nằm sau tấm thẻ.
- Ghim bị **kẹp vào trong khung**: nóc cối xay gió thò hẳn lên trên mép màn, không kẹp thì
  ghim treo ngoài màn đúng lúc cần nhất.

`CityScene.ts` chạm trần 300 dòng nên tách hai vòng vẽ ra `VeCanh.ts` (206 + 167 dòng).

Số đo: 6/6 thước · `sim:thu` ĐẠT 10 giờ · **3.343 sprite · 1 lệnh vẽ ở 0,35×** (trần 5.000).


## Vòng bốn — tìm ra nguyên nhân thật: service worker giữ ATLAS CŨ

Chủ dự án gửi bốn ảnh chụp iPhone thật, đã phóng to: **trống trơn**. Nhà dân, cây, người,
xe, thùng, hàng rào đều hiện — riêng giếng, cối xay, mỏ, xưởng, ruộng, lò, công trường
thì không. Đó là **đúng 12 sprite nướng ở Phase 6B**.

Chứng minh không đoán:

1. Chụp máy ảo **cùng khung iPhone cầm dọc, cùng góc bản đồ, cùng mức thu phóng** với ảnh
   của chủ dự án (`MAN=doc npm run chup:man`). Cây khô, xe kéo, thùng, hàng rào **trùng
   khít từng cái** — cùng một bản dữ liệu.
2. Nhưng ảnh của tôi có thêm cối xay, hai thửa ruộng vàng, nhà mái xanh. Của anh không.
3. Đối chiếu bố cục vật trang trí của bản cũ (commit `1262950`): **khác hẳn** — góc bản đồ
   bản cũ có 11 nhà trang trí. Vậy máy anh **đang chạy mã và dữ liệu MỚI**.
4. Mở `dist/sw.js` ra đọc danh sách nạp sẵn của workbox:

```
{url:"assets/atlas/trung_co_2_2x.json", revision: null}
```

**`revision: null`** — workbox coi mọi file trong `dist/assets/` là đã có băm nội dung
trong tên nên **không bao giờ tải lại**. Tên file atlas của ta thì **cố định**. Kết quả:
mã mới + dữ liệu mới + **atlas cũ, vĩnh viễn**. `atlas.co('gieng')` trả `false`,
`datSprite` bỏ qua im lặng, giếng biến mất mà không một dòng báo lỗi.

Đúng cái bẫy `vite.config.ts` đã ghi chú là mất một buổi sáng 08/09. Lần đó vá bằng
`skipWaiting`; lần này `skipWaiting` không cứu được vì lỗi nằm ở `revision: null`.

Vá ba lớp:

1. **`public/assets/atlas/` → `public/atlas/`.** Ra khỏi `assets/` thì workbox băm nội dung
   thật; đổi atlas là máy người chơi tải lại. Đổi đường dẫn cũng làm mục nhớ cũ thành vô
   dụng, nên máy đang kẹt tự thoát.
2. **`scripts/check_sw_atlas.mjs`**, chạy ngay trong `npm run build` (nên CI cũng chặn):
   file atlas nào trong `dist/sw.js` còn `revision: null` là **build hỏng**.
3. **`src/ui/BaoThieuHinh.ts`** — mở màn đối chiếu mọi tên sprite bản đồ sẽ hỏi với atlas
   đã nạp; thiếu cái nào thì **một dải đỏ trên đầu màn liệt kê ra**. Thêm một test đọc
   atlas ĐÃ NƯỚNG trong `public/atlas/` chứ không đọc mẹ.

Bài học: `datSprite` bỏ qua im lặng đã ăn mất **năm vòng đoán mò và gần trọn một phiên**.
Lỗi câm phải biến thành lỗi nói được, trước khi đi chữa cái gì khác.


## Vòng năm — 23 loại nhà thôi dùng chung năm cái hình

Chủ dự án xem xong bản vá và hỏi thẳng: *"sao các loại lò nhìn giống nhau thế. Các cái
loại trại, các loại xưởng các loại mỏ giống nhau hết hả."* Đúng — Phase 6B gộp 23 loại vào
5 hình vì kho chỉ có 15 công trình nguyên khối.

Dò lại đủ ba bước, lần này không bỏ bước nào:

1. `KHO_ASSET.md` — Builder Pack 15 công trình; Village MegaKit là kit **lắp ghép**;
   `tiles/hex` và `tiles/square` chỉ là ô đất. **Không đủ.**
2. `NGUON_MO.md` mục 2 chỉ sang KayKit và Kenney. Tra tiếp trên mạng.
3. **KayKit Medieval Hexagon Pack** — CC0, `License.txt` đọc thẳng, **cùng một hoạ sĩ** với
   gói đang dùng nên cùng phong cách. 135 công trình + 68 vật trang trí, mỗi công trình bốn
   màu. Đo trước khi tin: đứng rời trên `y = 0`, **không dính đế lục giác**, nướng thẳng
   được. Kho 1.855 → **2.781 model**.

**25 sprite mới**, không tự vẽ một nét nào:

- **Model riêng** — `blacksmith` (lò rèn) · `lumbermill` + lưỡi cưa (xưởng cưa) · `tavern`
  (xưởng rượu, nhà bia) · `archeryrange` + giá vũ khí (xưởng vũ khí) · `market` (xưởng dệt)
  · `barracks` (trại lính) · `home_B` (nhà dân).
- **Sáu hầm mỏ** — cùng model `mine`, khác **màu quặng** và khác **đồ chất quanh**: than
  đen + xe cút kít, muối trắng + bao, đất sét cam + vại, đá vôi kem + pallet, quặng xanh
  thép + cuốc, đá xám + đống đá.
- **Tám lò** — hai khuôn tường gạch cũ nhưng khác **cỡ** và khác **màu mái**. Lò lớn 224 px,
  lò nhỏ thu còn 173 px: ban đầu 219 so với 224, nhìn không ra khác nhau.
- **Ba trại thú** — thêm một cái **lán** vào mỗi trại. Bản đầu chỉ có bãi cỏ và hàng rào,
  nướng ra cao 58 px = 1,8 hàng ô, bé hơn một cái thùng rượu.

Dọn luôn **11 sprite nhà trang trí không ai dùng nữa** — atlas 2× vẫn 2 trang, trần 4.

Kho không có model lợn, gà, cừu — ghi vào `NGUON_MO.md` mục 8, chờ nguồn mới.

**Bắt được một lỗi tự gây ra sáng nay:** `check:credits` đang **chạy rỗng**. Nó quét
`public/assets/`, mà sáng nay chính tôi dời atlas về `public/atlas/` — script thấy thư mục
không tồn tại thì in "không có gì để kiểm" rồi **báo ĐẠT**. Sửa: thư mục biến mất thì báo
HỎNG, không báo ĐẠT.

Cũng tải sẵn **Kenney Fantasy Town Kit 2.0** (167 model CC0) theo yêu cầu chủ dự án — chưa
nướng, để dành.

Số đo: 6/6 thước · `sim:thu` ĐẠT · **3.343 sprite · 1 lệnh vẽ ở 0,35×** · atlas 3 trang/4.


## Vòng sáu — số phiên bản, và dò lại thì đúng là vẫn giống nhau

Chủ dự án: *"Vẫn thấy nhiều cái giống nhau ko khác gì. Ko biết có phải chưa cập nhật ko.
Gắn số phiên bản vào để dễ xác nhận."*

**Số phiên bản** (`scripts/ghi_phien_ban.mjs` → `src/PhienBan.ts`, sinh lúc build): in ngay
đầu thanh đo fps — `b83 · 10/09`. Dùng số đếm commit chứ không phải mã băm, để chủ dự án
đọc được và so được với con số tôi nói. CI build lại sau khi checkout nên số trên máy chủ
luôn đúng, kể cả khi bản trong git chậm một commit.

**Rồi dò lại — và anh đúng.** Xem sprite ở **đúng cỡ 1×** thay vì phóng to ba lần:
sáu cái lò + nhà chài là **bảy cái nhà tường gạch một khuôn**, chỉ khác màu mái. `lo_uop`
mái xanh và `nha_chai` mái xanh gần như không phân biệt được. Sáu mỏ cùng một khối đá.
Vòng năm đổi màu là chưa đủ — **phải khác DÁNG.**

Nướng thử toàn bộ model nguyên khối chưa dùng (36 cái) rồi nhìn, thay vì đoán. Tìm ra:
tháp canh đá tối, tháp tròn mái nón, tháp bát giác, giàn giáo, cối nước có bánh xe, rừng
cây, ba khối núi. Đủ để mỗi loại một dáng:

| Trước | Sau |
|---|---|
| 8 lò = 2 khuôn nhà gạch, khác màu mái | vòm tròn · tháp đá tối · tháp tròn mái nón · tháp bát giác trắng · nhà gạch lớn · nhà gạch nhỏ · nhà có mái hiên · giàn gỗ phơi |
| 6 mỏ = cùng một khối đá | mỗi mỏ một khối núi khác (`mountain_A/B/C` · `kk:mountain` · `rock_single_D` · vách trơn) |
| xưởng rượu = thùng rượu (trùng nhà bia) | **cối nước có bánh xe** ép nho |
| trại đốn gỗ = xưởng cưa | **rừng cây** + đống gỗ + lều |
| công trường = tường gạch xây dở | **giàn giáo thật** |
| nhà chài = nhà gạch mái xanh | **nhà gỗ nâu** + thùng + lưới |

**Bắt thêm một lỗi:** bỏ bớt sprite làm bản 2× gọn lại còn **một trang**, nhưng
`trung_co_2_2x_1.png` cũ vẫn nằm lại — **1,8 MB rác** vẫn được PWA tải về máy người chơi.
`nuong_sprite.mjs` giờ tự xoá trang thừa. Atlas 3 trang → **2 trang**.

Số đo: 6/6 thước · `sim:thu` ĐẠT · atlas 2 trang/4 · **0 loại nhà nào còn trùng dáng**.


## Vòng bảy — số phiên bản sai, không phải bản sai

Chủ dự án chụp màn: **`b1`**, nhưng trên màn là cối nước có bánh xe, thùng bia khổng lồ,
tháp mái nón, các mỏ khác dáng — **đúng bản mới**. Vậy con số sai chứ không phải bản sai.

Nguyên nhân: `.github/workflows/deploy.yml` dùng `actions/checkout@v5` **không khai
`fetch-depth`**, mà mặc định của nó là **tải đúng một commit** (shallow clone). Nên
`git rev-list --count HEAD` trên máy chủ trả về đúng **1**. Trên máy tôi có đủ lịch sử nên
ra `b87` — con số đẹp mà chỉ đúng ở một chỗ.

Vá bằng `fetch-depth: 0` thì phải sửa `.github/workflows/` — **file khoá**. Nên đổi cách
đánh số: **dùng NGÀY GIỜ của commit** (`git log -1 --format=%cI`), đọc được cả trong bản
tải nông, và vẫn so sánh được bằng mắt. Giờ lấy theo múi giờ Việt Nam cho khớp đồng hồ
trên iPhone.

Kiểm bằng cách **tự clone nông một commit** đúng như CI làm: `git clone --depth 1` →
`rev-list --count` = 1, nhưng ngày giờ vẫn ra đúng.

Bài học lặp lại lần thứ ba trong ngày: **đo trên máy mình không phải là đo.** Máy tôi có
đủ lịch sử git, máy chủ thì không; máy tôi có atlas mới, máy chủ thì giữ bản cũ; máy tôi
xem sprite phóng to ba lần, chủ dự án xem cỡ thật.
