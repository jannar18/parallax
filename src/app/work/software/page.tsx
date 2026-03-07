import type { Metadata } from "next";
import Link from "next/link";
import { getAllSoftwareProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Software",
  description: "Software portfolio — products, tools, and experiments in code and AI.",
};

/**
 * Software portfolio listing.
 *
 * Project cards with context — title, description, stack.
 */
export default function SoftwarePage() {
  const projects = getAllSoftwareProjects();

  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">
          Software
        </h1>
        <div className="mt-16 flex flex-col gap-16">
          {projects.length === 0 ? (
            <p className="text-ink-light">Projects coming soon.</p>
          ) : (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/software/${project.slug}`}
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
                {project.stack && (
                  <p className="mt-1 text-sm text-ink-lighter">
                    {project.stack.join(" · ")}
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
