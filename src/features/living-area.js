function refreshLivingArea() {
    const context = getLivingAreaContext();

    if (darkMode) {
        applyLivingAreaTheme(context);
    }

    applyLivingAreaLayout(context);
    applyLivingAreaCleanup(context);
}

function bindLivingAreaRefresh() {
    const tabLinks = qs("#tabLinks");
    if (!tabLinks || tabLinks.dataset.hoboWarsRefreshAttached) {
        return;
    }

    const scheduleLivingAreaRefresh = createRafScheduler(refreshLivingArea);
    const observer = new MutationObserver(scheduleLivingAreaRefresh);

    observer.observe(tabLinks, { subtree: true, attributes: true, attributeFilter: ["id"] });
    tabLinks.dataset.hoboWarsRefreshAttached = "true";
}