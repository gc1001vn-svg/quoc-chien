/**
 * Ap hau qua cua mot lua chon len thanh pho va thong doc.
 *
 * Khong co duong dat nha thu hai: moi thu di qua `ThanhPho.xayNha` / `xayKho` cua Phase 5,
 * nen the quyet dinh va thong doc xay theo dung mot luat.
 */
import type { ThanhPho } from '../city/City.ts';
import type { Governor } from '../autoplay/Governor.ts';
import type { HauQua, LuaChon } from './Engine.ts';

/** Ten nguong cho nguoi doc. Chu hien tren man hinh, khong phai so can bang (luat 2). */
const TEN_NGUONG: Readonly<Record<string, string>> = {
  nguongCho: 'ngưỡng chờ hàng',
  nguongDinh: 'ngưỡng đông đường',
  nguongBoCuoc: 'ngưỡng bỏ cuộc',
};

/** Mot dong ke lai viec vua lam - de ghi vao nhat ky su kien. */
export interface DaLam {
  /** `xay:coi_xay x2` · `kho` · `nguongCho -10` · `tran nha +20`. */
  readonly viec: string;
  /** Lam duoc that khong. Ban do chat hay cham tran thi `false`. */
  readonly duoc: boolean;
}

/**
 * Ap mot hau qua. Tra ve tung viec da lam, ke ca viec **that bai** - the noi xay hai coi
 * xay ma ban do chi con cho cho mot cai thi nguoi choi phai duoc biet.
 */
export function apHauQua(hq: HauQua, tp: ThanhPho, td: Governor): DaLam[] {
  const ra: DaLam[] = [];

  for (const m of hq.xay ?? []) {
    let duoc = 0;
    for (let i = 0; i < m.so; i += 1) {
      if (tp.xayNha(m.ten)) duoc += 1;
    }
    const hien: string = tp.dsNha.find((n) => n.ten === m.ten)?.hien ?? m.ten;
    ra.push({
      viec: `Xây ${hien} ${String(duoc)}/${String(m.so)}`,
      duoc: duoc === m.so,
    });
  }

  if (hq.xayKho === true) {
    ra.push({ viec: 'Xây kho', duoc: tp.xayKho() });
  }

  for (const [ten, delta] of Object.entries(hq.doiNguong ?? {})) {
    td.doiNguong(ten, delta);
    const dau: string = delta > 0 ? '+' : '';
    ra.push({ viec: `${TEN_NGUONG[ten] ?? ten} ${dau}${String(delta)}`, duoc: true });
  }

  const nt = hq.noiTran;
  if (nt !== undefined) {
    td.noiTran(nt.nha ?? 0, nt.kho ?? 0);
    const phan: string[] = [];
    if (nt.nha !== undefined) phan.push(`nhà +${String(nt.nha)}`);
    if (nt.kho !== undefined) phan.push(`kho +${String(nt.kho)}`);
    ra.push({ viec: `Nới trần ${phan.join(', ')}`, duoc: true });
  }

  return ra;
}

/** Ap mot lua chon. Chi la `apHauQua` cua no - de cho ben goi khoi phai mo `hauQua` ra. */
export function chon(lc: LuaChon, tp: ThanhPho, td: Governor): DaLam[] {
  return apHauQua(lc.hauQua, tp, td);
}
