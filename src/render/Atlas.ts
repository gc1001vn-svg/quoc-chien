/**
 * Nap va nha atlas sprite da nuong o Phase 1.
 *
 * Mot bo atlas gom mot file JSON (toa do tung o sprite) va mot hay nhieu trang PNG.
 * Nap JSON TRUOC, vi so trang quyet dinh shader cua `Gl` (xem `Shader.ts`) - phai biet
 * so trang roi moi dung duoc bo ve.
 *
 * Chon co theo man hinh: may Retina (`min(dpr, 2) >= 2`) dung bo 2x cho net, may thuong
 * dung 1x cho nhe. Chi nap MOT bo, khong giu ca hai - TECH_SPEC muc 2: "doi thoi dai thi
 * nha atlas cu", khong giu lai phong khi can.
 */
import { assetUrl } from '../core/AssetPath';
import type { Gl } from './Gl';

/** Mot o sprite trong atlas. `ox`/`oy` la diem neo: goc o luoi nam o dau trong anh. */
export interface OSprite {
  readonly trang: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly ox: number;
  readonly oy: number;
}

/** Noi dung file JSON cua mot bo atlas. */
export interface BoAtlas {
  /** Canh mot trang atlas, tinh bang diem anh. */
  readonly canh: number;
  /** He so co: 1 hay 2. */
  readonly heSo: number;
  /** Be ngang mot o nen, tinh bang diem anh. O nen cao bang nua so nay (chieu 2:1). */
  readonly o_px: number;
  readonly trang: readonly string[];
  readonly sprite: Readonly<Record<string, OSprite>>;
}

/** Sprite tran ra bao xa khoi diem neo, ve bon phia. Dung de noi khung khi cat bot. */
export interface BienDo {
  readonly trai: number;
  readonly tren: number;
  readonly phai: number;
  readonly duoi: number;
}

/** Ten bo atlas hop voi man hinh nay: `1x` hay `2x`. */
export function coTheoDpr(dpr: number): '1x' | '2x' {
  return Math.min(dpr, 2) >= 2 ? '2x' : '1x';
}

/** Tai file JSON cua mot bo atlas, vi du `trung_co` co `2x`. */
export async function taiBoAtlas(me: string, co: '1x' | '2x'): Promise<BoAtlas> {
  const duong: string = assetUrl(`atlas/${me}_${co}.json`);
  const traLoi: Response = await fetch(duong);
  if (!traLoi.ok) throw new Error(`Khong tai duoc ${duong}: ${String(traLoi.status)}`);
  return docBoAtlas(await traLoi.json());
}

/** Doc va kiem tra JSON atlas. Sai khuon thi bao loi ngay, dung de game ve ra rac. */
export function docBoAtlas(tho: unknown): BoAtlas {
  if (typeof tho !== 'object' || tho === null) throw new Error('JSON atlas khong phai doi tuong');
  const o = tho as Record<string, unknown>;
  const canh: number = soDuong(o['canh'], 'canh');
  const trang: unknown = o['trang'];
  if (!Array.isArray(trang) || trang.length === 0) throw new Error('JSON atlas thieu `trang`');
  const sprite: unknown = o['sprite'];
  if (typeof sprite !== 'object' || sprite === null) throw new Error('JSON atlas thieu `sprite`');

  const bang: Record<string, OSprite> = {};
  for (const [ten, giaTri] of Object.entries(sprite as Record<string, unknown>)) {
    bang[ten] = docOSprite(ten, giaTri, trang.length);
  }
  return {
    canh,
    heSo: soDuong(o['heSo'], 'heSo'),
    o_px: soDuong(o['o_px'], 'o_px'),
    trang: trang.map((t, i) => {
      if (typeof t !== 'string') throw new Error(`Trang atlas thu ${String(i)} khong phai ten file`);
      return t;
    }),
    sprite: bang,
  };
}

/** Bo atlas da nap len GPU, san sang ve. */
export class Atlas {
  private readonly bo: BoAtlas;
  private readonly texs: readonly WebGLTexture[];
  private readonly bien: BienDo;

  constructor(bo: BoAtlas, texs: readonly WebGLTexture[]) {
    this.bo = bo;
    this.texs = texs;
    this.bien = doBienDo(bo);
  }

  /** Be ngang mot o nen, tinh bang diem anh cua atlas. */
  public oPx(): number {
    return this.bo.o_px;
  }

  /** He so co cua bo dang dung: 1 hay 2. */
  public heSo(): number {
    return this.bo.heSo;
  }

  public soTrang(): number {
    return this.bo.trang.length;
  }

  public cacTrang(): readonly WebGLTexture[] {
    return this.texs;
  }

  /** Sprite tran ra bao xa khoi diem neo. Dung noi khung truoc khi cat bot o. */
  public bienDo(): BienDo {
    return this.bien;
  }

  /** Co sprite ten nay khong. */
  public co(ten: string): boolean {
    return this.bo.sprite[ten] !== undefined;
  }

  /**
   * Nhung ten trong `can` ma atlas khong co.
   *
   * Goi mot lan luc mo man. Atlas lech ban voi code la loi da tai dien hai lan va ca hai
   * lan deu cam nhu hen - `datSprite` bo qua ten la khong ke gi. Doi chieu truoc cho no
   * thanh mot dong chu do tren man.
   */
  public thieu(can: Iterable<string>): string[] {
    const ra: string[] = [];
    for (const ten of can) if (!this.co(ten)) ra.push(ten);
    return ra;
  }

  /** Tra o sprite theo ten. Khong co thi bao loi - ten sai la loi lap trinh, khong am tham. */
  public o(ten: string): OSprite {
    const s: OSprite | undefined = this.bo.sprite[ten];
    if (s === undefined) throw new Error(`Atlas khong co sprite ten "${ten}"`);
    return s;
  }

  /** Toa do trong atlas, 0..1, theo thu tu `u0 v0 u1 v1`. */
  public uv(s: OSprite): readonly [number, number, number, number] {
    const c: number = this.bo.canh;
    return [s.x / c, s.y / c, (s.x + s.w) / c, (s.y + s.h) / c];
  }

  /** Tra bo nho GPU cua ca bo. Goi khi doi thoi dai. */
  public nha(gl: Gl): void {
    for (const t of this.texs) gl.xoaAtlas(t);
  }
}

/** Tai cac trang PNG cua mot bo atlas roi nap len GPU. */
export async function napTrangLenGpu(bo: BoAtlas, gl: Gl): Promise<WebGLTexture[]> {
  const anh: HTMLImageElement[] = await Promise.all(
    bo.trang.map(async (ten) => taiAnh(assetUrl(`atlas/${ten}`))),
  );
  return anh.map((a) => gl.napAtlas(a));
}

/** Tai mot anh, cho giai ma xong moi tra ve. */
async function taiAnh(duong: string): Promise<HTMLImageElement> {
  const anh: HTMLImageElement = new Image();
  anh.src = duong;
  await anh.decode();
  return anh;
}

/** Sprite tran xa nhat ve moi phia, tinh tu diem neo. */
function doBienDo(bo: BoAtlas): BienDo {
  let trai = 0;
  let tren = 0;
  let phai = 0;
  let duoi = 0;
  for (const s of Object.values(bo.sprite)) {
    if (s.ox > trai) trai = s.ox;
    if (s.oy > tren) tren = s.oy;
    if (s.w - s.ox > phai) phai = s.w - s.ox;
    if (s.h - s.oy > duoi) duoi = s.h - s.oy;
  }
  return { trai, tren, phai, duoi };
}

function docOSprite(ten: string, tho: unknown, soTrang: number): OSprite {
  if (typeof tho !== 'object' || tho === null) throw new Error(`Sprite "${ten}" khong phai doi tuong`);
  const o = tho as Record<string, unknown>;
  const trang: number = soNguyen(o['trang'], `${ten}.trang`);
  if (trang < 0 || trang >= soTrang) throw new Error(`Sprite "${ten}" tro toi trang khong co`);
  return {
    trang,
    x: soNguyen(o['x'], `${ten}.x`),
    y: soNguyen(o['y'], `${ten}.y`),
    w: soDuong(o['w'], `${ten}.w`),
    h: soDuong(o['h'], `${ten}.h`),
    ox: soNguyen(o['ox'], `${ten}.ox`),
    oy: soNguyen(o['oy'], `${ten}.oy`),
  };
}

function soNguyen(v: unknown, cho: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`JSON atlas: ${cho} khong phai so`);
  return v;
}

function soDuong(v: unknown, cho: string): number {
  const n: number = soNguyen(v, cho);
  if (n <= 0) throw new Error(`JSON atlas: ${cho} phai lon hon 0`);
  return n;
}
