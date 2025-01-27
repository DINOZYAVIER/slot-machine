import { Assets, Sprite, Text, TextStyle, Container } from 'pixi.js';

import { spinReels, drawReels } from './reels.js';

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

const gameContainer = new Container();
export const reelsContainer = new Container();

const winTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff'
});
export const winText = new Text('Total wins: 0\n', winTextStyle);

export async function setupUI(app) {
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    loadingText.x = app.screen.width / 2;
    loadingText.y = app.screen.height / 2;

    loadingText.pivot.x = loadingText.width / 2;
    loadingText.pivot.y = loadingText.height / 2;

    loadingText.anchor.set(0.5); 

    app.stage.addChild(loadingText);

    await loadAssetsAndShowLoading(loadingText);

     // Create game container
     app.stage.addChild(gameContainer);
 
     // Create reels container
     gameContainer.addChild(reelsContainer);
 
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
 
     winText.anchor.set(0.5);
     winText.x = app.screen.width / 2;
     winText.y = app.screen.height - 50;
     winText.resolution = 1;
     gameContainer.addChild(winText);

    // Resize handler
    window.addEventListener('resize', () => {
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
    
    // Call the resize handler initially to set positions and scale correctly
    window.dispatchEvent(new Event('resize'));
    await drawReels();
}

export async function loadAssetsAndShowLoading(loadingText)
{
    // Initialize the assets using a manifest file
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
}