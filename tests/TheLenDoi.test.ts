import { describe, expect, it } from 'vitest';
import canBang from '../data/balance.json';
import { docThoiDai, moTaLenDoi, type Doi } from '../src/sim/meta/ThoiDai';

const ds: Doi[] = docThoiDai(canBang);
const layDoi = (so: number): Doi => ds[so - 1] as Doi;

describe('moTaLenDoi', () => {
  it('dong dau la ten doi moi, dong sau ke so o chinh phu tang them', () => {
    const d = moTaLenDoi(layDoi(1), layDoi(2));
    expect(d[0]).toBe(`Bước sang thời đại ${layDoi(2).hien}`);
    expect(d[1]).toBe(`${String(layDoi(2).soO)} ô chính phủ (+${String(layDoi(2).soO - layDoi(1).soO)})`);
  });

  it('doi me atlas thi bao nha doi kieu; cung me thi khong', () => {
    for (let so = 2; so <= ds.length; so += 1) {
      const d = moTaLenDoi(layDoi(so - 1), layDoi(so));
      expect(d.includes('Nhà cửa đổi kiểu mới')).toBe(layDoi(so).me !== layDoi(so - 1).me);
    }
  });
});

describe('giayTheLenDoi', () => {
  it('co trong balance.json, duong', () => {
    expect(canBang.giayTheLenDoi).toBeGreaterThan(0);
  });
});
