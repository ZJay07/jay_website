#!/usr/bin/env bash
# Installs Linux dependencies when package-lock.json changed, then runs plz.
set -euo pipefail
cd /app

lock_hash="$(sha256sum package-lock.json | cut -d' ' -f1)"
if [ "$(cat node_modules/.lock-hash 2>/dev/null || true)" != "$lock_hash" ]; then
  echo "Installing dependencies (package-lock.json changed)..."
  npm ci --no-audit --no-fund
  echo "$lock_hash" > node_modules/.lock-hash
fi

exec bash ./pleasew "$@"
