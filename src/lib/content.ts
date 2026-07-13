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
  tags?: string[];
  order?: number;
  featured?: boolean;
  content: string;
}

/* ── Works (Lab / prototype gallery) ── */

/**
 * A "work" is a published prototype from the /post-prototype pipeline.
 * Backed by src/data/works.json (a flat manifest, not MDX). GIF-first:
 * the `gif` IS the thumbnail. See the merge CONTRACT for the data model.
 */
export interface Work {
  id: string;
  number: number;
  label?: string;
  title: string;
  description?: string;
  gif: string;
  repo?: string;
  url?: string;
  date?: string;
  tags?: string[];
  screenshots?: string[];
  /** When true, the work is excluded from the software gallery (e.g. NDA hold). */
  hidden?: boolean;
}

const worksManifestPath = path.join(
  process.cwd(),
  "src",
  "data",
  "works.json"
);

/**
 * Read src/data/works.json and return the works sorted newest-first
 * (by `number` descending). Returns [] if the manifest is missing.
 */
export function getAllWorks(): Work[] {
  if (!fs.existsSync(worksManifestPath)) return [];
  const raw = fs.readFileSync(worksManifestPath, "utf8");
  const parsed = JSON.parse(raw) as { works?: Work[] };
  const works = (Array.isArray(parsed.works) ? parsed.works : []).filter(
    (work) => !work.hidden,
  );
  // Newest first: sort by date DESC, tie-break by number DESC (so same-day
  // prototypes keep their sequence). Keeps ships + prototypes in one log.
  return works.slice().sort((a, b) => {
    const ad = a.date ?? "";
    const bd = b.date ?? "";
    if (ad !== bd) return ad < bd ? 1 : -1;
    return (b.number ?? 0) - (a.number ?? 0);
  });
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
