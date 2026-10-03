# LUẬT BẤT BIẾN — QUỐC CHIẾN

> Điều game **không bao giờ được phá**, máy kiểm qua nhiều hạt giống ngẫu nhiên — không phải ca cụ thể.
> `npm test` chạy bản ngắn; `npm run luat:sau` chạy bản sâu (≥ 50 hạt giống, ván dài), `npm run do` tự gọi khi
> `src/sim/` hay `data/` khác `main`. Mỗi dòng một luật; mã `[..]` mở đầu tên `it` trong `tests/BatBien*.test.ts`
> — `tests/BatBienDanhSach.test.ts` giữ hai bên khớp. **Luật đỏ thì sửa mã, không nới luật** (`docs/DAU_PHIEN.md`
> mục J). Luật ghi `(chưa bật)` đang chờ sửa lỗi, chưa có test. Học từ `LAWS.bend` (Bend 2); kế hoạch
> `docs/ke-hoach/2026-10-03-luat-bat-bien.md`.

## Thành phố — `tests/BatBienThanhPho.test.ts`

- [TP01] Hàng không tự sinh ra cũng không tự biến mất: cuối mỗi giờ, tổng hàng trong kho chung, trong các nhà và trên vai người vác luôn bằng lúc mở ván cộng phần làm ra và quà của nhà mới xây, trừ phần đã dùng và phần hỏng, kể cả khi người vác bỏ cuộc giữa đường.
- [TP02] Không chỗ nào chứa số hàng âm hay số lẻ, kho chung không bao giờ vượt sức chứa, và một người vác không bao giờ mang quá một chuyến.
- [TP03] Ở ván chơi bình thường, từ giờ thứ hai trở đi, giờ nào mọi loại nhà cũng chạy xong ít nhất một mẻ và mọi mặt hàng đều vừa được làm ra vừa được dùng tới, dù bản đồ nào và xây thêm kiểu gì.
- [TP04] (chưa bật) Ở ván chơi bình thường, kho riêng của một nhà chỉ được vượt sức chứa nhiều nhất một chuyến vác: kho chung đầy thì nhà phải ngừng làm, không được ôm hàng mãi.
- [TP05] Bảng số mỗi giờ nói thật: số hàng làm ra đúng bằng số mẻ xong nhân sản lượng khai trong dữ liệu, hàng không hỏng thì không mất món nào vì hỏng, và số nhà từng loại đúng như ngoài bản đồ.
- [TP06] (chưa bật) Người vác lúc nào cũng đứng trên một ô đường nằm trong bản đồ.
- [TP07] Người vác xuất phát từ đúng cổng nhà mình, mỗi bước đi một ô nên không bao giờ cách cổng xa hơn số bước đã đi, chỉ đi tới kho có thật, không quá số bước tối đa, và trong ván thường không ai phải bỏ cuộc giữa đường.
- [TP08] Bộ đếm người đi lấy và người đi giao luôn khớp số người thật đang trên đường, và không vượt trần của từng việc cũng như trần tổng số người vác.
- [TP09] Mỗi cờ 'đang có người đi lấy món này' của một nhà ứng với đúng một người vác đang đi lấy món đó cho nhà đó, và ngược lại; không cờ nào mồ côi, không món nào có hai người cùng đi lấy.
- [TP10] (chưa bật) Trên bản đồ mỗi ô chứa nhiều nhất một vật (cây, nhà, thùng hàng đánh dấu kho), không vật nào nằm trên đường hay ngoài bản đồ, và nhà nào cũng có hình đúng chỗ của nó, kể cả sau khi xây thêm nhà và kho.
- [TP11] Danh sách vật trên bản đồ luôn xếp đúng thứ tự trước sau để vẽ, kể cả sau khi xây thêm nhà và kho.
- [TP12] Hạt giống nào cũng dựng được thành phố, và nhà nào cũng nằm sát đường, đúng khu quy hoạch, không trên viền khu, không trùng hay kề sát nhà khác, mỗi khối phố nhiều nhất một tiện ích, cổng là ô đường ngay cạnh nhà trong bản đồ.
- [TP13] Kho nào cũng nằm ở một ngã tư trong bản đồ, và không có hai kho trùng chỗ.
- [TP14] (chưa bật) Từ bất kỳ ô đường nào tới bất kỳ ô đường nào, người vác luôn tới nơi: mỗi bước một ô, không rời đường, không ra khỏi bản đồ, và không đi vòng quá quãng thẳng cộng hai lần đoạn ra tới ngã tư gần nhất.
- [TP15] Cùng hạt giống và cùng các lựa chọn thì thành phố diễn ra y hệt đến từng món hàng và từng người vác; đổi hạt giống thì ra thành phố khác.

## Trận đánh và mua quân — `tests/BatBienTran.test.ts`

- [TR01] Cùng đội hình, cùng hạt giống thì trận diễn ra y hệt (kết quả, kịch bản, con số dự đoán), dù trước đó máy đã đánh bao nhiêu trận khác, theo thứ tự nào; tính trận không được sửa đội hình đưa vào, và đội hình bị khoá cứng vẫn tính được, ra y hệt.
- [TR02] Lính đã chết không sống lại, và đội đã vỡ thì rút hẳn: không đi nữa, không mất thêm lính, không đánh sau nhịp vỡ; mỗi đội vỡ nhiều nhất một lần, và tổng lính còn sống cuối trận đúng bằng quân số trừ số chết.
- [TR03] Không đội nào đi nhanh hơn tốc độ của nó (đã nhân hệ số địa hình), không đội nào ra khỏi chiến trường, và nhịp nào đội đang đánh thì nhịp đó đội đứng yên.
- [TR04] Một đội đánh khi và chỉ khi đội địch gần nhất còn đứng nằm trong tầm của nó, và một đội chỉ mất lính khi có đội địch đang đánh nhắm vào nó.
- [TR05] Kết quả, vết vị trí và kịch bản trận kể cùng một chuyện: bên đã vỡ hết không bao giờ thắng (hai bên cùng vỡ hết trong một nhịp thì bên giữ đất thắng), trận chỉ dừng trước hết giờ khi có bên vỡ hết, khung cuối và cảnh cuối đúng giây kết thúc và đúng bên thắng, mỗi sự kiện có đúng một cảnh, và thời gian không bao giờ lùi.
- [TR06] Khi có một bên đã vỡ hết thì trận dừng ngay đúng nhịp đội cuối cùng vỡ, không kéo thêm.
- [TR07] Con số % thắng hiện trước trận luôn nằm trong 0–100%; đổi bên trên địa hình trung lập thì ra phần bù; tướng giỏi hơn không làm tụt % của bên mình; địa hình phòng thủ mạnh hơn không làm bên đánh tới dễ thắng hơn.
- [TR08] (chưa bật) Mua quân: số vàng tiêu ra đúng bằng giá các đội thật sự được thêm vào quân — không trả tiền cho đội vừa mua đã bị giải ngũ ngay.
- [TR09] Mua quân chỉ mua loại đội đang mua được (đúng nhóm của loại mới nhất đã mở, không loại nào chưa tới thời đại), không vượt trần số đội, luôn xếp đội mạnh trước, vàng còn lại nằm trong khoảng 0 đến ngân sách, và không sửa danh sách quân cũ đưa vào.
- [TR10] Đánh chiếm một tỉnh: mỗi bên mất số đội đúng theo tỉ lệ lính chết (làm tròn, không quá số đội đã đưa vào), bên thua mất ít nhất một đội kể cả khi hết giờ chưa ai chết, bên thắng chiến dịch đúng là bên thắng trận, tỉnh trống thì thắng trắng không mất gì, không có quân thì không thắng, và % thắng luôn trong 0–100% và khớp kết quả khi không cần đánh.
- [TR11] (chưa bật) Mọi mức nhiễu mà bộ đọc battle.json chấp nhận thì các luật trận (TR02–TR07) vẫn đúng — nhiễu không bao giờ biến đòn đánh thành hồi máu.
- [TR12] (chưa bật) Mọi hàng xuất phát mà bộ đọc battle.json chấp nhận thì các luật trận vẫn đúng — quân luôn đứng trong chiến trường ngay từ giây 0.
- [TR13] (chưa bật) Mọi nhịp, độ dài trận và các thông số khác mà bộ đọc battle.json chấp nhận thì các luật trận vẫn đúng — trận dừng đúng giây hết giờ, không nhịp nào chạy lố.

## Lớp thế giới — `tests/BatBienTheGioi.test.ts`

- [TG01] Mỗi tỉnh luôn thuộc đúng một chủ: trung lập hoặc một nước còn sống; nước còn sống luôn giữ thủ đô gốc của mình, nước đã mất không còn tỉnh, không còn quân và không bao giờ sống lại.
- [TG02] Một tỉnh chỉ đổi chủ khi bị một nước giáp đất và đang chiến tranh với chủ cũ đánh chiếm (tỉnh trung lập thì không cần chiến tranh), khi chủ cũ vừa mất thủ đô vào tay bên đánh, hoặc khi nổi loạn tách đúng một tỉnh không phải thủ đô khỏi nước ta trong một giờ; nổi loạn chỉ nổ ra khi thẻ bất ổn đã bị bỏ mặc đủ số giờ quy định, nổ xong thì đếm lại từ đầu; lệnh đánh bị từ chối thì không tỉnh nào đổi chủ, và nước nào đánh xong cũng phải nghỉ đủ số giờ quy định mới được đánh tiếp.
- [TG03] Vàng của mọi nước luôn là số hữu hạn và không âm; ngoài lựa chọn thẻ bất ổn (vàng và văn hoá đổi đúng bằng số ghi trên lựa chọn), không lần bấm nút nào làm tổng vàng thế giới tăng hay làm văn hoá của nước nào giảm; qua mỗi giờ văn hoá không giảm, còn nước đã mất thì văn hoá đứng yên.
- [TG04] Sổ vàng khớp từng đồng: mỗi lần bấm nút, vàng đổi đúng theo nút đó (đàm phán trừ phí, đe doạ thắng thì chuyển cống nạp, thẻ cộng hoặc trừ đúng lựa chọn, đầu tư trừ đúng số đã đầu tư); mỗi giờ, vàng mỗi nước bằng vàng đầu giờ cộng thuế và tiền buôn, trừ đúng tiền mua quân, trừ phí mỗi lần AI đàm phán thành; nước đã mất thì vàng đứng yên.
- [TG05] (chưa bật) Tiền mua quân mỗi giờ bằng đúng giá các đội thật sự vào quân: không đồng vàng nào bị đốt vào một đội vừa mua đã bị giải ngũ ngay trong cùng lần mua.
- [TG06] Quân chỉ sinh ra bằng cách mua trong giờ game: bấm nút không bao giờ làm quân tăng; mua không đẩy quân vượt trần nuôi theo số tỉnh đầu giờ (trừ khi trước đó đã đông hơn trần); đội mới phải là loại mua được ở thời đại của nước đó; quân luôn xếp đội mạnh trước; quân trung lập giữ tỉnh không bao giờ đông hơn bộ ban đầu.
- [TG07] Khi ván còn đang chơi, chỉ số bất ổn luôn từ 0 tới dưới ngưỡng sụp; chạm ngưỡng sụp thì ván phải kết thúc ngay trong giờ đó.
- [TG08] (chưa bật) Thẻ bất ổn chỉ mở khi chỉ số bất ổn đang ở hoặc trên ngưỡng thẻ; cuối mỗi giờ, thẻ mở khi và chỉ khi chỉ số ở hoặc trên ngưỡng thẻ.
- [TG09] Nút trên màn hình thế giới luôn nói thật với mọi nước còn sống: nút Đàm phán, Buôn/Cắt buôn, Tấn công và từng lựa chọn thẻ sáng khi và chỉ khi bấm thật được nhận; nút khoá (kể cả nút thẻ bất ổn lúc thẻ đang đóng) thì bấm không đổi gì, và chữ lý do trên nút Tấn công đúng lý do thật; nút Tuyên chiến sáng thì bấm xong là chiến tranh; chữ 'đe doạ thắng' khớp kết quả thật; nút Tấn công sáng thì xác suất thắng nằm trong (0, 1].
- [TG10] Hai nước đang chiến tranh thì không bao giờ có tuyến buôn; điểm quan hệ luôn trong khoảng −100 tới 100, và quan hệ, trạng thái, tuyến buôn giữa hai nước nhìn từ phía nào cũng như nhau.
- [TG11] Ván kết thúc đúng lý do (mất thủ đô, sụp đổ, thống trị, khoa học, văn hoá, ngoại giao, hết giờ), đúng giờ kết và chỉ một lần, và màn kết ghi đúng thắng hay không thắng cùng giờ kết đó; sụp đổ chỉ khi bất ổn chạm ngưỡng sụp hoặc tới lúc nổi loạn mà không còn tỉnh nào ngoài thủ đô để mất; ván đã kết thì giờ có trôi tiếp thế giới cũng không đổi gì.
- [TG12] Nước AI chỉ tuyên chiến với láng giềng còn sống, chưa chiến, không phải đồng minh, quan hệ dưới ngưỡng và mạnh hơn đủ tỉ lệ; chỉ xin đàm phán khi đang chiến mà yếu hơn; chỉ ra lệnh đánh khi hết giờ nghỉ, còn quân, tỉnh giáp đất, đang chiến với chủ tỉnh (hoặc tỉnh trung lập) và dự đoán thắng đủ cao.
- [TG13] Cùng hạt giống và cùng chuỗi nút bấm thì hai thế giới chạy song song luôn có đúng một trạng thái và một nhật ký.

## Công nghệ, thẻ, thống đốc, đồng hồ — `tests/BatBienMeta.test.ts`

- [CN01] Phần trần nhà và trần kho thống đốc được nới luôn bằng đúng tổng phần nới trần của các công nghệ đã xong, các lựa chọn thẻ quyết định đã trả lời và các thẻ chính sách đang nằm trong ô; trần thống đốc đang dùng luôn bằng trần gốc của cấp ứng với số nhà (tính lại từ policy.json) cộng phần đã nới; lắp, tháo bao nhiêu lần cũng không tự sinh hay tự mất trần (với dữ liệu số ô chính phủ không giảm qua các thời đại).
- [CN02] Điểm nghiên cứu không tự sinh ra cũng không tự mất: mỗi giờ dồn đúng một lần, đúng bằng điểm cơ bản cộng số nhà chia cho số nhà mỗi điểm (làm tròn xuống) rồi nhân hệ số cộng dồn của các thẻ chính sách đang lắp; khi cây còn thứ để học, tổng điểm đã dồn luôn bằng tổng giá thực của các công nghệ đã xong cộng số điểm đang dồn dở, kể cả khi đổi công nghệ giữa chừng hay Eureka hạ giá.
- [CN03] Đủ điểm theo giá thực (đã trừ Eureka) thì công nghệ đang học phải xong ngay trong lần dồn điểm đó, còn chưa đủ điểm thì không bao giờ xong.
- [CN04] Không công nghệ nào xong trước tiền đề của nó; mỗi công nghệ xong đúng một lần và không bao giờ mất; mỗi giờ xong nhiều nhất một cái; công nghệ đang học luôn là cái chưa xong và đã đủ tiền đề.
- [CN05] Thời đại chỉ đi lên từng bậc một, chỉ khi đã đủ số công nghệ và số nhà thật của thành phố, không bao giờ lùi; đủ điều kiện thì phải lên ngay trong giờ đó.
- [CN06] Số ô chính phủ luôn bằng số ô của thời đại đang ở và không bao giờ giảm; thẻ trong các ô chỉ thay đổi khi người chơi lắp hoặc tháo thành công (lên đời không làm mất thẻ), ô chỉ chứa thẻ đã mở, và một thẻ không nằm ở hai ô.
- [CN07] Bộ thẻ chính sách đã mở luôn đúng bằng các thẻ mà những công nghệ đã học xong mở ra, không thừa không thiếu.
- [CN08] Thay hay tháo một ô đang có thẻ chỉ được khi đã chờ đủ số giờ đổi thẻ (tính theo giờ game thật) kể từ lần đổi trước; lắp thẻ đã mở vào ô trống có thật (thẻ không nằm ở ô khác) thì luôn được ngay; mọi trường hợp khác đều bị từ chối.
- [CN09] Mỗi Eureka nổ nhiều nhất một lần cả ván, chỉ khi thành phố thật sự làm được đúng việc của nó và khi công nghệ chưa học xong; giá công nghệ chỉ giảm đúng phần trăm ghi trong eureka.json (ít nhất còn 1) và không bao giờ tăng lại.
- [CN10] Giờ nào thành phố làm được việc của một Eureka mà công nghệ đó chưa xong và Eureka đó chưa nổ thì Eureka phải nổ ngay trong giờ đó, trước khi dồn điểm nghiên cứu của giờ đó (để công nghệ rẻ ngay giờ ấy).
- [CN11] Thẻ quyết định luôn hỏi đúng nhịp, xét trên số nhà, số kho thật của thành phố: không quá số thẻ tối đa một ván, đúng giờ quét, không dày hơn giãn cách (trừ thẻ khẩn), không hỏi lại cùng thẻ quá sớm, luôn hỏi thẻ điểm cao nhất trong số thẻ hợp lệ, có thẻ hợp lệ thì phải hỏi, và không chồng thẻ mới khi thẻ cũ chưa trả lời.
- [CN12] Thống đốc mỗi giờ làm nhiều nhất một việc, không bao giờ tự xây nhà hay kho khi đã chạm trần của cấp (trần tính lại từ policy.json, kể cả phần đã nới); việc ghi vào sổ là việc có thật (số nhà, số kho tăng đúng bằng sổ, chỉ cộng thêm phần thưởng xây của công nghệ vừa xong), và các ngưỡng của thống đốc không bao giờ âm.
- [CN13] Đồng hồ không bao giờ chạy nhiều nhịp hơn thời gian thật cho phép, ngoài phần bị cắt bỏ ở trần thì thiếu nhiều nhất một nhịp dù khung hình giật thế nào, mỗi lần chạy không quá trần (trần nhỏ hơn số nhịp của một giây ở tốc độ nhanh nhất), dừng hình hay thời gian không trôi thì đứng yên, và tổng số nhịp, số giờ luôn khớp.
- [CN14] Sau một lần bị cắt ở trần nhịp, đồng hồ bỏ hẳn phần thời gian dư, không chạy bù về sau.
- [CN15] Cùng hạt giống và cùng chuỗi lựa chọn thì hai ván chạy xen kẽ nhau giống hệt nhau ở từng giờ.
