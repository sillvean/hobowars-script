function styleLivingAreaTabs({ tabLinkItems, selectedTabLink }) {
    tabLinkItems.forEach((tab) => css(tab, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
    }));

    if (selectedTabLink) {
        css(selectedTabLink, {
            "background-color": `${colors.darkGray} !important`,
            color: `${colors.orange} !important`,
        });
    }
}

function styleLivingAreaPanelBlock(el) {
    return css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
        border: "2px",
    });
}

function styleLivingAreaPanels({ gearInfo }) {
    if (!gearInfo) {
        return;
    }

    styleLivingAreaPanelBlock(gearInfo);

    qsa("font", gearInfo).forEach((font) => css(font, { color: colors.almostWhite }));
    qsa(":scope > div", gearInfo).forEach(styleLivingAreaPanelBlock);
    qsa("table, tbody, tr, td", gearInfo).forEach((el) => css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
    }));
    styleLivingAreaPanelBlock(qs(".more_info>div"));
}

function styleLivingAreaNews({ newsHeader, newsPanel }) {
    if (!newsHeader) {
        return;
    }

    css(newsHeader, {
        "background-color": `${colors.darkGray} !important`,
        color: `${colors.almostWhite} !important`,
        border: `1px solid ${colors.orange} !important`,
        "border-bottom": `1px solid ${colors.orange} !important`,
    });
    qsa("a", newsHeader).forEach((link) => css(link, { color: `${colors.orange} !important` }));

    const rssIcon = qs("#rss img", newsHeader);
    if (rssIcon) {
        css(rssIcon, { display: "none" });
    }

    if (newsPanel) {
        css(newsPanel, {
            border: "0 !important",
            outline: `1px solid ${colors.orange} !important`,
            "outline-offset": "-1px !important",
            "margin-top": "-1px !important",
            "margin-bottom": "10px !important",
        });
    }
}

function applyLivingAreaTheme(context = getLivingAreaContext()) {
    styleLivingAreaTabs(context);

    if (!context.gearInfo) {
        return;
    }

    styleLivingAreaPanels(context);
    styleLivingAreaNews(context);
}