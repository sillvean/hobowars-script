function refreshLivingAreaEnhancements() {
    if (darkMode) {
        darkModeLivingArea();
    }

    layoutLivingArea();
    cleanupLivingArea();
}

function bindLivingAreaTabRefresh() {
    const tabLinks = qs("#tabLinks");
    if (!tabLinks || tabLinks.dataset.hoboWarsRefreshAttached) {
        return;
    }

    const scheduleLivingAreaRefresh = createRafScheduler(refreshLivingAreaEnhancements);

    const observer = new MutationObserver(scheduleLivingAreaRefresh);

    observer.observe(tabLinks, { subtree: true, attributes: true, attributeFilter: ["id"] });
    tabLinks.dataset.hoboWarsRefreshAttached = "true";
}