/**
 * Ma shader cua bo ve, sinh theo SO TRANG ATLAS THAT.
 *
 * VI SAO SINH RA CHU KHONG VIET CUNG: atlas 2x cua me trung co co hai trang, va lop vat
 * the trai ca hai. Neu xa lo moi lan doi texture thi mot khung hinh ton hang chuc lenh ve,
 * vuot tran 4 cua TECH_SPEC muc 2. Cach go la nap ca hai trang len GPU cung luc, moi sprite
 * mang theo so hieu trang cua no, shader chon anh theo so do -> ca lop chi mot lenh ve.
 *
 * Cai gia phai tra la moi diem anh co the phai doc nhieu anh (GPU di dong thuong chay het
 * moi nhanh cua `if`). Nen so nhanh phai dung bang so trang that: mot trang thi ma sinh ra
 * y het ban mot texture cu, khong ton them gi.
 *
 * GLSL ES 1.0 CAM tra cuu mang sampler bang chi so thay doi duoc (`u_atlas[i]` voi `i` la
 * bien) - do la ly do phai trai thanh chuoi `if`, khong phai vi luoi.
 */

/** Tran trang atlas cung luc trong bo nho, TECH_SPEC muc 2. */
export const SO_TRANG_TOI_DA = 4;

/** Ten uniform cua trang thu `i`. Ben `Gl` xin vi tri uniform bang dung ten nay. */
export function tenUniformTrang(i: number): string {
  return `u_atlas${String(i)}`;
}

/** Shader dinh: doi toa do diem anh sang toa do cat, chuyen tiep uv va so hieu trang. */
export const MA_DINH = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute float a_trang;
uniform vec2 u_res;
varying vec2 v_uv;
varying float v_trang;
void main() {
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
  v_trang = a_trang;
}`;

/**
 * Shader manh cho dung `soTrang` trang.
 *
 * @param soTrang So trang atlas nap cung luc, 1..{@link SO_TRANG_TOI_DA}.
 */
export function maManh(soTrang: number): string {
  const so: number = Math.min(Math.max(Math.trunc(soTrang), 1), SO_TRANG_TOI_DA);
  const khai: string = Array.from(
    { length: so },
    (_, i) => `uniform sampler2D ${tenUniformTrang(i)};`,
  ).join('\n');
  // Trang cuoi la nhanh mac dinh, nen chi can `so - 1` cau `if`.
  const chon: string = Array.from({ length: so - 1 }, (_, i) =>
    `  if (v_trang < ${String(i)}.5) return texture2D(${tenUniformTrang(i)}, v_uv);`,
  ).join('\n');
  return `
precision mediump float;
${khai}
varying vec2 v_uv;
varying float v_trang;
vec4 layMau() {
${chon}
  return texture2D(${tenUniformTrang(so - 1)}, v_uv);
}
void main() {
  vec4 c = layMau();
  if (c.a < 0.01) discard;
  gl_FragColor = c;
}`;
}
