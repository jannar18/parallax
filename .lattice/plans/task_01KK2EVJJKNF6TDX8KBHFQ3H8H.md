# ASMV-38: Follow team review standard instructions

Scope: Execute the repository-audit review workflow defined in `notes/.tmp/team-review-standard.md` for ASMV-24 on `main`, then produce a timestamped review report in `notes/`.

Approach:
1. Run required validation commands in order (`pnpm lint`, `pnpm build`) and capture any blockers.
2. Audit the key repository files directly (agent docs, PRD, brand/tokens, core UI/style files) to confirm or reject each stated concern and find additional issues.
3. Draft a review report at `notes/CR-ASMV-24-Codex-Standard-[YYYYMMDD-HHMM].md` using required header and severity sections (Blockers, Important, Potential) with file/line references.
4. Perform a validation pass on Blocker/Important findings by re-reading code and confirming they are accurate and in current repo state, marking each finding with status indicators.
5. Share the created review filename and concise findings summary back to the user.

Acceptance criteria:
- Required lint/build checks executed and results documented.
- Review file created in `notes/` with required naming, metadata, and numbered findings.
- Findings are validated and annotated inline per the spec.
