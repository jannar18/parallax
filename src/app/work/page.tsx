import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work in architecture and software.",
};

/**
 * Work overview — entry point to both disciplines.
 *
 * Links to architecture and software portfolio sections.
 * Will evolve into featured project highlights with large-format imagery.
 */
export default function WorkPage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">Work</h1>
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:gap-16">
          <Link
            href="/work/architecture"
            className="group"
          >
            <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-coral">
              Architecture
            </h2>
            <p className="mt-2 text-base text-ink-light">
              Built work, competitions, and speculative projects.
            </p>
          </Link>
          <Link
            href="/work/software"
            className="group"
          >
            <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-coral">
              Software
            </h2>
            <p className="mt-2 text-base text-ink-light">
              Products, tools, and experiments in code and AI.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
