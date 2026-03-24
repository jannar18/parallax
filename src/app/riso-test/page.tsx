import RisoImage from "@/components/ui/RisoImage";

export default function RisoTestPage() {
  return (
    <main className="min-h-screen p-20 bg-paper">
      <div className="max-w-screen-xl mx-auto space-y-12">
        
        <header className="space-y-4">
          <h1 className="text-5xl font-serif italic tracking-tight">Riso Filter Test</h1>
          <p className="text-lg text-ink-light max-w-2xl leading-relaxed">
            Testing live SVG-based Riso filter.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-4">
            <h2 className="text-xl font-medium uppercase tracking-wider">Software Split (Spruce)</h2>
            <RisoImage 
              src="/images/home/software-split.riso.1.png" 
              alt="Test 1"
              breathability={0.7}
              inkColor="#4a635d"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium uppercase tracking-wider">AI+Arch Merge (Scarlet)</h2>
            <RisoImage 
              src="/images/home/merge.riso.1.png" 
              alt="Test 2"
              breathability={0.8}
              inkColor="#f65058"
            />
          </div>

        </section>

      </div>
    </main>
  );
}
