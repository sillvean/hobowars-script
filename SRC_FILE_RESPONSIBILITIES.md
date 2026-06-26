# Source File Responsibilities

This document records what each file under `src/` currently does, and whether that responsibility matches the file's folder and name.

Seed script note: `src/seed/tampermonkey-script-seed.js` is intentionally excluded from this review because it is the historical monolith reference rather than part of the split-source concern map.

## Build Order

The userscript is currently concatenated in this order by `build-userscript.ps1`:

1. `src/meta/header.js`
2. `src/config/flags.js`
3. `src/config/colors.js`
4. `src/features/swimming.js`
5. `src/config/icons.js`
6. `src/config/navigation-data.js`
7. `src/core/page-context.js`
8. `src/core/section-header.js`
9. `src/core/utilities.js`
10. `src/theme/section-header.js`
11. `src/theme/nav-links.js`
12. `src/theme/dark-mode-buttons.js`
13. `src/theme/dark-mode-living-area.js`
14. `src/theme/dark-mode-shop.js`
15. `src/theme/apply-dark-mode.js`
16. `src/layout/section-header.js`
17. `src/layout/topbar-layout.js`
18. `src/layout/navigation.js`
19. `src/layout/right-panel.js`
20. `src/layout/topbar-settings.js`
21. `src/layout/topbar-resize.js`
22. `src/features/section-header.js`
23. `src/features/maps.js`
24. `src/features/hitlist.js`
25. `src/features/rpsls.js`
26. `src/features/uni-grid.js`
27. `src/features/rankings.js`
28. `src/features/shop.js`
29. `src/bootstrap/section-header.js`
30. `src/bootstrap/main.js`

## Meta

### `src/meta/header.js`

- Current responsibility: Tampermonkey metadata header.
- Concern fit: Correct.
- Notes: Pure userscript metadata; no application behavior.

## Config

### `src/config/flags.js`

- Current responsibility: Feature toggles, numeric thresholds, and one shop-specific item blacklist.
- Concern fit: Partial.
- Notes: The flags and thresholds belong here, but `hiddenShopItemNames` is feature data for shop filtering rather than global config. It currently couples a page-specific dataset to the global flag file.

### `src/config/colors.js`

- Current responsibility: Shared color palette constants.
- Concern fit: Correct.
- Notes: Pure theme configuration.

### `src/config/icons.js`

- Current responsibility: Shared SVG icon strings.
- Concern fit: Correct.
- Notes: This file is a glyph library. It is cohesive as long as it only contains icon assets.

### `src/config/navigation-data.js`

- Current responsibility: Maps page labels to icons and defines sidebar grouping descriptor lists.
- Concern fit: Mostly correct.
- Notes: The file is configuration, but it is specifically navigation taxonomy rather than generic config. Its contents are tightly coupled to `layout/navigation.js` and `layout/right-panel.js`.

## Core

### `src/core/page-context.js`

- Current responsibility: Exposes `pageTitle` from the current document.
- Concern fit: Correct, but extremely narrow.
- Notes: This is technically page context, but only one selector constant. It may eventually want to grow into a fuller page-context helper or be merged into a broader DOM context module.

### `src/core/section-header.js`

- Current responsibility: Comment-only section banner for the concatenated artifact.
- Concern fit: Not really an application concern.
- Notes: This file exists only to emit a banner comment into the build output. It has no runtime responsibility.

### `src/core/utilities.js`

- Current responsibility: Shared DOM query, style, element creation, hover, and prefix-matching helpers.
- Concern fit: Correct.
- Notes: Cohesive utility layer used throughout the script.

## Theme

### `src/theme/section-header.js`

- Current responsibility: Comment-only section banner for the concatenated artifact.
- Concern fit: Not really an application concern.
- Notes: Same structural-only role as other `section-header.js` files.

### `src/theme/nav-links.js`

- Current responsibility: Shared color treatment and hover behavior for navigation links and badges.
- Concern fit: Correct.
- Notes: This is a theme helper even though it is used by layout code.

### `src/theme/dark-mode-buttons.js`

- Current responsibility: Recolors generic `.btn` anchors for dark mode.
- Concern fit: Correct.
- Notes: Pure styling pass.

### `src/theme/dark-mode-living-area.js`

- Current responsibility: Recolors the Living Area, but also hides lines, inserts links, moves elements, removes promos, suppresses forms, and attaches a mutation observer to handle tab swaps.
- Concern fit: Poor.
- Notes: This is the largest concern violation in the current tree. The file mixes at least four responsibilities: color styling, layout restructuring, content cleanup, and Living Area-specific behavior.

### `src/theme/dark-mode-shop.js`

- Current responsibility: Recolors shop fonts and costs on the Pawn Czar page.
- Concern fit: Correct.
- Notes: Narrow page-specific theme pass.

### `src/theme/apply-dark-mode.js`

- Current responsibility: Dark mode gate and orchestrator.
- Concern fit: Correct.
- Notes: Small coordinator for theme passes.

## Layout

### `src/layout/section-header.js`

- Current responsibility: Comment-only section banner for the concatenated artifact.
- Concern fit: Not really an application concern.
- Notes: Structural-only build artifact support.

### `src/layout/topbar-layout.js`

- Current responsibility: Moves topbar stats, resources, and clock; rebuilds stat bars; hides clutter; injects a live swimming reminder into the clock.
- Concern fit: Partial.
- Notes: Most of the file is layout work, but the swimming reminder is feature/domain behavior embedded inside a layout file. That logic depends on `features/swimming.js` and should eventually be separated from generic topbar composition.

### `src/layout/navigation.js`

- Current responsibility: Styles topbar and sidebar navigation, replaces labels with icons, groups links into labeled sections, and inserts icons into links.
- Concern fit: Mostly correct.
- Notes: This is layout-oriented navigation composition. It also consumes navigation taxonomy from config and theme hover helpers, which is acceptable, though the grouping descriptors are important enough to merit their own navigation-focused config boundary.

### `src/layout/right-panel.js`

- Current responsibility: Builds a fixed right panel, moves selected sidebar links into it, and adds a few hard-coded shortcut links.
- Concern fit: Mostly correct.
- Notes: This is a layout file, though it contains page-taxonomy data (`RIGHT_PANEL_AREAS`, `RIGHT_PANEL_INFO`) that could be externalized into navigation config.

### `src/layout/topbar-settings.js`

- Current responsibility: Adds icon-based settings/help/logout buttons to the top bar.
- Concern fit: Correct.
- Notes: Focused topbar composition.

### `src/layout/topbar-resize.js`

- Current responsibility: Repositions topbar and currency rows, adds a Backpack shortcut, and shifts the container to account for fixed headers.
- Concern fit: Correct.
- Notes: Pure layout adjustment.

## Features

### `src/features/section-header.js`

- Current responsibility: Comment-only section banner for the concatenated artifact.
- Concern fit: Not really an application concern.
- Notes: Structural-only build artifact support.

### `src/features/swimming.js`

- Current responsibility: Computes swimming windows from the in-game calendar and formats the next reminder text.
- Concern fit: Correct.
- Notes: This is a self-contained domain feature, even though it is consumed by topbar layout code.

### `src/features/maps.js`

- Current responsibility: Detects map tables, strips background images, restores tile colors, injects map-fix CSS, and keeps the map corrected via a mutation observer.
- Concern fit: Correct.
- Notes: Cohesive feature enhancement with its own observer lifecycle.

### `src/features/hitlist.js`

- Current responsibility: Rewrites hitlist row summaries and hides low-value targets.
- Concern fit: Correct.
- Notes: Focused page enhancement.

### `src/features/rpsls.js`

- Current responsibility: Detects the RPSLS encounter and highlights the winning action.
- Concern fit: Correct.
- Notes: Focused page enhancement.

### `src/features/uni-grid.js`

- Current responsibility: Reads the university grid, brute-forces row and column rotations, and highlights recommended controls.
- Concern fit: Correct.
- Notes: Self-contained solver feature.

### `src/features/rankings.js`

- Current responsibility: Adjusts ranking search offset and hides players below the configured level threshold.
- Concern fit: Correct.
- Notes: Focused page enhancement.

### `src/features/shop.js`

- Current responsibility: Hides rows that contain blacklisted shop item names.
- Concern fit: Correct, with misplaced data dependency.
- Notes: The behavior belongs here, but it currently depends on `hiddenShopItemNames` from `src/config/flags.js`.

## Bootstrap

### `src/bootstrap/section-header.js`

- Current responsibility: Comment-only section banner for the concatenated artifact.
- Concern fit: Not really an application concern.
- Notes: Structural-only build artifact support.

### `src/bootstrap/main.js`

- Current responsibility: Orchestrates theme, layout, and feature initialization and immediately runs `main()`.
- Concern fit: Correct.
- Notes: The bootstrap layer is the correct place for top-level execution order, but the called steps are currently grouped in a way that mixes layout and feature execution inside `enhanceCommonLayout()`.

## Summary Of Current Concern Issues

The main separation problems are:

1. `src/theme/dark-mode-living-area.js` mixes theme, layout, cleanup, and Living Area-specific behavior.
2. `src/layout/topbar-layout.js` contains true layout code plus swimming feature presentation and update scheduling.
3. `src/config/flags.js` carries shop-specific item data.
4. `src/layout/right-panel.js` and `src/layout/navigation.js` each own hard-coded navigation taxonomy that could be consolidated.
5. The `section-header.js` files are build-structure artifacts rather than runtime concern boundaries.