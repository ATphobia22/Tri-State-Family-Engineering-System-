#!/usr/bin/env bash
# Lint script to find deprecated ScriptProcessor usage in repo
set -euo pipefail

FOUND=0

if grep -RIn "createScriptProcessor" src || true; then
  echo "WARNING: createScriptProcessor usage found. Consider migrating to AudioWorkletNode."
  FOUND=1
fi

exit $FOUND
