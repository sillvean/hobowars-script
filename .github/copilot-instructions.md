# Project Guidelines

## Architecture
This project is a split-source Tampermonkey userscript.
Source files under `src/` are concatenated in a fixed order by `build-userscript.ps1` into a distributable artifact under `artifacts/`.
The script is not an ES module project. Preserve top-level globals, side effects, and file ordering unless the task explicitly changes the architecture.
Use `src/seed/tampermonkey-script-seed.js` as the historical monolith reference when tracing behavior during refactors.

## Code Style
Keep changes small, mechanical, and behavior-preserving when splitting or relocating code.
Follow the existing plain JavaScript style in the repo. Prefer simple functions, direct DOM manipulation, and existing helper utilities over introducing new abstractions.
Default to ASCII when editing files.

## Build And Validation
After source changes, run `./build-userscript.ps1` from the repo root.
Do not hand-edit generated files under `artifacts/`; treat them as build outputs only.
If a refactor changes file boundaries or build order, verify the newest artifact against the previous one to confirm the change is structural and not a behavior regression.
If the assembled content hash matches the latest artifact, the build script intentionally skips creating a new artifact.

## Conventions
Keep `build-userscript.ps1` in sync with the actual `src/` file layout whenever files are added, removed, renamed, or split.
Preserve the metadata header first, shared config and utilities before dependent code, and `src/bootstrap/main.js` last.
Prefer extending the existing concern-based folders (`meta`, `config`, `core`, `theme`, `layout`, `features`, `bootstrap`) instead of creating ad hoc structure.
When refactoring, prefer safe extraction by concern rather than rewriting behavior.
Assume the generated userscript must remain easy to import into Tampermonkey as a single file.