# photographer-ui

## Stack
Single Next.js 16 (App Router, Turbopack default) app — React 19.2, TypeScript 5.7, Tailwind v4, shadcn/ui (`new-york`/`zinc`/`lucide`), Supabase, Cloudflare R2 via AWS S3 SDK. No monorepo. The historical `cms/` sub-app was removed; only the root project is active. README still references it — trust the code.

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

`supabase/config.toml` and `supabase/migrations/` are present. Apply with the Supabase CLI (`supabase db push`) against a linked project.

## Architecture

### Routing
- `src/app/page.tsx` → redirects `/` to `/en`.
- Public pages under `src/app/[locale]/` (locales: `en`, `es`).
- **Locale list is hardcoded** in `src/app/[locale]/layout.tsx` (`const LOCALES = ["en", "es"]`); the Supabase `languages` table exists but is **not** read here despite `generateStaticParams` looking like it might.
- `src/app/error.tsx` and `src/app/not-found.tsx` are user-facing and written in **Spanish** ("Algo salió mal", "Página no encontrada").

### Public pages (`src/app/[locale]/`)
- `page.tsx` (home, `revalidate = 60` ISR) — renders `Hero`, `InfiniteCarousel`, `About`, `Gallery`, `Pricing`, `Contact` in that order. `Services.tsx` is imported but not rendered.
- `about/`, `contact/` — still hardcoded (not yet CMS-driven).
- `services/` — fully CMS-driven, has `generateMetadata` from `services.meta`.
- `privacy-policy/`, `terms-and-conditions/` — static legal pages.

### CMS (Supabase-backed)
Home + Services are CMS-driven. The single source of truth is `public.content` (one row per `section` key). The registry lives in `src/types/cms.ts`:
- `CmsSectionData` maps each section key (e.g. `"home.hero"`, `"services.packages"`) to its JSONB shape.
- `CMS_SECTION_KEYS: CmsSectionKey[]` — runtime list of all 16 valid keys.
- `isCmsSectionKey(key: string)` — type guard.
- All editable text is wrapped in `locales: { en: XxxLocale, es: XxxLocale }`. Shared assets (images) live at the top level of `data`.
- Sections: 4 home (`home.hero/carousel/about/gallery`) + 5 services (`services.meta/packages/included/process/faq`) + 4 about + 3 contact. Only the 9 home + services have panel editors; about/contact still show a "coming soon" placeholder in the dashboard.
- **Services is the single source of truth for pricing** — the home `Pricing.tsx` reads from `services.packages` per locale.
- `src/lib/cms-icons.ts` — curated lucide icon allowlist (`SERVICES_ICONS` + `getServicesIcon(name)`). Icons are stored in the DB as the key name string; renaming a key breaks saved content.

### Admin (`src/app/panel/`)
- `login`, `sign-up`, `(protected)/dashboard` (sub-pages: `appointments`, `content`, `settings`). `/panel` redirects to `/panel/login`.
- `src/app/panel/actions.ts` has all server actions: `loginAction`, `signUpAction`, `signOutAction`, `getCurrentUserAction`, plus 9 `get*Content` + 9 `save*LocaleContent` pairs (one per implemented section) and a generic `getContentAction<T>`.
- All CMS reads go through `getContentAction` which returns `{ data, error }`.
- The `content` dashboard (`src/app/panel/(protected)/dashboard/content/page.tsx`) uses a **map-based loader dispatch**: add a new section by adding one entry to the `loaders` map (`Record<string, () => Promise<unknown>>`) and one `if` branch in `renderEditor`. `SKELETON_VARIANTS` maps each section to one of 3 skeleton shapes (`locale`, `locale-image`, `grid`) — reuse the existing `EditorSkeleton` instead of writing new skeletons.

### API
- `src/app/api/r2/upload-url/route.ts` — POST, requires authenticated user, returns presigned R2 PUT URL.

### Auth
- `src/proxy.ts` runs on `/panel/:path*`. **Next 16 renamed `middleware.ts` to `proxy.ts` — do not add `middleware.ts`.**
- Helper: `src/lib/supabase/proxy.ts` (`updateSession`).
- Supabase clients: `src/lib/supabase/{client,server,proxy,user}.ts`.
- R2 helpers: `src/lib/r2/{client,upload,url}.ts`, re-exported via `src/lib/r2/index.ts`. CMS stores **R2 object keys** (e.g. `"hero/1784183664742-hr90kp-photo_1.webp"`); use `getR2PublicUrl(key)` to build the public URL.

### Static copy (`src/config/lang/`)
- Only `Header`, `Footer`, `MobileNavigation`, `Widgets` still read from `getContent(locale)`. Used for nav labels, footer text, theme widgets. Do **not** add new static copy here — the home/services sections are CMS-driven.
- The `hero`/`about`/`services` keys in this bundle are dead code from before the CMS migration.

### Components
- `src/components/ui/` — shadcn primitives (incl. `Skeleton`).
- `src/components/common/` — `Header`, `Footer`, `Widgets`, `MobileNavigation`, `PageSection`, `Titles`.
- `src/components/home/` — page sections; **`infinite-carousel.tsx` is lowercase + dashes, preserve.**
- `src/components/panel/` — `PanelSidebar`, `PanelBottomBar`, `ImageUpload`, `editors/{Hero,Carousel,About,Gallery,ServicesMeta,ServicesPackages,ServicesIncluded,ServicesProcess,ServicesFaq}Editor.tsx`.

### Hooks
- `src/hooks/{useImageUpload,useUser}.ts`. `useImageUpload` returns a `previewUrl` (local object URL) AND an `uploadedKey` (R2 key) — they are separate states; you must call `selectFile()` then `uploadToR2(category)` to get a key.

### Path aliases
- `@/*` → `./src/*`. shadcn aliases in `components.json`.

### Analytics
- OneDollarStats script in `src/app/layout.tsx` (`next/script`, `afterInteractive`) — leave unless told otherwise.

## Database
`supabase/migrations/`:
- `20250101000000_create_languages_table.sql` — `public.languages` (code, name, is_active). RLS: public read of active rows. Seeded with `en`, `es`. Currently unused by app code.
- `20250715000000_create_content_table.sql` — `public.content` (section unique, data jsonb, timestamps). RLS: public `select`, authenticated `insert/update/delete`. Section keys are e.g. `home.hero`, `services.packages`; `data` JSONB holds shared fields + nested `locales`.

`supabase/seed.sql` is a stub — add local seed data there. `supabase config.toml` pins local stack ports (API 54321, DB 54322, Studio 54323).

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
- New static copy in `src/config/lang/` — it's only for nav/footer.
- New ad-hoc skeleton components — extend `SKELETON_VARIANTS` and reuse `EditorSkeleton` instead.
