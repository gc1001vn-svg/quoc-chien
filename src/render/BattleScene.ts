/**
 * Man XEM TRAN - viec chinh cua Phase 10 (KE_HOACH muc 2).
 *
 * Tran tinh xong NGAY khi mo man (`tinhTran`, vai mili giay), roi man chi PHAT lai: dong ho
 * rieng chay tu 0 toi giay ket thuc, `DienTran` noi ra tung linh o moi giay. Tang toc, bo
 * qua, xem lai deu chi la doi dong ho - ket qua khong bao gio doi (GAME_SPEC muc 6).
 *
 * Mo bang `?tran=1` (thoi co, atlas `linh_co`) hay `?tran=2` (doi sung, atlas `linh_sung`). Chua noi voi ban do chien dich (no Phase 9) - danh tran mau trong
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
import { DienTran, type CauHinhDien, type LinhVe, type MuiTen } from './DienTran';
import { Gl } from './Gl';
import { neoX, neoY } from './IsoMath';
import { datSprite } from './VeBanDo';
import type { Ve } from './VeCanh';

/** Suc chua buffer: ~250 linh (GAME_SPEC muc 6) + de duoi chan + 121 o dat, lam tron len. */
const SUC_CHUA = 1024;
/** Canh mot o dat trong atlas, tinh bang o chien truong (`dat_0` nuong `phang: 4`). */
const O_DAT = 4;
/**
 * Mot o luoi chieu thang dung len man bao nhieu lan `oPx`: may nuong xem nghieng 30 do,
 * mot don vi the gioi rong `oPx / sqrt(2)` diem anh, cao nhan `cos 30`.
 */
const CAO_O: number = Math.cos(Math.PI / 6) / Math.SQRT2;
/** So dong nhat ky tran hien cung luc. */
const SO_DONG = 4;

/** Mot tran mau trong `data/dien_tran.json`. `ban` ghi de so ban chung cua lop dien. */
interface TranMau {
  readonly me: string;
  readonly ten_dan?: string;
  readonly ban?: Partial<CauHinhDien>;
  readonly a: string[];
  readonly b: string[];
  readonly tuong_a: number;
  readonly tuong_b: number;
  readonly dia_hinh: string;
  readonly hat_giong: number;
}

/** Mo man xem tran trong `goc`. */
export async function chayCanhTran(goc: HTMLElement): Promise<void> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const perf: Perf = new Perf(goc);

  // `?tran=2` la tran doi sung (Phase 10B), con lai la tran thoi co. Moi tran mot atlas.
  const m: TranMau = soTran() === 2 ? dienTho.tran_mau_sung : dienTho.tran_mau;
  const bo: BoAtlas = await taiBoAtlas(m.me, coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  const duLieu: DuLieuTran = docDuLieuTran(bangGiap, donVi, tranTho);
  const vao: DauVaoTran = {
    a: { doi: m.a, tuong: m.tuong_a },
    b: { doi: m.b, tuong: m.tuong_b },
    diaHinh: m.dia_hinh,
  };
  const kq: KetQuaTran = tinhTran(vao, duLieu, m.hat_giong);
  const phanTram: number = Math.round(duDoan(vao, duLieu) * 100);
  const kichBan: Canh[] = sinhKichBan(kq, vao, duLieu);
  // Tran co `ban` rieng (dan sung bay thang) thi ghi de so ban chung.
  const cauHinh: CauHinhDien = { ...dienTho, ...m.ban, ...(m.ten_dan === undefined ? {} : { ten_dan: m.ten_dan }) };
  const tamDoi = new Map<string, number>([...duLieu.doi].map(([id, l]) => [id, l.tam]));
  const dien = new DienTran(kq, vao, cauHinh, tamDoi);

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
  // `?zoom=` phong to tai tam tran - de may ao chup can canh giap la ca, giong hai man kia.
  const zoomUrl: number = Number(new URLSearchParams(window.location.search).get('zoom') ?? 0);
  if (zoomUrl > 0) cam.datZoom(zoomUrl);

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
  nut(hang, soTran() === 2 ? '⚔ Trận cổ' : '⚔ Trận súng', () => { window.location.search = `?tran=${soTran() === 2 ? '1' : '2'}`; });

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
    // Lop nen truoc, roi de mau, roi linh - cung luat hai lop cua `VeCanh`. Bon nut tat lop
    // cua `Perf` (Nen · Nha=de phe · Nguoi · Hieu ung=mui ten + chu) de do tren iPhone xem
    // lop nao an fps - 25/09 man tran 29-30 fps, CPU tinh linh chi 0,06 ms/khung.
    if (perf.dangBat('nen')) {
      for (let a = 0; a < canh; a += O_DAT) {
        for (let b = 0; b < canh; b += O_DAT) {
          datSprite(ve, neoX(a + O_DAT / 2, b + O_DAT / 2, oPx), neoY(a + O_DAT / 2, b + O_DAT / 2, oPx), `dat_${String(((a + b) / O_DAT) % 2)}`);
        }
      }
    }
    const linh: LinhVe[] = dien.linhLuc(giay);
    if (perf.dangBat('nha')) {
      for (const l of linh) {
        if (!l.ten.includes('_chet_')) datSprite(ve, neoX(l.a, l.b, oPx), neoY(l.a, l.b, oPx), `de_${l.ben}`);
      }
    }
    if (perf.dangBat('nguoi')) for (const l of linh) datSprite(ve, neoX(l.a, l.b, oPx), neoY(l.a, l.b, oPx), l.ten);
    // Mui ten ve sau cung, nang len theo do cao: mot o cao chieu len man bang `CAO_O * oPx`.
    const hieuUng: boolean = perf.dangBat('hieuUng');
    const muiTen: MuiTen[] = hieuUng ? dien.muiTenLuc(giay) : [];
    for (const m of muiTen) datSprite(ve, neoX(m.a, m.b, oPx), neoY(m.a, m.b, oPx) - m.cao * CAO_O * oPx, m.ten);
    const lenhVe: number = gl.ketThucKhung();

    const xong: boolean = giay >= kq.giayKetThuc;
    dau.hidden = !hieuUng;
    nhatKy.hidden = !hieuUng;
    if (hieuUng) dau.textContent = `Dự đoán ta thắng ${String(phanTram)}% · giây ${String(Math.floor(Math.min(giay, kq.giayKetThuc)))}/${String(Math.round(kq.giayKetThuc))}`
      + (xong ? ` · ${kq.thang === 'a' ? 'TA THẮNG' : 'TA THUA'} · ta mất ${String(kq.chetA)}/${String(kq.linhA)}, địch mất ${String(kq.chetB)}/${String(kq.linhB)}` : '');
    if (hieuUng) veNhatKy(nhatKy, kichBan, giay);
    perf.datGhiChu(`${PHIEN_BAN} · trận · ${String(ve.dem)} sprite · ${String(lenhVe)} lệnh vẽ · ${cam.zoom().toFixed(2)}×`);
    requestAnimationFrame(veMotKhung);
  };
  requestAnimationFrame(veMotKhung);
}

/** So tran mau trong `?tran=`: 2 la tran doi sung, con lai la 1. */
function soTran(): number {
  return new URLSearchParams(window.location.search).get('tran') === '2' ? 2 : 1;
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
