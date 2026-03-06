# ASMV-45: Update hardcoded old palette colors in hero-canvas.ts and HeroBrandVisual.tsx

hero-canvas.ts:68-69 hardcodes BG_COLOR=#F5F0E8 (old Cream, should be #FDFCEA Paper) and INK_RGB=44,40,36 (old Ink, should be 71,31,32 Oxblood). HeroBrandVisual.tsx lines 189,205,219,233,241 hardcode rgba(44,40,36,...) — should be rgba(71,31,32,...). Both render with pre-Riso colors. Found by all 4 agents (B3, I1).
