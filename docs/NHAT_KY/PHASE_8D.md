# PHASE 8D — mở đường lên đời 4 và 5 (23/09/2026)

Chủ dự án chốt 23/09: 8D ngắn, phiên sau Phase 9 trận đánh đúng `KE_HOACH.md`.
Kế hoạch: `docs/ke-hoach/2026-09-23-phase-8d-len-doi.md`.

- **Gốc chặn không phải số, mà là luật.** `Governor` chỉ xây nhà **làm ra** món đang thiếu,
  không gì xây thêm nhà **tiêu thụ** → nhu cầu đứng yên từ bản đồ đầu, thành phố cân bằng
  ở 241. Hạ `soNha` chỉ che bệnh.
- **Luật mới "dân kéo về":** `gioNoDu` (3) giờ liền không thiếu món nào → xây một nhà trong
  `nhaDanMoi` (`nha_dan`). Hai số ở `data/policy.json`. Thêm miệng ăn → lại thiếu → lại xây
  nhà sản xuất. Test viết trước, đỏ 2 ca rồi mới sửa.
- **16 công nghệ mới** (đời 4: 130–170 điểm, đời 5: 185–230), chỉ `noiTran` — tổng
  `doiNguong` của cây đã chạm đáy luật `_doiNguong` (−12 / −60). `moThe: []`, thẻ mới để sau.
- **`len` đời 4 → 5 = 30 công nghệ + 330 công trình.** Đời 5 → 6 giữ `null` (Phase 12).
- `sim:congnghe` nhận `-- <giờ> <đời>`, in thêm đỉnh walker; mặc định đòi đời 4 / 120 giờ.
- **Số đo (sim:congnghe, hạt giống cố định):** 120 giờ → đời 4 ở giờ **109**, 288 nhà;
  240 giờ → đời 5 ở giờ **212**, 380 nhà, 32/40 công nghệ. Walker đỉnh **657** / trần 1.200.
  Trước 8D: kẹt đời 3, 241 nhà. `sim:thu` ĐẠT.
- **Chưa đo trên máy thật:** thành phố to hơn ~55 % → fps iPhone cần anh đo lại.

## Phụ lục 24/09 — sửa nhịp lên đời (chủ dự án báo: 50× hơn 15 phút chưa lên Trung cổ)

- **Không phải lỗi code, là nhịp.** 1 giờ game = 72 giây thật ở 50×; lên đời 2 cần 20 giờ
  game = 24 phút (bản trước 8D: 21 giờ). Vòng bắt: `npm run sim:congnghe -- 12 2` → HONG.
- Nhân đôi nghiên cứu (`coBan` 3→6, `moiNhaMotDiem` 30→15) thì cái chặn chuyển sang số nhà
  (199/200 ở giờ 12) → hạ `soNha` đời 1 200→195. Nay đời 2 ở **giờ 11 (~13 phút)**, đời 3
  giờ 45, đời 4 giờ 88.

## Phụ lục 24/09 (lần 2) — thẻ chính sách "ô trống mà không lắp được"

- **Vòng bắt:** Chromium thật (`?bang=meta`, 50×, tự trả lời thẻ quyết định): thẻ ĐẦU lắp
  được. Test đơn vị: lắp thẻ thứ HAI vào ô trống ngay sau → `false`. Gốc: `BoChinhSach.lap`
  bắt chờ `gioChoDoiThe` cả khi ô trống — trái chính ghi chú `_gioChoDoiThe` ("ĐỔI thẻ
  xong mới chờ"). Test cũ ở `MetaEureka.test.ts` khẳng định đúng hành vi sai đó → sửa test.
- Nay: ô trống lắp ngay; thay hay gỡ thẻ đang lắp vẫn chờ 8 giờ. Nhịp đổi theo: đời 2 giờ
  11, đời 3 giờ 41, đời 4 giờ **70** (trước 88).
- **Nhà không đổi khi lên Trung cổ: đúng thiết kế hiện tại, chưa phải lỗi** — đời 1–4 cùng
  mẻ `trung_co_2` (`balance.json > _me`). Mẻ riêng cho cổ đại / cận đại là Phase 12.
