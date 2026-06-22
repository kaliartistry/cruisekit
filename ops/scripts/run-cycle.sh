#!/usr/bin/env sh
set -eu

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

case "$REPO" in
  *OneDrive*|*Documents*|*Desktop*)
    echo "Refusing to run GrowthOps from unsafe path: $REPO" >&2
    exit 1
    ;;
esac

git fetch origin
BRANCH="$(git branch --show-current)"
if [ "$BRANCH" = "main" ]; then
  git pull --ff-only origin main
fi

node ops/scripts/preflight-audit.js --write-inventory
node ops/scripts/daily-report.js

echo "Preflight, inventory, and daily report complete. Let the Codex automation prompt select exactly one safe foundation task."
