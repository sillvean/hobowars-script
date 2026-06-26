
// Feature flags. Colors live in `colors`, icon SVGs in `icons`, and nav
// grouping in the descriptor lists further below.
const demoMode = false;
const darkMode = true; // Dark-mode color theme (see DARK MODE section)
const enhanceMaps = true; // Strip background images from map tiles

const enhanceHitlist = false; // Hide low-value hitlist targets
const hitlistThreshold = 2000;

const enhanceRankings = true; // Hide ranked players below a level
const rankingThreshold = 700;

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
