var game;
window.onload = function() {

    // game config
    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.RESIZE,
            parent: 'phaser-game',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth,
            height: window.innerHeight
        },
        autoCenter: Phaser.Scale.CENTER_BOTH,
        dom: {
            createContainer: true
        },
        scene: [
            IntroScene, 
            TitleScene, 
            MenuScene,
            AboutScene,
            NewGameScene,
            StoryScene,
            MapScene,
            MainGameScene, 
            PauseScene,
            QuizScene,
            GameOverScene
        ],
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true
            }
        },
    };

    // launch game (mobile only)
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    if (isMobile != -1) {
        document.getElementById("webView").style.display = "none";
        game = new Phaser.Game(config);
    }
}