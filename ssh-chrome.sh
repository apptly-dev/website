#!/bin/sh
#
# ssh-chrome.sh — pair-driving Chrome for chrome-devtools-mcp.
#
# Opens a visible browser on the remote host's display and
# tunnels its DevTools endpoint back through SSH. The human
# drives the browser; Claude observes via chrome-devtools-mcp
# connected at http://127.0.0.1:$PORT.
#
# Usage:   ./ssh-chrome.sh [PORT] [HOST] [BROWSER]
# Stop:    Ctrl-C in this terminal.
#
# Defaults:
#   PORT     9236
#   HOST     172.17.0.1  (Docker bridge gateway)
#   BROWSER  google-chrome
#
# Requires SSH access to $HOST with $BROWSER installed and a
# usable DISPLAY=:0. See AGENTS.md for host-side prerequisites
# and the VS Code auto-forward note.

set -eu

PORT=${1:-9236}
HOST=${2:-172.17.0.1}
BROWSER=${3:-google-chrome}

exec ssh -tt -L "$PORT:127.0.0.1:$PORT" "$HOST" \
  "exec env DISPLAY=:0 '$BROWSER' \
    --remote-debugging-port=$PORT \
    --user-data-dir=\$XDG_RUNTIME_DIR/chrome-debug-$PORT \
    --no-first-run \
    --no-default-browser-check"
