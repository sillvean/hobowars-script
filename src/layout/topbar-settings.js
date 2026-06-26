function addSettingsButton(parent, href, icon) {
    const button = createEl("a", {
        href,
        className: "topbar-settings-button",
        innerHTML: icon,
        style: {
            padding: "8px",
            margin: "auto 0",
            display: "flex",
            "align-items": "center",
            color: `${colors.orange} !important`,
        },
    });
    addNavHover(button, { withBadge: false });
    css(qs("svg", button), { width: "24px", height: "24px" });
    parent.append(button);
}

function buildTopbarSettings() {
    const topbar = qs(".topbar-menu");
    if (!topbar) {
        return;
    }

    css(topbar, { display: "flex", "align-items": "center", "justify-content": "space-between" });

    const settings = createEl("div", {
        className: "topbar-settings",
        style: { display: "flex", "align-items": "center", "margin-right": "40px", height: "100%" },
    });
    topbar.append(settings);

    addSettingsButton(settings, "game.php?sr=197&cmd=preferences", icons.gearFill);
    addSettingsButton(settings, "//wiki.hobowars.com/index.php?title=Main_Page", icons.questionDiamondFill);
    addSettingsButton(settings, "game.php?sr=197&cmd=logout", icons.doorClosedFill);

    const spacerLeft = createEl("div", {
        className: "topbar-spacer-left",
        style: { width: "120px", "margin-left": "40px", height: "100%" },
    });
    topbar.prepend(spacerLeft);
}
