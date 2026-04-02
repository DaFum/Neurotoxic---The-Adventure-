#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi

# Install dependencies
cd "${CLAUDE_PROJECT_DIR}"
pnpm install
