function layoutLivingArea() {
    const gearInfo = qs("#gearInfo");
    if (!gearInfo) {
        return;
    }

    const contentAreaTable = qs(".content-area > table");
    const contentAreaTopCell = qs(".content-area > table td[valign='top']");
    const tattoo = qs("#tattooImg");
    const accountLinksList = qs("ul.more_info.nofloat.statsDisplay");
    const referredLink = accountLinksList?.querySelector("a[href*='cmd=referred']")?.closest("li");
    const newsHeader = findLivingAreaNewsHeader();

    if (contentAreaTable) {
        css(contentAreaTable, {
            border: "0 !important",
            outline: `1px solid ${colors.orange} !important`,
            "outline-offset": "0 !important",
            "margin-bottom": "10px !important",
        });
    }

    if (contentAreaTopCell) {
        css(contentAreaTopCell, { "padding-right": "8px !important" });
    }

    if (tattoo) {
        css(tattoo, { right: "150px" });
    }

    if (accountLinksList && referredLink && !accountLinksList.querySelector("a[href*='cmd=rfriend']")) {
        const referItem = createEl("li", { className: "nofloat" });
        referItem.appendChild(createEl("a", { href: "game.php?sr=154&cmd=rfriend", textContent: "Refer" }));
        accountLinksList.insertBefore(referItem, referredLink);
    }

    const newsPanel = newsHeader?.nextElementSibling;
    if (newsPanel && accountLinksList) {
        newsPanel.insertAdjacentElement("afterend", accountLinksList);
    }
}