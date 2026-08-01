#!/usr/bin/env bash
# Check for duplicate tracks in playlist or public/audio folder
set -euo pipefail

MISSING=0

# 1) Check playlist duplication by id/src
if [ -f "src/lib/playlist.ts" ]; then
  ids=$(grep -oE "id: \"[^"]+\"" src/lib/playlist.ts | sed -E 's/id: "(.*)"/\1/')
  dup_id=$(echo "$ids" | sort | uniq -d || true)
  if [ -n "$dup_id" ]; then
    echo "ERROR: Duplicate playlist ids found:"; echo "$dup_id"; MISSING=1
  fi
  srcs=$(grep -oE "src: \"/audio/[^"]+\"" src/lib/playlist.ts | sed -E 's/src: "(.*)"/\1/')
  dup_src=$(echo "$srcs" | sort | uniq -d || true)
  if [ -n "$dup_src" ]; then
    echo "ERROR: Duplicate playlist src entries found:"; echo "$dup_src"; MISSING=1
  fi
else
  echo "src/lib/playlist.ts not found — skipping playlist duplicate check"
fi

# 2) Check public/audio files duplicate names (case-insensitive)
if [ -d "public/audio" ]; then
  files=$(ls public/audio | tr '[:upper:]' '[:lower:]')
  dup_files=$(echo "$files" | sort | uniq -d || true)
  if [ -n "$dup_files" ]; then
    echo "ERROR: Duplicate filenames in public/audio (case-insensitive):"; echo "$dup_files"; MISSING=1
  fi
else
  echo "public/audio not present — skip file duplicates check"
fi

exit $MISSING
