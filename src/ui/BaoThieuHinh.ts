/**
 * Bang do bao "atlas thieu hinh" - de mot loi cam bien thanh mot loi noi duoc.
 *
 * VI SAO CO FILE NAY. `datSprite` bo qua IM LANG khi atlas khong co ten sprite. Cai im
 * lang do da tra gia hai lan:
 *
 * - 08/09: iOS giu service worker cu, atlas cu khong co `nguoi_nam_1_0` -> khong ai di tren
 *   duong. Mat mot buoi sang.
 * - 10/09: workbox ghi `revision: null` cho moi file trong `dist/assets/` (no tuong duong
 *   dan da co bam noi dung). Ten file atlas thi KHONG DOI bao gio, nen may cua chu du an
 *   giu mai ban atlas truoc khi nuong 12 hinh moi: code moi + du lieu moi + ATLAS CU. Gieng,
 *   coi xay, mo, xuong deu bien mat trong khi nha, cay, nguoi van hien. Nam vong doan mo.
 *
 * Nguyen nhan goc da vá (atlas doi ve `public/atlas/`, khong con nam trong `assets/` nen
 * workbox bam lai moi lan doi). Bang nay la lop thu hai: lan sau co lech thi NHIN LA THAY,
 * khong phai doan.
 *
 * Style de thang trong `.ts`: `src/style.css` nam trong `.claude/file_khoa.txt`.
 */

/** Dung bang do liet ke cac sprite ma atlas khong co. Rong thi khong dung gi ca. */
export function baoThieuHinh(chaMe: HTMLElement, thieu: readonly string[]): void {
  if (thieu.length === 0) return;
  const goc: HTMLDivElement = document.createElement('div');
  goc.style.cssText = [
    'position:absolute', 'left:8px', 'right:8px', 'top:8px', 'z-index:6',
    'background:rgba(120,20,14,0.95)', 'color:#fff', 'border:1px solid #e0857a',
    'border-radius:8px', 'padding:8px 10px', 'font-size:12px', 'line-height:1.35',
  ].join(';');
  goc.innerHTML = `<b>ATLAS CŨ — thiếu ${String(thieu.length)} hình.</b>`
    + ' Đóng hẳn trang rồi mở lại. Vẫn báo thì gửi ảnh này.<br>'
    + thieu.slice(0, 12).join(' · ') + (thieu.length > 12 ? ' …' : '');
  chaMe.appendChild(goc);
}
