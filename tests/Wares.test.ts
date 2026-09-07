/**
 * Hang rao cho kho chung.
 *
 * Hai dieu phai giu bang duoc, vi ca hai deu la loi **im lang**: kho am thi bang so van
 * dep ma kinh te da vo, kho vuot tran thi tran khong con nghia gi.
 */
import { describe, expect, it } from 'vitest';
import { docHang, Kho } from '../src/sim/city/Wares.ts';
import { LoiDuLieu } from '../src/sim/city/DocJson.ts';
import hangTho from '../data/wares.json';

const mau = [
  { ten: 'bot', hien: 'Bot', tran: 10, dau: 4, hao: 0 },
  { ten: 'nuoc', hien: 'Nuoc', tran: 5, dau: 0, hao: 0 },
];

describe('Kho', () => {
  it('bot nhieu hon dang co thi chi lay duoc phan dang co, khong am', () => {
    const kho = new Kho(mau);
    expect(kho.bot('bot', 100)).toBe(4);
    expect(kho.co('bot')).toBe(0);
    expect(kho.bot('bot', 1)).toBe(0);
    expect(kho.co('bot')).toBe(0);
  });

  it('them qua tran thi chi vao duoc phan con cho', () => {
    const kho = new Kho(mau);
    expect(kho.them('bot', 100)).toBe(6);
    expect(kho.co('bot')).toBe(10);
    expect(kho.them('bot', 1)).toBe(0);
  });

  it('du va duCho tra loi dung o hai dau', () => {
    const kho = new Kho(mau);
    expect(kho.du('bot', 4)).toBe(true);
    expect(kho.du('bot', 5)).toBe(false);
    expect(kho.duCho('bot', 6)).toBe(true);
    expect(kho.duCho('bot', 7)).toBe(false);
  });

  it('hoi mat hang khong co thi nem loi, khong tra ve 0', () => {
    const kho = new Kho(mau);
    expect(() => kho.co('vang')).toThrow(LoiDuLieu);
  });

  it('ban() la ban sao, sua no khong dung toi kho that', () => {
    const kho = new Kho(mau);
    const b = kho.ban();
    b.set('bot', 999);
    expect(kho.co('bot')).toBe(4);
  });
});

describe('docHang', () => {
  it('doc duoc data/wares.json that', () => {
    const ds = docHang(hangTho);
    expect(ds.length).toBeGreaterThanOrEqual(20);
    for (const h of ds) {
      expect(h.tran).toBeGreaterThan(0);
      expect(h.dau).toBeLessThanOrEqual(h.tran);
    }
  });

  it('bat ten trung', () => {
    expect(() => docHang({ hang: [mau[0], mau[0]] })).toThrow(/trung ten/);
  });

  it('bat ton kho ban dau vuot tran', () => {
    expect(() => docHang({ hang: [{ ten: 'a', hien: 'A', tran: 2, dau: 3 }] })).toThrow(/vuot tran/);
  });

  it('bat tran khong phai so nguyen', () => {
    expect(() => docHang({ hang: [{ ten: 'a', hien: 'A', tran: 1.5, dau: 0 }] })).toThrow(
      /so nguyen/,
    );
  });

  it('khong khai `hao` thi coi nhu khong hong', () => {
    const [h] = docHang({ hang: [{ ten: 'a', hien: 'A', tran: 2, dau: 0 }] });
    expect(h?.hao).toBe(0);
  });

  it('bat hao qua 100 phan tram mot gio', () => {
    expect(() =>
      docHang({ hang: [{ ten: 'a', hien: 'A', tran: 2, dau: 0, hao: 101 }] }),
    ).toThrow(/100/);
  });

  it('ca tuoi phai hong nhanh hon ca muoi - ly do ton tai cua lo uop', () => {
    const ds = docHang(hangTho);
    const tuoi = ds.find((h) => h.ten === 'ca');
    const muoi = ds.find((h) => h.ten === 'ca_muoi');
    expect(tuoi?.hao).toBeGreaterThan(muoi?.hao ?? 0);
  });
});
