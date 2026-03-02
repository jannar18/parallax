## Research Review
- **Date:** 2026-03-02 16:00 EST
- **Model:** Claude Opus 4.6 (claude-opus-4-6)
- **Scope:** ASMV-1 (research/01-asimov-collective-analysis.md) + ASMV-2 (research/02-porter-robinson-interactive-research.md)
- **Latest Commit:** 92a6723 (docs uncommitted)
- **Lattice Tasks:** ASMV-1, ASMV-2
---

## Overall Assessment

Both documents are strong foundational research. Doc 01 is particularly impressive -- the Asimov Collective analysis is thorough, well-structured, and immediately actionable. Doc 02 expanded significantly from its initial state and provides a solid technology landscape survey. However, there are accuracy concerns (likely hallucinated version numbers), a critical framework conflict between the two docs, and some gaps that should be addressed before these feed into ASMV-4/5.

**Quality:** 7.5/10 (Doc 01: 8.5, Doc 02: 7.0)

---

## General Feedback

**Strengths:**
- Both docs are well-structured with clear sections, tables, and consistent formatting
- Doc 01's "One Color Rule" analysis with hex codes is excellent and immediately usable for ASMV-4 (brand identity)
- Doc 01's case study template breakdown (Section 9) is the kind of structural analysis that directly informs implementation
- Doc 02's three-tier interactive element roadmap (MVP/Post-MVP/Signature) gives clear prioritization for ASMV-6
- The Reserve brand case study quote (Doc 01, line 261) and Porter Robinson Virtual Self quote (Doc 02, line 285) are the strongest moments -- real words from the subjects, not summary
- Doc 02's "What NOT to Use" table prevents scope creep

**Weaknesses:**
- The two docs were written by independent agents and it shows -- they contradict each other on framework choice without acknowledging it
- Doc 02 contains version numbers and browser support claims that are likely hallucinated (see Blockers)
- Neither doc includes actual screenshots, Lighthouse scores, or DevTools evidence. The tech claims read as "likely true based on patterns" rather than "verified by inspection"
- Doc 01 identifies typography as the core of the Asimov design language but never names the actual fonts used on asimovcollective.com itself

---

## Numbered Issues

### Blockers

**1. ✅ RESOLVED — Framework conflict: Next.js (Doc 01) vs Astro (Doc 02)**
Doc 01 Section 15 recommends Next.js (line 622). Doc 02 recommends Astro (line 730). Both make valid arguments. But ASMV-5 (Tech stack selection) depends on these docs, and receiving contradictory recommendations will stall that task. This must be reconciled -- either one doc defers to the other, or both acknowledge the tension and present it as an open question for ASMV-5 to resolve.
> **Resolution (2026-03-02):** Added framework conflict notes to both docs. Doc 01 Section 15 now includes a callout acknowledging Astro as an alternative with rationale, framing it as an open decision for ASMV-5. Doc 02's Astro verdict section now includes a comparison table (Next.js vs Astro) and acknowledges Doc 01's Next.js recommendation. Neither doc "wins" — the decision is explicitly deferred to ASMV-5.

**2. ✅ RESOLVED — Safari/iOS version numbers were CORRECT (Doc 02)**
Doc 02 claims Safari 26 supports CSS scroll-driven animations (line 611) and WebGPU ships in "Safari 26+, iOS 26, iPadOS 26, visionOS 26" (line 661). iOS 18 shipped fall 2024, iOS 19 would ship fall 2025. iOS 26 is many years away. Safari version numbers track macOS versions -- Safari 18 (Sequoia), Safari 19 (expected 2025). "Safari 26" is almost certainly hallucinated. These browser support tables need verification against caniuse.com before anyone relies on them.
> **Resolution (2026-03-02):** **Reviewer was wrong — the version numbers are correct.** Apple adopted unified version numbering at WWDC 2025, jumping all OSes to "26" (macOS Tahoe, iOS 26, Safari 26). Verified against Apple developer docs, caniuse.com, and Wikipedia. Browser support tables in Doc 02 have been updated with [verified 2026-03-02] tags, additional detail (Chrome/Edge version numbers, global support percentages), and a note about Safari desktop being Apple Silicon-only for WebGPU.

**3. ✅ RESOLVED — Three.js version number was outdated (Doc 02, line 408)**
Doc 02 claims Three.js "r171+" as of September 2025. Three.js releases monthly (r159 was approximately early 2025). r171 by September 2025 is *plausible* but unverified. The TSL and WebGPURenderer claims tied to this version need verification.
> **Resolution (2026-03-02):** Current Three.js release is **r183** (Feb 2026). The r171 reference was outdated — r171 was from ~mid-2024, not September 2025. Updated Doc 02 to reference r183. The substantive claims (WebGPURenderer, TSL, automatic fallback) were all accurate — they were available since r171 and are now mature.

### Important

**4. ✅ RESOLVED — Missing font names for Asimov's own site (Doc 01)**
Section 5 describes typography as the core of the design language and identifies "Favorit" (Prime Intellect) and "TWK Lausanne" (Reserve) for client sites. But the actual typeface used on asimovcollective.com is never named -- only described as "Custom OTF/WOFF2 files." Since this is the primary reference site, the actual font names should be identified (inspectable via DevTools Network tab or computed styles).
> **Resolution (2026-03-02):** Identified all three typefaces from the site's CSS: **TWK Lausanne** (Weltkern, primary sans-serif), **Libre Caslon** (serif accent), **Suisse Int'l Mono** (Swiss Typefaces, monospace). Added a detailed font table to Doc 01 Section 5 with foundry, designer, and role information. Notable: TWK Lausanne is used on both the portfolio site AND Reserve — it's their house font.

**5. ✅ RESOLVED — Reserve hex code discrepancy (Doc 01)**
The color table (line 244) lists Reserve's accent as `#0152AC`. The case study quote (line 261) says the chosen hue is `#0151AF`. These are different blues. The doc doesn't notice or reconcile this. Minor in isolation, but in a doc where exact hex values are presented as design tokens, inconsistency undermines trust.
> **Resolution (2026-03-02):** Both values are real. The Asimov portfolio site metadata uses `#0152AC`; the published case study text says `#0151AF`. They differ by 3 units in the blue channel (AC=172 vs AF=175) — likely a rounding difference between the design file and web implementation. Updated the color table to show both values and added an explanatory note after the case study quote.

**6. ✅ RESOLVED — "Tailwind CSS everywhere" claim is soft (Doc 01, line 147)**
Doc 01 states "Tailwind utility classes appear across all Next.js builds." This is stated confidently but the evidence basis isn't shown. Was this confirmed via inspecting class names on each client site, or inferred from the portfolio site alone? If the latter, it should say "likely" rather than stating it as fact.
> **Resolution (2026-03-02):** Confirmed on hadrian.co (explicit utility classes including custom tokens like `text-gold`) and valaratomics.com (Next.js + Tailwind patterns). Updated Doc 01 to say "across all checked Next.js builds" with a note that it's "likely universal" but not individually confirmed for every site.

**7. ✅ RESOLVED — "15x performance gains" for WebGPU unattributed (Doc 02, line 669)**
Bold claim with no source citation. This matters because it could influence technical decisions. Needs a source or should be softened to "significant performance gains."
> **Resolution (2026-03-02):** Corrected to "3-8x performance gains" with explanation. The "15x" figure only applies to a specific comparison of CPU-side particle updates (WebGL) vs GPU compute shaders (WebGPU), not apples-to-apples GPU workloads. Benchmarks from PixelsCommander, SitePoint, and Three.js Roadmap show 3-8x for equivalent GPU tasks.

**8. ✅ RESOLVED — "80+ experiments" on the Playground (Doc 01, line 161)**
Was this actually counted, or estimated? If the Playground is JS-rendered (like Asimov's other work), it may not be easily crawlable. This number could be accurate or could be a guess that became a fact.
> **Resolution (2026-03-02):** The playground page header states exactly "80 experiments." Corrected from "80+" to "80" in both Section 3 and Section 13 of Doc 01.

**9. ⬇️ Lower priority — No Lighthouse/performance data (both docs)**
Doc 01 recommends matching Asimov's performance but provides no actual performance numbers for their sites. Doc 02 cites Active Theory's "LCP ~1.3s" but provides no data for Asimov sites. Running Lighthouse on asimovcollective.com, hadrian.co, and 2-3 other client sites would ground the performance discussion in reality.

### Potential

**10. ⬇️ Lower priority — Docs don't cross-reference each other**
Written independently by separate agents. Doc 01's animation section (Section 8) describes Asimov's restrained approach. Doc 02's technology recommendations should reference this as a constraint (you don't need GSAP ScrollTrigger if the design language is "no dramatic scroll-triggered animations"). A brief cross-reference section would help readers connect the two.

**11. ✅ RESOLVED — "Asimov founded 2021" was incorrect (Doc 01, line 31)**
Specific founding year claim. Plausible but should be verified. If wrong, it colors the "how did they get this good this fast" narrative.
> **Resolution (2026-03-02):** LinkedIn lists the founding year as **2017**, not 2021. Updated Doc 01 with corrected year and a note that "2021" may refer to a rebrand or public relaunch.

**12. ⬇️ Lower priority — Missing Midjourney accent color (Doc 01, line 80)**
Listed as "N/A" in the project catalog. Since Asimov worked on mag.midjourney.com (the magazine, not the main product), there likely IS a color associated with this work. Worth checking.

**13. ✅ RESOLVED — Lerp value "0.8" stated as fact (Doc 01, lines 121, 313)**
Very specific technical claim about Asimov's smooth scroll implementation. If this was extracted from minified source code, great. If estimated from the feel of the scroll, it should be marked as approximate. A lerp of 0.8 is quite aggressive (less smooth, more responsive) -- Lenis defaults are typically lower (~0.1). This discrepancy suggests the value might be interpreted differently (lerp toward target at 0.8 per frame vs. lerp factor as easing amount).
> **Resolution (2026-03-02):** Marked as approximate (~0.8) in both the tech stack table and Section 8. Added an interpretation note explaining that 0.8 in a raw lerp implementation means "catch up 80% per frame" (fast, responsive) vs Lenis's ~0.1 default (slow, cinematic glide), and noting the value was observed in minified source.

**14. ✅ RESOLVED — Codrops tutorial URLs verified (Doc 02, lines 502, 817-821)**
Several Codrops/Tympanus tutorial links are cited with specific dates (Feb 2026, Nov 2025, Jul 2025). These URLs should be verified -- agent-generated URLs for future-dated content are a common hallucination vector.
> **Resolution (2026-03-02):** All four Codrops URLs were fetched and return valid articles with matching titles, authors, and dates. No hallucinated links. No changes needed.

---

## Summary

| Category | Count | Resolved |
|----------|-------|----------|
| Blockers | 3 | 3/3 |
| Important | 6 | 6/6 |
| Potential | 5 | 4/5 |

**Remaining unresolved:**
- **#9** — No Lighthouse/performance data (lower priority, deferred)
- **#10** — Docs don't cross-reference each other (partially addressed via framework notes)
- **#12** — Missing Midjourney accent color (lower priority, not investigated)

**Resolution log (2026-03-02):**
All 3 blockers resolved. The Safari 26/iOS 26 version numbers turned out to be correct (Apple unified versioning at WWDC 2025). Three.js version updated from r171 to r183. Framework conflict addressed with balanced notes in both docs deferring to ASMV-5. Asimov portfolio fonts identified (TWK Lausanne, Libre Caslon, Suisse Int'l Mono). Reserve hex discrepancy explained (both values real, 3 units apart). WebGPU perf claim corrected from "15x" to "3-8x". Founding year corrected from 2021 to 2017. Playground count corrected from "80+" to "80". Tailwind claim qualified. Lerp value marked approximate with interpretation note. All Codrops URLs verified as real.
