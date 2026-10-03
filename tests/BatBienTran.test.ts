/**
 * Luat bat bien mang tran danh, ma [TR..] trong `docs/LUAT_BAT_BIEN.md`: dieu KHONG BAO GIO duoc pha, kiem tren nhieu hat
 * giong (Battle*.test kiem tung ca). `beforeAll` chay MOT lan moi hat, gom vi pham theo ma; moi `it` chi doi danh sach cua ma
 * minh rong, in vi pham dau (hat giong, giay/vong, chi tiet). `LUAT_SAU=1`: nhieu hat giong hon, chien dich nhieu vong hon.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Rng } from '../src/core/Rng.ts';
import { docDuLieuTran, duDoan, tinhTran, type Ben, type DauVaoTran, type DuLieuTran, type KetQuaTran, type KhungVet, type Phe } from '../src/sim/campaign/Battle.ts';
import { diaHinhCua, loai } from '../src/sim/campaign/BattleData.ts';
import { sinhKichBan, type Canh } from '../src/sim/campaign/BattleScript.ts';
import { danh, doiMuaDuoc, muaQuan, sucQuan, xacSuatThang } from '../src/sim/campaign/ChienTranh.ts';
import bangTho from '../data/armor_table.json';
import doiTho from '../data/units.json';
import tranTho from '../data/battle.json';
import theGioi from '../data/the_gioi.json';

const SAU = process.env.LUAT_SAU === '1';
const SO_HAT = SAU ? 1000 : 40; // tran tren data that; moi hat them mot tran guong va moi luat TR11-TR13 mot tran
const SO_HAT_CHIEN_DICH = SAU ? 300 : 20;
const SO_VONG = SAU ? 60 : 25; // moi vong mot lan mua quan + mot tran; quan con lai mang sang vong sau
const [TI_LE_TRONG, TI_LE_NGAN] = [0.1, 0.3]; // TR10: phan vong danh tinh trong, phan vong tran bi cat ngan (het gio truoc khi giap mat)
const du: DuLieuTran = docDuLieuTran(bangTho, doiTho, tranTho);
// Tran guong (TR05 ve hoa): hai ben y het, khong nhieu, dia hinh khong che ai thi thuong vo het CUNG nhip (do 03/10: 1616/2000 tran).
const duGuong: DuLieuTran = docDuLieuTran(bangTho, doiTho, { ...tranTho, nhieu: 0 });
const TRUNG_LAP: string | undefined = [...du.diaHinh].find(([, v]) => v.phongThu === 1)?.[0];
const IDS: string[] = [...du.doi.keys()];
const NHOM: string[] = [...new Set([...du.doi.values()].map((l) => l.nhom))];
const DOI_MOI_TRAN: number = theGioi.quan.doi_moi_tran;
const THOI_DAI_CUOI: number = Math.max(...[...du.doi.values()].map((l) => l.doi));
const NGAN_TOI_DA: number = Math.max(...[...du.doi.values()].map((l) => l.gia)) * DOI_MOI_TRAN;
const PHE = ['a', 'b'] as const;
type Ghi = (ma: string, chiTiet: string) => void;
const viPham = new Map<string, { so: number; vd: string[] }>();
const ghi: Ghi = (ma, chiTiet) => {
  const v = viPham.get(ma) ?? { so: 0, vd: [] };
  viPham.set(ma, { so: v.so + 1, vd: v.vd.length < 3 ? [...v.vd, chiTiet] : v.vd });
};
const rngCua = (hat: number, muoi: number): Rng => new Rng(Math.imul(hat, 0x9e3779b1) ^ Math.imul(muoi, 0x85ebca6b));
const chon = <T>(r: Rng, ds: readonly T[]): T => ds[r.nguyen(ds.length)] as T;
const bam = (x: unknown): string => createHash('sha1').update(JSON.stringify(x)).digest('hex');
const demLoai = (ds: readonly string[]): Map<string, number> => ds.reduce((m, id) => m.set(id, (m.get(id) ?? 0) + 1), new Map<string, number>());
const moTaVao = (v: DauVaoTran): string => `a=[${v.a.doi.join(',')}] tuong ${String(v.a.tuong)}, b=[${v.b.doi.join(',')}] tuong ${String(v.b.tuong)}, ${v.diaHinh}`;
const sinhVao = (r: Rng, d: DuLieuTran): DauVaoTran => ({ a: sinhBen(r, d), b: sinhBen(r, d), diaHinh: chon(r, [...d.diaHinh.keys()]) });

/** Bon kieu doi hinh: tron moi loai (quan trung lap luon la doi thoi 1), mot nhom, mot loai, hai loai. */
function sinhBen(r: Rng, d: DuLieuTran): Ben {
  const [kieu, nhom] = [r.nguyen(4), chon(r, NHOM)];
  const ds = kieu === 0 ? IDS : kieu === 1 ? IDS.filter((id) => loai(d, id).nhom === nhom) : [chon(r, IDS), chon(r, IDS)].slice(0, kieu - 1);
  return { doi: Array.from({ length: 1 + r.nguyen(DOI_MOI_TRAN) }, () => chon(r, ds)), tuong: r.nguyen(d.tuongToiDa + 1) };
}
const dongBang = <T>(x: T): T => { if (typeof x === 'object' && x !== null) for (const v of Object.values(x) as unknown[]) dongBang(v); return Object.freeze(x); };

/** TR02, TR03: mot doi qua tung khung vet. */
function kiemDoi(vao: DauVaoTran, kq: KetQuaTran, d: DuLieuTran, p: Phe, i: number, g: Ghi): void {
  const id = vao[p].doi[i] ?? '';
  const [l, dh, w] = [loai(d, id), diaHinhCua(d, vao.diaHinh), d.chienTruong];
  const sk = (t: string): number[] => kq.suKien.filter((s) => s.ben === p && s.doi === i && s.loai === t).map((s) => s.giay);
  const [[gVo = Infinity, ...voThem], [gDanh = Infinity, ...danhThem]] = [sk('vo'), sk('danh')];
  if (voThem.length + danhThem.length > 0) g('TR02', `doi ${p}${String(i)}: vo hoac danh lan dau hon mot lan`);
  kq.vet.forEach((k, j) => {
    const [o, tk] = [k[p][i], kq.vet[j - 1]];
    const t = tk?.[p][i];
    const tai = `doi ${p}${String(i)} (${id}) giay ${String(k.giay)}`;
    if (o === undefined) { g('TR05', `${tai}: khung vet thieu doi`); return; }
    if (!Number.isInteger(o.conSong) || o.conSong < 0 || o.conSong > l.linh) g('TR02', `${tai}: con ${String(o.conSong)} linh, ngoai [0, ${String(l.linh)}]`);
    if (j === 0 && (o.conSong !== l.linh || o.vo || o.dangDanh)) g('TR02', `${tai}: khung dau khong du quan hoac da vo/danh`);
    if (!o.vo && o.conSong < 1) g('TR02', `${tai}: chua vo ma het linh`);
    if (o.vo !== (k.giay >= gVo)) g('TR02', `${tai}: co vo = ${String(o.vo)} lech su kien vo o giay ${String(gVo)}`);
    // Giai dong thoi: doi bi danh vo dung nhip no dang danh thi khung do vua vo vua danh - hop le.
    if (o.dangDanh && (k.giay < gDanh || k.giay > gVo)) g('TR02', `${tai}: dang danh ngoai [${String(gDanh)}, ${String(gVo)}]`);
    if (!(o.x >= 0 && o.x <= w && o.y >= 0 && o.y <= w)) g('TR03', `${tai}: o (${String(o.x)}, ${String(o.y)}) ngoai chien truong ${String(w)}`);
    if (tk === undefined || t === undefined) return;
    if (o.conSong > t.conSong) g('TR02', `${tai}: song lai ${String(t.conSong)} -> ${String(o.conSong)} linh`);
    if (t.vo && (o.x !== t.x || o.y !== t.y || o.conSong !== t.conSong)) g('TR02', `${tai}: da vo ma van di hoac mat linh`);
    const [buoc, tran] = [Math.hypot(o.x - t.x, o.y - t.y), l.tocDo * dh.tocDo * (k.giay - tk.giay)];
    // Dung sai tuong doi: buoc lon nhat do duoc = tran x 1.00000000000002 (sai so dau phay dong).
    if (buoc > tran * (1 + 1e-9)) g('TR03', `${tai}: di ${String(buoc)} o > tran ${String(tran)} o`);
    if (d.giayMauVet <= d.nhipGiay && o.dangDanh && buoc !== 0) g('TR03', `${tai}: vua danh vua di ${String(buoc)} o`);
  });
}

/** TR04: khung `t` la dau nhip, khung `k` la cuoi nhip (chi khi moi nhip ghi mot khung). */
function kiemTam(vao: DauVaoTran, d: DuLieuTran, t: KhungVet, k: KhungVet, g: Ghi): void {
  const ds = PHE.flatMap((p) => t[p].map((o, i) => ({ p, i, o, ten: `${p}${String(i)}`, tam: loai(d, vao[p].doi[i] ?? '').tam })));
  const biDanh = new Set<string>();
  for (const u of ds) {
    // Dich gan nhat chon dung cach Battle.ts: ben a truoc ben b, bo doi vo, bang nhau giu doi truoc.
    let [dich, kc]: [(typeof ds)[number] | undefined, number] = [undefined, Infinity];
    for (const e of ds) {
      const h = Math.hypot(e.o.x - u.o.x, e.o.y - u.o.y);
      if (e.p !== u.p && !e.o.vo && h < kc) [dich, kc] = [e, h];
    }
    const [nen, dang] = [!u.o.vo && dich !== undefined && kc <= u.tam + 1e-6, k[u.p][u.i]?.dangDanh ?? false];
    if (dang !== nen) g('TR04', `doi ${u.ten} giay ${String(k.giay)}: dang danh = ${String(dang)}, dich gan nhat cach ${String(kc)} o, tam ${String(u.tam)}, da vo ${String(u.o.vo)}`);
    if (dang && dich !== undefined) biDanh.add(dich.ten);
  }
  for (const u of ds) if ((k[u.p][u.i]?.conSong ?? 0) < u.o.conSong && !biDanh.has(u.ten)) g('TR04', `doi ${u.ten} giay ${String(k.giay)}: mat linh ma khong ai danh`);
}

/** TR02-TR06 cho mot tran da tinh, `kb` la kich ban sinh tu chinh tran do. */
function kiemTran(vao: DauVaoTran, kq: KetQuaTran, kb: readonly Canh[], d: DuLieuTran, g: Ghi): void {
  const [cuoi, ket] = [kq.vet.at(-1), kq.giayKetThuc];
  if (cuoi === undefined || kq.vet[0]?.giay !== 0) { g('TR05', 'vet rong hoac khung dau khong o giay 0'); return; }
  for (const p of PHE) {
    vao[p].doi.forEach((_, i) => { kiemDoi(vao, kq, d, p, i, g); });
    const [linh, song] = [vao[p].doi.reduce((s, id) => s + loai(d, id).linh, 0), cuoi[p].reduce((s, o) => s + o.conSong, 0)];
    const [linhKq, chet] = p === 'a' ? [kq.linhA, kq.chetA] : [kq.linhB, kq.chetB];
    if (linhKq !== linh || chet < 0 || chet > linh || song !== linh - chet) g('TR02', `ben ${p}: linh ${String(linhKq)}/${String(linh)}, chet ${String(chet)}, khung cuoi con ${String(song)}`);
    const soVo = kq.suKien.filter((s) => s.ben === p && s.loai === 'vo').length;
    if (soVo !== cuoi[p].filter((o) => o.vo).length) g('TR05', `ben ${p}: ${String(soVo)} su kien vo, lech so doi vo o khung cuoi`);
  }
  if (d.giayMauVet <= d.nhipGiay) kq.vet.forEach((k, j) => { const t = kq.vet[j - 1]; if (t !== undefined) kiemTam(vao, d, t, k, g); });
  const voHet = { a: cuoi.a.every((o) => o.vo), b: cuoi.b.every((o) => o.vo) };
  if ((voHet.a && kq.thang !== 'b') || (voHet.b && !voHet.a && kq.thang !== 'a')) g('TR05', `ben da vo het lai thang (thang ${kq.thang}; cung vo het mot nhip thi ben giu dat b thang)`);
  if (!voHet.a && !voHet.b && ket !== d.tranGiay) g('TR05', `dung o giay ${String(ket)} khi chua ben nao vo het`);
  if (!(ket > 0 && ket <= d.tranGiay) || cuoi.giay !== ket) g('TR05', `giay ket thuc ${String(ket)}, khung cuoi ${String(cuoi.giay)}, tran ${String(d.tranGiay)}`);
  kq.vet.forEach((k, j) => { const t = kq.vet[j - 1]; if (t !== undefined && !(k.giay > t.giay)) g('TR05', `vet khong tang: ${String(t.giay)} -> ${String(k.giay)}`); });
  kq.suKien.forEach((s, j) => { if (!(s.giay > 0 && s.giay <= ket && s.giay >= (kq.suKien[j - 1]?.giay ?? 0))) g('TR05', `su kien ${s.loai} ${s.ben}${String(s.doi)} o giay ${String(s.giay)}, ket thuc ${String(ket)}`); });
  const [dau, het] = [kb[0], kb.at(-1)];
  if (dau?.giay !== 0 || dau.loai !== 'tien') g('TR05', 'kich ban khong mo dau bang hai ben tien o giay 0');
  if (het?.loai !== 'ket_thuc' || het.giay !== ket || het.ben !== kq.thang) g('TR05', `canh cuoi ${het?.loai ?? '?'} o giay ${String(het?.giay)} ben ${het?.ben ?? '?'}`);
  if (kb.length !== kq.suKien.length + 2) g('TR05', `${String(kb.length)} canh cho ${String(kq.suKien.length)} su kien`);
  kb.forEach((c, j) => { const t = kb[j - 1]; if (t !== undefined && c.giay < t.giay) g('TR05', `kich ban lui gio: ${t.loai} ${String(t.giay)} -> ${c.loai} ${String(c.giay)}`); });
  kq.suKien.forEach((s, j) => {
    const c = kb[j + 1];
    // Ban sao cach BattleScript.ts goi ten canh: tam > 1 la ban, con lai giap la ca.
    const loaiCanh = s.loai === 'vo' ? 'vo' : loai(d, vao[s.ben].doi[s.doi] ?? '').tam > 1 ? 'ban' : 'giap_la_ca';
    if (c?.giay !== s.giay || c.ben !== s.ben || c.doi !== s.doi || c.loai !== loaiCanh) g('TR05', `canh ${String(j + 1)} lech su kien ${s.loai} ${s.ben}${String(s.doi)}`);
  });
  const gVo = Math.max(...kq.suKien.filter((s) => s.loai === 'vo').map((s) => s.giay));
  if ((voHet.a || voHet.b) && gVo !== ket) g('TR06', `ben vo het o giay ${String(gVo)} ma tran dung o giay ${String(ket)}`);
}

/** TR07: con so % thang hien truoc tran. */
function kiemDuDoan(vao: DauVaoTran, d: DuLieuTran, g: Ghi): void {
  const p = (v: DauVaoTran): number => duDoan(v, d);
  const p0 = p(vao);
  if (!(p0 >= 0 && p0 <= 1)) g('TR07', `du doan ${String(p0)} ngoai [0, 1]`);
  const heSoDh = (k: string): number => diaHinhCua(d, k).phongThu ** d.muPhongThu;
  const dsDh = [...d.diaHinh.keys()].sort((x, y) => heSoDh(y) - heSoDh(x));
  const trungLap = dsDh.find((k) => heSoDh(k) === 1);
  // Doi ben ra phan bu khi it nhat mot ben gay duoc sat thuong; ca hai cung 0 thi du doan 0 ca hai chieu,
  // khop tinhTran (hoa thi ben giu dat thang). Dia hinh trung lap chon theo he so phong thu, khong theo ten.
  const coSat = (ben: Ben, dich: Ben): boolean => ben.doi.some((id) => loai(d, id).satThuong > 0 && dich.doi.some((e) => d.heSo(loai(d, e).giap, loai(d, id).dan) > 0));
  if (trungLap !== undefined && (coSat(vao.a, vao.b) || coSat(vao.b, vao.a))) {
    const tong = p({ ...vao, diaHinh: trungLap }) + p({ a: vao.b, b: vao.a, diaHinh: trungLap });
    if (Math.abs(tong - 1) > 1e-9) g('TR07', `doi ben tren ${trungLap}: hai chieu cong lai ${String(tong)}, khong phai 1`);
  }
  for (let t = 0; t < d.tuongToiDa; t++) {
    const [a0, a1] = [t, t + 1].map((x) => p({ ...vao, a: { ...vao.a, tuong: x } }));
    const [b0, b1] = [t, t + 1].map((x) => p({ ...vao, b: { ...vao.b, tuong: x } }));
    if ((a1 ?? 0) < (a0 ?? 0) - 1e-9) g('TR07', `tuong ben a ${String(t)} -> ${String(t + 1)}: % thang tut ${String(a0)} -> ${String(a1)}`);
    if ((b1 ?? 0) > (b0 ?? 0) + 1e-9) g('TR07', `tuong ben b ${String(t)} -> ${String(t + 1)}: % thang ben a tang ${String(b0)} -> ${String(b1)}`);
  }
  for (const [j, k] of dsDh.entries()) {
    const truoc = dsDh[j - 1];
    if (truoc !== undefined && p({ ...vao, diaHinh: k }) > p({ ...vao, diaHinh: truoc }) + 1e-9) g('TR07', `dia hinh ${k} phong thu manh hon ${truoc} ma ben danh toi de thang hon`);
  }
}
// Bo doc tu choi = ngoai mien, khong luat nao phai giu.
const thuDoc = (tran: unknown): DuLieuTran | undefined => { try { return docDuLieuTran(bangTho, doiTho, tran); } catch { return undefined; } };
/** Tinh mot tran, kiem TR02-TR07 tren chinh tran do; tra ve ket qua va kich ban. */
const kiemMot = (vao: DauVaoTran, d: DuLieuTran, hatTran: number, g: Ghi): [KetQuaTran, Canh[]] => { const kq = tinhTran(vao, d, hatTran); const kb = sinhKichBan(kq, vao, d); kiemTran(vao, kq, kb, d, g); kiemDuDoan(vao, d, g); return [kq, kb]; };

/**
 * TR11-TR13: battle.json bien ngau nhien; bo doc nhan so nao thi TR02-TR07 phai dung voi so do. TR11 chi bien `nhieu`, TR12
 * chi bien `hang_xuat_phat`, TR13 bien moi so con lai (nhan he so ngau nhien quanh so that) - moi luat do khi dung mot cho
 * trong bo doc hay vong lap tran bi ho. Moi luat mot day so rieng: sua loi luat nay khong doi mau thu cua luat kia.
 */
const nhanDuoc = new Set<string>();
function kiemMien(hat: number): void {
  const [r11, r12, r] = [rngCua(hat, 11), rngCua(hat, 12), rngCua(hat, 13)];
  const lech = (x: number): number => x * (0.25 + 1.75 * r.so());
  const [ct, nhip, t] = [lech(tranTho.chien_truong), lech(tranTho.nhip_giay), tranTho];
  const bien: [string, Rng, Record<string, unknown>][] = [
    ['TR11', r11, { nhieu: 3 * r11.so() }],
    ['TR12', r12, { hang_xuat_phat: 2 * t.chien_truong * r12.so() }],
    ['TR13', r, {
      chien_truong: ct, hang_xuat_phat: ct * r.so(), nhip_giay: nhip, tran_giay: lech(t.tran_giay), giay_mau_vet: r.so() < 0.5 ? nhip : lech(t.giay_mau_vet),
      nguong_vo: lech(t.nguong_vo), nhieu: r.so(), he_so_tuong: lech(t.he_so_tuong), tuong_toi_da: Math.round(lech(t.tuong_toi_da)), do_doc: lech(t.do_doc), mu_phong_thu: lech(t.mu_phong_thu),
      dia_hinh: Object.fromEntries(Object.entries(t.dia_hinh).map(([k, v]) => [k, { toc_do: lech(v.toc_do), phong_thu: v.phong_thu === 1 ? 1 : lech(v.phong_thu) }])),
    }],
  ];
  for (const [ma, rm, sua] of bien) {
    const d = thuDoc({ ...tranTho, ...sua });
    if (d === undefined) continue;
    nhanDuoc.add(ma);
    const vao = sinhVao(rm, d);
    kiemMot(vao, d, rm.nguyen(2 ** 31), (luat, chiTiet) => { ghi(ma, `hat ${String(hat)}, battle.json ${JSON.stringify(sua)}, ${moTaVao(vao)} -> luat ${luat}: ${chiTiet}`); });
  }
}

/** TR08-TR10: chuoi vong mua quan roi danh, quan con lai va bo dem mang sang vong sau. */
function chienDich(hat: number): void {
  const r = rngCua(hat, 3);
  const quanMoi = (): string[] => Array.from({ length: 1 + r.nguyen(DOI_MOI_TRAN) }, () => chon(r, IDS));
  let [quan, dem, thu] = [[] as string[], 0, quanMoi()];
  for (let vong = 0; vong < SO_VONG; vong++) {
    const g: Ghi = (ma, chiTiet) => { ghi(ma, `hat ${String(hat)} vong ${String(vong)}: ${chiTiet}`); };
    const thoiDai = 1 + r.nguyen(THOI_DAI_CUOI);
    const ds = doiMuaDuoc(du, thoiDai);
    // Mua duoc = cung nhom voi loai moi nhat da mo, khong loai nao chua toi thoi dai.
    const moiNhat = Math.max(...[...du.doi.values()].map((l) => l.doi).filter((x) => x <= thoiDai));
    if (ds.some((l) => l.doi > thoiDai || l.nhom !== ds[0]?.nhom) || !ds.some((l) => l.doi === moiNhat)) g('TR09', `thoi dai ${String(thoiDai)} mua duoc [${ds.map((l) => l.id).join(',')}]`);
    const [ngan, toiDa, cu] = [r.so() < 0.2 ? 0 : NGAN_TOI_DA * r.so(), 1 + r.nguyen(theGioi.quan.quan_co_ban), [...quan]];
    const kq = muaQuan(cu, ngan, ds, toiDa, dem, du);
    const truoc = demLoai(cu);
    let giaThem = 0;
    for (const [id, n] of demLoai(kq.quan)) {
      const them = n - (truoc.get(id) ?? 0);
      if (them > 0) giaThem += them * loai(du, id).gia;
      if (them > 0 && !ds.some((l) => l.id === id)) g('TR09', `mua ${id} khong co trong danh sach mua duoc`);
    }
    const tieu = ngan - kq.vangCon;
    if (Math.abs(tieu - giaThem) > 1e-6) g('TR08', `tieu ${tieu.toFixed(2)} vang ma doi them chi dang ${String(giaThem)}: [${cu.join(',')}] -> [${kq.quan.join(',')}], toi da ${String(toiDa)}`);
    if (cu.join() !== quan.join()) g('TR09', 'muaQuan sua quan cu dua vao');
    if (!(kq.vangCon >= 0 && kq.vangCon <= ngan)) g('TR09', `vang con ${String(kq.vangCon)} ngoai [0, ${String(ngan)}]`);
    if (kq.quan.length > Math.max(toiDa, cu.length)) g('TR09', `${String(kq.quan.length)} doi, vuot max(toi da ${String(toiDa)}, cu ${String(cu.length)})`);
    if (kq.quan.some((id, i) => i > 0 && sucQuan([id], du) > sucQuan([kq.quan[i - 1] ?? id], du))) g('TR09', `quan khong xep manh truoc: [${kq.quan.join(',')}]`);
    [quan, dem] = [kq.quan, kq.dem];
    // Danh: cat doiMoiTran doi moi ben nhu TheGioi.tanCong; doi khi tinh trong, doi khi tran bi cat ngan.
    const [di, giu, dh] = [quan.slice(0, DOI_MOI_TRAN), r.so() < TI_LE_TRONG ? [] : thu.slice(0, DOI_MOI_TRAN), chon(r, [...du.diaHinh.keys()])];
    // Data that: ben thua lam tron ve 0 doi khong voi toi duoc (do 03/10: 0/30000 tran). Cat ngan tran_giay (bo doc nhan) thi toi.
    const dd = r.so() < TI_LE_NGAN ? docDuLieuTran(bangTho, doiTho, { ...tranTho, tran_giay: tranTho.tran_giay * (1 - r.so()) }) : du;
    const [tc, tt] = [r.nguyen(du.tuongToiDa + 1), r.nguyen(du.tuongToiDa + 1)];
    const [p, k] = [xacSuatThang(di, giu, dh, tc, tt, dd), danh(di, giu, dh, tc, tt, dd, r.nguyen(2 ** 31))];
    const tuNhien = (x: number, tran: number): boolean => Number.isInteger(x) && x >= 0 && x <= tran;
    // Mat doi theo ti le linh chet, lam tron; ben thua lam tron ve 0 thi van mat mot doi.
    const tiLe = (mat: number, n: number, chet: number, linh: number, thua: boolean): boolean => Math.abs(mat - (n * chet) / linh) <= 0.5 + 1e-9 || (thua && mat === 1 && (n * chet) / linh < 0.5);
    const [khongTran, tr] = [di.length === 0 || giu.length === 0, k.tran];
    if (!(p >= 0 && p <= 1)) g('TR10', `xac suat thang ${String(p)} ngoai [0, 1]`);
    if (!tuNhien(k.matTanCong, di.length) || !tuNhien(k.matPhongThu, giu.length)) g('TR10', `mat ${String(k.matTanCong)}/${String(di.length)} va ${String(k.matPhongThu)}/${String(giu.length)} doi`);
    if (tr !== undefined && k.tanCongThang !== (tr.thang === 'a')) g('TR10', 'ket qua chiem tinh lech ket qua tran');
    if (tr !== undefined && (k.tanCongThang ? k.matPhongThu : k.matTanCong) < 1) g('TR10', `ben thua khong mat doi nao (tran ${String(tr.giayKetThuc)} giay)`);
    if (tr !== undefined && !(tiLe(k.matTanCong, di.length, tr.chetA, tr.linhA, !k.tanCongThang) && tiLe(k.matPhongThu, giu.length, tr.chetB, tr.linhB, k.tanCongThang))) g('TR10', `mat ${String(k.matTanCong)}/${String(di.length)} va ${String(k.matPhongThu)}/${String(giu.length)} doi khi chet ${String(tr.chetA)}/${String(tr.linhA)} va ${String(tr.chetB)}/${String(tr.linhB)} linh`);
    // Mot ben trong thi khong co tran: co quan danh tinh trong la thang trang, khong co quan thi khong thang; % thang noi y nhu vay.
    const sai = khongTran !== (tr === undefined) || (khongTran && (k.tanCongThang !== (di.length > 0) || k.matTanCong + k.matPhongThu > 0 || p !== (k.tanCongThang ? 1 : 0)));
    if (sai) g('TR10', `${String(di.length)} doi danh ${String(giu.length)} doi: co tran ${String(tr !== undefined)}, thang ${String(k.tanCongThang)}, % thang ${String(p)}`);
    [quan, thu] = [quan.slice(k.matTanCong), thu.slice(k.matPhongThu)];
    if (thu.length === 0) thu = quanMoi();
  }
}

/** TR01: ban module thu hai (sau `vi.resetModules`) chay cac hat theo thu tu NGUOC phai ra y het. */
async function kiemBanHai(dauCua: ReadonlyMap<number, string>): Promise<void> {
  vi.resetModules();
  const [B, S] = await Promise.all([import('../src/sim/campaign/Battle.ts'), import('../src/sim/campaign/BattleScript.ts')]);
  if (B.tinhTran === tinhTran) ghi('TR01', 'khong tach duoc ban module thu hai - luat nay thanh rong');
  for (let hat = SO_HAT; hat >= 1; hat--) {
    const r = rngCua(hat, 1);
    const vao = sinhVao(r, du);
    const kq = B.tinhTran(vao, du, r.nguyen(2 ** 31));
    if (bam([kq, S.sinhKichBan(kq, vao, du), B.duDoan(vao, du)]) !== dauCua.get(hat)) ghi('TR01', `hat ${String(hat)}, ${moTaVao(vao)}: ban module thu hai chay nguoc ra tran khac`);
  }
}
const kiemMa = (ma: string): void => { const v = viPham.get(ma); expect(v?.vd ?? [], `${ma}: ${String(v?.so ?? 0)} vi pham`).toEqual([]); };

describe('luat bat bien tran danh', () => {
  beforeAll(async () => {
    const dauCua = new Map<number, string>();
    if (TRUNG_LAP === undefined) for (const ma of ['TR05', 'TR07']) ghi(ma, 'data khong co dia hinh phong_thu = 1 - tran guong va ve doi ben thanh rong');
    for (let hat = 1; hat <= SO_HAT; hat++) {
      const r = rngCua(hat, 1);
      const [vao, hatTran] = [sinhVao(r, du), r.nguyen(2 ** 31)];
      const g: Ghi = (ma, chiTiet) => { ghi(ma, `hat ${String(hat)}, ${moTaVao(vao)}, hat tran ${String(hatTran)}: ${chiTiet}`); };
      const truoc = JSON.stringify(vao);
      const [kq, kb] = kiemMot(vao, du, hatTran, g);
      const dau = bam([kq, kb, duDoan(vao, du)]);
      dauCua.set(hat, dau);
      // TR01: doi hinh dong bang van tinh duoc, ra y het - tinh tran khong ghi vao dau vao.
      const dong = dongBang(structuredClone(vao));
      try { const k2 = tinhTran(dong, du, hatTran); if (bam([k2, sinhKichBan(k2, dong, du), duDoan(dong, du)]) !== dau) g('TR01', 'doi hinh dong bang cho tran khac'); }
      catch (e) { g('TR01', `doi hinh dong bang thi nem loi: ${String(e)}`); }
      if (JSON.stringify(vao) !== truoc) g('TR01', 'tinh tran sua doi hinh dua vao');
      const ben = sinhBen(rngCua(hat, 4), duGuong); // tran guong khong nhieu nen hat tran khong doi gi, dung luon `hat`
      if (TRUNG_LAP !== undefined) { const vg = { a: ben, b: ben, diaHinh: TRUNG_LAP }; kiemMot(vg, duGuong, hat, (ma, chiTiet) => { ghi(ma, `hat ${String(hat)}, tran guong khong nhieu ${moTaVao(vg)}: ${chiTiet}`); }); }
      kiemMien(hat);
    }
    for (const ma of ['TR11', 'TR12', 'TR13']) if (!nhanDuoc.has(ma)) ghi(ma, 'bo doc tu choi moi bien the - luat thanh rong');
    for (let hat = 1; hat <= SO_HAT_CHIEN_DICH; hat++) chienDich(hat);
    await kiemBanHai(dauCua);
  }, SAU ? 900_000 : 30_000);

  it('[TR01] cung doi hinh, cung hat giong thi tran y het du truoc do da danh bao nhieu tran, khong sua doi hinh dua vao', () => { kiemMa('TR01'); });
  it('[TR02] linh da chet khong song lai, doi da vo thi rut han', () => { kiemMa('TR02'); });
  it('[TR03] khong doi nao di nhanh hon toc do cua no, ra khoi chien truong, hay vua danh vua di', () => { kiemMa('TR03'); });
  it('[TR04] doi danh khi va chi khi dich gan nhat trong tam, mat linh chi khi bi danh', () => { kiemMa('TR04'); });
  it('[TR05] ket qua, vet va kich ban ke cung mot chuyen, ben vo het khong thang, khong lui gio', () => { kiemMa('TR05'); });
  it('[TR06] co ben vo het thi tran dung ngay nhip do', () => { kiemMa('TR06'); });
  it('[TR07] % thang du doan trong 0-100, doi ben ra phan bu, tuong gioi hon va dia hinh khong lam nguoc', () => { kiemMa('TR07'); });
  it('[TR09] mua quan: chi mua doi dung thoi dai dung nhom, khong vuot tran, xep manh truoc, khong sua quan cu', () => { kiemMa('TR09'); });
  it('[TR10] danh chiem tinh: mat doi theo ti le linh chet, ben thua mat it nhat mot doi, tinh trong thang trang, khop tran', () => { kiemMa('TR10'); });
});
