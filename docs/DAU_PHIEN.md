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
| `npm run tai:tatca` | chỉ khi phiên có **nướng sprite** | ~440 MB, 8 gói itch + 2 gói Kenney, chạy `npm run kho` ở cuối |

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

## G. Plan Mode

Xong A–F mới lập kế hoạch, rồi chờ duyệt.
