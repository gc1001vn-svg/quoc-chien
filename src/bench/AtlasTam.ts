/**
 * Atlas gia de do hieu nang truoc khi co atlas that.
 *
 * Phase 1 moi nuong sprite that tu model 3D. Truoc do van phai do duoc tran sprite, nen
 * dung mot atlas ve bang Canvas 2D ngay luc chay: bon o 128x128 mo phong nha cua nhin
 * cheo, co vung trong suot va vien mem giong sprite that. Do la de biet GPU chiu duoc bao
 * nhieu sprite, khong phai de nhin cho dep.
 */

/** Canh atlas gia, tinh bang diem anh. Bon o 128x128 xep 2x2. */
const CANH = 256;
/** Canh mot o trong atlas. Bang co "nha nho" cua TECH_SPEC muc 3. */
export const CANH_O = 128;
/** So o trong atlas gia. */
export const SO_O = 4;

const MAU: readonly string[] = ['#b4884f', '#8a9a5b', '#9c6b4f', '#6f7f8f'];

/** Ve atlas gia va tra ve canvas dung lam texture. */
export function veAtlasTam(): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = CANH;
  canvas.height = CANH;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (ctx === null) throw new Error('Khong mo duoc Canvas 2D de ve atlas tam');

  for (let i = 0; i < SO_O; i += 1) {
    const ox: number = (i % 2) * CANH_O;
    const oy: number = Math.floor(i / 2) * CANH_O;
    veMotO(ctx, ox, oy, MAU[i] ?? '#888888');
  }
  return canvas;
}

/** Toa do trong atlas (0..1) cua o thu `chiSo`. */
export function toaDoO(chiSo: number): readonly [number, number, number, number] {
  const i: number = chiSo % SO_O;
  const u0: number = ((i % 2) * CANH_O) / CANH;
  const v0: number = (Math.floor(i / 2) * CANH_O) / CANH;
  return [u0, v0, u0 + CANH_O / CANH, v0 + CANH_O / CANH];
}

/** Mot khoi nha nhin cheo: mai, hai mat tuong, bong do. Quanh no la vung trong suot. */
function veMotO(ctx: CanvasRenderingContext2D, ox: number, oy: number, mau: string): void {
  const g: number = CANH_O / 8;

  // Bong do duoi chan, mo dan.
  const bong: CanvasGradient = ctx.createRadialGradient(
    ox + CANH_O / 2, oy + CANH_O - g, 0, ox + CANH_O / 2, oy + CANH_O - g, CANH_O / 2,
  );
  bong.addColorStop(0, 'rgba(0,0,0,0.45)');
  bong.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bong;
  ctx.fillRect(ox, oy + CANH_O / 2, CANH_O, CANH_O / 2);

  // Mat tuong trai va phai, hai do sang khac nhau.
  ctx.fillStyle = mau;
  ctx.beginPath();
  ctx.moveTo(ox + g, oy + 3 * g);
  ctx.lineTo(ox + 4 * g, oy + 4.5 * g);
  ctx.lineTo(ox + 4 * g, oy + 7 * g);
  ctx.lineTo(ox + g, oy + 5.5 * g);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = toiDi(mau);
  ctx.beginPath();
  ctx.moveTo(ox + 7 * g, oy + 3 * g);
  ctx.lineTo(ox + 4 * g, oy + 4.5 * g);
  ctx.lineTo(ox + 4 * g, oy + 7 * g);
  ctx.lineTo(ox + 7 * g, oy + 5.5 * g);
  ctx.closePath();
  ctx.fill();

  // Mai.
  ctx.fillStyle = '#5a3d2b';
  ctx.beginPath();
  ctx.moveTo(ox + 4 * g, oy + g);
  ctx.lineTo(ox + 7 * g, oy + 3 * g);
  ctx.lineTo(ox + 4 * g, oy + 4.5 * g);
  ctx.lineTo(ox + g, oy + 3 * g);
  ctx.closePath();
  ctx.fill();
}

/** Lam toi mot mau `#rrggbb` di 35% de phan biet hai mat tuong. */
function toiDi(mau: string): string {
  const so: number = Number.parseInt(mau.slice(1), 16);
  const r: number = Math.round(((so >> 16) & 255) * 0.65);
  const g: number = Math.round(((so >> 8) & 255) * 0.65);
  const b: number = Math.round((so & 255) * 0.65);
  return `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
}
