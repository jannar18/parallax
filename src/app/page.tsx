import Image from "next/image";
import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";
import HeroBrandVisual from "@/components/interactive/HeroBrandVisual";
import ArtifactBar from "@/components/interactive/ArtifactBar";
import SplitViewMerge from "@/components/interactive/SplitViewMerge";
import MergeVideo from "@/components/interactive/MergeVideo";
/**
 * Home page — viewport-fitted sections ("slides").
 *
 * Each section fills exactly 100vh so the page reads like a sequence
 * of full-screen views, matching the Asimov Collective pattern.
 * Typography and spacing use viewport units to scale with the window.
 */
export default function HomePage() {
  const nowEntries = getAllNowEntries();
  const artifacts = nowEntries
    .filter((e) => e.image)
    .map(({ slug, date, mood, image, project, description }) => ({
      slug,
      date,
      mood,
      image: image!,
      project,
      description,
    }));

  return (
    <div>
      {/* ─── Section 1: Hero ─── */}
      <HeroBrandVisual />

      {/* ─── Section 2: Split A — visual left, text right ─── */}
      <section className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "var(--color-paper)",
            backgroundImage: "url(/textures/paper.png)",
            backgroundSize: "cover",
          }}
        >
          {/* Dial back paper texture intensity */}
          <div className="absolute inset-0 bg-paper/70" />
          <Image
            src="/images/homepage/processed/arch-split-riso.png"
            alt="Architecture split view"
            fill
            className="object-cover"
            style={{ mixBlendMode: "multiply" }}
            unoptimized
          />
        </div>
        <div className="flex items-center bg-paper px-[5vw] py-[5vh]">
          <div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
            >
              Architectural Design
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)" }}
            >
              One year ago I was finishing a 5 year accredited architecture
              program at Illinois Tech. I was on track to follow the traditional
              path towards becoming a Licensed Architect through NCARB, but as I
              was nearing graduation I looked at the rapidly changing world
              around me, I looked at my field which seemed stuck in time...
            </p>
          </div>
        </div>
      </section>

      {/* ─── Section 3 + Merge: Split B → architecture visual slides in ─── */}
      <SplitViewMerge />

      {/* ─── Section 5: Merged — architecture + software as one ─── */}
      <section className="relative h-screen overflow-hidden bg-ink">
        <MergeVideo />
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
              This site collects my ongoing work, experiments, research notes
              and observations.
            </p>
          </div>
        </div>

        {/* Links — shared 1/3 zone (bottom of slide 7 = top of slide 8) */}
        <div className="h-[33.33vh] flex items-center justify-center border-t border-border">
          <nav className="flex gap-[4vw]">
            <Link
              href="/work/architecture"
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-scarlet"
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
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-scarlet"
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
              className="group flex items-center gap-2 font-sans text-ink transition-colors hover:text-scarlet"
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

        {/* Studio desk — artifact bar (lower 2/3 of virtual slide 8) */}
        <ArtifactBar artifacts={artifacts} />
      </section>
    </div>
  );
}
