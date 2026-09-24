/**
 * Phan tinh cua bang chinh so - khong dung DOM, test duoc bang vitest.
 *
 * Vi sao co: chinh mot con so (toc do, nhip) tung bi di nhieu vong "sua -> day -> chup ->
 * sua lai". Bang nay cho chu du an keo thu ngay tren iPhone, chot mot lan, roi `Chep so`
 * gui lai - tro ly chi ghi so da chot vao `data/*.json`.
 *
 * Luat 2 van giu: so goc nam o `data/`, gioi han thanh keo nam o `data/bang_chinh.json`.
 * So chinh chi la lop phu tam trong trinh duyet.
 */

export interface Num {
  tep: string;
  truong: string;
  nhan: string;
  min: number;
  max: number;
  buoc: number;
}

/** Cac file data ma bang duoc phep phu, theo ten khong duoi. */
export type BoTep = Record<string, Record<string, unknown>>;

/** So phu, khoa dang `tep.truong`. */
export type SoPhu = Record<string, number>;

export function khoa(n: Num): string {
  return `${n.tep}.${n.truong}`;
}

/** Doc chuoi da luu. Hong, rong, sai dang deu ra `{}` - chi giu cap khoa -> so. */
export function docSoPhu(tho: string | null): SoPhu {
  if (tho === null || tho === '') return {};
  let j: unknown;
  try {
    j = JSON.parse(tho);
  } catch { /* chuoi luu hong (vd sua tay trong DevTools) thi coi nhu chua chinh gi */
    return {};
  }
  if (typeof j !== 'object' || j === null || Array.isArray(j)) return {};
  const ra: SoPhu = {};
  for (const [k, v] of Object.entries(j)) {
    if (typeof v === 'number' && Number.isFinite(v)) ra[k] = v;
  }
  return ra;
}

/** Ghi so goc cua moi num ra, TRUOC khi phu - de `Ve goc` va `Chep so` con so sanh duoc. */
export function laySoGoc(num: readonly Num[], bo: BoTep): SoPhu {
  const ra: SoPhu = {};
  for (const n of num) {
    const v: unknown = bo[n.tep]?.[n.truong];
    if (typeof v !== 'number') {
      throw new Error(`bang_chinh.json tro toi ${khoa(n)} nhung do khong phai so`);
    }
    ra[khoa(n)] = v;
  }
  return ra;
}

/**
 * Phu so len cac file data, tai cho. Tra ve cac khoa DA ap.
 *
 * Bo qua (khong nem loi) khoa khong co trong bang va so ngoai `min..max`: so luu tu ban cu
 * cua bang khong duoc lam hong van choi.
 */
export function apSoPhu(num: readonly Num[], bo: BoTep, phu: SoPhu): string[] {
  const daAp: string[] = [];
  for (const n of num) {
    const v: number | undefined = phu[khoa(n)];
    if (v === undefined || v < n.min || v > n.max) continue;
    const tep: Record<string, unknown> | undefined = bo[n.tep];
    if (tep === undefined) continue;
    tep[n.truong] = v;
    daAp.push(khoa(n));
  }
  return daAp;
}

/** Chi giu so khac goc - luu ca so goc thi dem "dang chay N so chinh" ra sai. */
export function chiKhacGoc(goc: SoPhu, moi: SoPhu): SoPhu {
  const ra: SoPhu = {};
  for (const [k, v] of Object.entries(moi)) {
    if (goc[k] !== v) ra[k] = v;
  }
  return ra;
}

/** Chu de chu du an dan lai cho tro ly: chi dong nao khac goc. */
export function vietChepSo(num: readonly Num[], goc: SoPhu, phu: SoPhu): string {
  const dong: string[] = [];
  for (const n of num) {
    const k: string = khoa(n);
    const v: number | undefined = phu[k];
    const g: number | undefined = goc[k];
    if (v === undefined || g === undefined || v === g) continue;
    dong.push(`data/${n.tep}.json > ${n.truong}: ${String(g)} → ${String(v)}`);
  }
  return dong.length === 0 ? 'Chưa đổi số nào.' : dong.join('\n');
}
