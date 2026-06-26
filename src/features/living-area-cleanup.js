function hideLivingAreaLineByLabel(containerSelector, labelText) {
    const line = qsa(`${containerSelector} .line`).find(
        (el) => el.querySelector("span")?.textContent?.trim() === labelText
    );
    if (line) {
        css(line, { display: "none" });
    }
}

function hideLivingAreaArenaLine() {
    const arenaLine = qs("#battleRecord input[name='playArena']")?.closest(".line");
    if (arenaLine) {
        css(arenaLine, { display: "none" });
    }
}

function hideLivingAreaMailForm() {
    const mailForm = qs("form[action*='cmd=mail'][action*='do=delsel']");
    if (!mailForm) {
        return;
    }

    if (mailForm.previousElementSibling) {
        css(mailForm.previousElementSibling, { display: "none" });
    }
    css(mailForm, { display: "none" });
}

function removeLivingAreaInvitePromo({ newsHeader }) {
    const invitePromoLink = qsa("a[href*='cmd=rfriend']").find((link) => link.textContent?.trim() === "Click Here");
    if (!invitePromoLink) {
        return;
    }

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

    if (!newsHeader) {
        return;
    }

    let sibling = promoStart;
    while (sibling && sibling !== newsHeader) {
        const next = sibling.nextSibling;
        sibling.remove?.();
        sibling = next;
    }
}

function cleanupLivingAreaAccountLinks() {
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
}

function hideLivingAreaStatLines() {
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
    ].forEach(([selector, label]) => hideLivingAreaLineByLabel(selector, label));
}

function hideLivingAreaDrinkingStats() {
    const drinkingStats = qs("#drinkingStats");
    if (drinkingStats) {
        css(drinkingStats, { display: "none" });
    }
}

function applyLivingAreaCleanup(context = getLivingAreaContext()) {
    if (!context.gearInfo) {
        return;
    }

    hideLivingAreaArenaLine();
    hideLivingAreaMailForm();
    removeLivingAreaInvitePromo(context);
    cleanupLivingAreaAccountLinks();
    hideLivingAreaStatLines();
    hideLivingAreaDrinkingStats();
}