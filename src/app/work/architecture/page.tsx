import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Architecture portfolio — built work, competitions, and speculative projects.",
};

export default function ArchitecturePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="font-mono uppercase tracking-wider text-ink-light" style={{ fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)" }}>In development...</p>
    </div>
  );
}
