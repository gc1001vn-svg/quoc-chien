#!/usr/bin/env node
/**
 * Tai goi model CC0 cua Kenney ve `assets_source/<goi>/` - GOI SANG kho-game.
 *
 * Logic that o `kho-game/cong-cu/lay_kenney.mjs` tu 29/09 (xem `tools/kho_game.mjs`).
 * File nay giu ten cu vi `docs/ASSET_CREDITS.md` va `npm run tai:asset` goi dung ten nay.
 *
 * Dung:
 *   node tools/tai_asset.mjs fantasy-town-kit tower-defense-kit
 */
import { layKho } from './kho_game.mjs';

process.exit(layKho('kenney', process.argv.slice(2)));
