# Skill ngoai — nguon va vi sao chi lay ba cai

Lay tu `github.com/addyosmani/agent-skills` (MIT, Addy Osmani + 2 collaborator),
ban tai ve 21/09/2026 tu `raw.githubusercontent.com/addyosmani/agent-skills/main/`.
Giay phep: `LICENSE-addyosmani-agent-skills.txt` — MIT, giu nguyen dong ban quyen.

Bo goc co **25 skill**. Chi lay **ba** — hai muoi hai cai kia trung voi thu cac repo
da co (`CLAUDE.md` + kho nay + hook + thuoc + `KE_HOACH.md`), hoac mau thuan luat da
chot (`git-workflow-and-versioning` day commit tieng Anh va trunk-based PR review;
`quoc-chien` chot commit tieng Viet khong dau, day `main` khong PR). Nhet ca bo vao
la tao cho lech — luat kho: **moi luat dung mot cho**.

| Skill | Lay vi | Trung voi cai da co |
|---|---|---|
| `doubt-driven-development` | Ra soat quyet dinh bang ngu canh moi: CLAIM → EXTRACT → DOUBT → RECONCILE → STOP. Khong repo nao co thu tuong duong | khong |
| `constraint-driven-development` | Bat tro ly khong tat thuoc de lay xanh: bat `@ts-ignore`, `eslint-disable`, test bi skip/xoa, nguong bi ha | MOT PHAN: `check_nguong` + `.claude/nguong_goc.txt` da chan noi nguong. Skill nay rong hon (bat ca suppression trong ma). Xem muc duoi ve `CONSTRAINTS.md` |
| `code-simplification` | Chesterton's Fence, Rule of 500, giam phuc tap ma giu nguyen hanh vi | khong |

## `constraint-driven-development` doi tao `CONSTRAINTS.md` — chan truoc

Skill nay, Step 3, ghi mot `CONSTRAINTS.md` o goc repo roi them mot dong vao `AGENTS.md`
va `CLAUDE.md`. Repo nao da co cho chua nguong roi thi do la bo thu hai — dung thu luat
kho cam.

Chinh skill co duong ra, muc **When NOT to use**: *"The project already has a
`CONSTRAINTS.md` and the user isn't changing it — read it and follow it instead."*

**Cach dung:** repo nao cai skill nay thi dat mot `CONSTRAINTS.md` **mong** o goc, chi
la bang chi duong sang cho da co (file nao giu so, thuoc nao bat), **cam chep so vao do**.
Ban mau: `quoc-chien/CONSTRAINTS.md` (21/09).

Lam bang tay tung repo — `cai_dat.mjs` KHONG sinh file nay: bang chi duong phai tro dung
file that cua repo do, doan ho thi ra mot bang sai, te hon khong co.

**San (Step 6, "the five moves") thi DANG cai, va cai bang thuoc rieng cua repo.**
`quoc-chien` 21/09: `scripts/check_san.mjs` bat ba nuoc — tat kiem tai cho
(`@ts-ignore` `eslint-disable` `# noqa`) · test bi tat (`it.skip` `describe.only` `xit`) ·
ham rong (`catch {}` RONG HAN, `throw new Error("Not implemented")`). Nuoc thu tu (ha
nguong) da co `check_nguong`; nuoc thu nam (them dong ngoai le) khong cai — repo do khong
co bang ngoai le nao, chan mot thu khong ton tai la them ma chet.

Ba diem dat gia khi lam, repo khac lam thi khoi va lai:
- **`catch { /* ly do */ }` phai cho qua.** Dem duoc 8 cho nhu vay trong `scripts/`, deu
  la fail-open CO Y cua hook. Cam `catch` rong han thoi; ai nuot loi phai viet ra vi sao.
- **Bo thu cua thuoc chua dung cac dau no cam** -> thuoc bat chinh no. Cho file thuoc va
  file thu vao `BO_QUA`.
- **`import` tu file thuoc se chay ca than thuoc** roi `process.exit(0)` giua bo test.
  Boc than trong mot ham, chi chay khi
  `pathToFileURL(process.argv[1]).href === import.meta.url`. Khai bao kieu cho module
  `.mjs` phai dat duoi `.d.mts`, khong TS bao `TS7016`.

**Khong dung ban `floor-guard.mjs` mau cua ho** (`references/floor-guard.md`): diff-scoped,
can moc nhanh goc, regex viet cho JS/Python. Quet toan repo don gian hon khi ma dang sach.

## Ca ba deu `user-invocable-only`

Khoa nam trong `skill_overrides.json`. Ly do: **chi phi nap moi phien**.

Harness nap `description` cua moi skill khong bi tat. Do 21/09 (byte cua dong
`description:` trong SKILL.md):

| Skill | byte |
|---|---|
| `code-simplification` | 257 |
| `doubt-driven-development` | 500 |
| `constraint-driven-development` | 899 |

Tong **1.656 byte ~ 415 token moi phien** — hon mot phan tu nguong `CLAUDE.md`
(1.600 token, thuoc `check:token`). De ca 25 skill tu bat thi ~1.500 token/phien.

Than SKILL.md **13–21 KB** (~3.000–5.000 token) — chi vao ngu canh khi goi thuc.
Vi vay khoa `user-invocable-only`: go bang tay thi vao, khong tu bat.

Goi: `/doubt-driven-development`, `/constraint-driven-development`, `/code-simplification`.

## Cap nhat ban moi

Khong `git submodule`, khong `npx skills add` — may ao dung lai moi phien,
`~/.claude/*` mat sach, cho ben duy nhat la trong repo. Cap nhat bang tay:

```bash
cd /home/user/ghi-nho/cong-cu/skills
for s in doubt-driven-development constraint-driven-development code-simplification; do
  curl -s -o "$s/SKILL.md" "https://raw.githubusercontent.com/addyosmani/agent-skills/main/skills/$s/SKILL.md"
done
curl -s -o constraint-driven-development/references/floor-guard.md \
  "https://raw.githubusercontent.com/addyosmani/agent-skills/main/skills/constraint-driven-development/references/floor-guard.md"
```

Roi `node cong-cu/cai_dat.mjs <repo>` o tung repo de day ban moi xuong.

**May ao chan `api.github.com` cho repo ngoai phien, chan ca HTML `github.com`,
`codeload`, `img.shields.io`.** Chi `raw.githubusercontent.com` di duoc — do la ly do
lenh tren dung `curl` tung file thay vi tai ca repo.
