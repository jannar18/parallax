# Parallax

**Live:** https://parallax.haus/

The personal site of Julianna Roberts — a restrained, typographic, Riso-print portfolio bridging
architecture practice and software/AI practice into one identity artifact. Built to Asimov-Collective
craft: editorial pacing, generous whitespace, a semibold-italic serif leading over geometric sans.

See [`DESIGN.md`](./DESIGN.md) for the design system (Riso palette, Cormorant Garamond / Futura PT /
Degular Mono type) and [`CLAUDE.md`](./CLAUDE.md) for full project context and conventions.

## Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Styling:** Tailwind CSS 3 + CSS custom properties (design tokens in `src/styles/tokens.css`)
- **Content:** MDX in `src/content/`, loaded via `gray-matter` + `next-mdx-remote`
- **Fonts:** Cormorant Garamond (headings) · Jost→Futura PT (body) · DM Mono→Degular Mono (code)
- **Package manager:** pnpm · **Deploy:** Vercel → parallax.haus

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm lint     # ESLint (next/core-web-vitals)
```

## Structure

```
src/
├── app/        # App Router pages (home, about, work, writing, now, archive)
├── components/ # global (Header/Footer/SmoothScroll), ui, interactive
├── content/    # MDX collections: now/, writing/, work-software/, work-architecture/
├── lib/        # content loading, fonts, hero canvas, metadata
└── styles/     # globals.css, tokens.css
```

The `research/` directory holds the design/graphics research that informs the visual language —
`research/03-graphics-pipeline-final.md` is the primary reference for graphics decisions.
