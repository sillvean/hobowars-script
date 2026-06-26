function styleLivingAreaShell({ contentAreaTable, contentAreaTopCell, tattoo }) {
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
}

function ensureLivingAreaReferLink({ accountLinksList, referredLink }) {
    if (!accountLinksList || !referredLink || accountLinksList.querySelector("a[href*='cmd=rfriend']")) {
        return;
    }

    const referItem = createEl("li", { className: "nofloat" });
    referItem.appendChild(createEl("a", { href: "game.php?sr=154&cmd=rfriend", textContent: "Refer" }));
    accountLinksList.insertBefore(referItem, referredLink);
}

function placeLivingAreaAccountLinks({ newsPanel, accountLinksList }) {
    if (newsPanel && accountLinksList) {
        newsPanel.insertAdjacentElement("afterend", accountLinksList);
    }
}

function applyLivingAreaLayout(context = getLivingAreaContext()) {
    if (!context.gearInfo) {
        return;
    }

    styleLivingAreaShell(context);
    ensureLivingAreaReferLink(context);
    placeLivingAreaAccountLinks(context);
}