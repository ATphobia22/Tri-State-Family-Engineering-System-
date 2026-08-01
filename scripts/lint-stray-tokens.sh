#!/usr/bin/env bash
# Point Township Digital Twin — Lexical stray-token sanitation gate
# Fails on footnote-style markers like [2, 3] or [4,5] inside src TypeScript.
# Single-index access (arr[0]) is allowed; multi-number citation vectors are not.
set -euo pipefail

echo "=== Lexical Scan: stray bracketed footnote tokens ==="

# Multi-number citation pattern: [1, 2], [4,5], [7, 8, 9]
# Not preceded by an identifier character (avoids rare false positives).
PATTERN='(^|[^A-Za-z0-9_])\[([0-9]+)(,[[:space:]]*[0-9]+)+\]'

HITS=""
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  HITS=$(git grep -E -n "$PATTERN" -- 'src/**/*.ts' 'src/**/*.tsx' 2>/dev/null || true)
else
  # Fallback when not in a git worktree
  HITS=$(grep -R -E -n "$PATTERN" src --include='*.ts' --include='*.tsx' 2>/dev/null || true)
fi

if [ -n "$HITS" ]; then
  echo "::error::[LEXICAL_CORRUPTION_FAILURE] Stray multi-number bracket markers found in source:"
  echo "$HITS"
  echo "=========================================================="
  echo "ACTION: Move non-TS documentation blocks to docs/archived/"
  echo "        and keep src/** arrays free of citation-style [n, m] tokens."
  exit 1
fi

echo "Pass: no stray multi-number footnote tokens in src TypeScript."
