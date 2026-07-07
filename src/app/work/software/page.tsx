import type { Metadata } from "next";
import { getAllWorks } from "@/lib/content";
import LabGallery from "@/components/lab/LabGallery";

export const metadata: Metadata = {
  title: "Software",
  description:
    "A running log of software prototypes — products, tools, and experiments in code and AI, each captured as a looping GIF.",
};

/**
 * Software — a GIF-first "lab" gallery.
 *
 * Deliberately low-friction "posted work" rather than the polished MDX
 * case-study look: each work leads with its GIF (the thumbnail), and a
 * click opens a lightbox with the media larger plus links. Fed by the
 * /post-prototype pipeline via getAllWorks() (sorted newest-first).
 */
export default function SoftwarePage() {
  const works = getAllWorks();

  return (
    <div className="mx-auto max-w-content px-5">
      <div className="py-24">
        <header className="mb-14 max-w-text">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-lighter">
            Prototypes, Experiments &amp; Ships
          </p>
          <h1 className="mt-4 font-serif text-4xl font-normal italic tracking-tighter text-ink md:text-5xl">
            A running log of things I&rsquo;m building
          </h1>
        </header>

        <LabGallery works={works} />
      </div>
    </div>
  );
}
