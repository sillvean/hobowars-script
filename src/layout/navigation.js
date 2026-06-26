// --- Navigation menus ------------------------------------------------------

// Base look + accent hover (with count-badge swap) for menu links.
function styleNavLinks(links) {
    links.forEach((link) => {
        css(link, { "border-radius": "0px", color: `${colors.orange} !important` });
        addNavHover(link, { withBadge: true });
    });
}

function insertSidebarIcon(link, descriptor, icon) {
    if (link.innerHTML.startsWith(descriptor)) {
        link.prepend(createEl("span", { innerHTML: icon, style: { "margin-right": "8px" } }));
    }
}

function replaceWithIcon(link, descriptor, icon) {
    if (!link.innerHTML.startsWith(descriptor)) {
        return;
    }

    link.innerHTML = icon;
    css(link, { display: "flex", "align-items": "center", padding: "8px", height: "100%" });
    css(qs("svg", link), { width: "24px", height: "24px" });
}

function styleNavigationMenus() {
    const leftPanel = qs(".left-panel");
    if (!leftPanel) {
        return;
    }

    css(leftPanel, { "background-color": colors.darkGray });

    // Top bar: hover styling + replace text labels with icons.
    const topbarLinks = qsa(".topbar-menu>ul>li>a");
    styleNavLinks(topbarLinks);
    topbarLinks.forEach((link) => {
        for (const [descriptor, icon] of Object.entries(iconsMapping)) {
            replaceWithIcon(link, descriptor, icon);
        }
    });

    // Sidebar: hover styling, then regroup links under labeled sections.
    const sidebarLinks = qsa(".left-panel>ul>li>a");
    styleNavLinks(sidebarLinks);

    navigationSidebarGroups.forEach(({ title, descriptors }) => {
        addPanelLabel(leftPanel, title);
        sidebarLinks
            .filter((link) => startsWithAny(link.innerHTML, descriptors))
            .forEach((link) => moveLinkIntoPanel(leftPanel, link));
    });

    // Sidebar link cosmetics + count badges + icons.
    sidebarLinks.forEach((link) => {
        css(link, {
            "border-style": "dotted",
            "border-color": colors.orange,
            padding: "1em 5%",
            display: "flex",
            "align-items": "center",
        });

        const badge = link.querySelector(".count");
        if (badge) {
            css(badge, {
                "background-color": colors.orange,
                color: colors.black,
                padding: "4px 8px",
                "margin-right": "0",
                "margin-left": "auto",
                "margin-top": "4px",
                display: badge.innerHTML === "0" ? "none" : null,
            });
        }

        for (const [descriptor, icon] of Object.entries(iconsMapping)) {
            insertSidebarIcon(link, descriptor, icon);
        }
    });

    // Highlight the currently selected link in both menus.
    qsa(".sel").forEach((link) => paintNavLink(link, true, { withBadge: true }));
}
