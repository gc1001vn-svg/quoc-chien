/**
 * Luat bat bien mang CONG NGHE, THE, THONG DOC, DONG HO (ke hoach `docs/ke-hoach/2026-10-03-luat-bat-bien.md` muc 1, 3; cau tung ma `[CNxx]` o
 * `docs/LUAT_BAT_BIEN.md`). `beforeAll` chay MOT lan moi hat giong, kiem MOI luat, gom vi pham theo ma; moi `it` doi danh sach cua ma minh rong va in phan vi
 * du dau tien (hat giong, gio, chi tiet). Thanh pho GIA (bang so roi sat nguong that trong data/) nen van vai tram gio chi vai chuc ms; Governor, Meta, DongCo,
 * Van la ma THAT; nguoi choi gia bam lung tung. Nghe bang cach boc phuong thuc CONG KHAI, khong cham truong private; mo hinh kiem viet lai (`dungDK`, `capMau`)
 * va doc so THAT cua thanh pho, khong tin so game dua vao ham (so cu, gia sai, `daXong` sai deu lo). `LUAT_SAU=1`: >= 50 hat, van dai, thanh pho THAT 10 gio. */
import { beforeAll, describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { DongHo, NHIP_MOI_GIAY, NHIP_MOI_GIO, TOC_DO, type TocDo } from '../src/sim/Clock.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import type { ThongKe } from '../src/sim/city/Cham.ts';
import { docNha } from '../src/sim/city/Buildings.ts';
import { docHang } from '../src/sim/city/Wares.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach, type ChinhSach } from '../src/sim/autoplay/Policy.ts';
import { DongCo, docNhipDo, docThe, type DieuKien, type LuaChon, type NhipDo, type SoThanhPho } from '../src/sim/decision/Engine.ts';
import { NhatKy } from '../src/sim/decision/NhatKy.ts';
import { Van } from '../src/sim/decision/Van.ts';
import type { CongNghe } from '../src/sim/meta/CongNghe.ts';
import { docDuLieuMeta, Meta, type DuLieuMeta } from '../src/sim/meta/Meta.ts';
import techTho from '../data/tech.json';
import eurekaTho from '../data/eureka.json';
import theTho from '../data/the_chinh_sach.json';
import canBang from '../data/balance.json';
import quyetDinh from '../data/decisions.json';
import policy from '../data/policy.json';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';

// --- Tham so thu, KHONG phai so can bang. ---
const SAU = process.env.LUAT_SAU === '1';
const TS = SAU ? { hatGia: 60, gioGia: 1500, hatSinhDoi: 10, hatThat: 5, gioThat: 10, hatDongHo: 50, khung: 200_000 }
  : { hatGia: 12, gioGia: 400, hatSinhDoi: 2, hatThat: 0, gioThat: 0, hatDongHo: 4, khung: 50_000 };
const [HAN_MS, HAT_GOC] = [SAU ? 30 * 60_000 : 60_000, 20261003];
// Thanh pho gia: xac suat giu so cu / sat nguong (+-1) / bang 0, tran so tu do, xay hong, dan den, nhay coc, keo sat tran (tu sau gio CHO_KEO).
const [GIU, SAT, KHONG, TU_DO, HONG_NHA, HONG_KHO, DAN, NHAY, COC, KEO, CHO_KEO] = [0.5, 0.6, 0.15, 100, 0.15, 0.25, 0.3, 0.02, 40, 0.5, 60];
const [GIAY_TREO, MAU] = [8, 65536]; // dong ho: may treo toi 8 giay; dt = k / 2^16 giay de tong mong doi tinh dung bang so nguyen
// --- So doc tu data/ ---
const [DU, THE_QD, DS_HANG, DS_NHA] = [docDuLieuMeta(techTho, eurekaTho, theTho, canBang), docThe(quyetDinh), docHang(hang), docNha(nha)];
const [TEN_NHA, ID_CN, ID_THE] = [new Set(DS_NHA.map((n) => n.ten)), DU.congNghe.ds.map((c) => c.id), DU.the.map((t) => t.id)];
const [TEN_NGUONG, TOC_MAX] = [['nguongBoCuoc', 'nguongDinh', 'nguongCho'] as const, TOC_DO.reduce<TocDo>((a, b) => (b > a ? b : a), 0)];
/** Nguong that cua moi cot bang so (`do:hang`), ke ca nguong thong doc: bang so gia roi sat cac so nay de dieu kien luc dung luc sai. */
const NGUONG = new Map<string, number[]>();
const themNguong = (khoa: string, gia: number): void => { NGUONG.set(khoa, [...(NGUONG.get(khoa) ?? []), gia]); };
for (const dk of [...DU.eureka.ds.map((m) => m.dieuKien), ...THE_QD.flatMap((t) => t.dieuKien)]) themNguong(`${dk.do}:${dk.hang ?? ''}`, dk.gia);
for (const h of DS_HANG) themNguong(`cho:${h.ten}`, policy.nguongCho);
themNguong('boCuoc:', policy.nguongBoCuoc); themNguong('dinh:', policy.nguongDinh);
// --- Ghi vi pham. Chi dung chuoi cho lan sai dau tien: mot luat do co the sai hang nghin lan. ---
const [viPham, soLanKiem, S] = [new Map<string, { dem: number; dau: string }>(), new Map<string, number>(), String];
const daKiem = (...ma: string[]): void => { for (const m of ma) soLanKiem.set(m, (soLanKiem.get(m) ?? 0) + 1); };
const ghi = (ma: string, chiTiet: () => string): void => { const cu = viPham.get(ma); if (cu === undefined) viPham.set(ma, { dem: 1, dau: chiTiet() }); else cu.dem += 1; };
const kiemLuat = (ma: string, v = viPham.get(ma)): void => {
  expect(soLanKiem.get(ma) ?? 0, `${ma} khong duoc kiem lan nao`).toBeGreaterThan(0);
  expect(v === undefined ? '' : `${S(v.dem)} lan sai; phan vi du dau tien: ${v.dau}`).toBe(''); };
const chon = <T>(r: Rng, ds: readonly T[]): T => ds[r.nguyen(ds.length)] as T;
/** Dieu kien dung hay sai - viet LAI doc lap, khong goi `dung` cua game. */
function dungDK(dk: DieuKien, tk: ThongKe, so: SoThanhPho): boolean {
  const x = dk.do === 'dinh' || dk.do === 'boCuoc' || dk.do === 'chuyen' ? tk.walker[dk.do]
    : dk.do === 'soNha' || dk.do === 'soKho' ? so[dk.do] : tk.hang.find((m) => m.ten === dk.hang)?.[dk.do];
  return x !== undefined && (dk.phep === '>=' ? x >= dk.gia : dk.phep === '<=' ? x <= dk.gia : dk.phep === '>' ? x > dk.gia : x < dk.gia);
}
/** Cap thong doc - viet LAI tu policy.json: cap co `tuNha` lon nhat con <= so nha, cong phan tran da noi. */
const capMau = (cs: ChinhSach, soNha: number, them: { readonly nha: number; readonly kho: number }): { ten: string; tranNha: number; tranKho: number } => {
  const c = cs.cap.reduce((a, m) => (m.tuNha <= soNha && m.tuNha >= a.tuNha ? m : a)); return { ten: c.ten, tranNha: c.tranNha + them.nha, tranKho: c.tranKho + them.kho }; };
type CotHang = 'ton' | 'lamRa' | 'dungHet' | 'cho' | 'day' | 'hong';
/** Thanh pho gia: chi co nhung gi Governor, Meta, Van doc. Co `tran` thi so nha bi keo sat tran thong doc (thu ve tran nha). */
class ThanhPhoGia {
  readonly dsNha = DS_NHA; readonly dongHo = { gio: 0 }; readonly doiWalker: { soKho: number }; soNha: number;
  tran: (() => number) | undefined; private tk: ThongKe | undefined; private readonly r: Rng;
  constructor(r: Rng) { this.r = r; this.soNha = 100 + r.nguyen(150); this.doiWalker = { soKho: 3 + r.nguyen(6) }; }
  gioVuaXong(): ThongKe | undefined { return this.tk; }
  xayNha(ten: string): boolean { if (!TEN_NHA.has(ten) || this.r.so() < HONG_NHA) return false; this.soNha += 1; return true; }
  xayKho(): boolean { if (this.r.so() < HONG_KHO) return false; this.doiWalker.soKho += 1; return true; }
  /** Mot o bang so: giu so cu (de dieu kien dung lien nhieu gio), roi sat mot nguong that, bang 0, hay tu do. */
  private so(khoa: string, cu: number | undefined): number {
    const [r, ng, giu, x] = [this.r, NGUONG.get(khoa), this.r.so(), this.r.so()];
    if (cu !== undefined && giu < GIU) return cu;
    if (ng !== undefined && x < SAT) return Math.max(0, chon(r, ng) + chon(r, [-1, 0, 0, 1]));
    return x < SAT + KHONG ? 0 : r.nguyen((ng === undefined ? TU_DO : 2 * Math.max(...ng)) + 1);
  }
  chayGio(gio: number): void {
    const [cu, r, so] = [this.tk, this.r, (khoa: string, x: number | undefined): number => this.so(khoa, x)];
    const hangMoi = DS_HANG.map((h, i) => { const g = (cot: CotHang): number => so(`${cot}:${h.ten}`, cu?.hang[i]?.[cot]);
      return { ten: h.ten, hien: h.hien, tran: h.tran, ton: g('ton'), lamRa: g('lamRa'), dungHet: g('dungHet'), cho: g('cho'), day: g('day'), hong: g('hong') }; });
    const w = { chuyen: so('chuyen:', cu?.walker.chuyen), boCuoc: so('boCuoc:', cu?.walker.boCuoc), dinh: so('dinh:', cu?.walker.dinh) };
    [this.tk, this.dongHo.gio] = [{ gio, nha: [], hang: hangMoi, walker: w }, gio];
    const [y, tran] = [r.so(), this.tran]; // dan tu den (nhay coc), hay keo so nha len sat tran: cong nghe don truoc, so nha vot qua nhieu moc len doi
    if (tran === undefined) this.soNha += y < NHAY ? COC : y < DAN ? 1 + r.nguyen(3) : 0;
    else if (y < KEO && gio > CHO_KEO) this.soNha = Math.max(this.soNha, tran() + chon(r, [-1, 0, 0, 1]));
  }
}
interface VanThu {
  readonly ten: string; readonly tp: ThanhPho; readonly td: Governor; readonly meta: Meta; readonly dc: DongCo; readonly van: Van; readonly nk: NhatKy;
  readonly du: DuLieuMeta; readonly nd: NhipDo; readonly cs: ChinhSach; readonly r: Rng; readonly chayGio: (gio: number) => void; batHoi: boolean;
}
interface Kiem { sau(luc: string): void; traLoi(lc: LuaChon): void; doiThe(o: number, id: string | undefined): void }
/** Gan bo kiem vao mot van: boc `van.moiGio`, `cay.don`, `eureka.cham`, `dongCo.hoi` (deu cong khai) de nghe tung lan goi. */
function ganKiem(v: VanThu): Kiem {
  const { ten, tp, td, meta, dc, van, du, nd, meta: { cay, chinhSach: cs } } = v;
  const [xongTruoc, daNo, giaCu, lanHoi] = [new Set<string>(), new Set<string>(), new Map<string, number>(), new Map<string, number>()];
  const s = { gio: 0, vao: 0, tongGia: 0, qdNha: 0, qdKho: 0, soO: cs.soO, lap: cs.dangLap.map((t) => t?.id), gioDoi: -Infinity,
    xongGio: [] as CongNghe[], soNhaMeta: -1, soHoi: 0, gioCuoi: -Infinity, hoiTrongGio: 0, donTrongGio: 0 };
  const noi = (gio = s.gio): string => `${ten}, gio ${S(gio)}`;
  // soThat: so thanh pho luc nay, khong phai so game dua vao ham. hsMin: tran duoi he so (trong .ts) khong cao hon the thap nhat - bo doc chan.
  const [soThat, hsMin] = [(): SoThanhPho => ({ soNha: tp.soNha, soKho: tp.doiWalker.soKho }), Math.min(...du.the.map((t) => t.heSoNghienCuu))];
  /** CN01 CN02 CN04 CN06 CN07 CN12, sau moi hanh dong va moi gio. `mongLap`: cac o chinh phu phai ra sao (mac dinh giu nguyen). */
  const trangThai = (luc: string, mongLap: readonly (string | undefined)[] = s.lap): void => {
    const [lc, xong, them, dang, doi] = [(): string => `${noi()}, ${luc}`, cay.toanBo.filter((c) => cay.daXong(c.id)), td.themTran, cay.dang, meta.thoiDai.doi];
    const nguon = [...xong.map((c) => c.thuong?.noiTran), ...cs.dangLap.map((t) => t?.noiTran)] // cong tu the DANG LAP, khong tin `tongNoiTran`
      .reduce<{ nha: number; kho: number }>((a, n) => ({ nha: a.nha + (n?.nha ?? 0), kho: a.kho + (n?.kho ?? 0) }), { nha: s.qdNha, kho: s.qdKho });
    if (them.nha !== nguon.nha || them.kho !== nguon.kho) ghi('CN01', () => `${lc()}: thong doc da noi nha ${S(them.nha)} kho ${S(them.kho)}, cac nguon cong lai nha ${S(nguon.nha)} kho ${S(nguon.kho)}`);
    const [cap, mau] = [td.cap, capMau(v.cs, tp.soNha, nguon)];
    if (cap.ten !== mau.ten || cap.tranNha !== mau.tranNha || cap.tranKho !== mau.tranKho) ghi('CN01', () => `${lc()}: ${S(tp.soNha)} nha, thong doc dung cap ${cap.ten} tran ${S(cap.tranNha)} nha ${S(cap.tranKho)} kho, phai la ${mau.ten} ${S(mau.tranNha)} nha ${S(mau.tranKho)} kho`);
    if (s.vao !== s.tongGia + cay.daDon || cay.daDon < 0) ghi('CN02', () => `${lc()}: da don ${S(s.vao)} diem != gia thuc cac cong nghe xong ${S(s.tongGia)} + dang don do ${S(cay.daDon)}`);
    if (dang !== undefined && (cay.daXong(dang.id) || !dang.tienDe.every((t) => cay.daXong(t)))) ghi('CN04', () => `${lc()}: dang hoc ${dang.id} (tien de ${dang.tienDe.join(', ')}) da xong hoac chua du tien de`);
    const [nay, mo, mong] = [cs.dangLap.map((t) => t?.id), new Set(cs.daMo().map((t) => t.id)), new Set(xong.flatMap((c) => c.moThe))];
    const [lap, lech] = [nay.filter((id) => id !== undefined), nay.findIndex((id, k) => id !== mongLap[k])];
    if (cs.soO !== doi.soO || cs.soO < s.soO) ghi('CN06', () => `${lc()}: so o ${S(s.soO)} -> ${S(cs.soO)}, thoi dai ${S(doi.so)} co ${S(doi.soO)} o`);
    if (lech >= 0) ghi('CN06', () => `${lc()}: o ${S(lech)} thanh ${S(nay[lech])}, phai la ${S(mongLap[lech])}`);
    if (new Set(lap).size !== lap.length || lap.some((id) => !mo.has(id))) ghi('CN06', () => `${lc()}: dang lap ${lap.join(', ')}: mot the hai o hoac the chua mo`);
    if (mong.size !== mo.size || [...mong].some((id) => !mo.has(id))) ghi('CN07', () => `${lc()}: the da mo {${[...mo].join(', ')}}, cong nghe da xong mo ra {${[...mong].join(', ')}}`);
    for (const n of TEN_NGUONG) if (td.layNguong(n) < 0) ghi('CN12', () => `${lc()}: ${n} = ${S(td.layNguong(n))}`);
    daKiem('CN01', 'CN02', 'CN04', 'CN06', 'CN07', 'CN12'); [s.soO, s.lap] = [cs.soO, nay];
  };
  const donGoc = cay.don.bind(cay);
  cay.don = (them, gia): CongNghe | undefined => {
    const [conHoc, daDon, tk, so, l] = [cay.soXong < cay.toanBo.length, cay.daDon, tp.gioVuaXong(), soThat(), du.congNghe.luat];
    const [tho, hs] = [l.coBan + Math.floor(so.soNha / l.moiNhaMotDiem), cs.dangLap.reduce((a, t) => a + (t === undefined ? 0 : t.heSoNghienCuu - 100), 100)]; // CN02: he so CONG DON
    if (!Number.isInteger(them) || them < Math.max(0, Math.round((tho * hs) / 100)) || them > Math.round((tho * Math.max(hs, hsMin)) / 100)) ghi('CN02', () => `${noi(tk?.gio)}: don ${S(them)} diem; ${S(so.soNha)} nha, he so the ${S(hs)} % cho ${S(Math.round((tho * hs) / 100))}`);
    if (tk !== undefined) for (const { congNghe: id, dieuKien: dk } of du.eureka.ds) if (!daNo.has(id) && !cay.daXong(id) && dungDK(dk, tk, so)) ghi('CN10', () => `${noi(tk.gio)}: don diem khi Eureka ${id} du dieu kien ma chua no`);
    [s.donTrongGio, s.soNhaMeta] = [s.donTrongGio + 1, so.soNha]; const xong = donGoc(them, gia); // so nha xet len doi: sau thong doc, truoc thuong
    if (conHoc) s.vao += them; // hoc het ca cay thi diem gio do bo di la co y (CongNghe.don). Gia THAT la `meta.gia` (CN09 kiem), khong phai `gia` dua vao
    const [d, g, thieu] = [cay.dang, xong === undefined ? 0 : meta.gia(xong), xong?.tienDe.filter((t) => !xongTruoc.has(t)) ?? []];
    if (xong !== undefined && daDon + them < g) ghi('CN03', () => `${noi(tk?.gio)}: ${xong.id} xong khi moi co ${S(daDon + them)} diem < gia ${S(g)}`);
    if (xong === undefined && d !== undefined && cay.daDon >= meta.gia(d)) ghi('CN03', () => `${noi(tk?.gio)}: dang hoc ${d.id} co ${S(cay.daDon)} diem >= gia ${S(meta.gia(d))} ma khong xong`);
    if (xong !== undefined && (xongTruoc.has(xong.id) || thieu.length > 0)) ghi('CN04', () => `${noi(tk?.gio)}: ${xong.id} xong lan nua hoac xong truoc tien de ${thieu.join(', ')}`);
    if (xong !== undefined) { [s.tongGia, s.xongGio] = [s.tongGia + g, [...s.xongGio, xong]]; xongTruoc.add(xong.id); }
    daKiem('CN02', 'CN03', 'CN10'); return xong;
  };
  const chamGoc = meta.eureka.cham.bind(meta.eureka);
  meta.eureka.cham = (tk, so, daXong) => {
    const [xongLuc, soLuc, moi] = [new Set(cay.toanBo.filter((c) => cay.daXong(c.id)).map((c) => c.id)), soThat(), chamGoc(tk, so, daXong)];
    const ra = new Set(moi.map((m) => m.congNghe));
    if (ra.size !== moi.length) ghi('CN09', () => `${noi(tk.gio)}: mot Eureka no hai lan trong mot gio`);
    for (const { congNghe: id, dieuKien: dk } of du.eureka.ds) {
      const [dung, coNo, duocNo] = [dungDK(dk, tk, soLuc), ra.has(id), !daNo.has(id) && !xongLuc.has(id)];
      const lc = (): string => `${noi(tk.gio)}: Eureka ${id} (da no ${S(daNo.has(id))}, da xong ${S(xongLuc.has(id))}, ${dk.do} ${dk.hang ?? ''} ${dk.phep} ${S(dk.gia)} la ${S(dung)})`;
      if (coNo && !(duocNo && dung)) ghi('CN09', () => `${lc()} lai no`);
      if (!coNo && duocNo && dung) ghi('CN10', () => `${lc()} khong no`);
    }
    for (const id of ra) daNo.add(id);
    daKiem('CN09', 'CN10'); return moi;
  };
  const hoiGoc = dc.hoi.bind(dc);
  dc.hoi = (tk, so) => {
    const [theTruoc, soLuc, ra] = [van.the, soThat(), hoiGoc(tk, so)]; s.hoiTrongGio += 1;
    const hopLe = s.soHoi >= nd.toiDaMotVan || tk.gio % nd.gioQuet !== 0 ? [] : THE_QD.filter((t) => (t.khan || tk.gio - s.gioCuoi >= nd.gioGianCach)
      && tk.gio - (lanHoi.get(t.ten) ?? -Infinity) >= nd.gioLapLai && t.dieuKien.every((dk) => dungDK(dk, tk, soLuc)));
    const lc = (): string => `${noi(tk.gio)}: hoi ${ra?.ten ?? '(khong)'}; hop le theo luat {${hopLe.map((t) => `${t.ten} ${S(t.diem)}`).join(', ')}}; da hoi ${S(s.soHoi)}, the truoc o gio ${S(s.gioCuoi)}`;
    if (theTruoc !== undefined) ghi('CN11', () => `${lc()}; the ${theTruoc.ten} con treo`);
    if (ra === undefined ? hopLe.length > 0 : !hopLe.includes(ra) || ra.diem !== Math.max(...hopLe.map((t) => t.diem))) ghi('CN11', lc);
    if (ra !== undefined) { [s.soHoi, s.gioCuoi] = [s.soHoi + 1, tk.gio]; lanHoi.set(ra.ten, tk.gio); }
    if (dc.so !== s.soHoi || s.soHoi > nd.toiDaMotVan) ghi('CN11', () => `${lc()}; dong co dem ${S(dc.so)}, dem duoc ${S(s.soHoi)}, tran ${S(nd.toiDaMotVan)}`);
    daKiem('CN11'); return ra;
  };
  const moiGioGoc = van.moiGio.bind(van);
  van.moiGio = (): void => {
    const [nha0, kho0, cap0, daLam0, the0, doi0] = [tp.soNha, tp.doiWalker.soKho, capMau(v.cs, tp.soNha, td.themTran), td.daLam.length, van.the, meta.thoiDai.doi.so]; // cap0 THAT
    [s.xongGio, s.soNhaMeta, s.hoiTrongGio, s.donTrongGio] = [[], -1, 0, 0]; moiGioGoc(); s.gio = tp.gioVuaXong()?.gio ?? s.gio;
    const [soId, doi, len] = [cay.toanBo.filter((c) => cay.daXong(c.id)).length, meta.thoiDai.doi.so, du.doi[doi0 - 1]?.len];
    if (s.donTrongGio !== 1) ghi('CN02', () => `${noi()}: gio nay don diem nghien cuu ${S(s.donTrongGio)} lan`);
    if (s.xongGio.length > 1 || cay.soXong !== xongTruoc.size || soId !== xongTruoc.size || [...xongTruoc].some((id) => !cay.daXong(id))) ghi('CN04', () => `${noi()}: gio nay xong ${S(s.xongGio.length)} cong nghe; soXong ${S(cay.soXong)}, dem daXong ${S(soId)}, da thay xong ${S(xongTruoc.size)}`);
    const duLen = s.soNhaMeta >= 0 && len !== undefined && du.doi[doi0] !== undefined && cay.soXong >= len.soCongNghe && s.soNhaMeta >= len.soNha;
    if (doi !== doi0 + (duLen ? 1 : 0)) ghi('CN05', () => `${noi()}: thoi dai ${S(doi0)} -> ${S(doi)} voi ${S(cay.soXong)} cong nghe, ${S(s.soNhaMeta)} nha; dieu kien len ${len === undefined ? 'khong co' : `${S(len.soCongNghe)} cong nghe, ${S(len.soNha)} nha`}`);
    for (const c of cay.toanBo) {
      const [g, cu, mong] = [meta.gia(c), giaCu.get(c.id) ?? c.gia, daNo.has(c.id) ? Math.max(1, Math.round((c.gia * (100 - du.eureka.giam)) / 100)) : c.gia];
      if (g !== mong || g > cu) ghi('CN09', () => `${noi()}: gia ${c.id} ${S(cu)} -> ${S(g)}, phai la ${S(mong)} (goc ${S(c.gia)}, Eureka da no ${S(daNo.has(c.id))})`);
      giaCu.set(c.id, g); }
    if (the0 !== undefined && van.the !== the0) ghi('CN11', () => `${noi()}: the ${the0.ten} dang treo bi doi trong moiGio`);
    if (v.batHoi && the0 === undefined && s.hoiTrongGio === 0) ghi('CN11', () => `${noi()}: het gio ma khong xet the quyet dinh`);
    const moi = td.daLam.slice(daLam0); // CN12: nha, kho tang dung so viec ghi so, cong thuong xay cua cong nghe vua xong (data chua co cai nao)
    const [viecKho, dNha, dKho] = [moi.filter((w) => w.viec === 'kho').length, tp.soNha - nha0, tp.doiWalker.soKho - kho0];
    const [thuongNha, thuongKho] = [s.xongGio.reduce((a, c) => a + (c.thuong?.xay ?? []).reduce((b, m) => b + m.so, 0), 0), s.xongGio.filter((c) => c.thuong?.xayKho === true).length];
    if (moi.length > 1) ghi('CN12', () => `${noi()}: thong doc lam ${S(moi.length)} viec mot gio`);
    for (const w of moi) if (w.gio % v.cs.gioMoiLan !== 0 || w.cap !== cap0.ten || (w.viec === 'kho' ? kho0 >= cap0.tranKho : nha0 >= cap0.tranNha || !TEN_NHA.has(w.viec))) ghi('CN12', () => `${noi()}: thong doc ghi "${w.viec}" (cap ${w.cap}, gio ${S(w.gio)}) khi co ${S(nha0)}/${S(cap0.tranNha)} nha, ${S(kho0)}/${S(cap0.tranKho)} kho, cap ${cap0.ten}`);
    if (dNha < moi.length - viecKho || dNha > moi.length - viecKho + thuongNha || dKho < viecKho || dKho > viecKho + thuongKho) ghi('CN12', () => `${noi()}: nha tang ${S(dNha)}, kho tang ${S(dKho)} ma so ghi ${S(moi.length - viecKho)} nha, ${S(viecKho)} kho`);
    daKiem('CN04', 'CN05', 'CN09', 'CN11', 'CN12'); trangThai('sau moiGio');
  };
  return { sau: trangThai,
    traLoi(lc) {
      [s.qdNha, s.qdKho] = [s.qdNha + (lc.hauQua.noiTran?.nha ?? 0), s.qdKho + (lc.hauQua.noiTran?.kho ?? 0)]; van.traLoi(lc);
      if (van.the !== undefined) ghi('CN11', () => `${noi()}: tra loi "${lc.van}" xong van con the ${van.the?.ten ?? ''}`);
      trangThai(`sau khi chon "${lc.van}"`);
    },
    /** CN08: lap (`id`) hay thao (`undefined`) duoc khi va chi khi dung luat; CN06: chi o do doi. */
    doiThe(o, id) {
      const [coThat, daCho] = [o >= 0 && o < cs.soO, s.gio - s.gioDoi >= du.gioChoDoiThe]; // gio THAT = gio vua chot, khong tin `meta.gio`
      const dangCo = coThat && s.lap[o] !== undefined; const phai = id === undefined ? dangCo && daCho : coThat && cs.daMo().some((t) => t.id === id) && !s.lap.some((x, k) => k !== o && x === id) && (!dangCo || daCho);
      const [ok, viec] = id === undefined ? [meta.thaoThe(o), `thao o ${S(o)}`] : [meta.lapThe(o, id), `lap ${id} vao o ${S(o)}`];
      if (ok !== phai) ghi('CN08', () => `${noi()}: ${viec} (dang co ${S(s.lap[o])}, lan doi truoc o gio ${S(s.gioDoi)}, phai cho ${S(du.gioChoDoiThe)} gio) ra ${S(ok)}, phai ${S(phai)}`);
      daKiem('CN08'); if (ok) s.gioDoi = s.gio;
      trangThai(`sau khi ${viec} (${S(ok)})`, s.lap.map((x, k) => (ok && k === o ? id : x)));
    },
  };
}
/** Nguoi choi gia, 0-5 lan bam: tra loi the (uu tien lua chon noi tran / ha nguong), chon cong nghe bat ky, lap thao ca o sai, the chua mo. */
function bam(v: VanThu, k: Kiem): void {
  const [r, cay, cs] = [v.r, v.meta.cay, v.meta.chinhSach];
  for (let lan = r.nguyen(6); lan > 0; lan -= 1) {
    const [x, y, the, duoc, o, mo] = [r.so(), r.so(), v.van.the, cay.hocDuoc(), r.nguyen(cs.soO + 2) - 1, cs.daMo()];
    const [dang, uuTien] = [cs.dangLap[o], the?.chon.filter((c) => c.hauQua.noiTran !== undefined || Object.values(c.hauQua.doiNguong ?? {}).some((d) => d < 0)) ?? []];
    if (the !== undefined && x < 0.3) k.traLoi(uuTien.length > 0 && y < 0.6 ? chon(r, uuTien) : chon(r, the.chon));
    else if (x < 0.5) {
      const id = y < 0.05 ? 'khong_co' : y < 0.55 && duoc.length > 0 ? chon(r, duoc).id : chon(r, ID_CN);
      cay.chon(id); k.sau(`sau khi chon hoc ${id}`);
    } else k.doiThe(o, x >= 0.8 ? undefined : y < 0.15 && dang !== undefined ? dang.id : y < 0.85 && mo.length > 0 ? chon(r, mo).id : chon(r, ID_THE));
  }
}
/** Dung mot van. Hat le: nhip the, gio cho doi the, % Eureka, nhip thong doc ngau nhien trong khoang bo doc nhan. Hat chia 3 du 2: keo tran. */
function dungVan(i: number, that: boolean, nhan = ''): [VanThu, Kiem] {
  const hat = new Rng(HAT_GOC + i).nguyen(2 ** 31); const rd = i % 2 === 1 && !that ? new Rng(hat ^ 0x5bd1e995) : undefined;
  const cb = rd === undefined ? canBang : { ...canBang, gioQuet: 1 + rd.nguyen(2 * canBang.gioQuet + 1), gioGianCach: rd.nguyen(2 * canBang.gioGianCach + 2),
    gioLapLai: rd.nguyen(2 * canBang.gioLapLai + 1), toiDaMotVan: 1 + rd.nguyen(2 * canBang.toiDaMotVan), gioChoDoiThe: rd.nguyen(2 * canBang.gioChoDoiThe + 1) };
  const du = docDuLieuMeta(techTho, rd === undefined ? eurekaTho : { ...eurekaTho, giam: chon(rd, [0, 1, eurekaTho.giam, 99, rd.nguyen(100)]) }, theTho, cb);
  const cs = docChinhSach(rd === undefined ? policy : { ...policy, gioMoiLan: 1 + rd.nguyen(2 * policy.gioMoiLan + 1), nguongCho: rd.nguyen(2 * policy.nguongCho + 1),
    nguongDinh: rd.nguyen(2 * policy.nguongDinh + 1), nguongBoCuoc: rd.nguyen(2 * policy.nguongBoCuoc + 1) }); // nguong nho: thuong cong nghe, the keo xuong sat 0
  const gia = that ? undefined : new ThanhPhoGia(new Rng(hat ^ 0x27d4eb2f));
  const tp = gia === undefined ? new ThanhPho({ hang, nha, chuoi, banDo: { ...banDo, hatGiong: hat }, walker: { ...walker, hatGiongDatNha: (hat * 7 + 3) >>> 0 } })
    : gia as unknown as ThanhPho; // thanh pho gia co du nhung gi Governor, Meta, Van doc
  const [td, kep] = [new Governor(tp, cs), gia !== undefined && i % 3 === 2];
  if (kep && gia !== undefined) gia.tran = (): number => td.cap.tranNha;
  const [meta, dc, nk, batHoi] = [new Meta(du, tp, td), new DongCo(THE_QD, docNhipDo(cb)), new NhatKy(), !that && i % 4 >= 2]; // batHoi false: nhu CityScene
  const van = new Van(tp, td, dc, nk, batHoi, meta);
  const chayGio = gia === undefined ? (): void => { tp.chay(NHIP_MOI_GIO); } : (g: number): void => { gia.chayGio(g); van.moiGio(); };
  const ten = `hat ${S(i)}${nhan} (${S(hat)}${rd === undefined ? '' : ', data ngau'}${kep ? ', keo tran' : ''}${that ? ', thanh pho that' : ''})`;
  const v: VanThu = { ten, tp, td, meta, dc, van, nk, du, nd: docNhipDo(cb), cs, r: new Rng(hat ^ 0x9e3779b9), chayGio, batHoi };
  const k = ganKiem(v); // gan TRUOC moDau de nghe ca gio dau
  if (that) { tp.datThongDoc(van); tp.moDau(); van.batDau(); v.batHoi = true; } // y nhu CityScene: chay gio dau roi moi hoi
  return [v, k];
}
const buoc = (v: VanThu, k: Kiem, g: number): void => { if (!v.batHoi && g === 2) { v.van.batDau(); v.batHoi = true; k.sau('sau batDau'); } bam(v, k); v.chayGio(g); bam(v, k); };
/** CN15: van tay cua mot van - moi thu nguoi choi thay va moi thu cac luat tren doc. */
const vanTay = (v: VanThu): string => JSON.stringify([v.tp.soNha, v.tp.doiWalker.soKho, v.td.themTran, TEN_NGUONG.map((n) => v.td.layNguong(n)), v.td.daLam.length,
  v.meta.cay.soXong, v.meta.cay.dang?.id, v.meta.cay.daDon, v.meta.thoiDai.doi.so, v.meta.chinhSach.dangLap.map((t) => t?.id), v.meta.chinhSach.daMo().length,
  v.meta.cay.toanBo.map((c) => v.meta.gia(c)), v.dc.so, v.van.the?.ten, v.nk.danhSach.length, v.nk.moiNhat(3)]);
/** Tran nhip moi lan `tien`, do bang mot lan may treo lau o toc do cao nhat (`Clock.ts` khong xuat hang so nay). */
const TRAN = ((): number => { const dh = new DongHo(); dh.tocDo = TOC_MAX; return dh.tien(GIAY_TREO); })();
/** CN13 CN14: khung 30-144 fps co rung, may treo, dt am hay 0, doi toc do, `chayThang`. Kiem MOI khung, tong mong doi la so nguyen. */
function chayDongHo(i: number): void {
  const [r, dh] = [new Rng(HAT_GOC * 7 + i), new DongHo()];
  let [toc, tong, n0, t0, n1, t1] = [dh.tocDo, 0, 0, 0, 0, 0]; // n0 t0: tu lan doi toc do; n1 t1: tu khung cham tran gan nhat (hay lan doi toc do)
  for (let k = 0; k < TS.khung; k += 1) {
    const [x, y, lc] = [r.so(), r.so(), (): string => `dong ho hat ${S(i)}, khung ${S(k)}, toc do ${S(toc)}`];
    if (x < 0.0005) { toc = chon(r, TOC_DO); dh.tocDo = toc; [n0, t0, n1, t1] = [0, 0, 0, 0]; continue; }
    if (x < 0.0007) { const n = r.nguyen(1000); dh.chayThang(n); tong += n; continue; }
    const giay = y < 0.001 ? -r.so() * 0.05 : y < 0.002 ? 0 : y < 0.004 ? r.so() * GIAY_TREO
      : (y < 0.2 ? 1 / 30 : y < 0.3 ? 1 / 120 : y < 0.35 ? 1 / 144 : 1 / 60) * (1 + (r.so() - 0.5) * 0.3);
    const kk = Math.round(giay * MAU); const [n, them] = [dh.tien(kk / MAU), kk > 0 ? kk * toc * NHIP_MOI_GIAY : 0]; // them: thoi gian that cho phep, don vi 1/MAU nhip
    [tong, n0, t0, n1, t1] = [tong + n, n0 + n, t0 + them, n === TRAN ? 0 : n1 + n, n === TRAN ? 0 : t1 + them]; // n0 t0 khong qua; n1 t1 thieu <= 1 nhip
    if (!Number.isInteger(n) || n < 0 || n > TRAN || ((toc === 0 || kk <= 0) && n !== 0)) ghi('CN13', () => `${lc()}: tien(${S(kk)}/${S(MAU)} giay) ra ${S(n)} nhip (tran ${S(TRAN)})`);
    if (n0 * MAU > t0 || t1 - n1 * MAU > MAU) ghi('CN13', () => `${lc()}: tu lan doi toc do chay ${S(n0)} nhip / that cho ${S(t0 / MAU)}; tu lan cham tran ${S(n1)} / ${S(t1 / MAU)}`);
    if (n1 * MAU > t1 + MAU) ghi('CN14', () => `${lc()}: tu lan cham tran chay ${S(n1)} nhip, thoi gian that chi cho ${S(t1 / MAU)}`);
  }
  if (dh.soNhip !== tong || dh.gio !== dh.soNhip / NHIP_MOI_GIO) ghi('CN13', () => `dong ho hat ${S(i)}: soNhip ${S(dh.soNhip)}, cong tung lan ${S(tong)}, gio ${S(dh.gio)}`);
  daKiem('CN13', 'CN14');
}
describe('luat bat bien cong nghe, the, thong doc, dong ho', () => {
  beforeAll(() => {
    if (TRAN <= 0 || TRAN >= TOC_MAX * NHIP_MOI_GIAY) ghi('CN13', () => `may treo ${S(GIAY_TREO)} giay o ${S(TOC_MAX)}x chay bu ${S(TRAN)} nhip trong mot khung`);
    for (let i = 0; i < TS.hatGia; i += 1) {
      const [[a, ka], doi] = [dungVan(i, false), i < TS.hatSinhDoi ? dungVan(i, false, ' ban sinh doi') : undefined]; // sinh doi XEN KE: bat trang thai cap module
      for (let g = 1; g <= TS.gioGia; g += 1) {
        buoc(a, ka, g); if (doi === undefined) continue;
        buoc(doi[0], doi[1], g); daKiem('CN15');
        if (vanTay(a) !== vanTay(doi[0])) ghi('CN15', () => `${a.ten}, gio ${S(g)}: ban mot ${vanTay(a)} | ban hai ${vanTay(doi[0])}`);
      }
    }
    for (let i = 0; i < TS.hatThat; i += 1) { const [v, k] = dungVan(1000 + i, true); for (let g = 1; g <= TS.gioThat; g += 1) buoc(v, k, g); }
    for (let i = 0; i < TS.hatDongHo; i += 1) chayDongHo(i);
  }, HAN_MS);
  it('[CN01] tran thong doc bang dung cap goc cong phan cong nghe, the quyet dinh va the chinh sach dang lap da noi', () => { kiemLuat('CN01'); });
  it('[CN02] diem nghien cuu moi gio don dung mot lan dung cong thuc, khong tu sinh tu mat ke ca khi doi cong nghe', () => { kiemLuat('CN02'); });
  it('[CN03] du diem thi xong ngay, chua du diem thi chua xong', () => { kiemLuat('CN03'); });
  it('[CN04] khong cong nghe nao xong truoc tien de, moi cai xong dung mot lan, moi gio nhieu nhat mot cai', () => { kiemLuat('CN04'); });
  it('[CN05] thoi dai len tung bac khi du cong nghe va du nha, du dieu kien thi phai len ngay', () => { kiemLuat('CN05'); });
  it('[CN06] so o chinh phu bang so o cua thoi dai, khong giam; the dang lap chi doi khi lap thao thanh cong', () => { kiemLuat('CN06'); });
  it('[CN07] the chinh sach da mo dung bang cac the ma cong nghe da xong mo ra', () => { kiemLuat('CN07'); });
  it('[CN08] doi the dung luat cho: o dang co the phai cho du gio, o trong thi lap duoc ngay', () => { kiemLuat('CN08'); });
  it('[CN09] moi Eureka no nhieu nhat mot lan, chi khi dung dieu kien va cong nghe chua xong; gia chi giam dung phan tram', () => { kiemLuat('CN09'); });
  it('[CN10] du dieu kien Eureka thi phai no ngay gio do, truoc khi don diem gio do', () => { kiemLuat('CN10'); });
  it('[CN11] the quyet dinh hoi dung nhip, dung the diem cao nhat, co the hop le thi phai hoi, khong chong the', () => { kiemLuat('CN11'); });
  it('[CN12] thong doc moi gio nhieu nhat mot viec, khong xay khi cham tran, so ghi dung viec that, nguong khong am', () => { kiemLuat('CN12'); });
  it('[CN13] dong ho khong chay qua thoi gian that, thieu nhieu nhat mot nhip, moi lan khong qua tran, dung hinh thi dung yen', () => { kiemLuat('CN13'); });
  it('[CN14] dong ho khong chay bu thoi gian da bo khi cham tran', () => { kiemLuat('CN14'); });
  it('[CN15] cung hat giong cung lua chon thi van y het', () => { kiemLuat('CN15'); });
});
