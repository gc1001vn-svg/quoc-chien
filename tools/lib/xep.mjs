/**
 * Xep o vao atlas kieu ke (shelf).
 *
 * Khong dung MaxRects: sprite cua game nay cao thap kha deu, ke da lap day > 80%, ma code
 * chi 40 dong. Doi thuat toan khi nao bang in ra cho thay lap day tut xuong.
 *
 * Khong import gi -> dung duoc ca trong Node lan trong trang nuong.
 */

/** Cot duoi mot o da xep, con du cho o `m` khong. Tra cot dau tien vua, hay undefined. */
function timCot(trang, m) {
  for (const t of trang) {
    for (const k of t.ke) {
      const c = (k.cot ?? []).find((c) => m.w <= c.w && c.y + m.h <= c.day);
      if (c !== undefined) return c;
    }
  }
  return undefined;
}

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

  // Moi trang la mot chong KE; ke nao cung nhan them o vao khe ben phai cua no, khong
  // chi ke dang mo. Da xep theo chieu cao giam dan nen o sau luon thap hon ke cu - lot
  // vua. Het ke thi mo ke moi o trang con cho, het trang moi mo trang moi.
  // Do 27/09: me hex_1 them 12 sprite thi ban xep cu (chi mot ke mo, mot trang mo) day 8
  // o sang trang 2 (lap 2,8%) trong khi trang 1 con khe - ton them 16,8 MB GPU.
  // Luon co it nhat mot trang, ke ca khi khong co o nao - giu dung hanh vi cu.
  const trang = [{ ke: [], day: le }];
  dienTich.push(0);

  for (const m of theoChieuCao) {
    // Truoc het: chong xuong DUOI mot o da xep trong cung ke, neu ngang vua va con du cao
    // (ke cao 243 ma o co 86 thi duoi no con khe 150 - bo phi la mat mot trang).
    const cot = timCot(trang, m);
    if (cot !== undefined) {
      ra.push({ ten: m.ten, trang: cot.so, x: cot.x, y: cot.y, w: m.w, h: m.h });
      dienTich[cot.so] += m.w * m.h;
      cot.y += m.h + le;
      continue;
    }
    let so = -1;
    let ke;
    for (let i = 0; i < trang.length && ke === undefined; i += 1) {
      ke = trang[i].ke.find((k) => m.h <= k.cao && k.x + m.w + le <= canh);
      if (ke === undefined && trang[i].day + m.h + le <= canh) {
        ke = { y: trang[i].day, cao: m.h, x: le };
        trang[i].ke.push(ke);
        trang[i].day += m.h + le;
      }
      if (ke !== undefined) so = i;
    }
    if (ke === undefined) {
      ke = { y: le, cao: m.h, x: le };
      trang.push({ ke: [ke], day: le + m.h + le });
      dienTich.push(0);
      so = trang.length - 1;
    }
    ra.push({ ten: m.ten, trang: so, x: ke.x, y: ke.y, w: m.w, h: m.h });
    dienTich[so] += m.w * m.h;
    (ke.cot ??= []).push({ so, x: ke.x, w: m.w, y: ke.y + m.h + le, day: ke.y + ke.cao });
    ke.x += m.w + le;
  }

  return {
    o: ra,
    soTrang: trang.length,
    lapDay: dienTich.map((d) => (d / (canh * canh)) * 100),
  };
}
