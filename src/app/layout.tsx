import type { Metadata } from "next";
import { fontSans, fontSerif, fontMono } from "@/lib/fonts";
import { siteMetadata } from "@/lib/metadata";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "@/styles/globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="bg-background text-ink font-serif antialiased">
        <GrainOverlay />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
