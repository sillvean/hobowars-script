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
    bindLivingAreaRefresh();
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
    // Living Area work is order-sensitive, so one owner module refreshes
    // theme, layout, and cleanup from a shared DOM context.
    refreshLivingArea();
    runGlobalFeatures();
    runPageFeatures();
}

main();
