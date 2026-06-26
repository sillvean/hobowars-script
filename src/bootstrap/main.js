/* =============================================================================
 * BOOTSTRAP
 * ========================================================================== */

function enhanceCommonLayout() {
    relocateStats();
    relocateResources();
    relocateTopbarMenu();
    hideClutter();
    buildRightPanel();
    resizeTopbar();
    buildTopbarSettings();
    styleNavigationMenus();
    enhanceHitlistTable();
    hideShopItemsByName();
    applyMapFix();
    solveRPSLS();
}

function main() {
    applyDarkMode();
    enhanceCommonLayout();
    enhanceRankingsTable();
    enhanceUniGrid();
}

main();
