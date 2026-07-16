# photographer-ui

## Stack
Single Next.js 16 (App Router, Turbopack default) app — React 19.2, TypeScript 5.7, Tailwind v4, shadcn/ui (`new-york`/`zinc`/`lucide`), Supabase, Cloudflare R2 via AWS S3 SDK. No monorepo, no `cms/` sub-app (the historical `cms/` was removed; only the root project is active). README still references it — trust the code.

## Commands
- `pnpm dev` — dev server on **port 3005** (Turbopack)
- `pnpm build` / `pnpm build:strict` — production build
- `pnpm preview` — serve production build
- `pnpm lint` / `pnpm lint:fix` — ESLint CLI (Next 16 removed `next lint`)

No test, typecheck, or format script. No CI, no pre-commit hooks. Verify with `pnpm lint && pnpm build`. Requires Node 20.9+.

## Environment
`.env.example` is committed. Copy to `.env.local`:

| Var | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase reads | Read at build time. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | All Supabase reads | Publishable/anon key. |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Image uploads from `/panel` | Cloudflare R2. Not `NEXT_PUBLIC_*` — server-only. |

Without Supabase vars, Supabase calls throw. Without R2 vars, `/api/r2/upload-url` returns 500.

`supabase/config.toml` and `supabase/migrations/` are present (see Database). Apply migrations with the Supabase CLI (`supabase db push`) against a linked project.

## Architecture
- `src/app/page.tsx` → redirects `/` to `/en`.
- Public pages under `src/app/[locale]/` (locales: `en`, `es`). **Locale list is hardcoded** in `src/app/[locale]/layout.tsx` (`const LOCALES = ["en", "es"]`); the Supabase `languages` table exists but is **not** read here despite `generateStaticParams` looking like it might.
- Home page: `src/app/[locale]/page.tsx` — sections in order: `Hero`, `InfiniteCarousel`, `About`, `Gallery`, `Pricing`, `Contact`. `export const revalidate = 60` (ISR). `Services` is imported but not rendered.
- Admin: `src/app/panel/` → `login`, `sign-up`, `(protected)/dashboard` (sub-pages: `appointments`, `content`, `settings`). `/panel` redirects to `/panel/login`. `src/app/panel/actions.ts` has the server actions (`loginAction`, `signUpAction`, `signOutAction`, `getHeroContent`, `saveHeroContent`, `saveCarouselContent`, generic `getContentAction` / `saveContentAction` for the `content` table).
- API: `src/app/api/r2/upload-url/route.ts` — POST, requires authenticated user, returns presigned R2 PUT URL.
- Auth guard: `src/proxy.ts` runs on `/panel/:path*`. **Next 16 renamed `middleware.ts` to `proxy.ts` — do not add `middleware.ts`.** Helper: `src/lib/supabase/proxy.ts` (`updateSession`).
- Supabase: `src/lib/supabase/{client,server,proxy,user}.ts`.
- R2: `src/lib/r2/{client,upload,url}.ts` (S3Client + presigned upload/delete + URL helpers), re-exported via `src/lib/r2/index.ts`.
- **Static site copy** lives in `src/config/lang/{en,es,types}.ts` (`getContent(locale)` returns the bundle). Not pulled from Supabase. Edit the TS file to change nav/hero/about/services text.
- `src/services/` exists but is empty.
- Components:
  - `src/components/ui/` — shadcn primitives
  - `src/components/common/` — `Header`, `Footer`, `Widgets`
  - `src/components/home/` — page sections; **`infinite-carousel.tsx` is lowercase + dashes, preserve**
  - `src/components/panel/` — `PanelSidebar`, `PanelBottomBar`, `ImageUpload`, `editors/`
- Hooks: `src/hooks/{useImageUpload,useUser}.ts`.
- Path alias: `@/*` → `./src/*`. shadcn aliases in `components.json`.
- Analytics: OneDollarStats script in `src/app/layout.tsx` (`next/script`, `afterInteractive`) — leave unless told otherwise.
- `src/app/error.tsx` and `src/app/not-found.tsx` are user-facing and written in **Spanish** ("Algo salió mal", "Página no encontrada").

## Database
`supabase/migrations/`:
- `20250101000000_create_languages_table.sql` — `public.languages` (code, name, is_active). RLS: public read of active rows. Seeded with `en`, `es`. Currently unused by app code.
- `20250715000000_create_content_table.sql` — `public.content` (section unique, data jsonb, timestamps). RLS: public `select`, authenticated `insert/update/delete`. CMS sections are one row per `section` key (e.g. `home.hero`, `home.carousel`); `data` JSONB holds shared fields + nested `locales`.

`supabase/seed.sql` is a stub — add local seed data there. `supabase config.toml` pins the local stack ports (API 54321, DB 54322, Studio 54323, etc.).

## Next.js 16 gotchas
- `params`, `searchParams`, `cookies()`, `headers()` are **fully async** — always `await`. Use `PageProps` from `src/types/pages.d.ts`.
- `next.config.ts`:
  - `images.localPatterns: [{ pathname: "/**" }]` — required for `/placeholder.svg?height=...&width=...&text=...` used by `Pricing.tsx`.
  - `images.remotePatterns` whitelists `*.r2.dev`, `*.r2.cloudflarestorage.com`, `r2-photographer.luisrivas.site`. Add new R2 hostnames here.
- React Compiler is **off**. Enabling requires `reactCompiler: true` in `next.config.ts` + `babel-plugin-react-compiler` devDep. Expect slower builds.
- `components.json` `tailwind.css` points to `src/app/globals.css` — **wrong**; real stylesheet is `src/styles/globals.css`. Override the path if you run the shadcn CLI.
- Turbopack is the default. Don't pass `--turbopack`; opt out with `--webpack` if needed.
- `pnpm-workspace.yaml` exists for a single package (sets `allowBuilds: { sharp: false, unrs-resolver: false }` and excludes several `@supabase/*` packages from `minimumReleaseAge`). Don't delete it.

## Conventions
- Unused vars/imports are intentional: ESLint disables `no-unused-vars` and `@typescript-eslint/no-unused-vars`; tsconfig sets `noUnusedLocals: false`, `noUnusedParameters: false`, `noUncheckedIndexedAccess: false`. Don't "clean up" leftover imports — they won't fail the build.
- `noUncheckedIndexedAccess` is off, so `arr[i]` is `T`, not `T | undefined`. Don't add defensive `!` or guards unless you actually need them.
- `@typescript-eslint/no-explicit-any` is a warning, not an error. Avoid widening types.

## Don't add
- Tests / test runner config (none in repo).
- CI workflows (none in repo).
- A `middleware.ts` (Next 16 uses `proxy.ts`).
- A `cms/` sub-app (was removed).
