import React from "react";
import { renderToFile, Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

/* ── Fonts ──
   Use system-safe approach: Helvetica (built-in) for body, Times-BoldItalic (built-in) for headings.
   No external font downloads needed. */

const ink = "#2C2825";
const inkLight = "#5C5650";
const inkLighter = "#8A8279";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 8.5, color: ink, paddingTop: 36, paddingBottom: 36, paddingHorizontal: 40, lineHeight: 1.4 },
  header: { flexDirection: "row", justifyContent: "flex-start", gap: 16, marginBottom: 14, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: inkLighter },
  headerLink: { fontFamily: "Helvetica", fontSize: 7, color: inkLighter, textTransform: "uppercase", letterSpacing: 1.2, textDecoration: "none" },
  section: { marginBottom: 10, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: "#E0DCD6" },
  sectionTitle: { fontFamily: "Times-BoldItalic", fontSize: 13, color: ink, marginBottom: 6 },
  entryHeader: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 5, marginBottom: 2 },
  entryRole: { fontFamily: "Times-BoldItalic", fontSize: 10.5, color: ink },
  entryPipe: { fontSize: 9, color: inkLighter },
  entryOrg: { fontFamily: "Helvetica", fontSize: 8.5, color: inkLight },
  entryDates: { fontFamily: "Helvetica", fontSize: 6.5, color: inkLighter, textTransform: "uppercase", letterSpacing: 1 },
  entryDesc: { fontFamily: "Helvetica", fontSize: 8, color: inkLight, lineHeight: 1.5, marginBottom: 6 },
  skillLine: { flexDirection: "row", marginBottom: 1.5 },
  skillLabel: { fontFamily: "Helvetica", fontSize: 6.5, color: inkLighter, textTransform: "uppercase", letterSpacing: 1, width: 90 },
  skillValue: { fontFamily: "Helvetica", fontSize: 8, color: inkLight, flex: 1 },
  eduDetails: { fontFamily: "Helvetica", fontSize: 7.5, color: inkLighter, marginBottom: 6 },
  recognitionColumns: { flexDirection: "row", gap: 24 },
  recognitionColumn: { flex: 1 },
  recognitionLabel: { fontFamily: "Helvetica", fontSize: 6.5, color: inkLighter, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  recognitionItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  recognitionName: { fontFamily: "Helvetica", fontSize: 8, color: ink },
  recognitionYear: { fontFamily: "Helvetica", fontSize: 6.5, color: inkLighter, textTransform: "uppercase", letterSpacing: 0.8 },
});

const pdf = React.createElement(Document, { title: "Julianna Roberts \u2014 Resume", author: "Julianna Roberts" },
  React.createElement(Page, { size: "LETTER", style: s.page },
    // Name + Header
    React.createElement(View, { style: s.header },
      React.createElement(Text, { style: { fontFamily: "Times-BoldItalic", fontSize: 18, color: ink, marginRight: "auto" } }, "Julianna Roberts"),
      React.createElement(Link, { src: "mailto:juliannaroberts18@gmail.com", style: s.headerLink }, "juliannaroberts18@gmail.com"),
      React.createElement(Link, { src: "https://parallax.haus", style: s.headerLink }, "parallax.haus"),
      React.createElement(Link, { src: "https://linkedin.com/in/julianna-roberts-1118m/", style: s.headerLink }, "LinkedIn"),
      React.createElement(Link, { src: "https://github.com/jannar18", style: s.headerLink }, "GitHub"),
    ),
    // Experience
    React.createElement(View, { style: s.section },
      React.createElement(Text, { style: s.sectionTitle }, "Experience"),
      ...[
        { role: "AI Engineer Intern", org: "Renoverse AI", dates: "Apr 2026 \u2014 May 2026", desc: "Building AI-powered product experiences for architects" },
        { role: "Software Developer", org: "Fractal Tech NYC", dates: "Feb 2026 \u2014 present", desc: "Built and shipped 6+ full-stack apps, software tools, and AI research projects with 451+ commits and 168+ PRs \u2014 designed and built multiplayer games, MCP servers, dungeon crawlers, and AI-powered tools using React, Next.js, TypeScript, Python, WebSockets, and Three.js, with a focus on Claude Code research and harnessing AI as a development partner" },
        { role: "Architectural Intern", org: "Studio KZ + Scottsdale Design Build", dates: "May 2022 \u2014 Jul 2023", desc: "Developed drawing sets through the CD & CA phases for both residential & commercial projects, built 3D SketchUp models for client presentations, participated in on-site field & construction work, assisted with contractual review, collaborated on structural calculations and detail design, drafted plans, elevations, sections & details for custom homes" },
        { role: "Gallery Educator + Greeter", org: "Wrightwood 659", dates: "Apr 2024 \u2014 Jul 2024", desc: "Engaged & educated visitors on architecture & artworks, developed research & \u201Ceducator talk\u201D on artist" },
        { role: "Gallery Service Assistant", org: "Gallery 1957 | Expo Chicago", dates: "Apr 2023", desc: "Engaged with potential clients, learned artists & their works quickly, promoted & represented artists to the public" },
      ].map((e, i) => React.createElement(View, { key: i },
        React.createElement(View, { style: s.entryHeader },
          React.createElement(Text, { style: s.entryRole }, e.role),
          React.createElement(Text, { style: s.entryPipe }, "|"),
          React.createElement(Text, { style: s.entryOrg }, e.org),
          React.createElement(Text, { style: s.entryPipe }, "|"),
          React.createElement(Text, { style: s.entryDates }, e.dates),
        ),
        React.createElement(Text, { style: s.entryDesc }, e.desc),
      )),
    ),
    // Tech Stack
    React.createElement(View, { style: s.section },
      React.createElement(Text, { style: s.sectionTitle }, "Tech Stack"),
      ...[
        ["Frontend", "React 19, TypeScript, Tailwind CSS, Vite, Shadcn UI, Radix UI, React Router, MDX"],
        ["Backend", "Node.js, Express.js, FastAPI, Bun, WebSockets, Python"],
        ["Full-Stack & Auth", "Next.js 15, Supabase (PostgreSQL), BetterAuth, Firebase, NextAuth"],
        ["Databases", "PostgreSQL, SQLite, Supabase"],
        ["AI / LLM", "Anthropic SDK (Claude), Model Context Protocol (MCP), Vercel AI SDK, Agents & Tool Use, RAG, Workflow Orchestration, Multimodal I/O, Streaming & Real-Time Systems"],
        ["3D & Graphics", "Three.js, React Three Fiber, PixiJS v8, Rhino Python API"],
        ["Testing", "Vitest"],
        ["DevOps", "Docker, Terraform, GitHub Actions, Vercel, Netlify, Sevalla, Render, AWS EC2, AWS S3, GCP Compute Engine"],
        ["Observability", "OpenTelemetry, Grafana, Prometheus"],
        ["Arch & CAD", "AutoCAD, Rhino + V-Ray, SketchUp, Lumion, Adobe Creative Cloud, Laser Cutting"],
      ].map(([label, skills], i) => React.createElement(View, { key: i, style: s.skillLine },
        React.createElement(Text, { style: s.skillLabel }, label + ":"),
        React.createElement(Text, { style: s.skillValue }, skills),
      )),
    ),
    // Education
    React.createElement(View, { style: s.section },
      React.createElement(Text, { style: s.sectionTitle }, "Education"),
      ...[
        { inst: "Illinois Institute of Technology", deg: "Bachelor of Architecture (NAAB Accredited)", dates: "2020 \u2014 2025", details: "GPA: 3.71 | Summer Study Abroad Course: Japan 2023 | U.S. Department of Energy Solar Decathlon" },
        { inst: "Westwood High School", deg: "International Baccalaureate", dates: "2016 \u2014 2020", details: "Class Rank: 1 out of 638 | GPA: 5.0 | Seal of Biliteracy & NHS Seal" },
      ].map((e, i) => React.createElement(View, { key: i },
        React.createElement(View, { style: s.entryHeader },
          React.createElement(Text, { style: s.entryRole }, e.inst),
          React.createElement(Text, { style: s.entryPipe }, "|"),
          React.createElement(Text, { style: s.entryOrg }, e.deg),
          React.createElement(Text, { style: s.entryPipe }, "|"),
          React.createElement(Text, { style: s.entryDates }, e.dates),
        ),
        React.createElement(Text, { style: s.eduDetails }, e.details),
      )),
    ),
    // Recognition
    React.createElement(View, null,
      React.createElement(Text, { style: s.sectionTitle }, "Recognition"),
      React.createElement(View, { style: s.recognitionColumns },
        React.createElement(View, { style: s.recognitionColumn },
          React.createElement(Text, { style: s.recognitionLabel }, "Awards & Honors"),
          ...[
            ["Dwight T. Black Memorial Scholarship Nomination", "2024"],
            ["U.S. Solar Decathlon Finalist", "2024"],
            ["Anderson Presidential Scholarship", "2022 \u2014 present"],
            ["Camras Scholarship", "2020 \u2014 2025"],
            ["Dean's List", "2021 \u2014 2025"],
          ].map(([l, y], i) => React.createElement(View, { key: i, style: s.recognitionItem },
            React.createElement(Text, { style: s.recognitionName }, l),
            React.createElement(Text, { style: s.recognitionYear }, y),
          )),
        ),
        React.createElement(View, { style: s.recognitionColumn },
          React.createElement(Text, { style: s.recognitionLabel }, "Organizations & Leadership"),
          ...[
            ["Camras Scholars Mentor", "2020 \u2014 2025"],
            ["IIT Art x Architecture (AIAS) Director", "2021 \u2014 2024"],
            ["Kappa Phi Delta \u2014 Assistant Secretary", "2022 \u2014 2024"],
          ].map(([l, y], i) => React.createElement(View, { key: i, style: s.recognitionItem },
            React.createElement(Text, { style: s.recognitionName }, l),
            React.createElement(Text, { style: s.recognitionYear }, y),
          )),
        ),
      ),
    ),
  ),
);

const outPath = process.argv[2] || "public/Julianna-Roberts-Resume.pdf";
await renderToFile(pdf, outPath);
console.log(`Written to ${outPath}`);
