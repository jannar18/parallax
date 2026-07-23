import Image from "next/image";
import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";

const paths = [
  {
    number: "01",
    title: "Software + AI",
    description:
      "Tools, prototypes, and experiments at the edge of design and computation.",
    href: "/work/software",
  },
  {
    number: "02",
    title: "Architecture",
    description:
      "Spatial work, drawings, models, and questions about how we make places.",
    href: "/work/architecture",
  },
  {
    number: "03",
    title: "Writing",
    description:
      "Notes on building, learning, design, cities, and working with intelligence.",
    href: "/writing",
  },
  {
    number: "04",
    title: "The archive",
    description:
      "A living studio desk: fragments, process, references, and work in progress.",
    href: "/archive",
  },
];

export default function HomePage() {
  const artifacts = getAllNowEntries()
    .filter((entry) => entry.image)
    .slice(0, 6);

  return (
    <main className="bg-paper text-ink">
      <section className="relative flex min-h-screen flex-col justify-between px-[5vw] pb-[7vh] pt-[22vh]">
        <div className="max-w-[76rem]">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-light md:text-xs">
            Julianna Roberts · architect + AI-native designer/builder
          </p>
          <h1 className="mt-6 max-w-[14ch] font-serif text-[clamp(3.5rem,10vw,9.5rem)] font-semibold italic leading-[0.84] tracking-[-0.045em] text-ink">
            Welcome to my living studio.
          </h1>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ink/20 pt-6 md:grid-cols-12">
          <p className="max-w-[36rem] text-[clamp(1rem,1.45vw,1.3rem)] leading-relaxed text-ink-light md:col-span-7">
            I trained as an architect and now build with AI. This is where
            spatial thinking, software, research, and unfinished ideas live
            together—not as separate careers, but as one evolving practice.
          </p>
          <p className="font-mono text-xs uppercase leading-relaxed tracking-wider text-ink-lighter md:col-span-3 md:col-start-10">
            Built in public
            <br />
            Edited as I learn
            <br />
            Never quite finished
          </p>
        </div>
      </section>

      <section className="border-t border-ink/20 px-[5vw] py-[12vh]">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-scarlet">
              Start anywhere
            </p>
            <h2 className="mt-4 max-w-[9ch] font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold italic leading-none">
              Four doors into my world.
            </h2>
          </div>

          <nav className="md:col-span-7 md:col-start-6">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group grid grid-cols-[2.5rem_1fr_auto] gap-3 border-t border-ink/20 py-7 transition-colors last:border-b hover:text-scarlet"
              >
                <span className="font-mono text-xs text-ink-lighter">
                  {path.number}
                </span>
                <span>
                  <span className="block font-serif text-[clamp(1.8rem,3vw,3rem)] font-semibold italic leading-none">
                    {path.title}
                  </span>
                  <span className="mt-2 block max-w-[34rem] text-sm leading-relaxed text-ink-light md:text-base">
                    {path.description}
                  </span>
                </span>
                <span className="text-xl transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-oxblood px-[5vw] py-[14vh] text-paper" data-nav-dark>
        <p className="font-mono text-xs uppercase tracking-wider text-paper/55">
          What I keep returning to
        </p>
        <p className="mt-10 max-w-[18ch] font-serif text-[clamp(2.7rem,7vw,7rem)] font-semibold italic leading-[0.98]">
          The interface between people, space, and intelligent tools.
        </p>
        <div className="mt-20 grid gap-8 border-t border-paper/25 pt-8 text-sm leading-relaxed text-paper/70 md:grid-cols-3 md:text-base">
          <p>
            Architecture taught me to hold systems, stories, materials, and
            human behavior in the same frame.
          </p>
          <p>
            Software lets me turn those frames into things people can touch,
            test, change, and use.
          </p>
          <p>
            AI makes the boundary between imagining and building unusually
            thin. I want to learn what belongs on the other side.
          </p>
        </div>
      </section>

      <section className="px-[5vw] py-[12vh]">
        <div className="flex flex-col gap-5 border-b border-ink/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-scarlet">
              From the studio desk
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold italic leading-none">
              Recent fragments
            </h2>
          </div>
          <Link
            href="/archive"
            className="font-mono text-xs uppercase tracking-wider text-ink-light transition-colors hover:text-scarlet"
          >
            Enter the full archive &rarr;
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-12 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((artifact) => (
            <Link
              key={artifact.slug}
              href={`/archive#${artifact.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                <Image
                  src={artifact.image!}
                  alt={artifact.description || artifact.project || "Studio artifact"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  unoptimized
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl font-semibold italic leading-tight group-hover:text-scarlet">
                    {artifact.project || artifact.mood}
                  </p>
                  {artifact.description && (
                    <p className="mt-1 text-sm leading-relaxed text-ink-light">
                      {artifact.description}
                    </p>
                  )}
                </div>
                <time className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-ink-lighter">
                  {artifact.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/20 px-[5vw] py-[14vh]">
        <div className="max-w-[64rem]">
          <p className="font-serif text-[clamp(2.5rem,6vw,6rem)] font-semibold italic leading-[1.02]">
            I’m interested in work that makes the future feel more human,
            spatial, useful, and alive.
          </p>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs uppercase tracking-wider">
            <Link href="/about" className="text-scarlet hover:text-ink">
              More about me &rarr;
            </Link>
            <Link href="/work" className="text-scarlet hover:text-ink">
              Selected work &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
