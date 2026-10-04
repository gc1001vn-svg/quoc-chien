# Nhật ký 04/10 (lần 34) — nhận ra game từ ảnh anh gửi

**Việc anh hẹn (TIEN_DO lần 33):** anh gửi ảnh quảng cáo Facebook "Kỷ Nguyên Băng Hà: 3Q", khen đồ hoạ, phát triển
từng thời kỳ, lúa lớn dần, xây từng mảng.

**Nhận ra:** Kỷ Nguyên Băng Hà: 3Q = bản Việt của "Ice War: Three Kingdoms" (EVISTA PTE. LTD., Travellet VN phát hành,
ra 20/08/2026). Chỉ có Android, iOS; PC chỉ qua giả lập. **Không có bản web → không chơi thử được bằng `browser_*`.**

**Xem video thay chơi:** Gemini xem YouTube `OGt7tIcwkgA` (4:15; `VIDEO 23.033 token` = video nạp thật).
00:08–00:44 trailer hoạt hình, 00:45–03:51 lối chơi thật: 3D góc xéo, thành phủ tuyết, chặt cây, đào đá, đốt lò.
**Không có** lúa lớn dần, **không có** lên thời kỳ (chỉ nâng cấp từng nhà, bấm xong là đổi dáng ngay), không có cảnh
mô hình trên tay người. Cấy lúa chỉ có ở 00:35 — trong trailer.

**Kết luận báo anh:** clip mô hình trên lòng bàn tay (mùa hè, bánh bao) không khớp lối chơi thật — rất có thể là
quảng cáo dựng riêng (nhiều khả năng bằng AI), chưa kiểm được ai làm. Bảng so: ảnh quảng cáo cạnh khung YouTube
`i.ytimg.com` (hq1–3, maxres).

**Đối chiếu Quốc Chiến (`grep` nhanh, chưa soát kỹ):** đã có lên đời 1–6 (12D) — đúng thứ anh khen. Chưa thấy lúa lớn
dần hay công trình xây từng bước (`ruong_lua` chỉ là công trình trong chuỗi `data/chains.json`). Hỏi anh có muốn thêm.

**Không đổi mã game.** Công cụ `browser_*` hiện ở phiên mới (`ToolSearch` nạp được) — điều lần 33 chưa kiểm.

## Phần 2 — anh chọn cách 2: chơi thật game web cùng kiểu (itch.io)

**Dò (WebSearch, trang danh sách itch.io bị Cloudflare chặn):** City Idle (thời đồ đồng → mặt trăng) — game nằm ở
`cityidle.com`, proxy chặn (403). Bronze Age, Dawn of Tribe — chỉ bản tải máy tính. **Chơi được 2 game:**

**Medieval Farms** (GuiGhost, Lime.js, `html-classic.itch.zone/html/3527367`): ô đất bấm lần 1 cày, lần 2 gieo (trừ tiền
hạt). Mỗi cây 5 hình: cày → `grow1` → `grow2` (còn 62,5 % thời gian) → `grow3` (≤ 10 s cuối) → chín → héo nếu bỏ lâu
(đọc mã game). 1 ngày game = 2 s; cà chua 30 ngày ≈ 60 s, cà rốt 50 ngày ≈ 100 s — ảnh chụp khớp cỡ đó. Chín thì vòng xanh
quanh ô. Phá rừng mở thêm đất: 50 búa + đếm ngược 60 s, bụi bay, rìu chặt, xong ra mảnh ruộng mới. Cày đất có lúc rơi
đồ ngẫu nhiên (cuộn giấy). Búa tự tăng nhờ lò rèn (+3 mỗi nhịp).

**Castle Builders** (Robin, `html-classic.itch.zone/html/4420646`): vẽ hình nhà → bản vẽ gạch mờ → bấm xây → thợ đi bộ vào
mỏ đá, vào rừng, vác từng viên về đặt; ~20 s viên đầu, ~100 s dựng giàn giáo gỗ có thang để xây cao. Nhìn ngang 2D.

**Bài học cho Quốc Chiến (chưa làm, chờ anh):** lúa lớn dần = 3–4 hình theo % thời gian + vòng báo chín; xây từng bước
= bản vẽ mờ → đặt từng khối → giàn giáo → xong. Ảnh: `anh_chup/trinh_duyet/mf_*.jpg`, `cb_*.jpg` (không lên git).

## Phần 3 — anh chê đồ hoạ 2 game trên kém; gửi thêm Happy Citizens (ảnh) + Viking Rise (quay màn hình 7 s)

Anh muốn **mọi thứ** trong Quốc Chiến diễn ra từng bước, mẫu phải đồ hoạ tương đương — xem video, không cần chơi được.
Gemini xem 5 phút đầu video lối chơi thật (nạp video thật: 24.001 và 27.301 token):

**Viking Rise** (IGG, `sj3iPa7-qj4`): 3D tả thực, góc xéo. Xây: vòng móng trên đất → khung gỗ/giàn giáo, thợ gõ búa, tia
lửa, bụi, thanh tiến độ → cột sáng vàng → nhà xong (3–18 s). Thợ vác khúc gỗ trên vai, ôm giỏ quả về kho. Bụi quả thưa
dần rồi mất; cây bị chặt giữ nguyên rồi biến mất (không đổ). Mở đất: sương mù, thợ chặt bụi, sương tan (~5 s). Đêm:
lửa trại, đuốc, lính tuần; hươu chạy, chim bay. Quảng cáo anh quay (rừng → hàng rào → móng → khung) chưa kiểm là phim dựng.
**Happy Citizens** (LifeSim, `OpzP7hfgg24`): 2D hoạt hình, chi tiết trung bình — kém xa ảnh quảng cáo. Xây: mây khói + đếm
ngược 3–15 s → hiện ngay. Sống động nhờ: dân xuống xe buýt, đi bộ về đúng nhà, ngủ, đi làm; xe chạy; đồng hồ ngày/đêm, đèn đường.

**Rút ra:** game đẹp cũng chỉ 3–4 bước + hiệu ứng (giàn giáo dùng chung, ánh sáng, bụi), không liền mạch. Quốc Chiến đã
có: lên đời, người vác (`src/render/VeCanh.ts`), hệ hạt khói/lửa. Chưa có: xây theo bước, lúa lớn dần, cây/mỏ cạn dần,
sương mù mở đất, ngày/đêm. Mỗi bước thêm hình → tốn atlas (mẻ cổ đại gần hết chỗ) — phải tính trước.

## Phần 4 — anh gửi thêm Survivor Island (3 clip quảng cáo, 4,6–7,1 s)

**Survivor Island-Idle Game** (Longames / MOBIBRAIN, 19 triệu lượt tải). Quảng cáo chia đôi màn: trên là trại mới chơi
(lều, lửa trại, nhà xây dở nền đá + tường gỗ nửa chừng, cầu tàu gỗ), dưới là cùng chỗ ở cấp 19–72 (làng gỗ, xưởng gỗ
"Woods+6", bến cảng có tháp, đánh nhau). Gemini xem video thật `t4lqLq4wBUo` (nạp 26.401 token video): **khớp quảng cáo**
— game duy nhất trong 4 game. Xây ~2 s: khung gỗ dở + giàn giáo + bụi + búa → xong. Nâng cấp: vòng tiến độ xanh → loé
trắng → nhà to hơn, nhiều gỗ xếp quanh. Đêm (04:05): màn tối xanh, lửa trại toả vòng sáng, dân vào lều, "Zzz". Sương mù
tan theo vòng tròn khi đốt lửa trại. Khói ống khói nhà ăn. Cây chặt không đổ, số gỗ bay về kho. Không có: vòng sáng vàng
(chỉ ở quảng cáo), lều tự hoá nhà gỗ (đó là so cấp). **Thành mẫu chính của kế hoạch** `2026-10-04-moi-thu-tung-buoc.md`.
