/* =============================================================================
 * LAYOUT
 * Everything that hides, moves, or restructures page elements. Color choices
 * here come from the palette/theme helpers; this section owns *where* things
 * go, not the color values.
 * ========================================================================== */

// --- Top bar: stats, resources, clock --------------------------------------

// Wrap a top-bar list item so it keeps the site styling once relocated.
function relocateTopbarListItem(parent, item, width) {
    const wrapperList = createEl("ul");
    wrapperList.append(item);
    const wrapper = createEl("span", { style: { display: "inline-block" } });
    wrapper.append(wrapperList);
    parent.append(wrapper);

    css(item, { width: width, "margin-right": "10px", color: `${colors.orange} !important` });
    css(qs("a", item), { color: `${colors.orange} !important` });
}

// Rebuild a stat bar as an icon + bar + centered description overlay.
function restyleStatBar(statBar, color, icon) {
    css(statBar, { background: `${color} !important` });

    const statBarArea = statBar.parentElement;
    css(statBarArea, {
        "border-width": "1px",
        "border-color": colors.orange,
        "border-style": "solid",
        height: "24px",
        width: "160px",
        display: "inline-block",
        position: "relative",
    });

    const ancestor = statBarArea.parentElement;
    const root = ancestor.parentElement;
    const description = qs(".playerStatsText", root);
    css(description, { color: colors.white, "margin-left": "8px" });

    const iconWrapper = createEl("div", {
        innerHTML: icon,
        className: "icon-wrapper",
        style: {
            display: "inline-block",
            height: "24px",
            "border-width": "1px 0 1px 1px",
            "border-color": colors.orange,
            "border-style": "solid",
            padding: "3px",
        },
    });

    const statBarWithIcon = createEl("div", { style: { display: "flex", "align-items": "center" } });
    statBarWithIcon.append(iconWrapper, statBarArea);
    ancestor.append(statBarWithIcon);

    const overlay = createEl("div", {
        className: "statbarOverlay",
        style: {
            display: "flex",
            "align-items": "center",
            position: "absolute",
            top: "50%",
            left: "0",
            width: "80%",
            height: "50%",
            "z-index": "100",
            background: colors.black,
            opacity: ".75",
        },
    });
    overlay.append(description);
    statBarArea.append(overlay);
}

function relocateStats() {
    const stats = qs(".top-center>.stats");
    css(stats, { margin: "0 auto", display: "flex", "justify-content": "center" });

    const list = qs("ul", stats);
    css(list, { display: "none" });
    qsa("li", list).slice(0, 4).forEach((item) => relocateTopbarListItem(stats, item, "220px"));

    restyleStatBar(qs("#levelBarFill"), colors.lightGray, icons.personFill);
    restyleStatBar(qs("#lifeBarFill"), colors.red, icons.heartPulseFill);
    restyleStatBar(qs("#awakeBarFill"), colors.orange, icons.batteryCharging);
    restyleStatBar(qs("#bacBarFill"), colors.blue, icons.drink);
}

function relocateResources() {
    const resources = qs(".top-center>.currency");
    css(resources, { margin: "6px auto 0px auto", display: "flex", "justify-content": "center" });

    const list = qs("ul", resources);
    css(list, { display: "none" });
    const items = qsa("li", list);

    items.slice(0, 4).forEach((item) => relocateTopbarListItem(resources, item, "130px"));

    // Remove the colon from the Token resource.
    items[3].innerHTML = items[3].innerHTML.replace(":", "");

    if (demoMode) {
        css(qs(".no-mobile.displayMoney"), { visibility: "hidden" });
        css(qs(".no-mobile.displayBank"), { visibility: "hidden" });
        items[2].innerHTML = "<b>Points</b>";
        css(qs(".no-mobile>.displayTokens"), { visibility: "hidden" });
    }

    relocateClock();
}

function relocateClock() {
    const clock = qs(".clock");
    css(clock, {
        display: "flex",
        "justify-content": "right",
        border: "0px",
        "padding-right": "10px",
    });

    const sections = qsa(".clock>.section-row");
    css(sections[1], { display: "none" });
    css(sections[2], { display: "none" });

    const dateEl = qs("i", sections[0]);
    css(dateEl, { display: "none" });
    const newDate = createEl("span", {
        innerText: dateEl.innerText,
        style: { "align-items": "center", display: "flex", margin: "0 10px 2px 2px" },
    });

    const displayEffect = qs(".displayEffect", sections[0]);
    css(displayEffect, { "padding-right": "23px" });

    const clockLabel = qs("#clock", sections[0]);
    const swimmingReminder = createEl("span", {
        innerText: "",
        style: {
            color: colors.lightGray,
            display: "flex",
            "align-items": "center",
            "font-size": "11px",
            "margin-left": "8px",
            "white-space": "nowrap",
        },
    });
    clockLabel.after(swimmingReminder);

    const updateSwimmingClockState = () => {
        const gameNow = parseGameClockDate(dateEl.innerText, clockLabel.innerText);
        const isSwimmingHour = gameNow ? isSwimmingHourAt(gameNow) : false;
        const nextSwimmingStart = gameNow ? getNextSwimmingWindowStart(gameNow) : null;

        css(sections[0], {
            color: isSwimmingHour ? colors.blue : colors.almostWhite,
            "font-weight": "bold",
            display: "flex",
        });

        newDate.innerText = dateEl.innerText;
        swimmingReminder.innerText = gameNow
            ? formatNextSwimmingReminder(gameNow, nextSwimmingStart)
            : "Swim: n/a";
        swimmingReminder.style.color = isSwimmingHour ? colors.blue : colors.lightGray;
    };

    updateSwimmingClockState();

    if (!clock.dataset.swimmingClockLiveUpdateBound) {
        window.setInterval(updateSwimmingClockState, 1000);
        clock.dataset.swimmingClockLiveUpdateBound = "true";
    }

    sections[0].prepend(newDate);
    sections[0].append(displayEffect);

    const currency = qs(".currency");
    currency.append(clock);

    const donator = qs(".becomedon");
    css(donator, { "display": "none" });

    currency.append(displayEffect);
}

function relocateTopbarMenu() {
    css(qs(".topbar-menu"), { margin: "0 auto", display: "flex", "justify-content": "center" });
}

// Hide site chrome we do not want: logo, big icons, player name, footer,
// and the account panels.
function hideClutter() {
    css(qs(".top-left"), { display: "none" });
    css(qs(".bmenu"), { display: "none" });
    css(qs(".pname"), { display: "none" });
    css(qs(".footer"), { display: "none" });

    const leftPanelLists = qsa(".left-panel>ul");
    css(leftPanelLists[1], { display: "none" });
    css(leftPanelLists[2], { display: "none" });
}

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

// Move a link into a side panel and give it the panel item look + hover.
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

function styleNavigationMenus() {
    const leftPanel = qs(".left-panel");
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

    const groups = [
        ["AWAKE DUMP", awakeDumpElementDescriptors],
        ["DAILIES", dailyElementDescriptors],
        ["SHOPS", shopElementDescriptors],
    ];
    groups.forEach(([title, descriptors]) => {
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

const RIGHT_PANEL_AREAS = [
    "Northern Fence", "City", "Bernard's Mansion", "Second City",
    "Hoburbia", "Canbodia", "Carnival", "Chocolate Factory", "Fort Slugworth",
];
const RIGHT_PANEL_INFO = ["Gang", "Lotto Land", "Message Boards"];

function buildRightPanel() {
    const panelMinWidth = "149px";
    const panelWidth = "15%";
    const panelMaxWidth = "200px";
    const leftPanel = qs(".left-panel");
    css(leftPanel, { "width": panelWidth, "min-width": panelMinWidth, "max-width": panelMaxWidth });
    const leftSpacer = qs(".left-spacer");
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

    addPanelLabel(rightPanel, "AREAS");

    qsa(".menu-label").forEach((label) => css(label, { color: colors.lightGray }));
    css(qsa(".left-panel>ul")[1], { "padding-bottom": "0" });

    const sidebarLinks = qsa(".left-panel>ul>li>a");
    sidebarLinks
        .filter((link) => startsWithAny(link.innerHTML, RIGHT_PANEL_AREAS))
        .forEach((link) => moveLinkIntoPanel(rightPanel, link));

    addPanelLabel(rightPanel, "INFO");
    sidebarLinks
        .filter((link) => startsWithAny(link.innerHTML, RIGHT_PANEL_INFO))
        .forEach((link) => moveLinkIntoPanel(rightPanel, link));

    // Extra shortcuts.
    moveLinkIntoPanel(rightPanel, createEl("a", {
        href: "game.php?sr=197&cmd=gathering&do=board&board=13",
        innerHTML: "Gang Boards",
    }));
    moveLinkIntoPanel(rightPanel, createEl("a", {
        href: "game.php?sr=115&cmd=active",
        innerHTML: "Players Online",
    }));

    const container = qs(".container");
    container.append(rightSpacer);
    container.append(rightPanel);
}

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

function resizeTopbar() {
    const topbar = qs(".topbar");
    const topbarMenu = qs(".topbar-menu");
    const currency = qs(".currency");
    const container = qs(".container");
    const leftPanel = qs(".left-panel");

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
    qs("ul", topbarMenu).prepend(backpackItem);

    css(container, { "padding-top": "100px" });
    css(leftPanel, { top: "100px" });
}

