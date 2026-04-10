# ASMV-83: Restore studio desk title + decide background treatment

Two related regressions from commit 9301757 'UI color and layout updates':

(1) Homepage 'the studio desk' italic serif title was REMOVED — replaced with small 'click-in to enter the archives' text on a scarlet/moss color-mixed background block. User wants the title back.

(2) The /archive page (InfiniteCanvas) lost the studio-desk-surface gradient atmosphere (warm radial pool toward bottom) — currently just bg-paper.

NOTE: There are uncommitted local edits in src/app/page.tsx and src/components/interactive/InfiniteCanvas.tsx that ALREADY start to address both. Confirm with user whether those WIP changes are theirs before touching them. The page.tsx WIP positions the title with -translate-y-1/2 which may put it half-cut-off above the ArtifactBar — verify it actually renders correctly. Also: the studio-desk-surface CSS class exists in globals.css line 108 — WIP adds it back to InfiniteCanvas.

User specifically asked us to look at old versions of the repo to recover the original. Title source: pre-9301757 page.tsx. Background source: studio-desk-surface class in globals.css.
