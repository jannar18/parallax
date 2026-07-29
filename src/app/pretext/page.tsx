import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pretext",
  description:
    "Interactive demos built with Pretext — Cheng Lou's pure JS/TS library for multiline text measurement and layout.",
};

const demos = [
  {
    slug: "sierpinski-carpet-photo",
    title: "Sierpinski Photo Carpet",
    description:
      "Photo-mapped Sierpinski carpet — a source image is sampled into the fractal grid, carving holes across recursion levels while preserving the photographic texture.",
    file: "/pretext/demos/sierpinski-carpet-photo.html",
  },
  {
    slug: "sierpinski-carpet-photo-responsive",
    title: "Sierpinski Photo Carpet (Responsive)",
    description:
      "Responsive variant of the photo carpet — adapts to viewport size, stretching the fractal grid to fill available space while maintaining the photographic source mapping.",
    file: "/pretext/demos/sierpinski-carpet-photo-responsive.html",
  },
  {
    slug: "sierpinski-carpet-v2",
    title: "Sierpinski Carpet",
    description:
      "Fractal text carpet — quotes fill an 81x81 grid that carves itself into a Sierpinski carpet across four recursion levels. Split-panel: geometric source field on the left, ASCII text carpet on the right.",
    file: "/pretext/demos/sierpinski-carpet-v2.html",
  },
  {
    slug: "julia-carpet",
    title: "Julia Set Carpet",
    description:
      "Julia set mapped to text — escape-time iterations determine which cells fill with scrolling quotes. Four presets (Dendrite, Spiral, Twist, Rabbit) with a continuous iteration threshold slider.",
    file: "/pretext/demos/julia-carpet.html",
  },
];

export default function PretextPage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <section className="pb-16 pt-24 md:pb-24 md:pt-40">
        <p
          className="mt-4 max-w-text text-ink-light leading-relaxed font-sans"
          style={{ fontSize: "clamp(0.875rem, 1.3vw, 1.2rem)" }}
        >
          My experiments using{" "}
          <a
            href="https://github.com/chenglou/pretext"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-ink-lighter underline-offset-2 transition-colors hover:text-scarlet hover:decoration-scarlet"
          >
            Pretext
          </a>
          , Cheng Lou&rsquo;s pure JS/TS library for text measurement and
          layout.
        </p>

        <div className="mt-10 grid gap-6 md:mt-16 md:gap-8 md:grid-cols-2">
          {demos.map((demo) => (
            <a
              key={demo.slug}
              href={demo.file}
              className="group block rounded-sm border border-border bg-surface p-5 md:p-8 transition-all duration-300 hover:border-scarlet/40 hover:shadow-lg"
            >
              {/* Dark preview strip */}
              <div className="mb-4 flex h-24 items-center justify-center rounded-sm bg-[#111111] md:mb-6 md:h-32">
                <span
                  className="font-mono uppercase tracking-widest text-[#fdf0d5]/30 transition-colors group-hover:text-[#cc2936]/60"
                  style={{ fontSize: "0.65rem" }}
                >
                  {demo.title}
                </span>
              </div>

              <h2
                className="font-serif font-bold italic text-ink transition-colors group-hover:text-scarlet"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
              >
                {demo.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">
                {demo.description}
              </p>
              <span
                className="mt-4 inline-block font-mono uppercase tracking-wide text-ink-lighter transition-colors group-hover:text-scarlet"
                style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.825rem)" }}
              >
                Launch demo &rarr;
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-ink-lighter transition-colors hover:text-scarlet"
            >
              GitHub &nearr;
            </a>
            <a
              href="https://chenglou.me/pretext/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-ink-lighter transition-colors hover:text-scarlet"
            >
              Official Demos &nearr;
            </a>
            <a
              href="https://x.com/_chenglou/status/2037713766205608234"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-ink-lighter transition-colors hover:text-scarlet"
            >
              @_chenglou &nearr;
            </a>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide text-ink-lighter transition-colors hover:text-scarlet"
          >
            &larr; Back home
          </Link>
        </div>
      </section>
    </div>
  );
}
