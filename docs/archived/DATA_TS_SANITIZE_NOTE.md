# Archived / sanitized content notes

## src/data.ts

`CORE_CODE_FILES` is a **registry** of sample assets. Full multi-language bodies
live under `docs/archived/*.txt` and are referenced via `archivePath`.

Citation-style markers such as `[4, 5]` / `[7-9]` were removed from any
inlined strings so the TypeScript AST stays clean.

## CI gate

`scripts/lint-stray-tokens.sh` fails the build if multi-number footnote tokens
reappear under `src/**/*.ts(x)`. Wired in `.github/workflows/build.yml`.

## Extraction helper

`node scripts/archive-non-ts.js` scans recent git log bodies for fenced code
blocks and writes them under `docs/archived/`.
