# Phase 12D — lên đời rõ ràng hẳn: mọi thứ đổi theo đời (28/09)

## Bối cảnh

12C anh xem 28/09: **59 fps mọi màn**. Anh báo: dấu hiệu lên đời "có chút biến chuyển nhưng vẫn không rõ,
cần rõ hơn hẳn" · "mọi công trình đều phải thay đổi khi lên đời" · "ruộng, chỗ chăn nuôi nhìn chán quá".

Đo 28/09 (so từng sprite giữa hai mẻ kề nhau, `tools/me/*.json`), số công trình và đồ vật **y nguyên** khi lên đời:

| Lên | Mẻ | Công trình/đồ vật y nguyên | Nền y nguyên | Người y nguyên |
|---|---|---|---|---|
| 1→2 | `co_dai` → `trung_co_2` | **30/42** (mỏ, lò, ruộng, trại, đồ vật) | 7/7 | 16/16 |
| 2→3 | `trung_co_2` → `can_dai` | **18/42** (ruộng, trại, cối xay, đồ vật) | 7/7 | 16/16 |
| 3→4 | `can_dai` → `can_dai` | **42/42** — cùng mẻ | 7/7 | 16/16 |
| 4→5 | `can_dai` → `hien_dai` | 0/42 | 5/7 | 12/16 |
| 5→6 | `hien_dai` → `tuong_lai` | 6/42 (ruộng, vườn, cối xay) | 7/7 | 16/16 |

Nên lên đời gần như chỉ đổi vài cái mái — đúng như anh thấy.

## Làm gì — chia hai phase, mỗi phase một phiên

**12D — màn lên đời + nền, người, ruộng, trại cho cả 6 đời**
1. **Màn lên đời toàn màn**, dừng game tới khi chạm: tên đời chữ to, "Cổ đại → Trung cổ", những thứ mới mở.
2. **Thành phố đổi dần** như làn sóng từ giữa ra, mỗi nhà chớp sáng lúc đổi (thay vì đổi một phát). Giữ hai bộ
   atlas vài giây: 2 + 2 trang = đúng trần 4 trang (`TECH_SPEC.md` mục 2) — đo fps trước khi giữ.
3. **Nền và đường theo đời**: đất → đá lát → gạch → nhựa → kim loại. **Người theo đời**: đổi màu áo tối thiểu.
4. **Ruộng, trại lợn/gà/cừu, vườn nho làm lại cho 6 đời**: nhiều con vật hơn, rơm, máng; lúa → ruộng bậc thang
   → máy kéo → nhà kính → trang trại thẳng đứng. Nướng nhiều biến thể một mẻ, gửi một bảng, anh chốt một lần.

**12E — mọi công trình còn lại đổi theo đời**
5. Mẻ riêng **đời 4 "Công nghiệp"** (tách khỏi `can_dai`: ống khói, nhà máy gạch lớn).
6. Lấp 1→2, 2→3, 5→6: mỏ, lò, cối xay, đồ vật mỗi đời một dạng. Thước mới: **test đỏ khi có sprite công trình
   y nguyên giữa hai đời kề nhau** — bảng trên thành số máy bắt, không phải số đếm tay.

## Ngoài phạm vi

Âm thanh lên đời (Phase 13) · lính theo đời · cân lại `sim:van`.

## Đo bằng gì

`npm run do` xanh · test "không sprite công trình nào y nguyên giữa hai đời kề nhau" (12E; 12D: nền, người,
ruộng, trại) · mẻ mới khớp trang/`o_px`/`heSo` · `check:tran` · ảnh `chup:man` từng đời · **anh xem trên iPhone**,
báo fps và "đã rõ chưa".

## Lùi bằng gì

Mỗi khối một commit. Màn lên đời về thẻ 12C; đổi dần về đổi một phát; mẻ về bản 12C.

## Rủi ro

- Giữ hai bộ atlas lúc đổi dần chạm trần 4 trang — fps tụt thì bỏ khối 2, giữ màn toàn màn.
- Nguồn CC0 cho ruộng/trại theo từng đời có thể thiếu → dò ba bước, thiếu thì báo anh trước khi tự ghép.
- Việc to: 6 đời × ~14 sprite nền/người/trại ở 12D, ~90 sprite ở 12E.
