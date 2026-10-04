// Chạy trong trang TRƯỚC mã game (Playwright MCP `--init-script`, xem scripts/mcp_trinh_duyet.mjs).
//
// Hai việc:
// 1. Ghi nhật ký tiếng vào `window.__am` — giải mã, mỗi lần phát (độ dài), file media.
//    Đọc bằng browser_evaluate: () => window.__am
// 2. Vá thiếu bộ giải mã: Chromium bản mở của máy ảo KHÔNG giải mã AAC, H.264 (đo 04/10:
//    canPlayType rỗng; MP3, OGG được). Game Unity gặp file AAC là bật alert() rồi đứng trang —
//    trông như treo. Hỏng thì trả đoạn im lặng 1 giây để game chạy tiếp, ghi `giai_ma_hong`.
(() => {
  // Trần số dòng: chơi lâu không phình bộ nhớ trang.
  const TRAN_DONG = 2000;
  const log = (window.__am = []);
  const t0 = performance.now();
  const ghi = (loai, chiTiet) => {
    if (log.length < TRAN_DONG) log.push({ t: Math.round(performance.now() - t0), loai, chiTiet });
  };

  const giaiMa = BaseAudioContext.prototype.decodeAudioData;
  // Không nhận hàm báo lỗi của game: hỏng thì vẫn trả đoạn im lặng qua `ok`.
  BaseAudioContext.prototype.decodeAudioData = function (duLieu, ok) {
    ghi('giai_ma', duLieu?.byteLength);
    return giaiMa.call(this, duLieu).then(
      (b) => { ok?.(b); return b; },
      (e) => {
        ghi('giai_ma_hong', String(e));
        const b = this.createBuffer(1, this.sampleRate, this.sampleRate);
        ok?.(b);
        return b;
      },
    );
  };

  const batDau = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...r) {
    ghi('phat', this.buffer ? `${this.buffer.duration.toFixed(2)}s` : '?');
    return batDau.apply(this, r);
  };

  const phat = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    ghi('media', this.currentSrc || this.src);
    return phat.call(this);
  };
})();
