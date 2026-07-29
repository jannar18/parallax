import Link from "next/link";
import { getAllNowEntries } from "@/lib/content";
import { personalHome } from "@/data/personal-home";

const doors = [
  ["Software", "/work/software", "Tools and experiments"],
  ["Architecture", "/work/architecture", "Spaces and drawings"],
  ["Writing", "/writing", "Ideas in longer form"],
  ["Living archive", "/archive", "Process and fragments"],
] as const;

export default function HomePage() {
  const recent = getAllNowEntries().slice(0, 5);

  return (
    <div className="bg-paper text-ink">
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-10 pt-32 md:px-[5vw] md:pb-[7vh] md:pt-[20vh]">
        <div className="absolute -right-[12vw] top-[18vh] hidden select-none font-serif text-[34vw] font-semibold italic leading-none text-scarlet/[0.07] md:block">
          J
        </div>
        <div className="relative max-w-[78rem]">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-ink-lighter md:text-xs">
            {personalHome.introduction.eyebrow}
          </p>
          <h1 className="mt-7 max-w-[13ch] text-[clamp(3.4rem,9.5vw,9.2rem)] font-semibold italic leading-[0.86] tracking-[-0.045em]">
            {personalHome.introduction.title}
          </h1>
        </div>
        <div className="relative mt-20 grid gap-8 border-t border-ink/20 pt-6 md:grid-cols-12">
          <p className="max-w-[43rem] text-[clamp(1rem,1.5vw,1.35rem)] leading-relaxed text-ink-light md:col-span-7">
            {personalHome.introduction.body}
          </p>
          <p className="font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.13em] text-ink-lighter md:col-span-3 md:col-start-10">
            A living index<br />of work, questions,<br />influences, and change
          </p>
        </div>
      </section>

      <section className="grid border-y border-ink/20 md:grid-cols-2">
        <div className="bg-oxblood px-5 py-20 text-paper md:px-[5vw] md:py-[12vh]" data-nav-dark>
          <p className="font-mono text-xs uppercase tracking-wider text-paper/55">Right now</p>
          <h2 className="mt-5 max-w-[8ch] text-[clamp(2.8rem,6vw,6rem)] font-semibold italic leading-[0.92] text-paper">
            Becoming is part of the work.
          </h2>
        </div>
        <ol className="px-5 py-12 md:px-[5vw] md:py-[12vh]">
          {personalHome.now.map((item, index) => (
            <li key={item} className="grid grid-cols-[2.5rem_1fr] border-t border-ink/20 py-7 last:border-b">
              <span className="font-mono text-xs text-scarlet">0{index + 1}</span>
              <span className="max-w-[34rem] text-lg leading-relaxed text-ink-light">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 py-24 md:px-[5vw] md:py-[14vh]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-scarlet">Open questions</p>
            <h2 className="mt-5 max-w-[9ch] text-[clamp(2.6rem,5vw,5rem)] font-semibold italic leading-none">
              Things I keep turning over.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {personalHome.questions.map((question, index) => (
              <p key={question} className="grid grid-cols-[2.5rem_1fr] border-t border-ink/20 py-7 text-[clamp(1.35rem,2.4vw,2.4rem)] leading-snug last:border-b">
                <span className="font-mono text-xs text-ink-lighter">{index + 1}</span>
                <span>{question}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-24 md:px-[5vw] md:py-[12vh]">
        <div className="flex flex-col gap-5 border-b border-ink/20 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-scarlet">A partial shelf</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-semibold italic leading-none">Books that shaped me</h2>
          </div>
          <p className="max-w-[28rem] text-sm leading-relaxed text-ink-light">Not a canon. Just a changing record of ideas that stayed with me.</p>
        </div>
        <div className="grid md:grid-cols-2">
          {personalHome.books.map(([title, author], index) => (
            <div key={title} className="grid grid-cols-[2.5rem_1fr] border-b border-ink/20 py-6 md:odd:pr-10 md:even:border-l md:even:pl-10">
              <span className="font-mono text-xs text-ink-lighter">{String(index + 1).padStart(2, "0")}</span>
              <p><span className="block font-serif text-2xl font-semibold italic">{title}</span><span className="mt-1 block text-sm text-ink-light">{author}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 md:px-[5vw] md:py-[14vh]">
        <p className="font-mono text-xs uppercase tracking-wider text-scarlet">Working principles</p>
        <div className="mt-9 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {personalHome.principles.map((principle) => (
            <p key={principle} className="border-t border-ink/20 pt-6 font-serif text-[clamp(2rem,4vw,4.2rem)] font-semibold italic leading-[1.02]">{principle}</p>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/20 px-5 py-24 md:px-[5vw] md:py-[12vh]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-scarlet">The public desk</p>
            <h2 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-semibold italic leading-none">Recent fragments</h2>
            <Link href="/archive" className="mt-6 inline-block font-mono text-xs uppercase tracking-wider">Enter the full archive →</Link>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {recent.map((entry) => (
              <Link key={entry.slug} href="/archive" className="group grid grid-cols-[6.5rem_1fr_auto] gap-4 border-t border-ink/20 py-5 text-ink last:border-b hover:text-scarlet">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-lighter">{entry.date}</span>
                <span>{entry.description || entry.mood || entry.project || entry.slug.replaceAll("-", " ")}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <nav className="grid border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
        {doors.map(([title, href, description], index) => (
          <Link key={href} href={href} className="group min-h-52 border-b border-ink/20 p-6 text-ink hover:bg-scarlet hover:text-paper sm:border-r lg:min-h-64 lg:p-8">
            <span className="font-mono text-xs opacity-60">0{index + 1}</span>
            <span className="mt-12 block font-serif text-4xl font-semibold italic lg:mt-20">{title}</span>
            <span className="mt-2 block text-sm opacity-65">{description}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
