# apptly-website

Source code for [apptly.co][apptly]. Apptly Software's
open-source projects are indexed at
[awesome-apptly.com][awesome-apptly].

## Stack

- [Nuxt 4][nuxt] + Vue 3
- [Tailwind CSS 4][tailwind] via `@tailwindcss/vite`
- [`@poupe/tailwindcss`][poupe-tailwindcss] for Material
  Design 3 theming (CSS-first, wired from
  `src/assets/css/main.css`)
- [`@nuxt/content`][nuxt-content] v3 with a Cloudflare D1
  binding
- [`@nuxt/icon`][nuxt-icon] for icon components
- [Cloudflare Workers][cf-workers] hosting via the Nitro
  `cloudflare-module` preset

## Setup

Requires **Node ≥ 22** and **pnpm ≥ 10.33**.

```bash
pnpm install
```

## Development

Start the dev server on <http://localhost:3000>:

```bash
pnpm dev
```

Other useful scripts:

- `pnpm build` — production build to `.output/` — Cloudflare
  Worker bundle plus pre-rendered static assets in
  `.output/public/` (routes from `nuxt.config.ts`)
- `pnpm lint` / `pnpm lint:check` — ESLint (with / without
  `--fix`), `nuxt typecheck`, then cspell
- `pnpm type-check` — type-check the project via
  `nuxt typecheck` (vue-tsc)
- `pnpm check` — `lint:check` + `type-check` + `build`
- `pnpm clean` — wipe `.output`, `.nuxt`, `node_modules`

## Source layout

- `src/assets/css/` — Tailwind entry + `@poupe/tailwindcss`
  theme (`main.css`)
- `src/pages/` — routed pages
- `src/layouts/` — layouts
- `src/components/app/` — site-specific components
- `src/components/poupe/` — local MD3 components
  (auto-imported as `<Poupe*>`); candidates for future
  promotion into `@poupe/vue`
- `src/content/` — Markdown content rendered via
  `<ContentRenderer>`
- `src/server/` — Nitro server routes

## Deployment

Cloudflare Workers Builds runs `pnpm build` (configured in
the `[build]` section of `wrangler.toml`) on every push and
deploys the resulting bundle. `wrangler.toml` also:

- pins `compatibility_date` and `nodejs_compat`
- enables `workers_dev` — the production Worker is
  reachable at `<name>.<subdomain>.workers.dev` for smoke
  tests
- enables `preview_urls` — every deployment gets a unique
  preview subdomain

apptly.co continues to resolve to the legacy Pages project
during the transition; the Workers deploy lives at
`apptly-website.apptly.workers.dev`.

## Agent notes

See [AGENTS.md][agents] for operational notes aimed at
agents working in this repo (MCP setup, files never to
commit).

[apptly]: https://apptly.co
[awesome-apptly]: https://awesome-apptly.com
[nuxt]: https://nuxt.com
[tailwind]: https://tailwindcss.com
[poupe-tailwindcss]: https://www.npmjs.com/package/@poupe/tailwindcss
[nuxt-content]: https://content.nuxt.com
[nuxt-icon]: https://github.com/nuxt/icon
[cf-workers]: https://developers.cloudflare.com/workers/
[agents]: ./AGENTS.md
