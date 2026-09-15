# Phiên 15/09 — bản duyệt Artifact + lệnh dò asset

**Không đụng màn hình game.** Game vẫn ở Phase 8A. Phiên này tra công cụ ngoài
(MCP · Agent SDK · repo asset) rồi làm hai món, đều là đồ nghề.

## Tra ngoài: MCP không phải thứ cần

Đo host 15/09 — thông: `api.polyhaven.com` `poly.pizza` `kenney.nl` `quaternius.com`
`opengameart.org` `itch.io` `pypi.org`. Chặn `000`: `sketchfab.com` `huggingface.co`
`fab.com`.

Loại MCP vì **schema nạp vào ngữ cảnh mỗi phiên dù không gọi lần nào**, mà chỗ đắt nhất
đã đo là số lượt gọi (400.323 tok/lượt), không phải cỡ file. `threenative-asset-mcp`:
40+ tool, **không ghi license**, và 2/6 nguồn chính (Fab, Sketchfab) đều `000`.
`blender-mcp` cần Blender + GUI — máy ảo không có. Mem0/Vertiso: `ghi-nho` đã làm việc đó
miễn phí, không đẩy hội thoại ra ngoài.

## Hai món đã làm

1. **`npm run duyet` + Artifact** — gỡ cái kẹt lớn nhất: máy ảo không mở được trang thật.
   Build `--base=./`, bỏ service worker, `xem.html` bọc iframe, tự đối chiếu trần Artifact.
   **15 file · 4,2 MB**, dưới trần xa. Chủ dự án bấm link xem game **không cần đẩy `main`**.
2. **`npm run do:asset <từ khoá>`** — chạy cả ba bước + Poly Haven + Poly Pizza trong một
   lệnh, có `tools/tu_dien_asset.json` dịch Việt→Anh. Chỉ in tên model, không in cả dòng.

## Thứ tìm ra nhờ lệnh mới, ngay lần chạy đầu

`npm run do:asset ga` → **`Chicken` nằm ở `quaternius/ultimate-monsters/Blob`** trong kho
chung. Nợ `trai_ga` treo từ 06/09 với kết luận "dò hết 11 gói, không gói nào có" — kết luận
đó **thiếu bước 1b**, không sai hẳn: 11 gói đã tải đúng là không có. Nhưng model này thuộc
gói **quái vật kiểu blob**, dáng khác `Pig`/`Sheep` đang dùng. Khớp phong cách không thì
**chưa đo** — chủ dự án quyết.

Poly Haven: dò 521 model CC0, **0 trúng gà**. Phân loại thật: `props 176 · nature 110 ·
industrial 97 · furniture 85 · containers 68` nhưng `structures` chỉ **26** →
**mạnh đồ dùng, yếu nhà**, không cứu được 24 dáng nhà thiếu của Phase 8B.

## Ba bẫy đã sập khi dựng, đều do đo

- **Khớp chuỗi con làm rác kết quả**: `hen` trúng `kitchen`, `ga` trúng `garage`. Nguồn xa
  nay khớp **trọn từ**; file kê nội bộ vẫn khớp chuỗi con vì tên kiểu `building_A`.
- **Từ tiếng Việt dịch được thì phải bỏ đi**, để lại là nó tự dò trúng bậy.
- **`.nojekyll` làm Artifact từ chối cả lần đăng** — đuôi file không ứng kiểu nội dung nào.

Một lỗi quy ước: có một lần sửa file bằng `python3` thay vì `Edit`, trái `CLAUDE.md`.
