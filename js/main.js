var game;
window.onload = function() {
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    var w = 360;
    var h = 640;
    if (isMobile != -1) {
        this.console.log("mobile");
        w = window.innerWidth;
        h = window.innerHeight;
    }

    var config = {
        type: Phaser.AUTO,
        width: w,
        height: h,
        parent: 'phaser-game',
        scene: [TitleScene, SceneMain, PauseScene],
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        }
    };
    game = new Phaser.Game(config);
}