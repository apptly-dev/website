# apptly-website

Source code for [apptly.co][apptly]. Apptly Software's
open-source projects are indexed at
[awesome-apptly.com][awesome-apptly].

## Stack

- [Nuxt 3][nuxt] + Vue 3
- [`@nuxt/ui`][nuxt-ui] + [`@nuxt/ui-pro`][nuxt-ui-pro]
  for components and styling
- [`@nuxt/content`][nuxt-content] v2 for Markdown-based
  content
- [`@nuxt/icon`][nuxt-icon] with Heroicons
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
  Worker bundle plus prerendered static assets in
  `.output/public/` (routes from `nuxt.config.ts`)
- `pnpm preview` — local Cloudflare Workers preview via
  `wrangler dev` using settings from `wrangler.toml`
  (runs the `[build] command` and serves the `.output/`
  bundle)
- `pnpm generate` — full static site generation
- `pnpm lint` / `pnpm lint:check` — ESLint with / without
  `--fix`
- `pnpm check` — `generate` + `lint:check`
- `pnpm clean` — wipe `.output`, `.nuxt`, `node_modules`

## Source layout

- `src/pages/` — routed pages
- `src/layouts/` — layouts
- `src/components/app/` — site-specific components
- `src/content/` — Markdown content rendered via
  `<ContentDoc>`
- `src/server/routes/` — Nitro server routes
- `src/public/` — static assets copied as-is to
  `.output/public/` (favicon, well-known files)

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
[nuxt-ui]: https://ui.nuxt.com
[nuxt-ui-pro]: https://ui.nuxt.com/pro
[nuxt-content]: https://content.nuxt.com
[nuxt-icon]: https://github.com/nuxt/icon
[cf-workers]: https://developers.cloudflare.com/workers/
[agents]: ./AGENTS.md
