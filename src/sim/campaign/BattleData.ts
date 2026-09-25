/**
 * Du lieu tran danh: kieu va cach doc ba file `data/armor_table.json`, `units.json`,
 * `battle.json`. Tach khoi `Battle.ts` cho file duoi tran 300 dong (TECH_SPEC muc 2).
 */

/** Mot loai doi trong `data/units.json`. So cua mot linh. */
export interface LoaiDoi {
  readonly id: string;
  readonly hien: string;
  readonly nhom: string;
  readonly doi: number;
  readonly gia: number;
  readonly linh: number;
  readonly mau: number;
  readonly satThuong: number;
  readonly tam: number;
  readonly tocDo: number;
  readonly giap: string;
  readonly dan: string;
}

/** He so mot loai dia hinh: `phongThu` nhan sat thuong ben giu dat phai nhan. */
export interface DiaHinhTran {
  readonly tocDo: number;
  readonly phongThu: number;
}

/** Du lieu da doc tu ba file JSON. */
export interface DuLieuTran {
  readonly giap: readonly string[];
  readonly dan: readonly string[];
  readonly doi: ReadonlyMap<string, LoaiDoi>;
  readonly diaHinh: ReadonlyMap<string, DiaHinhTran>;
  readonly chienTruong: number;
  readonly hangXuatPhat: number;
  readonly nhipGiay: number;
  readonly tranGiay: number;
  /** Cach bao nhieu giay ghi mot khung vet vi tri (Phase 10 dien quan di). */
  readonly giayMauVet: number;
  readonly nguongVo: number;
  readonly nhieu: number;
  readonly heSoTuong: number;
  readonly doDoc: number;
  readonly heSoTam: number;
  readonly muPhongThu: number;
  readonly tuongToiDa: number;
  /** He so nhan sat thuong cua `dan` len `giap`. */
  heSo(giap: string, dan: string): number;
}

/** Mot ben: danh sach khoa loai doi va cap tuong (0 = khong tuong). */
export interface Ben {
  readonly doi: readonly string[];
  readonly tuong: number;
}

/** Ben `a` danh toi, ben `b` giu dat - dia hinh chi che cho ben `b`. */
export interface DauVaoTran {
  readonly a: Ben;
  readonly b: Ben;
  readonly diaHinh: string;
}


interface DongDoi {
  readonly id: string;
  readonly hien: string;
  readonly nhom: string;
  readonly doi: number;
  readonly gia: number;
  readonly linh: number;
  readonly mau: number;
  readonly sat_thuong: number;
  readonly tam: number;
  readonly toc_do: number;
  readonly giap: string;
  readonly dan: string;
}

/** Khuon `data/battle.json` - chi cac truong `Battle.ts` dung; truong cua thuoc do nam o script. */
interface CauHinhTran {
  readonly chien_truong: number;
  readonly hang_xuat_phat: number;
  readonly nhip_giay: number;
  readonly tran_giay: number;
  readonly giay_mau_vet: number;
  readonly nguong_vo: number;
  readonly nhieu: number;
  readonly he_so_tuong: number;
  readonly do_doc: number;
  readonly he_so_tam: number;
  readonly mu_phong_thu: number;
  readonly tuong_toi_da: number;
  readonly dia_hinh: Readonly<Record<string, { readonly toc_do: number; readonly phong_thu: number }>>;
}

/**
 * Kiem mot so doc tu JSON: phai la so huu han, >= `min` (hoac > `min` khi `bo_min`), va la
 * so nguyen khi `nguyen`. So 24/09: NaN, chu "10", so am deu lot qua va cho tran vo nghia.
 */
function kiemSo(ten: string, v: unknown, min: number, boMin: boolean, nguyen = false): void {
  const hong: boolean =
    typeof v !== 'number' || !Number.isFinite(v) || (boMin ? v <= min : v < min) || (nguyen && !Number.isInteger(v));
  if (hong) throw new Error(`${ten} = ${String(v)}: phai la so${nguyen ? ' nguyen' : ''} ${boMin ? '>' : '>='} ${String(min)}`);
}

/** Kiem `battle.json`. `nhip_giay` <= 0 thi `tinhTran` lap vo han (do 24/09) - chan tu luc doc. */
function kiemTran(t: CauHinhTran): void {
  kiemSo('battle: chien_truong', t.chien_truong, 0, true);
  kiemSo('battle: hang_xuat_phat', t.hang_xuat_phat, 0, false);
  kiemSo('battle: nhip_giay', t.nhip_giay, 0, true);
  kiemSo('battle: tran_giay', t.tran_giay, 0, true);
  kiemSo('battle: giay_mau_vet', t.giay_mau_vet, 0, true);
  kiemSo('battle: nguong_vo', t.nguong_vo, 0, false);
  if (t.nguong_vo >= 1) throw new Error(`battle: nguong_vo = ${String(t.nguong_vo)}: phai < 1`);
  kiemSo('battle: nhieu', t.nhieu, 0, false);
  kiemSo('battle: he_so_tuong', t.he_so_tuong, 0, false);
  kiemSo('battle: tuong_toi_da', t.tuong_toi_da, 0, false, true);
  kiemSo('battle: do_doc', t.do_doc, 0, true);
  kiemSo('battle: he_so_tam', t.he_so_tam, 0, false);
  kiemSo('battle: mu_phong_thu', t.mu_phong_thu, 0, false);
  for (const [k, v] of Object.entries(t.dia_hinh)) {
    kiemSo(`battle: dia_hinh ${k} toc_do`, v.toc_do, 0, true);
    kiemSo(`battle: dia_hinh ${k} phong_thu`, v.phong_thu, 0, true);
  }
}

/** Doc va kiem ba file `armor_table.json`, `units.json`, `battle.json`. */
export function docDuLieuTran(bangTho: unknown, doiTho: unknown, tranTho: unknown): DuLieuTran {
  const bang = bangTho as { giap: string[]; dan: Record<string, number[]> };
  const ds = (doiTho as { doi: DongDoi[] }).doi;
  const t = tranTho as CauHinhTran;

  for (const [dan, hang] of Object.entries(bang.dan)) {
    if (hang.length !== bang.giap.length) throw new Error(`armor_table: dan ${dan} co ${String(hang.length)} he so, can ${String(bang.giap.length)}`);
    hang.forEach((v, i) => {
      kiemSo(`armor_table: dan ${dan} x giap ${bang.giap[i] ?? '?'}`, v, 0, false);
    });
  }
  kiemTran(t);
  const doi = new Map<string, LoaiDoi>();
  for (const d of ds) {
    if (!bang.giap.includes(d.giap) || bang.dan[d.dan] === undefined) throw new Error(`units: doi ${d.id} dung giap/dan la`);
    if (doi.has(d.id)) throw new Error(`units: trung ma doi ${d.id}`);
    kiemSo(`units: doi ${d.id} linh`, d.linh, 1, false, true);
    kiemSo(`units: doi ${d.id} mau`, d.mau, 0, true);
    kiemSo(`units: doi ${d.id} gia`, d.gia, 0, true);
    kiemSo(`units: doi ${d.id} sat_thuong`, d.sat_thuong, 0, false);
    kiemSo(`units: doi ${d.id} tam`, d.tam, 0, true);
    kiemSo(`units: doi ${d.id} toc_do`, d.toc_do, 0, false);
    doi.set(d.id, { id: d.id, hien: d.hien, nhom: d.nhom, doi: d.doi, gia: d.gia, linh: d.linh, mau: d.mau, satThuong: d.sat_thuong, tam: d.tam, tocDo: d.toc_do, giap: d.giap, dan: d.dan });
  }
  const diaHinh = new Map<string, DiaHinhTran>(
    Object.entries(t.dia_hinh).map(([k, v]): [string, DiaHinhTran] => [k, { tocDo: v.toc_do, phongThu: v.phong_thu }]),
  );
  return {
    giap: bang.giap,
    dan: Object.keys(bang.dan),
    doi,
    diaHinh,
    chienTruong: t.chien_truong,
    hangXuatPhat: t.hang_xuat_phat,
    nhipGiay: t.nhip_giay,
    tranGiay: t.tran_giay,
    giayMauVet: t.giay_mau_vet,
    nguongVo: t.nguong_vo,
    nhieu: t.nhieu,
    heSoTuong: t.he_so_tuong,
    doDoc: t.do_doc,
    heSoTam: t.he_so_tam,
    muPhongThu: t.mu_phong_thu,
    tuongToiDa: t.tuong_toi_da,
    heSo: (giap: string, dan: string): number => bang.dan[dan]?.[bang.giap.indexOf(giap)] ?? 0,
  };
}

/** Tra loai doi, khoa la thi nem loi - khong tinh bay voi du lieu thieu. */
export function loai(duLieu: DuLieuTran, id: string): LoaiDoi {
  const l: LoaiDoi | undefined = duLieu.doi.get(id);
  if (l === undefined) throw new Error(`Khong co loai doi "${id}" trong units.json`);
  return l;
}

export function diaHinhCua(duLieu: DuLieuTran, id: string): DiaHinhTran {
  const d: DiaHinhTran | undefined = duLieu.diaHinh.get(id);
  if (d === undefined) throw new Error(`Khong co dia hinh "${id}" trong battle.json`);
  return d;
}

/**
 * Kiem dau vao tran, tra ve dia hinh. Ben rong hay tuong ngoai [0, tuongToiDa] thi nem loi:
 * do 24/09, ben b rong thi `duDoan` bao a thua 100 % ma `tinhTran` lai cho a thang.
 */
export function kiemDauVao(vao: { a: Ben; b: Ben; diaHinh: string }, duLieu: DuLieuTran): DiaHinhTran {
  for (const [ten, ben] of [['a', vao.a], ['b', vao.b]] as const) {
    if (ben.doi.length === 0) throw new Error(`Ben ${ten} khong co doi nao`);
    if (!Number.isInteger(ben.tuong) || ben.tuong < 0 || ben.tuong > duLieu.tuongToiDa) {
      throw new Error(`Ben ${ten}: tuong = ${String(ben.tuong)}, phai la so nguyen 0-${String(duLieu.tuongToiDa)}`);
    }
    for (const id of ben.doi) loai(duLieu, id);
  }
  return diaHinhCua(duLieu, vao.diaHinh);
}
