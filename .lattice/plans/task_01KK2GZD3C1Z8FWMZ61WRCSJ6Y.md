# ASMV-46: Replace legacy color aliases with canonical Riso names across codebase

Legacy alias class names (vermillion, bg-cream, bg-forest) used across many files. Also globals.css ::selection uses --color-vermillion/--color-cream. All resolve correctly via aliases but should use canonical names. Search-replace: vermillion→scarlet, bg-cream→bg-paper, bg-forest→bg-spruce, --color-vermillion→--color-scarlet, --color-cream→--color-paper. Files: page.tsx, work/*.tsx, writing/page.tsx, ArtifactBar.tsx, StudioDeskScroll.tsx, globals.css. Found by all 4 agents (C2, C3).
