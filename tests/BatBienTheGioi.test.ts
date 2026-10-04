/**
 * Luat bat bien lop the gioi, ma [TG..] trong `docs/LUAT_BAT_BIEN.md`: dieu KHONG BAO GIO duoc pha, kiem tren nhieu hat giong (TheGioi/HienTheGioi.test kiem
 * tung ca dung tay). `beforeAll` choi MOT van moi hat - nguoi choi gia 6 tinh cach bam nut, vet thanh pho gia day `gioTiep`, them vai van dai tat dieu kien
 * thang - kiem moi luat quanh MOI buoc, gom vi pham theo ma; moi `it` chi doi danh sach cua ma minh rong, in vi pham dau (hat, gio, buoc, chi tiet).
 * `LUAT_SAU=1`: nhieu hat, choi toi het van. Chi dung API cong khai: luot AI bat bang cach boc phuong thuc cong khai tren instance (AI goi qua `tg.`),
 * chup vang/quan ngay truoc hanh dong AI dau tien = luc vua mua quan xong. TG09 thu MOI nut roi hoan tac: truong cong khai thi luu roi tra; phan khong hoan
 * tac duoc qua API (`ngoaiGiao.damPhan`, `batOn.chon`) thi thay tam bang ban chi tra loi; nut the dang khoa kiem bang bam that (bo mac bam moi gio).
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { docDuLieuTran, type DuLieuTran } from '../src/sim/campaign/Battle.ts';
import { dungBanDoTinh, tinhKe, type BanDoTinh, type CauHinhBanDoTinh, type CauHinhNuoc } from '../src/sim/campaign/BanDoTinh.ts';
import { doiMuaDuoc, muaQuan, sucQuan, xacSuatThang } from '../src/sim/campaign/ChienTranh.ts';
import { chonBatOn, dauTuVanHoa } from '../src/sim/campaign/HanhDong.ts';
import { hangNgoaiGiao, manKet, tanCongTinh, theBatOn } from '../src/sim/campaign/HienTheGioi.ts';
import { TheGioi, type LyDoTanCong, type SoNuocTa } from '../src/sim/campaign/TheGioi.ts';
import { docTheGioi, type DuLieuTheGioi } from '../src/sim/campaign/TheGioiData.ts';

const doc = (ten: string): unknown => JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
const tran: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), doc('battle.json'));
const du: DuLieuTheGioi = docTheGioi(doc('the_gioi.json'), doc('victory.json'), new Set(tran.doi.keys()));
const banDo: BanDoTinh = dungBanDoTinh(doc('provinces.json') as CauHinhBanDoTinh, doc('nations.json') as CauHinhNuoc);
const SAU = process.env.LUAT_SAU === '1';
const SO_HAT = SAU ? 120 : 18; // van thuong: hat 1..SO_HAT, hat % 6 chon tinh cach nguoi choi
const SO_HAT_DOI = SAU ? 120 : 6; // TG13: may hat dau chay kem ban sao song song
// Van dai (tinh cach hoa hao, tat dieu kien thang, het gio o GIO_DAI): song qua moc AI len doi cuoi (`doi_ai_theo_gio`) moi gap mua
// nhieu doi mot gio luc sat tran quan (TG05). Che do thuong: hai hat do 03/10 song qua gio 300 (TG05 do o gio 192-241), het gio o 300 cho TG11 gap ly do het gio.
const HAT_DAI: readonly number[] = SAU ? Array.from({ length: SO_HAT }, (_, i) => i + 1) : [4, 9];
const [GIO_DAI, GIO_CHOI] = [SAU ? 700 : 300, SAU ? Infinity : 150]; // GIO_CHOI: che do thuong cat van thuong (khong cat van dai) o gio nay
const [QUAN_HE_TRAN, EPS] = [100, 1e-9]; // quan he ghim trong [-100, 100] (the_gioi.json > _ngoai_giao, NgoaiGiao.ts)
const IDS: readonly string[] = banDo.nuoc.map((n) => n.id);
const CAP: readonly (readonly [string, string])[] = IDS.flatMap((a, i) => IDS.slice(i + 1).map((b) => [a, b] as const));
const THU_DO = new Map(banDo.tinh.filter((t) => t.thuDo).map((t) => [t.nuoc, t.id]));
const [LA_THU_DO, KE, THE_GIAM] = [new Set(THU_DO.values()), tinhKe(banDo), [...du.batOn.theGiam.keys()]];
const LY_DO: Readonly<Record<LyDoTanCong, string>> = { '': '', 'khong-co-tinh': 'Không có tỉnh này', 'cua-minh': 'Tỉnh của ta', 'khong-ke': 'Không giáp đất ta', 'khong-dang-chien': 'Chưa tuyên chiến', 'dang-nghi': 'Quân đang nghỉ', 'het-quan': 'Hết quân' };
type Kieu = 'buon' | 'damPhan' | 'deDoa' | 'tuyenChien' | 'tanCong' | 'the' | 'dauTu' | 'tiLe';
interface Viec { readonly k: Kieu; readonly n: string; readonly t: string; readonly v: number }
const KIEU_NUOC: readonly Kieu[] = ['buon', 'damPhan', 'deDoa', 'tuyenChien'];
const TINH_CACH: readonly Partial<Record<Kieu, number>>[] = [ // trong so bam nut: 0 hieu chien, 1 hoa hao, 2 van hoa, 3 loan; 4 bo mac (chi bam nut the dang khoa), 5 khung hoang (chien moi nuoc, luon thieu an) khong bam
  { tanCong: 6, tuyenChien: 0.6, the: 2, damPhan: 0.3, deDoa: 0.8, buon: 0.2, dauTu: 0.1 }, { buon: 3, damPhan: 3, the: 2, dauTu: 0.5, deDoa: 0.2, tanCong: 0.2, tuyenChien: 0.02 },
  { dauTu: 3, damPhan: 2, buon: 1, the: 2, tanCong: 0.5, deDoa: 0.2, tuyenChien: 0.02 }, { buon: 1, damPhan: 1, deDoa: 1, tuyenChien: 0.3, tanCong: 1, the: 1, dauTu: 1 }, {}, {}];
type Ghi = (ma: string, chiTiet: string) => void;
const viPham = new Map<string, { so: number; vd: string[] }>();
const ghi: Ghi = (ma, chiTiet) => { const v = viPham.get(ma) ?? { so: 0, vd: [] }; viPham.set(ma, { so: v.so + 1, vd: v.vd.length < 3 ? [...v.vd, chiTiet] : v.vd }); };
const gap = new Map<string, number>(); // so lan gap tinh huong luat can de khong rong (vd TG08 can noi loan)
const dem = (ma: string): void => { gap.set(ma, (gap.get(ma) ?? 0) + 1); };
const rngCua = (hat: number, muoi: number): Rng => new Rng(Math.imul(hat, 0x9e3779b1) ^ Math.imul(muoi, 0x85ebca6b));
const gan = (a: number, b: number): boolean => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
const [gia, sucDoi] = [(id: string): number => tran.doi.get(id)?.gia ?? NaN, (id: string): number => sucQuan([id], tran)];
const chuTinh = (w: TheGioi): string[] => banDo.tinh.map((t) => w.chu(t.id));
/** Phan tu cua `sau` khong co trong `truoc` (hieu multiset); rong <=> `sau` nam tron trong `truoc`. */
const hieu = (sau: readonly string[], truoc: readonly string[]): string[] => {
  const con = truoc.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>());
  return sau.filter((x) => { const k = con.get(x) ?? 0; con.set(x, k - 1); return k <= 0; });
};
/** Anh trang thai doc qua API cong khai - so hai the gioi, hay mot the gioi truoc/sau. */
const anh = (w: TheGioi): string => JSON.stringify([w.dsNuoc, banDo.tinh.map((t) => (w.chu(t.id) === '' ? w.quanThu(t.id) : w.chu(t.id))),
  CAP.map(([a, b]) => [w.ngoaiGiao.quanHe(a, b), w.ngoaiGiao.trangThai(a, b), w.ngoaiGiao.dangThuongMai(a, b)]),
  [w.batOn.chiSo, w.batOn.theMo, w.batOn.gioDaKe, w.batOn.gioGiamThue], w.gio, w.ketQua, w.nhatKy.length, w.nhatKy.at(-1), w.tiLeChiQuanTa]);
/** Vet thanh pho gia: nha len xuong, doi theo moc AI keo gian, thieu an theo xich Markov (khung hoang: luon thieu). */
function taoVet(hat: number, soGio: number, khungHoang: boolean): SoNuocTa[] {
  const [r, D] = [rngCua(hat, 1), du.thang.khoaHocDoi];
  const [tang, keo, pBat, pTat, choXong, tre] = [r.so() * 1.5, 0.5 + r.so() * 1.1, r.so() * 0.15, 0.1 + r.so() * 0.5, r.so() < 0.25, 10 + r.nguyen(50)];
  const moc = [...du.doiAiTheoGio.slice(1), (du.doiAiTheoGio.at(-1) ?? 0) * 1.35].map((g) => g * keo); // moc len doi 2..D
  let [soNha, thieu, gioDich, the] = [40 + r.so() * 360, false, -1, [] as string[]];
  return Array.from({ length: soGio }, (_, i): SoNuocTa => {
    soNha = Math.max(0, soNha + tang * (0.5 + r.so()) - (r.so() < 0.02 ? soNha * r.so() * 0.1 : 0));
    const doi = Math.min(D, 1 + moc.filter((m) => m <= i + 1).length);
    gioDich = gioDich < 0 && doi === D ? i + 1 : gioDich;
    thieu = khungHoang || (thieu ? r.so() >= pTat : r.so() < pBat);
    if (r.so() < 0.03) the = THE_GIAM.filter(() => r.so() < 0.6);
    const xongHet = choXong && gioDich >= 0 && i + 1 - gioDich >= tre ? D : Math.min(D - 1, doi - 1);
    return { soNha: Math.floor(soNha), doi, soCongNgheXong: Math.floor(doi * 6 + r.so() * 5), doiXongHet: xongHet, thieuLuongThuc: thieu, theDangLap: the };
  });
}
/** Mot lan bam nut cua nguoi choi tren mot the gioi. */
const LAM: Readonly<Record<Kieu, (w: TheGioi, x: Viec) => boolean | LyDoTanCong | undefined>> = {
  buon: (w, x) => w.ngoaiGiao.datThuongMai(w.ta, x.n, !w.ngoaiGiao.dangThuongMai(w.ta, x.n)), damPhan: (w, x) => w.damPhan(w.ta, x.n),
  deDoa: (w, x) => w.deDoa(w.ta, x.n), tanCong: (w, x) => w.tanCong(w.ta, x.t), the: (w, x) => chonBatOn(w, x.t),
  tuyenChien: (w, x) => { w.tuyenChien(w.ta, x.n); return undefined; }, dauTu: (w, x) => { dauTuVanHoa(w, x.v); return undefined; },
  tiLe: (w, x) => { w.tiLeChiQuanTa = x.v; return undefined; },
};
function choiVan(hat: number, dai: boolean): void {
  const d: DuLieuTheGioi = { ...du, hatGiong: hat, thang: dai ? { ...du.thang, gioToiDa: GIO_DAI, khoaHocDoi: Infinity, vanHoaToiThieu: Infinity, ngoaiGiaoTiLePhieu: Infinity } : du.thang };
  const [tg, ban2] = [new TheGioi(d, banDo, tran), !dai && hat <= SO_HAT_DOI ? new TheGioi(d, banDo, tran) : undefined]; // ban2 (TG13): khong boc gi, nhan cung chuoi bam
  const [ta, tc, r, danhCuoi, conSong] = [tg.ta, dai ? 1 : hat % TINH_CACH.length, rngCua(hat, 2), new Map<string, number>(), new Set(IDS)];
  let [buoc, dangGio, thu, bong, ketTruoc, dpAi] = ['dau', false, false, chuTinh(tg), '', new Map<string, number>()];
  const g: Ghi = (ma, s) => { ghi(ma, `hat ${String(hat)}${dai ? ' (van dai)' : ''} gio ${String(tg.gio)} ${buoc}: ${s}`); };
  let sauMua: Map<string, { vang: number; quan: string[] }> | undefined;
  const sauMuaCua = (id: string): { vang: number; quan: string[] } | undefined => sauMua?.get(id);
  const goc = { tanCong: tg.tanCong.bind(tg), tuyenChien: tg.tuyenChien.bind(tg), damPhan: tg.damPhan.bind(tg), ngDamPhan: tg.ngoaiGiao.damPhan.bind(tg.ngoaiGiao), chon: tg.batOn.chon.bind(tg.batOn) };
  const chup = (): void => { if (dangGio && sauMua === undefined) sauMua = new Map(tg.dsNuoc.map((n) => [n.id, { vang: n.vang, quan: [...n.quan] }])); };
  const tiLe = (a: string, b: string): number => sucQuan(tg.nuoc(a).quan, tran) / Math.max(1, sucQuan(tg.nuoc(b).quan, tran)); // TG12 tinh lai, khong goi `tg.suc`/`keNuoc`/`mucTieu`
  const keNuoc = (a: string, b: string): boolean => tg.tinhCua(a).some((x) => [...(KE.get(x) ?? [])].some((k) => tg.chu(k) === b));
  tg.ngoaiGiao.damPhan = (a, b) => (thu ? tg.ngoaiGiao.trangThai(a, b) : goc.ngDamPhan(a, b));
  tg.batOn.chon = (id) => (thu ? (tg.batOn.theMo ? tg.batOn.luaChon.find((l) => l.id === id) : undefined) : goc.chon(id));
  const luotAi = (dung: boolean, s: string): void => { chup(); if (dangGio) dem('TG12'); if (dangGio && !dung) g('TG12', s); };
  tg.damPhan = (a, b) => {
    luotAi(tg.ngoaiGiao.trangThai(a, b) === 'chien_tranh' && tiLe(a, b) < d.ai.tiLeXinHoa, `AI ${a} dam phan ${b} khi khong dang chien hoac khong yeu hon (ti le suc ${String(tiLe(a, b))})`);
    const ok = goc.damPhan(a, b);
    if (dangGio && ok) { dpAi.set(a, (dpAi.get(a) ?? 0) + 1); if (sucQuan(tg.nuoc(b).quan, tran) > 0) dem('TG14'); } // TG14: hai ben cung 0 quan thi luon nhan, khong tinh
    return ok;
  };
  tg.tuyenChien = (a, b) => {
    const [tt, q] = [tg.ngoaiGiao.trangThai(a, b), tg.ngoaiGiao.quanHe(a, b)];
    luotAi(tg.nuoc(a).conSong && tg.nuoc(b).conSong && tt !== 'chien_tranh' && tt !== 'lien_minh' && keNuoc(a, b) && q < d.ai.quanHeTuyenChien && tiLe(a, b) >= d.ai.tiLeTuyenChien, `AI ${a} tuyen chien ${b}: ${tt}, quan he ${String(q)}, ke ${String(keNuoc(a, b))}, ti le suc ${String(tiLe(a, b))}`);
    goc.tuyenChien(a, b);
  };
  tg.tanCong = (nuoc, tinh) => {
    const [truoc, cu, n] = [chuTinh(tg), tg.chu(tinh), tg.nuoc(nuoc)];
    const [song, nghi, chien, keDat] = [n.conSong, n.gioNghi, cu === '' || tg.ngoaiGiao.trangThai(nuoc, cu) === 'chien_tranh', tg.tinhCua(nuoc).some((x) => KE.get(x)?.has(tinh) === true)];
    const xs = dangGio ? xacSuatThang(n.quan.slice(0, d.quan.doiMoiTran), tg.quanThu(tinh), tg.diaHinh(tinh), d.quan.tuong, tg.tuongThu(tinh), tran) : 1;
    luotAi(song && nghi === 0 && n.quan.length > 0 && cu !== nuoc && keDat && chien && xs >= d.ai.xacSuatTanCong, `AI ${nuoc} danh ${tinh}: nghi ${String(nghi)}, ${String(n.quan.length)} doi, ke dat ${String(keDat)}, dang chien ${String(chien)}, du doan ${String(xs)}`);
    const [ly, cuoi] = [goc.tanCong(nuoc, tinh), danhCuoi.get(nuoc)];
    bong = chuTinh(tg);
    if (ly === '' && (nghi !== 0 || (cuoi !== undefined && tg.gio - cuoi < d.quan.gioNghiTanCong))) g('TG02', `${nuoc} danh ${tinh} khi con nghi ${String(nghi)} gio, tran truoc o gio ${String(cuoi)}`);
    if (ly === '') danhCuoi.set(nuoc, tg.gio);
    banDo.tinh.forEach((t, i) => {
      const [c0, c1] = [truoc[i] ?? '', bong[i] ?? ''];
      const thac = c0 !== c1 && t.id !== tinh && cu !== '' && c0 === cu && !tg.nuoc(cu).conSong && THU_DO.get(cu) === tinh && tg.chu(tinh) === nuoc;
      if (thac) dem('TG02');
      if (c0 !== c1 && (c1 !== nuoc || ly !== '' || (t.id === tinh ? !(song && keDat && chien) : !thac))) g('TG02', `${nuoc} danh ${tinh} (tra "${ly}", song ${String(song)}, ke dat ${String(keDat)}, dang chien ${String(chien)}): ${t.id} doi chu "${c0}" -> "${c1}"`);
    });
    return ly;
  };
  function kiemChung(): void { // TG01, TG03, TG06-TG08, TG10, TG11: kiem sau MOI buoc
    for (const [t, c] of banDo.tinh.map((x) => [x.id, tg.chu(x.id)] as const)) {
      if (c !== '' && !(IDS.includes(c) && tg.nuoc(c).conSong)) g('TG01', `${t} thuoc "${c}" - khong phai trung lap hay nuoc con song`);
      if (c === '' && hieu(tg.quanThu(t), d.quan.quanTrungLap).length > 0) g('TG06', `quan trung lap ${t} dong hon bo dau: ${tg.quanThu(t).join(',')}`);
    }
    for (const n of tg.dsNuoc) {
      if (n.conSong && (!conSong.has(n.id) || tg.chu(THU_DO.get(n.id) ?? '') !== n.id)) g('TG01', `${n.id} con song ma da mat truoc do hoac khong giu thu do goc`);
      if (!n.conSong && (tg.tinhCua(n.id).length > 0 || n.quan.length > 0)) g('TG01', `${n.id} da mat ma con ${String(tg.tinhCua(n.id).length)} tinh, ${String(n.quan.length)} doi`);
      if (!n.conSong) conSong.delete(n.id);
      if (!(Number.isFinite(n.vang) && n.vang >= 0 && Number.isFinite(n.vanHoa))) g('TG03', `${n.id} vang ${String(n.vang)}, van hoa ${String(n.vanHoa)}`);
      if (n.quan.some((id, i) => !tran.doi.has(id) || sucDoi(id) > sucDoi(n.quan[i - 1] ?? id))) g('TG06', `${n.id} co doi la hoac khong xep manh truoc: ${n.quan.join(',')}`);
    }
    const [chiSo, dangChoi, vuaNoiLoan] = [tg.batOn.chiSo, tg.ketQua.trangThai === 'dang_choi', (): boolean => tg.nhatKy.some((l) => l.startsWith(`gio ${String(tg.gio)}: noi loan`))];
    if (!(Number.isFinite(chiSo) && chiSo >= 0 && (!dangChoi || chiSo < d.batOn.nguongSup))) g('TG07', `chi so bat on ${String(chiSo)} khi ${tg.ketQua.trangThai}, nguong sup ${String(d.batOn.nguongSup)}`);
    if (dangChoi && tg.batOn.theMo && chiSo < d.batOn.nguongThe) g('TG08', `the bat on dang mo khi chi so ${String(chiSo)} < nguong the ${String(d.batOn.nguongThe)}${vuaNoiLoan() ? ' (vua noi loan gio nay)' : ''}; theBatOn().mo = ${String(theBatOn(tg).mo)}`);
    for (const [a, b] of CAP) {
      const [ng, q] = [tg.ngoaiGiao, tg.ngoaiGiao.quanHe(a, b)];
      const lech = ng.trangThai(a, b) !== ng.trangThai(b, a) || ng.dangThuongMai(a, b) !== ng.dangThuongMai(b, a) || q !== ng.quanHe(b, a);
      if (lech || Math.abs(q) > QUAN_HE_TRAN || (ng.dangThuongMai(a, b) && ng.trangThai(a, b) === 'chien_tranh')) g('TG10', `${a}-${b}: ${ng.trangThai(a, b)}, buon ${String(ng.dangThuongMai(a, b))}, quan he ${String(q)}`);
    }
    if (ketTruoc !== '' && ketTruoc !== JSON.stringify(tg.ketQua) && !ketTruoc.includes('"dang_choi"')) g('TG11', `ket qua doi sau khi da ket: ${ketTruoc} -> ${JSON.stringify(tg.ketQua)}`);
    ketTruoc = JSON.stringify(tg.ketQua);
  }
  function bam(x: Viec): void { // TG09 nut vua bam, TG04 vang doi dung theo nut, TG03 chi the bat on duoc them vang / bot van hoa, TG06 khong them quan
    if (KIEU_NUOC.includes(x.k) && x.n === '') return;
    buoc = `bam ${x.k} ${x.n}${x.t}`;
    const [h, tcH, th, lc] = [hangNgoaiGiao(tg, banDo).find((y) => y.id === x.n), x.k === 'tanCong' ? tanCongTinh(tg, x.t) : undefined, theBatOn(tg), d.batOn.luaChon.find((l) => l.id === x.t)];
    const sang = x.k === 'damPhan' ? h?.nutDamPhan.duoc : x.k === 'buon' ? h?.nutThuongMai.duoc : x.k === 'tanCong' ? tcH?.nut.duoc : x.k === 'the' ? th.mo && th.luaChon.some((l) => l.id === x.t && l.nut.duoc) : undefined;
    const [truoc, anh0] = [new Map(tg.dsNuoc.map((n) => [n.id, { vang: n.vang, vanHoa: n.vanHoa, quan: [...n.quan] }])), sang === false ? anh(tg) : ''];
    bong = chuTinh(tg);
    const kq = LAM[x.k](tg, x);
    if (ban2 !== undefined) LAM[x.k](ban2, x);
    if (sang !== undefined && sang !== (x.k === 'tanCong' ? kq === '' : kq === true)) g('TG09', `nut sang = ${String(sang)} ma hanh dong tra ${String(kq)}`);
    if (sang === false && anh(tg) !== anh0) g('TG09', 'nut khoa ma bam van doi the gioi');
    if (tcH !== undefined && typeof kq === 'string' && (tcH.nut.duoc ? !(tcH.xacSuat > 0 && tcH.xacSuat <= 1) : tcH.nut.lyDo !== LY_DO[kq])) g('TG09', `nut tan cong "${tcH.nut.lyDo}" xac suat ${String(tcH.xacSuat)}, ly do that "${kq}"`);
    if (x.k === 'deDoa' && (h?.nutDeDoa.duoc !== true || h.deDoaThang !== kq)) g('TG09', `nut de doa ${String(h?.nutDeDoa.duoc)}, chu thang ${String(h?.deDoaThang)}, that ${String(kq)}`);
    if (x.k === 'tuyenChien' && h?.nutTuyenChien.duoc === true && tg.ngoaiGiao.trangThai(ta, x.n) !== 'chien_tranh') g('TG09', 'nut tuyen chien sang, bam xong chua chien');
    const nop = Math.min(truoc.get(x.n)?.vang ?? NaN, d.ngoaiGiao.deDoa.congNap);
    const mong = new Map<string, number>(x.k === 'dauTu' ? [[ta, -Math.max(0, Math.min(x.v, truoc.get(ta)?.vang ?? NaN))]] : kq !== true ? [] : x.k === 'damPhan' ? [[ta, -d.ngoaiGiao.damPhan.vang]]
      : x.k === 'deDoa' ? [[ta, nop], [x.n, -nop]] : x.k === 'the' ? [[ta, lc?.vang ?? NaN]] : []);
    const vhThe = x.k === 'the' && kq === true ? lc?.vanHoa ?? NaN : undefined;
    for (const n of tg.dsNuoc) {
      const t0 = truoc.get(n.id) ?? { vang: NaN, vanHoa: NaN, quan: [] };
      if (!gan(n.vang - t0.vang, mong.get(n.id) ?? 0)) g('TG04', `${n.id} vang doi ${String(n.vang - t0.vang)}, so ghi ${String(mong.get(n.id) ?? 0)}`);
      if (n.id === ta && vhThe !== undefined ? !gan(n.vanHoa - t0.vanHoa, vhThe) : n.vanHoa < t0.vanHoa - EPS) g('TG03', `${n.id} van hoa ${String(t0.vanHoa)} -> ${String(n.vanHoa)}`);
      if (hieu(n.quan, t0.quan).length > 0) g('TG06', `${n.id} co doi moi khi bam: ${hieu(n.quan, t0.quan).join(',')}`);
    }
    const [tong0, tong1] = [[...truoc.values()].reduce((s, x) => s + x.vang, 0), tg.dsNuoc.reduce((s, n) => s + n.vang, 0)];
    if (tong1 > tong0 + (vhThe !== undefined ? Math.max(0, lc?.vang ?? 0) : 0) + EPS * Math.max(1, tong0)) g('TG03', `tong vang the gioi ${String(tong0)} -> ${String(tong1)}`);
    if (chuTinh(tg).some((c, i) => c !== bong[i])) g('TG02', 'tinh doi chu ma khong qua lenh danh');
    kiemChung();
  }
  /** TG09: thu MOI nut dam phan, buon, lua chon the roi hoan tac, so voi nut dang hien. */
  function thuMoiNut(): void {
    const [n, vang, vanHoa, quan] = [tg.nuoc(ta), tg.nuoc(ta).vang, tg.nuoc(ta).vanHoa, [...tg.nuoc(ta).quan]];
    const tra = <T>(kq: T): T => { [n.vang, n.vanHoa, n.quan] = [vang, vanHoa, [...quan]]; return kq; };
    thu = true;
    for (const h of hangNgoaiGiao(tg, banDo).filter((y) => y.conSong)) {
      const [dp, tm] = [tra(tg.damPhan(ta, h.id)), tg.ngoaiGiao.datThuongMai(ta, h.id, !h.thuongMai)];
      if (tm) tg.ngoaiGiao.datThuongMai(ta, h.id, h.thuongMai);
      if (dp !== h.nutDamPhan.duoc || tm !== h.nutThuongMai.duoc) g('TG09', `${h.id}: nut dam phan ${String(h.nutDamPhan.duoc)} / that ${String(dp)}, nut buon ${String(h.nutThuongMai.duoc)} / that ${String(tm)}`);
    }
    const th = theBatOn(tg);
    for (const l of th.luaChon) if (tra(chonBatOn(tg, l.id)) !== (th.mo && l.nut.duoc)) g('TG09', `lua chon ${l.id}: nut ${String(th.mo && l.nut.duoc)}, bam that ra nguoc lai`);
    thu = false;
  }
  // Mot gio: TG04 so vang, TG05 tien mua = gia doi nhan, TG06 tran quan, TG02 noi loan, TG08 chieu nguoc, TG11 ket van, TG13, TG09 thu nut.
  function gio(so: SoNuocTa): void {
    buoc = 'gioTiep';
    const [ng, kt, daKet, heSo, song0, ke0] = [tg.ngoaiGiao, d.kinhTe, tg.ketQua.trangThai !== 'dang_choi', tg.batOn.gioGiamThue > 0 ? d.kinhTe.giamThueHeSo : 1, tg.conSong, tg.batOn.gioDaKe];
    const truoc = new Map(tg.dsNuoc.map((n) => {
      const soTinh = tg.tinhCua(n.id).length;
      // Vang luc vua thu xong, chep dung thu tu phep tinh cua TheGioi.gioTiep: thue mot bieu thuc, roi cong buon tung ban hang con song.
      let coThu = n.vang;
      coThu += n.nguoiChoi ? so.soNha * kt.vangMoiNha * heSo + soTinh * kt.vangMoiTinh : soTinh * kt.vangMoiTinhAi + kt.vangThuDoAi;
      for (const m of song0) if (m !== n.id && ng.dangThuongMai(n.id, m)) coThu += d.ngoaiGiao.thuongMai.vangMoiGio;
      return [n.id, { song: n.conSong, vang: n.vang, coThu, vanHoa: n.vanHoa, quan: [...n.quan], dem: n.dem, tran: d.quan.quanCoBan + d.quan.quanMoiTinh * soTinh }];
    }));
    const anh0 = daKet ? anh(tg) : '';
    [bong, sauMua, dangGio, dpAi] = [chuTinh(tg), undefined, true, new Map<string, number>()];
    tg.gioTiep(so);
    dangGio = false;
    ban2?.gioTiep(so);
    if (daKet && anh(tg) !== anh0) g('TG11', 'van da ket ma gioTiep van doi the gioi');
    if (daKet) return;
    for (const n of tg.dsNuoc) {
      const t0 = truoc.get(n.id);
      if (t0 === undefined || (!t0.song && n.vang === t0.vang && n.vanHoa === t0.vanHoa)) continue;
      if (!t0.song) { g(n.vang !== t0.vang ? 'TG04' : 'TG03', `${n.id} da mat ma vang/van hoa van doi`); continue; }
      const [p, ngan, dsMua] = [sauMuaCua(n.id) ?? { vang: n.vang, quan: n.quan }, t0.coThu * (n.nguoiChoi ? tg.tiLeChiQuanTa : d.quan.tiLeChiQuan), doiMuaDuoc(tran, n.doi)];
      const ref = muaQuan(t0.quan, ngan, dsMua, t0.tran, t0.dem, tran); // so ghi: chinh ham mua quan, voi so lieu dau gio
      const [mongVang, soDp, moi, bo] = [t0.coThu - (ngan - ref.vangCon), dpAi.get(n.id) ?? 0, hieu(p.quan, t0.quan), hieu(t0.quan, p.quan)];
      if (!gan(p.vang, mongVang) || p.quan.join() !== ref.quan.join() || n.dem !== ref.dem) g('TG04', `${n.id} sau mua: vang ${String(p.vang)}, ${String(p.quan.length)} doi, dem ${String(n.dem)}; so ghi ${String(mongVang)}, ${String(ref.quan.length)} doi, dem ${String(ref.dem)}`);
      if (!gan(n.vang, p.vang - soDp * d.ngoaiGiao.damPhan.vang)) g('TG04', `${n.id} cuoi gio vang ${String(n.vang)}, sau mua ${String(p.vang)}, ${String(soDp)} lan AI dam phan`);
      const [tieu, nhan] = [t0.coThu - p.vang, moi.reduce((s, id) => s + gia(id), 0)];
      if (moi.length > 0 && bo.length > 0) dem('TG05');
      if (!gan(tieu, nhan)) g('TG05', `${n.id} tieu ${String(tieu)} vang mua quan, doi that su vao quan [${moi.join(',')}] chi dang ${String(nhan)} - ${String(tieu - nhan)} vang mua doi roi giai ngu ngay; quan cu giai ngu [${bo.join(',')}], ${String(t0.quan.length)} -> ${String(p.quan.length)} doi, tran ${String(t0.tran)}`);
      if (p.quan.length > Math.max(t0.quan.length, t0.tran) || moi.some((id) => !dsMua.some((l) => l.id === id)) || hieu(n.quan, p.quan).length > 0) g('TG06', `${n.id} doi ${String(n.doi)}: ${String(t0.quan.length)} -> ${String(p.quan.length)} doi (tran ${String(t0.tran)}), moi [${moi.join(',')}]`);
      if (n.vanHoa < t0.vanHoa - EPS) g('TG03', `${n.id} van hoa giam trong gio ${String(t0.vanHoa)} -> ${String(n.vanHoa)}`);
    }
    const [doiChu, denNoiLoan] = [banDo.tinh.map((t, i) => ({ id: t.id, c0: bong[i] ?? '', c1: tg.chu(t.id) })).filter((x) => x.c0 !== x.c1), ke0 + 1 >= d.batOn.gioNoiLoan]; // noi loan chi khi the bi ke du `gio_noi_loan` gio, ke ca gio nay
    if (doiChu.length > 0) dem('TG08');
    if (doiChu.length > 1 || doiChu.some((x) => x.c0 !== ta || x.c1 !== '' || LA_THU_DO.has(x.id) || !denNoiLoan || tg.batOn.gioDaKe !== 0)) g('TG02', `ngoai lenh danh co ${doiChu.map((x) => `${x.id} "${x.c0}" -> "${x.c1}"`).join(', ')}; the da ke ${String(ke0)} -> ${String(tg.batOn.gioDaKe)} gio`);
    const [kq, tN, khac, t, mk] = [tg.ketQua, tg.nuoc(ta), tg.conSong.filter((x) => x !== ta), d.thang, manKet(tg)];
    if (kq.trangThai === 'dang_choi' && tg.batOn.chiSo >= d.batOn.nguongThe && !tg.batOn.theMo) g('TG08', `chi so ${String(tg.batOn.chiSo)} >= nguong the ma the dong`);
    if (kq.trangThai !== 'dang_choi') dem('TG11');
    const dung: Record<string, boolean> = { 'thua mat_thu_do': !tN.conSong && tg.chu(THU_DO.get(ta) ?? '') !== ta, 'thang thong_tri': khac.length === 0, 'het_gio ': tg.gio >= t.gioToiDa,
      'thua sup_do': tg.batOn.chiSo >= d.batOn.nguongSup || (denNoiLoan && tg.tinhCua(ta).every((x) => LA_THU_DO.has(x))), 'thang khoa_hoc': so.doiXongHet >= t.khoaHocDoi,
      'thang van_hoa': tN.vanHoa >= t.vanHoaToiThieu && tN.vanHoa > t.vanHoaTiLe * tg.dsNuoc.filter((x) => x.id !== ta).reduce((s, x) => s + x.vanHoa, 0),
      'thang ngoai_giao': tg.gio % d.ngoaiGiao.bau.gioMoiLan === 0 && tN.doi >= d.ngoaiGiao.bau.doiToiThieu && tg.ngoaiGiao.demPhieu(ta, tg.conSong) > t.ngoaiGiaoTiLePhieu * khac.length };
    if (kq.trangThai !== 'dang_choi' && (kq.gio !== tg.gio || dung[`${kq.trangThai} ${kq.kieu}`] !== true)) g('TG11', `ket "${kq.trangThai} ${kq.kieu}" o gio ${String(kq.gio)} sai ly do`);
    if (kq.trangThai === 'dang_choi' ? mk !== undefined : mk?.thang !== (kq.trangThai === 'thang') || mk.gio !== kq.gio) g('TG11', `man ket ${JSON.stringify(mk)} khac ket qua ${JSON.stringify(kq)}`);
    kiemChung();
    const a1 = anh(tg);
    if (ban2 !== undefined && anh(ban2) !== a1) g('TG13', 'ban sao cung hat giong, cung chuoi bam da tach khac');
    if (kq.trangThai !== 'dang_choi') return;
    thuMoiNut();
    if (anh(tg) !== a1) g('TG09', 'thu nut roi hoan tac khong sach');
  }
  /** Luot nguoi choi truoc moi gio: bam theo tinh cach, them 30% bam bua mot nut (co the dang khoa). */
  function luot(gi: number): void {
    const [w, khac] = [TINH_CACH[tc] ?? {}, tg.conSong.filter((n) => n !== ta)];
    const chonTu = <T>(ds: readonly T[]): T | undefined => ds[r.nguyen(ds.length)];
    if (tc === 5 && gi === 0) for (const n of khac) bam({ k: 'tuyenChien', n, t: '', v: 0 });
    if (tc >= 4) { if (tc === 4 && !theBatOn(tg).mo) bam({ k: 'the', n: '', t: chonTu(d.batOn.luaChon)?.id ?? '', v: 0 }); return; } // bo mac bam thu nut the dang khoa: khong duoc nhan, khong dong the
    if (gi === 0 || r.so() < 0.05) bam({ k: 'tiLe', n: '', t: '', v: r.so() });
    for (let i = r.nguyen(4); i > 0 && tg.ketQua.trangThai === 'dang_choi'; i--) {
      const [hang, muc] = [hangNgoaiGiao(tg, banDo).filter((h) => h.conSong), tg.mucTieu(ta)];
      const chien = hang.filter((h) => h.nutTuyenChien.duoc);
      const co: Record<Kieu, number> = { buon: hang.length, damPhan: hang.length, deDoa: hang.length, tuyenChien: chien.length, tanCong: muc.length, the: tg.batOn.theMo ? 1 : 0, dauTu: 1, tiLe: 0 };
      const trong = (Object.keys(co) as Kieu[]).map((k) => ({ gia: k, trong: co[k] > 0 ? (w[k] ?? 0) : 0 }));
      if (!trong.some((x) => x.trong > 0)) break;
      const k = r.theoTrongSo(trong);
      const n = KIEU_NUOC.includes(k) ? chonTu(k === 'tuyenChien' ? chien : hang)?.id ?? '' : '';
      const tinh = tc === 0 ? muc.map((x) => ({ x, p: tanCongTinh(tg, x).xacSuat })).sort((a, b) => b.p - a.p)[0]?.x : chonTu(muc);
      const v = r.so() < 0.7 ? d.vanHoa.vangMoiLanDauTu : r.so() * tg.nuoc(ta).vang * 1.5;
      bam({ k, n, t: k === 'tanCong' ? tinh ?? '' : k === 'the' ? chonTu(d.batOn.luaChon)?.id ?? '' : '', v });
    }
    if (r.so() >= 0.3 || tg.ketQua.trangThai !== 'dang_choi') return;
    const k = (['damPhan', 'buon', 'tanCong', 'the'] as const)[r.nguyen(4)] ?? 'the';
    const n = k === 'damPhan' || k === 'buon' ? chonTu(tg.conSong.filter((x) => x !== ta)) ?? '' : '';
    bam({ k, n, t: k === 'tanCong' ? chonTu(banDo.tinh)?.id ?? '' : k === 'the' ? chonTu(d.batOn.luaChon)?.id ?? '' : '', v: 0 });
  }
  const vet = taoVet(hat, d.thang.gioToiDa, tc === 5);
  kiemChung();
  thuMoiNut();
  for (const [gi, so] of vet.entries()) if (tg.ketQua.trangThai === 'dang_choi' && (dai || tg.gio < GIO_CHOI)) { luot(gi); gio(so); }
  if (tg.ketQua.trangThai !== 'dang_choi' && vet[0] !== undefined) gio(vet[0]); // TG11: van da ket thi gioTiep khong doi gi
  if (ban2 !== undefined && ban2.nhatKy.join('\n') !== tg.nhatKy.join('\n')) g('TG13', 'nhat ky hai ban khac nhau');
}
const kiemMa = (ma: string): void => { expect(viPham.get(ma)?.vd ?? [], `${ma}: ${String(viPham.get(ma)?.so ?? 0)} vi pham`).toEqual([]); };

describe('luat bat bien lop the gioi', () => {
  beforeAll(() => {
    for (let hat = 1; hat <= SO_HAT; hat++) choiVan(hat, false);
    for (const hat of HAT_DAI) choiVan(hat, true);
    for (const ma of ['TG02', 'TG05', 'TG08', 'TG11', 'TG12', 'TG14']) if ((gap.get(ma) ?? 0) === 0) ghi(ma, ma === 'TG14' ? 'qua moi van khong lan AI xin hoa nao duoc nhan - nguong xin hoa va nguong tu choi chan nhau' : 'khong gap tinh huong nao luat nay can - luat thanh rong');
  }, SAU ? 900_000 : 30_000);
  it('[TG01] moi tinh thuoc trung lap hoac mot nuoc con song; nuoc song giu thu do goc, nuoc mat khong con tinh, quan, khong song lai', () => { kiemMa('TG01'); });
  it('[TG02] tinh chi doi chu khi bi lang gieng dang chien danh chiem, thac thu do, hay noi loan (the bi ke du gio) mot tinh khong phai thu do; danh xong phai nghi du gio', () => { kiemMa('TG02'); });
  it('[TG03] vang huu han va khong am; ngoai the bat on, bam nut khong lam tong vang tang hay van hoa giam; trong gio van hoa khong giam, nuoc mat dung yen', () => { kiemMa('TG03'); });
  it('[TG04] so vang khop tung dong: moi lan bam doi dung theo nut, moi gio = dau gio + thue + buon - tien mua quan - tien AI dam phan', () => { kiemMa('TG04'); });
  it('[TG05] vang tieu mua quan bang dung gia cac doi that su vao quan, khong dot vao doi vua mua da giai ngu', () => { kiemMa('TG05'); });
  it('[TG06] quan chi sinh khi mua trong gio: bam nut khong them quan, khong vuot tran theo so tinh, doi moi mua duoc o thoi dai, trung lap khong dong hon bo dau', () => { kiemMa('TG06'); });
  it('[TG07] van con choi thi chi so bat on trong [0, nguong sup); cham nguong sup thi ket van ngay gio do', () => { kiemMa('TG07'); });
  it('[TG08] the bat on mo khi va chi khi chi so bat on o hoac tren nguong the', () => { kiemMa('TG08'); });
  it('[TG09] nut man the gioi noi that: sang khi va chi khi bam an, khoa thi khong doi gi va ly do dung, de doa thang khop that', () => { kiemMa('TG09'); });
  it('[TG10] dang chien thi khong buon; quan he trong [-100, 100], trang thai va quan he doi xung', () => { kiemMa('TG10'); });
  it('[TG11] ket van dung ly do, dung gio, chi mot lan, man ket noi dung nhu vay; van da ket thi gio troi khong doi gi', () => { kiemMa('TG11'); });
  it('[TG12] AI chi tuyen chien, dam phan, danh khi du dieu kien cua no', () => { kiemMa('TG12'); });
  it('[TG13] cung hat giong, cung chuoi bam thi hai the gioi chay song song y het nhau', () => { kiemMa('TG13'); });
  it('[TG14] AI dang chien ma yeu hon xin hoa thi co luc duoc nhan', () => { kiemMa('TG14'); });
});
