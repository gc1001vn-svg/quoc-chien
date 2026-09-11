/**
 * Hang rao cho lop chien dich (Phase 7).
 *
 * Test dat nhat o day la cai cuoi: MOI ten sprite ma ban do tinh sinh ra - nen, vat dia
 * hinh, nha theo mau phe, co hieu - phai co that trong atlas `hex_1`. Go sai mot chu thi
 * o do bien mat khong bao loi gi.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import tinhTho from '../data/provinces.json';
import nuocTho from '../data/nations.json';
import nhaTinhTho from '../data/prov_buildings.json';
import {
  dungBanDoTinh,
  type BanDoTinh,
  type CauHinhBanDoTinh,
  type CauHinhNuoc,
  type Tinh,
} from '../src/sim/campaign/BanDoTinh.ts';
import {
  ChienDich,
  docCongTrinh,
  type CauHinhCongTrinh,
  type CongTrinh,
} from '../src/sim/campaign/ChienDich.ts';
import { cumBay, khoa, khoangCach, tamCum, vanh } from '../src/sim/campaign/Hex.ts';
import { docBoAtlas } from '../src/render/Atlas';

const CAU_HINH: CauHinhBanDoTinh = tinhTho;
const CAU_HINH_NUOC: CauHinhNuoc = nuocTho;
const CAU_HINH_NHA: CauHinhCongTrinh = nhaTinhTho;

describe('toan luoi hex', () => {
  it('vanh co dung sau o, moi o cach tam mot buoc', () => {
    const tam = { q: 2, r: -3 };
    const sau = vanh(tam);
    expect(sau).toHaveLength(6);
    for (const o of sau) expect(khoangCach(tam, o)).toBe(1);
    expect(new Set(sau.map(khoa)).size).toBe(6);
  });

  it('cum bay o gom tam va vanh, khong o nao trung', () => {
    const cum = cumBay({ q: 0, r: 0 });
    expect(cum).toHaveLength(7);
    expect(new Set(cum.map(khoa)).size).toBe(7);
  });

  it('luoi con dinh thuc 7 lat khit: 100 cum khong o nao thuoc hai cum', () => {
    const thay = new Set<string>();
    for (let m = -5; m < 5; m += 1) {
      for (let n = -5; n < 5; n += 1) {
        for (const o of cumBay(tamCum(m, n))) {
          const k = khoa(o);
          expect(thay.has(k)).toBe(false);
          thay.add(k);
        }
      }
    }
    expect(thay.size).toBe(100 * 7);
  });
});

describe('ban do tinh', () => {
  const banDo: BanDoTinh = dungBanDoTinh(CAU_HINH, CAU_HINH_NUOC);

  it('dung 28 tinh, 4 nuoc, 196 hex khong trung', () => {
    expect(banDo.tinh).toHaveLength(28);
    expect(banDo.nuoc).toHaveLength(4);
    expect(banDo.theoHex.size).toBe(28 * 7);
  });

  it('moi tinh 4-6 o xay dung, danh so lien tuc tu 0', () => {
    for (const t of banDo.tinh) {
      expect(t.soOXay).toBeGreaterThanOrEqual(4);
      expect(t.soOXay).toBeLessThanOrEqual(6);
      const so = t.o.filter((o) => o.oXay >= 0).map((o) => o.oXay).sort((a, b) => a - b);
      expect(so).toEqual([...Array(t.soOXay).keys()]);
    }
  });

  it('o thu phu va o xay dung khong bi vat dia hinh che', () => {
    for (const t of banDo.tinh) {
      expect(t.o[0]?.vat).toBe('');
      for (const o of t.o) if (o.oXay >= 0) expect(o.vat).toBe('');
    }
  });

  it('moi nuoc co dung nam tinh va mot thu do, con lai tam tinh trung lap', () => {
    for (const n of banDo.nuoc) {
      const cua = banDo.tinh.filter((t: Tinh) => t.nuoc === n.id);
      expect(cua).toHaveLength(5);
      expect(cua.filter((t) => t.thuDo)).toHaveLength(1);
    }
    expect(banDo.tinh.filter((t) => t.nuoc === '')).toHaveLength(8);
  });

  it('cung hat giong thi ra dung mot ban do', () => {
    const lai: BanDoTinh = dungBanDoTinh(CAU_HINH, CAU_HINH_NUOC);
    expect(lai.tinh.map((t) => t.o.map((o) => `${o.nen}/${o.vat}`).join(','))).toEqual(
      banDo.tinh.map((t) => t.o.map((o) => `${o.nen}/${o.vat}`).join(',')),
    );
  });

  it('moi nuoc co it nhat mot tinh nui - khong thi khong ai xay duoc mo', () => {
    for (const n of banDo.nuoc) {
      expect(banDo.tinh.some((t) => t.nuoc === n.id && t.diaHinh === 'nui')).toBe(true);
    }
  });
});

describe('nhip xay cua lop chien dich', () => {
  const banDo: BanDoTinh = dungBanDoTinh(CAU_HINH, CAU_HINH_NUOC);
  const congTrinh: readonly CongTrinh[] = docCongTrinh(CAU_HINH_NHA);
  const cuaTa = (): Tinh => banDo.tinh.find((t) => t.nuoc === 'hoa_nguyen' && t.diaHinh === 'nui') as Tinh;

  it('xay xong dung sau so luot khai trong JSON', () => {
    const cd = new ChienDich(banDo, congTrinh);
    const t: Tinh = cuaTa();
    const mo: CongTrinh = congTrinh.find((c) => c.id === 'mo') as CongTrinh;
    expect(cd.datLenhXay(t.id, 0, 'mo')).toBe('');
    for (let i = 0; i < mo.luot - 1; i += 1) {
      cd.nhip();
      expect(cd.oCua(t.id, 0).dangXay).toBe('mo');
      expect(cd.oCua(t.id, 0).congTrinh).toBe('');
    }
    cd.nhip();
    expect(cd.oCua(t.id, 0).congTrinh).toBe('mo');
    expect(cd.oCua(t.id, 0).dangXay).toBe('');
  });

  it('khong xay duoc de len o da co chu', () => {
    const cd = new ChienDich(banDo, congTrinh);
    const t: Tinh = cuaTa();
    expect(cd.datLenhXay(t.id, 0, 'lang')).toBe('');
    expect(cd.datLenhXay(t.id, 0, 'lang')).toBe('o-da-co-chu');
  });

  it('mo chi xay duoc o tinh nui, chuong chi xay o dong bang va ven bien', () => {
    const cd = new ChienDich(banDo, congTrinh);
    const dongBang: Tinh = banDo.tinh.find(
      (t) => t.nuoc === 'hoa_nguyen' && t.diaHinh === 'dong_bang',
    ) as Tinh;
    expect(cd.datLenhXay(dongBang.id, 0, 'mo')).toBe('sai-dia-hinh');
    expect(cd.xayDuocGi(dongBang.id).map((c) => c.id)).not.toContain('mo');
    expect(cd.xayDuocGi(cuaTa().id).map((c) => c.id)).toContain('mo');
  });

  it('khong xay duoc tren dat nuoc khac hay tinh trung lap', () => {
    const cd = new ChienDich(banDo, congTrinh);
    const nguoiKhac: Tinh = banDo.tinh.find((t) => t.nuoc === 'luc_khe') as Tinh;
    const trungLap: Tinh = banDo.tinh.find((t) => t.nuoc === '') as Tinh;
    expect(cd.datLenhXay(nguoiKhac.id, 0, 'lang')).toBe('khong-phai-cua-ta');
    expect(cd.datLenhXay(trungLap.id, 0, 'lang')).toBe('khong-phai-cua-ta');
  });

  it('o xay ngoai khoang 0..soOXay-1 bi tu choi', () => {
    const cd = new ChienDich(banDo, congTrinh);
    const t: Tinh = cuaTa();
    expect(cd.datLenhXay(t.id, -1, 'lang')).toBe('khong-co-o');
    expect(cd.datLenhXay(t.id, t.soOXay, 'lang')).toBe('khong-co-o');
  });
});

describe('ten sprite cua ban do tinh', () => {
  const bo = docBoAtlas(JSON.parse(readFileSync('public/atlas/hex_1_1x.json', 'utf8')));
  const banDo: BanDoTinh = dungBanDoTinh(CAU_HINH, CAU_HINH_NUOC);
  const congTrinh: readonly CongTrinh[] = docCongTrinh(CAU_HINH_NHA);

  it('moi sprite nen va vat dia hinh deu co that trong atlas hex_1', () => {
    const thieu: string[] = [];
    for (const t of banDo.tinh) {
      for (const o of t.o) {
        if (!(o.nen in bo.sprite)) thieu.push(o.nen);
        if (o.vat !== '' && !(o.vat in bo.sprite)) thieu.push(o.vat);
      }
    }
    expect([...new Set(thieu)]).toEqual([]);
  });

  it('moi cong trinh co du bon mau phe trong atlas, cong thanh va co hieu', () => {
    const thieu: string[] = [];
    for (const n of banDo.nuoc) {
      for (const c of congTrinh) if (!(`${c.sprite}_${n.mau}` in bo.sprite)) thieu.push(`${c.sprite}_${n.mau}`);
      for (const goc of ['thanh', 'co']) if (!(`${goc}_${n.mau}` in bo.sprite)) thieu.push(`${goc}_${n.mau}`);
    }
    for (const ten of ['ruong', 'dat_trong', 'gian_giao']) if (!(ten in bo.sprite)) thieu.push(ten);
    expect(thieu).toEqual([]);
  });
});
