# Thước đo — Quốc Chiến

Luật chung nằm ở `cong-cu/thuoc_do.md` của repo `ghi-nho`. File này chỉ ghi thước riêng
của dự án: **ngưỡng ghi trước khi sửa**, không phải sửa xong mới nghĩ ra.

Một lệnh đo duy nhất: `npm run do` (tức `bash scripts/do.sh`).

| Đo cái gì | Lệnh | Ngưỡng đạt | Đo ở đâu |
|---|---|---|---|
| Lint | `npm run lint` | 0 lỗi | máy ảo được |
| Kiểu TypeScript | `npm run typecheck` | 0 lỗi | máy ảo được |
| Test | `npm test` | 0 lỗi | máy ảo được |
| Build | `npm run build` | chạy xong, `dist/` ≤ 95 MB | máy ảo được |
| Đường dẫn gốc | `npm run check:base` | khớp `BASE` trong `vite.config.ts` | máy ảo được |
| Bản quyền asset | `npm run check:credits` | mọi file `public/assets/` có trong `ASSET_CREDITS.md` | máy ảo được |
| **Trần sprite** | mở `?do=sprite` | ≥ 1.500 · **đo 06/09: 18.089** | **iPhone thật** — máy ảo vẽ bằng phần mềm, ra 30 fps giả |
| Lệnh vẽ mỗi khung | nhãn trên `?do=sprite` | ≤ 4 | máy ảo được |

## Chưa đo được

- **fps trên máy thật.** Máy ảo Claude vẽ bằng phần mềm, luôn kẹt 30 fps bất kể vẽ bao
  nhiêu — số đo ở đó vô nghĩa. Bắt buộc mở `?do=sprite` trên iPhone.
- **Nhiệt máy.** Tây Vực chết vì nóng sau 10-20 giây, không phải vì fps lúc đầu. Chưa có
  cách đo tự động; tạm thời hỏi chủ dự án "cầm 5 phút có nóng không".
