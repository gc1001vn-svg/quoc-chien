# Thử 1 — hiệu ứng thành phố (30/09/2026)

Nguồn: `kho-game/docs/KY_NANG_TRANG_THAI.md` mục 8 · `kho-game/docs/DO_HOA.md` mục 3–4 ·
bảng thử https://claude.ai/artifact/GjetBjmjHyW6x6dejA1iGh (anh xem "khá ok"). Anh đồng ý làm
3 đợt ngày 30/09. Chỉ màn thành phố; trận, bản đồ không đụng.

## 1. Làm gì

| # | Việc | Chép từ bảng thử | Cờ tắt |
|---|---|---|---|
| 1 | Hậu kỳ: chỉnh màu + viền tối + bóng mây + tilt-shift nhẹ | `FS_CANH` (mây) + `FS_HAU` (màu, viền, tilt) gộp **một** shader | `?tat=hauky` · `?tat=tilt` |
| 2 | Khói bếp trên nhà dân đang có người | hạt kiểu 0 (tròn mềm) | `?tat=khoi` |
| 3 | Chim bay theo đàn + bóng chim dưới đất | hạt kiểu 2 (chim vỗ cánh) | `?tat=chim` |
| 4 | Icon "kho đầy" / "thiếu hàng vào" trên mái, chỉ hiện khi kéo dài | — (game-icons.net) | `?tat=icon` |

Nhiều cờ: `?tat=khoi,chim` · `?tat=het` = bản gốc. Tilt **tắt dần khi thu về `zoomMin`** (0,35×).

## 2. Gắn vào bộ vẽ (không thư viện ngoài)

- `src/render/HauKy.ts` (mới): FBO cỡ khung vẽ; `Gl` vẽ cảnh vào FBO → hạt vẽ chồng lên
  (cùng FBO, để màu/viền phủ cả khói) → một quad toàn màn ra màn hình.
- `src/render/Hat.ts` (mới): lô hạt riêng, hình sinh bằng số (không ảnh, **0 trang atlas**) +
  icon đọc từ một ảnh nhỏ 128×64 (2 icon SVG trình duyệt tự vẽ ra ảnh lúc mở màn).
- **Lệnh vẽ: cảnh 1 + hạt/icon 1 + hậu kỳ 1 = 3 ≤ 4.** Lúc đổi đời (sóng) vẫn 1 lô cảnh.
  Số lệnh vẽ trên nhãn fps cộng cả 3 — `check:tran` giữ trần.
- Atlas: giữ nguyên số trang (icon không vào atlas).
- Tilt-shift là phần đắt (đọc nhiều điểm ảnh): chỉ tính ở dải trên/dưới, 12 điểm thay 24.
  Máy ảo vẽ phần mềm nên **không đo được fps thật** — anh đo iPhone.
- Số chỉnh (độ mạnh màu, mây, tilt, nhịp khói, số chim, ngưỡng "kéo dài"): `data/hieu_ung.json`
  (luật cứng 2).

## 3. Icon nhà tắc — đọc từ mô phỏng

Bộ đếm hiện có (`City.ts` `tac`/`doi`) gom **theo loại nhà mỗi giờ**, không theo từng nhà.
Cần thêm vào `ThuNha` (`src/sim/city/Buildings.ts`) **hai số chỉ-đọc**: số nhịp liền tắc vì kho
đầy, số nhịp liền chờ hàng vào — tăng ở đúng chỗ đang gọi `bd.tac` / `bd.doi`, về 0 khi chạy
xong mẻ. **Không đổi nhánh nào, không đổi số nào của mô phỏng**; `ThanhPho` thêm một hàm
trả danh sách nhà để lớp vẽ đọc. Kiểm: `sim:van`, `sim:tran` ra y như trước (so file kết quả).

Hiện icon khi số nhịp liền ≥ ngưỡng trong JSON (đề xuất 50 nhịp = 5 giây game ở 1×); nhà chạy lại
thì tắt. Icon: `game-icons.net` — kho đầy `delapouite/cardboard-box` (hoặc `stack`),
thiếu hàng `delapouite/empty-wood-bucket`; CC-BY 3.0, ghi `docs/ASSET_CREDITS.md` lúc thêm.

## 4. Đo — xong khi

- `npm run do` xanh · `sim:van`, `sim:tran` y hệt trước.
- Test mới: nhà tắc quá ngưỡng thì có icon, chạy lại thì mất; `?tat=` tắt đúng từng thứ.
- Chụp máy ảo 3 ảnh (`?tat=het` · đủ hiệu ứng ở 1× · ở 0,35×) gửi anh; lệnh vẽ ≤ 4.
- Đẩy `main`, in số phiên bản; **anh đo fps iPhone** bản có và `?tat=het`.

## 5. Lùi

Tụt fps trên iPhone: tắt tilt trước (đắt nhất) → hạ độ phân giải FBO xuống ½ → tắt cả hậu kỳ.
Mọi thứ có cờ, không đụng atlas, không đụng mô phỏng ngoài hai số đếm → gỡ sạch được.

## 6. Không làm trong đợt này

Biến thể nhà, nền liền, địa hình (art bible bước 2–3) · đêm/lightmap, bloom, mưa, lá · trận
(Thử 2) · bất ổn, thẻ (Thử 3).
