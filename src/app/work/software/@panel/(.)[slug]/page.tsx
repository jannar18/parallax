import { notFound } from "next/navigation";
import Image from "next/image";
import { getSoftwareProject } from "@/lib/content";
import ProjectPanel from "@/components/ui/ProjectPanel";
import HoverVideo from "@/components/ui/HoverVideo";

export default async function SoftwarePanelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getSoftwareProject(slug);
  if (!project) notFound();

  return (
    <ProjectPanel>
      {/* Left column — narrow text list */}
      <div className="flex h-full w-[18%] flex-shrink-0 flex-col justify-center px-[3vw]">
        <h2 className="text-xl font-light text-paper">{project.title}</h2>
        {project.description && (
          <p className="mt-2 text-sm leading-relaxed text-paper/70">
            {project.description}
          </p>
        )}
        {project.stack && (
          <ul className="mt-4 space-y-1">
            {project.stack.map((tech) => (
              <li key={tech} className="font-mono text-xs text-paper/50">
                {tech}
              </li>
            ))}
          </ul>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 font-mono text-xs text-paper/50 underline underline-offset-2 transition-colors hover:text-paper/80"
          >
            Visit &rarr;
          </a>
        )}
      </div>

      {/* Right area — video first, then screenshots, horizontally scrollable */}
      <div
        className="flex flex-1 items-center gap-[2vw] overflow-x-auto px-[2vw] scrollbar-hide"
        style={{ height: "calc(75vh - 4vh)" }}
      >
        {/* Hero video — falls back to riso thumbnail if no video */}
        <div className="flex-shrink-0" style={{ height: "calc(75vh - 4vh)" }}>
          <HoverVideo
            src={project.heroVideo}
            poster={project.posterImage}
            fallbackImage={project.thumbImage}
            alt={project.title}
          />
        </div>

        {/* Additional videos */}
        {project.videos?.map((videoSrc) => (
          <div key={videoSrc} className="flex-shrink-0" style={{ height: "calc(75vh - 4vh)" }}>
            <HoverVideo
              src={videoSrc}
              alt={project.title}
            />
          </div>
        ))}

        {/* Screenshots — all forced to same explicit height */}
        {project.screenshots?.map((src) => (
          <img
            key={src}
            src={src}
            alt={project.title}
            style={{ height: "calc(75vh - 4vh)", width: "auto", maxWidth: "none" }}
            className="flex-shrink-0"
          />
        ))}
      </div>
    </ProjectPanel>
  );
}
