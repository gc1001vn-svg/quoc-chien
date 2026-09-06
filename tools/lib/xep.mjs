/**
 * Xep o vao atlas kieu ke (shelf).
 *
 * Khong dung MaxRects: sprite cua game nay cao thap kha deu, ke da lap day > 80%, ma code
 * chi 40 dong. Doi thuat toan khi nao bang in ra cho thay lap day tut xuong.
 *
 * Khong import gi -> dung duoc ca trong Node lan trong trang nuong.
 */

/**
 * @param {{ten: string, w: number, h: number}[]} o Danh sach o can xep.
 * @param {number} canh Canh atlas, diem anh.
 * @param {number} le Khoang ho giua hai o, tranh ri mau khi loc tuyen tinh.
 * @returns {{o: {ten: string, trang: number, x: number, y: number, w: number, h: number}[],
 *            soTrang: number, lapDay: number[]}}
 */
export function xep(o, canh, le = 2) {
  for (const m of o) {
    if (m.w > canh || m.h > canh) {
      throw new Error(`O "${m.ten}" ${m.w}x${m.h} lon hon canh atlas ${canh}`);
    }
  }

  const theoChieuCao = [...o].sort((a, b) => b.h - a.h || b.w - a.w);
  const ra = [];
  const dienTich = [];

  let trang = 0;
  let x = le;
  let y = le;
  let caoKe = 0;
  dienTich.push(0);

  for (const m of theoChieuCao) {
    if (x + m.w + le > canh) {
      // Het cho tren ke nay -> xuong ke moi.
      x = le;
      y += caoKe + le;
      caoKe = 0;
    }
    if (y + m.h + le > canh) {
      // Het cho ca trang -> mo trang moi.
      trang += 1;
      dienTich.push(0);
      x = le;
      y = le;
      caoKe = 0;
    }
    ra.push({ ten: m.ten, trang, x, y, w: m.w, h: m.h });
    dienTich[trang] += m.w * m.h;
    x += m.w + le;
    if (m.h > caoKe) caoKe = m.h;
  }

  return {
    o: ra,
    soTrang: trang + 1,
    lapDay: dienTich.map((d) => (d / (canh * canh)) * 100),
  };
}
