/**
 * Canh thanh pho - viec chinh cua Phase 2.
 *
 * Hai vong ve nam o `VeCanh.ts`; file nay lo phan dung canh, nhip thoi gian va cac bang UI.
 */
import cauHinhTho from '../../data/thanh_pho_demo.json';
import hangTho from '../../data/wares.json';
import nhaTho from '../../data/buildings.json';
import chuoiTho from '../../data/chains.json';
import walkerTho from '../../data/walkers.json';
import chinhSachTho from '../../data/policy.json';
import theTho from '../../data/decisions.json';
import canBangTho from '../../data/balance.json';
import { Governor } from '../sim/autoplay/Governor';
import { docChinhSach } from '../sim/autoplay/Policy';
import { DongCo, docNhipDo, docThe } from '../sim/decision/Engine';
import { NhatKy } from '../sim/decision/NhatKy';
import { Van } from '../sim/decision/Van';
import { TheQuyetDinh } from '../ui/DecisionCard';
import { BangSuKien } from '../ui/NhatKySuKien';
import { BangCongTrinh } from '../ui/BangCongTrinh';
import { Ghim } from '../ui/Ghim';
import { baoThieuHinh } from '../ui/BaoThieuHinh';
import { HangTocDo } from '../ui/TocDo';
import { Perf } from '../core/Perf';
import { PHIEN_BAN } from '../PhienBan';
import { Atlas, coTheoDpr, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import type { Man } from './Man';
import { Camera } from './Camera';
import { Gl } from './Gl';
import { neoX, neoY, vungONhinThay, type VungO } from './IsoMath';
import { doMuc, veLopNen, veLopVat, type Muc, type Ve } from './VeCanh';
import { noiChamChon } from './ChamChon';
import type { BanDo, CauHinhBanDo, O } from '../sim/city/BanDo';
import { ThanhPho } from '../sim/city/City';
import { DongHo } from '../sim/Clock';

const CAU_HINH: CauHinhBanDo = cauHinhTho;

/** Duoi muc thu nho nay thi khong ve nguoi nua. Duong lui khi iPhone rot fps. */
const ZOOM_HIEN_WALKER = 0;
/** Suc chua buffer. Rong hon tran 5.000 mot chut de con dem duoc luc vuot. */
const SUC_CHUA = 6144;
/**
 * Cong trinh vua bay toi nam o day nhieu phan chieu cao man, tinh tu tren xuong.
 *
 * KHONG duoc de qua 0,5: the quyet dinh an het 46 % man tu duoi len, ma the thi hien bat
 * cu luc nao. Ban dau de 0,72 - gieng roi dung sau tam the, chup ra la mot vat co xanh.
 */
const CHO_SOI = 0.38;

/** Mo canh thanh pho trong `goc`. */
export async function chayCanhThanhPho(goc: HTMLElement): Promise<Man> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  goc.appendChild(canvas);
  const perf: Perf = new Perf(goc);

  // Nap JSON atlas TRUOC: so trang quyet dinh shader, phai biet roi moi dung duoc `Gl`.
  const bo: BoAtlas = await taiBoAtlas(CAU_HINH.me, coTheoDpr(window.devicePixelRatio));
  const gl: Gl = new Gl(canvas, SUC_CHUA, bo.trang.length);
  const atlas: Atlas = new Atlas(bo, await napTrangLenGpu(bo, gl));
  gl.datTrang(atlas.cacTrang());

  // Mo phong that chay ngay trong trinh duyet. Cung mot `src/sim/` ma `npm run sim:thu`
  // chay 10 gio game trong Node - khong co ban sao thu hai cua luat kinh te.
  const thanhPho: ThanhPho = new ThanhPho({
    hang: hangTho, nha: nhaTho, chuoi: chuoiTho, banDo: cauHinhTho, walker: walkerTho,
  });
  // Thong doc chay NGAY TU `moDau`: mo van ra la thanh pho da co kho thu hai va vai nha
  // moi, dung nhu bang so cua `npm run sim:thu`. Nhung KHONG hoi the trong `moDau` -
  // hoi luc do la the hien ra truoc ca thanh pho, va dung sim khi chua co gi de nhin.
  const nhatKy: NhatKy = new NhatKy();
  const van: Van = new Van(
    thanhPho,
    new Governor(thanhPho, docChinhSach(chinhSachTho)),
    new DongCo(docThe(theTho), docNhipDo(canBangTho)),
    nhatKy,
    false,
  );
  thanhPho.datThongDoc(van);
  thanhPho.moDau();
  van.batDau();
  const banDo: BanDo = thanhPho.banDo;
  const cam: Camera = new Camera(
    atlas.heSo(), CAU_HINH.canh, atlas.oPx(),
    CAU_HINH.zoomMin, CAU_HINH.zoomMax, zoomBanDau(),
  );
  cam.noiVao(canvas);
  const ghim: Ghim = new Ghim(goc);
  // Atlas lech ban voi code thi bao ngay bang chu do, khong de `datSprite` nuot im lang.
  baoThieuHinh(goc, atlas.thieu(tenSpriteCanCo(banDo)));

  let rongCss = 1;
  let caoCss = 1;
  const doKichThuoc = (): void => {
    gl.datKichThuoc(goc.clientWidth, goc.clientHeight, window.devicePixelRatio);
    cam.datKichThuoc(goc.clientWidth, goc.clientHeight);
    rongCss = goc.clientWidth;
    caoCss = goc.clientHeight;
  };
  doKichThuoc();
  window.addEventListener('resize', doKichThuoc);

  /**
   * Truot toi mot cong trinh va ghim ten len no. **KHONG doi muc thu phong.**
   *
   * Ban dau ham nay tu keo len 1,6x cho "du gan de doc ra hinh dang". Chu du an bao bo:
   * 11/09, khi quy hoach da ro thi anh muon dung o muc dang xem de con thay ca bo cuc -
   * "khong cần bấm vào sát vào, chỉ cần bấm vào hiện cái tên chỉ vào đấy là được". Bi keo
   * phong to moi lan bam la mat cho dang nhin.
   *
   * Van dat cong trinh o khoang 38 % chieu cao man chu khong chinh giua: cai dung truoc -
   * tuc THAP hon tren man - vuon len nuot cai dung sau, ma the quyet dinh thi an 46 % man
   * tu duoi len.
   */
  const bayToi = (o: O, hien: string): void => {
    const lech: number = ((CHO_SOI - 0.5) * caoCss) / cam.cssTrenWorld();
    cam.datTam(neoX(o.a, o.b, atlas.oPx()), neoY(o.a, o.b, atlas.oPx()) - lech);
    ghim.dat(o, hien);
  };
  const oDau = oBanDau();
  if (oDau !== undefined) bayToi(oDau, 'đây');

  // Sim chay 10 Hz, doc lap voi vong ve 60 fps (TECH_SPEC muc 2). PHAI di qua `DongHo`:
  // no giu phan le. Tu lam tron `giay * 10` thi o 60 fps moi khung ra 0,167 -> lam tron
  // thanh 0, va mo phong dung im MAI MAI trong khi ban ve van chay muot. Da bi mot lan.
  const nhipKe: DongHo = new DongHo();
  const theUi: TheQuyetDinh = new TheQuyetDinh(goc, nhipKe);
  const bangSuKien: BangSuKien = new BangSuKien(goc, nhatKy);
  const hangTocDo: HangTocDo = new HangTocDo(goc, nhipKe);
  // Bam mot dong trong bang la bay toi cong trinh do. Khong co duong den thi sau cai coi
  // xay giua gan tram cong trinh la khong bao gio tim ra.
  new BangCongTrinh(goc, thanhPho, bayToi);
  // Cham vao mot cong trinh la hien ten no - xem `ChamChon.ts`.
  let veCuoi: Ve | undefined;
  noiChamChon(canvas, () => veCuoi, banDo, thanhPho, ghim, () => gl.tiLeDiemAnh());

  let truoc = 0;
  let dangChay = false;
  const veMotKhung = (now: number): void => {
    // Man bi an thi dung han vong ve. Khong dung thi ca hai man cung ve mot luc, ma mo
    // phong thanh pho van chay 10 Hz trong khi nguoi choi dang xem ban do tinh.
    if (!dangChay) return;
    perf.danhDau(now);

    const giay: number = truoc === 0 ? 0 : (now - truoc) / 1000;
    truoc = now;
    thanhPho.chay(nhipKe.tien(giay));

    const the = van.the;
    if (the !== undefined && !theUi.hien) {
      theUi.hienThe(the, (lc) => {
        van.traLoi(lc);
        // Keo camera toi thu vua dung. Khong co buoc nay thi bam "xay hai coi xay" xong
        // chu du an khong tim ra chung: ban do 96x96 co hang tram vat the ma ca van chi co
        // vai cai coi xay, o muc thu nho nhat man hinh chi thay 39 o.
        const o = thanhPho.layOVuaDung();
        if (o !== undefined) bayToi(o, 'vừa xây');
      });
    }
    bangSuKien.capNhat();
    hangTocDo.capNhat();

    const ve: Ve = {
      gl, atlas, rongDev: rongCss * gl.tiLeDiemAnh(), caoDev: caoCss * gl.tiLeDiemAnh(),
      tiLe: gl.tiLeDiemAnh() * cam.cssTrenWorld(),
      camX: 0, camY: 0, dem: 0,
    };
    const khung = cam.khung();
    ve.camX = (khung.x0 + khung.x1) / 2;
    ve.camY = (khung.y0 + khung.y1) / 2;
    veCuoi = ve;
    const vung: VungO = vungONhinThay(khung, atlas.oPx(), banDo.canh, atlas.bienDo());
    const oGhim: O | undefined = ghim.layMuc();
    const muc: Muc | undefined = oGhim === undefined ? undefined : doMuc(ve, banDo, oGhim);
    if (muc !== undefined) {
      const dpr: number = gl.tiLeDiemAnh();
      ghim.ve((muc.hop.x0 + muc.hop.x1) / 2 / dpr, muc.hop.y0 / dpr, rongCss, caoCss);
    }

    gl.batDauKhung();
    if (perf.dangBat('nen')) veLopNen(ve, banDo, vung);
    veLopVat(
      ve, banDo,
      perf.dangBat('nha'),
      perf.dangBat('nguoi') && cam.zoom() >= ZOOM_HIEN_WALKER ? thanhPho : undefined,
      muc,
    );
    const lenhVe: number = gl.ketThucKhung();

    const canhBao: string = ve.dem > CAU_HINH.tranSprite ? ' ⚠ VƯỢT TRẦN' : '';
    // So phien ban in ngay day: chu du an chup man gui la biet dang xem ban nao, khong
    // phai doan "co phai chua cap nhat khong" nua.
    perf.datGhiChu(
      `${PHIEN_BAN} · ${String(ve.dem)} sprite · ${String(lenhVe)} lệnh vẽ`
      + ` · ${cam.zoom().toFixed(2)}×${canhBao}`,
    );
    requestAnimationFrame(veMotKhung);
  };

  return {
    hien: (): void => {
      goc.hidden = false;
      doKichThuoc();
      // Xoa moc thoi gian: khong xoa thi lan ve dau tien sau khi quay lai nhan duoc ca
      // quang thoi gian dang xem ban do, va thanh pho nhay mot cai vai chuc nhip.
      truoc = 0;
      if (dangChay) return;
      dangChay = true;
      requestAnimationFrame(veMotKhung);
    },
    an: (): void => {
      dangChay = false;
      goc.hidden = true;
    },
  };
}

/**
 * O dat camera luc mo man, lay tu `?o=a,b`. `undefined` thi de camera o giua ban do.
 *
 * Co tham so nay de may ao chup duoc DUNG cho mot toa nha va kiem xem no co that su hien
 * ra khong - truoc do chi doan bang mat tren anh toan canh.
 */
function oBanDau(): O | undefined {
  const tho: string | null = new URLSearchParams(window.location.search).get('o');
  if (tho === null) return undefined;
  const [a, b] = tho.split(',').map(Number);
  if (a === undefined || b === undefined || !Number.isFinite(a) || !Number.isFinite(b)) {
    return undefined;
  }
  return { a, b };
}

/**
 * Zoom mo man, lay tu `?zoom=` neu co.
 *
 * Co tham so nay de may ao chup duoc anh o dung muc thu phong muon kiem, khong phai gia
 * bo cham hai ngon. Khong co thi lay so trong JSON.
 */
function zoomBanDau(): number {
  const tho: string | null = new URLSearchParams(window.location.search).get('zoom');
  const z: number = tho === null ? Number.NaN : Number(tho);
  return Number.isFinite(z) && z > 0 ? z : CAU_HINH.zoomDau;
}

/**
 * Moi ten sprite man hinh se hoi atlas: nen, vat the, va nguoi vac hang.
 *
 * Lay tu ban do THAT chu khong tu mot danh sach viet tay - danh sach viet tay se lac hau
 * dung luc can no nhat.
 */
function tenSpriteCanCo(banDo: BanDo): Set<string> {
  const can = new Set<string>();
  for (const ten of banDo.nen) if (ten !== undefined) can.add(ten);
  for (const v of banDo.vat) can.add(v.ten);
  // Bon huong, hai dang - dung nhu `sim/city/Walkers.ts`: moi buoc chi doi mot truc nen
  // khong bao gio co huong cheo.
  for (const kieu of ['nam', 'nu']) {
    for (let h = 0; h < 4; h += 1) for (let d = 0; d < 2; d += 1) {
      can.add(`nguoi_${kieu}_${String(h)}_${String(d)}`);
    }
  }
  return can;
}
