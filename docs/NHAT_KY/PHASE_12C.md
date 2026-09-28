# Phase 12C — mẻ cổ đại + báo hiệu lên đời (27–28/09/2026)

- **Anh chốt:** (a) sửa "lên đời không rõ" ngay trong 12C · chọn **D** cho cổ đại (giữ nhà KayKit, nhuộm mái rơm
  + 3 công trình Icosa CC-BY) · cho sửa `ASSET_CREDITS.md`. Kế hoạch:
  `docs/ke-hoach/2026-09-27-phase-12c-co-dai-bao-len-doi.md`.
- **Gốc "lên đời không rõ":** tin lên đời chỉ là một dòng nhật ký 3 dòng, bị "Thống đốc xây…" đẩy trôi; tên đời
  chỉ ở bảng công nghệ; đời 1–2 cùng mẻ, 3–4 cùng mẻ.
- **Xong:** `🏛 <tên đời>` đầu dòng số (thành phố + bản đồ) · thẻ lên đời giữa màn (`src/ui/TheLenDoi.ts`, tự tắt
  `balance.json > giayTheLenDoi` = 6 giây thật, `?lendoi=1` xem trước) · màn **ⓘ Ghi công** trên bản đồ tỉnh
  (`data/ghi_cong.json`, trả nợ CC-BY từ 10B) · mẻ **`co_dai`** cho đời 1: nhà KayKit đỏ nhuộm `mau_cot` (ô `1,0`
  mái → rơm, `2,3` nền đá → đất, `1,3` trát → đất sét), trại lính → đấu trường, lò nung → tháp Sumer, nhà bia →
  đền Hy Lạp.
- **Số đo:** `npm run do` 17/17 · **502 test** · `co_dai_2x` 2 trang (trang 0 88,7 %) · bản duyệt **28/09 09:48**.
- **Bẫy:** hàng `mau_cot` đếm **từ dưới lên** (ô đỏ đọc ảnh là hàng 3, khoá là `1,0`) · model Icosa không đặt gốc ở
  tâm, phải bù `x/y/z = -(tâm hộp bao) × ti_le` · web.archive.org đứt 27/09, lấy bản `backblazeb2` qua
  `api.icosa.gallery` (`resources` thiếu `.bin`, phải lấy theo `buffers[].uri`) · `npm run kho` sau `tai:tatca` ghi
  đè `KHO_ASSET.md` mất ~6.700 dòng (diff +65/−6.713) mà chốt 20 % không chặn — đã hoàn lại, **chưa tra vì sao**.
- **Chưa làm:** tường ván xanh xám của nhà vẫn còn (chưa tìm ra ô màu) · đời 3–4 vẫn chung `can_dai` · nút
  "⌂ Về thành phố" đè "⚔ Xem trận" trên màn bản đồ dọc (có từ trước).
