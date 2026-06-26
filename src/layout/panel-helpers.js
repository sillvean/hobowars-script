function addPanelLabel(panel, title) {
    const label = createEl("div", {
        innerHTML: title,
        style: {
            display: "flex",
            "align-items": "center",
            width: "100%",
            padding: "1em 5%",
            color: colors.lightGray,
            "font-weight": "bold",
        },
    });
    panel.append(label);
    return label;
}

function moveLinkIntoPanel(panel, link) {
    panel.append(link);
    css(link, {
        "border-style": "dotted",
        "border-width": "0 0 1px 0",
        "border-color": colors.orange,
        color: `${colors.orange} !important`,
        display: "flex",
        "align-items": "center",
        width: "100%",
        height: "40px",
        padding: "1em 5%",
    });
    addNavHover(link, { withBadge: false });
}