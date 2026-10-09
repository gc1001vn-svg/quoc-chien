/**
 * Cua vao cua trang.
 *
 * Ba man: CANH THANH PHO (Phase 2-6), BAN DO TINH (Phase 7), va trang do tran sprite o
 * `?do=sprite`. Hai man dau song cung luc va bam nut doi qua lai - giu ca hai song thi bam
 * "Về thành phố" la thay dung cho cu, khong phai dung lai van tu dau.
 *
 * `?tran=1` mo man xem tran (Phase 10); nut "⚔ Xem trận" o man ban do dan toi day.
 * `?man=ban-do` mo thang man ban do - de may ao chup duoc no ma khong phai gia bo cham tay.
 * `?zoom=` dat muc thu phong mo man cho ca hai.
 */
import { chayCanhThanhPho } from './render/CityScene';
import { chayCanhBanDo } from './render/MapScene';
import { chayDoSprite } from './bench/DoSprite';
import { chayCanhTran } from './render/BattleScene';
import type { Man, TrangThaiMan } from './render/Man';
import { dungTheGioi, type TheGioiGame } from './ui/DungTheGioi';
import { dungGhiCong } from './ui/GhiCong';
import { registerSW } from 'virtual:pwa-register';
import './style.css';

// Ban moi tren Pages: iPhone mo lai app tu nen KHONG tai lai trang, nen trang cu chay mai
// — anh bao 25-26/09 "link Pages khong xai duoc" (van ban 24/09). Truoc 29/09 plugin tu chen
// `registerSW.js`: chi dang ky, khong hoi ban moi, khong tai lai. Gio moi lan trang HIEN LAI
// thi hoi service worker; co ban moi thi `autoUpdate` tu tai lai trang. Ban duyet
// (`--base=./`, `scripts/duyet.mjs`) bo han service worker nen khong dang ky.
if (import.meta.env.BASE_URL !== './') {
  registerSW({
    immediate: true,
    onRegisteredSW(_duong, dangKy) {
      if (!dangKy) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        dangKy.update().catch(() => { /* mat mang: lan hien sau hoi lai */ });
      });
    },
  });
}

const goc: HTMLElement | null = document.getElementById('app');
if (goc === null) throw new Error('Thieu the #app trong index.html');

const thamSo = new URLSearchParams(window.location.search);
const laTrangDo: boolean = thamSo.get('do') === 'sprite';
const laTran: boolean = thamSo.get('tran') === '1' || thamSo.get('tran') === '2';
if (laTrangDo) goc.classList.add('trang-do');
else goc.classList.add('trang-canh');

const cho: HTMLParagraphElement = document.createElement('p');
cho.className = 'dang-nap';
cho.textContent = 'Đang nạp atlas…';
goc.appendChild(cho);

// Cho may chup (`chup_man`, `quay`, `browser_*`): `#app[data-da-ve]` khi khung dau da len man thay
// cho cho cung 2,5 giay, va `window.__qc.trangThai()` doc man dang hien bang chu. Chi doc, khong doi gi.
let manHien: Man | undefined;
declare global { interface Window { __qc?: { trangThai(): TrangThaiMan } } }
window.__qc = {
  trangThai: (): TrangThaiMan => ({
    man: laTrangDo ? 'do-sprite' : laTran ? 'tran' : 'ban-do',
    daVe: goc.dataset['daVe'] ?? '',
    ...manHien?.trangThai?.(),
  }),
};

const chay: Promise<void> = laTrangDo ? chayDoSprite(goc) : laTran ? moManTran(goc) : moHaiMan(goc);
chay.then(
  () => {
    cho.remove();
    // Man nao cung xin khung ve dau TRUOC khi tra ve, nen khung nay chay sau lan ve dau; khung thu hai la luc no da len man.
    requestAnimationFrame(() => requestAnimationFrame(() => { goc.dataset['daVe'] = '1'; }));
    if (laTrangDo) return;
  },
  (loi: unknown) => {
    cho.className = 'nap-hong';
    cho.textContent = `Không nạp được: ${loi instanceof Error ? loi.message : String(loi)}`;
    goc.dataset['daVe'] = 'hong';
  },
);

/** Dung ca hai man, noi hai nut doi man, roi mo man dau. */
async function moHaiMan(boc: HTMLElement): Promise<void> {
  const oThanhPho: HTMLDivElement = taoMan(boc);
  const oBanDo: HTMLDivElement = taoMan(boc);

  // Nap TUAN TU, khong song song: hai `Gl` cung khoi tao mot luc tren cung mot trang thi
  // chiem hai context WebGL cung mot nhip, va may ao chi cho vai context.
  // Mot the gioi cho ca hai man (Phase 11B): thanh pho day gio, ban do tinh doc chu tinh.
  const theGioi: TheGioiGame = dungTheGioi();
  const manThanhPho: Man = await chayCanhThanhPho(oThanhPho, theGioi);
  const manBanDo: Man = await chayCanhBanDo(oBanDo, theGioi);

  const sang = (toi: Man, roi: Man): void => {
    roi.an();
    toi.hien();
    manHien = toi;
  };
  nut(oThanhPho, 'nut-doi-man', '🗺 Bản đồ tỉnh', () => { sang(manBanDo, manThanhPho); });
  nut(oBanDo, 'nut-doi-man', '⌂ Về thành phố', () => { sang(manThanhPho, manBanDo); });
  nutDoTranSprite(oThanhPho);
  nut(oBanDo, 'nut-xem-tran', '⚔ Xem trận', () => { window.location.search = '?tran=1'; });
  nut(oBanDo, 'nut-ghi-cong', 'ⓘ Ghi công', dungGhiCong(oBanDo));

  manHien = thamSo.get('man') === 'ban-do' ? manBanDo : manThanhPho;
  manHien.hien();
}

/** Man xem tran (Phase 10), kem nut quay ve thanh pho. */
async function moManTran(boc: HTMLElement): Promise<void> {
  const o: HTMLDivElement = taoMan(boc);
  o.hidden = false;
  await chayCanhTran(o);
  nut(o, 'nut-doi-man', '⌂ Về thành phố', () => { window.location.search = ''; });
  // Nut doi tran o goc TREN, duoi nut ve thanh pho: de o hang nut duoi thi khung ban duyet
  // tren iPhone che mat - anh bao 26/09 "khong thay tran co".
  const laSung: boolean = thamSo.get('tran') === '2';
  nut(o, 'nut-xem-tran', laSung ? '⚔ Trận cổ' : '⚔ Trận súng', () => { window.location.search = laSung ? '?tran=1' : '?tran=2'; });
}

/** Mot lop man phu kin `#app`. Hai lop chong len nhau, moi luc chi mot cai hien. */
function taoMan(boc: HTMLElement): HTMLDivElement {
  const d: HTMLDivElement = document.createElement('div');
  d.className = 'man';
  d.hidden = true;
  boc.appendChild(d);
  return d;
}

/**
 * Nut mo trang do tran sprite.
 *
 * Chu nam trong mot `<span>` rieng de man hep giau di bang CSS, chi con thuoc do. Khong
 * tach ra thi o be ngang 393 px bay nut toc do rong 316 px de thang len chu "Do tran
 * sprite" o goc trai duoi - da chup thay 11/09. Man rong van hien du chu.
 */
function nutDoTranSprite(cha: HTMLElement): void {
  const b: HTMLButtonElement = document.createElement('button');
  b.type = 'button';
  b.className = 'nut-do';
  const chu: HTMLSpanElement = document.createElement('span');
  chu.className = 'nut-do-chu';
  chu.textContent = 'Đo trần sprite';
  b.append('📏 ', chu);
  b.title = 'Đo trần sprite';
  b.addEventListener('click', () => { window.location.search = '?do=sprite'; });
  cha.appendChild(b);
}

/** Mot nut goc man. */
function nut(cha: HTMLElement, lop: string, chu: string, bam: () => void): void {
  const b: HTMLButtonElement = document.createElement('button');
  b.type = 'button';
  b.className = lop;
  b.textContent = chu;
  b.addEventListener('click', bam);
  cha.appendChild(b);
}
