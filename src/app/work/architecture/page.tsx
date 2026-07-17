import type { Metadata } from "next";
import Flipbook from "@/components/interactive/Flipbook";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "Architecture portfolio — selected works 2022–2024, presented as a book you turn through.",
};

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <div className="py-20 md:py-24">
        <Flipbook />
      </div>
    </div>
  );
}
