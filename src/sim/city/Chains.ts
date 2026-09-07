/**
 * Chuoi san xuat: doc `data/chains.json` va **kiem** ca ba file du lieu khop nhau.
 *
 * `chains.json` khong dieu khien mo phong - may chay theo `vao`/`ra` cua `buildings.json`.
 * No la ban do de nguoi doc, va la cai bay: them mot nha vao `buildings.json` ma quen kê
 * vao chuoi nao thi `kiemTra` bao ngay, khoi de nha mo coi nam do khong ai biet.
 *
 * Hai loi nang nhat no bat duoc:
 * - Mot mat hang **khong ai lam ra** -> nha an no doi vinh vien.
 * - Mot mat hang **khong ai dung den** -> kho day tran roi chan nha lam ra no.
 * Ca hai deu la "chuoi ket vinh vien" ma `KE_HOACH.md` muc 3 bat phai khong duoc co.
 */
import type { DinhNghiaNha } from './Buildings.ts';
import { layChuoi, layMang, layObject, LoiDuLieu } from './DocJson.ts';
import type { DinhNghiaHang } from './Wares.ts';

/** Mot chuoi: hang di qua nhung nha nao, theo thu tu. */
export interface DinhNghiaChuoi {
  readonly ten: string;
  readonly hien: string;
  readonly qua: readonly string[];
}

/** Doc `data/chains.json`. Nem `LoiDuLieu` neu sai. */
export function docChuoi(tho: unknown): DinhNghiaChuoi[] {
  const goc = layObject(tho, 'chains.json');
  const mang = layMang(goc['chuoi'], 'chains.json > chuoi');
  if (mang.length === 0) throw new LoiDuLieu('chains.json > chuoi', 'khong duoc rong');

  return mang.map((muc, i) => {
    const duong = `chains.json > chuoi[${String(i)}]`;
    const o = layObject(muc, duong);
    const qua = layMang(o['qua'], `${duong}.qua`).map((t, j) =>
      layChuoi(t, `${duong}.qua[${String(j)}]`),
    );
    if (qua.length < 2) throw new LoiDuLieu(`${duong}.qua`, 'chuoi phai qua it nhat hai nha');
    return {
      ten: layChuoi(o['ten'], `${duong}.ten`),
      hien: layChuoi(o['hien'], `${duong}.hien`),
      qua,
    };
  });
}

/**
 * Kiem ba file du lieu khop nhau. Tra ve danh sach loi bang chu; rong la dat.
 *
 * Tra ve danh sach thay vi nem loi ngay o cai dau tien: sua mot lan het ca muoi loi
 * nhanh hon chay lai muoi lan.
 */
export function kiemTra(
  dsHang: readonly DinhNghiaHang[],
  dsNha: readonly DinhNghiaNha[],
  dsChuoi: readonly DinhNghiaChuoi[],
): string[] {
  const loi: string[] = [];
  const tenHang = new Set(dsHang.map((h) => h.ten));
  const tenNha = new Set(dsNha.map((n) => n.ten));

  const lamRa = new Set<string>();
  const dungDen = new Set<string>();
  for (const n of dsNha) {
    for (const m of n.vao) {
      if (!tenHang.has(m.hang)) loi.push(`nha "${n.ten}" an "${m.hang}" - hang nay khong co`);
      dungDen.add(m.hang);
    }
    for (const m of n.ra) {
      if (!tenHang.has(m.hang)) loi.push(`nha "${n.ten}" lam ra "${m.hang}" - hang nay khong co`);
      lamRa.add(m.hang);
    }
  }

  for (const h of dsHang) {
    if (!lamRa.has(h.ten)) loi.push(`hang "${h.ten}" khong nha nao lam ra - se doi vinh vien`);
    if (!dungDen.has(h.ten)) loi.push(`hang "${h.ten}" khong nha nao dung den - kho se day tran`);
  }

  const daKe = new Set<string>();
  for (const c of dsChuoi) {
    for (const ten of c.qua) {
      if (!tenNha.has(ten)) loi.push(`chuoi "${c.ten}" di qua nha "${ten}" - nha nay khong co`);
      daKe.add(ten);
    }
  }
  for (const n of dsNha) {
    if (!daKe.has(n.ten)) loi.push(`nha "${n.ten}" khong nam trong chuoi nao - quen ke vao chains.json?`);
  }

  return loi;
}
