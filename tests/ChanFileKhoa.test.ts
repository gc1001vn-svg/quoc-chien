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
 * 12/09 CHU DU AN CHOT: duong `Bash` KHONG CHAN, CHI GHI SO. Duong `Edit`/`Write` van chan.
 *
 * 29/09 duong Bash thoi DOAN theo chuoi lenh. Ban doan ghi so ca lenh chi DOC (`node -e`
 * doc file, `git add` dinh mau `dd `) -> so nam trong git bi ban moi phien -> hook Stop
 * cua may ao bao loi cuoi luot. Gio hook chup mtime + co file khoa TRUOC lenh, so lai SAU
 * lenh: doi that moi ghi. Test vi vay chay LENH THAT giua hai lan goi hook.
 *
 * Test chay hook tren mot THU MUC GOC GIA, khong dung toi `.claude/` that cua repo - de
 * no khong xoa mat cai ve ma phien dang cho dung.
 */
import { execFileSync, execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const HOOK = new URL('../scripts/chan_file_khoa.mjs', import.meta.url).pathname;

let goc = '';

/** Goi hook mot lan voi `vao`. Tra ve `true` neu no CHAN (exit 2). */
function goiHook(vao: Record<string, unknown>): boolean {
  try {
    execFileSync('node', [HOOK], {
      input: JSON.stringify(vao),
      env: { ...process.env, CLAUDE_PROJECT_DIR: goc },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return false;
  } catch {
    return true;
  }
}

/** Hook PreToolUse cho mot cong cu. Tra ve `true` neu no CHAN. */
function chan(tool: string, input: Record<string, string>): boolean {
  return goiHook({ tool_name: tool, tool_input: input });
}

/**
 * Chay mot lenh Bash nhu harness: hook PreToolUse -> lenh THAT trong thu muc goc gia ->
 * hook PostToolUse. Tra ve `true` neu hook truoc CHAN.
 */
function bash(lenh: string): boolean {
  const vao = (suKien: string) => ({
    hook_event_name: suKien,
    session_id: 'thu-khoa',
    tool_use_id: 'lenh-1',
    tool_name: 'Bash',
    tool_input: { command: lenh },
  });
  const biChan = goiHook(vao('PreToolUse'));
  try {
    execSync(lenh, { cwd: goc, shell: '/bin/bash', stdio: 'pipe' });
  } catch { /* lenh hong van phai di qua hook sau, nhu harness that */ }
  goiHook(vao('PostToolUse'));
  return biChan;
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
  mkdirSync(join(goc, 'docs'), { recursive: true });
  writeFileSync(
    join(goc, '.claude/file_khoa.txt'),
    '# ghi chu bi bo qua\nCLAUDE.md\ndocs/TECH_SPEC.md\n.github/workflows/\n',
  );
  writeFileSync(join(goc, 'CLAUDE.md'), 'a\n');
  writeFileSync(join(goc, 'docs/TECH_SPEC.md'), 'a\n');
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

  // Tu 12/09 duong Bash KHONG chan nua, chi ghi so - chu du an chot.
  it('duong Bash cho qua, file khoa DOI THAT thi vao so', () => {
    expect(bash('echo x > CLAUDE.md')).toBe(false);
    expect(bash('sed -i s/a/b/ docs/TECH_SPEC.md')).toBe(false);
    expect(bash('python3 - <<PY\nopen("docs/TECH_SPEC.md","w")\nPY')).toBe(false);
    expect(so()).toEqual([
      'GHI SO Bash -> CLAUDE.md',
      'GHI SO Bash -> docs/TECH_SPEC.md',
      'GHI SO Bash -> docs/TECH_SPEC.md',
    ]);
  });

  // Ban doan theo chuoi lenh bo qua muc THU MUC ("ls .github/workflows/" hay gap). So
  // anh chup thi bung thu muc ra tung file, khong con so nham.
  it('file nam trong THU MUC khoa cung vao so', () => {
    bash('mkdir -p .github/workflows && echo x > .github/workflows/ci.yml');
    expect(so()).toEqual(['GHI SO Bash -> .github/workflows/ci.yml']);
  });
});

describe('khong ghi nham', () => {
  // Bon ca duoi deu da ghi nham that: `2>/dev/null` (11/09), `node -e` doc file va
  // `git add` (29/09). So phai sach thi moi con doc duoc.
  it('lenh chi DOC file khoa thi khong vao so', () => {
    bash('cat CLAUDE.md | head -20');
    bash('grep -n matcher docs/TECH_SPEC.md 2>/dev/null | head -3');
    bash('node -e "require(\'fs\').readFileSync(\'CLAUDE.md\', \'utf8\')"');
    bash('cat CLAUDE.md; echo "git add CLAUDE.md, dd if=x"');
    expect(so()).toEqual([]);
  });

  it('ghi vao file THUONG thi khong vao so', () => {
    bash('mkdir -p src && echo x > src/main.ts');
    expect(so()).toEqual([]);
  });

  // 11/09 hook chan chinh cai `git commit` ke lai viec vua sua, vi message nhac "python3"
  // va nhac ten file khoa. Van ban khong phai lenh.
  it('van ban nhac ten file khoa va ten lenh ghi thi khong vao so', () => {
    bash('echo "sua bang python3 vi docs/TECH_SPEC.md bi chan"');
    expect(so()).toEqual([]);
  });

  it('nhung ghi that VAN vao so du cung lenh co van ban', () => {
    bash('echo "ghi chu vo hai" && echo x > CLAUDE.md');
    expect(so()).toEqual(['GHI SO Bash -> CLAUDE.md']);
  });

  it('PostToolUse khong co anh chup truoc thi im lang', () => {
    goiHook({
      hook_event_name: 'PostToolUse', session_id: 'thu-khoa', tool_use_id: 'lenh-la',
      tool_name: 'Bash', tool_input: { command: 'echo x > CLAUDE.md' },
    });
    expect(so()).toEqual([]);
  });

  // `git checkout -- f` / `pull` / `merge` doi mtime nhung ket qua trung HEAD: thay doi da
  // nam trong lich su git, khong phai sua moi.
  it('repo git: file tro ve dung HEAD thi khong vao so, sua that thi vao', () => {
    const git = (lenh: string) => execSync(`git -c user.email=t@t -c user.name=t ${lenh}`,
      { cwd: goc, stdio: 'pipe' });
    git('init -q');
    git('add -A');
    git('commit -qm goc');
    writeFileSync(join(goc, 'CLAUDE.md'), 'sua tay\n');
    bash('git checkout -- CLAUDE.md');
    expect(so()).toEqual([]);
    bash('echo y >> CLAUDE.md');
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

  // Duong Bash khong chan nen cung khong duoc TIEU ve. Neu no tieu, mot lenh Bash se an
  // mat cai ve ma phien dang cho dung cho Edit.
  it('duong Bash khong an mat ve dang de danh cho Edit', () => {
    datVe('CLAUDE.md');
    expect(bash('echo x >> CLAUDE.md')).toBe(false);
    expect(chan('Edit', { file_path: 'CLAUDE.md' })).toBe(false);
  });
});
