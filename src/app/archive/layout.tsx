/**
 * /archive route layout — hides the root Footer since the infinite canvas
 * is fixed full-viewport and the Footer would render invisibly underneath,
 * wasting resources (image load, FooterCanvas animation).
 */
export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`footer { display: none !important; }`}</style>
      {children}
    </>
  );
}
