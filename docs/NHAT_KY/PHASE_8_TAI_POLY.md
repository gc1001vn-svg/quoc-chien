# Phiên 15/09 (lần 2) — đo lại toàn bộ đường tải Poly Pizza

Không đụng màn hình game. Phiên đo, một dòng mã sửa.

## Chủ dự án nhớ nhầm, đã nói rõ

"Xưa vẫn tải mà" — **Poly Pizza chưa bao giờ tải được từ máy ảo**. Khoá API lấy đúng
15/09, `ASSET_CREDITS.md` ghi "Chưa model nào của Poly Pizza vào `public/atlas/`", commit
đầu tiên nhắc Poly Pizza là `b9a23a0` cùng ngày. Thứ "xưa vẫn tải" là Kenney · itch.io ·
Quaternius · Poly Haven — đo lại vẫn `200` cả ba.

## Lỗi thật tìm được: `mo:mang` chết ở container mới

`certutil: function failed: SEC_ERROR_BAD_DATABASE: security library: bad database.`
— `~/.pki/nssdb` **không tồn tại** ở container mới. Script bắt lỗi `certutil -L` rồi tưởng
là thiếu `libnss3-tools` nên đi `apt-get` và chết. Phiên trước tưởng xong vì kho NSS đã
được tạo tay lúc mò. Vá: `certutil -N --empty-password` trước khi nạp CA.

## Phân biệt hai loại chặn — luật đọc dấu vết

| Dấu vết | Nghĩa |
|---|---|
| `000` + `connect_rejected (organization policy)` | **allowlist môi trường** chặn, chủ dự án sửa được |
| `HTTP/2 403` + `server: cloudflare` + `cf-mitigated: challenge` | **đích từ chối**, request đã tới nơi |

`static.poly.pizza` thuộc loại thứ hai → thêm vào allowlist **không đổi gì**.
`api.icosa.gallery` `archive.org` `web.archive.org` thuộc loại thứ nhất.

## Đo lại, không thêm được gì mới

curl `403` hết: trần · full header trình duyệt · `--http1.1` · `.webp` · trang `/m/<id>`.
Chromium sau khi vá TLS: `kenney.nl` và `polyhaven.com` mở được, `poly.pizza` kẹt
`Just a moment...` 60 giây **dù đã có `cf_clearance@.poly.pizza`** — Cloudflare nhận IP
trung tâm dữ liệu. Đường tải khác trong API: `v1.1/download/<id>`,
`v1.1/model/<id>/download`, `v1.1/asset/<id>` đều `404 Not Found`. Host `cdn.` `files.`
`assets.poly.pizza` không tồn tại.

**Dừng lại là cố ý** — bước kế duy nhất là giả vân tay trình duyệt để lừa Cloudflare, tức
né kiểm soát truy cập của bên thứ ba. Không làm.

## Việc đã giao chủ dự án

Thêm `icosa.gallery` `*.icosa.gallery` `archive.org` `*.archive.org` vào **Allowed domains**
của môi trường. Icosa là kho lưu Google Poly; model `"Poly by Google"` trên Poly Pizza gốc
từ đó, tải qua Icosa không đụng Cloudflare. **Anh báo đã làm xong 15/09** — phiên sau đo.
