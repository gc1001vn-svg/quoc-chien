# BỘ ĐỀ — đo xem luật trong `AGENTS.md` có thật sự đổi hành vi không

Chạy: `node scripts/do_luat.mjs` (cần `GEMINI_API_KEY`). Thước `do:luat` trong `npm run do`.

**Vì sao có file này.** Luật viết ra rồi không ai biết nó có tác dụng hay không, nên
`AGENTS.md` cứ phình. Cách chữa chép từ `Human-Agent-Society/reef` (Apache-2.0),
`tutorials/evolve-your-harness` — cơ chế thật của họ gọn đúng **64 dòng**: một bộ đề cố
định nhỏ, một hàm chấm 1.0/0.0 theo dòng cuối, và luật **chỉ giữ thay đổi nào biến câu
đang trượt thành đạt**.

Mỗi câu hỏi hai lần: **không kèm luật** và **có kèm `AGENTS.md`**. Bốn kết quả, cộng
`KHONG DO` khi model không trả lời (503, khoá sai) — không phải lỗi luật, chạy lại sau.
Câu trượt in kèm **dòng cuối nguyên văn** của model ở mục `Vet truot` — sửa luật theo đó:

| Kết quả | Nghĩa | Làm gì |
|---|---|---|
| `LUAT AN` | không luật thì trượt, có luật thì đạt | giữ dòng luật đó |
| `THUA` | đạt cả hai lần | dòng luật đó thừa — cắt được, tiết kiệm token mỗi phiên |
| `CHUA DU` | có luật lại trượt | luật viết chưa rõ hoặc đang gây nhiễu — sửa lời |
| `HONG` | trượt cả hai | luật thiếu hẳn — viết thêm |

**Người trả lời trong phép đo là Gemini flash, không phải Claude.** Nó đo *lời luật có tự
nói đủ ý không*, không đo Claude. Luật nào mơ hồ thì mơ hồ với cả hai.

Thêm câu: chỉ thêm câu mà trợ lý **đã làm sai thật** một lần. Bộ đề phình vô cớ thì mỗi
lần đo mất thêm hai lượt gọi.

Khuôn: `## <mã>` rồi `HOI:` rồi `DAP:` (chuỗi phải nằm ở dòng cuối của câu trả lời).

## so-can-bang
HOI: Trong repo quoc-chien, một tỉ lệ cân bằng của game (ví dụ tốc độ lính 1.35) phải đặt ở đâu? Dòng cuối chỉ ghi đúng một đường dẫn thư mục, không giải thích thêm.
DAP: data/

## sim-thuan
HOI: Trong repo quoc-chien, src/sim/ bị cấm import ba thư mục nào? Dòng cuối chỉ ghi đúng ba tên thư mục, cách nhau bằng dấu phẩy, không giải thích.
DAP: render, ui, bench

## duoi-ts
HOI: Trong repo quoc-chien, khi import một file TypeScript từ src/sim/, đường dẫn import có phải ghi kèm đuôi .ts không? Dòng cuối chỉ ghi đúng một từ: CO hoặc KHONG.
DAP: CO

## cc-by-sa
HOI: Trong repo quoc-chien, một asset có license CC-BY-SA thì dùng được không? Dòng cuối chỉ ghi đúng một từ: CO hoặc KHONG.
DAP: KHONG

## noi-nguong
HOI: Trong repo quoc-chien, mốc gốc của các ngưỡng mà thước check:nguong đọc nằm ở file nào? Dòng cuối chỉ ghi đúng một đường dẫn, không giải thích.
DAP: .claude/nguong_goc.txt

## ten-an-du
HOI: Trong repo quoc-chien, đặt tên biến cho kết quả của một lần rà soát: `verdict` hay `review_result`? Dòng cuối chỉ ghi đúng một tên, không dấu nháy.
DAP: review_result

## do-asset
HOI: Trong repo quoc-chien, cần một sprite tháp canh mà repo chưa có. Được tự vẽ lấy ngay không? Dòng cuối chỉ ghi đúng một từ: CO hoặc KHONG.
DAP: KHONG

## ve-duyet
HOI: Trong repo quoc-chien, được chủ dự án đồng ý cho sửa một file khoá rồi thì phải ghi đường dẫn vào file nào để Edit đi qua? Dòng cuối chỉ ghi đúng một đường dẫn.
DAP: .claude/da_duyet.txt

## doc-kho
HOI: Trong repo quoc-chien, trong ba file của kho ghi nhớ đọc đầu phiên, khối đắt nhất nằm ở cuối file nào? Dòng cuối chỉ ghi đúng một tên file.
DAP: trang-thai.md

## commit-dau
HOI: Trong repo quoc-chien, commit message viết tiếng Việt có dấu hay tiếng Việt không dấu? Dòng cuối chỉ ghi đúng một từ: CODAU hoặc KHONGDAU.
DAP: KHONGDAU

## loi-chan-doan
HOI: Trong repo quoc-chien, chủ dự án báo LỖI. Theo luật repo, sửa lỗi theo skill nào? Dòng cuối chỉ ghi đúng tên skill, không dấu nháy.
DAP: diagnosing-bugs
