"use client";

import Link from "next/link";

export type LayoutMode = "scatter" | "masonry";

const LAYOUTS: { mode: LayoutMode; label: string }[] = [
  { mode: "scatter", label: "Canvas" },
  { mode: "masonry", label: "Scroll" },
];

interface LayoutSwitcherProps {
  current: LayoutMode;
}

export default function LayoutSwitcher({ current }: LayoutSwitcherProps) {
  return (
    <nav
      className="fixed left-5 z-30 flex items-center gap-0"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 1rem))" }}
    >
      {LAYOUTS.map(({ mode, label }, i) => (
        <span key={mode} className="flex items-center">
          {i > 0 && (
            <span
              className="text-ink-lighter/20 select-none mx-[3px]"
              style={{ fontSize: "0.45rem" }}
            >
              /
            </span>
          )}
          <Link
            href={mode === "scatter" ? "/archive" : `/archive?layout=${mode}`}
            className={`font-mono uppercase transition-colors duration-200
              ${
                current === mode
                  ? "text-ink-lighter/40"
                  : "text-ink-lighter/15 hover:text-ink-lighter/35"
              }`}
            style={{ fontSize: "0.5rem", letterSpacing: "0.08em" }}
          >
            {label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
