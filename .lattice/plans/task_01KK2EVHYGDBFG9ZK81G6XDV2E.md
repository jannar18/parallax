# ASMV-37: Address instructions from team-review-critical

Scope: Execute the critical repo-audit workflow from `notes/.tmp/team-review-critical.md` for ASMV-24 on `main`, including required verification commands and a documented review artifact.

Approach:
1. Run required validation commands in order (`pnpm lint`, then `pnpm build`) and capture pass/fail counts.
2. Audit the referenced documentation and implementation files for drift/misalignment by reading source directly.
3. Produce adversarial analysis (new-agent failure modes) and convert verified issues into severity-ranked findings with file/line references.
4. Create `notes/CR-ASMV-24-GPT5-Critical-<timestamp>.md` with required header and sections, including validation status markers for Blocker/Important findings.
5. Update Lattice status/comments through review and done with summary of outputs.

Acceptance criteria:
- Required commands executed and results reflected in report.
- Review file exists at required path/name format and includes all mandated sections.
- Findings are evidence-based with explicit file references and validation markers.
- Task log contains completion breadcrumb for next agent/human.
