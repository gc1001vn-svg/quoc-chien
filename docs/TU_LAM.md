# TỰ LÀM — thứ không lấy từ kho, phải khai

Máy giữ: `npm run check:credits` (trong `npm run do`) đỏ khi một sprite **không có mảnh
model nào**, không dán hoạ tiết tải về, không chép sprite có nguồn — tức là vẽ bằng số thuần —
mà không có dòng ở đây. File trong `public/` ngoài `atlas/` cũng vậy nếu không có tên trong
`docs/ASSET_CREDITS.md`.

**Trước khi thêm dòng:** `npm run do:asset <từ khoá>` (tự dò kho-game mọi nguồn). Không ra thì
**hỏi anh**, anh đồng ý rồi mới ghi. Cột *Lệnh dò* ghi đúng lệnh đã chạy; cột *Anh duyệt* ghi
ngày. Thiếu một trong hai cột là đỏ.

Vì sao: 10/09 cối xay gió ghép tay năm lượt nướng khi KayKit có sẵn `mill`; 28/09 kết luận
"không có gà" khi kho-game có. Luật "dò trước khi tự làm" là chữ — thước này là máy giữ.

| Mẻ:sprite · file | Vì sao tự làm | Lệnh dò | Anh duyệt |
|---|---|---|---|
| `linh_co:dat_0` | nền cỏ phẳng một màu dưới trận, không cần mô hình | có từ trước 29/09 | trước 29/09 |
| `linh_co:dat_1` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_co:de_a` | đế màu phe (xanh) dưới chân lính | có từ trước 29/09 | trước 29/09 |
| `linh_co:de_b` | đế màu phe (đỏ) | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dat_0` | nền như `linh_co` | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dat_1` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:de_a` | đế phe như `linh_co` | có từ trước 29/09 | trước 29/09 |
| `linh_sung:de_b` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h0` | vệt đạn sáng, 8 hướng khớp tên `DienTran` hỏi | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h1` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h2` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h3` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h4` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h5` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h6` | như trên | có từ trước 29/09 | trước 29/09 |
| `linh_sung:dan_h7` | như trên | có từ trước 29/09 | trước 29/09 |
