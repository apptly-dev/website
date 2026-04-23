# AGENTS.md

<!-- cspell:words tmpfs -->

Operational notes for agents. See [README.md][readme] for
project overview, stack, and dev commands.

## Local MCP (`.mcp.json`)

`.mcp.json` is tracked in this repo so the MCP
configuration stays in sync across contributors.

- **`chrome-devtools`** (stdio, `chrome-devtools-mcp@latest`)
  — expects a Chrome/Chromium DevTools endpoint reachable
  at `http://127.0.0.1:9236`. Port is project-local:
  sibling repos use 9234 (`awesome-apptly`) and 9235
  (`poupe-ui/poupe`).

Start a browser on that port before using
`mcp__chrome-devtools__*` tools. Two workflows, depending
on who is driving:

### Shared browser via SSH (pair-driving)

Use `./ssh-chrome.sh` when the human drives the browser
(logs in, navigates, fills forms) while Claude observes
the live DOM, console, and network activity via the MCP.
The script opens a **visible** Chrome on the host's
`DISPLAY=:0` and tunnels the DevTools port back through
SSH, so both sides see the same session.

```bash
# defaults: port 9236, host 172.17.0.1, google-chrome
./ssh-chrome.sh

# override host and browser (port is positional)
./ssh-chrome.sh 9236 other-host chromium
```

Ctrl-C in the terminal running the script tears down both
the tunnel and the remote browser.

Prerequisites live on the host: `sshd` must accept
connections from the Docker bridge (`docker0`), the host
firewall must allow bridge → `:22`, and the remote login
must populate `$XDG_RUNTIME_DIR` (any PAM/systemd session
does). On Ubuntu:

```bash
sudo ufw allow in on docker0 to any port 22 proto tcp
```

The script uses `--user-data-dir=$XDG_RUNTIME_DIR/...` on
the host — tmpfs, wiped on logout. That suits short
interactive sessions; for long-running flows that need
persistent cookies, point `--user-data-dir` somewhere
durable.

**Known race:** VS Code Remote's auto-forward can
bind the host port before chrome does, so chrome
falls back to IPv6 only. The script's `ssh -L`
tunnel targets IPv4, so traffic never reaches
chrome and the MCP hangs. This repo's
`.vscode/settings.json` sets
`remote.portsAttributes.9236.onAutoForward` to
`ignore` to prevent the forward. If it hasn't
taken effect, `curl http://127.0.0.1:9236/json/version`
in the container connects but returns zero bytes;
reload the VS Code window to clear it.

### Headless Chromium (Claude-only)

Use headless Chromium when no human interaction is
required — scripted clicks, screenshot capture, and
similar automation. A persistent `--user-data-dir` keeps
MCP session state between calls:

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

## Linting

`pnpm lint` runs `eslint . --fix` followed by `cspell`.
`pnpm lint:check` runs the non-fixing eslint plus `cspell`.
`run-s` is sequential, so cspell only executes after eslint
passes — a parse error will hide spelling issues until
eslint is clean.

The shared cspell config lives at `internal/build/cspell.json`:

- `language: "en-GB"` — British English only; US-only
  spellings will be flagged.
- `ignorePaths` covers `node_modules`, `pnpm-lock.yaml`,
  and Nuxt/Wrangler build outputs. Other directories are
  skipped via `.gitignore` (cspell respects it by default).
- `words` holds terms used across multiple files or in
  JSON files (which can't carry inline comments).

`.vscode/settings.json` imports the same config via
`cSpell.import`, so editor and CLI share one source of
truth.

### Adding new words

- **Used in multiple files, or embedded in JSON**: add to
  `words` in `internal/build/cspell.json`. Use lowercase —
  cspell accepts any case when the dictionary entry is
  lowercase; an uppercase entry forces exact-case matching.
- **Used in a single file that supports comments**:
  annotate the file directly rather than polluting the
  shared dictionary. Comment syntax varies by file type:
  - Markdown: `<!-- cspell:words foo bar -->`
  - JS/TS: `// cspell:words foo bar`
  - Hash-comment (shell, `_headers`, etc.):
    `# cspell:words foo bar`
- **Real British-English fix**: when a flagged term is
  actually a US spelling (e.g. `color` → `colour`), fix
  the source rather than add the word.

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
