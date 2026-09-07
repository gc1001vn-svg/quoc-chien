# Ý TƯỞNG CHUỖI — ĐỂ DÀNH

> Chủ dự án gửi một danh sách chuỗi sản xuất ngày 07/09/2026. Phần lắp được đã vào
> `data/` ngay. Phần còn lại nằm đây kèm **lý do hoãn** và **phase sẽ làm** — để khỏi mất,
> và để khỏi bàn lại từ đầu.
>
> Chỉ **thêm**, không xoá. Làm xong một dòng thì ghi "ĐÃ LÀM + phase".

## Đã lấy (07/09, Phase 3)

| Ý | Làm thành gì |
|---|---|
| Bột mì **+ nước** → bánh mì | `lo_banh` ăn thêm `nuoc` |
| Mỗi lò phải đốt cái gì đó | `lo_banh` ăn thêm `go_tho` (củi) — buộc giữ rừng, không chặt hết đầu ván |
| Cá tươi → **ướp muối** → cá muối | `lo_uop` mới; muối trước chỉ dùng cho lò mổ |
| Quặng → **thép thỏi** → rèn | `lo_thep` chen giữa `lo_nung` và `lo_ren`/`xuong_vu_khi` |
| Đá vôi → lò nung + than → **vôi sống** | `mo_da_voi` + `lo_voi`, công trường ăn vôi |

## Hoãn — chờ phase có cơ chế đỡ được

| Ý | Vì sao hoãn | Phase |
|---|---|---|
| Thảo mộc → thuốc băng bó | Trận đánh là **kịch bản tính sẵn**, chưa có máu để hồi | 9 |
| Ngựa chiến, yên cương, giáp da kỵ binh | Chưa có binh chủng nào cả | 9–10 |
| Cung composite (gỗ dẻo), mũi tên đá lửa | `vu_khi` đang gộp chung một món; tách khi có bảng giáp × đạn | 9 |
| Dây thừng (gai dầu) cho máy bắn đá | Máy bắn đá là vũ khí công thành | 9 |
| Vải bạt / lều trại | Cần khái niệm "quân đóng ở đâu" | 7 |
| Lụa → gấm vóc, ngọc → trang sức | Cần **vàng, thuế, thương mại** — chưa có đồng nào trong game | 5–6 |
| Xi măng → tường thành chống pháo | Tường thành thuộc lớp chiến dịch | 7 |
| Lưu huỳnh + diêm tiêu + than → thuốc súng → đại bác | **Sai thời đại.** Trung cổ chưa có thuốc súng | 8 hoặc 12 |
| Đồng + thiếc → đồng thau, chọn "thảm quân đồng thau" vs "tinh binh thép" | Ý hay nhất trong danh sách. Cần **thống đốc biết chọn sản xuất gì** (Phase 5) và đúng ra là **thời cổ đại** (Phase 12) | 5 + 12 |
| Bò → thịt bò + sữa | Trùng chức năng xúc xích và gia cầm; lò mổ đã có hai đầu ra, thêm nữa là thêm ràng buộc tỉ lệ | 8 (bậc nhà dân cao) |
| Mật ong → rượu mật ong, đường → mứt | Dân đã có bia và rượu nho; thêm chỉ để dài danh sách | — |
| Mỡ lợn → xà phòng / mỡ bôi trơn | Cần cơ chế **dịch bệnh** và **tốc độ xưởng** chưa có. Và lò mổ sẽ thành **ba đầu ra** — tỉ lệ phải khớp cả ba, dễ vỡ (đã vỡ một lần với hai đầu ra) | 6+ |
| ~~Thức ăn **hao hụt / thối rữa** theo thời gian~~ | **ĐÃ LÀM 07/09, Phase 3.** Trường `hao` trong `wares.json`, `City.hong()` chạy mỗi 60 nhịp | — |

## Không làm — trái thiết kế, không phải trái ý

| Ý | Vì sao |
|---|---|
| Buff "+15 % tốc độ công nhân", "giảm tỉ lệ đào ngũ" | Quốc Chiến **không phải RTS**. Người chơi không điều khiển ai, chỉ bấm thẻ quyết định (`GAME_SPEC` mục 7). Hiệu ứng kiểu này thuộc **thẻ chính sách** (Phase 8), không thuộc chuỗi sản xuất |
| Mỏ "siêu cấp" ở vùng trung lập, tranh chấp giữa **người chơi** | Game **một người, offline**. "Chơi mạng, nhiều người" đã bị `KE_HOACH.md` mục 1 xếp vào **đổi ĐẮT** và loại từ đầu. Tranh chấp với **nước AI** thì có — đó là lớp chiến dịch, Phase 7 |
| Xây đường mòn → trạm tiếp tế → đưa công nhân đến | Đây là cách chơi RTS. Ta dùng **ô xây dựng** kiểu Total War cho tỉnh (`GAME_SPEC` mục 2) |
