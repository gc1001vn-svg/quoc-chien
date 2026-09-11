/**
 * Cua vao cua trang.
 *
 * Ba man: CANH THANH PHO (Phase 2-6), BAN DO TINH (Phase 7), va trang do tran sprite o
 * `?do=sprite`. Hai man dau song cung luc va bam nut doi qua lai - giu ca hai song thi bam
 * "Về thành phố" la thay dung cho cu, khong phai dung lai van tu dau.
 *
 * `?man=ban-do` mo thang man ban do - de may ao chup duoc no ma khong phai gia bo cham tay.
 * `?zoom=` dat muc thu phong mo man cho ca hai.
 */
import { chayCanhThanhPho } from './render/CityScene';
import { chayCanhBanDo } from './render/MapScene';
import { chayDoSprite } from './bench/DoSprite';
import type { Man } from './render/Man';
import './style.css';

const goc: HTMLElement | null = document.getElementById('app');
if (goc === null) throw new Error('Thieu the #app trong index.html');

const thamSo = new URLSearchParams(window.location.search);
const laTrangDo: boolean = thamSo.get('do') === 'sprite';
if (laTrangDo) goc.classList.add('trang-do');
else goc.classList.add('trang-canh');

const cho: HTMLParagraphElement = document.createElement('p');
cho.className = 'dang-nap';
cho.textContent = 'Đang nạp atlas…';
goc.appendChild(cho);

const chay: Promise<void> = laTrangDo ? chayDoSprite(goc) : moHaiMan(goc);
chay.then(
  () => {
    cho.remove();
    if (laTrangDo) return;
  },
  (loi: unknown) => {
    cho.className = 'nap-hong';
    cho.textContent = `Không nạp được: ${loi instanceof Error ? loi.message : String(loi)}`;
  },
);

/** Dung ca hai man, noi hai nut doi man, roi mo man dau. */
async function moHaiMan(boc: HTMLElement): Promise<void> {
  const oThanhPho: HTMLDivElement = taoMan(boc);
  const oBanDo: HTMLDivElement = taoMan(boc);

  // Nap TUAN TU, khong song song: hai `Gl` cung khoi tao mot luc tren cung mot trang thi
  // chiem hai context WebGL cung mot nhip, va may ao chi cho vai context.
  const manThanhPho: Man = await chayCanhThanhPho(oThanhPho);
  const manBanDo: Man = await chayCanhBanDo(oBanDo);

  const sang = (toi: Man, roi: Man): void => {
    roi.an();
    toi.hien();
  };
  nut(oThanhPho, 'nut-doi-man', '🗺 Bản đồ tỉnh', () => { sang(manBanDo, manThanhPho); });
  nut(oBanDo, 'nut-doi-man', '⌂ Về thành phố', () => { sang(manThanhPho, manBanDo); });
  nut(oThanhPho, 'nut-do', 'Đo trần sprite', () => { window.location.search = '?do=sprite'; });

  if (thamSo.get('man') === 'ban-do') manBanDo.hien();
  else manThanhPho.hien();
}

/** Mot lop man phu kin `#app`. Hai lop chong len nhau, moi luc chi mot cai hien. */
function taoMan(boc: HTMLElement): HTMLDivElement {
  const d: HTMLDivElement = document.createElement('div');
  d.className = 'man';
  d.hidden = true;
  boc.appendChild(d);
  return d;
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
