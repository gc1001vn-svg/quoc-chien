#!/usr/bin/env node
/**
 * Tai hoa tiet CC0 cua Poly Haven ve `assets_source/hoa_tiet/<ma>.jpg` - GOI SANG kho-game.
 *
 * Logic that o `kho-game/cong-cu/lay_polyhaven.mjs` tu 29/09 (xem `tools/kho_game.mjs`); bo
 * cuc `hoa_tiet/<ma>.jpg` giu y nhu cu vi me nuong tro thang vao do. O nen van TU SINH bang
 * so trong `tools/nuong_sprite.mjs` roi dan hoa tiet nay len - thuoc luoi luon dung 64x32.
 *
 * Dung:
 *   node tools/tai_hoa_tiet.mjs sparse_grass brown_mud_dry cobblestone_01
 *   node tools/tai_hoa_tiet.mjs --do-phan-giai 2k sparse_grass
 */
import { layKho } from './kho_game.mjs';

process.exit(layKho('polyhaven', process.argv.slice(2)));
