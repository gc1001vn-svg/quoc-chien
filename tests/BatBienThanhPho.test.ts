/**
 * Luat bat bien THANH PHO (ke hoach da duyet `docs/ke-hoach/2026-10-03-luat-bat-bien.md` muc 1, 3; cau tung ma `[TPxx]` o
 * `docs/LUAT_BAT_BIEN.md`). Moi luat chay qua NHIEU hat giong boc bang `Rng`; `beforeAll` chay MOT lan moi hat giong, kiem MOI luat
 * trong lan do, gom vi pham theo ma; moi `it` doi danh sach cua ma minh rong va in phan vi du dau tien. Thuong: it hat, thanh pho
 * 2 gio. `LUAT_SAU=1`: >= 50 hat, 10 gio. Chi doc API cong khai; so can bang doc tu `data/*.json`, so go tay la tham so thu. */
import { beforeAll, describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import { chamDiem } from '../src/sim/city/Cham.ts';
import { laDuong, sinhBanDo, type O } from '../src/sim/city/BanDo.ts';
import { buocKeTiep } from '../src/sim/city/Walkers.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import policy from '../data/policy.json';

// --- Tham so thu, KHONG phai so can bang. ---
const SAU = process.env.LUAT_SAU === '1';
const TS = SAU
  ? { hatVan: 50, gioVan: 10, hatTatDinh: 10, gioTatDinh: 3, hatBoCuoc: 10, gioBoCuoc: 2, hatXay: 200, lanXay: 400, hatDuong: 50 }
  : { hatVan: 2, gioVan: 2, hatTatDinh: 1, gioTatDinh: 0.5, hatBoCuoc: 1, gioBoCuoc: 1, hatXay: 12, lanXay: 60, hatDuong: 3 };
const HAN_MS = SAU ? 30 * 60_000 : 60_000;
const [HAT_GOC, KIEM_MOI, VAN_TAY_MOI, SO_CAP_DUONG] = [20261003, 10, 600, 2000]; // KIEM_MOI: nhip giua hai lan kiem dinh ky
const [XAY_MOI, TI_LE_KHO] = [NHIP_MOI_GIO / 6, 0.25]; // nguoi choi gia xay mot viec moi 10 phut game, 1/4 la kho
const EP = { buocToiDa: 40, tranLay: 10, tranGiao: 40, tranWalker: 50 }; // ban ep: bo cuoc som (phu tra hang ve nha), tran nho (TP08 cham tran that)
// --- So doc tu data/ ---
const [CANH, C, MOI_CHUYEN] = [banDo.canh, banDo.duongCach, walker.moiChuyen];
const TEN_HANG: readonly string[] = hang.hang.map((h) => h.ten);
const CHI_SO_HANG = new Map(TEN_HANG.map((t, i) => [t, i]));
const TRAN_HANG = new Map(hang.hang.map((h) => [h.ten, h.tran]));
const HAO_HANG = new Map(hang.hang.map((h) => [h.ten, h.hao]));
const TEN_NHA: readonly string[] = nha.nha.map((n) => n.ten);
const VAO = new Map(nha.nha.map((n) => [n.ten, n.vao.map((m) => m.hang)]));
const RA = new Map(nha.nha.map((n) => [n.ten, n.ra as readonly { hang: string; so: number }[]]));
const HANG_NHA = new Map(TEN_NHA.map((t) => [t, [...new Set([...(VAO.get(t) ?? []), ...(RA.get(t) ?? []).map((m) => m.hang)])]])); // kho rieng chi giu cac mon nay
const VANH = banDo.vanh.map((v) => ({ khu: v.khu, tu: v.tu, den: v.den, goc: 'goc' in v ? v.goc : undefined }));
const DUONG_CUOI = Math.floor((CANH - 1) / C) * C; // duong cuoi cung con nam TRONG ban do
// --- Ghi vi pham. Chi dung chuoi cho lan sai dau tien: mot luat do co the sai hang tram nghin lan. ---
const viPham = new Map<string, { dem: number; dau: string }>();
const soLanKiem = new Map<string, number>();
const daKiem = (...ma: string[]): void => { for (const m of ma) soLanKiem.set(m, (soLanKiem.get(m) ?? 0) + 1); };
let boCuocEp = 0;
const ghi = (ma: string, chiTiet: () => string): void => { const cu = viPham.get(ma); if (cu === undefined) viPham.set(ma, { dem: 1, dau: chiTiet() }); else cu.dem += 1; };
function kiemLuat(ma: string): void {
  const v = viPham.get(ma);
  expect(soLanKiem.get(ma) ?? 0, `${ma} khong duoc kiem lan nao`).toBeGreaterThan(0);
  expect(v === undefined ? '' : `${String(v.dem)} lan sai; phan vi du dau tien: ${v.dau}`).toBe('');
}
const S = String;
const oChu = (x: O): string => `(${S(x.a)},${S(x.b)})`;
const ngoai = (x: O): boolean => x.a < 0 || x.b < 0 || x.a >= CANH || x.b >= CANH;
const satDuong = (x: number): boolean => x % C === 1 || x % C === C - 1;
const xaTam = (a: number, b: number): number => Math.max(Math.abs(a - (CANH - 1) / 2), Math.abs(b - (CANH - 1) / 2));
const xaGoc = (a: number, b: number): number => Math.min(Math.max(a, b), Math.max(CANH - 1 - a, b), Math.max(a, CANH - 1 - b), Math.max(CANH - 1 - a, CANH - 1 - b));
/** Khu va vien TU TINH tu `thanh_pho_demo.json > vanh`: goi `khuCuaO` cua game thi la tu kiem chinh no. */
const khuTu = (a: number, b: number): string =>
  (VANH.find((v) => xaTam(a, b) >= v.tu && xaTam(a, b) <= v.den && (v.goc === undefined || xaGoc(a, b) <= v.goc)) ?? VANH[VANH.length - 1])?.khu ?? '';
const laVienTu = (a: number, b: number): boolean => VANH.some((v) => v.den < (VANH[VANH.length - 1]?.den ?? 0) && Math.floor(xaTam(a, b)) === v.den);
// --- Hat giong: hat 0 la cau hinh that trong data/, con lai boc tu Rng - lap lai duoc. ---
interface Hat { readonly ten: string; readonly banDo: number; readonly datNha: number }
function hatThu(i: number): Hat {
  if (i === 0) return { ten: 'hat 0 (data/ goc)', banDo: banDo.hatGiong, datNha: walker.hatGiongDatNha };
  const r = new Rng(HAT_GOC + i);
  const [b, d] = [r.nguyen(2 ** 31), r.nguyen(2 ** 31)];
  return { ten: `hat ${S(i)} (banDo ${S(b)}, datNha ${S(d)})`, banDo: b, datNha: d };
}
const cauHinhBanDo = (h: Hat): typeof banDo => ({ ...banDo, hatGiong: h.banDo });
function dungThanhPho(h: Hat, ep: Partial<typeof EP> = {}): ThanhPho | undefined {
  try { return new ThanhPho({ hang, nha, chuoi, banDo: cauHinhBanDo(h), walker: { ...walker, hatGiongDatNha: h.datNha, ...ep } }); }
  catch (e) { ghi('TP12', () => `${h.ten}: khong dung duoc thanh pho - ${e instanceof Error ? e.message : S(e)}`); return undefined; }
}
/** Nguoi choi gia: xay nha loai bat ky hoac kho. Ngoai `xayNha`/`xayKho` khong loi nao cham vao kinh te. */
function xayNgauNhien(tp: ThanhPho, r: Rng): string {
  if (r.so() < TI_LE_KHO) return tp.xayKho() ? 'kho' : '';
  const ten = TEN_NHA[r.nguyen(TEN_NHA.length)] ?? '';
  return tp.xayNha(ten) ? ten : '';
}
/** Sau khi dung va sau MOI lan xay: TP10 (mot o mot vat), TP11 (xep do sau), TP12 (quy hoach), TP13 (kho). */
function kiemBanDo(tp: ThanhPho, goc: number, luc: string): void {
  const { vat, daChiem } = tp.banDo;
  const chu = new Map<number, string>();
  for (const v of vat) {
    for (let k0 = 0; k0 < v.o * v.o; k0 += 1) {
      const x = { a: v.a + Math.floor(k0 / v.o), b: v.b + (k0 % v.o) };
      const [k, cu] = [x.a * CANH + x.b, chu.get(x.a * CANH + x.b)];
      if (ngoai(x) || laDuong(x, C) || !daChiem.has(k) || cu !== undefined) ghi('TP10', () => `${luc}: o ${oChu(x)} co "${v.ten}"${cu === undefined ? '' : ` de len "${cu}"`}, ngoai ban do ${S(ngoai(x))}, tren duong ${S(laDuong(x, C))}, trong daChiem ${S(daChiem.has(k))}`);
      if (cu === undefined) chu.set(k, v.ten);
    }
  }
  for (const { oNha: { a, b }, def, chiSo } of tp.dsNhaThat()) if (chu.get(a * CANH + b) !== def.sprite && !vat.some((v) => v.a === a && v.b === b && v.ten === def.sprite)) ghi('TP10', () => `${luc}: nha ${def.ten}#${S(chiSo)} khong co hinh o ${oChu({ a, b })}`);
  const [itNhat, nhieuNhat] = [goc + tp.soNha, goc + tp.soNha + tp.doiWalker.soKho];
  if (vat.length < itNhat || vat.length > nhieuNhat) ghi('TP10', () => `${luc}: ${S(vat.length)} vat, phai trong [${S(itNhat)}, ${S(nhieuNhat)}]`);
  const sau = (i: number): number => { const v = vat[i]; return v === undefined ? 0 : v.a + v.b + 2 * v.o; };
  const lech = vat.findIndex((_, i) => i > 0 && sau(i) < sau(i - 1));
  if (lech > 0) ghi('TP11', () => `${luc}: vat thu ${S(lech)} do sau ${S(sau(lech))} dung sau vat do sau ${S(sau(lech - 1))}`);
  const [oNha, khoi, daCo] = [new Map<number, number>(), new Set<number>(), new Set<number>()];
  tp.dsNhaThat().forEach((n, i) => {
    const { oNha: { a, b }, cong: g, def } = n;
    const kh = Math.floor(a / C) * Math.ceil(CANH / C) + Math.floor(b / C);
    const sai = [
      n.chiSo !== i ? `chiSo ${S(n.chiSo)} != vi tri ${S(i)}` : '',
      a < 1 || b < 1 || a > CANH - 2 || b > CANH - 2 || laDuong(n.oNha, C) || (!satDuong(a) && !satDuong(b)) ? 'sat mep, tren duong hoac khong sat duong' : '',
      laVienTu(a, b) || khuTu(a, b) !== def.khu ? `o khu ${khuTu(a, b)}, vien ${S(laVienTu(a, b))}, phai la ${def.khu}` : '',
      ...[a * CANH + b, (a - 1) * CANH + b, a * CANH + b - 1].map((k) => (oNha.has(k) ? `trung/ke nha #${S(oNha.get(k))}` : '')),
      def.motKhoi && khoi.has(kh) ? 'khoi pho da co tien ich' : '',
      !laDuong(g, C) || ngoai(g) || Math.abs(g.a - a) + Math.abs(g.b - b) !== 1 ? `cong ${oChu(g)} khong phai o duong sat nha` : '',
    ].filter((x) => x !== '');
    if (sai.length > 0) ghi('TP12', () => `${luc}: nha ${def.ten}#${S(i)} o ${oChu(n.oNha)}: ${sai.join('; ')}`);
    oNha.set(a * CANH + b, i);
    if (def.motKhoi) khoi.add(kh);
  });
  // Trung o, ke tren, ke trai: xet trong vong tren (voi nha dung truoc); ke duoi, ke phai: vong nay.
  for (const [k, i] of oNha) for (const k2 of [k + CANH, k + 1]) if ((oNha.get(k2) ?? i) < i) ghi('TP12', () => `${luc}: nha #${S(i)} ke sat nha #${S(oNha.get(k2))}`);
  for (const k of tp.doiWalker.danhSachKho) {
    if (k.a % C !== 0 || k.b % C !== 0 || ngoai(k) || daCo.has(k.a * CANH + k.b)) ghi('TP13', () => `${luc}: kho ${oChu(k)} khong phai nga tu rieng trong ban do`);
    daCo.add(k.a * CANH + k.b);
  }
  daKiem('TP10', 'TP11', 'TP12', 'TP13');
}
function tongHang(tp: ThanhPho): Map<string, number> { // kho chung + kho rieng + tren vai
  const ra = new Map(TEN_HANG.map((h) => [h, tp.kho.co(h)]));
  for (const n of tp.dsNhaThat()) for (const h of TEN_HANG) ra.set(h, (ra.get(h) ?? 0) + n.co(h));
  for (const w of tp.doiWalker.danhSach) ra.set(w.hang, (ra.get(w.hang) ?? 0) + w.so);
  return ra;
}
/** TP15: so van tay DAY DU - moi truong cua nha, nguoi vac, kho, vat, bang so. */
function soVanTay(tp1: ThanhPho, tp2: ThanhPho, luc: string): void {
  const vanTay = (tp: ThanhPho): string[] => [
    TEN_HANG.map((h) => tp.kho.co(h)).join(','),
    ...tp.dsNhaThat().map((n) => [n.chiSo, n.def.ten, oChu(n.oNha), oChu(n.cong), [...n.dangLay].join('+'), n.nhipTac(), n.nhipDoi(), TEN_HANG.map((h) => n.co(h))].join(' ')),
    ...tp.doiWalker.danhSach.map((w) => [w.nha, w.viec, w.hang, w.so, oChu(w), oChu(w.nhaVe), oChu(w.kho), w.daToiKho, w.buoc, w.cho, w.huong, w.kieu].join(' ')),
    ...tp.doiWalker.danhSachKho.map(oChu), ...tp.banDo.vat.map((v) => `${v.ten}${oChu(v)}${S(v.o)}`), JSON.stringify(tp.gioVuaXong() ?? null),
  ];
  const [x, y] = [vanTay(tp1), vanTay(tp2)];
  const i = x.length === y.length ? x.findIndex((s, k) => s !== y[k]) : Math.min(x.length, y.length);
  if (i >= 0) ghi('TP15', () => `${luc}: ban 1 "${x[i] ?? '(het)'}" khac ban 2 "${y[i] ?? '(het)'}"`);
  daKiem('TP15');
}
/** Van choi theo thoi gian: thong doc that + nguoi choi gia. `nhipTatDinh > 0`: chay XEN KE ban sinh doi cung hat, cung lua chon
 * (bat ca trang thai dung chung cap module). `thuong = false`: ban ep (`EP`) - bo TP03, TP04 va ve "khong ai bo cuoc". */
function chayVan(h: Hat, thuong: boolean, soNhip: number, nhipTatDinh: number): void {
  const ep = thuong ? {} : EP;
  const [tp, doi, ch] = [dungThanhPho(h, ep), nhipTatDinh > 0 ? dungThanhPho(h, ep) : undefined, { ...walker, ...ep }]; // ch: cau hinh nguoi vac cua van nay
  if (tp === undefined) return;
  for (const x of [tp, doi]) if (x !== undefined) x.datThongDoc(new Governor(x, docChinhSach(policy)));
  const [r, rDoi] = [new Rng((h.banDo ^ h.datNha) >>> 0), new Rng((h.banDo ^ h.datNha) >>> 0)];
  const ten = thuong ? h.ten : `${h.ten} ep bo cuoc`;
  const luc = (): string => `${ten}, nhip ${S(tp.dongHo.soNhip)}`;
  const [goc, dau, soCai] = [sinhBanDo(cauHinhBanDo(h)).vat.length, tongHang(tp), new Map<string, number>()]; // soCai: lam ra - dung - hong + qua, cong don
  const cong = (k: string, so: number): void => { soCai.set(k, (soCai.get(k) ?? 0) + so); };
  const khoCua = (): Set<number> => new Set(tp.doiWalker.danhSachKho.map((k) => k.a * CANH + k.b));
  let [soNha, soKho, khoCo, nhaTruocChot] = [tp.soNha, tp.doiWalker.soKho, khoCua(), new Map<string, number>()];
  const quetXay = (): void => {
    if (tp.soNha === soNha && tp.doiWalker.soKho === soKho) return;
    for (const n of tp.dsNhaThat().slice(soNha)) for (const m of VAO.get(n.def.ten) ?? []) cong(m, MOI_CHUYEN); // qua: XayThem.dungNha
    [soNha, soKho, khoCo] = [tp.soNha, tp.doiWalker.soKho, khoCua()];
    kiemBanDo(tp, goc, `${luc()}, ${S(soNha)} nha ${S(soKho)} kho`);
  };
  // Moi KIEM_MOI nhip - TP02 khong am/khong tran, TP04 kho rieng, TP06 tren duong, TP07 buoc chan, TP08 bo dem, TP09 co dang lay.
  // TP07: nguoi vac xuat phat o cong nha minh, moi buoc mot o (nen cach cong khong qua so buoc da di), toi mot kho co that.
  const kiemDinhKy = (): void => {
    const dw = tp.doiWalker;
    for (const hg of TEN_HANG) if (!Number.isInteger(tp.kho.co(hg)) || tp.kho.co(hg) < 0 || tp.kho.co(hg) > (TRAN_HANG.get(hg) ?? 0)) ghi('TP02', () => `${luc()}: kho chung ${hg} = ${S(tp.kho.co(hg))}`);
    let [lay, giao, soCo] = [0, 0, 0];
    const layCua = new Set<number>();
    for (const w of dw.danhSach) {
      if (ngoai(w) || !laDuong(w, C)) ghi('TP06', () => `${luc()}: nguoi vac nha #${S(w.nha)} (${w.viec} ${w.hang}, cong ${oChu(w.nhaVe)}, kho ${oChu(w.kho)}) dung o ${oChu(w)}, ${ngoai(w) ? `ngoai ban do ${S(CANH)}x${S(CANH)}` : 'khong phai duong'}`);
      if (!Number.isInteger(w.so) || w.so < 0 || w.so > MOI_CHUYEN) ghi('TP02', () => `${luc()}: nguoi vac mang ${S(w.so)} ${w.hang}`);
      const g = tp.dsNhaThat()[w.nha]?.cong;
      const buocDung = g?.a === w.nhaVe.a && g.b === w.nhaVe.b && Math.abs(w.a - g.a) + Math.abs(w.b - g.b) <= w.buoc && w.buoc <= ch.buocToiDa;
      if (!buocDung || !khoCo.has(w.kho.a * CANH + w.kho.b)) ghi('TP07', () => `${luc()}: nguoi vac nha #${S(w.nha)} xuat phat ${oChu(w.nhaVe)} (cong nha ${g === undefined ? '?' : oChu(g)}), nay o ${oChu(w)} sau ${S(w.buoc)}/${S(ch.buocToiDa)} buoc, toi kho ${oChu(w.kho)}`);
      if (w.viec === 'giao') { giao += 1; continue; }
      const k = w.nha * TEN_HANG.length + (CHI_SO_HANG.get(w.hang) ?? -1);
      if (layCua.has(k)) ghi('TP09', () => `${luc()}: hai nguoi cung di lay ${w.hang} cho nha #${S(w.nha)}`);
      layCua.add(k);
      lay += 1;
    }
    const demDung = dw.soViec('lay') === lay && dw.soViec('giao') === giao && lay <= ch.tranLay && giao <= ch.tranGiao && lay + giao <= ch.tranWalker;
    if (!demDung) ghi('TP08', () => `${luc()}: dem lay ${S(dw.soViec('lay'))}, that ${S(lay)} (tran ${S(ch.tranLay)}); dem giao ${S(dw.soViec('giao'))}, that ${S(giao)} (tran ${S(ch.tranGiao)}); tran tong ${S(ch.tranWalker)}`);
    for (const n of tp.dsNhaThat()) {
      soCo += n.dangLay.size;
      for (const hg of n.dangLay) if (!layCua.has(n.chiSo * TEN_HANG.length + (CHI_SO_HANG.get(hg) ?? -1))) ghi('TP09', () => `${luc()}: ${n.def.ten}#${S(n.chiSo)} dang lay ${hg} ma khong ai di`);
      for (const hg of HANG_NHA.get(n.def.ten) ?? []) if (!Number.isInteger(n.co(hg)) || n.co(hg) < 0) ghi('TP02', () => `${luc()}: kho rieng ${n.def.ten}#${S(n.chiSo)}.${hg} = ${S(n.co(hg))}`);
      for (const hg of thuong ? (HANG_NHA.get(n.def.ten) ?? []) : []) if (n.co(hg) > walker.tranRieng + MOI_CHUYEN) ghi('TP04', () => `${luc()}: ${n.def.ten}#${S(n.chiSo)} giu ${S(n.co(hg))} ${hg} > tranRieng ${S(walker.tranRieng)} + moiChuyen ${S(MOI_CHUYEN)} (kho chung ${S(tp.kho.co(hg))}/${S(TRAN_HANG.get(hg))})`);
    }
    if (soCo !== lay) ghi('TP09', () => `${luc()}: ${S(soCo)} co dang lay nhung ${S(lay)} nguoi di lay`);
    daKiem('TP02', 'TP06', 'TP07', 'TP08', 'TP09', ...(thuong ? ['TP04'] : []));
  };
  // Cuoi moi gio - TP01 bao toan, TP03 khong ket, TP05 bang so noi that, TP07 khong ai bo cuoc.
  const kiemGio = (gio: number): void => {
    const [tk, lucG] = [tp.gioVuaXong(), `${ten}, gio ${S(gio)}`];
    if (tk === undefined) { ghi('TP05', () => `${lucG}: khong co bang so`); return; }
    for (const hg of tk.hang) cong(hg.ten, hg.lamRa - hg.dungHet - hg.hong);
    const that = tongHang(tp);
    const soCaiCua = (hg: string): number => (dau.get(hg) ?? 0) + (soCai.get(hg) ?? 0);
    for (const hg of TEN_HANG) if (that.get(hg) !== soCaiCua(hg)) ghi('TP01', () => `${lucG}: ${hg} co ${S(that.get(hg))} (kho chung + kho rieng + tren vai), so cai ${S(soCaiCua(hg))}`);
    const loi = thuong && gio >= 2 ? chamDiem(tk) : [];
    if (loi.length > 0) ghi('TP03', () => `${lucG}: ${loi.slice(0, 3).join(' | ')}`);
    if (thuong && gio >= 2) daKiem('TP03');
    const raTheoHang = new Map<string, number>();
    for (const n of tk.nha) for (const m of RA.get(n.ten) ?? []) raTheoHang.set(m.hang, (raTheoHang.get(m.hang) ?? 0) + n.me * m.so);
    for (const hg of tk.hang) if (hg.lamRa !== (raTheoHang.get(hg.ten) ?? 0)) ghi('TP05', () => `${lucG}: ${hg.ten} lam ra ${S(hg.lamRa)} != so me x san luong ${S(raTheoHang.get(hg.ten) ?? 0)}`);
    for (const hg of tk.hang) if (HAO_HANG.get(hg.ten) === 0 && hg.hong !== 0) ghi('TP05', () => `${lucG}: ${hg.ten} khai hao 0 ma hong ${S(hg.hong)}`);
    for (const n of tk.nha) if (n.so !== (nhaTruocChot.get(n.ten) ?? 0)) ghi('TP05', () => `${lucG}: bang so ghi ${S(n.so)} ${n.ten}, that co ${S(nhaTruocChot.get(n.ten))}`);
    if (thuong && tk.walker.boCuoc !== 0) ghi('TP07', () => `${lucG}: ${S(tk.walker.boCuoc)} luot bo cuoc giua duong`);
    boCuocEp += thuong ? 0 : tk.walker.boCuoc;
    daKiem('TP01', 'TP05');
  };
  kiemBanDo(tp, goc, `${ten}, luc mo van`);
  if (doi !== undefined) soVanTay(tp, doi, `${ten}, luc dung`);
  for (let nhip = 1; nhip <= soNhip; nhip += 1) {
    const [xay, chot] = [nhip % XAY_MOI === 0, nhip % NHIP_MOI_GIO === 0];
    if (xay) { xayNgauNhien(tp, r); quetXay(); }
    if (chot) nhaTruocChot = new Map(TEN_NHA.map((t) => [t, tp.dsNhaThat().filter((n) => n.def.ten === t).length]));
    tp.nhip();
    quetXay();
    if (nhip % KIEM_MOI === 0) kiemDinhKy();
    if (chot) kiemGio(nhip / NHIP_MOI_GIO);
    if (doi === undefined || nhip > nhipTatDinh) continue;
    if (xay) xayNgauNhien(doi, rDoi);
    doi.nhip();
    if (nhip % VAN_TAY_MOI === 0) soVanTay(tp, doi, luc());
  }
}
/** TP15 ve con lai: doi hat giong thi phai ra thanh pho khac - bat loi "hat giong bi bo qua". */
function kiemKhacHat(h: Hat): void {
  const vat = (x: Hat): string => JSON.stringify(sinhBanDo(cauHinhBanDo(x)).vat);
  const viTri = (x: Hat): string => (dungThanhPho(x)?.dsNhaThat() ?? []).map((n) => oChu(n.oNha)).join(' ');
  if (vat(h) === vat({ ...h, banDo: h.banDo + 1 })) ghi('TP15', () => `${h.ten}: doi hatGiong ban do ma vat y het`);
  if (viTri(h) === viTri({ ...h, datNha: h.datNha + 1 })) ghi('TP15', () => `${h.ten}: doi hatGiongDatNha ma nha dat y cho cu`);
  daKiem('TP15');
}
/** Xay don dap, khong chay nhip: kiem ban do sau MOI lan xay (loi chong hinh can nhieu kho moi lo ra). */
function chayXay(h: Hat): void {
  const tp = dungThanhPho(h);
  if (tp === undefined) return;
  const [goc, r] = [sinhBanDo(cauHinhBanDo(h)).vat.length, new Rng((h.banDo + h.datNha) >>> 0)];
  kiemBanDo(tp, goc, `${h.ten}, luc mo van`);
  for (let lan = 1; lan <= TS.lanXay; lan += 1) {
    const da = xayNgauNhien(tp, r);
    if (da !== '') kiemBanDo(tp, goc, `${h.ten}, lan xay ${S(lan)} (${da}, ${S(tp.doiWalker.soKho)} kho)`);
  }
}
/** TP14: ham thuan `buocKeTiep`, tu o duong `tu` toi o duong `toi`. Tran so buoc = Manhattan + 2d. Goi kem CANH: ban sua Walkers.ts:102
 * phai biet canh ban do; ham 3 tham so hien nay bo qua tham so thua (gan ham it tham so vao kieu nhieu tham so la hop le). */
const buocDi: (tu: O, toi: O, c: number, canh: number) => O = buocKeTiep;
function kiemDuongDi(tu: O, toi: O): void {
  // d: tu `tu` toi nga tu gan nhat TRONG ban do, do doc con duong `tu` dang dung.
  const gan = (x: number): number => { const lo = x - (x % C); return lo + C > DUONG_CUOI ? x - lo : Math.min(x - lo, lo + C - x); };
  const tran = Math.abs(tu.a - toi.a) + Math.abs(tu.b - toi.b) + 2 * (tu.a % C === 0 && tu.b % C === 0 ? 0 : gan(tu.b % C === 0 ? tu.a : tu.b));
  for (let n = 1, x = tu; x.a !== toi.a || x.b !== toi.b; n += 1) {
    const [m, cu] = [buocDi(x, toi, C, CANH), x];
    const sai = m.a === x.a && m.b === x.b ? 'dung yen' : Math.abs(m.a - x.a) + Math.abs(m.b - x.b) !== 1 ? 'nhay coc'
      : !laDuong(m, C) ? 'roi duong' : ngoai(m) ? `ra ngoai ban do ${S(CANH)}x${S(CANH)}` : n > tran ? `qua ${S(tran)} buoc` : '';
    if (sai !== '') { ghi('TP14', () => `tu ${oChu(tu)} toi ${oChu(toi)}: buoc thu ${S(n)} ${oChu(cu)} -> ${oChu(m)} ${sai}`); return; }
    x = m;
  }
}
function chayDuong(): void {
  const oDuong = Array.from({ length: CANH * CANH }, (_, k) => ({ a: Math.floor(k / CANH), b: k % CANH })).filter((x) => laDuong(x, C));
  for (let s = 0; s < TS.hatDuong; s += 1) {
    const r = new Rng(HAT_GOC * 31 + s);
    const boc = (): O => oDuong[r.nguyen(oDuong.length)] ?? { a: 0, b: 0 };
    for (let i = 0; i < SO_CAP_DUONG; i += 1) kiemDuongDi(boc(), boc());
    daKiem('TP14');
  }
  // Ban sau: vet MOI o duong <-> MOI nga tu (dich that cua game: kho la nga tu), hai chieu.
  const ngaTu = SAU ? oDuong.filter((o) => o.a % C === 0 && o.b % C === 0) : [];
  for (const x of oDuong) for (const y of ngaTu) { kiemDuongDi(x, y); kiemDuongDi(y, x); }
}

describe('luat bat bien thanh pho', () => {
  beforeAll(() => {
    for (let i = 0; i < TS.hatVan; i += 1) chayVan(hatThu(i), true, TS.gioVan * NHIP_MOI_GIO, i < TS.hatTatDinh ? TS.gioTatDinh * NHIP_MOI_GIO : 0);
    for (let i = 0; i < TS.hatBoCuoc; i += 1) chayVan(hatThu(500 + i), false, TS.gioBoCuoc * NHIP_MOI_GIO, 0);
    kiemKhacHat(hatThu(1));
    for (let i = 0; i < TS.hatXay; i += 1) chayXay(hatThu(i));
    chayDuong();
  }, HAN_MS);
  it('[TP01] hang khong tu sinh tu mat', () => { kiemLuat('TP01'); expect(boCuocEp, 'ban ep bo cuoc phai co nguoi bo cuoc that').toBeGreaterThan(0); });
  it('[TP02] khong cho nao am, kho chung khong vuot tran, nguoi vac khong qua mot chuyen', () => { kiemLuat('TP02'); });
  it('[TP03] tu gio thu hai khong loai nha nao, mat hang nao ket', () => { kiemLuat('TP03'); });
  it('[TP05] bang so moi gio noi that', () => { kiemLuat('TP05'); });
  it('[TP07] nguoi vac di tung buoc tu cong nha toi kho co that, khong ai bo cuoc', () => { kiemLuat('TP07'); });
  it('[TP08] bo dem nguoi vac khop thuc te va duoi tran', () => { kiemLuat('TP08'); });
  it('[TP09] co dang lay khop dung mot nguoi di lay', () => { kiemLuat('TP09'); });
  it('[TP10] mot o mot vat, ke ca sau khi xay them', () => { kiemLuat('TP10'); });
  it('[TP11] vat tren ban do luon xep theo do sau', () => { kiemLuat('TP11'); });
  it('[TP12] nha dung quy hoach, cong tren duong', () => { kiemLuat('TP12'); });
  it('[TP13] kho nao cung la nga tu rieng trong ban do', () => { kiemLuat('TP13'); });
  it('[TP15] cung hat giong cung lua chon thi thanh pho y het', () => { kiemLuat('TP15'); });
});
