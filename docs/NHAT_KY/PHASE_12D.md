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
- **Anh xem trên iPhone 28/09: 59 fps**, lúc làn sóng chạy cũng 59 — giữ làn sóng. Cùng phiên: `check:san` vá lỗ lọt
  `it.skip` gán qua biến (lỗi của chính test `DoiTheoDoi` bản đầu).

## Khối 4 — ruộng, vườn, trại theo đời (28/09, lần 22)

- 5 sprite `ruong` `vuon_nho` `trai_lon` `trai_ga` `trai_cuu` giờ khác nhau ở **mọi cặp đời kề** (3→4 vẫn chung mẻ, 12E).
  Cổ đại: lúa hoang, vò sành, rào đá thấp, lều · Trung cổ: giữ, thêm bù nhìn, thêm lợn/cừu · Cận đại: ruộng cày +
  máy kéo đỏ, rào ván trắng, máng nước/máng ăn, bò · Hiện đại: thêm máy kéo cam · Tương lai: vòm kính, vườn bồn cây + pin.
- 5 model Icosa CC-BY mới (máy kéo ×2, máng ×2, bù nhìn), ghi ở `data/ghi_cong.json`. Bốn model 27/09 dò trước đó: nhà kính
  `bKcTdPE3lyq` ra một khối xanh méo; `7qFs_DjjuVp` · `8yBTH_Bwfnn` · `eiXGnD1wN5q` đọc ra **hộp bao 0** (min = max) — bỏ.
- Thước `DoiTheoDoi` thêm 5 sprite: đỏ 3/5 cặp trên công thức cũ, xanh trên mới. Mỗi mẻ vẫn 2× **2 trang**, 1x 1 trang.
- **Bẫy:** `tai_icosa.mjs` **ghi đè `docs/KHO_ICOSA.md` chỉ còn model trên đĩa** (1.692 → 17 dòng) — chạy xong phải
  `git checkout docs/KHO_ICOSA.md`. Mẻ `co_dai` trỏ bản `model_(GLTFupdated).gltf`, lệnh tải chỉ lấy `.glb` → lấy tay từ
  `s3.us-east-005.backblazeb2.com/icosa-gallery/poly/<id>/` cả `.gltf` lẫn `model.bin`. Mặt trước sprite là góc **+x +z**.
- Bảng chọn gửi anh: một ảnh 5 hàng × 5 đời. Bản duyệt đăng đè, dòng chữ nhỏ ghi **28/09 20:01**.
- **Anh chỉ ra 28/09: "kho-game có gà"** — đúng, phiên này bỏ bước 1c (`kho-game`) nên kết luận sai "không có gà".
  Dò lại: gà, gà mái, lợn, cừu, bò, dê, rơm, chuồng, xi-lô đều có (Icosa CC-BY, bản Google). Tải được 20/21.
- **Lỗi thật của bộ đọc, sửa gốc:** model Google ghi `"byteStride": 0`; `tools/lib/gltf.mjs` dùng `??` nên đọc thành
  bước 0 → mọi đỉnh trùng một điểm, sprite rỗng. Chính lỗi này làm hỏng 3 model hồi sáng. Sửa `||`, test
  `tests/GltfBuoc.test.ts` đỏ trên bản cũ. Nướng lại `tuong_lai` ra y hệt từng byte — không đổi sprite nào khác.
- Thêm vào trại: gà ở mọi đời (trung cổ làm lại trại gà), dê + đống rơm cổ đại, chuồng đỏ + xi-lô cận đại. +6 ghi công.
- **Bẫy:** `kho-game/cong-cu/lay.mjs icosa --id` hỏng 21/21 (URL wayback trong manifest); lấy thẳng bản
  `GLTF2` backblaze qua `api.icosa.gallery` thì được. Chưa sửa (repo khác). Bản duyệt đăng đè, ghi **28/09 21:41**.
