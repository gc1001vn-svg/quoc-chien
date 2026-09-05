# QUỐC CHIẾN — tài liệu thiết kế

Ngày lập: 05/09/2026 · Chủ dự án: gc1001vn@gmail.com

## Đọc theo thứ tự nào

| File | Nội dung | Khi nào đọc |
|---|---|---|
| [`GAME_SPEC.md`](GAME_SPEC.md) | Thiết kế game — **nguồn sự thật**. Vòng lặp, ba lớp, kinh tế, quyết định, thời đại, thắng thua | Đầu tiên |
| [`TECH_SPEC.md`](TECH_SPEC.md) | Kỹ thuật — trần hiệu năng, nướng sprite, WebGL, iOS, cấu trúc thư mục | Trước khi viết code |
| [`KE_HOACH.md`](KE_HOACH.md) | 13 phase, mỗi phiên một phase. Đổi ý thì **thêm dòng vào cuối**, không viết lại | Đầu mỗi phiên |
| [`THAM_KHAO.md`](THAM_KHAO.md) | Tám game đã tra: học gì, và **luật bản quyền không được vi phạm** | Khi cần tra một cơ chế |

## Tóm tắt game trong năm dòng

1. Chiến thuật offline, chạy web, cài lên iPhone dạng PWA.
2. **Game tự xây, tự sản xuất, tự phát triển.** Người chơi **chỉ ra quyết định**.
3. Ba lớp: bản đồ chiến dịch (rẻ) · một thành phố isometric chi tiết (nặng) ·
   trận đánh xem được 30-60 giây (nhẹ).
4. Một ván đi suốt sáu thời đại: cổ đại → trung cổ → súng ống → công nghiệp → hiện đại
   → tương lai.
5. Đồ hoạ 2D isometric, sprite **nướng từ model 3D CC0** — cách Age of Empires 2,
   StarCraft, Zeus đã làm.

## Vì sao không tiếp Tây Vực

Tây Vực dừng 04/09/2026 ở 17 fps, máy nóng sau 10-20 giây. Gốc rễ: 3D nặng, và Claude
không đo được fps trên iPhone của chủ dự án. Chi tiết trong `docs/TIEN_DO.md` mục 1 của
Tây Vực. **Ba bài học đó là xương sống của thiết kế Quốc Chiến** — xem `TECH_SPEC.md` mục 1.

## Nguồn gốc thư mục này

Lập ở repo `tayvuc` phiên 05/09/2026 vì máy ảo phiên đó chỉ được đụng repo ấy.
Chép sang đây 05/09/2026, `CLAUDE_MOI.md` thành `CLAUDE.md` ở gốc repo.
