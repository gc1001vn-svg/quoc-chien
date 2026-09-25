# For Jules (and any agent without Claude's tools)

`AGENTS.md` points here. Read this instead of its "Đầu phiên" section.

- Skip "Đầu phiên": the memory repo `ghi-nho` is private and unreachable for you. Do not
  call `add_repo` or try to clone it. Your task text is the spec.
- Setup: `npm ci` (sessions start WITHOUT `node_modules`; measured 10.6 s). Never
  `npm install`, never delete `node_modules` or `package-lock.json`.
- Check before you finish: `npm run kiem:cheo -- --file <comma-separated ## Files list>`.
  It runs lint, typecheck, tests and `sim:tran`, and writes `kiem_cheo.json`. **Add
  `kiem_cheo.json` to your patch** — the reviewer re-runs the same command and compares the
  two files by machine (`--so-sanh`). Numbers you type by hand are not accepted.
  Not `npm run do` — it needs API keys you do not have.
- The "Ba luật cứng" section of `AGENTS.md` applies to you (pure TS in `src/sim/`, numbers
  in `data/*.json`, performance ceilings in `docs/TECH_SPEC.md` section 2).
- Do not stop to ask for approval; write assumptions in your report and continue.
