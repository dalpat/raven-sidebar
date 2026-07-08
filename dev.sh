#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Raven Sidebar — Dev Testing Script
# ═══════════════════════════════════════════════════════════
# Run from a regular terminal (not IDE terminal).
#
# Usage:
#   ./dev.sh              (default 1920x1080)
#   ./dev.sh 1280x720     (custom resolution)
#
# SAFETY: this script deploys a *copy* of the source into the
# GNOME extensions dir — it NEVER symlinks the repo there.
# A symlink lets GNOME's "remove/uninstall extension" recurse
# straight into this repo and wipe .git (that's what kept
# nuking your git history). A copy is disposable; the repo is
# never reachable from the extensions folder.
# ═══════════════════════════════════════════════════════════

set -euo pipefail

EXT_UUID="raven-sidebar@dalpat.github.io"
# Derive the repo dir from this script's location — not hardcoded,
# so it works no matter what the folder is named.
EXT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.local/share/gnome-shell/extensions/$EXT_UUID"
RESOLUTION="${1:-1920x1080}"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   🐦 Raven Sidebar — Dev Launch      ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ── Guard: make sure git is healthy before we touch anything ──
if [ -d "$EXT_DIR/.git" ]; then
    if ! git -C "$EXT_DIR" rev-parse --verify HEAD >/dev/null 2>&1; then
        echo "⚠️  WARNING: git HEAD is unborn/broken in this repo."
        echo "    Your history may have been damaged. Fix git before deploying."
        exit 1
    fi
else
    echo "⚠️  WARNING: no .git directory found here — refusing to run."
    echo "    Something may have deleted it. Aborting to be safe."
    exit 1
fi

# ── Deploy: COPY only, never symlink ──
# If an old dangerous symlink exists, remove just the link (no
# trailing slash → does NOT follow into the repo).
if [ -L "$DEST" ]; then
    echo "🧹 Removing old (dangerous) symlink deploy..."
    rm "$DEST"
fi

echo "📦 Deploying a fresh copy → $DEST"
mkdir -p "$DEST"
if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
        --exclude='.git' \
        --exclude='.github' \
        --exclude='node_modules' \
        --exclude='docs' \
        --exclude='*.sh' \
        "$EXT_DIR"/ "$DEST"/
else
    # Fallback without rsync: wipe contents and copy (still excludes dotfiles via glob)
    rm -rf "${DEST:?}"/*
    cp -r "$EXT_DIR"/* "$DEST"/ 2>/dev/null || true
fi
echo "✅ Copy deployed (repo is NOT reachable from the extensions dir)."

# ── Stop GNOME from auto-updating the dev build ──
# This extension is published on extensions.gnome.org (EGO). GNOME's
# periodic update check compares the *installed* version against EGO's
# and, when EGO is newer, stages a download in extension-updates/ that
# gets installed on the NEXT LOGIN — silently clobbering this dev copy.
#
# Two-part fix:
#   1. Pin the DEPLOYED copy's version to a sentinel far above any EGO
#      release, so the update check never thinks a newer version exists.
#      (Only the deployed metadata.json is touched — the repo's stays at
#      its real version.)
#   2. Remove any update already staged for this UUID, so a previously
#      queued update doesn't install on the next login.
DEV_VERSION=999999
echo "📌 Pinning deployed version to $DEV_VERSION (blocks EGO auto-update)..."
if command -v jq >/dev/null 2>&1; then
    tmp="$(mktemp)"
    jq --argjson v "$DEV_VERSION" '.version = $v' "$DEST/metadata.json" > "$tmp" \
        && mv "$tmp" "$DEST/metadata.json"
else
    python3 - "$DEST/metadata.json" "$DEV_VERSION" <<'PY'
import json, sys
path, version = sys.argv[1], int(sys.argv[2])
with open(path) as f:
    data = json.load(f)
data["version"] = version
with open(path, "w") as f:
    json.dump(data, f, indent=2)
PY
fi

UPDATES_DIR="$HOME/.local/share/gnome-shell/extension-updates/$EXT_UUID"
if [ -d "$UPDATES_DIR" ]; then
    echo "🧹 Removing staged EGO update ($UPDATES_DIR)..."
    rm -rf "$UPDATES_DIR"
fi

# ── Compile schemas (in the deployed copy) ──
if [ -d "$DEST/schemas" ]; then
    echo "🔧 Compiling schemas..."
    glib-compile-schemas "$DEST/schemas/" 2>/dev/null || true
fi

echo ""
echo "🚀 Launching nested GNOME Shell ($RESOLUTION)..."
echo ""
echo "   Inside the nested window:"
echo "   → gnome-extensions enable $EXT_UUID"
echo ""
echo "   Close the window when done."
echo "   Edit code → run ./dev.sh again (it re-copies)."
echo ""
echo "📋 Logs:"
echo "─────────────────────────────────────────────────"

MUTTER_DEBUG_DUMMY_MODE_SPECS="$RESOLUTION" \
SHELL_DEBUG=backtrace-warnings \
  dbus-run-session -- gnome-shell --devkit

echo ""
echo "✅ Done. Edit code → run ./dev.sh again."
