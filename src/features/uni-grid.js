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
