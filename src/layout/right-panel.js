function buildRightPanel() {
    const panelMinWidth = "149px";
    const panelWidth = "15%";
    const panelMaxWidth = "200px";
    const leftPanel = qs(".left-panel");
    const leftSpacer = qs(".left-spacer");
    const container = qs(".container");
    if (!leftPanel || !leftSpacer || !container) {
        return;
    }

    css(leftPanel, { "width": panelWidth, "min-width": panelMinWidth, "max-width": panelMaxWidth });
    css(leftSpacer, { "display": "block", "width": panelWidth, "min-width": panelMinWidth, "max-width": panelMaxWidth });
    const rightSpacer = leftSpacer.cloneNode(true);

    const rightPanel = createEl("div", {
        style: {
            position: "fixed",
            right: "0",
            bottom: "0",
            top: "100px",
            height: "100%",
            display: "table-cell",
            width: panelWidth,
            "min-width": panelMinWidth,
            "max-width": panelMaxWidth,
            "border-style": "solid",
            "border-width": "0 0 0 2px",
            "border-color": colors.black,
            "z-index": "80",
            background: colors.darkGray,
        },
    });

    qsa(".menu-label").forEach((label) => css(label, { color: colors.lightGray }));
    css(qsa(".left-panel>ul")[1], { "padding-bottom": "0" });

    const sidebarLinks = qsa(".left-panel>ul>li>a");

    rightPanelSections.forEach(({ title, descriptors }) => {
        addPanelLabel(rightPanel, title);
        sidebarLinks
            .filter((link) => startsWithAny(link.innerHTML, descriptors))
            .forEach((link) => moveLinkIntoPanel(rightPanel, link));
    });

    rightPanelShortcuts.forEach(({ href, label }) => {
        moveLinkIntoPanel(rightPanel, createEl("a", {
            href,
            innerHTML: label,
        }));
    });

    container.append(rightSpacer);
    container.append(rightPanel);
}
