/**
 * Hang rao cho hook chan file khoa (`scripts/chan_file_khoa.mjs`).
 *
 * VI SAO CO FILE NAY. Ngay 11/09 hook lo ra hai lo hong cung mot luc:
 *
 * - Chu du an DA DONG Y sua `docs/TECH_SPEC.md` ma hook van chan, vi ban cu khong co cach
 *   nao ghi nhan "da duoc dong y". Tro ly phai sua bang `python3` - tuc la di vong qua
 *   chinh cai hook dang bao ve file do.
 * - Hook chi gan vao `Edit|Write|NotebookEdit`, nen duong `Bash` bo ngo hoan toan.
 *
 * Ban 11/09 them VE DUYET dung mot lan va chan ca duong `Bash`. Do mot phien that thi
 * cai chan Bash lo gia cua no: so ghi 16 dong, 13 lan CHAN, 4 lan trong do la CHAN NHAM.
 *
 * NEN 12/09 CHU DU AN CHOT BO CHAN DUONG BASH, GIU GHI SO. Chan shell khong ngan duoc ai
 * co y - shell co muoi duong ghi file - no chi lam phien nguoi lam viec that. Dau vet
 * moi la thu bao ve. Duong `Edit`/`Write` van chan nhu cu.
 *
 * Hai dau con lai van de hong nguoc: nhan dien qua tay thi moi lenh co `2>/dev/null` deu
 * vao so (da bi dung mot lan trong luc lam), con ve qua long thi thanh giay phep vinh vien.
 *
 * Test chay hook tren mot THU MUC GOC GIA, khong dung toi `.claude/` that cua repo - de
 * no khong xoa mat cai ve ma phien dang cho dung.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const HOOK = new URL('../scripts/chan_file_khoa.mjs', import.meta.url).pathname;

let goc = '';

/** Goi hook, tra ve `true` neu no CHAN (exit 2). */
function chan(tool: string, input: Record<string, string>): boolean {
  try {
    execFileSync('node', [HOOK], {
      input: JSON.stringify({ tool_name: tool, tool_input: input }),
      env: { ...process.env, CLAUDE_PROJECT_DIR: goc },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return false;
  } catch {
    return true;
  }
}

/** Dat ve duyet cho `duong`. */
function datVe(duong: string): void {
  writeFileSync(join(goc, '.claude/da_duyet.txt'), `${duong}\n`);
}

/** Cac dong so ghi, da bo dau thoi gian. Chua ghi gi thi tra ve mang rong. */
function so(): string[] {
  let van: string;
  try {
    van = readFileSync(join(goc, '.claude/nhat_ky_file_khoa.log'), 'utf8');
  } catch {
    return [];
  }
  return van.split('\n').filter(Boolean).map((d) => d.replace(/^\S+ /, ''));
}

beforeEach(() => {
  goc = mkdtempSync(join(tmpdir(), 'khoa-'));
  mkdirSync(join(goc, '.claude'), { recursive: true });
  writeFileSync(
    join(goc, '.claude/file_khoa.txt'),
    '# ghi chu bi bo qua\nCLAUDE.md\ndocs/TECH_SPEC.md\n.github/workflows/\n',
  );
});

afterEach(() => {
  rmSync(goc, { recursive: true, force: true });
});

describe('chan dung cho', () => {
  it('chan Edit vao file khoa, cho qua file thuong', () => {
    expect(chan('Edit', { file_path: 'docs/TECH_SPEC.md' })).toBe(true);
    expect(chan('Edit', { file_path: 'src/main.ts' })).toBe(false);
  });

  it('chan Write vao ca THU MUC khoa', () => {
    expect(chan('Write', { file_path: '.github/workflows/ci.yml' })).toBe(true);
  });

  // Tu 12/09 duong Bash KHONG chan nua, chi ghi so - chu du an chot. Ly do: chan shell
  // khong ngan duoc ai co y (shell co muoi duong ghi file), no chi lam phien nguoi lam
  // viec that. Bon lan chan nham trong mot phien la cai gia thay, con cai duoc thi bang
  // khong. Dau vet moi la thu bao ve.
  it('duong Bash cho qua nhung VAN ghi so', () => {
    expect(chan('Bash', { command: 'echo x > CLAUDE.md' })).toBe(false);
    expect(chan('Bash', { command: 'sed -i s/a/b/ docs/TECH_SPEC.md' })).toBe(false);
    expect(chan('Bash', {
      command: 'python3 - <<PY\nopen("docs/TECH_SPEC.md","w")\nPY',
    })).toBe(false);
    expect(so()).toEqual([
      'GHI SO Bash -> CLAUDE.md',
      'GHI SO Bash -> docs/TECH_SPEC.md',
      'GHI SO Bash -> docs/TECH_SPEC.md',
    ]);
  });

  // Ghi so ma khong nhan dien duoc thi bo chan thanh ra bo luon dau vet - tuc la mat
  // ca hai. Ca nay giu cho phan nhan dien khong bi xoa theo cai chan.
  it('lenh chi DOC file khoa thi khong ghi so - so phai sach de con doc duoc', () => {
    expect(chan('Bash', { command: 'cat CLAUDE.md | head -20' })).toBe(false);
    expect(so()).toEqual([]);
  });
});

describe('khong chan nham', () => {
  // Ca nay da xay ra that 11/09: `>` tran nam trong danh sach dau hieu ghi, nen
  // `2>/dev/null` - chuyen huong LOI - bi doc thanh ghi vao file khoa.
  it('lenh chi DOC file khoa thi cho qua, ke ca khi co `2>/dev/null`', () => {
    expect(chan('Bash', {
      command: 'grep -n matcher .claude/settings.json 2>/dev/null | head -3',
    })).toBe(false);
    expect(chan('Bash', { command: 'cat docs/TECH_SPEC.md | head -20' })).toBe(false);
  });

  it('ghi vao file THUONG thi cho qua', () => {
    expect(chan('Bash', { command: 'echo x > src/main.ts' })).toBe(false);
  });

  it('lenh khong dung toi file khoa thi cho qua', () => {
    expect(chan('Bash', { command: 'npm run do 2>&1 | tail -8' })).toBe(false);
  });

  // Ca nay cung da xay ra that 11/09: hook chan chinh cai `git commit` ke lai viec vua
  // sua hook, vi message nhac "python3" va nhac ten file khoa. Van ban khong phai lenh.
  it('commit message nhac ten file khoa va ten lenh ghi thi van cho qua', () => {
    expect(chan('Bash', {
      command: 'git add -A && git commit -m "sua bang python3 vi docs/TECH_SPEC.md bi chan"',
    })).toBe(false);
  });

  it('nhung ghi that VAN vao so du cung lenh do co -m', () => {
    expect(chan('Bash', {
      command: 'git commit -m "ghi chu vo hai" && echo x > CLAUDE.md',
    })).toBe(false);
    expect(so()).toEqual(['GHI SO Bash -> CLAUDE.md']);
  });

  // Ca thu tu trong ngay 11/09: `git commit -F -` doc message tu heredoc, ma message ke
  // lai viec vua lam nen nhac ten file khoa. Van ban, khong phai lenh.
  it('heredoc cua `git commit -F -` la van ban, cho qua', () => {
    expect(chan('Bash', {
      command: "git add -A && git commit -F - <<'MSG'\nsua theo tayvuc/CLAUDE.md\nMSG",
    })).toBe(false);
  });

  // Nhung heredoc cua `python3` thi la LENH THAT - khong duoc bo nham khoi so.
  it('heredoc cua python3 VAN vao so', () => {
    expect(chan('Bash', {
      command: 'python3 - <<PY\nopen("CLAUDE.md","w")\nPY',
    })).toBe(false);
    expect(so()).toEqual(['GHI SO Bash -> CLAUDE.md']);
  });
});

describe('ve duyet', () => {
  it('co ve thi cho qua, nhung ve chi dung MOT LAN', () => {
    datVe('docs/TECH_SPEC.md');
    expect(chan('Edit', { file_path: 'docs/TECH_SPEC.md' })).toBe(false);
    // Ve da tieu -> lan hai phai chan lai. Khong co luat nay thi mot lan dong y
    // thanh giay phep vinh vien.
    expect(chan('Edit', { file_path: 'docs/TECH_SPEC.md' })).toBe(true);
  });

  it('ve cho file nay khong mo duoc file khac', () => {
    datVe('docs/TECH_SPEC.md');
    expect(chan('Edit', { file_path: 'CLAUDE.md' })).toBe(true);
  });

  // Duong Bash khong con chan nen cung khong duoc TIEU ve. Neu no tieu, mot lenh Bash
  // doan nham se an mat cai ve ma phien dang cho dung cho Edit - dung cai bay ma ve mot
  // lan sinh ra de tranh.
  it('duong Bash khong an mat ve dang de danh cho Edit', () => {
    datVe('CLAUDE.md');
    expect(chan('Bash', { command: 'echo x >> CLAUDE.md' })).toBe(false);
    expect(chan('Edit', { file_path: 'CLAUDE.md' })).toBe(false);
  });
});
