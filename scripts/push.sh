#!/usr/bin/env bash
# Lint gate + commit + push: `npm run push -- -m "message"` (or `plz push -m "message"`).
# Commits only what is already staged, and never force-pushes.
set -euo pipefail

fail() {
  printf '\npush: %s\n' "$1" >&2
  exit 1
}

message=""
while [ $# -gt 0 ]; do
  case "$1" in
    -m | --message)
      [ $# -ge 2 ] || fail 'missing commit message. Usage: push -m "<commit message>"'
      message="$2"
      shift 2
      ;;
    *) fail "unknown argument: $1" ;;
  esac
done

[ -n "$message" ] || fail 'missing commit message. Usage: push -m "<commit message>"'

git diff --cached --quiet && fail 'nothing staged. Run `git add <files>` first.'

echo 'Running checks (lint, prettier, tsc)...'
npm run check || fail 'checks failed, nothing was committed or pushed.'

git commit -m "$message" || fail 'git commit failed.'
git push || fail 'git push failed. The commit was kept locally.'
