"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProjectPanelProps {
  children: React.ReactNode;
}

/**
 * ProjectPanel — F451-style overlay bar.
 *
 * Full-width horizontal bar centered at ~30vh tall.
 * No solid fill — content floats over a dimmed scrim.
 * Close via: close button, Escape key, scrim click.
 */
export default function ProjectPanel({ children }: ProjectPanelProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => router.back(), 300);
  }, [router]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [close]);

  return (
    <>
      {/* Scrim */}
      <div
        className={`fixed inset-0 z-[55] bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Close button — top right, above bar */}
      <button
        onClick={close}
        className={`fixed top-6 right-6 z-[57] flex h-10 w-10 items-center justify-center text-paper/70 transition-all duration-300 hover:text-paper ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 4l12 12M16 4L4 16" />
        </svg>
      </button>

      {/* Bar — centered vertically, full width, 50vh */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 right-0 top-1/2 z-[56] h-[75vh] -translate-y-1/2 transition-all duration-300 ease-out motion-reduce:duration-0 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        }`}
      >
        <div className="flex h-full w-full">
          {children}
        </div>
      </div>
    </>
  );
}
