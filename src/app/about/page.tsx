import type { Metadata } from "next";
import Image from "next/image";

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
    <div className="mx-auto max-w-content px-5">
      {/* ─── Section 1: Hero / Identity Block ─── */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_280px] md:gap-16">
          <div>
            <h1
              className="font-serif font-bold italic text-ink"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
            >
              Julianna Roberts
            </h1>
            <p
              className="mt-4 max-w-text font-sans text-ink-light leading-snug"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
            >
              Architectural designer and software engineer exploring what
              happens when spatial thinking meets computational making.
            </p>
            {/* Contact links row */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
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
          </div>

          {/* Portrait */}
          <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden">
            <Image
              src="/images/about/profile-pic.jpg"
              alt="Julianna Roberts"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 280px"
              priority
            />
          </div>
        </div>
      </section>

      {/* ─── Section 2: Bio ─── */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="max-w-text">
          <p className="font-sans text-ink leading-relaxed" style={{ fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)" }}>
            I recently graduated from the Illinois Institute of Technology with
            a Bachelor of Architecture, where I spent five years learning to see
            the built environment with precision and intention. Somewhere along
            the way, I started writing code — first as a way to automate tedious
            workflows, then as a creative medium in its own right. Now I spend
            most of my time building software and working with AI, bringing the
            spatial thinking and material awareness of architecture into a new
            discipline.
          </p>
          <p className="mt-6 font-sans text-ink leading-relaxed" style={{ fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)" }}>
            I believe architecture and software share a common question: how do
            we design systems that people can inhabit? A building and a piece of
            software both succeed or fail on the same terms — clarity of
            structure, honesty of materials, and care for the person moving
            through them. My practice sits at this overlap, looking for what each
            discipline knows that the other has not yet imagined.
          </p>
          <p className="mt-6 font-sans text-ink leading-relaxed" style={{ fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)" }}>
            This site is where I collect ongoing work, experiments, research
            notes, and observations. It is a practice of perception — shifting
            between vantage points to find depth that no single position reveals.
          </p>
        </div>
      </section>

      {/* ─── Section 3: Experience ─── */}
      <section className="border-t border-border py-16 md:py-24">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Experience
        </h2>
        <div className="mt-10 space-y-10">
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

      {/* ─── Section 4: Education ─── */}
      <section className="border-t border-border py-16 md:py-24">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Education
        </h2>
        <div className="mt-10 space-y-10">
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

      {/* ─── Section 5: Awards & Leadership ─── */}
      <section className="border-t border-border py-16 md:py-24">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Recognition
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
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

      {/* ─── Section 6: Skills ─── */}
      <section className="border-t border-border py-16 md:py-24">
        <h2
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)" }}
        >
          Tools & Skills
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <SkillGroup
            label="Architecture"
            skills={[
              "AutoCAD",
              "Rhino + V-Ray",
              "SketchUp",
              "Lumion",
              "Adobe Creative Cloud",
              "Drafting & Sketching",
              "Model Making",
              "Laser Cutting",
            ]}
          />
          <SkillGroup
            label="Software & AI"
            skills={[
              "Placeholder — Julianna to fill in",
            ]}
          />
          <SkillGroup
            label="Professional"
            skills={[
              "Communication",
              "Organization",
              "Leadership",
              "Attention to Detail",
            ]}
          />
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-16 md:h-24" />
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

function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div>
      <h3
        className="font-mono uppercase tracking-wider text-ink-lighter"
        style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
      >
        {label}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-ink-light"
            style={{ fontSize: "clamp(0.75rem, 0.9vw, 0.8125rem)" }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
