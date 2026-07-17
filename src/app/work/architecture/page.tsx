import type { Metadata } from "next";
import Flipbook from "@/components/interactive/Flipbook";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "Architecture portfolio — selected works 2022–2024, presented as a book you turn through.",
};

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <div className="py-20 md:py-24">
        <header className="mb-12 max-w-text md:mb-16">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-lighter">
            Selected Works · 2022–2024
          </p>
          <h1 className="mt-4 font-serif text-4xl font-normal italic tracking-tighter text-ink md:text-5xl">
            A book of architecture
          </h1>
          <p className="mt-5 text-ink-light leading-relaxed">
            Studio projects, drawings, and buildings — sequenced the way they
            were meant to be read. Turn the pages.
          </p>
        </header>

        <Flipbook />
      </div>
    </div>
  );
}
