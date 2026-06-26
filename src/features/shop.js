const hiddenShopItemNames = new Set([
    "King's Kiddie Cup",
    "Bartender Guide",
    "Adamantium Pasties",
    "Ring Setting",
    "Adamantium Claws",
    "Wolf Shirt",
    "Phaser",
    "Locker",
    "Rat Trough",
    "Military Rations",
    "Old Can of Soup Stock",
    "Magnet",
    "Goon Sack",
    "Zima Light",
    "Homeless Hennessy",
    "Lemon Drop",
    "Buttery Nipple",
    "Canadian Flag",
    "The CMYK",
    "Rainbow Road",
    "Jagermeister",
    "Albino Ale",
    "Jack Daniel's",
    "John Cuervo Tequila",
    "Time Traveler",
    "Boxcar Boxed Wine",
    "Cola",
    "Red Bull",
    "Dry Ice",
    "Polypop",
    "Volleypop",
    "Dalipop",
    "Blueberry Blast Jelly Beans",
    "Freeze-Packed Dippin Dots",
    "Gummi Raptor",
    "Gummi Peregrine Falcon",
    "Gummi Gorilla",
    "Red Hots",
    "Semi-Lasting Gobstopper",
    "Rainbow Drop",
    "Wonka-stripe Candy Cane",
]);

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
