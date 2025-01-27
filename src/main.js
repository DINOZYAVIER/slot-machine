import { Application, Text, TextStyle, Assets, Sprite, Container, Texture } from 'pixi.js';

// Paytable
const paytable = {
    'hv1': [10, 20, 50],
    'hv2': [5, 10, 20],
    'hv3': [5, 10, 15],
    'hv4': [5, 10, 15],
    'lv1': [2, 5, 10],
    'lv2': [1, 2, 5],
    'lv3': [1, 2, 3],
    'lv4': [1, 2, 3]
};

// Paylines
const paylines = [
    [0, 1, 2, 3, 4],  // Payline 1
    [5, 6, 7, 8, 9],  // Payline 2
    [10, 11, 12, 13, 14],  // Payline 3
    [0, 6, 12, 8, 4],  // Payline 4
    [10, 6, 2, 8, 14],  // Payline 5
    [0, 6, 7, 8, 14],  // Payline 6
    [10, 6, 7, 8, 4]   // Payline 7
];

// Reel bands
const reelBands = [
    ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
    ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
    ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
    ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
    ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
];

// Current symbols on each reel, initialized with the specified values
const currentSymbols = [
    ['hv2', 'lv3', 'lv3'],
    ['hv1', 'lv2', 'lv3'],
    ['lv1', 'hv2', 'lv3'],
    ['hv2', 'lv2', 'hv3'],
    ['lv3', 'lv4', 'hv2']
];

let totalWins = 0;
const app = new Application();

// Function to draw reels
function drawReels(currentSymbols, reelsContainer, Assets) {
    console.log('draw');
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

(async () =>
{
    // Create a new application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const loadingTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        stroke: { color: '#4a1850', width: 5, join: 'round' },
        dropShadow: {
            color: '#000000',
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const loadingText = new Text({
        text: 'Loading ...',
        loadingTextStyle,
    });

    loadingText.x = app.screen.width / 2;
    loadingText.y = app.screen.height / 2;

    loadingText.pivot.x = loadingText.width / 2;
    loadingText.pivot.y = loadingText.height / 2;

    loadingText.anchor.set(0.5); 

    app.stage.addChild(loadingText);
    
    //Initialize the assets using a manifest file
    await Assets.init({ manifest: './manifest.json'});
    await Assets.loadBundle('symbols', (progress) => 
    {
        // Update the loading text with the current progress
        loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
    }).then(() => 
    {
        // Once assets are loaded, display a message or start the game
        loadingText.text = 'Assets loaded!';
    }).catch((error) => 
    {
        console.error('Error loading assets:', error);
    });

    setInterval(1000);
    loadingText.destroy();

    // Create game container
    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    // Create reels container
    const reelsContainer = new Container();
    gameContainer.addChild(reelsContainer);

    const reelWidth = 96;
    const reelHeight = 96;
    const numCols = 5;
    const numRows = 3;

    // Create spin button
    const spinButton = new Sprite(Assets.get('button'));
    spinButton.scale.set(0.5);
    spinButton.anchor.set(0.5);
    spinButton.x = app.screen.width / 2;
    spinButton.y = app.screen.height - 250;
    spinButton.interactive = true;
    spinButton.buttonMode = true;
    spinButton.on('pointerdown', spinReels);
    gameContainer.addChild(spinButton);

    // Create text area for displaying wins
    const winTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff'
    });
    const winText = new Text('Total wins: 0\n', winTextStyle);
    winText.anchor.set(0.5);
    winText.x = app.screen.width / 2;
    winText.y = app.screen.height - 50;
    winText.resolution = 1;
    gameContainer.addChild(winText);

     // Spin reels function
     function spinReels() {
        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {
                const randomIndex = Math.floor(Math.random() * reelBands[col].length);
                const symbol = reelsContainer.getChildAt(col * numRows + row);
                const newSymbol = Assets.get(reelBands[col][randomIndex]);
                symbol.texture = newSymbol.texture;
                currentSymbols[col][row] = reelBands[col][randomIndex];
            }
        }
        drawReels(currentSymbols, reelsContainer, Assets);
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
    // Resize handler
    window.addEventListener('resize', () => 
    {
        console.log("resize");
        const scaleX = window.innerWidth / 800; // 800 is the initial width
        const scaleY = window.innerHeight / 600; // 600 is the initial height
        const scale = Math.min(scaleX, scaleY);

        app.renderer.resize(window.innerWidth, window.innerHeight);

        // Update positions and scale
        reelsContainer.scale.set(scale);
        reelsContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 100 * scale);

        spinButton.scale.set(0.5 * scale);
        spinButton.position.set(app.screen.width / 2, app.screen.height - 190 * scale);

        winText.scale.set(scale);
        winText.position.set(app.screen.width / 2, app.screen.height - 60 * scale);
});

    drawReels(currentSymbols, reelsContainer, Assets);

    // Call the resize handler initially to set positions and scale correctly
    window.dispatchEvent(new Event('resize'));
})();
