class PauseButton extends UIBlock {
    constructor(config){
        super();
        this.scene = config.scene;
        this.grid = config.grid;

        this.scale = {
            index : 7,
            scale : 0.18,
            xOrigin : 0.1,
            yOrigin : 0.25,
        }

        // add buttons
        this.pauseButton();
        this.playButton();

        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();
    }

    // create buttons
    pauseButton(){
        this.pauseButton = this.scene.add.image(0, 0, "pause").setOrigin(this.scale.xOrigin, this.scale.yOrigin);
        Align.scaleToGameW(this.pauseButton, this.scale.scale);
        this.grid.placeAtIndex(this.scale.index, this.pauseButton);
        this.pauseButton.setScrollFactor(0);
        this.pauseButton.visible = true;

        this.pauseButton.setInteractive().on('pointerdown', function () {
            // toggle play/pause icon
            this.pauseButton.visible = false;
            this.playButton.visible = true;
            // dispatch pause event back to main scene, to launch pause scene
            this.emitter.emit("CONTROL_PRESSED", "PAUSE");
        }, this);
    }
    playButton(){
        this.playButton = this.scene.add.image(0, 0, "play").setOrigin(this.scale.xOrigin, this.scale.yOrigin);
        Align.scaleToGameW(this.playButton, this.scale.scale);
        this.grid.placeAtIndex(this.scale.index, this.playButton);
        this.playButton.visible = false;
        this.playButton.setScrollFactor(0);
    }
}
