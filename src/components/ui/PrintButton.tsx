"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden font-mono uppercase tracking-wider text-ink-lighter transition-colors hover:text-scarlet cursor-pointer"
      style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.75rem)" }}
    >
      Print / Save PDF
    </button>
  );
}
