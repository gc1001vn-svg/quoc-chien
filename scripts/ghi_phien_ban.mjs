#!/usr/bin/env node
/**
 * Sinh `src/PhienBan.ts` tu git, chay ngay truoc moi ban build.
 *
 * VI SAO CAN: chu du an mo trang tren iPhone va khong co cach nao biet minh dang xem ban
 * nao. Ngay 10/09 mat gan tron mot phien vi cau hoi "khong biet co phai chua cap nhat
 * khong" - toi thi sua, anh thi nhin, ma hai ben khong biet co dang nhin cung mot ban hay
 * khong. So phien ban in thang len thanh do fps: anh chup man gui la toi biet ngay.
 *
 * So dem commit (`git rev-list --count`) chu khong phai ma bam: chu du an doc duoc "b62"
 * va so sanh duoc voi con so toi noi, chu "a3f19c" thi khong.
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

const dem = git('rev-list', '--count', 'HEAD') || '0';
const ngay = (git('log', '-1', '--format=%cd', '--date=format:%d/%m') || '??/??');
const noiDung = `/**
 * So phien ban, SINH TU DONG boi \`scripts/ghi_phien_ban.mjs\` moi lan build.
 *
 * Dung sua tay. In len thanh do fps de chu du an chup man la biet ngay dang xem ban nao.
 */
export const PHIEN_BAN = 'b${dem} · ${ngay}';
`;

if (!existsSync(DICH) || readFileSync(DICH, 'utf8') !== noiDung) {
  writeFileSync(DICH, noiDung);
  console.log(`phien ban: b${dem} · ${ngay}`);
} else {
  console.log(`phien ban: b${dem} · ${ngay} (khong doi)`);
}
