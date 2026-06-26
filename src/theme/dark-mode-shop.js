function darkModeShop() {
    if (pageTitle !== "Pawn Czar") {
        return;
    }

    qsa("font").forEach((font) => css(font, { color: colors.almostWhite }));
    qsa(".shopCost").forEach((cost) => css(cost, { color: colors.almostWhite }));
}