import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllSoftwareProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Software portfolio — products, tools, and experiments in code and AI.",
};

export default function SoftwarePage() {
  const projects = getAllSoftwareProjects();

  return (
    <div className="mx-auto px-[5vw]">
      <div className="py-24">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/software/${project.slug}`}
              className="group"
            >
              {(project.thumbImage || project.heroImage) && (
                <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                  <Image
                    src={project.thumbImage ?? project.heroImage!}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    style={project.thumbPosition ? { objectPosition: project.thumbPosition } : undefined}
                  />
                </div>
              )}
              <h2 className="mt-4 text-xl font-light text-ink transition-colors group-hover:text-scarlet">
                {project.title}
              </h2>
              {project.description && (
                <p className="mt-1 text-sm text-ink-light">
                  {project.description}
                </p>
              )}
              {project.stack && (
                <p className="mt-2 font-mono text-xs text-ink-lighter">
                  {project.stack.join(" · ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
