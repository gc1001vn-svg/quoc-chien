/**
 * Tran danh chay ngam (GAME_SPEC muc 6): tinh truoc ket qua, `BattleScript.ts` dien sau.
 *
 * Mo phong CAP DOI, khong cap linh: moi doi la mot khoi mau tren chien truong vuong, di
 * thang toi doi dich gan nhat, vao tam thi danh. Sat thuong tra bang giap x dan kieu OpenRA
 * (`data/armor_table.json`). Mau tut duoi nguong thi doi vo, rut khoi tran.
 *
 * `duDoan` ra % thang hien truoc tran bang cach chay that `soTranDuDoan` tran. `npm run sim:tran`
 * do xem so do co khop ti le thang that khong (KE_HOACH muc 3, Phase 9).
 */
import { Rng } from '../../core/Rng.ts';
import { kiemDauVao, loai, type Ben, type DauVaoTran, type DiaHinhTran, type DuLieuTran, type LoaiDoi } from './BattleData.ts';

export { docDuLieuTran } from './BattleData.ts';
export type { Ben, DauVaoTran, DiaHinhTran, DuLieuTran, LoaiDoi } from './BattleData.ts';

export type Phe = 'a' | 'b';

/** Su kien tho: `danh` = lan dau doi gay sat thuong, `vo` = doi rut khoi tran. */
export interface SuKienTran {
  readonly giay: number;
  readonly loai: 'danh' | 'vo';
  readonly ben: Phe;
  /** Chi so doi trong `Ben.doi`. */
  readonly doi: number;
}

/** Mot doi trong mot khung vet. `x`,`y` tinh bang o chien truong. */
export interface DiemDoi {
  readonly x: number;
  readonly y: number;
  readonly conSong: number;
  /** Nhip vua roi doi dung trong tam va gay sat thuong. */
  readonly dangDanh: boolean;
  readonly vo: boolean;
}

/** Vi tri moi doi tai mot thoi diem - `render/BattleScene.ts` noi giua hai khung. */
export interface KhungVet {
  readonly giay: number;
  readonly a: readonly DiemDoi[];
  readonly b: readonly DiemDoi[];
}

export interface KetQuaTran {
  readonly thang: Phe;
  readonly giayKetThuc: number;
  readonly linhA: number;
  readonly linhB: number;
  readonly chetA: number;
  readonly chetB: number;
  readonly suKien: readonly SuKienTran[];
  /** Vet vi tri lay mau moi `giayMauVet` giay, khung dau o giay 0, khung cuoi o giay ket thuc. */
  readonly vet: readonly KhungVet[];
}


/** Tran nho bao nhieu cap doi hinh da du doan - qua thi xoa het, nho lai tu dau. */
const TRAN_BO_NHO = 4096;
const boNhoDuDoan = new WeakMap<DuLieuTran, Map<string, number>>();

/**
 * Xac suat ben `a` thang, trong [0, 1]: ti le thang cua CHINH `tinhTran` qua `soTranDuDoan` hat
 * giong 1..n, dung som khi `soTranDungSom` tran dau cung mot ben thang (GAME_SPEC muc 6 - con so du doan khong lech cai nguoi choi xem). Cong thuc Lanchester
 * cu lech toi 97,7 diem o tung cap doi hinh (do 04/10, luat TR15). Ket qua nho theo doi hinh: AI hoi
 * lai cung mot cap moi gio. Ham thuan - nho hay khong cung ra mot so (luat TR01).
 */
export function duDoan(vao: DauVaoTran, duLieu: DuLieuTran): number {
  kiemDauVao(vao, duLieu);
  let boNho: Map<string, number> | undefined = boNhoDuDoan.get(duLieu);
  if (boNho === undefined) {
    boNho = new Map();
    boNhoDuDoan.set(duLieu, boNho);
  }
  const khoa: string = JSON.stringify([vao.a.doi, vao.a.tuong, vao.b.doi, vao.b.tuong, vao.diaHinh]);
  const co: number | undefined = boNho.get(khoa);
  if (co !== undefined) return co;
  let [thang, soTran] = [0, 0];
  for (let hat = 1; hat <= duLieu.soTranDuDoan; hat += 1) {
    if (tinhTran(vao, duLieu, hat).thang === 'a') thang += 1;
    soTran = hat;
    // Tran gan nhu chac ket qua thi dung som: `soTranDungSom` tran dau cung mot ben thang het.
    if (hat === duLieu.soTranDungSom && (thang === 0 || thang === hat)) break;
  }
  const p: number = thang / soTran;
  if (boNho.size >= TRAN_BO_NHO) boNho.clear();
  boNho.set(khoa, p);
  return p;
}

interface DoiTran {
  readonly loai: LoaiDoi;
  readonly ben: Phe;
  readonly chiSo: number;
  readonly mauDau: number;
  x: number;
  y: number;
  mau: number;
  vo: boolean;
  daDanh: boolean;
  dangDanh: boolean;
}

function conSong(d: DoiTran): number {
  return Math.max(0, Math.ceil(d.mau / d.loai.mau - 1e-9));
}

function xepBen(ben: Ben, phe: Phe, x: number, duLieu: DuLieuTran): DoiTran[] {
  const buoc: number = duLieu.chienTruong / (ben.doi.length + 1);
  return ben.doi.map((id, i): DoiTran => {
    const l: LoaiDoi = loai(duLieu, id);
    return { loai: l, ben: phe, chiSo: i, mauDau: l.linh * l.mau, x, y: buoc * (i + 1), mau: l.linh * l.mau, vo: false, daDanh: false, dangDanh: false };
  });
}

function ganNhat(d: DoiTran, ds: readonly DoiTran[]): DoiTran | undefined {
  let tot: DoiTran | undefined;
  let kc = Infinity;
  let kc2 = Infinity;
  for (const e of ds) {
    if (e.ben === d.ben || e.vo) continue;
    // So binh phuong khoang cach truoc: lech ro thi khoi goi `Math.hypot` (cham, chiem phan lon thoi
    // gian tran - do 04/10). Sat nut thi so bang hypot nhu cu: doi hinh doi xung hay co hai dich cach
    // bang nhau, so binh phuong thi doi cach chon doi dung truoc (TR04 do ra 04/10).
    const dx: number = e.x - d.x;
    const dy: number = e.y - d.y;
    const k2: number = dx * dx + dy * dy;
    if (k2 > kc2 * (1 + 1e-9)) continue;
    if (k2 < kc2 * (1 - 1e-9)) {
      tot = e;
      kc2 = k2;
      kc = NaN; // hypot cua doi nay chi tinh khi gap doi sat nut
      continue;
    }
    if (tot !== undefined && Number.isNaN(kc)) kc = Math.hypot(tot.x - d.x, tot.y - d.y);
    const k: number = Math.hypot(dx, dy);
    if (k < kc) {
      tot = e;
      kc2 = k2;
      kc = k;
    }
  }
  return tot;
}

/** Chay mot tran. Cung `hatGiong` thi cung ket qua (TECH_SPEC muc 8). */
export function tinhTran(vao: DauVaoTran, duLieu: DuLieuTran, hatGiong: number): KetQuaTran {
  const dh: DiaHinhTran = kiemDauVao(vao, duLieu);
  const rng = new Rng(hatGiong);
  // `dt` doi o nhip cuoi: tran_giay khong chia het nhip_giay thi nhip cuoi bi cat ngan (luat TR13).
  let dt: number;
  let soNhip = 0;
  const ds: DoiTran[] = [
    ...xepBen(vao.a, 'a', duLieu.hangXuatPhat, duLieu),
    ...xepBen(vao.b, 'b', duLieu.chienTruong - duLieu.hangXuatPhat, duLieu),
  ];
  const suKien: SuKienTran[] = [];
  const conDoi = (p: Phe): boolean => ds.some((d) => d.ben === p && !d.vo);
  // Giu hang: truoc khi ben nao cham dich, ca ben tien theo doi cham nhat - khong de ky binh
  // lao len mot minh roi bi an tung manh (do 24/09: quan hon hop thua quan thuan chi vi vay).
  const hang = (p: Phe): number => Math.min(...ds.filter((d) => d.ben === p).map((d) => d.loai.tocDo));
  const tocHang: Record<Phe, number> = { a: hang('a'), b: hang('b') };
  const daCham: Record<Phe, boolean> = { a: false, b: false };
  let giay = 0;
  const vet: KhungVet[] = [];
  const ghiVet = (): void => {
    const diem = (p: Phe): DiemDoi[] => ds.filter((d) => d.ben === p)
      .map((d) => ({ x: d.x, y: d.y, conSong: conSong(d), dangDanh: d.dangDanh, vo: d.vo }));
    vet.push({ giay: Math.min(giay, duLieu.tranGiay), a: diem('a'), b: diem('b') });
  };
  ghiVet();

  while (giay < duLieu.tranGiay && conDoi('a') && conDoi('b')) {
    // Giay tinh tu SO NHIP, khong cong don `giay += dt`: cong don thi tran chay lo mot nhip
    // qua tran_giay khi nhip_giay khong chia het (do 03/10, nhip_giay 0,3).
    soNhip += 1;
    const giayMoi: number = Math.min(soNhip * duLieu.nhipGiay, duLieu.tranGiay);
    dt = giayMoi - giay;
    giay = giayMoi;
    const nhan = new Map<DoiTran, number>();
    // Moi doi quyet dinh theo vi tri DAU nhip, roi moi cung di - doi dung truoc trong
    // danh sach khong duoc loi (do 24/09: di ngay tai cho thi tran guong ben a thua 100 %).
    const di: [DoiTran, number, number][] = [];
    // Giu hang cung tinh theo trang thai DAU nhip: doc `daCham` ngay trong vong thi nhip vua cham
    // dich doi dung sau doi danh dau tien di toc rieng, doi dung truoc van di toc hang (luat TR14).
    const chamDau: Record<Phe, boolean> = { ...daCham };
    for (const d of ds) {
      d.dangDanh = false;
      if (d.vo) continue;
      const e: DoiTran | undefined = ganNhat(d, ds);
      if (e === undefined) continue;
      const kc: number = Math.hypot(e.x - d.x, e.y - d.y);
      // Sai so dau phay dong: di toi dung mep tam co the con du 1e-15 o, khong co dung sai
      // thi doi dung mai o do ma khong danh (do 24/09: 4/6 doi ky binh dung im ca tran).
      if (kc > d.loai.tam + 1e-6) {
        // Di toi, dung lai dung mep tam - khong vuot qua dich.
        const toc: number = chamDau[d.ben] ? d.loai.tocDo : tocHang[d.ben];
        const buoc: number = Math.min(toc * dh.tocDo * dt, kc - d.loai.tam);
        di.push([d, ((e.x - d.x) / kc) * buoc, ((e.y - d.y) / kc) * buoc]);
        continue;
      }
      const ben: Ben = d.ben === 'a' ? vao.a : vao.b;
      const st: number =
        conSong(d) * d.loai.satThuong * duLieu.heSo(e.loai.giap, d.loai.dan) *
        (1 + ben.tuong * duLieu.heSoTuong) * (e.ben === 'b' ? dh.phongThu : 1) *
        (1 + duLieu.nhieu * (rng.so() * 2 - 1)) * dt;
      nhan.set(e, (nhan.get(e) ?? 0) + st);
      d.dangDanh = true;
      if (!d.daDanh) {
        d.daDanh = true;
        daCham[d.ben] = true;
        suKien.push({ giay, loai: 'danh', ben: d.ben, doi: d.chiSo });
      }
    }
    for (const [d, dx, dy] of di) {
      d.x += dx;
      d.y += dy;
    }
    for (const [e, st] of nhan) {
      e.mau = Math.max(0, e.mau - st);
      if (!e.vo && e.mau <= e.mauDau * duLieu.nguongVo) {
        e.vo = true;
        suKien.push({ giay, loai: 'vo', ben: e.ben, doi: e.chiSo });
      }
    }
    // Sai so cong don cua `giay += dt`: so voi moc khung ke co dung sai, khong thi lech nhip.
    if (giay >= (vet.at(-1)?.giay ?? 0) + duLieu.giayMauVet - 1e-9) ghiVet();
  }
  if ((vet.at(-1)?.giay ?? -1) < Math.min(giay, duLieu.tranGiay)) ghiVet();

  const phan = (p: Phe): number => {
    const cua: DoiTran[] = ds.filter((d) => d.ben === p);
    return cua.filter((d) => !d.vo).reduce((s, d) => s + d.mau, 0) / cua.reduce((s, d) => s + d.mauDau, 0);
  };
  // Het gio ma hai ben con dung: ben con nhieu phan mau hon thang; bang nhau thi ben giu dat.
  // Xet ben a het doi TRUOC: hai ben cung vo trong mot nhip thi ben giu dat (b) thang, cung
  // luat voi het gio hoa nhau (soat 24/09: xet b truoc thi ben a luon thang).
  const thang: Phe = !conDoi('a') ? 'b' : !conDoi('b') ? 'a' : phan('a') > phan('b') ? 'a' : 'b';
  const linh = (p: Phe): number => ds.filter((d) => d.ben === p).reduce((s, d) => s + d.loai.linh, 0);
  const chet = (p: Phe): number => ds.filter((d) => d.ben === p).reduce((s, d) => s + d.loai.linh - conSong(d), 0);
  return {
    thang,
    giayKetThuc: Math.min(giay, duLieu.tranGiay),
    linhA: linh('a'),
    linhB: linh('b'),
    chetA: chet('a'),
    chetB: chet('b'),
    suKien,
    vet,
  };
}
