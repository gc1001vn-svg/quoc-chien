/**
 * Hau qua cua mot lua chon phai lam that, va phai bao that khi khong lam duoc.
 *
 * "Bao that khi khong lam duoc" moi la phan quan trong: the noi xay hai coi xay ma ban do
 * chi con cho cho mot cai thi nguoi choi phai thay, khong thi ho tuong da xay du.
 */
import { describe, expect, it } from 'vitest';
import { ThanhPho } from '../src/sim/city/City.ts';
import { Governor } from '../src/sim/autoplay/Governor.ts';
import { docChinhSach } from '../src/sim/autoplay/Policy.ts';
import { apHauQua } from '../src/sim/decision/HauQua.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import banDo from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';
import chinhSach from '../data/policy.json';

function tao(): { tp: ThanhPho; td: Governor } {
  const tp = new ThanhPho({ hang, nha, chuoi, banDo, walker });
  return { tp, td: new Governor(tp, docChinhSach(chinhSach)) };
}

describe('ap hau qua', () => {
  it('xay dung so nha da hua', () => {
    const { tp, td } = tao();
    const truoc: number = tp.soNha;
    const daLam = apHauQua({ xay: [{ ten: 'coi_xay', so: 2 }] }, tp, td);
    expect(tp.soNha).toBe(truoc + 2);
    expect(daLam[0]?.duoc).toBe(true);
    expect(daLam[0]?.viec).toContain('Cối xay');
  });

  it('xay nha khong co trong `buildings.json` thi bao khong lam duoc', () => {
    const { tp, td } = tao();
    const truoc: number = tp.soNha;
    const daLam = apHauQua({ xay: [{ ten: 'lau_dai_bay', so: 1 }] }, tp, td);
    expect(tp.soNha).toBe(truoc);
    expect(daLam[0]?.duoc).toBe(false);
    expect(daLam[0]?.viec).toContain('0/1');
  });

  it('xay kho lam doi walker co them mot kho', () => {
    const { tp, td } = tao();
    const truoc: number = tp.doiWalker.soKho;
    expect(apHauQua({ xayKho: true }, tp, td)[0]?.duoc).toBe(true);
    expect(tp.doiWalker.soKho).toBe(truoc + 1);
  });

  it('doi nguong doi that hanh vi thong doc, va khong xuong duoi 0', () => {
    const { tp, td } = tao();
    const truoc: number = td.layNguong('nguongCho');
    apHauQua({ doiNguong: { nguongCho: 15 } }, tp, td);
    expect(td.layNguong('nguongCho')).toBe(truoc + 15);
    apHauQua({ doiNguong: { nguongCho: -99999 } }, tp, td);
    expect(td.layNguong('nguongCho')).toBe(0);
  });

  it('noi tran cong don vao tran cua cap hien tai', () => {
    const { tp, td } = tao();
    const truoc = td.cap;
    apHauQua({ noiTran: { nha: 20, kho: 1 } }, tp, td);
    expect(td.cap.tranNha).toBe(truoc.tranNha + 20);
    expect(td.cap.tranKho).toBe(truoc.tranKho + 1);
  });
});
