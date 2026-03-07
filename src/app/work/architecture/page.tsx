import type { Metadata } from "next";
import Link from "next/link";
import { getAllArchitectureProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Architecture portfolio — built work, competitions, and speculative projects.",
};

/**
 * Architecture portfolio listing.
 *
 * Each project gets its own page with intentional sequencing (PRD §9).
 * Not an image grid — project cards with context.
 */
export default function ArchitecturePage() {
  const projects = getAllArchitectureProjects();

  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">
          Architecture
        </h1>
        <div className="mt-16 flex flex-col gap-16">
          {projects.length === 0 ? (
            <p className="text-ink-light">Projects coming soon.</p>
          ) : (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/architecture/${project.slug}`}
                className="group block"
              >
                <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-scarlet">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="mt-2 max-w-text text-base text-ink-light">
                    {project.description}
                  </p>
                )}
                {project.location && (
                  <p className="mt-1 text-sm text-ink-lighter">
                    {project.location}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
