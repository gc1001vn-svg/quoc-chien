# Phase 12D — lên đời rõ ràng: màn toàn màn, đổi dần, nền + người theo đời (28/09/2026)

- **Anh chốt 28/09 ("ok 12d")** kế hoạch `docs/ke-hoach/2026-09-28-phase-12d-len-doi-ro-rang.md`.
- **Khối 1 — màn lên đời toàn màn** (`src/ui/TheLenDoi.ts`): tên đời chữ to, "Cổ đại → Trung cổ", số ô chính
  phủ, **công nghệ mới của đời** (lọc `tech.json` theo `thoiDai`), "nhà cửa, đường sá, người dân đổi kiểu mới".
  Dừng game (`tocDo = 0`) tới khi chạm, rồi trả lại tốc độ cũ; thẻ quyết định chờ màn tắt. Bỏ `giayTheLenDoi`.
- **Khối 2 — đổi dần như làn sóng**: giữ hai bộ atlas (2 + 2 = trần 4 trang) trong `songLenDoi.giay` = 4 giây thật
  sau khi chạm; sóng lan từ giữa màn, bán kính theo bình phương thời gian; ô vừa đổi chớp sáng (phần lẻ số trang
  trong shader, `sangToiDa` 0,2). `Gl` giữ một chương trình shader cho mỗi số trang — đường vẽ thường không thêm
  nhánh `if`. Vẫn **1 lệnh vẽ**. Xem trước: `?song=hien_dai`.
- **Khối 3 — nền, đường, người theo đời** (17 hoạ tiết Poly Haven CC0 mới, `npm run tai:hoatiet`):
  đường đất đá → đá cuội (giữ) → gạch → nhựa → tấm kim loại; sân lát sỏi → đá → gạch xương cá → gạch bê tông →
  kim loại. Người: cổ đại áo vải mộc nhuộm be · trung cổ giữ · cận đại đổi sang bộ Ranger nhuộm xanh · hiện đại
  giữ · tương lai đổi sang `character-*-d`. Thước mới `tests/DoiTheoDoi.test.ts`: 7 ô nền + 16 dáng người khác
  nhau giữa mọi cặp đời kề (3→4 bỏ qua tới 12E).
- **Chưa làm — khối 4 (ruộng, trại cho 6 đời)**: nguồn đã dò (Icosa CC-BY): nhà kính `bKcTdPE3lyq` · máng ăn
  `8yBTH_Bwfnn` · bù nhìn `7qFs_DjjuVp` · máy kéo `2e7Mm2x_fSC`; gà/lợn/cừu/bò có sẵn trong `KHO_ASSET.md`.
  Nướng nhiều biến thể một mẻ, gửi bảng cho anh chốt một lần.
- **Bẫy:** `tests/AiGoi.test.ts` ghim số dòng nơi gọi `doi` — sửa `DoiMeAtlas.ts` là phải sửa số · Icosa lấy bằng
  `api.icosa.gallery` → bản `backblazeb2` + `buffers[].uri` (lệnh ở phiên này, `assets_source/icosa/<id>/`) ·
  chụp màn máy ảo chạy ~30 fps (phần mềm), không phải số iPhone.
