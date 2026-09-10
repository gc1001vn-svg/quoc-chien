#!/usr/bin/env node
/**
 * Sinh `src/PhienBan.ts` tu git, chay ngay truoc moi ban build.
 *
 * VI SAO CAN: chu du an mo trang tren iPhone va khong co cach nao biet minh dang xem ban
 * nao. Ngay 10/09 mat gan tron mot phien vi cau hoi "khong biet co phai chua cap nhat
 * khong" - toi thi sua, anh thi nhin, ma hai ben khong biet co dang nhin cung mot ban hay
 * khong. So phien ban in thang len thanh do fps: anh chup man gui la toi biet ngay.
 *
 * DUNG NGAY GIO COMMIT, khong dung so dem commit. Ban dau dung `git rev-list --count` va
 * tren may toi ra "b87" rat dep - nhung tren may chu no ra **b1**, vi
 * `actions/checkout@v5` mac dinh tai MOT commit (shallow clone) nen dem ra dung mot cai.
 * Sua bang cach khai `fetch-depth: 0` thi phai dung vao `.github/workflows/` - file khoa.
 * Ngay gio thi doc duoc trong ban tai nong, va van so sanh duoc bang mat: chu du an chi
 * can doi chieu "bang hay moi hon gio toi noi".
 *
 * Gio lay theo mui gio Viet Nam de khop dong ho tren iPhone cua chu du an.
 *
 * File sinh ra CO trong git de `npm run typecheck` chay duoc khi chua build. Ban tren may
 * toi co the cham mot commit; ban tren may chu thi luon dung, vi CI build lai sau khi
 * checkout dung commit do.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const DICH = 'src/PhienBan.ts';

function git(...cmd) {
  try {
    return execFileSync('git', cmd, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// `%cI` la ngay gio commit theo chuan ISO, co ca mui gio. Doc duoc ca trong ban tai nong.
const tho = git('log', '-1', '--format=%cI');
if (tho === '') {
  console.error('phien ban HONG: khong doc duoc ngay gio commit. Bo build cho chac.');
  process.exit(1);
}
const luc = new Date(tho);
const dd = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
}).formatToParts(luc);
const lay = (t) => dd.find((p) => p.type === t)?.value ?? '??';
const nhan = `${lay('day')}/${lay('month')} ${lay('hour')}:${lay('minute')}`;

const noiDung = `/**
 * So phien ban, SINH TU DONG boi \`scripts/ghi_phien_ban.mjs\` moi lan build.
 *
 * Dung sua tay. In len thanh do fps de chu du an chup man la biet ngay dang xem ban nao.
 */
export const PHIEN_BAN = '${nhan}';
`;

if (!existsSync(DICH) || readFileSync(DICH, 'utf8') !== noiDung) {
  writeFileSync(DICH, noiDung);
  console.log(`phien ban: ${nhan}`);
} else {
  console.log(`phien ban: ${nhan} (khong doi)`);
}
