import { Assets, Sprite, Application } from 'pixi.js';

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
    calculateWinnings();
}

// Calculate winnings function
function calculateWinnings() {
    let winDetails = '';

    for (let i = 0; i < paylines.length; i++) {
        const payline = paylines[i];
        const firstSymbol = currentSymbols[payline[0] % numCols][Math.floor(payline[0] / numCols)];
        let matchCount = 1;

        for (let j = 1; j < payline.length; j++) {
            const symbol = currentSymbols[payline[j] % numCols][Math.floor(payline[j] / numCols)];
            if (symbol === firstSymbol) {
                matchCount++;
            } else {
                break;
            }
        }

        if (matchCount >= 3) {
            const payout = paytable[firstSymbol][matchCount - 3];
            ++totalWins;
            winDetails += `- Payline ${i + 1}, ${firstSymbol} x${matchCount}, ${payout}\n`;
        }
    }

    winText.text = `Total wins: ${totalWins}\n${winDetails}`;
}

// Function to draw reels
export async function drawReels() {
    const reelWidth = 96;
    const reelHeight = 96;
    const numCols = 5;
    const numRows = 3;

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