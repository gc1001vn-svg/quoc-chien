/**
 * Man XEM TRAN - viec chinh cua Phase 10 (KE_HOACH muc 2).
 *
 * Tran tinh xong NGAY khi mo man (`tinhTran`, vai mili giay), roi man chi PHAT lai: dong ho
 * rieng chay tu 0 toi giay ket thuc, `DienTran` noi ra tung linh o moi giay. Tang toc, bo
 * qua, xem lai deu chi la doi dong ho - ket qua khong bao gio doi (GAME_SPEC muc 6).
 *
 * Mo bang `?tran=1`. Chua noi voi ban do chien dich (no Phase 9) - danh tran mau trong
 * `data/dien_tran.json`.
 */
import bangGiap from '../../data/armor_table.json';
import donVi from '../../data/units.json';
import tranTho from '../../data/battle.json';
import dienTho from '../../data/dien_tran.json';
import { docDuLieuTran, duDoan, tinhTran, type DauVaoTran, type DuLieuTran, type KetQuaTran } from '../sim/campaign/Battle';
import { sinhKichBan, type Canh } from '../sim/campaign/BattleScript';
import { Perf } from '../core/Perf';
import { PHIEN_BAN } from '../PhienBan';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import { Camera } from './Camera';
import { DienTran, type CauHinhDien, type LinhVe } from './DienTran';
import { Gl } from './Gl';
import { neoX, neoY } from './IsoMath';
import { datSprite } from './VeBanDo';
import type { Ve } from './VeCanh';

/** Suc chua buffer: ~250 linh (GAME_SPEC muc 6) + de duoi chan + 121 o dat, lam tron len. */
const SUC_CHUA = 1024;
/** Canh mot o dat trong atlas, tinh bang o chien truong (`dat_0` nuong `phang: 4`). */
const O_DAT = 4;
/** So dong nhat ky tran hien cung luc. */
const SO_DONG = 4;

/** Mo man xem tran trong `goc`. */
export async function chayCanhTran(goc: HTMLElement): Promise<void> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const perf: Perf = new Perf(goc);

  const bo: BoAtlas = await taiBoAtlas('linh_co', coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  const duLieu: DuLieuTran = docDuLieuTran(bangGiap, donVi, tranTho);
  const m = dienTho.tran_mau;
  const vao: DauVaoTran = {
    a: { doi: m.a, tuong: m.tuong_a },
    b: { doi: m.b, tuong: m.tuong_b },
    diaHinh: m.dia_hinh,
  };
  const kq: KetQuaTran = tinhTran(vao, duLieu, m.hat_giong);
  const phanTram: number = Math.round(duDoan(vao, duLieu) * 100);
  const kichBan: Canh[] = sinhKichBan(kq, vao, duLieu);
  const cauHinh: CauHinhDien = dienTho;
  const dien = new DienTran(kq, vao, cauHinh);

  const canh: number = duLieu.chienTruong;
  const cam: Camera = new Camera(atlas.heSo(), canh + 1, atlas.oPx(), dienTho.zoom.min, dienTho.zoom.max, dienTho.zoom.dau);
  cam.noiVao(canvas);

  let rongCss = 1;
  let caoCss = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    cam.datKichThuoc(goc.clientWidth, goc.clientHeight);
    rongCss = goc.clientWidth;
    caoCss = goc.clientHeight;
  };
  window.addEventListener('resize', doKichThuoc);
  doKichThuoc();

  // Zoom vua khit vung quan di qua. Hop o luoi `(a, b)` thanh hinh thoi tren man: bon goc
  // doi sang toa do the gioi roi lay hop bao.
  const hop = dien.hopVet();
  const le: number = dienTho.le_o;
  const goc4: [number, number][] = [[hop.a0 - le, hop.b0 - le], [hop.a1 + le, hop.b0 - le], [hop.a0 - le, hop.b1 + le], [hop.a1 + le, hop.b1 + le]];
  const xs: number[] = goc4.map(([a, b]) => neoX(a, b, atlas.oPx()));
  const ys: number[] = goc4.map(([a, b]) => neoY(a, b, atlas.oPx()));
  const rongHop: number = Math.max(...xs) - Math.min(...xs);
  const caoHop: number = Math.max(...ys) - Math.min(...ys);
  cam.datZoom(atlas.heSo() * Math.min(rongCss / rongHop, caoCss / caoHop));
  cam.datTam((Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2);

  // Dong ho tran: giay da phat, toc do xem. `?giay=` mo thang giua tran - de may ao chup
  // duoc canh giap la ca ma khong phai ngoi cho, giong `?tinh=1` cua man ban do.
  let giay: number = Number(new URLSearchParams(window.location.search).get('giay') ?? 0) || 0;
  let tocDo: number = dienTho.toc_do_xem[0] ?? 1;
  let truoc = 0;

  const dau: HTMLParagraphElement = document.createElement('p');
  dau.className = 'tran-dau';
  goc.appendChild(dau);
  const nhatKy: HTMLDivElement = document.createElement('div');
  nhatKy.className = 'su-kien';
  goc.appendChild(nhatKy);

  const hang: HTMLDivElement = document.createElement('div');
  hang.className = 'toc-do';
  goc.appendChild(hang);
  const nutToc: HTMLButtonElement[] = dienTho.toc_do_xem.map((t) => nut(hang, `×${String(t)}`, () => {
    tocDo = t;
    danhDauToc();
  }));
  const danhDauToc = (): void => {
    nutToc.forEach((b, i) => { b.dataset['bat'] = dienTho.toc_do_xem[i] === tocDo ? 'co' : 'khong'; });
  };
  danhDauToc();
  nut(hang, '⏭ Bỏ qua', () => { giay = kq.giayKetThuc; });
  nut(hang, '↺ Xem lại', () => { giay = 0; });

  const oPx: number = atlas.oPx();

  const veMotKhung = (now: number): void => {
    perf.danhDau(now);
    const dt: number = truoc === 0 ? 0 : Math.min((now - truoc) / 1000, 0.25);
    truoc = now;
    giay = Math.min(giay + dt * tocDo, kq.giayKetThuc + 3);

    const k = cam.khung();
    const ve: Ve = {
      gl, atlas, rongDev: rongCss * gl.tiLeDiemAnh(), caoDev: caoCss * gl.tiLeDiemAnh(),
      tiLe: gl.tiLeDiemAnh() * cam.cssTrenWorld(),
      camX: (k.x0 + k.x1) / 2, camY: (k.y0 + k.y1) / 2, dem: 0,
      // Linh doi khung theo dong ho tran trong `DienTran`, khong theo nhip thanh pho.
      khung: 0,
    };

    gl.batDauKhung();
    // Lop nen truoc, roi de mau, roi linh - cung luat hai lop cua `VeCanh`.
    for (let a = 0; a < canh; a += O_DAT) {
      for (let b = 0; b < canh; b += O_DAT) {
        datSprite(ve, neoX(a + O_DAT / 2, b + O_DAT / 2, oPx), neoY(a + O_DAT / 2, b + O_DAT / 2, oPx), `dat_${String(((a + b) / O_DAT) % 2)}`);
      }
    }
    const linh: LinhVe[] = dien.linhLuc(giay);
    for (const l of linh) {
      if (!l.ten.includes('_chet_')) datSprite(ve, neoX(l.a, l.b, oPx), neoY(l.a, l.b, oPx), `de_${l.ben}`);
    }
    for (const l of linh) datSprite(ve, neoX(l.a, l.b, oPx), neoY(l.a, l.b, oPx), l.ten);
    const lenhVe: number = gl.ketThucKhung();

    const xong: boolean = giay >= kq.giayKetThuc;
    dau.textContent = `Dự đoán ta thắng ${String(phanTram)}% · giây ${String(Math.floor(Math.min(giay, kq.giayKetThuc)))}/${String(Math.round(kq.giayKetThuc))}`
      + (xong ? ` · ${kq.thang === 'a' ? 'TA THẮNG' : 'TA THUA'} · ta mất ${String(kq.chetA)}/${String(kq.linhA)}, địch mất ${String(kq.chetB)}/${String(kq.linhB)}` : '');
    veNhatKy(nhatKy, kichBan, giay);
    perf.datGhiChu(`${PHIEN_BAN} · trận · ${String(ve.dem)} sprite · ${String(lenhVe)} lệnh vẽ · ${cam.zoom().toFixed(2)}×`);
    requestAnimationFrame(veMotKhung);
  };
  requestAnimationFrame(veMotKhung);
}

/** Hien `SO_DONG` canh gan nhat da dien toi. Chi dung lai DOM khi so dong doi. */
function veNhatKy(o: HTMLElement, kb: readonly Canh[], giay: number): void {
  const da: Canh[] = kb.filter((c) => c.giay <= giay).slice(-SO_DONG);
  const khoa: string = da.map((c) => `${String(c.giay)}${c.chu}`).join('|');
  if (o.dataset['khoa'] === khoa) return;
  o.dataset['khoa'] = khoa;
  o.replaceChildren(...da.map((c) => {
    const p: HTMLParagraphElement = document.createElement('p');
    p.textContent = `${String(Math.round(c.giay))}s · ${c.chu}`;
    if (c.loai === 'vo' || c.loai === 'ket_thuc') p.dataset['loai'] = 'the';
    return p;
  }));
}

function nut(cha: HTMLElement, chu: string, bam: () => void): HTMLButtonElement {
  const b: HTMLButtonElement = document.createElement('button');
  b.type = 'button';
  b.textContent = chu;
  b.addEventListener('click', bam);
  cha.appendChild(b);
  return b;
}
