class PauseScene extends Phaser.Scene {
    constructor() {
        super('pauseScene');
    }
    init(data){
        this.returnScene = data.scene;
        this.pauseButton = data.scene.pauseButton;
    }
    create() {
        // resume play on touching screen
        this.input.on('pointerdown', function () {
            this.scene.resume(this.returnScene);
            this.returnScene.pauseButton.playButton.visible = false;
            this.returnScene.pauseButton.pauseButton.visible = true;
        }, this);
    }
}
