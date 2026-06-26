# HoboWars Tampermonkey Refactor Plan

## Goal

Split the monolithic userscript into smaller source files organized by concern, while preserving a simple Tampermonkey install story.

The current script already has useful internal boundaries:

- shared config, constants, and descriptors near the top of [tampermonkey-script.js](tampermonkey-script.js)
- utilities in [tampermonkey-script.js](tampermonkey-script.js#L485)
- theme and dark mode in [tampermonkey-script.js](tampermonkey-script.js#L535)
- layout and navigation restructuring in [tampermonkey-script.js](tampermonkey-script.js#L808)
- gameplay/page-specific features in [tampermonkey-script.js](tampermonkey-script.js#L1294)
- bootstrap flow in [tampermonkey-script.js](tampermonkey-script.js#L1671)

## Tampermonkey Research Summary

Relevant Tampermonkey behavior from the official documentation and FAQ:

1. `@require` is the documented way to load additional JavaScript files into a userscript.
2. Files listed with `@require` are loaded and executed before the userscript body runs.
3. Multiple `@require` tags are allowed, which means load order can be controlled explicitly by tag order.
4. Tampermonkey's FAQ documents a local-development workflow where the installed script keeps only the metadata header and uses `@require file://...` to point at a local file.
5. Local `file://` loading requires browser extension permission for file URLs, and Tampermonkey notes that Chrome/Edge may also need site access set broadly enough for it to work.

### Practical implication

Tampermonkey can work with multiple files, but it does so through ordered file inclusion rather than a native project/module system.

That gives us two realistic options:

1. Keep one installed/generated userscript file and build it from smaller source files.
2. Keep a tiny loader script in Tampermonkey that `@require`s one or more local files during development.

## Recommended Approach

Use smaller source files in the repo, but keep `tampermonkey-script.js` as the generated install artifact.

Why this is the safest fit here:

- the repo currently has no build tooling, so the solution should stay lightweight
- Tampermonkey installation stays simple: one file to import/update
- shared globals and execution order remain easy to reason about
- local `file://` loading can still be supported as an optional development mode, not a requirement

### Development model

- `src/` becomes the source of truth
- `tampermonkey-script.js` remains the assembled output
- a tiny build step concatenates files in dependency order
- optional: a Tampermonkey dev wrapper can `@require` the built local file for quicker iteration

## Proposed File Layout

```text
src/
  meta/
    header.js
  config/
    flags.js
    constants.js
    icons.js
    descriptors.js
  core/
    dom.js
    page-context.js
  theme/
    dark-mode.js
  layout/
    stats.js
    resources.js
    clock.js
    topbar.js
    navigation.js
    right-panel.js
    common-layout.js
  features/
    maps.js
    hitlist.js
    rankings.js
    shop.js
    rpsls.js
    uni-grid.js
    swimming.js
  bootstrap/
    main.js
build-userscript.ps1
```

### Notes on the proposed split

- `meta/header.js`: only the UserScript metadata block
- `config/flags.js`: feature toggles and thresholds
- `config/constants.js`: colors, selectors, small static constants
- `config/icons.js`: SVG/icon literals and icon mapping
- `config/descriptors.js`: sidebar/right-panel descriptor arrays and other menu grouping data
- `core/dom.js`: `qs`, `qsa`, `css`, `createEl`, `onHover`, and other shared helpers
- `core/page-context.js`: derived page state like `pageTitle`
- `theme/dark-mode.js`: all dark-mode recolor functions and related helper styling
- `layout/*`: DOM relocation, nav restyling, topbar resizing, panel construction
- `features/*`: page-specific enhancements and puzzle/game helpers
- `bootstrap/main.js`: orchestration only

## Extraction Strategy

Refactor in small passes so the generated script can stay runnable after each pass.

### Phase 1: Establish the scaffold

1. Create the `src/` directory tree.
2. Move only the metadata block into `src/meta/header.js`.
3. Add a minimal build script that concatenates source files in a fixed order into `tampermonkey-script.js`.
4. Verify that the generated output is byte-for-byte or behaviorally equivalent before any logic moves.

### Phase 2: Extract low-risk shared code

1. Move feature flags, thresholds, constants, icons, and descriptor arrays into `config/`.
2. Move DOM/style helpers into `core/dom.js`.
3. Move derived page context into `core/page-context.js`.
4. Rebuild and verify that nothing changes functionally.

### Phase 3: Extract theme and layout concerns

1. Move dark-mode helpers and recolor passes into `theme/dark-mode.js`.
2. Split layout functions into small files based on surface area:
   - stats/resources
   - clock/swimming display hooks
   - topbar/settings
   - navigation/sidebar
   - right panel/common layout
3. Keep call order unchanged while moving code.

### Phase 4: Extract independent feature modules

1. Move map enhancement into `features/maps.js`.
2. Move hitlist filtering into `features/hitlist.js`.
3. Move rankings filtering into `features/rankings.js`.
4. Move shop filtering into `features/shop.js`.
5. Move RPSLS solver into `features/rpsls.js`.
6. Move university grid logic into `features/uni-grid.js`.
7. Move swimming schedule calculations into `features/swimming.js` if they are kept separate from layout clock rendering.

### Phase 5: Simplify bootstrap

1. Reduce `bootstrap/main.js` to imports-by-order and orchestration.
2. Keep the current runtime flow:
   - apply theme
   - enhance common layout
   - run page-specific enhancers
3. Make startup order explicit and easy to audit.

## Build Strategy Recommendation

Because this repo is currently very small, start with a simple concatenation build instead of introducing a full bundler.

Recommended first version:

- `build-userscript.ps1` reads files in a declared order
- it inserts separating newlines between files
- it writes the assembled output to `tampermonkey-script.js`

Possible later upgrade:

- switch to a Node-based build script if the repo grows or needs linting/tests/formatting automation

## Dependency and Ordering Rules

To keep the split stable, the implementation should follow these rules:

1. Metadata header must remain first.
2. Config/constants must load before helpers that consume them.
3. Shared helpers must load before theme/layout/features.
4. Theme/layout/features must load before bootstrap.
5. Bootstrap should be the only place that calls `main()`.
6. Avoid introducing circular dependencies; if two files need each other, move the shared piece into `config/` or `core/`.

## Optional Tampermonkey Development Workflow

For faster iteration, we can optionally keep a second tiny userscript in Tampermonkey like this:

```javascript
// ==UserScript==
// @name         HoboWars Enhancements (Dev)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @match        https://www.hobowars.com/game/*
// @grant        none
// @require      file:///ABSOLUTE/PATH/TO/hobowars-script/tampermonkey-script.js
// ==/UserScript==
```

Notes:

- this depends on Tampermonkey having access to local file URLs
- it is useful for local iteration, but should not replace the generated distributable file in the repo

## Verification Checklist

After each extraction step, verify:

1. script still installs/updates cleanly in Tampermonkey
2. dark mode still renders correctly
3. topbar/stat/resource relocation still works
4. navigation and right-panel layout still build correctly
5. map cleanup still runs on map pages
6. hitlist filtering still obeys the threshold flag
7. rankings filtering still obeys the level threshold
8. shop item hiding still filters only the intended rows
9. RPSLS and university grid helpers still solve correctly
10. bootstrap runs once and in the same order as before

## Risks To Watch

- hidden coupling through top-level variables shared across distant sections
- functions that rely on side effects from earlier code blocks
- page-specific selectors reused in common layout code
- accidental duplicate `main()` execution during the transition
- local `file://` development behaving differently across browser settings

## Definition of Done

This refactor is complete when:

- source logic lives in concern-based files under `src/`
- `tampermonkey-script.js` is generated from those source files
- the generated userscript preserves current behavior
- file ordering is explicit and documented
- local development and install/update workflow are both straightforward

## Recommended Next Step

Implement Phase 1 only first: add the source tree and a tiny build script, then generate the current script unchanged from ordered source files. That creates a stable base before any deeper code movement.
