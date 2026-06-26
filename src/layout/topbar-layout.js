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
