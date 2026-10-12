# Bước 5 — Bản đồ tỉnh xây theo lượt · 12/10/2026 · ANH DUYỆT 12/10

Kế hoạch mẹ (anh duyệt 04/10): `docs/ke-hoach/2026-10-04-moi-thu-tung-buoc.md` việc 5.
Việc: công trình tỉnh đang xây mọc dần trong giàn giáo theo lượt, xong thì loé sáng.
Xong là khi: ảnh các chặng gửi anh; anh đo iPhone ≥ 58 fps.

## Hiện trạng (đo 12/10)
- Sim đã có `dangXay`/`conLai` mỗi ô xây (`ChienDich.ts`); 4 loại công trình 3–6 lượt, một lượt 3 giây thật.
- `VeBanDo.ts` vẽ đúng một hình `gian_giao` suốt lúc xây, hết lượt cuối thì đổi phắt sang nhà.
- Chỉ nước ta ra lệnh xây (bảng tỉnh); máy không ra lệnh.

## Anh chọn 12/10
- **Câu 1 — mượt theo giây:** nhà nhích lên đều, hết lượt cuối thì xong.
- **Câu 2 — loé sáng ~0,5 s** lúc xong, như nhà thành phố bước 1.
- **Câu 3 — không bụi, không que gỗ.**

## Làm
1. `data/tung_buoc.json` mục `xayTinh`: thời gian loé (giây). Độ sáng, mức giữ đáy dùng chung số bước 1.
2. `VeBanDo.ts`: ô đang xây vẽ nhà cắt từ dưới lên theo `(luot − conLai + phần lượt đang chạy) / luot`, giàn giáo đè
   lên; ô vừa xong loé sáng. Sim không đổi. `?tat=xayTinh` về kiểu cũ.
3. `MapScene.ts` truyền phần lượt đang chạy (`donLuot`) vào lời vẽ.

## Đo
- `npm run do`; test mới cho phần đã xây và độ loé. Ảnh các chặng (đặt lệnh xây qua `?tinh=1`).

## Rủi ro
- Giàn giáo KayKit che kín nhà → đổi thứ tự (nhà đè giàn giáo) sau khi xem ảnh.
- Lùi: `git revert`; tắt tạm `?tat=xayTinh`.
