"use client";

import Link from "next/link";

export type LayoutMode = "scatter" | "masonry" | "columns" | "bento";

const LAYOUTS: { mode: LayoutMode; label: string }[] = [
  { mode: "scatter", label: "Scatter" },
  { mode: "masonry", label: "Masonry" },
  { mode: "columns", label: "Columns" },
  { mode: "bento", label: "Bento" },
];

interface LayoutSwitcherProps {
  current: LayoutMode;
}

export default function LayoutSwitcher({ current }: LayoutSwitcherProps) {
  return (
    <nav
      className="fixed bottom-6 left-6 z-30 flex gap-1 rounded-full
        bg-surface/80 backdrop-blur-sm ring-1 ring-border p-1"
    >
      {LAYOUTS.map(({ mode, label }) => (
        <Link
          key={mode}
          href={mode === "scatter" ? "/now" : `/now?layout=${mode}`}
          className={`px-3 py-1 rounded-full font-mono uppercase transition-all duration-200
            ${
              current === mode
                ? "bg-ink text-paper"
                : "text-ink-light hover:text-ink hover:bg-surface"
            }`}
          style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
