function enhanceSwimmingTopbar() {
    const clock = qs(".clock");
    const clockRow = qs(".clock>.section-row");
    const dateEl = clockRow ? qs("i", clockRow) : null;
    const clockLabel = clockRow ? qs("#clock", clockRow) : null;
    const dateDisplay = clockRow ? qs(".hw-clock-date", clockRow) : null;

    if (!clock || !clockRow || !dateEl || !clockLabel || !dateDisplay) {
        return;
    }

    let swimmingReminder = qs(".hw-swimming-reminder", clockRow);
    if (!swimmingReminder) {
        swimmingReminder = createEl("span", {
            className: "hw-swimming-reminder",
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
    }

    const updateSwimmingClockState = () => {
        const gameNow = parseGameClockDate(dateEl.innerText, clockLabel.innerText);
        const isSwimmingHour = gameNow ? isSwimmingHourAt(gameNow) : false;
        const nextSwimmingStart = gameNow ? getNextSwimmingWindowStart(gameNow) : null;

        css(clockRow, {
            color: isSwimmingHour ? colors.blue : colors.almostWhite,
            "font-weight": "bold",
            display: "flex",
        });

        dateDisplay.innerText = dateEl.innerText;
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
}