# Source Module Index

This file is the project-structure overview for the split-source userscript.
Use it as an index of the modules under `src/` and their current responsibility.

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
17. `src/layout/living-area-layout.js`
18. `src/layout/topbar-layout.js`
19. `src/layout/navigation.js`
20. `src/layout/right-panel.js`
21. `src/layout/topbar-settings.js`
22. `src/layout/topbar-resize.js`
23. `src/features/section-header.js`
24. `src/features/living-area-cleanup.js`
25. `src/features/living-area-tabs.js`
26. `src/features/maps.js`
27. `src/features/hitlist.js`
28. `src/features/rpsls.js`
29. `src/features/uni-grid.js`
30. `src/features/rankings.js`
31. `src/features/shop.js`
32. `src/features/swimming-topbar.js`
33. `src/bootstrap/section-header.js`
34. `src/bootstrap/main.js`

## Meta

### `src/meta/header.js`

- Current responsibility: Tampermonkey metadata header.

## Config

### `src/config/flags.js`

- Current responsibility: Global feature toggles and numeric thresholds.

### `src/config/colors.js`

- Current responsibility: Shared color palette constants.

### `src/config/icons.js`

- Current responsibility: Shared SVG icon markup.

### `src/config/navigation-data.js`

- Current responsibility: Navigation taxonomy, icon mappings, sidebar group definitions, right-panel sections, and right-panel shortcuts.

## Core

### `src/core/page-context.js`

- Current responsibility: Shared page-context selectors and page-specific DOM-derived values.

### `src/core/section-header.js`

- Current responsibility: Comment-only section banner emitted into the built artifact ahead of core utilities.

### `src/core/utilities.js`

- Current responsibility: Shared DOM query, style, element creation, hover, and text-matching helpers.

## Theme

### `src/theme/section-header.js`

- Current responsibility: Comment-only section banner emitted into the built artifact ahead of theme modules.

### `src/theme/nav-links.js`

- Current responsibility: Shared navigation color treatment, badge styling, and hover-state theming.

### `src/theme/dark-mode-buttons.js`

- Current responsibility: Dark-mode recoloring for generic button links.

### `src/theme/dark-mode-living-area.js`

- Current responsibility: Dark-mode recoloring for Living Area tabs, panels, tables, and news header elements.

### `src/theme/dark-mode-shop.js`

- Current responsibility: Dark-mode recoloring for shop fonts and shop cost text.

### `src/theme/apply-dark-mode.js`

- Current responsibility: Dark-mode gate and theme-pass orchestrator.

## Layout

### `src/layout/section-header.js`

- Current responsibility: Comment-only section banner emitted into the built artifact ahead of layout modules.

### `src/layout/living-area-layout.js`

- Current responsibility: Living Area structural layout adjustments, account-link insertion, and news-panel placement.

### `src/layout/topbar-layout.js`

- Current responsibility: Topbar stat, resource, and clock relocation; stat-bar restyling; and general page-chrome hiding.

### `src/layout/navigation.js`

- Current responsibility: Topbar and sidebar navigation rendering, icon insertion, link regrouping, and navigation link styling.

### `src/layout/right-panel.js`

- Current responsibility: Right-panel construction and migration of configured sidebar links and shortcuts into that panel.

### `src/layout/topbar-settings.js`

- Current responsibility: Topbar settings/help/logout button construction.

### `src/layout/topbar-resize.js`

- Current responsibility: Fixed-header resizing, currency-row repositioning, backpack shortcut insertion, and container offset adjustment.

## Features

### `src/features/section-header.js`

- Current responsibility: Comment-only section banner emitted into the built artifact ahead of feature modules.

### `src/features/swimming.js`

- Current responsibility: Swimming schedule calculation, game-clock parsing, and swimming reminder text formatting.

### `src/features/living-area-cleanup.js`

- Current responsibility: Living Area content suppression, stat-line hiding, promo removal, and related cleanup.

### `src/features/living-area-tabs.js`

- Current responsibility: Living Area tab mutation observation and reapplication of Living Area theme, layout, and cleanup passes.

### `src/features/maps.js`

- Current responsibility: Map tile background restoration, map-specific CSS injection, and map mutation observation.

### `src/features/hitlist.js`

- Current responsibility: Hitlist row rewriting and low-value target filtering.

### `src/features/rpsls.js`

- Current responsibility: RPSLS encounter detection and winning-choice highlighting.

### `src/features/uni-grid.js`

- Current responsibility: University grid parsing, brute-force solution search, and recommended-control highlighting.

### `src/features/rankings.js`

- Current responsibility: Rankings-page offset adjustment and low-level player filtering.

### `src/features/shop.js`

- Current responsibility: Shop row filtering using the shop-owned hidden item name list.

### `src/features/swimming-topbar.js`

- Current responsibility: Swimming reminder injection and live topbar clock updates.

## Bootstrap

### `src/bootstrap/section-header.js`

- Current responsibility: Comment-only section banner emitted into the built artifact ahead of bootstrap modules.

### `src/bootstrap/main.js`

- Current responsibility: Top-level orchestration of theme passes, layout passes, global features, page features, and startup execution.

## Reference

### `src/seed/tampermonkey-script-seed.js`

- Current responsibility: Historical monolith reference for tracing legacy behavior and refactor provenance.