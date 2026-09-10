/**
 * Phase 6B: nha kinh te phai HIEN RA man hinh, va khong dam vao ai.
 *
 * Truoc Phase 6B, 94 nha kinh te cua `src/sim/` nam trong mot danh sach rieng, khong bao
 * gio duoc ve. Bam "xay hai coi xay" tren the quyet dinh thi bang so doi ma tren man
 * khong co gi moc len - hong dung cai vong phan hoi ma Phase 6 vua dung.
 *
 * Ba dieu phai dung, moi dieu deu la mot cach lam hong lai: moi loai nha co sprite that;
 * nha khong dat de len cay va nha trang tri; va nha thong doc xay LUC DANG CHAY cung moc
 * len ngay.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docNha } from '../src/sim/city/Buildings.ts';
import { sinhBanDo, type OVat } from '../src/sim/city/BanDo.ts';
import { ThanhPho } from '../src/sim/city/City.ts';
import hang from '../data/wares.json';
import nha from '../data/buildings.json';
import chuoi from '../data/chains.json';
import cauHinh from '../data/thanh_pho_demo.json';
import walker from '../data/walkers.json';

function taoThanhPho(): ThanhPho {
  return new ThanhPho({ hang, nha, chuoi, banDo: cauHinh, walker });
}

/** Moi o ma mot vat the phu len - vat 2x2 phu bon o. */
function oPhuLen(v: OVat, canh: number): number[] {
  const ra: number[] = [];
  for (let da = 0; da < v.o; da += 1) {
    for (let db = 0; db < v.o; db += 1) ra.push((v.a + da) * canh + (v.b + db));
  }
  return ra;
}

describe('nha kinh te hien ra ban do', () => {
  it('moi loai nha khai mot sprite co that trong me atlas', () => {
    // Doc ME chu khong doc atlas da nuong: test phai chay duoc ca khi chua ai nuong lai.
    const me = JSON.parse(readFileSync(`tools/me/${cauHinh.me}.json`, 'utf8')) as {
      sprite: Record<string, unknown>;
    };
    for (const def of docNha(nha)) {
      expect(
        Object.hasOwn(me.sprite, def.sprite),
        `sprite "${def.sprite}" cua nha "${def.ten}" khong co trong me atlas`,
      ).toBe(true);
    }
  });

  it('mo van xong thi so vat the tang dung bang so nha kinh te', () => {
    const truoc: number = sinhBanDo(cauHinh).vat.length;
    const tp: ThanhPho = taoThanhPho();
    // Vat the trang tri + mot sprite moi nha kinh te + mot sprite moi kho co san luc mo van.
    expect(tp.banDo.vat.length).toBe(truoc + tp.soNha + walker.soKhoDau);
  });

  it('khong hai vat the nao dam vao nhau', () => {
    const tp: ThanhPho = taoThanhPho();
    const daCo = new Set<number>();
    for (const v of tp.banDo.vat) {
      for (const o of oPhuLen(v, tp.banDo.canh)) {
        expect(daCo.has(o), `o ${String(o)} co hai vat the, "${v.ten}" dam vao cai truoc`)
          .toBe(false);
        daCo.add(o);
      }
    }
  });

  it('xay xong thi bao duoc O VUA DUNG, va chi bao MOT lan', () => {
    const tp: ThanhPho = taoThanhPho();
    // Dung con nao luc mo van cung khong tinh: `layOVuaDung` chi noi ve thu VUA dung.
    tp.layOVuaDung();

    expect(tp.xayNha('coi_xay')).toBe(true);
    const o = tp.layOVuaDung();
    expect(o, 'xay xong ma khong bao o nao').toBeDefined();
    expect(tp.banDo.vat.some((v) => v.a === o?.a && v.b === o?.b && v.ten === 'coi_xay')).toBe(true);
    // Doc lan hai phai rong, khong thi camera keo di keo lai mai mot cho.
    expect(tp.layOVuaDung()).toBeUndefined();
  });

  it('nha thong doc xay luc dang chay cung moc len ngay', () => {
    const tp: ThanhPho = taoThanhPho();
    const truocVat: number = tp.banDo.vat.length;
    const truocCoiXay: number = tp.banDo.vat.filter((v) => v.ten === 'coi_xay').length;

    expect(tp.xayNha('coi_xay')).toBe(true);

    expect(tp.banDo.vat.length).toBe(truocVat + 1);
    expect(tp.banDo.vat.filter((v) => v.ten === 'coi_xay').length).toBe(truocCoiXay + 1);
  });
});
