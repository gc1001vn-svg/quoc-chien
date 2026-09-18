/**
 * Hang rao cho hook chan bao "xong" (`scripts/chan_bao_xong.mjs`).
 *
 * VI SAO CO FILE NAY. Do 18/09 (lan 3): hook chi tinh la bao xong khi tu "xong" nam DAU
 * DONG hay ngay sau dau cham cau, vi `RAC` chi nuot khoang trang, ky tu Markdown va chu
 * so - gap chu cai la hong khop. Dang `<viec> xong` lot sach, ma do lai la dang hay dung
 * nhat. Nam cau do that: ba lot, hai bat.
 *
 *   Buoc 1 va 2 xong, da gop main.     -> ma thoat 0   LOT
 *   Dong phien xong.                   -> ma thoat 0   LOT
 *   Viec nay hoan thanh roi nhe.       -> ma thoat 0   LOT
 *
 * Chan dau dong la CO Y - tranh bat nham khi chi nhac toi chu "xong" - nhung no cat luon
 * dang bao xong that. Ban 18/09 (lan 4) bo neo dau dong, giu `TIEP` (sau cum tu phai la
 * dau cau, het dong, hay mot tu chot cau) va them `NOI_TOI`: tu dung ngay truoc "xong" ma
 * cho thay dang NHAC toi no chu khong bao.
 *
 * Hook dung chung bon repo, ban goc `ghi-nho/cong-cu/chan_bao_xong.mjs`. Sua ban goc roi
 * chay `node /home/user/ghi-nho/cong-cu/cai_dat.mjs <repo>` cho ca bon, khong thi thuoc
 * `check_hook` do.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';

const HOOK = new URL('../scripts/chan_bao_xong.mjs', import.meta.url).pathname;

/** Goi hook voi mot cau tra loi, tra ve `true` neu no CHAN (exit 2). */
function chan(msg: string): boolean {
  // Thu muc goc gia, khong co `.claude/so_lenh.log` - hook cho qua buoc doi chieu so lenh.
  const goc: string = mkdtempSync(join(tmpdir(), 'baoxong-'));
  try {
    execFileSync('node', [HOOK], {
      input: JSON.stringify({ last_assistant_message: msg, prompt_id: 'thu' }),
      env: { ...process.env, CLAUDE_PROJECT_DIR: goc },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return false;
  } catch {
    return true;
  } finally {
    rmSync(goc, { recursive: true, force: true });
  }
}

/** Cau bao xong DU ca hai dong bat buoc - hook phai cho qua. */
function duDoi(than: string): string {
  return `${than}\n\nSố đo: 10/10 thước đạt\n\nĐề xuất: mở phiên mới làm phase kế.`;
}

describe('chan_bao_xong bat dang bao xong', () => {
  // Nam cau do that ngay 18/09. Ba cau dau truoc day LOT.
  const baoXong: string[] = [
    'Bước 1 và 2 xong, đã gộp main.',
    'Đóng phiên xong.',
    'Việc này hoàn thành rồi nhé.',
    'Xong rồi.',
    'Em làm rồi. Xong, đã gộp main.',
    'Nướng mẻ hiện đại xong, đã đẩy main.',
    'Ba thước còn đỏ đã hoàn tất.',
  ];

  it.each(baoXong)('chan khi thieu ca hai dong: %s', (msg) => {
    expect(chan(msg)).toBe(true);
  });

  it.each(baoXong)('chan khi co "Số đo:" nhung thieu "Đề xuất:": %s', (msg) => {
    expect(chan(`${msg}\n\nSố đo: 10/10 thước đạt`)).toBe(true);
  });

  it.each(baoXong)('cho qua khi du ca hai dong: %s', (msg) => {
    expect(chan(duDoi(msg))).toBe(false);
  });
});

describe('chan_bao_xong KHONG bat nham', () => {
  // Bat nham phien hon lot: day la hook duy nhat chan mot cau tra loi da viet xong.
  const khongPhai: string[] = [
    'Đợi nướng xong thì gửi ảnh cho anh.',
    'Xong chụp bảng gửi em nhé.',
    'Phase 8B chưa xong, còn hai thước đỏ.',
    'Việc này không hoàn thành được vì thiếu model.',
    'Nếu xong sớm thì em báo.',
    'Hook `chan_bao_xong` lọt dạng báo xong hay gặp nhất.',
    'Anh bảo "làm xong rồi" nhưng thước vẫn đỏ.',
    'Khi nào xong em gửi ảnh.',
    'Sau khi xong bước này mới tới bước kế.',
  ];

  it.each(khongPhai)('cho qua: %s', (msg) => {
    expect(chan(msg)).toBe(false);
  });
});
