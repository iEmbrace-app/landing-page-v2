# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Calming Place" / "Embraceland" — a wellness/meditation product landing page for the ROOT device and iEmbraceland app. React 18 SPA built with Vite, TypeScript (strict), Framer Motion, and CSS Modules.

## Commands

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # tsc + Vite production build → docs/
npm run lint         # ESLint, zero warnings allowed
npm run preview      # Preview production build locally
npm run build:analyze  # Build + open bundle-analysis.html
npm run clean        # Remove node_modules, docs, dist, .vite
```

**No test runner** — testing is browser-console based via `window.runTests()` (see `documentation/TESTING_SUITE_GUIDE.md`).

## Architecture

**Entry flow**: `index.html` → `src/main.tsx` → custom `Router` → `src/App.tsx`

**Routing**: Hash-based, implemented manually in `main.tsx`. `#/privacy` renders `src/pages/Privacy.tsx`; everything else renders `<App>`.

**Page sections** live in `src/components/sections/`. `App.tsx` assembles them in order. Four sections (`TabSection`, `HoldMeditateSection`, `ImmerseSection`, `TestimonialSection`) are lazy-loaded via `React.lazy()` — their wrappers are in `src/components/LazyComponents.tsx`.

**CSS Modules** are co-located with each component. Global design tokens (colors, spacing, etc.) are CSS custom properties in `src/tokens/tokens.css`, with a lavender theme override in `src/tokens/lavender-theme.css`.

**Responsive breakpoints**: `useScreenSize` hook (`src/hooks/useScreenSize.ts`) exposes `isMobile` (≤767px) and `isTablet` (≤1024px), passed as props to conditionally render effects.

**Media**: All videos, images, and audio are hosted on AWS S3. URLs are managed by the singleton `VideoService` in `src/services/videoService.ts` (singleton + observer pattern).

**Analytics**: GA4 tag injected inline in `index.html`; `useAnalytics` hook (`src/hooks/useAnalytics.ts`) fires section-view and engagement-time events via `IntersectionObserver`.

**Build output**: `docs/` folder (served by GitHub Pages). `vercel.json` configures Vercel SPA rewrite to `index.html`. Both deployment targets are active.

**Service Worker**: `public/sw.js` handles asset caching in production only; registered in `main.tsx`.

**Shared types**: `src/types/index.ts` — `TabKey`, `TabContent`, `ScreenSizeHook`. Static tab content data is in `src/data/tabContent.ts`.
