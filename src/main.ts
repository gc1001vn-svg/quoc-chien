/**
 * Cua vao cua trang.
 *
 * Trang chinh la CANH THANH PHO (Phase 2). Trang do tran sprite van con o `?do=sprite`;
 * `?zoom=` dat muc thu phong mo man de may ao chup duoc anh o dung muc muon kiem.
 */
import { chayCanhThanhPho } from './render/CityScene';
import { chayDoSprite } from './bench/DoSprite';
import './style.css';

const goc: HTMLElement | null = document.getElementById('app');
if (goc === null) throw new Error('Thieu the #app trong index.html');

const laTrangDo: boolean = new URLSearchParams(window.location.search).get('do') === 'sprite';
if (laTrangDo) goc.classList.add('trang-do');
else goc.classList.add('trang-canh');

const cho: HTMLParagraphElement = document.createElement('p');
cho.className = 'dang-nap';
cho.textContent = 'Đang nạp atlas…';
goc.appendChild(cho);

const chay: Promise<void> = laTrangDo ? chayDoSprite(goc) : chayCanhThanhPho(goc);
chay.then(
  () => {
    cho.remove();
    if (!laTrangDo) goc.appendChild(nutSangTrangDo());
  },
  (loi: unknown) => {
    cho.className = 'nap-hong';
    cho.textContent = `Không nạp được: ${loi instanceof Error ? loi.message : String(loi)}`;
  },
);

/** Duong sang trang do tran sprite - chu du an bam tu dien thoai, khong go dia chi. */
function nutSangTrangDo(): HTMLAnchorElement {
  const a: HTMLAnchorElement = document.createElement('a');
  a.className = 'nut-do';
  a.href = '?do=sprite';
  a.textContent = 'Đo trần sprite';
  return a;
}
