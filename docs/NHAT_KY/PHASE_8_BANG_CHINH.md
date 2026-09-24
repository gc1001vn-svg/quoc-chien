# Phiên 24/09 (lần 11) — bảng chỉnh số `?chinh=1`, rà ba repo ngoài

Chủ dự án giao: rà `XiaomiMiMo/MiMo-code`, `jimliu/baoyu-design`, `mlc-ai/web-llm`, cái gì hợp thì lấy, hay thì học.

- **Làm: bảng chỉnh số** (ý `make-tweakable` của baoyu-design). `data/bang_chinh.json` khai năm num (tệp, trường, min, max, bước);
  `src/ui/ChinhSo.ts` phần tính, `src/ui/BangChinh.ts` phần DOM, gọi từ `main.ts` TRƯỚC khi dựng cảnh.
  Chỉ áp khi URL có `?chinh=1`; số ngoài khoảng, khoá lạ, chuỗi hỏng → bỏ qua, chạy số gốc. Chỉ lưu số khác gốc.
- **Bẫy gặp:** bản đầu lưu cả số gốc → tiêu đề đếm "5 số chỉnh" khi mới đổi 1. Bắt được lúc chạy thử Chromium; thêm `chiKhacGoc` + test.
- **Đo:** `tests/ChinhSo.test.ts` 6 test; Chromium thật: kéo → Áp dụng → tải lại "đang chạy 1 số chỉnh", localStorage `{"policy.gioNoDu":9}`;
  Chép số ra `data/policy.json > gioNoDu: 3 → 9`; Về gốc xoá sạch; link thường không hiện bảng. `npm run do` 17/17, 337 test.
- **Giới hạn:** màu nhà nướng sẵn trong atlas (`mau_cot` ở công thức mẻ) — bảng này KHÔNG chỉnh được màu, chỉ số trong `data/*.json`.
- **Không lấy từ MiMo-code:** là công cụ thay Claude Code, không phải skill; telemetry bật sẵn gửi `tracking.miui.com`.
  Hai ý đáng học — `/goal` (model độc lập chấm "xong thật chưa") đã có tương đương là `/doubt-driven-development`;
  "khai trước phạm vi file khi tối ưu" chưa đo được nhu cầu ở repo này nên chưa ghi thành luật (luật kho: chỉ ghi khi đo được).
- **Không lấy web-llm:** model nhỏ nhất dùng được cần 376 MB bộ nhớ đồ hoạ (SmolLM2-360M, chỉ tiếng Anh), biết tiếng Việt
  (Qwen3-0.6B) cần 1.403 MB — trần GPU cả game ~67 MB. AI của game chạy bằng luật trong `data/`, không cần mô hình ngôn ngữ.
- **Không lấy prompt baoyu-design:** là prompt Claude Design chép lại, rủi ro bản quyền trong repo Public.

## Phụ lục cùng ngày — GỠ bảng

- Chủ dự án thử trên iPhone: "không biết nó dùng làm gì" → "gỡ đi, không cần". Revert commit `805bd5f`.
- Gốc lỗi: năm num là số tính theo giờ game — đổi xong phải chơi lâu mới thấy khác; và đẩy thẳng `main` thay vì `npm run duyet`
  (`DAU_PHIEN.md` mục G). Bài học chung: kho `quyet-dinh/2026-09-24-cong-cu-chua-xin-thi-lam-ban-nhap.md`.
- Rà thêm 13 skill Matt Pocock chưa đọc 23/09. Chỉ `prototype` có ý dùng được (đã gộp vào bài học trên);
  `retro` trùng việc `NHAT_KY` + thước đang làm; `to-questionnaire` dành cho hỏi người thứ ba, repo này chỉ có một chủ.
