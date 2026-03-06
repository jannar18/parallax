# ASMV-42: Fix ArtifactBar hover state (vermillion-light = vermillion, no visual feedback)

ArtifactBar.tsx:168 uses text-vermillion hover:text-vermillion-light but both resolve to #f65058 in tailwind.config.ts:21. The hover is a no-op — zero visual change. Fix: use text-scarlet hover:text-scarlet-dark for actual hover feedback.
