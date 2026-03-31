import Image from "next/image";
import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";
import HeroBrandVisual from "@/components/interactive/HeroBrandVisual";
import ArtifactBar from "@/components/interactive/ArtifactBar";
import SplitViewMerge from "@/components/interactive/SplitViewMerge";
import ClipReel from "@/components/interactive/ClipReel";
import ScrollLine from "@/components/ui/ScrollLine";
/**
 * Home page — viewport-fitted sections ("slides").
 *
 * Each section fills exactly 100vh so the page reads like a sequence
 * of full-screen views, matching the Asimov Collective pattern.
 * Typography and spacing use viewport units to scale with the window.
 */
export default function HomePage() {
  const nowEntries = getAllNowEntries();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const artifacts = nowEntries
    .filter((e) => e.image && new Date(e.date) >= oneWeekAgo)
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

      {/* ─── Spacer: Hero → Section 2 ─── */}
      <div className="h-[25vh] bg-paper flex items-end">
        <ScrollLine origin="right" />
      </div>

      {/* ─── Section 2: Split A — text left, software right ─── */}
      <section className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex items-center bg-paper px-[5vw] py-[5vh]">
          <div>
            <p
              className="font-mono uppercase tracking-wider text-ink-light"
              style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.825rem)" }}
            >
              World 02
            </p>
            <h2
              className="mt-[1.5vh] font-serif font-bold italic text-ink md:whitespace-nowrap"
              style={{ fontSize: "clamp(1.35rem, 3.2vw, 3.25rem)" }}
            >
              Software Development + AI Research
            </h2>
            <p
              className="mt-[2vh] max-w-text text-ink-light leading-relaxed font-sans"
              style={{ fontSize: "clamp(0.875rem, 1.3vw, 1.2rem)" }}
            >
              I spend 10 hours a day 6/7 days a week working with Claude Code,
              building software and strengthening my harness.
            </p>
            <Link
              href="/work/software"
              className="mt-[3vh] inline-flex items-center gap-2 font-mono uppercase tracking-wide text-scarlet transition-colors hover:text-ink"
              style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.825rem)" }}
            >
              View Software Work <span>&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/home/software-split.riso.1.png"
            alt="Software split view"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </section>

      {/* ─── Line: Section 2 → Section 3 ─── */}
      <div className="bg-paper">
        <ScrollLine origin="left" />
      </div>

      {/* ─── Section 3 + Merge: Split B → software visual slides in ─── */}
      <SplitViewMerge />

      {/* ─── Spacer: SplitViewMerge → Video ─── */}
      <div className="h-[25vh] bg-paper flex items-end">
        <ScrollLine origin="center" />
      </div>

      {/* ─── Section 5: Arch Voice clip reel (vertical scroll) ─── */}
      <section className="relative bg-paper">
        <ClipReel />
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
        <ScrollLine origin="center" />

        {/* Body text — upper 2/3 of virtual slide 7 */}
        <div className="flex h-[74vh] items-center justify-center px-[5vw]">
          <div className="max-w-[85vw] md:max-w-[58vw] text-center">
            <p
              className="font-serif font-bold italic text-ink leading-snug"
              style={{ fontSize: "clamp(1.35rem, 3.5vw, 3.75rem)" }}
            >
              I&rsquo;m taking the time to look into the future and predict
              the skills I will need to be successful in the future version of
              my field.
            </p>
            <Link
              href="/archive"
              className="block font-mono text-scarlet uppercase tracking-wide mt-[3vh] transition-colors hover:text-ink"
              style={{ fontSize: "clamp(0.75rem, 1vw, 0.875rem)" }}
            >
              This site collects my ongoing work, experiments, research notes
              and observations.
            </Link>
          </div>
        </div>

        {/* Links — shared 1/3 zone (bottom of slide 7 = top of slide 8) */}
        <ScrollLine origin="center" />
        <div className="h-[30vh] flex items-center justify-center">
          <nav className="flex gap-[4vw]">
            <Link
              href="/work/architecture"
              className="group flex items-center gap-2 font-mono uppercase text-ink transition-colors hover:text-scarlet"
              style={{
                fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Architecture
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/work/software"
              className="group flex items-center gap-2 font-mono uppercase text-ink transition-colors hover:text-scarlet"
              style={{
                fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Software
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/writing"
              className="group flex items-center gap-2 font-mono uppercase text-ink transition-colors hover:text-scarlet"
              style={{
                fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Writing
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/pretext"
              className="group flex items-center gap-2 font-mono uppercase text-ink transition-colors hover:text-scarlet"
              style={{
                fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              Pretext
              <span className="text-ink-lighter transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </nav>
        </div>

        {/* Studio desk — artifact bar (lower 2/3 of virtual slide 8) */}
        <div className="relative">
          <Link
            href="/archive"
            className="absolute top-0 left-0 right-0 text-center font-serif font-bold italic text-ink z-10 -translate-y-1/2 transition-colors hover:text-scarlet"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
          >
            the studio desk
          </Link>
          <ArtifactBar artifacts={artifacts} />
        </div>
      </section>
    </div>
  );
}
