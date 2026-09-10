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

## Còn nợ

**Người vác hàng đi tay không** — chủ dự án nhận ra 09/09. Kit có thùng, bao, sọt gắn được
vào tay. Chốt để **Phase 10**, nướng một lần cùng bộ 8 hướng × 4 dáng.
