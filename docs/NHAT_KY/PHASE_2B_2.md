# PHASE 2B (tiếp) — mẻ Quaternius vào game thật (07/09/2026)

Chủ dự án chốt: làm nhóm 1 trước (sửa nhà + chiếm nhiều ô + **ráp vào game**), xong mới
tới nhóm 2 (thêm sprite). Cho phép sửa hai file khoá `TECH_SPEC.md` và `ASSET_CREDITS.md`.

- **Nhà 2×2 lệch nửa ô.** Trong `ghep()` của máy nướng, `x`/`z` cộng **sau** `ti_le` nên
  tính bằng ô lưới; nhà đặt mảnh ở ±1,0 nên trải −1…+1 quanh **tâm ô**. Dịch **+0,5** cả
  hai trục mới trải đúng ô `(a,b)`→`(a+1,b+1)`. Không phát hiện chỗ này thì khai `"o": 2`
  vẫn ra nhà chồng nhau.
- **Xếp theo góc trước**, không theo ô neo: công trình 2×2 neo ở ô sau nhất của nó, lấy ô
  neo mà xếp thì nó vẽ trước cả thứ đứng cạnh và bị đè.
- **Ba lỗi hình của mẻ, phải nướng ra ảnh mới thấy**, đọc số không thấy: mái `2x1` của nhà
  nhỏ hẹp hơn thân nhà nên tường chọc lên; `nha_dai` đeo mái `4x6` dài hơn thân một ô rưỡi;
  mọi mái neo ở `y = 1,5` trong khi đỉnh tường ở **1,56**.
- **Lỗi nặng nhất cả phiên: máy nướng đặt cứng `alpha = 1.0`** — bỏ hẳn kênh trong suốt.
  Cây Quaternius làm bằng **tấm lá có alpha**, nên mỗi tấm vẽ ra nguyên hình chữ nhật, phần
  lẽ ra thủng hiện màu nền tối của chính ảnh → cây thành cục đen lởm chởm. **Đó mới là lý do
  thật của "cây ra khối đen" ghi ở `PHASE_2B.md`** — không phải do màu, và ba vòng chỉnh màu
  hôm ấy chữa nhầm bệnh. Thêm `discard` khi `alpha < 0.5` là cây ra hình cây ngay.
- **Đo thật ảnh gốc thay vì đoán.** Viết bộ giải PNG bằng `zlib` có sẵn của Node.
  Ngói 178,84,48 (kéo được sang nâu, lam, ô liu). **Mọi ảnh lá đều có kênh lam = 0**:
  sồi 56,78,0 · thông 28,48,0 · cây vặn 95,13,13. Nên lá phải **giảm** chứ không tăng —
  kéo sáng là ra vàng chanh. Tôi đã sập đúng cái bẫy đó một lần trong phiên rồi mới đo.
- **Mái "xám" nướng ra lam sẫm.** Nhân không khử được bão hoà. Gọi đúng tên: `nha_ngoi_lam`.
- **Thêm `nhu` vào mẻ**: biến thể nhà chỉ khác màu mái mà mỗi cái 17 mảnh; khai
  `{"nhu": …, "mau_vl": …, "xoay": 90}` thì còn ba dòng. `xoay` đổi hướng nóc — nhìn từ
  trên xuống là một kiểu nhà khác hẳn.
- **Ten mẻ chuyển vào `data/`** thay vì chép ở hai file `.ts` — game và trang đo fps giờ
  không thể lệch mẻ nhau.
- **Gói Farm Buildings: tải, nướng, nhìn, rồi bỏ.** Có đúng `Windmill` `Well` `Barn` `Silo`
  đang thiếu, nhưng nướng ra là **nông trại Mỹ thế kỷ 19** — kho thóc đỏ mái tôn, silo bê
  tông, cối xay bơm nước khung thép — lại còn màu bệt không hoạ tiết.
  **`Ultimate Modular Ruins` không có trên itch của Quaternius**, đã liệt kê đủ 30 gói.
- **Fantasy Props MegaKit thì khớp**: cùng hệ hoạ tiết `MI_Trim` với Medieval Village.
  Thêm 9 đồ của làng + ô nền ruộng.

**Kết quả**: 38 sprite, 1 trang atlas ở 1× · 2 trang ở 2×, chỗ đông nhất 1.181 sprite
(trần 1.500), 6/6 thước đạt. Mẻ Kenney cũ xoá khỏi `public/`, bớt 5,0 MB PWA.
**Chưa xác nhận trên iPhone thật.**
