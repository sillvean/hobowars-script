function darkModeLivingArea() {
    const gearInfo = qs("#gearInfo");
    const contentAreaTable = qs(".content-area > table");
    const contentAreaTopCell = qs(".content-area > table td[valign='top']");
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

    // Re-apply styling when the active tab changes (content is swapped in place).
    if (tabLinks && !tabLinks.dataset.darkModeObserverAttached) {
        let refreshScheduled = false;
        const observer = new MutationObserver(() => {
            if (refreshScheduled) {
                return;
            }

            refreshScheduled = true;
            window.requestAnimationFrame(() => {
                refreshScheduled = false;
                darkModeLivingArea();
            });
        });

        observer.observe(tabLinks, { subtree: true, attributes: true, attributeFilter: ["id"] });
        tabLinks.dataset.darkModeObserverAttached = "true";
    }

    if (!gearInfo) {
        return;
    }

    const hideLineByLabel = (containerSelector, labelText) => {
        const line = qsa(`${containerSelector} .line`).find(
            (el) => el.querySelector("span")?.textContent?.trim() === labelText
        );
        if (line) {
            css(line, { display: "none" });
        }
    };

    const panelStyle = (el) => css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
        border: "2px",
    });

    panelStyle(gearInfo);

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

    qsa("#gearInfo font").forEach((font) => css(font, { color: colors.almostWhite }));
    qsa("#gearInfo>div").forEach(panelStyle);
    qsa("#gearInfo table, #gearInfo tbody, #gearInfo tr, #gearInfo td").forEach((el) => css(el, {
        "background-color": `${colors.midGray} !important`,
        color: `${colors.almostWhite} !important`,
    }));
    panelStyle(qs(".more_info>div"));

    const tattoo = qs("#tattooImg");
    if (tattoo) {
        css(tattoo, { right: "150px" });
    }

    const arenaLine = qs("#battleRecord input[name='playArena']")?.closest(".line");
    if (arenaLine) {
        css(arenaLine, { display: "none" });
    }

    const mailForm = qs("form[action*='cmd=mail'][action*='do=delsel']");
    if (mailForm) {
        if (mailForm.previousElementSibling) {
            css(mailForm.previousElementSibling, { display: "none" });
        }
        css(mailForm, { display: "none" });
    }

    const accountLinksList = qs("ul.more_info.nofloat.statsDisplay");
    const referredLink = accountLinksList?.querySelector("a[href*='cmd=referred']")?.closest("li");
    if (accountLinksList && referredLink && !accountLinksList.querySelector("a[href*='cmd=rfriend']")) {
        const referItem = createEl("li", { className: "nofloat" });
        referItem.appendChild(createEl("a", { href: "game.php?sr=154&cmd=rfriend", textContent: "Refer" }));
        accountLinksList.insertBefore(referItem, referredLink);
    }

    const newsHeader = qsa("div[style*='height:25px']").find((el) => el.textContent?.includes("News"));
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

            if (accountLinksList) {
                newsPanel.insertAdjacentElement("afterend", accountLinksList);
            }
        }
    }

    const invitePromoLink = qsa("a[href*='cmd=rfriend']").find((link) => link.textContent?.trim() === "Click Here");
    if (invitePromoLink) {
        let promoStart = invitePromoLink;
        while (promoStart.previousSibling) {
            promoStart = promoStart.previousSibling;
            if (
                promoStart.nodeType === Node.ELEMENT_NODE &&
                promoStart.matches("div[style*='margin-left:20px']") &&
                promoStart.querySelector("img")
            ) {
                break;
            }
        }

        if (newsHeader) {
            let sibling = promoStart;
            while (sibling && sibling !== newsHeader) {
                const next = sibling.nextSibling;
                sibling.remove?.();
                sibling = next;
            }
        }
    }

    qsa("ul.nofloat li.nofloat, ul.nofloat li").forEach((item) => {
        const text = item.textContent || "";

        if (text.includes("Chat!")) {
            const chatIcon = item.querySelector("img");
            if (chatIcon) {
                css(chatIcon, { display: "none" });
            }
        }

        if (text.includes("Account settings")) {
            css(item, { display: "none" });
        }
    });

    [
        ["#generalDisplay", "Name:"],
        ["#generalDisplay", "Gang:"],
        ["#generalDisplay", "Level:"],
        ["#generalDisplay", "Cans:"],
        ["#generalDisplay", "Tokens:"],
        ["#generalDisplay", "Meals Left:"],
        ["#generalDisplay", "Awake:"],
        ["#generalDisplay", "Alive:"],
        ["#generalDisplay", "Skills:"],
        ["#combatStats", "Speed*:"],
        ["#combatStats", "Damage*:"],
        ["#combatStats", "Defense*:"],
        ["#beggingStats", "Begging Level:"],
        ["#resourcesDisplay", "Money (On Hand):"],
        ["#resourcesDisplay", "Money (In Bank):"],
        ["#resourcesDisplay", "Points:"],
        ["#resourcesDisplay", "Tokens:"],
        ["#personalInfo", "Gender:"],
        ["#personalInfo", "Spouse:"],
    ].forEach(([selector, label]) => hideLineByLabel(selector, label));

    const drinkingStats = qs("#drinkingStats");
    if (drinkingStats) {
        css(drinkingStats, { display: "none" });
    }
}