## Pull Request: Fix: repository sanitation + runtime hardening

This PR contains automated changes to sanitize corrupted source files, add runtime hardening, and prepare the codebase for safer CI validation.

Summary of changes performed in this branch:

- chore: sanitize src/data.ts — removed multi-language embedded artifacts and stray citation markers so the file is valid TypeScript and importable by the app.
- docs: add DATA_TS_SANITIZE_NOTE.md — documents the sanitization and CI lint that will detect re-introduced stray tokens.
- chore: add branch artifacts for fix/cleanup-errors — includes a deprecation check script for WebAudio createScriptProcessor and a simple PR verification workflow.

Planned follow-up hardening (not yet applied):
- Migrate or detect ScriptProcessor usages and provide an AudioWorklet fallback.
- Add defensive checks for external API responses in geospatial services and parsers.
- Increase external API timeouts from 2s to 8-10s where appropriate.
- Harden LaTeX/template generation code with guards to prevent undefined variable interpolation.
- Improve TelemetryHUD parsing resilience for /metrics.
- Pin critical GitHub Actions to stable versions and streamline soft-fail semantics in CI.

Security/Safety note:
- The repo includes biomedical examples and system-control scripts. Per your instruction, I preserved these artifacts but moved corrupted inline tokens out of src files. If you prefer they be redacted or archived behind protected docs, I can perform that in a follow-up commit.

How to review:
- View the branch: https://github.com/ATphobia22/Tri-State-Family-Engineering-System-/tree/fix/cleanup-errors
- Key file updated: https://github.com/ATphobia22/Tri-State-Family-Engineering-System-/blob/fix/cleanup-errors/src/data.ts
- Sanitize note: https://github.com/ATphobia22/Tri-State-Family-Engineering-System-/blob/fix/cleanup-errors/docs/archived/DATA_TS_SANITIZE_NOTE.md

Requesting review from repository maintainers.
