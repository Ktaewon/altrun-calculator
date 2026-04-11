# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean-language phone cost calculator web app ("휴대폰 비용 계산기") that compares total ownership costs across five purchase methods: public subsidy (공시지원금), selective agreement (선택약정), selective agreement + extra subsidy, selective agreement + MVNO switch (알뜰런), and unlocked + MVNO (자급제+알뜰폰). Deployed on Netlify.

## Commands

- `npm run dev` — start Next.js dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, core-web-vitals + typescript)
- `npm start` — serve production build

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, deployed via Netlify with `@netlify/plugin-nextjs`.

**Routing (app/):**
- `/` — homepage with Calculator and Kakao AdFit ads
- `/guide` — purchase method guide with InfoSection (reuses FAQ data for JSON-LD)
- `/privacy` — privacy policy (static)
- `robots.ts`, `sitemap.ts` — dynamic SEO routes using constants from `lib/site.ts`

**Key components (components/):**
- `Calculator.tsx` — the core client component. Contains all calculation logic, form state (~20+ `useState` hooks), comparison table, timing chart, and detail modals. This is by far the largest file in the project.
- `InfoSection.tsx` — guide cards, term definitions, and FAQ. Exports `faqItems` (used by `/guide` for FAQ JSON-LD structured data).
- `KakaoAdFit.tsx` — Kakao AdFit ad integration (responsive PC/mobile). Ad unit IDs come from `NEXT_PUBLIC_KAKAO_ADFIT_*` env vars.
- `AdBanner.tsx` — legacy Google AdSense component (not currently used in pages).
- `Navbar.tsx` / `ThemeToggle.tsx` — client components for navigation and light/dark/system theme toggle.

**Shared constants (lib/site.ts):** `siteUrl`, `siteName`, `siteTitle`, `siteDescription`, `siteKeywords` — used across layout metadata, OG tags, robots, and sitemap.

**Styling:** Single `globals.css` file with CSS custom properties for theming (`data-theme` attribute on `<html>`). No CSS modules or utility framework.

**Fonts:** Noto Sans KR (body) + JetBrains Mono (monospace, via CSS variable `--font-mono`).

## Key Patterns

- Path alias: `@/*` maps to project root (e.g., `@/components/Calculator`)
- Theme persistence: inline `<script>` in layout.tsx reads `localStorage('theme-preference')` before hydration to prevent flash
- All pages export `metadata` objects for SEO; layout provides base metadata with `metadataBase`
- Ad unit IDs are environment variables (`NEXT_PUBLIC_KAKAO_ADFIT_PC_UNIT`, `NEXT_PUBLIC_KAKAO_ADFIT_MOBILE_UNIT`)
- `legacy_site/` contains the original static HTML/CSS/JS version (not part of the Next.js app)
