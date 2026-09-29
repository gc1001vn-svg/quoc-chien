/**
 * Cua sang kho-game - MOT cho lay asset, tu dien, lenh do cho moi repo game.
 *
 * VI SAO. Truoc 29/09 repo nay giu ban rieng cua bon cong cu tai (Kenney, itch, hoa tiet,
 * Icosa - 424 dong rieng Icosa), tu dien rieng va lenh do Poly Haven/Poly Pizza rieng: trung
 * voi kho-game, va repo game khac khong co gi. Nay logic nam o kho-game; cac file
 * `tools/tai_*.mjs` chi con goi sang day, giu ten cu de lenh trong `docs/ASSET_CREDITS.md`
 * (file khoa) van chay.
 *
 * Chua clone thi TU clone (repo public, khong can `add_repo`): 28/09 phien bo buoc kho-game
 * vi lenh chi in dong nhac, ket luan sai "khong co ga".
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

export const KHO_GAME = '/home/user/kho-game';

/** Co kho-game tren may chua; chua thi clone. Tra `true` neu dung duoc. */
export function coKhoGame() {
  if (!existsSync(`${KHO_GAME}/cong-cu/lay.mjs`)) {
    try {
      execFileSync('git', ['clone', '-q', '--depth', '1', 'https://github.com/gc1001vn-svg/kho-game', KHO_GAME],
        { stdio: 'ignore', timeout: 180000 });
    } catch { /* clone hong: ben goi bao ro, khong im lang */ }
  }
  return existsSync(`${KHO_GAME}/cong-cu/lay.mjs`);
}

/** Chay `kho-game/cong-cu/lay.mjs <nguon> ...` ngay tai thu muc dang dung. Tra ma thoat. */
export function layKho(nguon, thamSo) {
  if (!coKhoGame()) {
    console.error('HONG: khong clone duoc kho-game - chua lay duoc gi.'
      + '\n  git clone --depth 1 https://github.com/gc1001vn-svg/kho-game /home/user/kho-game');
    return 1;
  }
  return spawnSync('node', [`${KHO_GAME}/cong-cu/lay.mjs`, nguon, ...thamSo], { stdio: 'inherit' }).status ?? 1;
}
