function bindLivingAreaTabRefresh() {
    const tabLinks = qs("#tabLinks");
    if (!tabLinks || tabLinks.dataset.hoboWarsRefreshAttached) {
        return;
    }

    let refreshScheduled = false;
    const refreshLivingArea = () => {
        darkModeLivingArea();
        layoutLivingArea();
        cleanupLivingArea();
    };

    const observer = new MutationObserver(() => {
        if (refreshScheduled) {
            return;
        }

        refreshScheduled = true;
        window.requestAnimationFrame(() => {
            refreshScheduled = false;
            refreshLivingArea();
        });
    });

    observer.observe(tabLinks, { subtree: true, attributes: true, attributeFilter: ["id"] });
    tabLinks.dataset.hoboWarsRefreshAttached = "true";
}