/**
 * Luat bat bien con so % thang hien truoc tran, ma [TR07] [TR15] trong `docs/LUAT_BAT_BIEN.md` (muc tran danh). Tach khoi
 * `BatBienTran.test.ts` vi tu 04/10 `duDoan` chay that `so_tran_du_doan` tran moi lan: kiem tren moi tran cua file do thi
 * cham gap chuc lan. `LUAT_SAU=1`: nhieu hat giong hon.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { docDuLieuTran, duDoan, tinhTran, type Ben, type DauVaoTran, type DuLieuTran } from '../src/sim/campaign/Battle.ts';
import { loai } from '../src/sim/campaign/BattleData.ts';
import bangTho from '../data/armor_table.json';
import doiTho from '../data/units.json';
import tranTho from '../data/battle.json';
import theGioi from '../data/the_gioi.json';

const SAU = process.env.LUAT_SAU === '1';
const SO_HAT = SAU ? 300 : 20;
const [HAT_THAT, SO_TRAN_THAT] = [100_000, 200]; // TR15: ti le thang that dem qua 200 hat KHAC bo hat du doan (1..n)
const SO_LAN_SAI_SO = 4; // TR15: lech toi da = 4 lan sai so cua phep dem (hai ben cung dem tran, khong bao gio khop tuyet doi)
const du: DuLieuTran = docDuLieuTran(bangTho, doiTho, tranTho);
const IDS: string[] = [...du.doi.keys()];
const NHOM: string[] = [...new Set([...du.doi.values()].map((l) => l.nhom))];
const viPham = new Map<string, { so: number; vd: string[] }>();
const ghi = (ma: string, chiTiet: string): void => {
  const v = viPham.get(ma) ?? { so: 0, vd: [] };
  viPham.set(ma, { so: v.so + 1, vd: v.vd.length < 3 ? [...v.vd, chiTiet] : v.vd });
};
const chon = <T>(r: Rng, ds: readonly T[]): T => ds[r.nguyen(ds.length)] as T;
const tiLeThang = (vao: DauVaoTran, tu: number, n: number): number => {
  let thang = 0;
  for (let hat = tu; hat < tu + n; hat++) if (tinhTran(vao, du, hat).thang === 'a') thang += 1;
  return thang / n;
};

/** Bon kieu doi hinh nhu `BatBienTran.test.ts`: tron moi loai, mot nhom, mot loai, hai loai. */
function sinhBen(r: Rng): Ben {
  const [kieu, nhom] = [r.nguyen(4), chon(r, NHOM)];
  const ds = kieu === 0 ? IDS : kieu === 1 ? IDS.filter((id) => loai(du, id).nhom === nhom) : [chon(r, IDS), chon(r, IDS)].slice(0, kieu - 1);
  return { doi: Array.from({ length: 1 + r.nguyen(theGioi.quan.doi_moi_tran) }, () => chon(r, ds)), tuong: r.nguyen(du.tuongToiDa + 1) };
}

function kiemHat(hat: number): void {
  const r = new Rng(Math.imul(hat, 0x9e3779b1) ^ 0x7e57);
  const vao: DauVaoTran = { a: sinhBen(r), b: sinhBen(r), diaHinh: chon(r, [...du.diaHinh.keys()]) };
  const tai = `hat ${String(hat)}, a=[${vao.a.doi.join(',')}] tuong ${String(vao.a.tuong)}, b=[${vao.b.doi.join(',')}] tuong ${String(vao.b.tuong)}, ${vao.diaHinh}`;
  const [p, som] = [duDoan(vao, du), du.soTranDungSom];
  // TR07: trong 0-100 %, dung bang ti le thang dem lai tren bo hat du doan (bo nho khong tra nham so cua cap khac).
  // Dung som: `som` tran dau cung mot ben thang thi du doan la 0 hoac 1, va chi khi do (dem den het thi khong con 0 / 1).
  if (!(p >= 0 && p <= 1)) ghi('TR07', `${tai}: du doan ${String(p)} ngoai [0, 1]`);
  const dau = tiLeThang(vao, 1, som);
  const [n, demLai] = dau === 0 || dau === 1 ? [som, dau] : [du.soTranDuDoan, tiLeThang(vao, 1, du.soTranDuDoan)];
  if (p !== demLai) ghi('TR07', `${tai}: du doan ${String(p)}, dem lai ${String(n)} tran ra ${String(demLai)}`);
  for (let t = 0; t < du.tuongToiDa; t++) {
    const [a0, a1] = [t, t + 1].map((x) => duDoan({ ...vao, a: { ...vao.a, tuong: x } }, du)) as [number, number];
    const [b0, b1] = [t, t + 1].map((x) => duDoan({ ...vao, b: { ...vao.b, tuong: x } }, du)) as [number, number];
    if (a1 < a0) ghi('TR07', `${tai}: tuong ben a ${String(t)} -> ${String(t + 1)}: % thang tut ${String(a0)} -> ${String(a1)}`);
    if (b1 > b0) ghi('TR07', `${tai}: tuong ben b ${String(t)} -> ${String(t + 1)}: % thang ben a tang ${String(b0)} -> ${String(b1)}`);
  }
  // TR15: sai so phep dem tinh tu ti le da lam tron nhe (cong nua tran), de ca hai 0 % hay 100 % van con khoang cho.
  const q = tiLeThang(vao, HAT_THAT, SO_TRAN_THAT);
  const [pm, qm] = [(p * n + 0.5) / (n + 1), (q * SO_TRAN_THAT + 0.5) / (SO_TRAN_THAT + 1)];
  const tran = SO_LAN_SAI_SO * Math.sqrt((pm * (1 - pm)) / n + (qm * (1 - qm)) / SO_TRAN_THAT);
  if (Math.abs(p - q) > tran) ghi('TR15', `${tai}: du doan ${(100 * p).toFixed(1)} %, thang that ${(100 * q).toFixed(1)} % qua ${String(SO_TRAN_THAT)} tran, lech qua ${(100 * tran).toFixed(1)} diem`);
}
const kiemMa = (ma: string): void => { const v = viPham.get(ma); expect(v?.vd ?? [], `${ma}: ${String(v?.so ?? 0)} vi pham`).toEqual([]); };

describe('luat bat bien con so % thang', () => {
  beforeAll(() => { for (let hat = 1; hat <= SO_HAT; hat++) kiemHat(hat); }, SAU ? 900_000 : 30_000);

  it('[TR07] % thang trong 0-100, dung bang ti le thang tren bo hat du doan, tuong gioi hon khong lam tut', () => { kiemMa('TR07'); });
  it('[TR15] % thang khop ti le thang that cua tung doi hinh, trong 4 lan sai so phep dem', () => { kiemMa('TR15'); });
});
