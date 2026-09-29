#!/usr/bin/env node
/**
 * Tai goi mien phi tu itch.io ve `assets_source/<goi>/` - GOI SANG kho-game.
 *
 * Logic that (bon buoc csrf + cookie, kiem trang co ghi CC0) o
 * `kho-game/cong-cu/lay_itch.mjs` tu 29/09 (xem `tools/kho_game.mjs`). File nay giu ten cu
 * vi `docs/ASSET_CREDITS.md` va `npm run tai:itch` goi dung ten nay.
 *
 * Dung:
 *   node tools/tai_itch.mjs kaylousberg/kaykit-medieval-builder-pack
 */
import { layKho } from './kho_game.mjs';

process.exit(layKho('itch', process.argv.slice(2)));
