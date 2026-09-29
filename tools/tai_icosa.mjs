#!/usr/bin/env node
/**
 * Tai model ICOSA (kho guong Google Poly, toan bo CC-BY) ve `assets_source/icosa/<id>/` -
 * phan TAI goi sang kho-game, phan RIENG repo nay giu lai o day.
 *
 * Tu 29/09 viec do + tai nam o `kho-game/cong-cu/lay.mjs icosa` (muc luc 73.626 model, loc
 * ND/SA tu buoc quet, bon bay wayback/backblaze ghi o dau file do, bo GLTF1 mac dinh). Ban
 * cu 424 dong o day trung het voi no. Repo nay chi con hai viec rieng:
 *
 *   1. Kiem model MOI TAI doc duoc bang CHINH bo doc cua repo (`docGltf`) - doc hong thi xoa,
 *      de kho khong chua model chi lo ra luc nuong (`Invalid typed array length`).
 *   2. Ghi `docs/KHO_ICOSA.md` - ban ghi cong nguon Icosa ma `docs/ASSET_CREDITS.md` tro ve.
 *
 * Dung:
 *   node tools/tai_icosa.mjs house building        # tu khoa tieng Anh
 *   node tools/tai_icosa.mjs "gà" --tam 8000       # tieng Viet: tu dien cua kho-game
 *   node tools/tai_icosa.mjs house --tam 0         # --tam 0 = khong gioi han so tam
 *   node tools/tai_icosa.mjs house --thu           # chi in ra se tai gi, khong tai
 *
 * Chay lai duoc: model da co tren dia thi bo qua.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { docGltf } from './lib/gltf.mjs';
import { layKho } from './kho_game.mjs';

const THU_MUC = 'assets_source/icosa';
const KE_KHO = 'docs/KHO_ICOSA.md';
/** Tran so tam mac dinh: bang tran da dung khi do Poly Pizza, vua suc may nuong. */
const TAM_MAC_DINH = 8000;

/** Model tai trong lan chay nay (thu muc moi hon `tuLuc`) ma bo doc cua repo khong mo duoc -> xoa. */
function kiemDoc(tuLuc) {
  if (!existsSync(THU_MUC)) return;
  let dat = 0, xoa = 0;
  for (const id of readdirSync(THU_MUC)) {
    const tm = join(THU_MUC, id);
    if (statSync(tm).mtimeMs < tuLuc) continue;
    const file = readdirSync(tm).find((x) => /\.(glb|gltf)$/i.test(x));
    try {
      if (!file) throw new Error('khong co file model');
      docGltf(join(tm, file));
      dat++;
    } catch (loi) {
      rmSync(tm, { recursive: true, force: true });
      xoa++;
      console.log(`XOA ${id}: bo doc cua repo khong mo duoc - ${String(loi.message).slice(0, 60)}`);
    }
  }
  console.log(`Kiem doc: ${dat} model moi doc duoc · ${xoa} da xoa`);
}

/**
 * Ghi lai ban ke model da tai ve `docs/KHO_ICOSA.md` - de phien sau `grep` ra ten model
 * ma khong phai tai lai 800 MB, giong cach `docs/KHO_CHUNG.md` lam voi kho chung.
 * File SINH TU DONG: sua tay la mat o lan chay sau.
 */
function keKho() {
  if (!existsSync(THU_MUC)) return;
  // Bang ke GOP DAN, theo id: model tren dia cap nhat dong cua no, model khong co tren dia
  // giu nguyen dong cu. Ban cu ghi lai CHI tu model tren dia -> 28/09 phien moi tai vai
  // model la bang 1.692 dong con 17, phai `git checkout` tay.
  const theoId = new Map();
  if (existsSync(KE_KHO)) {
    for (const d of readFileSync(KE_KHO, 'utf8').split('\n')) {
      const m = /^\| .* \| `([^/`]+)\//.exec(d);
      if (m) theoId.set(m[1], d);
    }
  }
  let trenDia = 0;
  for (const id of readdirSync(THU_MUC).sort()) {
    const gc = join(THU_MUC, id, 'ghi_cong.json');
    if (!existsSync(gc)) continue;
    const g = JSON.parse(readFileSync(gc, 'utf8'));
    const file = readdirSync(join(THU_MUC, id)).find((x) => /\.(glb|gltf)$/i.test(x)) || '';
    // Cot `Trang` la BAT BUOC ve phap ly, khong phai trang tri: CC-BY doi ten tac gia va
    // duong dan ve ban goc. Nho no, file nay dung luon lam ban ghi cong, khong phai chep
    // tay 1.671 dong sang `ASSET_CREDITS.md` (file khoa, moi lan sua la mot vong hoi).
    theoId.set(id,
      `| ${g.ten} | \`${id}/${file}\` | ${g.tac_gia} | ${g.license} | ${g.so_tam} | ${g.trang} |`,
    );
    trenDia++;
  }
  const dong = [...theoId.keys()].sort().map((id) => theoId.get(id));
  mkdirSync('docs', { recursive: true });
  writeFileSync(
    KE_KHO,
    [
      '# KHO ICOSA — model đã tải về `assets_source/icosa/`',
      '',
      '> **File này SINH TỰ ĐỘNG** bằng `npm run tai:icosa`. Sửa tay là mất.',
      '> `assets_source/` không lên git, file kê này thì có — nhờ vậy phiên sau dò được',
      '> mà không phải tải lại.',
      '>',
      '> Dò bằng `grep -io` để khỏi in cả dòng:',
      "> `grep -io '[a-z0-9_ -]*chicken[a-z0-9_ -]*' docs/KHO_ICOSA.md | sort -u`",
      '>',
      '> **File này LÀ bản ghi công của nguồn Icosa**, không phải bản kê suông.',
      '> `docs/ASSET_CREDITS.md` mục Icosa trỏ về đây; nướng thêm model **không phải**',
      '> sửa file khoá đó, chỉ cần chạy lại `npm run tai:icosa` cho bảng dưới tự cập nhật.',
      '>',
      '> **Toàn bộ là CC-BY:** cột *Tác giả* và cột *Trang* là nghĩa vụ ghi công, đừng cắt.',
      '> Bản ND và SA đã bị `tai_icosa.mjs` loại từ đầu — ND cấm phái sinh, mà nướng sprite',
      '> là phái sinh.',
      '',
      '| Tên | File | Tác giả | License | Số tam | Trang gốc |',
      '|---|---|---|---|---:|---|',
      ...dong,
      '',
      `**${dong.length} model.** Gộp dần qua mọi lần tải — lần chạy cuối trên đĩa có ${trenDia}.`,
      '',
    ].join('\n'),
  );
  console.log(`Ke kho: ${dong.length} model (${trenDia} tren dia lan nay) -> ${KE_KHO}`);
}

async function main() {
  const args = process.argv.slice(2);
  const thu = args.includes('--thu');
  const iTam = args.indexOf('--tam');
  const tranTam = iTam >= 0 ? Number(args[iTam + 1]) : TAM_MAC_DINH;
  // Bo ca `--tam` lan so dung sau no; `iTam < 0` thi khong duoc bo arg dau tien.
  const tuKhoa = args.filter((a, i) => !a.startsWith('--') && !(iTam >= 0 && i === iTam + 1));
  if (!tuKhoa.length) {
    console.log('Dung: node tools/tai_icosa.mjs <tu khoa...> [--tam 8000] [--thu]');
    process.exit(1);
  }
  const tuLuc = Date.now();
  let hong = 0;
  for (const t of tuKhoa) {
    const them = ['--loc', t, ...(tranTam > 0 ? ['--tam', String(tranTam)] : []), ...(thu ? ['--thu'] : [])];
    if (layKho('icosa', them)) hong++;
  }
  if (thu) return;
  kiemDoc(tuLuc);
  keKho();
  if (hong) process.exitCode = 1;
}

await main();
