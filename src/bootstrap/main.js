function applyTheme() {
    applyDarkMode();
}

function applyLayout() {
    relocateStats();
    relocateResources();
    relocateTopbarMenu();
    hideClutter();
    layoutLivingArea();
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
    cleanupLivingArea();
    enhanceHitlistTable();
    hideShopItemsByName();
    solveRPSLS();
    enhanceRankingsTable();
    enhanceUniGrid();
}

function main() {
    applyTheme();
    applyLayout();
    runGlobalFeatures();
    runPageFeatures();
}

main();
