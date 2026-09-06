/**
 * Điều khiển Chromium bằng giao thức DevTools — không cần Playwright.
 *
 * TAI SAO VIET TAY: `scripts/smoke_browser.mjs` phai cai Playwright o ngoai (/tmp/pw)
 * moi chay duoc, ma Playwright KHONG phai thu vien cua du an - CLAUDE.md bat hoi truoc
 * khi them. Chromium tu no da mo san mot cong dieu khien; Node 22 da co san WebSocket.
 * Ghep hai cai co san lai la du dung, khong them mot goi npm nao.
 *
 * Chi lam dung nhung viec dang can: mo trang, cho mot dieu kien thanh that, doc mot
 * chuoi trong trang, chup anh. Can them thi them, dung viet lai ca Playwright.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** @returns {Promise<void>} */
const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

export class TrinhDuyet {
  /**
   * @param {string} chromium Đường dẫn file chạy Chromium.
   * @param {number} cong Cổng điều khiển DevTools.
   */
  constructor(chromium, cong) {
    this.chromium = chromium;
    this.cong = cong;
    this.hoSo = mkdtempSync(join(tmpdir(), 'chup-'));
    this.tien = 0;
    this.cho = new Map();
    this.ws = null;
    this.phien = null;
    this.tienTrinh = null;
  }

  /** @returns {Promise<void>} Bật Chromium và nối vào cổng điều khiển. */
  async mo() {
    this.tienTrinh = spawn(this.chromium, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu-sandbox',
      // May ao khong co GPU that: bat ve bang phan mem, khong thi ra khung den.
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-dev-shm-usage',
      // Cat het duong ra Internet cua trinh duyet: may ao bi chan, de nguyen thi no
      // goi google.com hang chuc lan roi bao loi day man hinh.
      '--disable-background-networking',
      // May ao chi ra ngoai qua proxy cua phien. Khong khai thi Chromium khong mo duoc
      // trang nao ngoai localhost - ra thang trang loi "Reload". CA cua proxy da nam san
      // trong kho NSS (~/.pki/nssdb) nen KHONG duoc tat kiem tra chung chi.
      ...(process.env.HTTPS_PROXY
        ? [`--proxy-server=${process.env.HTTPS_PROXY}`, '--proxy-bypass-list=127.0.0.1;localhost']
        : []),
      '--disable-component-update',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${this.hoSo}`,
      `--remote-debugging-port=${this.cong}`,
      'about:blank',
    ], { stdio: 'ignore' });

    const diaChiWs = await this.timDiaChiWs();
    this.ws = new WebSocket(diaChiWs);
    this.ws.addEventListener('message', (e) => this.nhanTin(e.data));
    await new Promise((ok, hong) => {
      this.ws.addEventListener('open', ok, { once: true });
      this.ws.addEventListener('error', () => hong(new Error('Khong noi duoc vao Chromium')), { once: true });
    });

    const { targetId } = await this.goi('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.goi('Target.attachToTarget', { targetId, flatten: true });
    this.phien = sessionId;
    await this.goi('Page.enable');
    await this.goi('Runtime.enable');
  }

  /** @returns {Promise<string>} Địa chỉ WebSocket của trình duyệt. */
  async timDiaChiWs() {
    for (let i = 0; i < 40; i += 1) {
      try {
        const r = await fetch(`http://127.0.0.1:${this.cong}/json/version`, {
          signal: AbortSignal.timeout(1000),
        });
        if (r.ok) return (await r.json()).webSocketDebuggerUrl;
      } catch {
        // Chua san sang - doi tiep.
      }
      await nghi(250);
    }
    throw new Error(`Chromium khong mo cong dieu khien ${this.cong} sau 10 giay`);
  }

  /** @param {string} tin @returns {void} */
  nhanTin(tin) {
    const doc = JSON.parse(tin);
    const chua = this.cho.get(doc.id);
    if (chua === undefined) return;
    this.cho.delete(doc.id);
    if (doc.error !== undefined) chua.hong(new Error(doc.error.message));
    else chua.ok(doc.result);
  }

  /**
   * @param {string} lenh
   * @param {Record<string, unknown>} thamSo
   * @returns {Promise<Record<string, unknown>>}
   */
  goi(lenh, thamSo = {}) {
    this.tien += 1;
    const id = this.tien;
    const goiTin = { id, method: lenh, params: thamSo };
    if (this.phien !== null && !lenh.startsWith('Target.')) goiTin.sessionId = this.phien;
    this.ws.send(JSON.stringify(goiTin));
    return new Promise((ok, hong) => {
      this.cho.set(id, { ok, hong });
      setTimeout(() => {
        if (this.cho.delete(id)) hong(new Error(`Qua han khi goi ${lenh}`));
      }, 120000);
    });
  }

  /**
   * Ép kích thước màn hình đúng bằng máy thật.
   *
   * Lam qua day chu KHONG qua `--window-size`: co `--window-size` van tru 87 diem anh
   * cho thanh cong cu du dang chay an, chup ra la dinh mot dai den o day.
   *
   * @param {number} rong @param {number} cao @param {number} tiLe @returns {Promise<void>}
   */
  async datManHinh(rong, cao, tiLe) {
    await this.goi('Emulation.setDeviceMetricsOverride', {
      width: rong, height: cao, deviceScaleFactor: tiLe, mobile: true,
    });
    await this.goi('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  }

  /** @param {string} diaChi @returns {Promise<void>} */
  async moTrang(diaChi) {
    await this.goi('Page.navigate', { url: diaChi });
  }

  /**
   * @param {string} bieuThuc Đoạn JS chạy trong trang.
   * @returns {Promise<unknown>} Giá trị trả về.
   */
  async doc(bieuThuc) {
    const kq = await this.goi('Runtime.evaluate', {
      expression: bieuThuc, returnByValue: true, awaitPromise: true,
    });
    return kq.result?.value;
  }

  /**
   * Chờ tới khi biểu thức trong trang thành `true`.
   *
   * @param {string} bieuThuc @param {number} hanMs
   * @returns {Promise<boolean>} `false` nếu hết hạn mà vẫn chưa thành.
   */
  async choDen(bieuThuc, hanMs) {
    const het = Date.now() + hanMs;
    while (Date.now() < het) {
      try {
        if ((await this.doc(bieuThuc)) === true) return true;
      } catch {
        // Trang dang doi, doc khong duoc - thu lai.
      }
      await nghi(300);
    }
    return false;
  }

  /** @returns {Promise<Buffer>} Ảnh PNG. */
  async chup() {
    const kq = await this.goi('Page.captureScreenshot', { format: 'png' });
    return Buffer.from(kq.data, 'base64');
  }

  /** @returns {Promise<void>} */
  async dong() {
    try {
      this.ws?.close();
      this.tienTrinh?.kill('SIGTERM');
      await nghi(300);
      this.tienTrinh?.kill('SIGKILL');
    } catch {
      // Da chet roi.
    }
    rmSync(this.hoSo, { recursive: true, force: true });
  }
}
