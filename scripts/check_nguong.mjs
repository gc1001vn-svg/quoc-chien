#!/usr/bin/env node
// Thuoc: CAM noi nguong va CAM phinh danh sach mien de cho thuoc khac xanh.
//
// Vi sao co thuoc nay: thuoc do chi chan duoc khi khong ai sua duoc so cua no.
// Cach lach re nhat khong phai sua ma — la sua con so: doi 1600 thanh 2400, hay
// them mot ten vao `MIEN`. Lan nao cung "chi lan nay thoi". Repo `ghi-nho` da
// mang mot mon no dung kieu do: `tayvuc/.claude/nguong_token.txt` noi 1600 len
// 2400 tu 13/09, chua ai cat lai.
//
// Luat chep tu `Human-Agent-Society/reef` (Apache-2.0), muc Python style:
// "Do not bypass checks by adding broad suppressions or growing
//  .github/python-design-baseline.txt to accommodate new violations."
// Ho co file baseline nhung CAM no phinh. Day la ban cua repo nay.
//
// Moc goc nam o `.claude/nguong_goc.txt`. Tut xuong (that chat hon) luon duoc.
// Noi len thi thuoc do — muon noi that phai hoi chu du an, roi sua moc goc va
// ghi ly do vao chinh file do.
//
// Chay: `node scripts/check_nguong.mjs`

import { readFileSync, existsSync } from 'node:fs';

const MOC = '.claude/nguong_goc.txt';

/**
 * Cac so bi theo doi. Moi muc tu doc gia tri THUC TE tu ma nguon, de khong ai
 * sua duoc so ma quen bao thuoc.
 */
const THEO_DOI = [
  {
    ten: 'check_token.nguong',
    mo_ta: 'nguong token cua AGENTS.md',
    doc() {
      // Nguong that = `.claude/nguong_token.txt` neu co, khong thi so mac dinh trong ma.
      const rieng = '.claude/nguong_token.txt';
      if (existsSync(rieng)) {
        const so = Number(readFileSync(rieng, 'utf8').split('\n')[0].trim());
        if (Number.isFinite(so) && so > 0) return so;
      }
      return doSoMacDinh('scripts/check_token.mjs');
    },
  },
  {
    ten: 'check_ke_hoach.nguong',
    mo_ta: 'so dong toi da cua mot ban ke hoach',
    doc: () => doSoMacDinh('scripts/check_ke_hoach.mjs'),
  },
  {
    ten: 'check_ke_hoach.mien',
    mo_ta: 'so file duoc mien thuoc 60 dong',
    doc() {
      const ma = readFileSync('scripts/check_ke_hoach.mjs', 'utf8');
      const khoi = ma.match(/const MIEN = new Set\(\[([\s\S]*?)\]\)/);
      if (!khoi) return null;
      return (khoi[1].match(/'[^']+'/g) || []).length;
    },
  },
];

/** So mac dinh trong `const NGUONG = Number(process.env.X) || 60;` */
function doSoMacDinh(duongDan) {
  const ma = readFileSync(duongDan, 'utf8');
  const khop = ma.match(/const NGUONG =[\s\S]{0,200}?\|\|\s*(\d+);/);
  return khop ? Number(khop[1]) : null;
}

if (!existsSync(MOC)) {
  console.error(`HONG: thieu ${MOC} — khong co moc goc thi thuoc nay vo nghia.`);
  process.exit(1);
}

/** Doc moc goc: moi dong `ten=so`, dong `#` la ghi chu. */
const goc = new Map();
for (const dong of readFileSync(MOC, 'utf8').split('\n')) {
  const sach = dong.trim();
  if (!sach || sach.startsWith('#')) continue;
  const [ten, so] = sach.split('=');
  goc.set(ten.trim(), Number(so));
}

const qua = [];
for (const muc of THEO_DOI) {
  const that = muc.doc();
  const moc = goc.get(muc.ten);
  if (that === null || !Number.isFinite(that)) {
    console.error(`HONG: khong doc duoc gia tri that cua ${muc.ten} — ma nguon da doi hinh dang.`);
    process.exit(1);
  }
  if (!Number.isFinite(moc)) {
    console.error(`HONG: ${MOC} thieu muc ${muc.ten}.`);
    process.exit(1);
  }
  const dau = that > moc ? 'NOI' : that < moc ? 'that chat' : 'y moc';
  console.log(`  ${muc.ten.padEnd(24)} ${String(that).padStart(5)}  (moc ${moc}, ${dau})  ${muc.mo_ta}`);
  if (that > moc) qua.push({ ...muc, that, moc });
}

console.log(`${MOC}: ${THEO_DOI.length} so duoc theo doi`);

if (qua.length) {
  console.error(
    'HONG: co so bi NOI de cho thuoc khac xanh:\n' +
      qua.map((q) => `  ${q.ten}: ${q.moc} -> ${q.that}`).join('\n') +
      '\n  Cach dung: CAT cho vua moc goc, dung sua moc.\n' +
      `  Noi that su can thi hoi chu du an truoc, roi sua ${MOC} va ghi LY DO ngay trong file do.`,
  );
  process.exit(1);
}
