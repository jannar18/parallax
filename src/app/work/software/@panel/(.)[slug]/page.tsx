import { notFound } from "next/navigation";
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
      {/* Left column — full-width on mobile, narrow text list on md+ */}
      <div className="flex w-full flex-shrink-0 flex-col justify-center px-6 py-6 md:h-full md:w-[22%] md:px-[3vw] md:py-0">
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

      {/* Right area — video first, then screenshots, horizontally scrollable on md+ */}
      <div className="flex flex-1 items-center gap-4 overflow-x-auto px-4 pb-6 md:gap-[2vw] md:px-[2vw] md:pb-0 scrollbar-hide h-[45dvh] md:h-[calc(75dvh-4vh)]">
        {/* Hero video — falls back to riso thumbnail if no video */}
        <div className="h-full flex-shrink-0">
          <HoverVideo
            src={project.heroVideo}
            poster={project.posterImage}
            fallbackImage={project.thumbImage}
            alt={project.title}
          />
        </div>

        {/* Additional videos */}
        {project.videos?.map((videoSrc) => (
          <div key={videoSrc} className="h-full flex-shrink-0">
            <HoverVideo
              src={videoSrc}
              alt={project.title}
            />
          </div>
        ))}

        {/* Screenshots — all forced to same explicit height */}
        {project.screenshots?.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={project.title}
            className="h-full w-auto max-w-none flex-shrink-0"
          />
        ))}
      </div>
    </ProjectPanel>
  );
}
