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

