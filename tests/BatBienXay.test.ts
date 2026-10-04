/**
 * Luat bat bien XAY NHA TUNG BUOC (Buoc 1, 04/10; cau `[TP16]` o `docs/LUAT_BAT_BIEN.md`). Qua nhieu hat giong boc bang `Rng`,
 * nguoi choi gia xay nha va kho o nhip ngau nhien; kiem nhip khoi cong sim ghi (`OVat.nhipXay`) va tien do lop ve doc ra tu no
 * (`src/render/TungBuoc.ts`). Thuong: it hat; `LUAT_SAU=1`: >= 50 hat. Chi doc API cong khai; so doc tu `data/*.json`.
 */
import { describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import { laDuong, type OVat } from '../src/sim/city/BanDo.ts';
import { SO_XAY, tienDoXay } from '../src/render/TungBuoc.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
// --- Tham so thu, KHONG phai so can bang. ---
const SAU = process.env.LUAT_SAU === '1';
const [SO_HAT, LAN_XAY, NHIP_GIUA_TOI_DA, HAT_GOC, TI_LE_KHO] = [SAU ? 50 : 3, SAU ? 120 : 30, 400, 20261004, 0.25];
const HAN_MS = SAU ? 20 * 60_000 : 60_000;
const T = SO_XAY.thoiLuongNhip;
const TEN_NHA: readonly string[] = nha.nha.map((n) => n.ten);
const S = String;

/** Vi pham dau tien, hay '' khi dung luat. */
function kiemMotHat(i: number): string {
  const r = new Rng(HAT_GOC + i);
  const tp = new ThanhPho({
    hang, nha, chuoi, banDo: { ...banDo, hatGiong: i === 0 ? banDo.hatGiong : r.nguyen(2 ** 31) },
    walker: { ...walker, hatGiongDatNha: i === 0 ? walker.hatGiongDatNha : r.nguyen(2 ** 31) },
  });
  const ten = `hat ${S(i)}`;
  const cu = new Set<OVat>(tp.banDo.vat);
  const dangXay: { v: OVat; nhip: number }[] = [];
  for (let lan = 0; lan < LAN_XAY; lan += 1) {
    tp.chay(1 + r.nguyen(NHIP_GIUA_TOI_DA));
    const bay = tp.dongHo.soNhip;
    // Nhung cai dang xay: chua toi `thoiLuongNhip` thi chua du hinh, toi roi thi phai du - dung, tua cung vay.
    for (const { v, nhip } of dangXay) {
      const xong = tienDoXay(v.nhipXay, bay).giaiDoan === 'xong';
      if (xong !== (bay - nhip >= T)) return `${ten}: vat (${S(v.a)},${S(v.b)}) khoi cong nhip ${S(nhip)}, o nhip ${S(bay)} xong=${S(xong)}`;
    }
    const soNha = tp.soNha;
    const laKho = r.so() < TI_LE_KHO;
    const nhaGi = TEN_NHA[r.nguyen(TEN_NHA.length)] ?? '';
    const duoc = laKho ? tp.xayKho() : tp.xayNha(nhaGi);
    const moi = tp.banDo.vat.filter((v) => !cu.has(v));
    for (const v of moi) cu.add(v);
    if (!duoc) continue;
    if (!laKho && tp.soNha !== soNha + 1) return `${ten}: xay ${nhaGi} o nhip ${S(bay)} ma so nha ${S(soNha)} -> ${S(tp.soNha)}`;
    if (!laKho && moi.length !== 1) return `${ten}: xay ${nhaGi} them ${S(moi.length)} vat`;
    for (const v of moi) {
      if (v.nhipXay !== bay) return `${ten}: vat moi (${S(v.a)},${S(v.b)}) ghi nhip ${S(v.nhipXay)}, xay luc nhip ${S(bay)}`;
      if (laDuong(v, banDo.duongCach)) return `${ten}: vat dang xay (${S(v.a)},${S(v.b)}) nam tren duong`;
      if (tienDoXay(v.nhipXay, bay).giaiDoan === 'xong') return `${ten}: vat vua khoi cong da du hinh`;
      if (tienDoXay(v.nhipXay, bay + T - 1).giaiDoan === 'xong' || tienDoXay(v.nhipXay, bay + T).giaiDoan !== 'xong') {
        return `${ten}: vat khoi cong nhip ${S(bay)} khong xong dung nhip ${S(bay + T)}`;
      }
      dangXay.push({ v, nhip: bay });
    }
    // Nha dang xay van chay: no co trong danh sach nha ngay nhip xay, dung cho cua no.
    const cuoi = tp.dsNhaThat()[tp.soNha - 1];
    const vNha = moi[0];
    if (!laKho && (cuoi?.oNha.a !== vNha?.a || cuoi?.oNha.b !== vNha?.b)) return `${ten}: nha moi khong vao danh sach nha chay ngay nhip xay`;
  }
  for (const v of tp.banDo.vat) {
    if (v.nhipXay === undefined) continue;
    if (v.nhipXay < 0 || v.nhipXay > tp.dongHo.soNhip) return `${ten}: vat (${S(v.a)},${S(v.b)}) nhip khoi cong ${S(v.nhipXay)} ngoai [0, ${S(tp.dongHo.soNhip)}]`;
  }
  return dangXay.length === 0 ? `${ten}: khong xay duoc gi - luat khong duoc kiem` : '';
}

describe('Luat bat bien - xay nha tung buoc', () => {
  it('[TP16] nha, kho xay them ghi dung nhip khoi cong, chay ngay, xong dung gio', () => {
    for (let i = 0; i < SO_HAT; i += 1) expect(kiemMotHat(i)).toBe('');
  }, HAN_MS);
});
