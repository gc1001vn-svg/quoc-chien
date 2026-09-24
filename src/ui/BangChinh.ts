/**
 * Bang chinh so tren may that - mo bang `?chinh=1`.
 *
 * Chi khi URL co `?chinh=1` so chinh moi duoc ap: link thuong luon chay dung so goc, khong
 * ai choi nham so thu ma khong biet. Ap xong phai TAI LAI trang - so doc mot lan luc dung
 * canh, doi giua van thi mo phong lech voi so tren bang.
 *
 * Phan tinh (doc, phu, viet chu) o `ChinhSo.ts`.
 */
import bangTho from '../../data/bang_chinh.json';
import policyTho from '../../data/policy.json';
import walkersTho from '../../data/walkers.json';
import balanceTho from '../../data/balance.json';
import { apSoPhu, chiKhacGoc, docSoPhu, khoa, laySoGoc, vietChepSo, type BoTep, type Num, type SoPhu } from './ChinhSo';

const KHOA_LUU = 'quoc-chien:chinh';
const NUM: readonly Num[] = bangTho.num;
const BO: BoTep = { policy: policyTho, walkers: walkersTho, balance: balanceTho };
let thongBaoKhongLuu = false;

/** Goi TRUOC khi dung canh. Khong co `?chinh=1` thi khong lam gi. */
export function moBangChinh(goc: HTMLElement): void {
  if (new URLSearchParams(window.location.search).get('chinh') !== '1') return;
  const soGoc: SoPhu = laySoGoc(NUM, BO);
  const phu: SoPhu = docSoPhu(docLuu());
  const daAp: string[] = apSoPhu(NUM, BO, phu);
  veBang(goc, soGoc, phu, daAp.length);
}

function docLuu(): string | null {
  try {
    return window.localStorage.getItem(KHOA_LUU);
  } catch { /* Safari rieng tu / chan luu tru: chay so goc, bang van hien */
    return null;
  }
}

function ghiLuu(phu: SoPhu | null): void {
  try {
    if (phu === null) window.localStorage.removeItem(KHOA_LUU);
    else window.localStorage.setItem(KHOA_LUU, JSON.stringify(phu));
  } catch { /* khong luu duoc thi tai lai se ve so goc - chu tren bang bao dieu do */
    thongBaoKhongLuu = true;
  }
}

function veBang(goc: HTMLElement, soGoc: SoPhu, phu: SoPhu, soDaAp: number): void {
  const bang: HTMLElement = document.createElement('section');
  bang.className = 'bang-chinh';
  const tieuDe: HTMLHeadingElement = document.createElement('h2');
  tieuDe.textContent = soDaAp > 0 ? `Chỉnh số · đang chạy ${String(soDaAp)} số chỉnh` : 'Chỉnh số';
  bang.appendChild(tieuDe);

  const moi: SoPhu = { ...soGoc, ...phu };
  for (const n of NUM) {
    const k: string = khoa(n);
    const hang: HTMLLabelElement = document.createElement('label');
    const chu: HTMLSpanElement = document.createElement('span');
    const so: HTMLOutputElement = document.createElement('output');
    const keo: HTMLInputElement = document.createElement('input');
    keo.type = 'range';
    keo.min = String(n.min);
    keo.max = String(n.max);
    keo.step = String(n.buoc);
    keo.value = String(moi[k]);
    const veSo = (): void => {
      so.textContent = `${keo.value} (gốc ${String(soGoc[k])})`;
    };
    keo.addEventListener('input', () => {
      moi[k] = Number(keo.value);
      veSo();
    });
    chu.textContent = n.nhan;
    veSo();
    hang.append(chu, keo, so);
    bang.appendChild(hang);
  }

  const chep: HTMLTextAreaElement = document.createElement('textarea');
  chep.readOnly = true;
  chep.hidden = true;
  const hangNut: HTMLDivElement = document.createElement('div');
  hangNut.className = 'bang-chinh-nut';
  nut(hangNut, 'Áp dụng', () => {
    ghiLuu(chiKhacGoc(soGoc, moi));
    if (!thongBaoKhongLuu) window.location.reload();
    else tieuDe.textContent = 'Máy chặn lưu — không áp được';
  });
  nut(hangNut, 'Về gốc', () => {
    ghiLuu(null);
    window.location.reload();
  });
  nut(hangNut, 'Chép số', () => {
    chep.value = vietChepSo(NUM, soGoc, moi);
    chep.hidden = false;
    chep.select();
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(chep.value).catch(() => { /* iOS doi cu cham; o chu da hien san de tu chep */ });
    }
  });
  nut(hangNut, 'Ẩn', () => { bang.hidden = true; });
  bang.append(hangNut, chep);
  goc.appendChild(bang);
}

function nut(cha: HTMLElement, chu: string, bam: () => void): void {
  const b: HTMLButtonElement = document.createElement('button');
  b.type = 'button';
  b.textContent = chu;
  b.addEventListener('click', bam);
  cha.appendChild(b);
}
