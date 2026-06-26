// Swap a notification count badge between its idle and highlighted colors.
function styleCountBadge(badge, highlighted) {
    if (!badge) {
        return;
    }

    css(badge, {
        "background-color": highlighted ? colors.black : colors.orange,
        color: highlighted ? colors.orange : colors.black,
    });
}

// Paint a nav link in its idle (accent on dark) or active (dark on accent) state.
function paintNavLink(node, active, { withBadge = false } = {}) {
    css(node, {
        "background-color": active ? colors.orange : colors.darkGray,
        color: `${active ? colors.black : colors.orange} !important`,
    });

    if (withBadge) {
        styleCountBadge(node.querySelector(".count"), active);
    }
}

// Accent hover behavior shared by every nav link. Selected links keep their
// highlighted look on mouse-out.
function addNavHover(node, { withBadge = false } = {}) {
    const isSelected = node.classList.contains("sel");
    onHover(
        node,
        (n) => paintNavLink(n, true, { withBadge }),
        (n) => {
            if (!isSelected) {
                paintNavLink(n, false, { withBadge });
            }
        }
    );
}