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

---

## Phần sau cùng phiên 18/09

**Đồng bộ nốt hai repo còn lại.** `vsp-fleet-safety` (`--vsp`) và `tayvuc` giờ cũng
5 hook + `hook_chung` + thước `check_hook`. Số đo: vsp **6/6 mục đạt** · tayvuc
`npm run do` **mã thoát 0**. Cả bốn repo `check_hook` 5 hook, 0 lỗi.

Bắt được lỗi trong `cai_dat.mjs`: `tayvuc` có sẵn script `do` trong `package.json`
là chuỗi `npm run …`, không gọi `scripts/do.sh` — bản cũ chỉ nhìn `do.sh` nên tạo
thêm một lệnh đo thứ hai không ai gọi. Sửa gốc: xét cả hai trước khi tạo.

**Cắt kho ghi nhớ.** `du-an.md` 5.567 → 4.090 byte (trần 4.800). Mục "Giới hạn mạng
máy ảo" chuyển sang `ghi-nho/cong-cu/luat-chi-tiet.md`. Kiểm mất mát: đối chiếu 142
dòng cũ với cả kho, **0 dòng mất**.

**Không cắt `so-thich.md`** — đo trước, kết quả nói đừng cắt. Hook `nhac_kho` tra được
90% với luật có câu hỏi rõ, nhưng chỉ **30%** với luật chạy ngầm và **0%** với luật cần
ở lượt 0 (`UserPromptSubmit` chưa chạy). Bằng chứng lượt 0 lấy từ nhật ký phiên này.

**Ước token: cả kho một công thức `byte/3`.** Hiệu chuẩn bằng `repomix` trên 84 file
`src`+`tests`: thật 134.317 · `byte/3` 132.023 (−1,7%) · `ký tự/4` 98.721 (−26,5%).
Bỏ `ký tự/4`. `check_kho` in rõ ngưỡng là **byte**, không đổi ngưỡng.
Chốt: **không mở `api.anthropic.com`** để đo token thật — `byte/3` đủ dùng.
`ghi-nho/quyet-dinh/2026-09-18-uoc-token-bang-byte-3.md`.
