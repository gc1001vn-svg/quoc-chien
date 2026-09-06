# PHASE 2B — Đổi hẳn đồ hoạ sang Quaternius (06/09/2026)

Chủ dự án chê đồ hoạ đơn điệu, đưa hai ảnh mẫu (Heroes of History, Tam Quốc). Chốt
**giữ 2D**, đi đường A: nướng lại đẹp hơn từ model CC0. Rồi chốt tiếp **đổi hẳn** sang
Quaternius sau khi xem ảnh so sánh.

- **Ảnh Tam Quốc là 3D thật.** Đuổi theo nó là vứt gần hết phần vẽ — đúng thứ đã giết
  Tây Vực (43 phiên, 17 fps). Đã nói rõ, chủ dự án chốt giữ 2D. Lý do đầy đủ ở
  `ghi-nho/quyet-dinh/2026-09-06-do-hoa-di-duong-a.md`.
- **Khoảng cách với ảnh mẫu nằm ở 8 chỗ, chỉ 3 chỗ do asset**: hoạ tiết bề mặt · dáng
  công trình · cột mốc. Năm chỗ còn lại (bố cục, cao độ, mật độ, lớp không khí, sự sống)
  **không cần asset mới** — để phase sau.
- **Model Kenney không có toạ độ ảnh trải phẳng.** `roof-point.obj` chỉ có 5 toạ độ `vt`,
  cả 5 đều `u = 0.21875` — mọi đỉnh trỏ vào một cột điểm ảnh. Dán hoạ tiết theo cách
  thường là bất khả thi. Gỡ tạm bằng **chiếu ba phương** (chiếu theo cả ba trục rồi trộn
  theo hướng mặt), hai lần hỏng trước khi được: thiếu mipmap thì lấm tấm như nhiễu tivi;
  chia gradient cho `e = 0.01` tức nhân 100 thì pháp tuyến bị đè bẹp, đèn ra ngẫu nhiên.
- **Quaternius hơn hẳn, đo thật**: 672 toạ độ `vt` (Kenney 5) · 27 ảnh PBR 2048² (Kenney
  một ảnh 11 KB) · **có sẵn bản đồ pháp tuyến** · số mặt tương đương (342 vs 302). Có UV
  thật thì bỏ được chiếu ba phương.
- Máy nướng phải đổi từ **một ảnh cho cả sprite** sang **ảnh theo từng đỉnh**: ô cuối mỗi
  đỉnh mang chỉ số ảnh + 1, `trang_nuong.js` vẽ theo nhóm chỉ số. Kiểm không hỏng bằng
  cách nướng lại mẻ cũ ra atlas **giống hệt từng byte**.
- Hai cái bẫy của gói người khác: `map_Kd` là đường dẫn Windows tuyệt đối
  (`C:/Users/Usuario/...`) nên chỉ lấy tên file cuối; và gói khai
  `T_MetalOrnaments_BaseColor.png` mà **chỉ để nó ở `glTF/`**, không có trong `Textures/`
  → kit khai được nhiều thư mục, thiếu ảnh thì bỏ qua kèm cảnh báo chứ không vỡ cả mẻ.
- **Ô nền tự sinh** (mảnh `phang`): Quaternius không có ô cỏ/đất/sông, mà lấy ô nền của
  gói khác thì thước lưới lại lệch — đúng bẫy đã sập với KayKit ở Phase 1. Tự sinh thì ô
  luôn ra đúng `128×64` chuẩn 2:1. Kèm phát hiện: tấm phẳng vẫn sinh bóng đổ, nới hộp bao
  15% (ô ra 150 px thay vì 128) — sprite toàn mảnh phẳng phải **tắt bóng**.
- **Bốn lần sửa mới ra mặt đất liền.** Bài học: hoạ tiết Poly Haven **vốn đã lặp liền
  mạch**, mọi ô lấy đúng cùng một vùng thì hai ô kề nhau khớp hoàn hảo. Chính việc cố
  dịch hoạ tiết cho "đỡ lặp" đã **phá** sự khớp đó và sinh vệt sọc. Cộng `phang = 1.05`
  cho ô chồng mép ~3 điểm ảnh, xoá vệt khử răng cưa ở biên hình thoi.
- **Ba lần hỏng với cây.** Ảnh lá Quaternius rất tối (xanh 22-31/255) → cây ra khối đen;
  kéo sáng 2,6-3,0 thì quá tay, lá thành vàng chanh bệt (mức đúng 1,3-1,45);
  `Leaves_TwistedTree` là ảnh **51,7,7 — đỏ**, tác giả cố ý làm cây lá đỏ, màu nhân không
  cứu được vì kênh xanh chỉ có 7/255 → bỏ cây đỏ.
- Chốt của chủ dự án trong phiên: **mái cách B** (mái ngói + hai tấm bịt hồi) ·
  **sàn mặt phẳng liền**, không lưới ô · **cỏ đồng màu**, không chỗ đậm chỗ nhạt.
- Nguồn đã kiểm license và định dạng: Quaternius và KayKit **CC0 + có OBJ, dùng được**;
  OpenGameArt nhiều gói **chỉ có `.blend`**; Unknown Horizons **CC-BY-SA 3.0, CẤM**;
  `ToxSam/open-source-3D-assets` 991 model CC0 nhưng **chỉ GLB**, máy nướng chưa đọc được.
  `polyhaven.com` và `ambientcg.com` **mở được từ máy ảo** — kho hoạ tiết CC0.

Mẻ mới 22 sprite, **chưa vào `public/`** — game vẫn chạy mẻ Kenney cũ. Bước ráp vào là
phiên sau.
