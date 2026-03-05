import Link from "next/link";

const featuredWork = [
  {
    type: "Architecture",
    title: "Translation Of History",
    summary: "Adaptive reuse and civic memory expressed through sequence and section.",
  },
  {
    type: "Software / AI",
    title: "Context Mapping Toolkit",
    summary:
      "A system for turning fuzzy research notes into actionable, linked thinking artifacts.",
  },
  {
    type: "Architecture",
    title: "Arroyo Campus",
    summary: "Landscape, circulation, and light composed as a learning environment.",
  },
  {
    type: "Software / AI",
    title: "Studio Update Pipeline",
    summary:
      "A publishing workflow that turns short daily inputs into structured site entries.",
  },
];

const writingPreview = [
  "On Drawing As Interface",
  "Notes On Systems, Rooms, And Time",
  "Why The Site Is The Bridge",
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-content px-5 py-12 md:py-16">
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-10">
            <p
              className="font-sans text-xs uppercase text-ink-lighter"
              style={{ letterSpacing: "var(--tracking-wider)" }}
            >
              Homepage Wireframe v2
            </p>
            <div className="mt-6 grid gap-10 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <h1 className="text-5xl font-light text-ink md:text-6xl lg:text-7xl">
                  Architecture practice and software practice, held in one field.
                </h1>
                <p className="mt-7 max-w-text text-lg leading-relaxed text-ink-light">
                  Front-page thesis + oversized image field. This block is intentionally
                  large to represent the Asimov-style hero moment.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-ink px-5 py-2 font-sans text-sm text-ink"
                  >
                    View Work
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-background px-5 py-2 font-sans text-sm text-ink-light"
                  >
                    Open Now
                  </button>
                </div>
              </div>
              <div className="md:col-span-5">
                <p className="font-mono text-xs text-ink-lighter">Hero Visual Block</p>
              </div>
            </div>
            <div className="mt-8 h-[52vh] min-h-[360px] rounded-2xl border border-border bg-background md:h-[62vh]" />
            <p className="mt-3 font-mono text-xs text-ink-lighter">
              Large media container placeholder (full-width image/video/collage)
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-content px-5 py-20 md:py-24">
          <p
            className="font-sans text-xs uppercase text-ink-lighter"
            style={{ letterSpacing: "var(--tracking-wider)" }}
          >
            The Bridge
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-background p-8 md:p-10">
              <p className="font-sans text-sm text-ink-lighter">Architecture</p>
              <h2 className="mt-3 text-3xl font-light text-ink md:text-4xl">
                Space, sequence, and material.
              </h2>
              <p className="mt-5 max-w-text text-base leading-relaxed text-ink-light">
                Projects organized as pages, not galleries. Drawings breathe. Scale
                and order carry meaning.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-background p-8 md:p-10">
              <p className="font-sans text-sm text-ink-lighter">Software / AI</p>
              <h2 className="mt-3 text-3xl font-light text-ink md:text-4xl">
                Systems, tools, and live workflows.
              </h2>
              <p className="mt-5 max-w-text text-base leading-relaxed text-ink-light">
                Technical work shown as craft: pragmatic tools, research notes, and
                experiments that ship.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-content px-5 py-20 md:py-24">
          <div className="flex items-end justify-between gap-8">
            <h2 className="text-4xl font-light text-ink md:text-5xl">Selected Work</h2>
            <Link href="/work" className="font-sans text-sm">
              View all work
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredWork.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="h-64 rounded-xl border border-border/70 bg-background md:h-72" />
                <p className="mt-5 font-sans text-xs uppercase text-ink-lighter">
                  {item.type}
                </p>
                <h3 className="mt-2 text-2xl font-light text-ink">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-light">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-content gap-8 px-5 py-20 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p
              className="font-sans text-xs uppercase text-ink-lighter"
              style={{ letterSpacing: "var(--tracking-wider)" }}
            >
              Studio Desk
            </p>
            <h2 className="mt-4 text-4xl font-light text-ink md:text-5xl">Now</h2>
            <p className="mt-5 max-w-text text-base leading-relaxed text-ink-light">
              Daily signal section. One line on sparse days, richer artifacts on
              deep days. Always intentional.
            </p>
            <Link href="/now" className="mt-6 inline-block font-sans text-sm">
              Open now page
            </Link>
          </div>
          <div className="md:col-span-7">
            <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <p className="font-mono text-xs text-ink-lighter">2026-03-04</p>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                Refined homepage narrative sequence from Asimov references. Mapping
                wireframe blocks to real content next.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-24 rounded-lg border border-border bg-surface" />
                <div className="h-24 rounded-lg border border-border bg-surface" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-content px-5 py-20 md:py-24">
          <h2 className="text-4xl font-light text-ink md:text-5xl">Writing</h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {writingPreview.map((title) => (
              <article
                key={title}
                className="flex flex-col justify-between gap-4 py-6 md:flex-row md:items-center"
              >
                <h3 className="text-2xl font-light text-ink">{title}</h3>
                <span className="font-sans text-sm text-ink-lighter">Read</span>
              </article>
            ))}
          </div>
          <div className="mt-14 rounded-2xl border border-border bg-background p-10 md:p-14">
            <p className="font-sans text-sm uppercase text-ink-lighter">Parallax</p>
            <p className="mt-4 max-w-text text-3xl font-light leading-tight text-ink md:text-4xl">
              The site itself should demonstrate the bridge, not explain it.
            </p>
            <div className="mt-8 h-52 rounded-xl border border-border bg-surface md:h-72" />
            <p className="mt-3 font-mono text-xs text-ink-lighter">
              Closing image container placeholder
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
