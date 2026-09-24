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
  readonly nguongVo: number;
  readonly nhieu: number;
  readonly heSoTuong: number;
  readonly doDoc: number;
  readonly heSoTam: number;
  readonly muPhongThu: number;
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
  readonly nguong_vo: number;
  readonly nhieu: number;
  readonly he_so_tuong: number;
  readonly do_doc: number;
  readonly he_so_tam: number;
  readonly mu_phong_thu: number;
  readonly dia_hinh: Readonly<Record<string, { readonly toc_do: number; readonly phong_thu: number }>>;
}

/** Doc va kiem ba file `armor_table.json`, `units.json`, `battle.json`. */
export function docDuLieuTran(bangTho: unknown, doiTho: unknown, tranTho: unknown): DuLieuTran {
  const bang = bangTho as { giap: string[]; dan: Record<string, number[]> };
  const ds = (doiTho as { doi: DongDoi[] }).doi;
  const t = tranTho as CauHinhTran;

  for (const [dan, hang] of Object.entries(bang.dan)) {
    if (hang.length !== bang.giap.length) throw new Error(`armor_table: dan ${dan} co ${String(hang.length)} he so, can ${String(bang.giap.length)}`);
  }
  const doi = new Map<string, LoaiDoi>();
  for (const d of ds) {
    if (!bang.giap.includes(d.giap) || bang.dan[d.dan] === undefined) throw new Error(`units: doi ${d.id} dung giap/dan la`);
    if (d.linh < 1 || d.mau <= 0) throw new Error(`units: doi ${d.id} phai co linh va mau duong`);
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
    nguongVo: t.nguong_vo,
    nhieu: t.nhieu,
    heSoTuong: t.he_so_tuong,
    doDoc: t.do_doc,
    heSoTam: t.he_so_tam,
    muPhongThu: t.mu_phong_thu,
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
