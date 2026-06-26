function enhanceHitlistTable() {
    if (!enhanceHitlist) {
        return;
    }

    const myCitySide = "West";
    const rows = qsa("#hitlist tr");
    css(qs("#area"), { display: "none" });

    rows.forEach((row, index) => {
        const cells = qsa("td", row);

        // Hide Battle count, Alive, and the unused column.
        css(cells[6], { display: "none" });
        css(cells[5], { display: "none" });
        css(cells[2], { display: "none" });

        if (index === 0) {
            return;
        }

        const sameSide = cells[4].querySelector("div>b>font").innerHTML === myCitySide;
        const noteEl = cells[1].querySelector("div>font");
        const noteParts = noteEl.innerHTML.split(" | ");

        let gangPart = null;
        let hitsPart = null;
        let otherSideExpPart = null;
        let sameSideExpPart = null;
        noteParts.forEach((part) => {
            if (part.startsWith("[G")) {
                gangPart = part;
            }
            if (part.startsWith("[H")) {
                hitsPart = part;
            } else if (part.startsWith("[D")) {
                otherSideExpPart = part;
            } else if (part.startsWith("[S")) {
                sameSideExpPart = part;
            }
        });

        const gangPrefix = gangPart ? `<span style='color: green; font-weight: bold'>${gangPart}</span> ` : "";
        const requiredHits = hitsPart ? hitsPart[3] : 1;
        const currentExpPart = sameSide ? (sameSideExpPart ?? "???") : (otherSideExpPart ?? "???");
        const currentExp = currentExpPart.replace(",", "").replace("k", "").substring(6);
        const resultExp = currentExp / requiredHits;

        noteEl.innerHTML = `${gangPrefix}${resultExp}k (${requiredHits})`;
        if (requiredHits > 1) {
            css(noteEl, { color: colors.red });
        }
        if (resultExp < hitlistThreshold) {
            css(row, { display: "none" });
        }
    });
}

// --- RPSLS: highlight the winning choice -----------------------------------
