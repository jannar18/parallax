import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* ── Fonts ── */
Font.register({
  family: "Jost",
  fonts: [
    { src: "https://fonts.gstatic.com/s/jost/v15/92zatBhPNqw73oDd4iYl.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/jost/v15/92zatBhPNqw73oDd4iYl.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "https://fonts.gstatic.com/s/jost/v15/92zatBhPNqw73oDd4iYl.ttf", fontWeight: 600 },
  ],
});

Font.register({
  family: "CormorantGaramond",
  fonts: [
    { src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmSq5.ttf", fontWeight: 600, fontStyle: "italic" },
    { src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V.ttf", fontWeight: 700, fontStyle: "italic" },
  ],
});

/* ── Colors ── */
const ink = "#2C2825";
const inkLight = "#5C5650";
const inkLighter = "#8A8279";

/* ── Styles ── */
const s = StyleSheet.create({
  page: {
    fontFamily: "Jost",
    fontSize: 8.5,
    color: ink,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: inkLighter,
  },
  headerLink: {
    fontFamily: "Jost",
    fontSize: 7,
    color: inkLighter,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textDecoration: "none",
  },
  /* Section */
  section: {
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0DCD6",
  },
  sectionTitle: {
    fontFamily: "CormorantGaramond",
    fontWeight: 700,
    fontStyle: "italic",
    fontSize: 13,
    color: ink,
    marginBottom: 6,
  },
  /* Experience entry */
  entryHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 5,
    marginBottom: 2,
  },
  entryRole: {
    fontFamily: "CormorantGaramond",
    fontWeight: 600,
    fontStyle: "italic",
    fontSize: 10.5,
    color: ink,
  },
  entryPipe: {
    fontSize: 9,
    color: inkLighter,
  },
  entryOrg: {
    fontFamily: "Jost",
    fontSize: 8.5,
    color: inkLight,
  },
  entryDates: {
    fontFamily: "Jost",
    fontSize: 6.5,
    color: inkLighter,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  entryDesc: {
    fontFamily: "Jost",
    fontSize: 8,
    color: inkLight,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  /* Tech stack */
  skillLine: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  skillLabel: {
    fontFamily: "Jost",
    fontSize: 6.5,
    color: inkLighter,
    textTransform: "uppercase",
    letterSpacing: 1,
    width: 90,
  },
  skillValue: {
    fontFamily: "Jost",
    fontSize: 8,
    color: inkLight,
    flex: 1,
  },
  /* Education */
  eduDetails: {
    fontFamily: "Jost",
    fontSize: 7.5,
    color: inkLighter,
    marginBottom: 6,
  },
  /* Recognition */
  recognitionColumns: {
    flexDirection: "row",
    gap: 24,
  },
  recognitionColumn: {
    flex: 1,
  },
  recognitionLabel: {
    fontFamily: "Jost",
    fontSize: 6.5,
    color: inkLighter,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  recognitionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  recognitionName: {
    fontFamily: "Jost",
    fontSize: 8,
    color: ink,
  },
  recognitionYear: {
    fontFamily: "Jost",
    fontSize: 6.5,
    color: inkLighter,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

/* ── Components ── */

function Entry({
  role,
  org,
  dates,
  description,
}: {
  role: string;
  org: string;
  dates: string;
  description: string;
}) {
  return (
    <View>
      <View style={s.entryHeader}>
        <Text style={s.entryRole}>{role}</Text>
        <Text style={s.entryPipe}>|</Text>
        <Text style={s.entryOrg}>{org}</Text>
        <Text style={s.entryPipe}>|</Text>
        <Text style={s.entryDates}>{dates}</Text>
      </View>
      <Text style={s.entryDesc}>{description}</Text>
    </View>
  );
}

function Skill({ label, skills }: { label: string; skills: string }) {
  return (
    <View style={s.skillLine}>
      <Text style={s.skillLabel}>{label}:</Text>
      <Text style={s.skillValue}>{skills}</Text>
    </View>
  );
}

function EduEntry({
  institution,
  degree,
  dates,
  details,
}: {
  institution: string;
  degree: string;
  dates: string;
  details: string;
}) {
  return (
    <View>
      <View style={s.entryHeader}>
        <Text style={s.entryRole}>{institution}</Text>
        <Text style={s.entryPipe}>|</Text>
        <Text style={s.entryOrg}>{degree}</Text>
        <Text style={s.entryPipe}>|</Text>
        <Text style={s.entryDates}>{dates}</Text>
      </View>
      <Text style={s.eduDetails}>{details}</Text>
    </View>
  );
}

function RecItem({ label, year }: { label: string; year: string }) {
  return (
    <View style={s.recognitionItem}>
      <Text style={s.recognitionName}>{label}</Text>
      <Text style={s.recognitionYear}>{year}</Text>
    </View>
  );
}

/* ── Document ── */

export function ResumePDF() {
  return (
    <Document title="Julianna Roberts — Resume" author="Julianna Roberts">
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Link src="mailto:juliannaroberts18@gmail.com" style={s.headerLink}>
            Email
          </Link>
          <Link src="https://parallax.haus" style={s.headerLink}>
            parallax.haus
          </Link>
          <Link src="https://linkedin.com/in/julianna-roberts-1118m/" style={s.headerLink}>
            LinkedIn
          </Link>
          <Link src="https://github.com/jannar18" style={s.headerLink}>
            GitHub
          </Link>
        </View>

        {/* Experience */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>
          <Entry
            role="AI Engineer Intern"
            org="Renoverse AI"
            dates="Apr 2026 — May 2026"
            description="Building AI-powered product experiences for architects"
          />
          <Entry
            role="Software Developer"
            org="Fractal Tech NYC"
            dates="Feb 2026 — present"
            description="Built and shipped 6+ full-stack apps, software tools, and AI research projects with 451+ commits and 168+ PRs — designed and built multiplayer games, MCP servers, dungeon crawlers, and AI-powered tools using React, Next.js, TypeScript, Python, WebSockets, and Three.js, with a focus on Claude Code research and harnessing AI as a development partner"
          />
          <Entry
            role="Architectural Intern"
            org="Studio KZ + Scottsdale Design Build"
            dates="May 2022 — Jul 2023"
            description="Developed drawing sets through the CD & CA phases for both residential & commercial projects, built 3D SketchUp models for client presentations, participated in on-site field & construction work, assisted with contractual review, collaborated on structural calculations and detail design, drafted plans, elevations, sections & details for custom homes"
          />
          <Entry
            role="Gallery Educator + Greeter"
            org="Wrightwood 659"
            dates="Apr 2024 — Jul 2024"
            description={
              'Engaged & educated visitors on architecture & artworks, developed research & \u201Ceducator talk\u201D on artist'
            }
          />
          <Entry
            role="Gallery Service Assistant"
            org="Gallery 1957 | Expo Chicago"
            dates="Apr 2023"
            description="Engaged with potential clients, learned artists & their works quickly, promoted & represented artists to the public"
          />
        </View>

        {/* Tech Stack */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tech Stack</Text>
          <Skill label="Frontend" skills="React 19, TypeScript, Tailwind CSS, Vite, Shadcn UI, Radix UI, React Router, MDX" />
          <Skill label="Backend" skills="Node.js, Express.js, FastAPI, Bun, WebSockets, Python" />
          <Skill label="Full-Stack & Auth" skills="Next.js 15, Supabase (PostgreSQL), BetterAuth, Firebase, NextAuth" />
          <Skill label="Databases" skills="PostgreSQL, SQLite, Supabase" />
          <Skill label="AI / LLM" skills="Anthropic SDK (Claude), Model Context Protocol (MCP), Vercel AI SDK, Agents & Tool Use, RAG, Workflow Orchestration, Multimodal I/O, Streaming & Real-Time Systems" />
          <Skill label="3D & Graphics" skills="Three.js, React Three Fiber, PixiJS v8, Rhino Python API" />
          <Skill label="Testing" skills="Vitest" />
          <Skill label="DevOps" skills="Docker, Terraform, GitHub Actions, Vercel, Netlify, Sevalla, Render, AWS EC2, AWS S3, GCP Compute Engine" />
          <Skill label="Observability" skills="OpenTelemetry, Grafana, Prometheus" />
          <Skill label="Arch & CAD" skills="AutoCAD, Rhino + V-Ray, SketchUp, Lumion, Adobe Creative Cloud, Laser Cutting" />
        </View>

        {/* Education */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          <EduEntry
            institution="Illinois Institute of Technology"
            degree="Bachelor of Architecture (NAAB Accredited)"
            dates="2020 — 2025"
            details="GPA: 3.71 | Summer Study Abroad Course: Japan 2023 | U.S. Department of Energy Solar Decathlon"
          />
          <EduEntry
            institution="Westwood High School"
            degree="International Baccalaureate"
            dates="2016 — 2020"
            details="Class Rank: 1 out of 638 | GPA: 5.0 | Seal of Biliteracy & NHS Seal"
          />
        </View>

        {/* Recognition */}
        <View>
          <Text style={s.sectionTitle}>Recognition</Text>
          <View style={s.recognitionColumns}>
            <View style={s.recognitionColumn}>
              <Text style={s.recognitionLabel}>Awards & Honors</Text>
              <RecItem label="Dwight T. Black Memorial Scholarship Nomination" year="2024" />
              <RecItem label="U.S. Solar Decathlon Finalist" year="2024" />
              <RecItem label="Anderson Presidential Scholarship" year="2022 — present" />
              <RecItem label="Camras Scholarship" year="2020 — 2025" />
              <RecItem label="Dean's List" year="2021 — 2025" />
            </View>
            <View style={s.recognitionColumn}>
              <Text style={s.recognitionLabel}>Organizations & Leadership</Text>
              <RecItem label="Camras Scholars Mentor" year="2020 — 2025" />
              <RecItem label="IIT Art x Architecture (AIAS) Director" year="2021 — 2024" />
              <RecItem label="Kappa Phi Delta — Assistant Secretary" year="2022 — 2024" />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
