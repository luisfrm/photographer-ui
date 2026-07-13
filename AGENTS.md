# photographer-ui

## Overview
Single Next.js 16 (App Router) app (React 19.2, TypeScript 5.7, Tailwind v4, Supabase, shadcn/ui).

The repo previously contained a separate `cms/` Next.js app — it was removed. Only the root project is active.

## Install & run
- `pnpm install && pnpm start` → http://localhost:3005
- Requires Node.js 20.9+ (Next.js 16 minimum).

## Scripts
- `pnpm start` — dev with Turbopack (default in v16) on **port 3005** (not 3000)
- `pnpm build` / `pnpm build:strict` — production build
- `pnpm preview` — serve production build
- `pnpm lint` / `pnpm lint:fix` — uses ESLint CLI (Next.js 16 removed `next lint`)

No test or typecheck scripts. No CI workflows, no pre-commit hooks. Verify changes with `pnpm lint` + `pnpm build`.

## Architecture
- `src/app/page.tsx` redirects `/` → `/en`.
- All real pages live under `src/app/[locale]/` (locales: `en`, `es`).
- In Next 15+, `params` is a `Promise<{ locale: string }>` — see `src/types/pages.d.ts`.
- Async Request APIs (`cookies()`, `headers()`, `params`, `searchParams`) are **fully async in v16** — no sync fallback. The code already uses `await`.
- `src/app/[locale]/layout.tsx` validates the locale (hardcoded fallback `['en', 'es']`) and exposes `generateStaticParams` that reads the `languages` table from Supabase (falls back to `['en','es']` if empty).
- Home page sets `export const revalidate = 60` (ISR).
- Supabase clients: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server with cookies).
- Component layout: `src/components/ui/` (shadcn primitives), `src/components/common/` (Header, Footer, Widgets, etc.), `src/components/home/` (page sections).
- Path alias: `@/*` → `./src/*`. shadcn aliases: components → `@/components`, ui → `@/components/ui`, lib → `@/lib`, utils → `@/lib/utils`, hooks → `@/hooks`.

## Environment variables
Create `.env.local` at the repo root (Next loads it automatically; no `.env.example` is committed):

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase reads (static params, server/client) | Public, must be prefixed `NEXT_PUBLIC_` to be visible in the browser. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | All Supabase reads | Public publishable key, same prefix rule. |

Without these, Supabase calls will throw. There is no server-only service role key in use today.

## Styling
- Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config.*`; config is in `postcss.config.mjs`).
- Global stylesheet: `src/styles/globals.css`, imported as `@/styles/globals.css` in `src/app/layout.tsx`.
- Fonts loaded via `next/font/google`: Montserrat (`--font-sans`), Playfair Display (`--font-serif`), Geist Mono (`--font-mono`).
- `components.json` declares the shadcn style as `new-york`, baseColor `zinc`, icon library `lucide`.

## Conventions
- **Unused vars are intentionally allowed**: ESLint disables `no-unused-vars` and `@typescript-eslint/no-unused-vars`; `tsconfig` sets `noUnusedLocals: false`, `noUnusedParameters: false`, `noUncheckedIndexedAccess: false`. Don't "fix" leftover imports — they won't fail the build.
- Many file comments, the 404 page, and the error page are written in **Spanish** — keep new copy consistent.
- Root layout injects a OneDollarStats analytics script via `next/script` (`afterInteractive`) — leave it unless told otherwise.

## Gotchas
- **`next.config.ts` `images.localPatterns`**: `src/components/home/Pricing.tsx` uses `/placeholder.svg?height=...&width=...&text=...` (local image with query string). Next.js 16 requires explicit allowlist — pattern is configured in `next.config.ts`. Adding new query-string local images means updating the pattern there.
- **`components.json` points to `src/app/globals.css`**, but the actual stylesheet is `src/styles/globals.css`. If you run the shadcn CLI, double-check the path.
- **React Compiler is OFF**: v16 made it stable, but it's not enabled by default. To enable later when content goes dynamic, set `reactCompiler: true` in `next.config.ts` and add `babel-plugin-react-compiler` as a devDependency. Expect slower builds.
- **No tests, no CI, no Storybook, no codegen** — don't add commands that don't exist.
- **Next.js 16 removed `next lint`**. The project uses `eslint .` (via `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` direct imports). Run `pnpm lint` to verify.
- **Turbopack is the default** in v16. No `--turbopack` flag needed on `pnpm start` or `pnpm build`. Webpack users must opt out with `--webpack`.
- `src/components/home/infinite-carousel.tsx` uses a lowercase + dashes filename while siblings are PascalCase — preserve as-is.
