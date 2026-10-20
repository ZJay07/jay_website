#!/usr/bin/env bash
# `plz check` / `plz lint` only check (CI uses `plz check`); `plz lint --fix` edits files.
set -euo pipefail

case "${1:-}" in
  --fix) exec npm run fix ;;
  --check | "") exec npm run check ;;
  *) echo "lint: unknown argument: $1" >&2; exit 1 ;;
esac
