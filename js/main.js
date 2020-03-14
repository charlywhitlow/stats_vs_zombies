var game;
window.onload = function() {
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }

    // game config
    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'phaser-game',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth,
            height: window.innerHeight
        },
        autoCenter: Phaser.Scale.CENTER_BOTH,
        scene: [
            IntroScene, 
            TitleScene, 
            SceneMain, 
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
    if (isMobile != -1) {
        document.getElementById("webView").style.display = "none";
        game = new Phaser.Game(config);
    }
}