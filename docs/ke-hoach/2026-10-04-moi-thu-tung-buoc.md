# Mọi thứ diễn ra từng bước — 04/10/2026 · ANH DUYỆT 04/10

Anh chốt 04/10 (lần 34): không chỉ lúa và xây nhà — mọi thứ trong thành phố phải hiện ra dần, đồ hoạ tầm Viking Rise /
Happy Citizens. Mẫu đã xem (video lối chơi thật qua Gemini): `docs/NHAT_KY/NHAN_GAME_TU_ANH_04_10.md` phần 2–4.
Bài học mẫu: game đẹp cũng chỉ **3–4 bước + hiệu ứng** (móng → giàn giáo, thợ gõ, bụi → loé sáng → xong), không liền mạch.
**Mẫu sát nhất: Survivor Island** (anh gửi 04/10; video thật khớp quảng cáo, hoạt hình 3D góc xéo): xây **~2 s** — khung gỗ
dở + giàn giáo + bụi + búa gõ → xong; nâng cấp: vòng tiến độ → loé trắng → nhà to hơn; đêm: màn tối xanh, lửa trại toả
vòng sáng, dân vào lều "Zzz"; sương mù tan theo vòng quanh lửa trại; khói ống khói; số tài nguyên bay lên.

## Hiện trạng (đo 04/10)
- Nhà thống đốc xây thêm hiện ra **ngay** (`src/sim/city/XayThem.ts` → `datNha`). Ruộng một hình. Không ngày/đêm.
- Có sẵn để dùng: hệ hạt `Hat.ts` (khói, lửa — không tốn atlas) · hậu kỳ `HauKy.ts` · khung động `_k0.._k2`
  (`VeCanh.ts`) · người vác đi đường · sóng đổi mẻ khi lên đời (`DoiMeAtlas.ts`).
- **Mẻ cổ đại 2× hết chỗ** (90,2 % trang, `TIEN_DO.md` mục 2) — mỗi hình mới phải tính chỗ trước.

## Nguyên tắc
- **Không thêm hình vào mẻ cổ đại** (đã 90,2 %, trần 4 trang). Mọc dần bằng **cắt sprite từ dưới lên** theo % (bớt điểm
  ảnh, không thêm), đổi màu bằng tint, giàn giáo/bụi/tia lửa bằng `Hat`. Cần hình mới thật → hỏi anh (đụng trần trang).
- **Tiến độ tính theo nhịp game, không theo giờ thật:** sim ghi `nhipXay` cho nhà mới (chỉ ghi, không đổi luật) → dừng,
  tua 1×–500× (`src/ui/TocDo.ts`) vẫn khớp; game chưa có lưu/tải ván. Ngày/đêm pha màu **trong shader sprite có
  sẵn**, không thêm lớp phủ cả màn hình.
- Mọi thời lượng, số giai đoạn, số hạt vào `data/tung_buoc.json` (luật 2). Mỗi hiệu ứng tắt được bằng `?tat=`.
- Gemini phản biện 04/10: sửa 2 ý (luật dừng atlas tự mâu thuẫn · tiến độ theo giờ thật lệch khi tua), 1 ý một nửa (fill-rate).

## Việc — mỗi bước một phiên, mỗi phiên anh xem iPhone rồi mới sang bước sau
1. **Xây nhà từng bước** (thành phố): nhà mới → vạch móng → mọc dần từ dưới lên + giàn giáo + bụi + người đứng gõ →
   loé sáng → xong. Áp cho cả kho xây thêm. Luật mới TP: "nhà đang xây không chặn đường, xong đúng giờ".
2. **Ngày/đêm + dân về nhà:** ánh sáng theo giờ game (`Clock`, hậu kỳ), đêm có đèn/lửa (hạt), ít người đi đường hơn,
   nhà dân "Zzz" (mẫu Survivor Island).
3. **Ruộng lúa lớn dần** theo mẻ sản xuất: cày → mạ → lúa xanh → lúa vàng → gặt (tint + cắt). **Làm SAU khi anh chọn
   bảng nông trại** (art bible bước 2, `TIEN_DO.md` mục 3) — làm trước thì phải nướng hai lần.
4. **Khai thác cạn dần:** mỏ, rừng, trại quanh thành thưa dần theo kho; hết thì đổi hình. Dò trước có vẽ cây/mỏ không.
5. **Bản đồ chiến dịch:** công trình tỉnh đã có `dangXay`/`conLai` trong sim (`ChienDich.ts`) → vẽ giàn giáo theo lượt.
6. **Mở đất / sương mù** — để cuối, chỉ làm nếu anh còn muốn sau bước 1–5.

## Anh đã chọn (04/10, nguyên văn: "1 chạy luôn. Nhưng nhà xây cho nhanh 1 tí. 2 như theo đề xuất. 3 đồng ý")
- **Câu 1 — chạy luôn:** nhà đang xây vẫn sản xuất, chỉ đổi hình, không đổi cân bằng. **Xây nhanh** — ngắn hơn mẫu
  (Viking Rise 3–18 s): mặc định ~2 s như Survivor Island ở tốc độ thường, số trong `data/tung_buoc.json`, anh chỉnh được.
- **Câu 2 — thứ tự 1 → 6** như mục "Việc".
- **Câu 3 — giàn giáo vẽ bằng hạt** (que gỗ, không tốn chỗ ảnh).

## Đo
- Mỗi commit `npm run do` (gồm `check:tran`, `luat:sau` khi đụng `src/sim/`). Mỗi bước: `npm run chup:man` gửi bảng ảnh
  trước/sau; anh đo fps iPhone ≥ 58 (mốc 59) trước khi sang bước sau.
- Atlas: số trang và % chỗ không được đổi (`tests/BanDo.test.ts` bắt); dừng và tua 500× giữa lúc xây — hình phải khớp.

## Rủi ro
- Tụt fps vì nhiều hạt cùng lúc (nhiều nhà xây một lúc) → trần số công trường vẽ hiệu ứng cùng lúc, ghi trong data.
- Câu 1 chọn "xây xong mới chạy" → đổi nhịp lên đời, luật bất biến thành phố; phải đo lại cả bảng `CAN_BANG`.
- Lùi: `git revert` từng commit; hiệu ứng tắt tạm bằng `?tat=`.
