import { describe, expect, it } from 'vitest';
import canBang from '../data/balance.json';
import { docThoiDai, moTaLenDoi, type Doi } from '../src/sim/meta/ThoiDai';

const ds: Doi[] = docThoiDai(canBang);
const layDoi = (so: number): Doi => ds[so - 1] as Doi;

describe('moTaLenDoi', () => {
  it('tieu de la ten doi moi, dong "cu -> moi", dong dau ke so o chinh phu tang them', () => {
    const d = moTaLenDoi(layDoi(1), layDoi(2));
    expect(d.tieuDe).toBe(`Bước sang thời đại ${layDoi(2).hien}`);
    expect(d.tuDen).toBe(`${layDoi(1).hien} → ${layDoi(2).hien}`);
    expect(d.moi[0]).toBe(`${String(layDoi(2).soO)} ô chính phủ (+${String(layDoi(2).soO - layDoi(1).soO)})`);
  });

  it('ke cong nghe moi cua doi; khong co thi khong co dong do', () => {
    expect(moTaLenDoi(layDoi(1), layDoi(2), ['A', 'B']).moi).toContain('2 công nghệ mới: A · B');
    expect(moTaLenDoi(layDoi(1), layDoi(2)).moi.some((c) => c.includes('công nghệ'))).toBe(false);
  });

  it('doi me atlas thi bao nha doi kieu; cung me thi khong', () => {
    for (let so = 2; so <= ds.length; so += 1) {
      const d = moTaLenDoi(layDoi(so - 1), layDoi(so));
      expect(d.moi.includes('Nhà cửa, đường sá, người dân đổi kiểu mới')).toBe(layDoi(so).me !== layDoi(so - 1).me);
    }
  });
});
