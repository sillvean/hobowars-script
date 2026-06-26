// --- Map cleanup: strip background images so solid tile colors show --------

const MAP_TABLE_SELECTOR = "table[cellspacing='0'][cellpadding='0'][bgcolor='#000000']";
const MAP_TILE_SELECTOR = "td[bgcolor]";

let isApplyingMapFix = false;
let mapFixObserver = null;
let mapFixStyleElement = null;
const scheduleMapFixFrame = createRafScheduler(() => {
    if (!isApplyingMapFix) {
        applyMapFix();
    }
});

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
    if (isApplyingMapFix) {
        return;
    }

    scheduleMapFixFrame();
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
