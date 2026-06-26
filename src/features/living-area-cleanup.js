function cleanupLivingArea() {
    const gearInfo = qs("#gearInfo");
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

    const newsHeader = findLivingAreaNewsHeader();
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