import { Assets, Sprite } from 'pixi.js';

import { paytable, paylines, reelBands, currentSymbols } from './constants.js';
import { reelsContainer, winText } from './ui.js';
import { app } from './main.js';

let totalWins = 0;
let numCols = 5;
let numRows = 3;

// Spin reels function
export function spinReels() {
    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const randomIndex = Math.floor(Math.random() * reelBands[col].length);
            const symbol = reelsContainer.getChildAt(col * numRows + row);
            const newSymbol = Assets.get(reelBands[col][randomIndex]);
            symbol.texture = newSymbol.texture;
            currentSymbols[col][row] = reelBands[col][randomIndex];
        }
    }
    drawReels();
    calculateWinnings(paylines, currentSymbols, numCols, paytable, winText);
}

function getSymbolAtPosition(position, currentSymbols, numCols) {
    return currentSymbols[position % numCols][Math.floor(position / numCols)];
}

function countMatchingSymbols(payline, currentSymbols, numCols, countedPositions) {
    const firstSymbol = getSymbolAtPosition(payline[0], currentSymbols, numCols);
    let matchCount = 1;

    countedPositions.add(payline[0]);

    for (let i = 1; i < payline.length; i++) {
        const position = payline[i];
        const symbol = getSymbolAtPosition(position, currentSymbols, numCols);

        if (!countedPositions.has(position) && symbol === firstSymbol) {
            matchCount++;
            countedPositions.add(position);
        } else {
            break;
        }
    }

    return { firstSymbol, matchCount };
}

function calculatePaylineWinnings(payline, currentSymbols, numCols, paytable, countedPositions) {
    const { firstSymbol, matchCount } = countMatchingSymbols(payline, currentSymbols, numCols, countedPositions);

    if (matchCount >= 3) {
        const payout = paytable[firstSymbol][matchCount - 3];
        return { firstSymbol, matchCount, payout };
    }

    return null;
}

function calculateWinnings(paylines, currentSymbols, numCols, paytable, winText) {
    let winDetails = '';
    const countedPositions = new Set();

    for (let i = 0; i < paylines.length; i++) {
        const winData = calculatePaylineWinnings(paylines[i], currentSymbols, numCols, paytable, countedPositions);
        if (winData) {
            totalWins++;
            winDetails += `- Payline ${i + 1}, ${winData.firstSymbol} x${winData.matchCount}, ${winData.payout}\n`;
        }
    }

    winText.text = `Total wins: ${totalWins}\n${winDetails}`;
}

// Function to draw reels
export async function drawReels() {
    const reelWidth = 96;
    const reelHeight = 96;

    reelsContainer.removeChildren();

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const symbol = new Sprite(Assets.get(currentSymbols[col][row]));
            symbol.scale.set(0.38, 0.38);
            symbol.x = col * reelWidth;
            symbol.y = row * reelHeight;
            reelsContainer.addChild(symbol);
        }
    }
    reelsContainer.pivot.set((numCols * reelWidth) / 2, (numRows * reelHeight) / 2);
    reelsContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 150);

    window.dispatchEvent(new Event('resize'));
}