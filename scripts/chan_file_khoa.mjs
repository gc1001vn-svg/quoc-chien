#!/usr/bin/env node
// Hook PreToolUse cho Claude Code: chan sua cac file phai hoi chu du an truoc.
// Ban dung chung cho moi du an cua gc1001vn-svg.
//
// Cai vao mot du an:
//   1. Chep file nay vao <du-an>/scripts/chan_file_khoa.mjs
//   2. Liet ke duong dan khoa trong <du-an>/.claude/file_khoa.txt, moi dong mot
//      duong dan tuong doi goc repo. Dong ket thuc bang "/" = khoa ca thu muc.
//      Dong bat dau bang "#" la ghi chu. Khong co file nay thi dung MAC_DINH.
//   3. Them vao <du-an>/.claude/settings.json:
//      "PreToolUse": [{ "matcher": "Edit|Write|NotebookEdit|Bash", "hooks": [
//        { "type": "command",
//          "command": "node $CLAUDE_PROJECT_DIR/scripts/chan_file_khoa.mjs",
//          "timeout": 10 } ] }]
//
// ---------------------------------------------------------------------------
// NO CHAN DUOC GI VA KHONG CHAN DUOC GI - doc truoc khi tin vao no
//
// Hook nay chan duoc viec sua NHAM va sua QUEN HOI. No KHONG chan duoc mot tro
// ly co tinh di duong vong: shell co muoi cach ghi file (`>`, `sed -i`, `tee`,
// `python`, `perl`, `mv`, `cp`...) va khong the bat het bang cach doc chuoi
// lenh. Dung tuong day la mot cai KHOA. No la mot cai NHAC, cong voi mot cuon
// so ghi lai ai da sua gi.
//
// Ngay 11/09/2026 dung ra dieu do: chu du an DA DONG Y sua `docs/TECH_SPEC.md`,
// hook van chan (ban cu khong co cach nao ghi nhan "da duoc dong y"), nen tro
// ly phai sua bang `python3` - tuc la di vong qua chinh cai hook. Ban nay them
// hai thu de chuyen do khong con xay ra:
//
//   1. VE DUYET (`.claude/da_duyet.txt`): mot dong mot duong dan. Co ve thi cho
//      qua va XOA dong do ngay - ve dung MOT LAN, khong thanh giay phep vinh
//      vien. Tro ly chi duoc ghi ve SAU khi chu du an dong y.
//   2. SO GHI (`.claude/nhat_ky_file_khoa.log`): moi lan cho qua deu ghi lai
//      thoi gian + duong dan + cong cu. Chu du an soi lai duoc.
//
// Ve do tro ly tu ghi duoc, nen no khong ngan duoc gian doi - no chi lam viec
// gian doi PHAI CO Y va DE LAI DAU VET. Do la muc bao ve that su dat duoc.
//
// Fail-open: doc loi hoac du lieu hong thi cho qua, khong lam treo phien.
// Y tuong co che hook lay tu MoonshotAI/kimi-code (MIT), code viet lai tu dau.

import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';

/** Danh sach khoa mac dinh khi du an khong co .claude/file_khoa.txt. */
const MAC_DINH = ['CLAUDE.md', '.claude/settings.json', '.github/workflows/'];

const DUONG_VE = '.claude/da_duyet.txt';
const DUONG_SO = '.claude/nhat_ky_file_khoa.log';

/**
 * Lenh co the GHI de len file. Dung de bat duong vong ro rang, khong phai de
 * bat het - xem ghi chu dau file.
 *
 * KHONG dua `>` tran vao day. Da thu 11/09 va no chan nham ngay lenh dau tien:
 * gan nhu moi lenh deu co `2>/dev/null` hay `2>&1`, ma do la chuyen huong LOI
 * chu khong phai ghi vao file khoa. Chuyen huong ghi bat bang `CHUYEN_HUONG`
 * duoi day - phai co DUNG duong dan file khoa ngay sau dau `>`.
 */
const LENH_GHI = [
  'sed -i', 'tee', 'truncate', 'dd ', 'patch ',
  'mv ', 'cp ', 'rm ', 'python', 'perl', 'ruby', 'node -e', 'awk ',
];

/** `> duong/dan` hay `>> duong/dan` - ghi THANG vao dung file do. */
function chuyenHuongVao(lenh, duong) {
  const thoat = duong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`>>?\\s*['"]?${thoat}`).test(lenh);
}

/**
 * Bo noi dung `-m "..."` truoc khi quet.
 *
 * VAN BAN khong phai LENH. Commit message hay ke lai viec vua lam - "sua bang python3",
 * "docs/TECH_SPEC.md" - va quet tho thi doc ca hai thanh "lenh python ghi vao file khoa".
 * Da bi dung 11/09: hook chan chinh cai `git commit` ke lai viec vua sua hook.
 */
function boVanBan(lenh) {
  return lenh.replace(/-m\s+(['"])[\s\S]*?\1/g, '-m ""');
}

/** Doc danh sach khoa cua du an, khong co thi tra ve MAC_DINH. */
function docDanhSach(root) {
  try {
    const dong = readFileSync(join(root, '.claude/file_khoa.txt'), 'utf8')
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d && !d.startsWith('#'));
    return { muc: dong, nguon: '.claude/file_khoa.txt' };
  } catch {
    return { muc: MAC_DINH, nguon: 'danh sach mac dinh' };
  }
}

/** Muc khoa trung voi `norm`, hay `undefined`. */
function timKhoa(muc, norm) {
  return muc.find((d) => (d.endsWith('/') ? norm.startsWith(d) : norm === d));
}

/**
 * Tieu mot ve duyet cho `norm`. Tra ve `true` neu co ve (va da xoa no di).
 *
 * Xoa NGAY khi dung: ve mot lan thi moi lan sua lai phai hoi lai. De nguyen thi
 * mot lan dong y thanh giay phep vinh vien - dung cai bay ma luat file khoa
 * sinh ra de tranh.
 */
function tieuVe(root, norm) {
  const duong = join(root, DUONG_VE);
  let dong;
  try {
    dong = readFileSync(duong, 'utf8').split('\n');
  } catch {
    return false;
  }
  const i = dong.findIndex((d) => d.trim() === norm);
  if (i < 0) return false;
  dong.splice(i, 1);
  try {
    writeFileSync(duong, dong.join('\n'));
  } catch {
    // Xoa khong duoc thi KHONG cho qua: ve khong tieu duoc la ve dung mai mai.
    return false;
  }
  return true;
}

/** Ghi mot dong vao so. Ghi hong thi thoi, khong lam treo phien. */
function ghiSo(root, van) {
  try {
    appendFileSync(join(root, DUONG_SO), `${new Date().toISOString()} ${van}\n`);
  } catch {
    /* fail-open */
  }
}

function chan(norm, khoa, nguon) {
  console.error(
    `File "${norm}" trung muc khoa "${khoa}" (${nguon}).\n` +
    `Phai HOI CHU DU AN va duoc dong y truoc khi sua.\n` +
    `Duoc dong y roi thi ghi mot dong "${norm}" vao ${DUONG_VE} roi sua lai — ` +
    `ve dung mot lan, va moi lan cho qua deu ghi vao ${DUONG_SO}.\n` +
    `CHUA duoc dong y thi KHONG duoc tu ghi ve, va khong duoc di vong bang shell.`,
  );
  process.exit(2);
}

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let tho;
  try {
    tho = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const { muc, nguon } = docDanhSach(root);
  const tenCongCu = tho?.tool_name ?? '';

  // --- Bash: bat duong vong ro rang -----------------------------------------
  if (tenCongCu === 'Bash') {
    const lenh = boVanBan(tho?.tool_input?.command ?? '');
    if (!lenh) process.exit(0);
    const coLenhGhi = LENH_GHI.some((d) => lenh.includes(d));
    // Chi so voi muc khoa la FILE. Muc thu muc ("...//") de nguyen: ten thu muc
    // hay xuat hien trong lenh doc binh thuong (`ls .github/workflows/`).
    const trung = muc.filter((d) => !d.endsWith('/') && lenh.includes(d)
      && (coLenhGhi || chuyenHuongVao(lenh, d)));
    for (const d of trung) {
      if (tieuVe(root, d)) {
        ghiSo(root, `CHO QUA (ve) Bash -> ${d}`);
        continue;
      }
      ghiSo(root, `CHAN Bash -> ${d}`);
      chan(d, d, nguon);
    }
    process.exit(0);
  }

  // --- Edit / Write / NotebookEdit -------------------------------------------
  const filePath = tho?.tool_input?.file_path ?? '';
  if (!filePath) process.exit(0);
  const rel = isAbsolute(filePath) ? relative(root, filePath) : filePath;
  const norm = rel.split('\\').join('/');

  const khoa = timKhoa(muc, norm);
  if (!khoa) process.exit(0);

  if (tieuVe(root, norm)) {
    ghiSo(root, `CHO QUA (ve) ${tenCongCu} -> ${norm}`);
    process.exit(0);
  }
  ghiSo(root, `CHAN ${tenCongCu} -> ${norm}`);
  chan(norm, khoa, nguon);
});
