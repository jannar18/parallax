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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/software/${project.slug}`}
              className="group flex flex-col md:flex-row md:gap-6"
            >
              {/* Text — left side on md+ */}
              <div className="order-2 mt-4 flex flex-col justify-center md:order-1 md:mt-0 md:w-[40%] md:flex-shrink-0">
                <h2 className="text-xl font-light text-ink transition-colors group-hover:text-scarlet">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-light">
                    {project.description}
                  </p>
                )}
                {project.stack && (
                  <p className="mt-3 font-mono text-xs text-ink-lighter">
                    {project.stack.join(" · ")}
                  </p>
                )}
              </div>

              {/* Image — right side on md+ */}
              {(project.thumbImage || project.heroImage) && (
                <div className="relative order-1 aspect-[3/4] overflow-hidden bg-surface md:order-2 md:flex-1">
                  <Image
                    src={project.thumbImage ?? project.heroImage!}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    style={project.thumbPosition ? { objectPosition: project.thumbPosition } : undefined}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
