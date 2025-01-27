import { Application, Text, TextStyle, Assets, Sprite, Container } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application({autoStart: true});
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

    const reelWidth = 128;
    const reelHeight = 128;
    const numCols = 5;
    const numRows = 3;

    // Create and position reels
    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
            const symbol = new Sprite(Assets.get(`hv${Math.floor(Math.random() * 4) + 1}`)); // Example: hv1, hv2, etc.  
            symbol.scale.set(0.5, 0.5);
            symbol.x = col * reelWidth;
            symbol.y = row * reelHeight;
            reelsContainer.addChild(symbol);
            console.log('Column is ' + col + ', row is ' + row);
        }
    }

    // Center the reels container
    reelsContainer.pivot.set((numCols * reelWidth) / 2, (numRows * reelHeight) / 2);
    reelsContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 150);

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
    const winText = new Text('Wins: 0', winTextStyle);
    winText.anchor.set(0.5);
    winText.x = app.screen.width / 2;
    winText.y = app.screen.height - 150;
    gameContainer.addChild(winText);

    // Spin reels function
    function spinReels() {
        for (let i = 0; i < reelsContainer.children.length; i++) {
            const symbol = reelsContainer.children[i];
            const newSymbol = Assets.get(`hv${Math.floor(Math.random() * 4) + 1}`);
            symbol.texture = newSymbol.texture;
        }
    }

    // Resize handler
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        reelsContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 50);
        spinButton.position.set(app.screen.width / 2, app.screen.height - 100);
        winText.position.set(app.screen.width / 2, app.screen.height - 50);
    });

    // Call the resize handler initially to set positions correctly
    app.renderer.resize(window.innerWidth, window.innerHeight);
})();
