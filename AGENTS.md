# photographer-ui

## Overview
Two independent Next.js 15 (App Router) apps in the same repo:
- **Root** — public photographer studio site (React 19, TypeScript, Tailwind v4, Supabase, shadcn/ui).
- **`cms/`** — separate admin dashboard with its own `package.json` and lockfile. Not a pnpm workspace.

## Install & run
- Root: `pnpm install && pnpm start` → http://localhost:3005
- CMS:  `cd cms && pnpm install && pnpm dev` → http://localhost:3000

## Scripts (root)
- `pnpm start` — dev with Turbopack on **port 3005** (not 3000)
- `pnpm build` / `pnpm build:strict` — production build
- `pnpm preview` — serve production build
- `pnpm lint` / `pnpm lint:fix`

No test or typecheck scripts. No CI workflows, no pre-commit hooks. Verify changes with `pnpm lint` + `pnpm build`.

## Architecture
- `src/app/page.tsx` redirects `/` → `/en`.
- All real pages live under `src/app/[locale]/` (locales: `en`, `es`).
- In Next 15, `params` is a `Promise<{ locale: string }>` — see `src/types/pages.d.ts`.
- `src/app/[locale]/layout.tsx` validates the locale (hardcoded fallback `['en', 'es']`) and exposes `generateStaticParams` that reads the `languages` table from Supabase (falls back to `['en','es']` if empty).
- Home page sets `export const revalidate = 60` (ISR).
- Supabase clients: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (`createSupabaseServerClient` with cookies, `createSupabaseStaticClient` for build-time reads).
- Component layout: `src/components/ui/` (shadcn primitives), `src/components/common/` (Header, Footer, Widgets, etc.), `src/components/home/` (page sections).
- Path alias: `@/*` → `./src/*`. shadcn aliases: components → `@/components`, ui → `@/components/ui`, lib → `@/lib`, utils → `@/lib/utils`, hooks → `@/hooks`.

## Environment variables
Create `.env.local` at the repo root (Next loads it automatically; no `.env.example` is committed):

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase reads (static params, server/client) | Public, must be prefixed `NEXT_PUBLIC_` to be visible in the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All Supabase reads | Public anon key, same prefix rule. |

Without these, `createSupabaseStaticClient` and `createSupabaseServerClient` will receive `undefined` and Supabase calls will throw. There is no server-only service role key in use today.

## Styling
- Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config.*`; config is in `postcss.config.mjs`).
- Global stylesheet: `src/styles/globals.css`, imported as `@/styles/globals.css` in `src/app/layout.tsx`.
- Fonts loaded via `next/font/google`: Montserrat (`--font-sans`), Playfair Display (`--font-serif`), Geist Mono (`--font-mono`).
- `components.json` declares the shadcn style as `new-york`, baseColor `zinc`, icon library `lucide`.

## Conventions
- **Unused vars are intentionally allowed**: ESLint disables `no-unused-vars` and `@typescript-eslint/no-unused-vars`; `tsconfig` sets `noUnusedLocals: false`, `noUnusedParameters: false`, `noUncheckedIndexedAccess: false`. Don't "fix" leftover imports — they won't fail the build.
- Many file comments, the 404 page, and the error page are written in **Spanish** — keep new copy consistent.
- Root layout injects a OneDollarStats analytics script via `next/script` (`afterInteractive`) — leave it unless told otherwise.
- `next.config.ts` only sets `trailingSlash: false`.

## Gotchas
- `components.json` points to `src/app/globals.css`, but the actual stylesheet is `src/styles/globals.css`. If you run the shadcn CLI, double-check the path.
- The root app and `cms/` are **not a pnpm workspace** — install and run them separately, each with its own `node_modules`.
- `src/components/home/infinite-carousel.tsx` uses a lowercase + dashes filename while siblings are PascalCase — preserve as-is.
- `cms/` is a separate Next.js app with its own `lint` and `dev` scripts; changes there do not affect the root app.
- No tests, no CI, no Storybook, no codegen — don't add commands that don't exist.
