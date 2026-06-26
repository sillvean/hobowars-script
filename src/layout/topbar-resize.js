function resizeTopbar() {
    const topbar = qs(".topbar");
    const topbarMenu = qs(".topbar-menu");
    const currency = qs(".currency");
    const container = qs(".container");
    const leftPanel = qs(".left-panel");
    if (!topbar || !topbarMenu || !currency || !container || !leftPanel) {
        return;
    }

    document.body.append(currency);

    css(topbar, {
        top: "0",
        height: "40px",
        display: "flex",
        "align-items": "center",
        "border-style": "solid",
        "border-width": "0 0 1px 0",
        "border-color": colors.black,
    });

    css(currency, {
        top: "40px",
        left: "0",
        right: "0",
        margin: "0",
        height: "20px",
        width: "100%",
        position: "fixed",
        background: colors.darkGray,
        "z-index": "100",
        padding: "4px",
        "border-style": "solid",
        "border-width": "0 0 1px 0",
        "border-color": colors.black,
        display: "flex",
        "align-items": "center",
    });

    css(topbarMenu, {
        top: "60px",
        height: "40px",
        "border-style": "solid",
        "border-width": "0 0 2px 0",
        "border-color": colors.black,
    });

    // Add a Backpack shortcut to the start of the top-bar menu.
    const backpackItem = createEl("li");
    backpackItem.prepend(createEl("a", {
        href: "https://www.hobowars.com/game/game.php?sr=112&cmd=backpack",
        innerText: "Backpack",
    }));
    const topbarMenuList = qs("ul", topbarMenu);
    if (topbarMenuList) {
        topbarMenuList.prepend(backpackItem);
    }

    css(container, { "padding-top": "100px" });
    css(leftPanel, { top: "100px" });
}
