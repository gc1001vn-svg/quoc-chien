/**
 * Tran danh chay ngam (GAME_SPEC muc 6): tinh truoc ket qua, `BattleScript.ts` dien sau.
 *
 * Mo phong CAP DOI, khong cap linh: moi doi la mot khoi mau tren chien truong vuong, di
 * thang toi doi dich gan nhat, vao tam thi danh. Sat thuong tra bang giap x dan kieu OpenRA
 * (`data/armor_table.json`). Mau tut duoi nguong thi doi vo, rut khoi tran.
 *
 * `duDoan` tinh % thang KHONG chay tran - so hien ra truoc tran. `npm run sim:tran` do xem
 * so do co khop ti le thang that khong (KE_HOACH muc 3, Phase 9).
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


/** Suc manh mot ben theo luat binh phuong Lanchester: sat thuong hieu dung x tong mau. */
function sucManh(ben: Ben, dich: Ben, dichGiuDat: boolean, dh: DiaHinhTran, duLieu: DuLieuTran): number {
  const loaiDich: LoaiDoi[] = dich.doi.map((id) => loai(duLieu, id));
  const mauDich: number = loaiDich.reduce((s, l) => s + l.linh * l.mau, 0);
  let satThuong = 0;
  let mau = 0;
  for (const id of ben.doi) {
    const l: LoaiDoi = loai(duLieu, id);
    // He so giap x dan trung binh, trong so theo phan mau cua tung doi dich.
    const heSo: number = loaiDich.reduce((s, v) => s + ((v.linh * v.mau) / mauDich) * duLieu.heSo(v.giap, l.dan), 0);
    satThuong += l.linh * l.satThuong * heSo * (1 + duLieu.heSoTam * l.tam);
    mau += l.linh * l.mau;
  }
  const tuong: number = 1 + ben.tuong * duLieu.heSoTuong;
  // Dia hinh nang tay hon luat binh phuong: di cham thi ben ban xa duoc ban lau hon truoc khi
  // giap mat. Mu `muPhongThu` do bang `sim:tran` (24/09), khong suy tu ly thuyet.
  return satThuong * tuong * (dichGiuDat ? dh.phongThu ** duLieu.muPhongThu : 1) * mau;
}

/** Xac suat ben `a` thang, trong [0, 1]. Khong chay tran, khong dung so ngau nhien. */
export function duDoan(vao: DauVaoTran, duLieu: DuLieuTran): number {
  const dh: DiaHinhTran = kiemDauVao(vao, duLieu);
  const sucA: number = sucManh(vao.a, vao.b, true, dh, duLieu);
  const sucB: number = sucManh(vao.b, vao.a, false, dh, duLieu);
  if (sucA <= 0) return 0;
  return 1 / (1 + (sucB / sucA) ** duLieu.doDoc);
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
  for (const e of ds) {
    if (e.ben === d.ben || e.vo) continue;
    const k: number = Math.hypot(e.x - d.x, e.y - d.y);
    if (k < kc) {
      kc = k;
      tot = e;
    }
  }
  return tot;
}

/** Chay mot tran. Cung `hatGiong` thi cung ket qua (TECH_SPEC muc 8). */
export function tinhTran(vao: DauVaoTran, duLieu: DuLieuTran, hatGiong: number): KetQuaTran {
  const dh: DiaHinhTran = kiemDauVao(vao, duLieu);
  const rng = new Rng(hatGiong);
  const dt: number = duLieu.nhipGiay;
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
    giay += dt;
    const nhan = new Map<DoiTran, number>();
    // Moi doi quyet dinh theo vi tri DAU nhip, roi moi cung di - doi dung truoc trong
    // danh sach khong duoc loi (do 24/09: di ngay tai cho thi tran guong ben a thua 100 %).
    const di: [DoiTran, number, number][] = [];
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
        const toc: number = daCham[d.ben] ? d.loai.tocDo : tocHang[d.ben];
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
