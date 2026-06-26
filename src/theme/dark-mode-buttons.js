function darkModeButtons() {
    qsa("a.btn").forEach((btn) => css(btn, { background: colors.darkGray, color: colors.orange }));
}