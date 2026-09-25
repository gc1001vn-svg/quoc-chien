# For Jules (and any agent without Claude's tools)

`AGENTS.md` points here. Read this instead of its "Đầu phiên" section.

- Skip "Đầu phiên": the memory repo `ghi-nho` is private and unreachable for you. Do not
  call `add_repo` or try to clone it. Your task text is the spec.
- Setup: `npm ci`.
- Check before you finish: `npm run lint && npm run typecheck && npm test`.
  Not `npm run do` — it needs API keys you do not have.
- The "Ba luật cứng" section of `AGENTS.md` applies to you (pure TS in `src/sim/`, numbers
  in `data/*.json`, performance ceilings in `docs/TECH_SPEC.md` section 2).
- Do not stop to ask for approval; write assumptions in your report and continue.
