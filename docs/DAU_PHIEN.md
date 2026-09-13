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

## D. Chi phí token — phần riêng repo này

Dò `KHO_ASSET.md` phải dùng `grep -io ... | sort -u`, **cấm `grep -i` trần**: dòng dài
4.870 ký tự, trúng một dòng mất ~3.300 token thay vì ~180. Luật đầy đủ: `CLAUDE.md` mục
Quy ước.

## F. Dò asset — bước 1b, kho chung

Luật ba bước ở `CLAUDE.md` mục Quy ước. Riêng bước **1b**, giữa `KHO_ASSET.md` và
`NGUON_MO.md`:

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
