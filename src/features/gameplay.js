/* =============================================================================
 * FEATURES
 * Gameplay-specific helpers: map cleanup, hitlist, RPSLS, university grid,
 * and rankings.
 * ========================================================================== */

// --- Map cleanup: strip background images so solid tile colors show --------

const MAP_TABLE_SELECTOR = "table[cellspacing='0'][cellpadding='0'][bgcolor='#000000']";
const MAP_TILE_SELECTOR = "td[bgcolor]";

let isApplyingMapFix = false;
let mapFixObserver = null;
let mapFixStyleElement = null;
let mapFixScheduled = false;

function isTargetMapTable(table) {
    if (!(table instanceof HTMLTableElement)) {
        return false;
    }

    const tiles = qsa(MAP_TILE_SELECTOR, table);
    if (tiles.length < 100) {
        return false;
    }

    return tiles.some((tile) => tile.title === "You!" || /^\d+,\s*\d+$/.test(tile.title ?? ""));
}

function ensureMapFixStyle() {
    if (!mapFixStyleElement) {
        mapFixStyleElement = createEl("style", { id: "hobowars-map-fix-style" });
        document.head.append(mapFixStyleElement);
    }
    return mapFixStyleElement;
}

function updateMapFixStyles(table) {
    const colorsOnMap = new Set(
        qsa(MAP_TILE_SELECTOR, table)
            .map((tile) => tile.getAttribute("bgcolor")?.toUpperCase())
            .filter(Boolean)
    );

    const rules = ["table[data-hw-map-fix='active'] td { background-image: none !important; }"];
    colorsOnMap.forEach((color) => {
        rules.push(
            `table[data-hw-map-fix='active'] td[bgcolor='${color}'] {` +
            `background: ${color} !important; background-color: ${color} !important; }`
        );
    });

    ensureMapFixStyle().textContent = rules.join("\n");
}

function restoreMapTile(tile) {
    const color = tile.getAttribute("bgcolor");
    if (!color) {
        return;
    }

    tile.bgColor = color;
    tile.setAttribute("bgcolor", color);
    css(tile, {
        background: `${color} !important`,
        "background-color": `${color} !important`,
        "background-image": "none !important",
        "background-repeat": "repeat !important",
        padding: "0 !important",
        "line-height": "0 !important",
        "font-size": "0 !important",
        overflow: "hidden !important",
    });

    const width = tile.getAttribute("width");
    if (width) {
        css(tile, {
            width: `${width}px !important`,
            "min-width": `${width}px !important`,
            "max-width": `${width}px !important`,
        });
    }

    const height = tile.getAttribute("height");
    if (height) {
        css(tile, {
            height: `${height}px !important`,
            "min-height": `${height}px !important`,
            "max-height": `${height}px !important`,
        });
    }

    const { borderColor, borderWidth, borderStyle } = tile.style;
    if (borderColor) {
        css(tile, { "border-color": `${borderColor} !important` });
    }
    if (borderWidth) {
        css(tile, { "border-width": `${borderWidth} !important` });
    }
    if (borderStyle) {
        css(tile, { "border-style": `${borderStyle} !important` });
    }
}

function restoreMap(table) {
    table.setAttribute("data-hw-map-fix", "active");
    updateMapFixStyles(table);
    qsa(MAP_TILE_SELECTOR, table).forEach(restoreMapTile);
}

function scheduleMapFix() {
    if (mapFixScheduled || isApplyingMapFix) {
        return;
    }

    mapFixScheduled = true;
    window.requestAnimationFrame(() => {
        mapFixScheduled = false;
        if (!isApplyingMapFix) {
            applyMapFix();
        }
    });
}

function ensureMapFixObserver(table) {
    if (!enhanceMaps || !(table instanceof HTMLTableElement)) {
        return;
    }

    if (mapFixObserver) {
        mapFixObserver.disconnect();
    }

    mapFixObserver = new MutationObserver(scheduleMapFix);
    mapFixObserver.observe(table, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "bgcolor", "class"],
    });
}

function applyMapFix() {
    if (!enhanceMaps || isApplyingMapFix) {
        return;
    }

    isApplyingMapFix = true;
    try {
        let activeMapTable = null;
        qsa(MAP_TABLE_SELECTOR).forEach((table) => {
            if (isTargetMapTable(table)) {
                activeMapTable = table;
                restoreMap(table);
            }
        });

        if (activeMapTable) {
            ensureMapFixObserver(activeMapTable);
        }
    } finally {
        isApplyingMapFix = false;
    }
}

// --- Hitlist: collapse notes and hide low-value targets --------------------

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

function solveRPSLS() {
    const contentArea = qs(".content-area");
    const text = contentArea.innerText;
    const isRPSLS =
        text.includes("You nod your head and Johnson sticks his fist in his palm.") ||
        text.includes("You stare the bald hobo straight in the eyes as you steel yourself mentally");
    if (!isRPSLS) {
        return;
    }

    const links = qsa("a", contentArea);
    let correctIndex = 0;
    if (text.includes("tongue")) {
        correctIndex = 0;
    } else if (text.includes("feet")) {
        correctIndex = 1;
    } else if (text.includes("You notice the bald guy tucking his thumb inside his fist")) {
        correctIndex = 2;
    } else if (text.includes("ear")) {
        correctIndex = 3;
    } else if (text.includes("You notice the bald guy crossing his eyes a little bit")) {
        correctIndex = 4;
    }

    css(links[correctIndex], { color: `${colors.red} !important` });
}

// --- University grid: brute-force the best row/column rotations ------------

const uniGrid = [[], [], [], []];

function enhanceUniGrid() {
    const rows = qsa(".uni table tr");
    if (rows.length === 0) {
        return;
    }

    for (let i = 1; i < rows.length; i++) {
        const cells = qsa("td", rows[i]);
        for (let j = 1; j < cells.length; j++) {
            uniGrid[i - 1][j - 1] = qs("div", cells[j]).innerHTML;
        }
    }

    const { rowRotations, colRotations } = solveUniGrid(uniGrid);
    const highlight = (node, active) => css(node, { background: active ? `${colors.red} !important` : null });

    const columnRotators = qsa("td>a>div", rows[0]);
    colRotations.forEach((rotation, index) => highlight(columnRotators[index], rotation > 0));

    for (let i = 1; i <= 4; i++) {
        highlight(qs("td>a>div", rows[i]), rowRotations[i - 1] > 0);
    }
}

function solveUniGrid(originalGrid) {
    const N = 4;
    const realToMod = { "-1": 2, "0": 0, "1": 1 };
    const modToReal = [0, 1, -1];
    const grid = originalGrid.map((row) => row.map((v) => realToMod[v]));

    let bestScore = -Infinity;
    let best = { rowRotations: [], colRotations: [] };

    for (let r0 = 0; r0 < 3; r0++) {
        for (let r1 = 0; r1 < 3; r1++) {
            for (let r2 = 0; r2 < 3; r2++) {
                for (let r3 = 0; r3 < 3; r3++) {
                    const rowRotations = [r0, r1, r2, r3];

                    for (let c0 = 0; c0 < 3; c0++) {
                        for (let c1 = 0; c1 < 3; c1++) {
                            for (let c2 = 0; c2 < 3; c2++) {
                                for (let c3 = 0; c3 < 3; c3++) {
                                    const colRotations = [c0, c1, c2, c3];

                                    let total = 0;
                                    for (let i = 0; i < N; i++) {
                                        for (let j = 0; j < N; j++) {
                                            total += modToReal[(grid[i][j] + rowRotations[i] + colRotations[j]) % 3];
                                        }
                                    }

                                    if (total > bestScore) {
                                        bestScore = total;
                                        best = {
                                            rowRotations: [...rowRotations],
                                            colRotations: [...colRotations],
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return best;
}

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

function hideShopItemsByName() {
    qsa("tr").forEach((row) => {
        const rowText = row.textContent?.replace(/\s+/g, " ").trim();
        if (!rowText) {
            return;
        }

        for (const itemName of hiddenShopItemNames) {
            if (rowText.includes(itemName)) {
                css(row, { display: "none" });
                break;
            }
        }
    });
}

