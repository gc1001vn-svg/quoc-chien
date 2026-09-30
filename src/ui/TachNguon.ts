/**
 * Bang tach nguon con so cua chinh sach (Thu 3, 30/09 - hoc Crusader Kings 3: moi con so
 * noi no cong tu dau, 2 tang la vua).
 *
 * CHI DOC `Meta`: he so nghien cuu, diem/gio, tran thong doc. Cong lai tung dong phai ra
 * DUNG con so mo phong dang chay - test giu (`tests/TachNguon.test.ts`).
 *
 * `tachNguon` thuan (chay duoc trong Node); `khoiTachNguon` dung DOM, chi goi o trinh duyet.
 */
import type { Meta } from '../sim/meta/Meta.ts';

/** Mot dong cong: ten nguon va so no gop vao. */
export interface DongNguon {
  readonly ten: string;
  readonly so: number;
}

/** Mot con so va cac dong cong ra no. */
export interface SoTach {
  readonly tong: number;
  readonly dong: readonly DongNguon[];
}

export interface TachNguon {
  /** Phan tram. Cham san thi `san` > 0 la phan san keo len. */
  readonly nghienCuu: SoTach & { readonly san: number };
  readonly diemMoiGio: SoTach & { readonly heSo: number };
  readonly tranNha: SoTach;
  readonly tranKho: SoTach;
}

export function tachNguon(m: Meta): TachNguon {
  const cs = m.chinhSach;
  const lap = cs.dangLap.filter((t) => t !== undefined);

  const dongNC: DongNguon[] = [{ ten: 'Gốc', so: 100 }];
  for (const t of lap) if (t.heSoNghienCuu !== 100) dongNC.push({ ten: t.hien, so: t.heSoNghienCuu - 100 });
  const cong = dongNC.reduce((s, d) => s + d.so, 0);
  const heSo = cs.heSoNghienCuu;

  const so = m.soTachNguon;
  const coBan = m.cay.diemMoiGio(0, 100);
  const tho = m.cay.diemMoiGio(so.soNha, 100);

  const tran = (loai: 'nha' | 'kho'): SoTach => {
    const tong = loai === 'nha' ? so.cap.tranNha : so.cap.tranKho;
    const chinhSach = cs.tongNoiTran[loai];
    const quyetDinh = so.them[loai] - chinhSach;
    const dong: DongNguon[] = [{ ten: 'Thống đốc', so: tong - so.them[loai] }];
    for (const t of lap) if (t.noiTran[loai] !== 0) dong.push({ ten: t.hien, so: t.noiTran[loai] });
    if (quyetDinh !== 0) dong.push({ ten: 'Thẻ quyết định đã chọn', so: quyetDinh });
    return { tong, dong };
  };

  return {
    nghienCuu: { tong: heSo, dong: dongNC, san: heSo - cong },
    diemMoiGio: {
      tong: m.diemMoiGio,
      heSo,
      dong: [{ ten: 'Cơ bản', so: coBan }, { ten: `Theo ${String(so.soNha)} nhà`, so: tho - coBan }],
    },
    tranNha: tran('nha'),
    tranKho: tran('kho'),
  };
}

const dau = (n: number): string => (n >= 0 ? `+${String(n)}` : `−${String(-n)}`);

/** Khoi DOM cho tab "Chinh sach": moi con so mot dong dam, cac nguon xep duoi. */
export function khoiTachNguon(m: Meta): HTMLElement {
  const t = tachNguon(m);
  const goc: HTMLDivElement = document.createElement('div');
  goc.className = 'tach-nguon';
  const muc = (tieuDe: string, dong: readonly DongNguon[], them: readonly string[] = []): void => {
    const b: HTMLElement = document.createElement('b');
    b.textContent = tieuDe;
    const ds: HTMLElement = document.createElement('span');
    ds.textContent = [...dong.map((d, i) => `${i === 0 ? String(d.so) : dau(d.so)} ${d.ten}`), ...them].join(' · ');
    goc.append(b, ds);
  };
  const nc = t.nghienCuu;
  muc(`Nghiên cứu ${String(nc.tong)} %`, nc.dong, nc.san > 0 ? [`${dau(nc.san)} sàn tối thiểu`] : []);
  const d = t.diemMoiGio;
  muc(`${String(d.tong)} điểm/giờ`, d.dong, [`× ${String(d.heSo)} %`]);
  muc(`Trần nhà ${String(t.tranNha.tong)}`, t.tranNha.dong);
  muc(`Trần kho ${String(t.tranKho.tong)}`, t.tranKho.dong);
  return goc;
}
