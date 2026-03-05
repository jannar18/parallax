import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";
/**
 * Home page — viewport-fitted sections ("slides").
 *
 * Each section fills exactly 100vh so the page reads like a sequence
 * of full-screen views, matching the Asimov Collective pattern.
 * Typography and spacing use viewport units to scale with the window.
 */
export default function HomePage() {
  const nowEntries = getAllNowEntries().map(({ slug, date, mood }) => ({
    slug,
    date,
    mood,
  }));

  return (
    <div>
      {/* ─── Section 1: Hero ─── */}
      <section className="relative flex h-screen items-center justify-center bg-slate px-[5vw]">
        <div className="text-center">
          <h1
            className="font-light tracking-tighter text-cream"
            style={{
              fontSize: "clamp(3rem, 6vw, 7rem)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            Parallax
          </h1>
          <p
            className="mx-auto mt-[2vh] max-w-text text-cream/80 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
          >
            Depth revealed through perspective.
          </p>
        </div>
      </section>

      {/* ─── Section 2: Split A — visual left, text right ─── */}
      <section className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-center bg-dusty-rose px-[5vw] py-[5vh]">
          {/* Visual / image placeholder */}
        </div>
        <div className="flex items-center bg-cream px-[5vw] py-[5vh]">
          <div>
            <h2
              className="font-light text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
            >
              Heading placeholder
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              Body text placeholder. A brief passage that introduces the theme
              or narrative thread of this section.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Split B — text left, visual right ─── */}
      <section className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex items-center bg-cream px-[5vw] py-[5vh]">
          <div>
            <h2
              className="font-light text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
            >
              Heading placeholder
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              Body text placeholder. A complementary passage that deepens the
              narrative or introduces a second thread.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-sage px-[5vw] py-[5vh]">
          {/* Visual / image placeholder */}
        </div>
      </section>

      {/* ─── Section 4: Split C (50/50) — text in both columns ─── */}
      <section className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex items-center bg-dusty-rose px-[5vw] py-[5vh]">
          <div>
            <h2
              className="font-light text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
            >
              Heading placeholder
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              Body text placeholder. One side of a dialogue — architecture,
              structure, the built environment.
            </p>
          </div>
        </div>
        <div className="flex items-center bg-sage px-[5vw] py-[5vh]">
          <div>
            <h2
              className="font-light text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
            >
              Heading placeholder
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              Body text placeholder. The other side — software, systems,
              digital craft.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Merged — architecture + software converged ─── */}
      <section className="grid h-screen grid-cols-3">
        <div className="bg-dusty-rose" />
        <div className="bg-warm-gray" />
        <div className="bg-sage" />
      </section>

      {/* ─── Sections 7+8: Text → Links (shared) → Studio Desk ───
          This is ONE continuous block, not two h-screen sections.
          The links are a single element at the seam:
            - Body text:  ~66vh (top 2/3 of "slide 7")
            - Links:      ~33vh (bottom 1/3 of "slide 7" = top 1/3 of "slide 8")
            - Studio desk: ~66vh (bottom 2/3 of "slide 8")
          Total: ~166vh. The links naturally belong to both views as you scroll. */}
      <section className="bg-background">
        {/* Separator line at viewport boundary */}
        <div className="w-full border-t border-border" />

        {/* Body text — upper 2/3 of virtual slide 7 */}
        <div className="flex h-[66.67vh] items-center justify-center px-[5vw]">
          <div className="max-w-text text-center">
            <p
              className="text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}
            >
              Body text placeholder. A passage about the practice — what ties
              architecture and software together, the philosophy behind the
              work, and what Parallax means as a studio identity. Depth
              revealed through the shifting of perspective across disciplines.
            </p>
          </div>
        </div>

        {/* Links — shared 1/3 zone (bottom of slide 7 = top of slide 8) */}
        <div className="h-[33.33vh] flex items-center justify-center border-t border-border">
          <nav className="flex gap-[4vw]">
            <Link
              href="/work/architecture"
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-terracotta"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Architecture
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/work/software"
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-terracotta"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Software
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/writing"
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-terracotta"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Writing
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </nav>
        </div>

        {/* Studio desk cards — lower 2/3 of virtual slide 8
            Cards don't touch the bottom — ~1/6vh padding below */}
        <div className="flex h-[66.67vh] items-stretch gap-[1vw] pt-[2vh] pb-[11vh]">
          {(nowEntries.length > 0 ? nowEntries.slice(0, 3) : [
            { slug: "placeholder-0", date: "2026-03-01", mood: undefined },
            { slug: "placeholder-1", date: "2026-03-02", mood: undefined },
            { slug: "placeholder-2", date: "2026-03-03", mood: undefined },
          ]).map((entry) => (
            <Link
              key={entry.slug}
              href="/now"
              className="group flex-1 block"
            >
              <div className="h-full rounded-xl bg-warm-gray/30 flex flex-col justify-end overflow-hidden transition-colors group-hover:bg-warm-gray/50">
                <div className="p-[clamp(1rem,1.5vw,1.5rem)]">
                  <p
                    className="font-sans text-ink-lighter uppercase"
                    style={{
                      fontSize: "clamp(0.65rem, 0.8vw, 0.8rem)",
                      letterSpacing: "var(--tracking-wider)",
                    }}
                  >
                    {entry.date}
                  </p>
                  {entry.mood && (
                    <p
                      className="mt-[0.5vh] text-ink-light font-serif italic"
                      style={{ fontSize: "clamp(0.8rem, 1vw, 0.95rem)" }}
                    >
                      {entry.mood}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
