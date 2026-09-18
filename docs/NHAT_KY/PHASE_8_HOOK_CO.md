# 18/09/2026 — cờ bật/tắt hook + chống mất chữ khi thoát

Không phải phase game. Phiên đồ nghề: đọc `affaan-m/ecc` (MIT, v2.2.1, 292 skill)
rồi lấy về hai cơ chế, bỏ phần còn lại.

## Làm gì

- **`scripts/hook_chung.mjs`** (mới, ở `ghi-nho/cong-cu/`, `cai_dat.mjs` chép sang):
  - `bat(ID, mức)` — cờ bật/tắt ba tầng: mặc định trong file → `.claude/hook.json`
    (lên git) → `.claude/hook_phien.txt` (gitignore, chết cùng máy ảo). Tầng hẹp thắng.
  - `thoat(ma, { ra, loi })` — chờ chữ ra hết mới `process.exit()`.
  - `cat_tran()` — trần 4.000 ký tự cho hook chèn ngữ cảnh.
- **`scripts/check_hook.mjs`** (mới) — thước thứ 10 trong `npm run do`. Bốn luật máy kiểm:
  fail-open · mã thoát chỉ `0`/`2` · cấm `console.*` · phải gọi `bat(ID, …)`.
- Cả năm hook nối vào `hook_chung`. **`.claude/settings.json` không đổi một byte** —
  cờ nằm trong script, không nằm ở dòng lệnh hook, nên không phải xin vé file khoá.
- `scripts/do.sh` thêm dòng `check:hook`.

## Số đo

| Đo | Số |
|---|---|
| `npm run do` | **10/10 thước đạt** |
| Trần một lần ghi rồi `exit()` | **146.176 byte**; gửi 147.456 → mất 1.280; gửi 1 MB → mất 902.400 |
| Sau khi sửa (`thoat()`) | gửi 4 MB → nhận đủ 4 MB |
| Output hook lớn nhất hiện nay | `nhac_kho` **973 byte** = 0,7% trần |
| Giá chạy 4 hook, cũ → mới | **202,8 ms → 209,1 ms** (+3%) |
| Khởi động Node, không bỏ được | 27,9 ms/lần |
| `check_hook` thử phá | bắt đủ 4/4 lỗi cố tình gieo |

## Bẫy đã đo, đừng thử lại

`export BIEN=x` trong một lệnh `Bash` **không tới được hook** — lệnh `Bash` sau đã
không thấy, mà hook còn do chính Claude Code spawn chứ không phải shell. Nên cờ tắt
hook giữa phiên **bắt buộc là file**, không phải biến môi trường như ECC làm.

Gộp nhiều hook vào một tiến trình (ECC làm, ~50–100 ms/hook): **không áp dụng được** —
năm hook nằm ở năm sự kiện khác nhau, mỗi sự kiện chỉ có đúng một hook.

## Còn nợ

`vsp-fleet-safety` và `tayvuc` vẫn bản hook cũ — chạy `cai_dat.mjs` ở hai repo đó.

Vì sao + đánh đổi: `ghi-nho/quyet-dinh/2026-09-18-co-bat-tat-hook-va-tran-ghi.md`.
Cách tắt hook: `ghi-nho/cong-cu/luat-chi-tiet.md` mục "Hook".
