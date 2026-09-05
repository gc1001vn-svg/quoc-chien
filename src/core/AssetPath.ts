/**
 * Ghep duong dan tai nguyen theo duong dan goc cua trang.
 *
 * Duong dan goc do MOT hang so `BASE` trong `vite.config.ts` quyet dinh. Doi noi phuc vu
 * trang thi chi sua dong do. Vi vay TUYET DOI khong duoc viet cung `'/assets/...'` hay
 * `'/icons/...'` o bat cu dau trong code hoac CSS - moi duong dan phai di qua `assetUrl`.
 *
 * Sai cho nay la PWA mo ra trang trang. `npm run check:base` doi chieu lai sau khi build.
 */

/** Ghep `base` voi duong dan tuong doi, khong bao gio sinh ra hai dau gach cheo. */
export function joinBase(base: string, relativePath: string): string {
  const cleanBase: string = base.endsWith('/') ? base : `${base}/`;
  const cleanPath: string = relativePath.replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
}

/** Duong dan day du toi mot file trong thu muc `public/`. */
export function assetUrl(relativePath: string): string {
  return joinBase(import.meta.env.BASE_URL, relativePath);
}
