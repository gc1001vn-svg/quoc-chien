/**
 * Hang rao NHAT QUAN TAI LIEU.
 *
 * VI SAO CO FILE NAY. Ngay 12/09 ra soat ra muoi mot xung dot, va bon cai trong so do
 * cung mot goc: KHONG MOT TEST NAO KIEM TAI LIEU. Hai muoi bay file trong `tests/`, hai
 * file co nhac `docs/` nhung chi dung lam chuoi thu. Nen so go tay troi tu do qua cac
 * phien va khong ai biet:
 *
 * - Co `npm run tai:tatca` ghi HAI so khac nhau: `CLAUDE.md` ~440 MB, `DAU_PHIEN.md` ~1 GB.
 * - `CLAUDE.md` go tay "1.310 model" NGAY CANH cau cua chinh no: "dung nho so - so go tay
 *   vao tai lieu da sai ba lan".
 * - `DAU_PHIEN.md` go tay "514 model" trong khi that ra la 1310.
 * - `DAU_PHIEN.md` day "may nuong chua doc duoc .glb" trong khi no doc duoc tu 11/09 -
 *   file nay doc MOI DAU PHIEN nen no day sai ngay tu buoc dau, va lam phien sau bo qua
 *   796 model.
 *
 * Luat chung rut ra: SO DO DUOC thi de MAY SINH, dung go tay. Tai lieu luat chi duoc TRO
 * toi noi giu so, khong duoc chep so ve.
 *
 * Chay duoc ma KHONG can `assets_source/` nen CI xanh.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = new URL('..', import.meta.url).pathname;

/** Doc mot file trong repo. */
function doc(duong: string): string {
  return readFileSync(join(GOC, duong), 'utf8');
}

/**
 * Tai lieu LUAT - thu doc de biet phai lam gi. So trong day phai luon dung, nen cam go
 * tay: chi duoc tro toi noi giu so.
 */
const LUAT = ['CLAUDE.md', 'docs/DAU_PHIEN.md', 'docs/NGUON_MO.md'];

/**
 * Hai file MAY SINH ra - `npm run kho` va `npm run kho:chung`. Day la noi duy nhat duoc
 * giu so model, vi so o day dem tu dia chu khong ai go.
 */
const MAY_SINH = ['docs/KHO_ASSET.md', 'docs/KHO_CHUNG.md'];

describe('so model chi duoc nam o file may sinh', () => {
  /**
   * Hai lop, vi khong phai so model nao cung la so kiem ke kho.
   *
   * Cam: so KIEM KE - tong cua ca kho, doi moi lan tai them goi. Do la thu troi.
   * Cho: so DAC TA MOT GOI - "135 model cong trinh" cua `city-builder-bits` la thuoc tinh
   * cua goi do, no khong doi, va no la thu can biet khi chon nguon.
   *
   * Lop 1 bat theo CO SO: tu 1.000 tro len thi chac chan la kiem ke ca kho, khong goi le
   * nao to the. Lop 2 bat theo CACH NOI dac trung cua kiem ke, o moi co so.
   *
   * Con lot: mot so kiem ke DUOI 1.000 dien dat bang cach noi khac han (vi du "514 model"
   * tran). Chua bit duoc bang may - doi lay viec khong chan nham dac ta goi.
   */
  const CO_KIEM_KE = /\b(?:\d{1,3}\.\d{3}|\d{4,})\s*model/gi;
  const CACH_NOI_KIEM_KE = /\b[\d.]+\s*model\s*(?:dùng được|máy nướng đọc được|đã tải về)/gi;

  it.each(LUAT)('%s khong go tay so kiem ke kho', (duong) => {
    const van = doc(duong);
    const trung = [...(van.match(CO_KIEM_KE) ?? []), ...(van.match(CACH_NOI_KIEM_KE) ?? [])];
    expect(trung, `Go tay so kiem ke kho trong ${duong}. Tro toi dong cuoi cua `
      + `${MAY_SINH.join(' hay ')} thay vi chep so ve.`).toEqual([]);
  });

  it('hai file may sinh VAN co so - khong thi hang rao tren thanh vo nghia', () => {
    for (const d of MAY_SINH) {
      expect(doc(d), `${d} mat dong tong ket so model`).toMatch(/\d[\d.]{2,} model/i);
    }
  });
});

describe('co kho tai ve chi duoc ghi o mot noi', () => {
  it('chi mot file luat ghi co cua `tai:tatca`', () => {
    const coGhi = LUAT.filter((d) => doc(d)
      .split('\n')
      .some((dong) => dong.includes('tai:tatca') && /\d+\s*[MG]B/.test(dong)));
    expect(coGhi, 'Co `tai:tatca` phai ghi o DUNG mot cho. Ghi hai cho thi mot cho se '
      + 'lac hau ma khong ai biet - da xay ra: 440 MB va 1 GB.').toEqual(['docs/DAU_PHIEN.md']);
  });
});

describe('duong ra khoi file khoa phai duoc chi', () => {
  // Xung dot nang nhat cua dot 12/09: `CLAUDE.md` bao "sua bang Edit, dung python/sed",
  // ma file khoa thi Edit BI CHAN, va khong cho nao nhac ve duyet. Doc xong la vao ngo
  // cut, roi phien sau lai di vong bang `python3` va tuong minh dang lach le.
  it('CLAUDE.md nhac duong ra `da_duyet.txt`', () => {
    expect(doc('CLAUDE.md'), 'CLAUDE.md phai chi duong ra khi file khoa can sua, '
      + 'khong thi doc xong la vao ngo cut.').toContain('da_duyet.txt');
  });
});

describe('danh sach file khoa phai tro vao file co that', () => {
  // Duong chet trong danh sach khoa hong LANG: hook khong bao gi, chi la khong con bao ve
  // cai gi. Doi ten file ma quen sua danh sach la mat hang rao.
  it('moi duong trong .claude/file_khoa.txt ton tai', () => {
    const chet = doc('.claude/file_khoa.txt')
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d && !d.startsWith('#'))
      .filter((d) => !existsSync(join(GOC, d)));
    expect(chet, 'Duong khoa tro vao cho khong co gi - hang rao mat ma khong bao').toEqual([]);
  });
});

describe('tai lieu khong duoc day sai ve dinh dang may nuong doc duoc', () => {
  // Xung dot thu 11, ra 12/09. `DAU_PHIEN.md` doc MOI DAU PHIEN, nen mot cau sai o day
  // chan ca phien sau: no bao bo qua `.glb`, tuc bo qua 796 model cua kho chung.
  it('may nuong VAN doc duoc `.glb` - khong thi tai lieu phai sua theo', () => {
    expect(doc('tools/nuong_sprite.mjs')).toContain('laGlb');
  });

  // Soi ca hai file doc dau phien. Ban dau chi soi DAU_PHIEN.md, va TIEN_DO.md lo ra ngay
  // sau do: no ket mot doan bang "`.glb` thi van chua doc duoc" NGAY DUOI doan noi
  // "120/120 file .glb doc duoc". Tu mau thuan trong cung mot doan, va van lot qua dot ra
  // 12/09 vi ra bang mat.
  it.each(['docs/DAU_PHIEN.md', 'docs/TIEN_DO.md'])('%s khong noi may nuong bo `.glb`', (duong) => {
    // Bo dong trich dan (`>`): do la cho ghi lai LICH SU - "dong tren tung ghi nguoc lai" -
    // va cam ke lai loi cu thi khong con hoc duoc gi tu no. Chi soi cau dang DAY viec.
    const dangDay = doc(duong)
      .split('\n')
      .filter((d) => !d.trimStart().startsWith('>'))
      .join('\n');
    expect(dangDay, `${duong} day sai: may nuong doc duoc \`.glb\` tu 11/09`)
      .not.toMatch(/ch[uư]a[^.\n]{0,40}`?\.glb`?/i);
  });
});
