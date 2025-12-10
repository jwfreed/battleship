#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Installing web dependencies..."
(cd "$ROOT_DIR/web" && npm install)

echo "Installing mobile dependencies..."
(cd "$ROOT_DIR/BattleshipMobile" && npm install)

echo "Setup complete. To run locally:"
echo "  Web:    npm run dev --prefix web"
echo "  Mobile: npm run lint --prefix BattleshipMobile && npm run start --prefix BattleshipMobile"
