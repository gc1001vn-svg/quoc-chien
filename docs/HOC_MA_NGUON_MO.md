# Học gì từ game mã nguồn mở

> Chỉ **đọc cách nghĩ**, không chép code, không lấy asset. Phần lớn các game này là GPL —
> chép code vào đây là ép cả dự án thành GPL. Asset của 0 A.D. là CC-BY-SA, còn cấm nặng
> hơn: nó lây license sang mọi thứ.

Đọc 06/09/2026, trong vòng ĐỔI của Phase 1.

---

## 1. Widelands — chuỗi sản xuất viết bằng dữ liệu, không viết bằng code

GPL. Đọc `data/tribes/buildings/productionsites/barbarians/bakery/init.lua`.

Mỗi toà nhà khai báo trọn vẹn bằng dữ liệu, kể cả **cách làm việc**:

```lua
buildcost = { log = 2, blackwood = 2, granite = 2, reed = 2 },
return_on_dismantle = { log = 1, blackwood = 1, granite = 2 },
working_positions = { barbarians_baker = 1 },
inputs = { { name = "water", amount = 6 }, { name = "wheat", amount = 6 } },
programs = { main = { actions = {
   "return=skipped unless economy needs barbarians_bread",
   "consume=water:3 wheat:3",
   "sleep=duration:20s800ms",
   "produce=barbarians_bread",
} } },
aihints = { prohibited_till = 500 },
```

Bốn thứ đáng bê nguyên **ý tưởng** sang `data/chains.json` ở Phase 3:

1. **Chu trình là một danh sách hành động nhỏ**, không phải một hàm trong code.
   Thêm nghề mới = thêm một khối JSON, không đụng `src/sim/`. Đúng luật 2 của CLAUDE.md.
2. **`return=skipped unless economy needs X`** — nhà máy tự ngừng khi kho đủ hàng.
   Nếu thiếu dòng này thì thành phố sản xuất mù, kho tràn, đó là lỗi kinh điển.
3. **Kho đệm tách khỏi mẻ tiêu thụ**: chứa 6, mỗi mẻ ăn 3. Cho phép người giao hàng
   trễ mà xưởng không đứng.
4. **`aihints.prohibited_till`** — mốc thời gian sớm nhất máy được phép xây thứ này.
   Phase 5 (`Governor`) cần đúng chỗ neo này, nếu không thống đốc xây nhà thờ trước ruộng.

## 2. Unciv — hiệu ứng viết thành câu, một máy đọc tất

MPL-2.0 (dễ hơn GPL nhưng vẫn không chép code). Đọc
`android/assets/jsons/Civ V - Vanilla/`.

Toàn bộ nội dung Civ V nằm trong 19 file JSON. Điểm hay nhất là **`uniques`** — hiệu ứng
viết bằng câu có tham số trong ngoặc vuông, một máy duy nhất đọc và thi hành:

```
"Must be next to [Coast]"
"Gain a free [Lighthouse] [in this city]"
"Can build [all] improvements at a [+25]% rate"
"New [Military] units start with [15] XP [in this city]"
```

Nhờ vậy thêm một thẻ chính sách hay một công trình mới **không cần viết code**.
Áp thẳng vào Phase 6 (`decision/Engine.ts`) và Phase 8 (`policies.json`, `tech.json`).

Hai chỗ khác đáng chép cấu trúc:

- `Techs.json` gom cây công nghệ theo **cột** (`columnNumber`) và **thời đại**, mỗi cột
  một giá tiền chung. Đỡ phải ghi giá cho từng công nghệ.
- `VictoryTypes.json` mô tả điều kiện thắng bằng **danh sách mốc** (`milestones`) dạng
  câu, không phải bằng code. Bốn kiểu thắng của Phase 11 nên viết y như vậy.

## 3. Chưa đọc được

| Game | Vì sao chưa |
|---|---|
| **gigalomania** | Không tìm được kho trên GitHub (`api.github.com/search` bị khoá theo phiên). Nó nằm ở SourceForge. Đây là game đáng đọc nhất về **một ván đi suốt nhiều thời kỳ** — tìm lại ở phiên sau |
| **0 A.D.** | Kho rất nặng. Code GPL-2.0, **art CC-BY-SA 3.0 → cấm chạm** |
| **fheroes2** | Là bộ chạy lại HoMM2, cần file gốc của game thương mại. Không có gì cho mình |
| **Zemeroth** | Kho tải được (MIT/Apache). Chưa đọc kỹ — để dành cho Phase 9 khi làm trận đánh |

## 4. Điều đã tự rút ra

Cả Widelands lẫn Unciv đều đi tới cùng một chỗ: **engine chỉ là bộ đọc dữ liệu**. Cái làm
nên game nằm trong file dữ liệu. Dự án này đã có luật đó (CLAUDE.md luật 2) nhưng mới áp
cho *số*. Hai game trên áp cho cả **hành vi**. Nên nới luật 2 theo hướng đó ở Phase 3:
`data/*.json` giữ cả chuỗi hành động, không riêng con số.
