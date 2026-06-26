function applyTheme() {
    applyDarkMode();
}

function applyLayout() {
    relocateStats();
    relocateResources();
    relocateTopbarMenu();
    hideClutter();
    buildRightPanel();
    resizeTopbar();
    buildTopbarSettings();
    styleNavigationMenus();
}

function runGlobalFeatures() {
    enhanceSwimmingTopbar();
    bindLivingAreaTabRefresh();
    applyMapFix();
}

function runPageFeatures() {
    enhanceHitlistTable();
    hideShopItemsByName();
    solveRPSLS();
    enhanceRankingsTable();
    enhanceUniGrid();
}

function main() {
    applyTheme();
    applyLayout();
    // Living Area work is order-sensitive: theme tweaks, layout changes, and
    // cleanup all touch the same subtree and should refresh through one path.
    refreshLivingAreaEnhancements();
    runGlobalFeatures();
    runPageFeatures();
}

main();
