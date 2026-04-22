# AGENTS.md

Operational notes for agents. See [README.md][readme] for
project overview, stack, and dev commands.

## Local MCP (`.mcp.json`)

`.mcp.json` is tracked in this repo so the MCP
configuration stays in sync across contributors.

- **`chrome-devtools`** (stdio, `chrome-devtools-mcp@latest`)
  — expects a headless Chromium reachable at
  `http://127.0.0.1:9236`. Port is project-local:
  sibling repos use 9234 (`awesome-apptly`) and 9235
  (`poupe-ui/poupe`).

Start Chromium before using `mcp__chrome-devtools__*`
tools. A persistent `--user-data-dir` is required — without
it the MCP server loses session state between calls:

```bash
chromium --headless --no-sandbox --remote-debugging-port=9236 \
  --user-data-dir=.cache/chromium-mcp \
  --no-first-run --no-default-browser-check --disable-gpu \
  about:blank
```

`.cache/` is gitignored and is not touched by either
cleanup script: `nuxt cleanup` targets `node_modules/.cache`
(among other paths), and `pnpm clean` wipes `node_modules`
entirely — neither touches the repo-root `.cache/`.

## Files never to commit

- `NEXT.md` — personal task tracker, intentionally
  untracked.
- `.tmp/` — scratch area for commit messages, PR bodies,
  and transient agent artefacts.
- `.claude/` — local agent state.
- `.env`, `.env.*` (except `.env.example`) — secrets.
- `.wrangler/tmp`, `.wrangler/state/v3` — wrangler local
  state.
- `.cache/` — includes the Chromium MCP user-data-dir.

## Branch workflow

- `main` is the default and deploy target.
- Feature work branches as `pr-<user>-<topic>` (e.g.
  `pr-amery-workers`, `pr-amery-docs`).
- PRs target `main`.

## Commit conventions

- British English spelling in commit messages, code
  comments, and docs.
- Commit messages drafted in `.tmp/commit-<slug>.txt` and
  passed via `git commit -s -F`.
- Never use AI-attribution trailers
  (`Co-Authored-By: Claude …`) unless explicitly asked.
- Stage files explicitly by path; no `git add .` /
  `git add -A`.

[readme]: ./README.md
