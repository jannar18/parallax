import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ──────────────────────────────────────────────────────────
 * Content loading utilities for MDX files.
 * Reads from src/content/<collection>/*.mdx, parses frontmatter
 * with gray-matter, and returns typed objects.
 * MDX rendering happens at the page level with next-mdx-remote.
 * ────────────────────────────────────────────────────────── */

const contentDirectory = path.join(process.cwd(), "src", "content");

/* ── Frontmatter Types ── */

export interface NowEntry {
  slug: string;
  date: string;
  time?: string;
  mood?: string;
  tags?: string[];
  image?: string;
  project?: string;
  description?: string;
  content: string;
}

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  content: string;
}

export interface ArchitectureProject {
  slug: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  typology?: string;
  heroImage?: string;
  tags?: string[];
  order?: number;
  featured?: boolean;
  content: string;
}

export interface SoftwareProject {
  slug: string;
  title: string;
  description?: string;
  date: string;
  stack?: string[];
  url?: string;
  repo?: string;
  thumbImage?: string;
  thumbPosition?: string;
  heroImage?: string;
  heroVideo?: string;
  videos?: string[];
  posterImage?: string;
  screenshots?: string[];
  videos?: string[];
  tags?: string[];
  order?: number;
  featured?: boolean;
  content: string;
}

/* ── Generic Helpers ── */

function getContentFiles(collection: string): string[] {
  const dir = path.join(contentDirectory, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function parseFile<T>(collection: string, filename: string): T {
  const filePath = path.join(contentDirectory, collection, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const slug = filename.replace(/\.mdx?$/, "");
  return { ...data, slug, content } as T;
}

/* ── Now Entries ── */

export function getAllNowEntries(): NowEntry[] {
  return getContentFiles("now")
    .map((file) => parseFile<NowEntry>("now", file))
    .sort((a, b) => {
      const aKey = `${a.date} ${a.time ?? "00:00"}`;
      const bKey = `${b.date} ${b.time ?? "00:00"}`;
      return bKey > aKey ? 1 : bKey < aKey ? -1 : 0;
    });
}

export function getNowEntry(slug: string): NowEntry | undefined {
  const files = getContentFiles("now");
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return undefined;
  return parseFile<NowEntry>("now", file);
}

/* ── Writing ── */

export function getAllWritingPosts(): WritingPost[] {
  return getContentFiles("writing")
    .map((file) => parseFile<WritingPost>("writing", file))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getWritingPost(slug: string): WritingPost | undefined {
  const files = getContentFiles("writing");
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return undefined;
  return parseFile<WritingPost>("writing", file);
}

/* ── Architecture Projects ── */

export function getAllArchitectureProjects(): ArchitectureProject[] {
  return getContentFiles("work-architecture")
    .map((file) =>
      parseFile<ArchitectureProject>("work-architecture", file)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getArchitectureProject(
  slug: string
): ArchitectureProject | undefined {
  const files = getContentFiles("work-architecture");
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return undefined;
  return parseFile<ArchitectureProject>("work-architecture", file);
}

/* ── Software Projects ── */

export function getAllSoftwareProjects(): SoftwareProject[] {
  return getContentFiles("work-software")
    .map((file) =>
      parseFile<SoftwareProject>("work-software", file)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getSoftwareProject(
  slug: string
): SoftwareProject | undefined {
  const files = getContentFiles("work-software");
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return undefined;
  return parseFile<SoftwareProject>("work-software", file);
}
