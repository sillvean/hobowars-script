# Refactor Plan: Real Separation Of Concerns

This plan assumes file moves are allowed and that the generated artifact order may change. The goal is to make each file own one clear responsibility and reduce cross-cutting behavior hidden inside theme or layout passes.

## Objectives

1. Split page-specific behavior from generic theme and layout code.
2. Move feature data next to the feature that owns it.
3. Centralize navigation taxonomy instead of scattering labels and groups across layout files.
4. Make bootstrap order explicit by concern rather than by historical concatenation shape.
5. Remove files that only exist to print section comments into the build output.

## Current Refactor Targets

### 1. Decompose Living Area handling

Problem:
`src/theme/dark-mode-living-area.js` currently does all of the following:

- tab recoloring
- tab mutation observation
- panel recoloring
- panel and content-area border/layout adjustments
- account link insertion
- promo/news cleanup
- mail and arena line suppression
- stat line hiding

Plan:

1. Keep pure recoloring in a theme file such as `src/theme/living-area-theme.js`.
2. Move DOM moves, insertions, and panel reshaping into a layout file such as `src/layout/living-area-layout.js`.
3. Move content cleanup and line suppression into a feature file such as `src/features/living-area-cleanup.js`.
4. Move the tab observer into a small Living Area controller file such as `src/features/living-area-tabs.js` or a shared observer utility if more pages need the same pattern.

Expected result:
The Living Area will stop being treated as a theme-only concern and become an explicit page feature with theme and layout subparts.

### 2. Separate swimming domain logic from topbar composition

Problem:
`src/features/swimming.js` is a clean domain module, but `src/layout/topbar-layout.js` owns the clock injection, live update timer, and reminder presentation.

Plan:

1. Keep date/window calculation and formatting in `src/features/swimming.js` or rename it to emphasize that it is the swimming schedule domain module.
2. Extract topbar clock decoration into a feature-oriented presenter such as `src/features/swimming-topbar.js`.
3. Leave `src/layout/topbar-layout.js` responsible only for moving and sizing topbar elements.

Expected result:
Topbar layout no longer depends on feature-specific behavior to be considered complete.

### 3. Move feature-owned data out of global flags

Problem:
`src/config/flags.js` mixes toggles and thresholds with `hiddenShopItemNames`.

Plan:

1. Keep booleans and global numeric thresholds in `src/config/flags.js`.
2. Move shop blacklist data into `src/features/shop.js` if it remains local to one function, or into a neighboring data file such as `src/features/shop-data.js` if the list should stay separate from behavior.

Expected result:
Global config becomes actual global config, and shop filtering owns its own dataset.

### 4. Introduce a navigation-specific configuration boundary

Problem:
Navigation taxonomy is split between `src/config/navigation-data.js` and `src/layout/right-panel.js`, while layout code also performs icon replacement and grouping logic.

Plan:

1. Expand `src/config/navigation-data.js` into the single source of truth for:
   - topbar icon mappings
   - sidebar group definitions
   - right-panel area and info lists
   - optional hard-coded shortcut definitions
2. Keep `src/config/icons.js` as glyph data only.
3. Keep `src/layout/navigation.js` and `src/layout/right-panel.js` focused on rendering from config rather than defining taxonomy.

Expected result:
Navigation structure becomes declarative and easier to change without touching DOM manipulation code.

### 5. Clarify page context ownership

Problem:
`src/core/page-context.js` only exports `pageTitle`, which is valid but too narrow to justify a dedicated boundary on its own.

Plan:

1. Either grow `src/core/page-context.js` into a fuller page helper module with common page predicates and selectors, or
2. Merge it into a broader DOM/context utility file if it stays minimal.

Expected result:
The core layer has a clearer purpose than a single selector constant.

### 6. Remove build-only section header files

Problem:
The `section-header.js` files under `core`, `theme`, `layout`, `features`, and `bootstrap` have no runtime concern.

Plan:

1. Remove comment-only section header source files.
2. If grouped comments are still desired in artifacts, generate them in `build-userscript.ps1` instead of keeping empty runtime files.
3. Update build ordering accordingly.

Expected result:
The source tree represents behavior and data only, not output-format scaffolding.

### 7. Rebalance bootstrap orchestration

Problem:
`src/bootstrap/main.js` currently calls `enhanceCommonLayout()`, which itself runs both layout and feature behavior.

Plan:

1. Replace `enhanceCommonLayout()` with explicit bootstrap stages, for example:
   - `applyTheme()`
   - `applyLayout()`
   - `runGlobalFeatures()`
   - `runPageFeatures()`
2. Make feature activation order intentional and documented.
3. Keep bootstrap as orchestration only; no page logic should live there.

Expected result:
Startup order becomes readable and concern boundaries become visible from the entry point.

## Proposed Target Structure

This is one workable destination, not the only valid one.

```text
src/
  meta/
    header.js
  config/
    colors.js
    flags.js
    icons.js
    navigation-data.js
  core/
    page-context.js
    utilities.js
  theme/
    apply-dark-mode.js
    dark-mode-buttons.js
    dark-mode-shop.js
    living-area-theme.js
    nav-links.js
  layout/
    navigation.js
    right-panel.js
    topbar-layout.js
    topbar-resize.js
    topbar-settings.js
    living-area-layout.js
  features/
    hitlist.js
    living-area-cleanup.js
    living-area-tabs.js
    maps.js
    rankings.js
    rpsls.js
    shop.js
    shop-data.js
    swimming.js
    swimming-topbar.js
    uni-grid.js
  bootstrap/
    main.js
```

## Execution Sequence

Suggested implementation order for the refactor itself:

1. Move shop blacklist data out of `src/config/flags.js`.
2. Consolidate navigation taxonomy into `src/config/navigation-data.js`.
3. Extract swimming topbar presentation from `src/layout/topbar-layout.js`.
4. Split `src/theme/dark-mode-living-area.js` into theme, layout, and feature slices.
5. Simplify `src/bootstrap/main.js` so it orchestrates those slices explicitly.
6. Remove `section-header.js` files and update `build-userscript.ps1`.
7. Rebuild and verify the resulting userscript behavior page by page.

## Verification Strategy

After each refactor step:

1. Run `./build-userscript.ps1`.
2. Sanity-check the main page shell: top bar, left nav, right panel, and dark mode.
3. Sanity-check page-specific features: Living Area, maps, rankings, university grid, shop, and any page using swimming reminder output.
4. Compare the produced artifact behavior, not just file diffs, because the output order is allowed to change in this refactor.

## Non-Goals

This plan does not require:

1. converting the project to ES modules
2. replacing globals with a framework
3. redesigning feature behavior
4. preserving the current concatenation order

The goal is separation of concerns, not an architectural rewrite.