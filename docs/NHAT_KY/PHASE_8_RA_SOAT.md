# Phiên rà soát — gỡ xung đột (12/09/2026)

Không phải một phase: chủ dự án chốt lùi Phase 8B một phiên để dọn cho sạch. Lý do anh
nêu: *"có quá nhiều thứ đã làm mà bạn đã quên; có những thứ rõ ràng phiên trước làm được
phiên sau lại bị chặn"*.

**Gỡ 10/11 xung đột**; cái còn lại chỉ chủ dự án bấm được (tải skill lên claude.ai).

- **Hook** bỏ chặn đường `Bash`, giữ ghi sổ (anh chốt). Đo phiên thật: 13 lần chặn thì 4
  lần chặn nhầm, mà cái được bằng không — shell có mười đường ghi file. Phần nhận diện
  giữ nguyên: chặn nhầm hỏng việc thật, ghi nhầm chỉ tốn một dòng sổ. `Bash` cũng không
  tiêu vé nữa, kẻo lệnh đoán nhầm ăn mất vé để dành cho `Edit`.
- **`CLAUDE.md` hết ngõ cụt** — thêm dòng chỉ đường `da_duyet.txt`. Đây là cái nặng nhất:
  nó bảo "sửa bằng `Edit`" mà file khoá thì `Edit` bị chặn, và không chỗ nào nhắc vé.
- **`tests/TaiLieu.test.ts`** — bốn hàng rào, chạy không cần `assets_source/`.
  Hàng rào số model hai lớp: cấm số kiểm kê kho, vẫn cho số đặc tả một gói.

**Hai thứ mới lộ ra, đáng ghi hơn cả việc gỡ:**

1. **Xung đột thứ 11** — `DAU_PHIEN.md` dạy *"chưa đọc được `.glb`"* trong khi máy nướng
   đọc được từ 11/09. File đọc **mỗi đầu phiên**, nên nó dạy sai từ bước đầu.
2. **Con số gõ tay thứ ba** — hàng rào vừa dựng bắt ngay `NGUON_MO.md` ghi "1.855 model",
   khác cả 1.222 lẫn 1.310. Đợt rà 12/09 soi bằng mắt **không thấy**.

Bài học: **rà bằng mắt không đủ, phải có máy giữ.** Cả hai cái trên đều lọt qua một đợt rà
có chủ đích, và cái thứ hai bị bắt trong vòng vài phút sau khi có test.

Chỗ dạy sai về `.glb` hoá ra có **hai** chỗ, không phải một: `TIEN_DO.md` cũng kết một
đoạn bằng *"`.glb` thì vẫn chưa đọc được"* ngay dưới đoạn nói "120/120 file `.glb` đọc
được" — tự mâu thuẫn trong cùng một đoạn. Hàng rào soi cả hai file.

**Bốn xung đột trong kho `ghi-nho` suýt bị bỏ lại** vì phiên kết luận "không có quyền" sau
khi clone hỏng. Lỗi thật: **xin sai loại quyền** — `access: push` cho repo ngoài phạm vi
phiên thì bị từ chối, `access: read` qua ngay. Câu `push` đó nằm sẵn trong skill `ghi-nho`
nên phiên nào cũng vấp; đã sửa. Phiên còn đi phiền chủ dự án chuyển repo sang Public — một
việc không chữa được gì.

**Bài học 11/09 chưa đủ.** "Một lần bị chặn không phải kết luận" vẫn đúng, nhưng phiên này
thử lại **hai lần cùng một cách** rồi vẫn kết luận sai. Thử lại phải là **đổi cách hỏi**.

`npm run do`: **6/6 · 222 test** (trước: 211). Không đụng gì màn hình game nên không cần
xác nhận trên iPhone.
