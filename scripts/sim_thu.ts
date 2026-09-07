/** Tam thoi: kiem duong chay. Buoc sau thay bang ban tai nguyen 10 gio game. */
import { chuoiGio, DongHo, NHIP_MOI_GIO } from '../src/sim/Clock.ts';

const dh = new DongHo();
dh.chayThang(NHIP_MOI_GIO * 10);
console.log('Da chay', dh.soNhip, 'nhip =', chuoiGio(dh.soNhip), 'gio game');
