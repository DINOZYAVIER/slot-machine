import { Application, Text, TextStyle, Assets, Sprite } from 'pixi.js';

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
    
   // Initialize the assets using a manifest file
    await Assets.init({ manifest: './manifest.json'});

    const symbolsPromise = await Assets.loadBundle('symbols', (progress) => 
    {
        // Update the loading text with the current progress
        loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
        console.log(loadingText.text);
    }).then(() => 
    {
        console.log('fini');
        // Once assets are loaded, display a message or start the game
        loadingText.text = 'Assets loaded!';
    }).catch((error) => 
    {
        console.error('Error loading assets:', error);
    });
})();
