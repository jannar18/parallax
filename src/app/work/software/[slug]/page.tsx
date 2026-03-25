import { redirect } from "next/navigation";
import { getAllSoftwareProjects, getSoftwareProject } from "@/lib/content";

export function generateStaticParams() {
  const projects = getAllSoftwareProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getSoftwareProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function SoftwareProjectPage() {
  redirect("/work/software");
}
