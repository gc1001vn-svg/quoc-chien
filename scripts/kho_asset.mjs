#!/usr/bin/env node
/**
 * Kiem ke kho `assets_source/`: liet ke TEN THAT cua moi model trong moi goi da tai.
 *
 * VI SAO CAN: ngay 10/09 Claude ngoi ghep coi xay gio bang tay tu manh tuong va manh mai,
 * nuong thu nam lan, trong khi `kaykit-medieval-builder-pack` da nam san trong kho voi
 * `mill` `mill_blades` `well` `mine` `farm_plot` `lumbermill` `market`. Chu du an da dan
 * tu dau: **do kho truoc, dung roi moi lam**. `docs/TECH_SPEC.md` muc 3 co bang goi nhung
 * chi ghi chung chung ("cong trinh nguyen khoi 2x2"), khong ghi ten model - khong grep duoc.
 *
 * File nay sinh `docs/KHO_ASSET.md`: mot dong mot goi, day du ten model, **grep mot lenh
 * la ra**. Chay lai moi khi tai goi moi:
 *
 *   npm run kho
 *
 * Cach dung truoc khi ghep bat cu sprite nao:
 *
 *   grep -i 'mill\|well\|mine' docs/KHO_ASSET.md
 */
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const KHO = 'assets_source';
const RA = 'docs/KHO_ASSET.md';
/** Duoi file model. Bo qua anh, tai lieu, file nguon Blender. */
const DUOI = ['.obj', '.gltf', '.glb', '.fbx'];

/** Moi thu muc con co model, kem danh sach ten model (da bo duoi). */
function quet(duong, sau = 0) {
  const ra = [];
  if (sau > 6) return ra;
  let muc;
  try {
    muc = readdirSync(duong);
  } catch {
    return ra;
  }
  const ten = new Set();
  const coObj = new Set();
  for (const m of muc) {
    const day = join(duong, m);
    if (statSync(day).isDirectory()) {
      ra.push(...quet(day, sau + 1));
      continue;
    }
    const i = m.lastIndexOf('.');
    if (i > 0 && DUOI.includes(m.slice(i).toLowerCase())) {
      ten.add(m.slice(0, i));
      // "Dung duoc" = may nuong doc duoc. `tools/nuong_sprite.mjs` co CA `docObj` LAN
      // `docGltf`, va me `trung_co_2` dang dung glTF that cho hai kit
      // (`modular-character-outfits-fantasy`, `universal-base-characters`).
      // Truoc 11/09 cho nay chi dem `.obj` va dong tong ghi "may nuong chi doc OBJ" -
      // SAI, bo sot moi model chi co glTF. Cung ngay 11/09 them bo doc `.glb`
      // (`tools/lib/gltf.mjs`, ham `tachGlb`). `.fbx` thi van chua doc duoc.
      if (['.obj', '.gltf', '.glb'].includes(m.slice(i).toLowerCase())) coObj.add(m.slice(0, i));
    }
  }
  if (ten.size > 0) ra.push({ duong, ten: [...ten].sort(), coObj });
  return ra;
}

if (!existsSync(KHO)) {
  console.error(`Khong co ${KHO}/. Tai goi ve truoc: xem docs/ASSET_CREDITS.md.`);
  process.exit(1);
}

const dong = [
  '# KHO ASSET — QUỐC CHIẾN',
  '',
  '> **Sinh tự động bằng `npm run kho`. Đừng sửa tay.**',
  '>',
  '> Mọi model có trong `assets_source/`. **Dò ở đây trước khi ghép bất cứ sprite nào** —',
  '> ngày 10/09 đã ngồi ghép cối xay gió bằng tay năm lần trong khi `mill` nằm sẵn ở đây.',
  '>',
  '> Tìm nhanh: `grep -i "windmill\\|well\\|mine" docs/KHO_ASSET.md`',
  '',
];

let tong = 0;
// Mot model thuong xuat ra ca fbx/ gltf/ obj/ - ba thu muc rieng nen dem ba lan.
// Giu ca ba so: tong file, ten khac nhau, va ten CO BAN OBJ (may nuong chi doc OBJ).
const tenKhacNhau = new Set();
const tenCoObj = new Set();
for (const goi of readdirSync(KHO).sort()) {
  const duongGoi = join(KHO, goi);
  if (!statSync(duongGoi).isDirectory()) continue;
  const nhom = quet(duongGoi);
  if (nhom.length === 0) continue;
  dong.push(`## ${goi}`, '');
  for (const n of nhom) {
    tong += n.ten.length;
    for (const t of n.ten) {
      tenKhacNhau.add(t);
      if (n.coObj.has(t)) tenCoObj.add(t);
    }
    dong.push(`**\`${n.duong}\`** — ${String(n.ten.length)} model`, '', `\`${n.ten.join('` · `')}\``, '');
  }
}

dong.push(
  '---',
  '',
  `**${String(tenCoObj.size)} model dùng được** trong \`${KHO}/\` — đây là con số đáng tin:`,
  'tên khác nhau **và** có bản `.obj`, `.gltf` hoặc `.glb` — ba định dạng máy nướng đọc',
  'được (`tools/lib/gltf.mjs` có `tachGlb` từ 11/09). `.fbx` thì chưa.',
  '',
  `Hai số dưới đây **không phải** số model, đừng trích dẫn: ${String(tong)} lượt file`,
  `(một model xuất ra fbx/gltf/obj thì đếm ba lần) · ${String(tenKhacNhau.size)} tên khác nhau`,
  'kể cả tên chỉ có FBX.',
  '',
);

// Kho mat theo container moi phien. Tai thieu goi roi chay lenh nay la ghi de mat
// danh muc cu, im lang. Chan lai khi so model tut qua 20% so voi ban dang co.
const cu = existsSync(RA)
  ? /\*\*(\d+) model dùng được\*\*|Tổng: \*\*(\d+) model/.exec(readFileSync(RA, 'utf8'))?.slice(1).find(Boolean)
  : null;
if (cu !== null && cu !== undefined && tenCoObj.size < Number(cu) * 0.8) {
  console.error(
    `kho: DUNG LAI. Ban cu ${cu} model, quet duoc ${String(tenCoObj.size)} - tut qua 20%.\n` +
    `  Nhieu kha nang assets_source/ chua tai du. Chay "npm run tai:tatca" truoc.\n` +
    `  Co that su muon ghi de thi: KHO_EP=1 npm run kho`,
  );
  if (process.env.KHO_EP !== '1') process.exit(1);
}

writeFileSync(RA, dong.join('\n'));
console.log(
  `kho: ${String(tenCoObj.size)} model dung duoc (co OBJ) -> ${RA}` +
  `   [${String(tong)} luot file, ${String(tenKhacNhau.size)} ten khac nhau]`,
);
