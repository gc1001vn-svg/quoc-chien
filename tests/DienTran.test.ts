import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chonHuong, oDoiHinh, timKhung, DienTran, type CauHinhDien, type LinhVe } from '../src/render/DienTran';
import { docDuLieuTran, tinhTran, type DauVaoTran, type DuLieuTran, type KetQuaTran, type KhungVet } from '../src/sim/campaign/Battle';

describe('DienTran - chonHuong', () => {
  it('chon huong dung cho cac vector co ban', () => {
    // (0,1) -> 0, (1,0) -> 2 with 8 directions, (0,-1) -> 4, (-1,0) -> 6, (0,0) -> -1
    expect(chonHuong(0, 1, 8)).toBe(0);
    expect(chonHuong(1, 0, 8)).toBe(2);
    expect(chonHuong(0, -1, 8)).toBe(4);
    expect(chonHuong(-1, 0, 8)).toBe(6);
    expect(chonHuong(0, 0, 8)).toBe(-1);

    // Assert boundaries for the conditions: >= and >
    expect(chonHuong(0, 1, 8)).toBeGreaterThanOrEqual(0);
    expect(chonHuong(0, 1, 8)).not.toBeGreaterThan(0);
  });

  it('tra ve ket qua luon nam trong khoang 0 den soHuong-1 cho cac vector ngau nhien', () => {
    const soHuong = 8;
    for (let i = 0; i < 100; i++) {
      const da = Math.random() * 20 - 10;
      const db = Math.random() * 20 - 10;
      if (da === 0 && db === 0) continue;
      const h = chonHuong(da, db, soHuong);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(soHuong);
    }
  });

  it('xu ly dau vao khong hop le', () => {
    // Missing input, wrong type, etc.
    expect(chonHuong(undefined as unknown as number, 1, 8)).toBeNaN();
    // In JS Math.atan2(1, null) -> atan2(1, 0) = PI/2. round(PI/2 / (2PI/8)) = 2
    expect(chonHuong(1, null as unknown as number, 8)).toBe(2);
    expect(chonHuong(NaN, NaN, 8)).toBeNaN();
  });
});

describe('DienTran - oDoiHinh', () => {
  it('cac o co vi tri phan biet va khoang cach dung', () => {
    const cot = 4;
    const khoang = 0.5;

    for (let n = 1; n <= 12; n++) {
      const positions: {da: number, db: number}[] = [];

      for (let i = 0; i < n; i++) {
        const p = oDoiHinh(i, n, cot, khoang);

        // Assert positions are distinct
        for (const prev of positions) {
          expect(p.da !== prev.da || p.db !== prev.db).toBe(true);
        }

        // Check adjacent in a row (if not first in row)
        if (i % cot !== 0) {
          const prev = positions[i - 1];
          if (prev !== undefined) {
            // Since db goes along the row, distance between adjacent in row is exactly khoang
            expect(Math.abs(p.db - prev.db)).toBeCloseTo(khoang);
            expect(Math.abs(p.db - prev.db)).toBeGreaterThanOrEqual(khoang);
            expect(Math.abs(p.db - prev.db)).not.toBeGreaterThan(khoang + 1e-9);
          }
        }

        positions.push(p);
      }
    }
  });

  it('moi hang can giua rieng, cac hang doi xung quanh 0 theo truc a', () => {
    // Jules (25/09) bat dung: trong tam CA doi khong nam o 0 khi hang cuoi thieu nguoi - vi
    // moi hang can giua theo hinh hoc, khong theo khoi luong. Do la y do; de bai cu sai.
    for (let n = 1; n <= 12; n++) {
      const ds = Array.from({ length: n }, (_, i) => oDoiHinh(i, n, 4, 0.5));
      const hang = [...new Set(ds.map((p) => p.da))].sort((x, y) => x - y);
      for (const h of hang) {
        const trong = ds.filter((p) => p.da === h);
        expect(Math.abs(trong.reduce((s, p) => s + p.db, 0) / trong.length)).toBeLessThan(1e-9);
      }
      expect(Math.abs((hang[0] ?? 0) + (hang.at(-1) ?? 0))).toBeLessThan(1e-9);
    }
  });

  it('xu ly dau vao khong hop le cho oDoiHinh', () => {
    // Missing input, wrong type, etc.
    const p1 = oDoiHinh(-1, 5, 4, 0.5);
    expect(p1.da).toBeDefined();
    expect(p1.db).toBeDefined();

    const p2 = oDoiHinh(0, 0, 4, 0.5);
    expect(p2.da).toBeNaN(); // since soHang = 0, hang = Infinity or NaN, etc.

    const p3 = oDoiHinh(0, 1, 0, 0.5);
    expect(p3.da).toBeNaN(); // division by zero when soCot = 0
  });
});

describe('DienTran - timKhung', () => {
  const vet: KhungVet[] = [
    { giay: 10, a: [], b: [] },
    { giay: 20, a: [], b: [] },
    { giay: 30, a: [], b: [] },
  ];

  it('tra ve f=0 neu o truoc khung dau tien', () => {
    const res = timKhung(vet, 5);
    expect(res.i).toBe(0);
    expect(res.f).toBe(0);

    const res2 = timKhung(vet, 9.9);
    expect(res2.i).toBe(0);
    expect(res2.f).toBe(0);
  });

  it('tra ve f=0 va i dung vi tri neu dung tren mot khung', () => {
    const res = timKhung(vet, 10);
    expect(res.i).toBe(0);
    expect(res.f).toBe(0);

    // Assert boundaries
    expect(res.i).toBeGreaterThanOrEqual(0);
    expect(res.i).not.toBeGreaterThan(0);

    const res2 = timKhung(vet, 20);
    expect(res2.i).toBe(1);
    expect(res2.f).toBe(0);

    const res3 = timKhung(vet, 30);
    expect(res3.i).toBe(2);
    expect(res3.f).toBe(0);
  });

  it('tra ve f hop le neu o giua hai khung', () => {
    const res = timKhung(vet, 15);
    expect(res.i).toBe(0);
    expect(res.f).toBe(0.5);

    // Boundary check for f
    expect(res.f).toBeGreaterThanOrEqual(0.5);
    expect(res.f).not.toBeGreaterThan(0.5);

    const res2 = timKhung(vet, 22.5);
    expect(res2.i).toBe(1);
    expect(res2.f).toBe(0.25);
  });

  it('tra ve i cuoi cung va f=0 neu o sau khung cuoi', () => {
    const res = timKhung(vet, 35);
    expect(res.i).toBe(2);
    expect(res.f).toBe(0);
  });

  it('nem loi neu vet rong hoac xu ly dau vao khong hop le', () => {
    expect(() => timKhung([], 10)).toThrow('vet rong: tinhTran luon ghi it nhat mot khung');

    const vetSaiGiay = [
      { giay: 10, a: [], b: [] },
      { giay: 10, a: [], b: [] },
    ];
    const res = timKhung(vetSaiGiay, 15);
    expect(res.i).toBe(1);
    expect(res.f).toBe(0);
  });
});

function doc(ten: string): unknown {
  return JSON.parse(readFileSync(new URL(`../data/${ten}`, import.meta.url), 'utf8')) as unknown;
}

describe('DienTran - linhLuc', () => {
  const bData = doc('battle.json') as { nhieu: number; tran_giay: number };
  const duLieu: DuLieuTran = docDuLieuTran(doc('armor_table.json'), doc('units.json'), bData);
  const cauHinhDien = doc('dien_tran.json') as CauHinhDien & { tran_mau: { a: string[], tuong_a: number, b: string[], tuong_b: number, dia_hinh: string, hat_giong: number } };
  const tMau = cauHinhDien.tran_mau;
  const can: DauVaoTran = {
    a: { doi: tMau.a, tuong: tMau.tuong_a },
    b: { doi: tMau.b, tuong: tMau.tuong_b },
    diaHinh: tMau.dia_hinh
  };
  const kq: KetQuaTran = tinhTran(can, duLieu, tMau.hat_giong);
  const atlas = JSON.parse(readFileSync(new URL('../public/atlas/linh_co_2x.json', import.meta.url), 'utf8')) as { sprite: Record<string, unknown> };

  it('tai t=0 so luong sprite phai bang tong linh hai ben va dung dinh dang ten', () => {
    const dt = new DienTran(kq, can, cauHinhDien);
    const sprites: LinhVe[] = dt.linhLuc(0);

    expect(sprites.length).toBe(kq.linhA + kq.linhB);
    // Boundaries
    expect(sprites.length).toBeGreaterThanOrEqual(kq.linhA + kq.linhB);
    expect(sprites.length).not.toBeGreaterThan(kq.linhA + kq.linhB);

    const regex = /^[a-z_]+_(di|danh|trung|chet)_h[0-7]_k[0-3]$/;
    for (const sprite of sprites) {
      expect(regex.test(sprite.ten)).toBe(true);
      expect(sprite.a).toBeDefined();
      expect(sprite.b).toBeDefined();
      expect(['a', 'b'].includes(sprite.ben)).toBe(true);
    }
  });

  it('moi ten sprite duoc tao ra trong toan bo tran deu ton tai trong atlas', () => {
    const dt = new DienTran(kq, can, cauHinhDien);
    const giayKetThuc = dt.giayKetThuc();

    for (let t = 0; t <= giayKetThuc + 3; t += 0.25) {
      const sprites = dt.linhLuc(t);
      for (const sprite of sprites) {
        expect(atlas.sprite[sprite.ten]).toBeDefined();
      }
    }
  });

  it('so luong sprite _chet_ tai giayKetThuc bang chetA + chetB va sprite sap xep theo xac chet roi den song', () => {
    const dt = new DienTran(kq, can, cauHinhDien);
    const giayKetThuc = dt.giayKetThuc();
    const sprites = dt.linhLuc(giayKetThuc);

    let chetCount = 0;
    let foundSong = false;

    for (let i = 0; i < sprites.length; i++) {
      const sprite = sprites[i];
      if (sprite !== undefined) {
        if (sprite.ten.includes('_chet_')) {
          chetCount++;
          expect(foundSong).toBe(false); // No living unit should appear before a dead one
        } else {
          foundSong = true;
          if (i > 0 && sprites[i - 1] !== undefined && !(sprites[i - 1] as LinhVe).ten.includes('_chet_')) {
            // Living units are sorted by a + b ascending
            const prev = sprites[i - 1] as LinhVe;
            expect(sprite.a + sprite.b).toBeGreaterThanOrEqual(prev.a + prev.b);
          }
        }
      }
    }

    expect(chetCount).toBe(kq.chetA + kq.chetB);
    expect(chetCount).toBeGreaterThanOrEqual(kq.chetA + kq.chetB);
    expect(chetCount).not.toBeGreaterThan(kq.chetA + kq.chetB);
  });

  it('tra ve ket qua giong nhau cho cung mot dau vao', () => {
    const dt1 = new DienTran(kq, can, cauHinhDien);
    const dt2 = new DienTran(kq, can, cauHinhDien);

    const t = kq.giayKetThuc / 2;
    const sprites1 = dt1.linhLuc(t);
    const sprites2 = dt2.linhLuc(t);

    expect(sprites1).toEqual(sprites2);
  });

  // Hai test duoi do Claude them sau khi cai loi thu (25/09): lech gio chet 1 giay va khung
  // hoat anh dung yen deu lot bo test tren.
  it('o moi khung vet, so xac dung bang so linh da mat tinh tu vet', () => {
    const dt = new DienTran(kq, can, cauHinhDien);
    const dau = kq.vet[0];
    for (const k of kq.vet) {
      const mat = (['a', 'b'] as const).reduce((s, b) => s + k[b].reduce((t, p, i) => t + (dau?.[b][i]?.conSong ?? 0) - p.conSong, 0), 0);
      expect(dt.linhLuc(k.giay).filter((l) => l.ten.includes('_chet_')).length).toBe(mat);
    }
  });

  it('linh dang di doi khung k0 <-> k1 theo khung_moi_giay', () => {
    const dt = new DienTran(kq, can, cauHinhDien);
    const buoc = 1 / cauHinhDien.khung_moi_giay;
    const ten0 = dt.linhLuc(0).map((l) => l.ten);
    const ten1 = dt.linhLuc(buoc).map((l) => l.ten);
    expect(ten0.some((t, i) => t.endsWith('_k0') && ten1[i]?.endsWith('_k1'))).toBe(true);
  });
});
