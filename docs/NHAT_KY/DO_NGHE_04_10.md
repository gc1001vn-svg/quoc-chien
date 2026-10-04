# Đồ nghề 04/10 (lần 35) — đo thật 11 ý học từ đợt tra thứ 5, làm 3, sửa 3 lỗi giao diện

Anh giao 04/10: "Kiếm lại từng cái đo thực tế. Hữu ích thì làm luôn." Ý gốc: kho `ghi-nho`,
`quyet-dinh/2026-10-04-hoc-tu-dot-5-doi-chieu-may.md`. Không đổi luật chơi, không đổi số `data/`.

- **Máy soi giao diện `npm run soi:giao-dien`** (ý từ evondevKit `probe.mjs`, MIT) — nằm trong `npm run do`, ~20 s.
  4 màn × 2 khổ iPhone (dọc 393×852, ngang 874×402): trang cuộn, nút ngoài màn, nút bị đè, nút chồng nút, nhãn nút
  xuống dòng, chữ bị giấu, chữ bị nút đè, nút khuất trong khung cuộn. Báo lỗi thì chụp kèm ảnh; `CHUP=1` chụp cả khi sạch.
  **Bắt lại được lỗi khung bản duyệt 26/09** (`PHASE_10B`): khung cũ dư 17 px ở khổ dọc, khung hiện tại sạch.
  Lần đầu 27 báo, phần lớn nhầm (thẻ quyết định là tấm chắn có ý; nhãn tên tỉnh trôi theo bản đồ) → đã loại.
- **3 lỗi thật máy bắt, đã sửa ở `src/style.css`** (ảnh trước/sau đã xem): (1) bản đồ tỉnh dọc: "Về thành phố" chồng
  "Xem trận" 11 px; (2) màn trận dọc: cùng cặp đó + hộp dự đoán bị đè — gốc: màn ≤700 px dời nút đầu xuống 92 px mà
  quên dời cả cột; (3) thành phố ngang: thẻ quyết định cao ~185 px, lựa chọn thứ ba khuất hẳn → xếp ba lựa chọn một hàng.
- **Sửa `tools/lib/cdp.mjs`: hạn chờ 120 s không huỷ khi đã có trả lời** → mọi công cụ CDP chờ 2 phút mới thoát.
  `khoi:dong` 121 → 4,5 s · `chup_man` 124 → 5,6 s · **`npm run do` 192 → 76 s** (đã gồm máy soi mới).
- **`npm run quay`** (ý từ godogen): clip MP4 15 giây, H.264. Đo DPR 1: trận 60 khung/s, thành phố 18 khung/s, 150–400 KB.
  Thành phố tĩnh thì clip không hơn ảnh; đáng dùng cho trận, hiệu ứng, hoạt cảnh xây nhà (bước kế hoạch kế tiếp).
- **Đo rồi KHÔNG làm:** chụp theo cờ "đã vẽ" (game sẵn sàng 0,3 s sau canvas, chờ cứng 2,5 s đã dư — chậm thật là
  lỗi hạn chờ ở trên) · Playwright CLI thay MCP (cùng kịch bản 3.880 so 3.645 ký tự, ngang nhau) · luật tra
  `node_modules` (0 sự cố từ Phase 0) · bảng lý lẽ đã bác (không có ca đề xuất lại sau khi ghi) · nhãn "đã chơi thử"
  cho 1.066 số cân bằng (gần như chưa số nào có xác nhận để điền).
- **Báo anh quyết:** 2 hàm chết (`datMotNha` `src/sim/city/BanDo.ts:87`, `xaVien` `src/sim/city/Nen.ts:126`, ~25 dòng,
  người gọi cuối bỏ 10/09). Đo bằng máy thay `/ponytail-audit`: không script mồ côi, 0 thư viện chạy thật.
- **Agent con theo model** (3 agent nhỏ, chạy lần lượt): khởi động 41–52 nghìn token mỗi agent bất kể model; theo bảng giá
  ước Opus ~$0,40 · Sonnet ~$0,21 · Haiku ~$0,09. Sonnet đọc cache cùng giá Opus ($0,20/triệu). Ghi kho.
