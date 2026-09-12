# ĐẦU PHIÊN — QUỐC CHIẾN

> Chạy hết bảng này **trước khi** vào Plan Mode. Không bỏ mục nào, không báo "xong" khi
> còn mục treo. Bảy bước chung cho mọi dự án nằm ở `so-thich.md` của kho `ghi-nho`;
> file này chỉ ghi phần **riêng repo quốc chiến**.

## A. Nạp bối cảnh — đọc HẾT, cấm cắt

```bash
cat docs/TIEN_DO.md
cat .claude/settings.json
```

**Cấm `head`, `tail`, `sed -n` ở bước này.** Khối `skillOverrides` nằm **cuối**
`settings.json`; `head -40` cắt mất nó thì phiên tưởng là chưa tắt skill nào.
Kho `ghi-nho`: theo đúng skill, `cat` cả ba file, cũng cấm cắt.

## B. Dựng lại máy ảo — container mới, mất sạch mỗi phiên

| Lệnh | Khi nào | Ghi chú |
|---|---|---|
| `npm ci` | **luôn luôn** | `node_modules` không bao giờ có sẵn |
| `npm run do` | **luôn luôn** | phải **6/6 thước** trước khi động vào code |
| `npm run tai:tatca` | chỉ khi phiên có **nướng sprite** | ~1 GB (**ước, chưa đo lại**), 9 gói itch + 2 gói Kenney + 6 hoạ tiết Poly Haven, chạy `npm run kho` ở cuối |

**Cỡ kho chỉ ghi ở đúng dòng trên** — `tests/TaiLieu.test.ts` giữ luật này. Trước 12/09
nó ghi hai nơi, hai số khác nhau (440 MB và 1 GB) và không ai biết cái nào đúng. Đo được
số thật thì sửa dòng này và bỏ chữ "ước".

`assets_source/` **không lên git** (đúng luật). Không nướng sprite thì đừng tải —
mất 5–10 phút và không dùng tới.

**Cấm chạy `npm run kho` khi kho chưa tải đủ** — nó ghi đè `docs/KHO_ASSET.md`.
Từ 11/09 `kho_asset.mjs` tự chặn khi số model tụt quá 20% so với bản đang có; ép ghi
đè phải `KHO_EP=1 npm run kho`, và chỉ làm khi biết chắc kho đã đủ.

## C. Git

```bash
git status && git log --oneline origin/main -1
```

Nhánh phải sạch và đã gộp `main` từ phiên trước. Còn commit chưa gộp thì gộp trước
khi làm việc mới.

## D. Chi phí token

- Đối chiếu danh sách skill harness in ra với `skillOverrides` trong `.claude/settings.json`.
  Lệch thì sửa `settings.json`, **đừng bảo chủ dự án vào claude.ai bấm tay** — anh làm
  trên iPhone và đường đó đã có sẵn từ 06/09.
- Dò `KHO_ASSET.md` phải dùng `grep -io ... | sort -u` (`CLAUDE.md` mục Quy ước).
  `grep -i` trần tốn gấp ~19 lần.

## E. Xác nhận phase trước

`docs/TIEN_DO.md` mục 3 là việc của chủ dự án. **Chưa có xác nhận trên iPhone thật thì
không mở phase mới** — hỏi anh trước, đừng tự cho là xong.

## F. Dò asset cho phase mới — luật ba bước

`CLAUDE.md` mục Quy ước. Không đi hết ba bước thì cấm tự vẽ, tự ghép.

**Từ 11/09 có thêm KHO CHUNG — dò ở bước 1b, giữa `KHO_ASSET.md` và `NGUON_MO.md`:**

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

## G. Plan Mode

Xong A–F mới lập kế hoạch, rồi chờ duyệt.
