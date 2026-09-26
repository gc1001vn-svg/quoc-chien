/**
 * `npm run sim:van` - chay tron van khong nguoi bam, xem ca bon kieu thang co toi duoc khong.
 *
 * Thuoc do cua Phase 11 (KE_HOACH.md muc 3). Doc file va in ra man hinh nen nam ngoai
 * `src/sim/` (TECH_SPEC muc 1, luat 1).
 *
 * Hai buoc:
 * 1. Chay THANH PHO THAT (cung cach `sim:congnghe`) du `gio_toi_da` gio, ghi `SoNuocTa` moi
 *    gio. Mat ~6 phut nen luu vao `.cache/sim_van/` theo bam cua `data/` - doi so thanh pho
 *    thi tu chay lai. Nam van ben duoi dung chung mot vet: chien luoc chi tac dong lop the
 *    gioi, chua tac dong nguoc vao thanh pho (NoiThanhPho.ts).
 * 2. Nam van: bon chien luoc nham bon kieu thang + mot van bo mac.
 *
 * DAT khi: moi kieu thang toi duoc o it nhat MOT hat giong (KE_HOACH muc 3: "ca bon kieu
 * thang deu den duoc"), van bo mac thua o MOI hat giong, khong van nao het gio. Ti le dung
 * kieu tung chien luoc in ra de thay kieu nao con mong manh.
 * `npm run sim:van -- --lam-lai` bo vet cu, chay lai thanh pho.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { ThanhPho } from '../src/sim/city/City.ts';
import { NHIP_MOI_GIO } from '../src/sim/Clock.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { DongCo, docNhipDo, docThe, type LuaChon } from '../src/sim/decision/Engine.ts';
import { NhatKy } from '../src/sim/decision/NhatKy.ts';
import { Van } from '../src/sim/decision/Van.ts';
import { docDuLieuMeta, Meta } from '../src/sim/meta/Meta.ts';
import { docDuLieuTran } from '../src/sim/campaign/Battle.ts';
import { dungBanDoTinh, type CauHinhBanDoTinh, type CauHinhNuoc } from '../src/sim/campaign/BanDoTinh.ts';
import { xacSuatThang } from '../src/sim/campaign/ChienTranh.ts';
import { soNuocTa } from '../src/sim/campaign/NoiThanhPho.ts';
import { TheGioi, type SoNuocTa } from '../src/sim/campaign/TheGioi.ts';
import { docTheGioi } from '../src/sim/campaign/TheGioiData.ts';

const THU_MUC_DATA = new URL('../data/', import.meta.url);
function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(ten, THU_MUC_DATA), 'utf8')) as unknown;
}

const tran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), doc('battle.json'));
const du = docTheGioi(doc('the_gioi.json'), doc('victory.json'), new Set(tran.doi.keys()));
const banDo = dungBanDoTinh(doc('provinces.json') as CauHinhBanDoTinh, doc('nations.json') as CauHinhNuoc);

// ---------- 1. Vet thanh pho that ----------

/** Bam moi file `data/` tru hai file cua lop the gioi - doi so thanh pho la vet cu het dung. */
function bamThanhPho(): string {
  const h = createHash('sha1');
  for (const f of readdirSync(THU_MUC_DATA).sort()) {
    if (f === 'the_gioi.json' || f === 'victory.json' || !f.endsWith('.json')) continue;
    h.update(f).update(readFileSync(new URL(f, THU_MUC_DATA)));
  }
  h.update(String(du.thang.gioToiDa)).update(du.batOn.hangLuongThuc.join(','));
  return h.digest('hex').slice(0, 12);
}

function chayThanhPho(soGio: number): SoNuocTa[] {
  const tp = new ThanhPho({
    hang: doc('wares.json'), nha: doc('buildings.json'), chuoi: doc('chains.json'),
    banDo: doc('thanh_pho_demo.json'), walker: doc('walkers.json'),
  });
  const thongDoc = new Governor(tp, docChinhSach(doc('policy.json')));
  const meta = new Meta(
    docDuLieuMeta(doc('tech.json'), doc('eureka.json'), doc('the_chinh_sach.json'), doc('balance.json')), tp, thongDoc,
  );
  const van = new Van(tp, thongDoc, new DongCo(docThe(doc('decisions.json')), docNhipDo(doc('balance.json'))), new NhatKy(2000), true, meta);
  tp.datThongDoc(van);
  const vet: SoNuocTa[] = [];
  for (let gio = 1; gio <= soGio; gio++) {
    tp.chay(NHIP_MOI_GIO);
    const the = van.the;
    if (the !== undefined) van.traLoi(the.chon[0] as LuaChon);
    // Lap the chinh sach nhu `sim:congnghe`: the da mo dau tien vao o trong dau tien.
    const oTrong = meta.chinhSach.dangLap.findIndex((t) => t === undefined);
    if (oTrong >= 0) {
      const dang = new Set(meta.chinhSach.dangLap.map((t) => t?.id));
      const moi = meta.chinhSach.daMo().find((t) => !dang.has(t.id));
      if (moi !== undefined) meta.lapThe(oTrong, moi.id);
    }
    vet.push(soNuocTa(tp, meta, du.batOn.hangLuongThuc));
    if (gio % 50 === 0) console.log(`  thanh pho: gio ${String(gio)}, ${String(tp.soNha)} nha, doi ${String(meta.thoiDai.doi.so)}`);
  }
  return vet;
}

const thuMucVet = new URL('../.cache/sim_van/', import.meta.url);
const fileVet = new URL(`thanh_pho_${bamThanhPho()}.json`, thuMucVet);
let vet: SoNuocTa[];
if (existsSync(fileVet) && !process.argv.includes('--lam-lai')) {
  vet = JSON.parse(readFileSync(fileVet, 'utf8')) as SoNuocTa[];
  console.log(`Vet thanh pho: doc lai ${fileVet.pathname.split('/').pop() ?? ''} (${String(vet.length)} gio).`);
} else {
  console.log(`Vet thanh pho: chay thanh pho that ${String(du.thang.gioToiDa)} gio (~6 phut)...`);
  const bd = Date.now();
  vet = chayThanhPho(du.thang.gioToiDa);
  mkdirSync(thuMucVet, { recursive: true });
  writeFileSync(fileVet, JSON.stringify(vet));
  console.log(`  xong trong ${((Date.now() - bd) / 1000).toFixed(0)}s.`);
}

// ---------- 2. Nam van ----------

type ChienLuoc = (tg: TheGioi) => void;

/** Tra loi the bat on: giam thue neu du vang, khong thi dan ap. */
function giuYen(tg: TheGioi): void {
  if (tg.batOn.theMo && !tg.chonBatOn('giam_thue')) tg.chonBatOn('dan_ap');
}
function khac(tg: TheGioi): string[] {
  return tg.conSong.filter((n) => n !== tg.ta);
}
/** Dang chien voi ai thi dam phan voi nuoc do. */
function xinHoa(tg: TheGioi): void {
  for (const n of khac(tg)) if (tg.ngoaiGiao.trangThai(tg.ta, n) === 'chien_tranh') tg.damPhan(tg.ta, n);
}

const CHIEN_LUOC: Record<string, ChienLuoc> = {
  thong_tri: (tg) => {
    // Danh tung nuoc mot: chi tuyen chien voi nuoc ke yeu nhat khi da manh hon ro, con
    // lai thi xin hoa. Danh ca ba cung luc la tu sat.
    giuYen(tg);
    tg.tiLeChiQuanTa = 0.9;
    const ta = tg.nuoc(tg.ta);
    const dangDanh = khac(tg).find((n) => tg.ngoaiGiao.trangThai(tg.ta, n) === 'chien_tranh' && tg.keNuoc(tg.ta, n));
    if (dangDanh === undefined && ta.quan.length >= du.quan.doiMoiTran) {
      const yeu = khac(tg).filter((n) => tg.keNuoc(tg.ta, n)).sort((a, b) => tg.suc(a) - tg.suc(b))[0];
      if (yeu !== undefined && tg.suc(tg.ta) >= tg.suc(yeu)) tg.tuyenChien(tg.ta, yeu);
    }
    for (const n of khac(tg)) {
      const tt = tg.ngoaiGiao.trangThai(tg.ta, n);
      if (n !== dangDanh && tt === 'chien_tranh' && ta.vang >= 100) tg.damPhan(tg.ta, n);
    }
    const di = ta.quan.slice(0, du.quan.doiMoiTran);
    const muc = tg.mucTieu(tg.ta)
      .map((t) => ({ t, p: xacSuatThang(di, tg.quanThu(t), tg.diaHinh(t), du.quan.tuong, tg.tuongThu(t), tran) }))
      .sort((a, b) => b.p - a.p)[0];
    if (muc !== undefined && muc.p >= 0.4) tg.tanCong(tg.ta, muc.t);
  },
  khoa_hoc: (tg) => {
    giuYen(tg);
    tg.tiLeChiQuanTa = 0.6;
    xinHoa(tg);
  },
  van_hoa: (tg) => {
    giuYen(tg);
    tg.tiLeChiQuanTa = 0.6;
    xinHoa(tg);
    // Du quan giu nha roi moi do vang vao van hoa - do het tu dau la mat thu do.
    if (tg.nuoc(tg.ta).quan.length >= 2 * du.quan.doiMoiTran) tg.dauTuVanHoa(tg.nuoc(tg.ta).vang - 80);
  },
  ngoai_giao: (tg) => {
    giuYen(tg);
    tg.tiLeChiQuanTa = 0.4;
    for (const n of khac(tg)) {
      tg.ngoaiGiao.datThuongMai(tg.ta, n, true);
      if (tg.ngoaiGiao.trangThai(tg.ta, n) !== 'lien_minh') tg.damPhan(tg.ta, n);
    }
  },
  bo_mac: () => undefined,
};

// Nhieu hat giong: mot hat may man khong du de noi "toi duoc" (test tu lua).
const HAT: readonly number[] = [du.hatGiong, 1, 2, 3, 4];
const loi: string[] = [];
const dem = new Map<string, number>();
const coNhatKy: boolean = process.argv.includes('--nhat-ky');
console.log(`\n${'Hat'.padEnd(10)}${'Van'.padEnd(12)}${'Ket qua'.padEnd(22)}${'Gio'.padStart(5)}${'Tinh'.padStart(6)}${'Quan'.padStart(6)}${'Vang'.padStart(8)}${'VanHoa'.padStart(9)}  Giay`);
for (const hat of HAT) {
  for (const [ten, cl] of Object.entries(CHIEN_LUOC)) {
    const bd = performance.now();
    const tg = new TheGioi({ ...du, hatGiong: hat }, banDo, tran);
    for (const so of vet) {
      cl(tg);
      tg.gioTiep(so);
      if (tg.ketQua.trangThai !== 'dang_choi') break;
    }
    const kq = tg.ketQua;
    const ta = tg.nuoc(tg.ta);
    console.log(
      `${String(hat).padEnd(10)}${ten.padEnd(12)}${`${kq.trangThai} ${kq.kieu}`.padEnd(22)}${String(kq.gio).padStart(5)}` +
        `${String(tg.tinhCua(tg.ta).length).padStart(6)}${String(ta.quan.length).padStart(6)}` +
        `${ta.vang.toFixed(0).padStart(8)}${ta.vanHoa.toFixed(0).padStart(9)}  ${((performance.now() - bd) / 1000).toFixed(2)}`,
    );
    if (coNhatKy) for (const d of tg.nhatKy) console.log(`    ${d}`);
    const dung: boolean = ten === 'bo_mac' ? kq.trangThai === 'thua' : kq.trangThai === 'thang' && kq.kieu === ten;
    if (dung) dem.set(ten, (dem.get(ten) ?? 0) + 1);
    if (kq.trangThai === 'het_gio' || kq.trangThai === 'dang_choi') loi.push(`hat ${String(hat)} ${ten}: het ${String(kq.gio)} gio chua ai thang (van treo)`);
    if (ten === 'bo_mac' && !dung) loi.push(`hat ${String(hat)} bo_mac: khong bam gi ma van ${kq.trangThai} ${kq.kieu}`);
  }
}

console.log(`\nTI LE DUNG KIEU (${String(HAT.length)} hat giong):`);
for (const ten of Object.keys(CHIEN_LUOC)) {
  const n: number = dem.get(ten) ?? 0;
  console.log(`  ${ten.padEnd(12)}${String(n)}/${String(HAT.length)}`);
  if (ten !== 'bo_mac' && n === 0) loi.push(`${ten}: khong hat giong nao thang duoc kieu nay`);
}

if (loi.length === 0) {
  console.log('KET QUA: DAT - ca bon kieu thang deu toi duoc, bo mac thi thua, khong van nao treo');
} else {
  console.log(`KET QUA: HONG - ${String(loi.length)} loi:`);
  for (const d of loi) console.log(`  - ${d}`);
  process.exitCode = 1;
}
