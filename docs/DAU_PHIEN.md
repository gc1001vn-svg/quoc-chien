# ĐẦU PHIÊN — QUỐC CHIẾN

> **Bảy bước chung A–G ở `so-thich.md` của kho `ghi-nho`** — chạy theo bảng đó.
> File này chỉ ghi thứ **riêng repo này**: lệnh cụ thể và bẫy đã sập.
> Gộp 13/09: bốn mục cũ (git · xác nhận phase · Plan Mode · đối chiếu `skillOverrides`)
> **đã xoá khỏi đây** vì chép nguyên từ kho — sửa một nơi là lệch với nơi kia.

## A. Nạp bối cảnh — lệnh của repo này

```bash
cat docs/TIEN_DO.md
cat .claude/settings.json
```

**Cấm cắt.** `skillOverrides` nằm **cuối** `settings.json`; `head -40` cắt mất nó thì phiên
tưởng chưa tắt skill nào.

## B. Dựng lại máy ảo — container mới, mất sạch mỗi phiên

| Lệnh | Khi nào | Ghi chú |
|---|---|---|
| `npm ci` | **luôn luôn** | `node_modules` không bao giờ có sẵn |
| `npm run do` | **luôn luôn** | phải **đủ thước** trước khi động vào code — đừng chép số vào đây, lệnh in ra |
| `npm run tai:tatca` | chỉ khi phiên có **nướng sprite** | ~1 GB (**ước, chưa đo lại**), 9 gói itch + 2 gói Kenney + 6 hoạ tiết Poly Haven, chạy `npm run kho` ở cuối |

**Cỡ kho chỉ ghi ở đúng dòng trên** — `tests/TaiLieu.test.ts` giữ luật này. Trước 12/09
nó ghi hai nơi, hai số khác nhau (440 MB và 1 GB) và không ai biết cái nào đúng. Đo được
số thật thì sửa dòng này và bỏ chữ "ước".

`assets_source/` **không lên git** (đúng luật). Không nướng sprite thì đừng tải —
mất 5–10 phút và không dùng tới.

**Cấm chạy `npm run kho` khi kho chưa tải đủ** — nó ghi đè `docs/KHO_ASSET.md`.
Từ 11/09 `kho_asset.mjs` tự chặn khi số model tụt quá 20% so với bản đang có; ép ghi
đè phải `KHO_EP=1 npm run kho`, và chỉ làm khi biết chắc kho đã đủ.

## D. Chi phí token — phần riêng repo này

Dò `KHO_ASSET.md` phải dùng `grep -io ... | sort -u`, **cấm `grep -i` trần**: dòng dài
4.870 ký tự, trúng một dòng mất ~3.300 token thay vì ~180. Luật đầy đủ: `CLAUDE.md` mục
Quy ước.

## F. Dò asset — một lệnh chạy cả ba bước

Luật ba bước ở `CLAUDE.md` mục Quy ước. **Từ 15/09 không grep tay nữa:**

```bash
npm run do:asset ga            # tiếng Việt cũng được, có từ điển dịch sẵn
npm run do:asset hien_dai nha
```

Nó chạy `KHO_ASSET.md` → `KHO_CHUNG.md` → `NGUON_MO.md`, cộng **Poly Haven**
(521 model, toàn bộ CC0, API mở không cần khoá) và **Poly Pizza** (10.400+ model,
chỉ chạy khi có biến môi trường `POLY_PIZZA_KEY`). Chỉ in **tên model** trúng, không in
cả dòng — chính là bẫy token ở mục D.

**Dò hụt thì thêm từ vào `tools/tu_dien_asset.json`, đừng sửa mã nguồn.** Ngày 15/09
`trai_ga` dò lại bằng lệnh này ra `Chicken` ở kho chung, sau khi sáu phiên trước kết luận
"không gói nào có" — vì các phiên đó **quên bước 1b**.

Cách grep tay bước **1b**, khi cần tra thứ lệnh trên không phủ:

```bash
grep -io '[a-z0-9_]*<từ khoá>[a-z0-9_]*' docs/KHO_CHUNG.md | sort -u
```

`docs/KHO_CHUNG.md` là bản kê **model máy nướng đọc được** trong kho dùng chung (số thật
ở **dòng cuối** chính file đó — đừng nhớ số, đừng chép về đây) —
`assets_source/` nằm trong git của repo `tayvuc` (luật hai kho, `tayvuc/CLAUDE.md` mục
Asset). File kê **lên git** nên dò được mọi phiên, **không phải clone 326 MB**.

Trúng rồi mới lấy model thật:

```bash
git clone --depth 1 https://github.com/gc1001vn-svg/tayvuc /home/user/tayvuc
npm run kho:lay quaternius/medieval-village-megakit
```

**Kho chung giữ gói ĐÃ LỌC** — phần lớn chỉ còn `glTF/`, không có `OBJ/`. Các mẻ hiện tại
trỏ vào thư mục OBJ nên **không thay thế được**; kho chung để **tìm model mới**, và mẻ mới
thì trỏ thẳng vào glTF. **Máy nướng đọc được cả ba: `.obj` · `.gltf` · `.glb`** —
`.glb` mở từ 11/09 (`tools/nuong_sprite.mjs`, đo 120/120 file, 0 hỏng), kit khai
`"loai": "glb"` là nướng được. **`.fbx` thì chưa.**

> Dòng trên từng ghi ngược lại — "chưa đọc được `.glb`" — và sai suốt từ 11/09. File này
> đọc mỗi đầu phiên nên nó dạy sai ngay từ bước đầu, làm phiên sau bỏ qua phần `.glb` của
> kho chung. Sửa 12/09; `tests/TaiLieu.test.ts` giữ cho khỏi tái phát.

Tải gói mới từ itch xong chạy `npm run kho`; lấy từ kho chung xong chạy `npm run kho:chung`
(chỉ khi kho chung có thay đổi).

## G. Bản duyệt — cho chủ dự án xem game mà không cần đẩy `main`

Máy ảo **không mở được trang thật** (`github.io` và mọi hosting đều `000`). Trước 15/09
mọi vòng duyệt đều phải đẩy `main`, chờ CI, rồi nhờ chủ dự án chụp màn hình.

```bash
npm run duyet
```

Build lại với `--base=./`, bỏ service worker, gói vào `.duyet/` kèm `xem.html` bọc iframe.
Rồi **đăng bằng công cụ Artifact** — chủ dự án bấm link là mở game thật trên iPhone.

Ba chỗ dễ sập, đã ghi đủ trong đầu `scripts/duyet.mjs`:

- **Đừng đẩy thẳng `dist/`** — nó viết cứng `/quoc-chien/`, đăng lên là 404 sạch.
- **Đừng đăng thẳng một file HTML đủ đầu đủ đuôi** — Artifact tự bọc nó vào khung
  `<!doctype html>` của nó. Phải qua `xem.html` + iframe.
- **`.nojekyll` phải bỏ** — Artifact từ chối đuôi file không ứng với kiểu nội dung nào.

Lệnh tự đối chiếu trần Artifact (16 MB trang · 15 MB mỗi file nhị phân · 64 MB · 255 file)
và **thoát mã 1** khi vượt. Đo 15/09: **15 file · 4,2 MB**.

**Bản duyệt KHÔNG thay `main`.** Bản thật vẫn là GitHub Pages; `.duyet/` không lên git.

### Poly Pizza — hình dạng dữ liệu, đo 15/09

Khoá API đã có (chủ dự án lấy 15/09). **Không bao giờ vào git** — repo này Public.
Hai đường cấp khoá, `do_asset.mjs` chịu được cả hai:

- **`POLY_PIZZA_KEY`** — biến môi trường, file tự đặt header `x-auth-token`.
- **API credential của môi trường đám mây** — proxy gắn header **sau khi request rời máy ảo**,
  khoá không bao giờ vào phiên. An toàn hơn. Đặt ở `claude.ai/code` → bộ chọn môi trường →
  **Update cloud environment** → **API credentials** → host `api.poly.pizza`, header
  `x-auth-token`, **xoá ô Prefix**.

Vì đường thứ hai **không để lại dấu vết nào trong phiên**, lệnh luôn gọi thử rồi mới kết
luận — gặp `HTTP 401` mới báo là chưa có khoá. Đừng "tối ưu" thành kiểm biến môi trường
trước rồi bỏ qua: làm vậy là mù với đường an toàn hơn.

Biến môi trường chỉ áp cho **phiên mở sau khi đặt**; phiên đang chạy giữ giá trị cũ.

Trả về khoá **PascalCase, có cả khoá chứa dấu cách**: `Title` · `Licence` · `Download`
(luôn là **`.glb`** — máy nướng đọc được) · `Category` · `Tri Count` · `Attribution` ·
`Creator.Username`. Bọc ngoài là `{ total, results }` — **`results` viết thường**, lệch với
các khoá bên trong. Viết `j.Results` là ra mảng rỗng mà không báo lỗi.

Đo 16 từ khoá loại nhà: **127 dáng `Buildings` duy nhất · 103 dáng ≤ 8.000 tam · 52 CC0 ·
0 model CC-BY-SA**. Game cần 32 loại nhà → **thừa model, cái thiếu là sự đồng nhất phong cách.**

**ToS của họ buộc ghi công Poly Pizza kèm link**, tách khỏi license từng model — CC0 vẫn
phải ghi. Chỗ ghi: `docs/ASSET_CREDITS.md` (**file khoá**, hỏi chủ dự án trước khi sửa).
