function darkModeLivingArea() {
    const tabLinks = qs("#tabLinks");
    const tabLinkItems = tabLinks ? qsa("a", tabLinks) : [];
    const selectedTabLink = qs("#tabLinks a#sel");

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

    const gearInfo = qs("#gearInfo");
    if (!gearInfo) {
        return;
    }

    const panelStyle = (el) => css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
        border: "2px",
    });

    panelStyle(gearInfo);

    qsa("#gearInfo font").forEach((font) => css(font, { color: colors.almostWhite }));
    qsa("#gearInfo>div").forEach(panelStyle);
    qsa("#gearInfo table, #gearInfo tbody, #gearInfo tr, #gearInfo td").forEach((el) => css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
    }));
    panelStyle(qs(".more_info>div"));

    const newsHeader = findLivingAreaNewsHeader();
    if (newsHeader) {
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

        const newsPanel = newsHeader.nextElementSibling;
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
}