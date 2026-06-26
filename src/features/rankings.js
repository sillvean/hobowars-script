// --- Rankings: trim the list and hide players below the level threshold ----

function enhanceRankingsTable() {
    if (!enhanceRankings) {
        return;
    }

    const heading = qsa("h3").find((h) => h.innerText?.trim() === "Hobo Rankings");
    const table = heading?.nextElementSibling;
    if (!table || table.tagName !== "TABLE") {
        return;
    }

    const fromInput = table.querySelector("input[name='s_rank']");
    const currentValue = Number.parseInt(fromInput?.value ?? "", 10);
    if (fromInput && !Number.isNaN(currentValue)) {
        fromInput.value = String(Math.max(0, currentValue - 41));
    }

    qsa("tr", table).forEach((row) => {
        const cells = qsa("td", row);
        if (cells.length < 5) {
            return;
        }

        const level = Number.parseInt(cells[2].querySelector("center")?.innerText?.trim() ?? "", 10);
        if (!Number.isNaN(level) && level < rankingThreshold) {
            css(row, { display: "none" });
        }
    });
}
