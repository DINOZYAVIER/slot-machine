import { Application } from 'pixi.js';


import { setupUI } from './ui.js';
export const app = new Application();

let totalWins = 0;
let numCols = 5;
let numRows = 3;

(async () =>
{
    await setupUI(app);
})();
