import type { Metadata } from "next";
import PrintButton from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Julianna Roberts — architect, software engineer, and builder working across architecture, software, and AI.",
};

/**
 * About / Resume page — full bio, experience, education, awards, and skills.
 *
 * RSC — no "use client". Static content, no interactivity needed.
 * Typography: serif headings (Cormorant Garamond), sans body (Jost),
 * mono labels/dates (DM Mono). Layout follows site-wide max-w-content container.
 */
export default function AboutPage() {
  return (
    <div className="mx-auto px-5" style={{ maxWidth: "816px" }}>
      {/* ─── Contact Links + Print ─── */}
      <section className="pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="mailto:juliannaroberts18@gmail.com"
              className="font-mono uppercase tracking-wider text-ink-lighter transition-colors hover:text-scarlet"
              style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
            >
              Email
            </a>
            <a
              href="https://linkedin.com/in/julianna-roberts-1118m/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase tracking-wider text-ink-lighter transition-colors hover:text-scarlet"
              style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/jannar18"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase tracking-wider text-ink-lighter transition-colors hover:text-scarlet"
              style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
            >
              GitHub
            </a>
          </div>
          <PrintButton />
        </div>
      </section>

      {/* ─── Section 3: Experience ─── */}
      <section className="border-t border-border py-6 md:py-8">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Experience
        </h2>
        <div className="mt-4 space-y-5">
          <ExperienceEntry
            role="Software Developer"
            organization="Fractal Tech NYC"
            dates="Feb 2026 — present"
            bullets={[
              "Built and shipped 6+ full-stack apps, software tools, and AI research projects with 451+ commits and 168+ PRs",
              "Designed and built multiplayer games, MCP servers, dungeon crawlers, and AI-powered tools using React, Next.js, TypeScript, Python, WebSockets, and Three.js — with a focus on Claude Code research and harnessing AI as a development partner",
            ]}
          />
          <ExperienceEntry
            role="Gallery Educator + Greeter"
            organization="Wrightwood 659"
            dates="Apr 2024 — Jul 2024"
            bullets={[
              "Educated visitors on exhibitions spanning architecture, art, and social justice",
              "Conducted independent research to develop and deliver educator-led gallery talks",
            ]}
          />
          <ExperienceEntry
            role="Gallery Service Assistant"
            organization="Gallery 1957 at Expo Chicago"
            dates="Apr 2023"
            bullets={[
              "Engaged collectors and visitors on behalf of a contemporary Ghanaian gallery",
              "Represented artists and facilitated conversations connecting work to broader cultural context",
            ]}
          />
          <ExperienceEntry
            role="Architectural Intern"
            organization="Studio KZ + Scottsdale Design Build"
            dates="May 2022 — Jul 2023"
            bullets={[
              "Produced construction document sets through CD and CA phases",
              "Built SketchUp models for client presentations and design development",
              "Performed field work including site visits, measurements, and documentation",
              "Reviewed contractual documents and assisted with structural calculations",
            ]}
          />
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section className="border-t border-border py-6 md:py-8">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Tech Stack
        </h2>
        <ul className="mt-4 space-y-2">
          <SkillLine label="Frontend" skills="React 19, TypeScript, Tailwind CSS, Vite, Shadcn UI, Radix UI, React Router, MDX" />
          <SkillLine label="Backend" skills="Node.js, Express.js, FastAPI, Bun, WebSockets, Python" />
          <SkillLine label="Full-Stack & Auth" skills="Next.js 15, Supabase (PostgreSQL), BetterAuth, Firebase, NextAuth" />
          <SkillLine label="Databases" skills="PostgreSQL, SQLite, Supabase" />
          <SkillLine label="AI / LLM" skills="Anthropic SDK (Claude), Model Context Protocol (MCP), Vercel AI SDK, Agents & Tool Use, RAG, Workflow Orchestration, Multimodal I/O, Streaming & Real-Time Systems" />
          <SkillLine label="3D & Graphics" skills="Three.js, React Three Fiber, PixiJS v8, Rhino Python API" />
          <SkillLine label="Testing" skills="Vitest" />
          <SkillLine label="DevOps & Deployment" skills="Docker, Terraform, GitHub Actions, Vercel, Netlify, Sevalla, Render, AWS EC2, AWS S3, GCP Compute Engine" />
          <SkillLine label="Observability" skills="OpenTelemetry, Grafana, Prometheus" />
          <SkillLine label="Architecture & CAD" skills="AutoCAD, Rhino + V-Ray, SketchUp, Lumion, Adobe Creative Cloud, Laser Cutting" />
        </ul>
      </section>

      {/* ─── Education ─── */}
      <section className="border-t border-border py-6 md:py-8">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Education
        </h2>
        <div className="mt-4 space-y-5">
          <EducationEntry
            institution="Illinois Institute of Technology"
            degree="Bachelor of Architecture (NAAB Accredited)"
            dates="2020 — 2025"
            details={[
              "GPA 3.71",
              "Summer Study Abroad — Japan, 2023",
              "U.S. Department of Energy Solar Decathlon participant",
            ]}
          />
          <EducationEntry
            institution="Westwood High School"
            degree="International Baccalaureate"
            dates="2016 — 2020"
            details={[
              "Class Rank 1 / 638 — GPA 5.0",
              "Seal of Biliteracy, National Honor Society Seal",
            ]}
          />
        </div>
      </section>

      {/* ─── Recognition ─── */}
      <section className="border-t border-border py-6 md:py-8">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Recognition
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
          {/* Awards */}
          <div>
            <h3
              className="font-mono uppercase tracking-wider text-ink-lighter"
              style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
            >
              Awards & Honors
            </h3>
            <ul className="mt-4 space-y-3">
              <RecognitionItem label="Dwight T. Black Memorial Scholarship Nomination" year="2024" />
              <RecognitionItem label="U.S. Solar Decathlon Finalist" year="2024" />
              <RecognitionItem label="Anderson Presidential Scholarship" year="2022 — present" />
              <RecognitionItem label="Camras Scholarship" year="2020 — 2025" />
              <RecognitionItem label="Dean's List" year="2021 — 2025" />
            </ul>
          </div>

          {/* Leadership */}
          <div>
            <h3
              className="font-mono uppercase tracking-wider text-ink-lighter"
              style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
            >
              Organizations & Leadership
            </h3>
            <ul className="mt-4 space-y-3">
              <RecognitionItem label="Camras Scholars Mentor" year="2020 — 2025" />
              <RecognitionItem label="IIT Art x Architecture (AIAS) Director" year="2021 — 2024" />
              <RecognitionItem label="Kappa Phi Delta — Assistant Secretary" year="2022 — 2024" />
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-10 md:h-16" />
    </div>
  );
}

/* ── Helper Components (co-located, not exported) ── */

function ExperienceEntry({
  role,
  organization,
  dates,
  bullets,
}: {
  role: string;
  organization: string;
  dates: string;
  bullets: string[];
}) {
  return (
    <div>
      <h3
        className="font-serif font-bold italic text-ink"
        style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}
      >
        {role}
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
        <span
          className="font-sans text-ink-light"
          style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}
        >
          {organization}
        </span>
        <span
          className="font-mono uppercase tracking-wider text-ink-lighter"
          style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
        >
          {dates}
        </span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="font-sans text-ink-light leading-normal pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-ink-lighter"
            style={{ fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)" }}
          >
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EducationEntry({
  institution,
  degree,
  dates,
  details,
}: {
  institution: string;
  degree: string;
  dates: string;
  details: string[];
}) {
  return (
    <div>
      <h3
        className="font-serif font-bold italic text-ink"
        style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.25rem)" }}
      >
        {institution}
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
        <span
          className="font-sans text-ink-light"
          style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}
        >
          {degree}
        </span>
        <span
          className="font-mono uppercase tracking-wider text-ink-lighter"
          style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
        >
          {dates}
        </span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {details.map((detail, i) => (
          <li
            key={i}
            className="font-sans text-ink-lighter leading-normal"
            style={{ fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)" }}
          >
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecognitionItem({ label, year }: { label: string; year: string }) {
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4">
      <span
        className="font-sans text-ink"
        style={{ fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)" }}
      >
        {label}
      </span>
      <span
        className="font-mono uppercase tracking-wider text-ink-lighter shrink-0"
        style={{ fontSize: "clamp(0.625rem, 0.75vw, 0.6875rem)" }}
      >
        {year}
      </span>
    </li>
  );
}

function SkillLine({ label, skills }: { label: string; skills: string }) {
  return (
    <li
      className="font-sans text-ink-light leading-normal"
      style={{ fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)" }}
    >
      <span
        className="font-mono uppercase tracking-wider text-ink-lighter"
        style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
      >
        {label}:
      </span>{" "}
      {skills}
    </li>
  );
}
