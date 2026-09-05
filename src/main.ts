/**
 * Cua vao cua trang.
 *
 * Phase 0 chua co game. Trang chinh chi la man hinh khoi dong de kiem tra PWA cai duoc
 * len iPhone; viec that cua phase nay nam o `?do=sprite` - trang do tran sprite.
 */
import { chayDoSprite } from './bench/DoSprite';
import './style.css';

const goc: HTMLElement | null = document.getElementById('app');
if (goc === null) throw new Error('Thieu the #app trong index.html');

if (new URLSearchParams(window.location.search).get('do') === 'sprite') {
  goc.classList.add('trang-do');
  chayDoSprite(goc);
} else {
  goc.innerHTML = `
    <div class="man-cho">
      <h1>Quốc Chiến</h1>
      <p>Phase 0 — mới có khung, chưa có game.</p>
      <a class="nut-lon" href="?do=sprite">Đo trần sprite của máy này</a>
      <p class="ghi-chu">Cài lên màn hình chính: bấm nút Chia sẻ → Thêm vào MH chính.</p>
    </div>`;
}
