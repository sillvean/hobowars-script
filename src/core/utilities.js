const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Apply a map of CSS declarations. A value ending in "!important" is applied
// with priority; a null/undefined value removes the property.
function css(node, styles) {
    if (!node) {
        return node;
    }

    for (const [property, raw] of Object.entries(styles)) {
        if (raw == null) {
            node.style.removeProperty(property);
            continue;
        }

        const value = String(raw);
        if (value.endsWith("!important")) {
            node.style.setProperty(property, value.replace(/\s*!important$/, ""), "important");
        } else {
            node.style.setProperty(property, value);
        }
    }

    return node;
}

// Create an element with optional inline styles and assignable properties
// (innerHTML, textContent, href, className, ...).
function createEl(tag, { style, ...props } = {}) {
    const node = Object.assign(document.createElement(tag), props);
    if (style) {
        css(node, style);
    }
    return node;
}

// Attach hover enter/leave callbacks.
function onHover(node, onEnter, onLeave) {
    node.addEventListener("mouseover", () => onEnter(node));
    node.addEventListener("mouseout", () => onLeave(node));
}

const startsWithAny = (text, prefixes) => prefixes.some((prefix) => text.startsWith(prefix));

function findLivingAreaNewsHeader(root = document) {
    return qsa("div[style*='height:25px']", root).find((el) => el.textContent?.includes("News"));
}

function getLivingAreaContext() {
    const tabLinks = qs("#tabLinks");
    const gearInfo = qs("#gearInfo");
    const newsHeader = findLivingAreaNewsHeader();
    const accountLinksList = qs("ul.more_info.nofloat.statsDisplay");

    return {
        tabLinks,
        tabLinkItems: tabLinks ? qsa("a", tabLinks) : [],
        selectedTabLink: qs("#tabLinks a#sel"),
        gearInfo,
        newsHeader,
        newsPanel: newsHeader?.nextElementSibling ?? null,
        contentAreaTable: qs(".content-area > table"),
        contentAreaTopCell: qs(".content-area > table td[valign='top']"),
        tattoo: qs("#tattooImg"),
        accountLinksList,
        referredLink: accountLinksList?.querySelector("a[href*='cmd=referred']")?.closest("li") ?? null,
    };
}

function createRafScheduler(callback) {
    let scheduled = false;

    return () => {
        if (scheduled) {
            return;
        }

        scheduled = true;
        window.requestAnimationFrame(() => {
            scheduled = false;
            callback();
        });
    };
}

