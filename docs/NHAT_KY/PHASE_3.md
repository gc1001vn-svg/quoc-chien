# PHASE 3 — Thành phố sống bằng số (07/09/2026)

`src/sim/` hết rỗng. **21 mặt hàng · 23 loại nhà (80 cái) · 9 chuỗi sản xuất**, kho chung,
nhịp 10 Hz. `npm run sim:thu` chạy **10 giờ game (360.000 nhịp) trong 0,47 giây**, in bảng
tài nguyên rồi tự chấm. Kết quả **ĐẠT**. `npm run do` **6/6 thước**, 83 test (thêm 25).

Chủ dự án bác bản kế hoạch đầu (4 chuỗi): *"còn thiếu nhiều như nước, rượu bia, thức ăn,
xúc xích, gia cầm vân vân"* → nới lên 9 chuỗi: bánh mì · xúc xích · gia cầm · cá · nước ·
rượu bia · đồ da · sắt-giáp-vũ khí · gỗ-đá. Dân bậc 1 ăn **bảy món**; bậc 2-3-4 để Phase sau.

## Ba điều học được

**Lò mổ ra hai thứ trong một mẻ, tỉ lệ phải khớp đúng tỉ lệ nhu cầu.** Đặt 2 xúc xích :
2 da thú trông cân đối nhưng nhu cầu thật là 1.800 : 1.440 mỗi giờ. Da thú dư làm đầy
kho → chặn cả mẻ → xúc xích tụt xuống 1.440, dân đói xúc xích trong khi kho da thú đầy ắp.
Sửa thành **5 : 4** là hết. Sản lượng của nhà nhiều đầu ra bị ghìm bởi đầu ra ế nhất.

**Nhà dân phải ăn từng món độc lập, không theo kiểu dây chuyền.** Nếu bắt dân ăn như nhà
sản xuất (thiếu một món là cả mẻ không chạy) thì hết rượu là cả thành phố nhịn bánh mì.
Nên có hai kiểu nhà: `san_xuat` ăn hết `vao` cùng lúc, `tieu_thu` ăn từng món riêng.

**Tồn kho chạm trần là bình thường, không phải lỗi.** Chưa có thống đốc (Phase 5) nên sản
lượng cố định; dư thì đầy kho rồi nhà sản xuất tự ngừng. Đó là cách kinh tế tự ghìm. Vì
vậy "kẹt vĩnh viễn" phải đo bằng **mỗi nhà chạy được ít nhất một mẻ trong một giờ game** và
**mỗi mặt hàng vừa được làm ra vừa bị dùng đến**, chấm cho từng giờ chứ không chỉ giờ cuối.

## Cách chạy `.ts` trong Node mà không cài gì

Node 22 có sẵn `--experimental-strip-types`. Đổi lại: import trong `src/sim/` phải ghi đủ
đuôi `.ts` (`allowImportingTsExtensions` trong `tsconfig.json`), và **cấm `constructor(readonly x: T)`**
— Node báo `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`, đã vấp một lần. Đường lùi nếu sau này hỏng:
cài `tsx` (MIT), phải hỏi chủ dự án trước.

## Chưa làm

Walker (Phase 4) — hàng vẫn chuyển tức thì qua kho chung, đổi sang walker không phải đụng
số cân bằng nào. Bậc nhà dân 2-3-4, thuế, bất ổn, thống đốc (Phase 5-6). **Sprite cho 28
toà nhà mới chưa nướng** — chưa nhìn thấy gì trên màn hình, đúng chủ ý.

## Bổ sung cuối phiên (07/09)

Chủ dự án giao tự tìm món còn thiếu. Thêm **ba chuỗi, năm mặt hàng** lấy từ chuỗi có thật
của Knights and Merchants · Caesar III · Anno 1404 (không tự bịa): **len → vải** (quần áo
cho bậc 3 của `GAME_SPEC`, trước chỉ có áo da) · **đất sét → gốm** (nồi niêu) · **muối**
(ướp xúc xích — nối sâu chuỗi có sẵn thay vì đẻ chuỗi mới). Bỏ qua ngựa, mật ong, nến,
thảo dược: chưa ai dùng đến. Thành **26 hàng · 28 nhà · 12 chuỗi**, vẫn ĐẠT, vẫn 0,5 giây.

Thêm lò gốm là mỏ than phải hạ nhịp 120 → 80: một mỏ nuôi hai lò. Đúng kiểu lỗi mà bảng
"Nhịp chờ" bắt được ngay.

## Token — đo thật, cuối phiên

Chủ dự án báo phiên này chạy tốn. Ba chỗ ngốn nhất, theo số đo:

| Chỗ | Tốn | Sửa |
|---|---:|---|
| Sửa file bằng `python`/`sed` trong Bash | ~12.000 | Máy in lại **toàn bộ** file mỗi lần đổi ngoài công cụ Edit. `buildings.json` (2.105) và `City.ts` (2.049) bị in lại 2 lần mỗi cái. **Dùng công cụ Edit.** |
| Bản kế hoạch 210 dòng | ~12.000 | Viết 2 lần rồi in lại lúc duyệt ≈ 3 × 4.011. Kế hoạch nên gọn, khuôn của skill `lap-ke-hoach` là **20 dòng** |
| `docs/TIEN_DO.md` phình 141 dòng | 3.549/phiên | Tách nợ ra `docs/NO_KY_THUAT.md`, còn 80 dòng ~1.551 |

`CLAUDE.md` 698 token (khuyến nghị ≤500) và `.claude/settings.json` ≈1.400 token/phiên đều
là **file khoá**, chờ chủ dự án đồng ý.
