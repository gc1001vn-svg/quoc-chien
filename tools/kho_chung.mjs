#!/usr/bin/env node
/**
 * Noi voi KHO MODEL DUNG CHUNG - `assets_source/` nam trong git cua repo `tayvuc`.
 *
 * VI SAO CAN. Luat HAI KHO da chot cho moi du an (`tayvuc/CLAUDE.md` muc Asset):
 * `assets_source/` giu goi tai ve **nguyen ven**, khong len may chu, dung chung cho moi
 * du an; `public/assets/` chi giu thu game **that su dung**, co len may chu.
 * `tayvuc/docs/TIEN_DO.md` ghi thang: *"Quoc Chien tai dung ba thu cua Tay Vuc: 269 MB
 * model 3D trong assets_source (de nuong thanh sprite 2D)"*.
 *
 * Ngay 11/09 tro ly ket luan "khong co kho luu tru nao" ma chua tra - SAI, chu du an nhac
 * moi lo ra. Kho co that: 2.677 file, 326 MB, NAM TRONG GIT.
 *
 * HAI VIEC, hai lenh:
 *
 *   npm run kho:chung          # sinh docs/KHO_CHUNG.md tu kho da clone san
 *   npm run kho:lay <goi>...   # chep goi tu kho chung sang assets_source/
 *
 * `docs/KHO_CHUNG.md` **len git**, nen moi phien deu do duoc kho chung bang `grep` ma
 * KHONG phai clone 326 MB. Chi khi can model that moi phai lay.
 *
 * CHO PHAI BIET TRUOC KHI DUNG: kho chung giu goi da LOC - phan lon chi con thu muc
 * `glTF/`, khong co `OBJ/`. Cac me hien tai cua du an nay tro vao thu muc OBJ nen KHONG
 * thay the duoc bang kho chung; kho chung dung de **tim model moi** va cho me moi tro
 * thang vao glTF/GLB. May nuong doc duoc `.obj` `.gltf` `.glb` (`.glb` mo tu 11/09);
 * `.fbx` thi chua.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Duong toi kho chung da clone. Doi bang bien moi truong neu clone cho khac. */
const KHO_CHUNG = process.env.KHO_CHUNG ?? '/home/user/tayvuc/assets_source';
const KHO = 'assets_source';
const RA = 'docs/KHO_CHUNG.md';
/**
 * Duoi may nuong DOC DUOC. Tu 11/09 co ca `.glb` — `tools/lib/gltf.mjs` co `tachGlb`,
 * va kit khai `"loai": "glb"` trong file me. `.fbx` thi chua.
 */
const DOC_DUOC = ['.obj', '.gltf', '.glb'];
/** Duoi tinh la model, ke ca thu chua doc duoc - de biet kho co gi. */
const DUOI = ['.obj', '.gltf', '.glb', '.fbx'];

/** Moi thu muc con co model, kem ten model (da bo duoi). */
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
  const docDuoc = new Set();
  for (const m of muc) {
    const day = join(duong, m);
    if (statSync(day).isDirectory()) {
      ra.push(...quet(day, sau + 1));
      continue;
    }
    const i = m.lastIndexOf('.');
    if (i < 1) continue;
    const duoi = m.slice(i).toLowerCase();
    if (!DUOI.includes(duoi)) continue;
    ten.add(m.slice(0, i));
    if (DOC_DUOC.includes(duoi)) docDuoc.add(m.slice(0, i));
  }
  if (ten.size > 0) ra.push({ duong, ten: [...ten].sort(), docDuoc });
  return ra;
}

function sinhDanhMuc() {
  if (!existsSync(KHO_CHUNG)) {
    console.error(
      `Khong thay kho chung o "${KHO_CHUNG}".\n` +
      'Clone truoc: git clone --depth 1 https://github.com/gc1001vn-svg/tayvuc /home/user/tayvuc\n' +
      '(hoac dat bien KHO_CHUNG tro toi assets_source/ cua no)',
    );
    process.exit(1);
  }
  const nhom = quet(KHO_CHUNG).sort((a, b) => a.duong.localeCompare(b.duong));
  const dong = [
    '# KHO CHUNG — model dùng chung cho mọi dự án',
    '',
    '> **Sinh tự động bằng `npm run kho:chung`. Đừng sửa tay.**',
    '>',
    '> Đây là kho **của repo `tayvuc`**, nằm trong git của nó (luật hai kho — xem',
    '> `tayvuc/CLAUDE.md` mục Asset). File này chỉ là **bản kê tên** để dò bằng `grep`',
    '> mà không phải clone 326 MB. Cần model thật thì `npm run kho:lay <gói>`.',
    '>',
    '> **Dò ở đây SAU khi dò `KHO_ASSET.md` không ra** — luật ba bước ở `CLAUDE.md`.',
    '>',
    '> Kho chung giữ gói **đã lọc**: phần lớn chỉ còn `glTF/`, không có `OBJ/`.',
    '> Máy nướng đọc được `.obj`, `.gltf` **và `.glb`** (từ 11/09). `.fbx` thì chưa.',
    '',
  ];
  let tong = 0;
  const tenKhacNhau = new Set();
  const tenDocDuoc = new Set();
  let goiCu = '';
  for (const n of nhom) {
    const ngan = n.duong.slice(KHO_CHUNG.length + 1);
    const goi = ngan.split('/').slice(0, 2).join('/');
    if (goi !== goiCu) {
      dong.push(`## ${goi}`, '');
      goiCu = goi;
    }
    tong += n.ten.length;
    for (const t of n.ten) {
      tenKhacNhau.add(t);
      if (n.docDuoc.has(t)) tenDocDuoc.add(t);
    }
    dong.push(`**\`${ngan}\`** — ${String(n.ten.length)} model`, '', `\`${n.ten.join('` · `')}\``, '');
  }
  dong.push(
    '---',
    '',
    `**${String(tenDocDuoc.size)} model máy nướng đọc được** trong kho chung — tên khác nhau`,
    '**và** có bản `.obj`, `.gltf` hoặc `.glb`. Đây là con số đáng tin.',
    '',
    `Hai số dưới **không phải** số model, đừng trích dẫn: ${String(tong)} lượt file ·`,
    `${String(tenKhacNhau.size)} tên khác nhau kể cả tên chỉ có \`.fbx\`.`,
    '',
  );
  writeFileSync(RA, dong.join('\n'));
  console.log(
    `${RA}: ${String(tenDocDuoc.size)} model doc duoc / ${String(tenKhacNhau.size)} ten / ` +
    `${String(tong)} luot file.`,
  );
}

/** Chep goi tu kho chung sang `assets_source/`. */
function layGoi(ds) {
  mkdirSync(KHO, { recursive: true });
  for (const g of ds) {
    const tu = join(KHO_CHUNG, g);
    if (!existsSync(tu)) {
      console.error(`Khong co goi "${g}" trong kho chung. Do bang: grep -i "${g}" ${RA}`);
      process.exitCode = 1;
      continue;
    }
    const den = join(KHO, g.split('/').pop());
    cpSync(tu, den, { recursive: true });
    console.log(`lay  ${g}  ->  ${den}`);
  }
}

const dsGoi = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (dsGoi.length > 0) layGoi(dsGoi);
else sinhDanhMuc();
