# ASMV-88: Site-wide bug audit — review for critical issues beyond reported list

Companion to ASMV-82 through ASMV-87. After fixing the user-reported bugs, do a fresh-eyes regression sweep across the site:

- Walk the homepage end-to-end on desktop AND mobile (DevTools emulation + real device if possible)
- /work/architecture, /work/software, /writing, /pretext, /archive
- All popovers (ArtifactBar centered popover, ArtifactPopover)
- Check console for errors / hydration warnings / 404s
- Check Network for >2s asset loads, large unoptimized images, dangling video preloads
- Check Lighthouse mobile score (Performance, Accessibility)
- Check Vercel deploy logs for warnings

Output: a written findings report at notes/site-audit-2026-04-10.md with severity-tagged issues. Spawn follow-up Lattice tasks for anything critical.
