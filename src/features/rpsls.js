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
