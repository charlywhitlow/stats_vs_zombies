class PauseButton extends Phaser.Scene {
    constructor(config){
        super();
        this.scene = config.scene;
        this.grid = config.grid;
        this.index = 7;
        this.scale = 0.18;
        this.xOrigin = 0.1;
        this.yOrigin = 0.25;

        // add buttons
        this.pauseButton();
        this.playButton();

        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();
    }

    // create buttons
    pauseButton(){
        this.pauseButton = this.scene.add.image(0, 0, "pause").setOrigin(this.xOrigin, this.yOrigin);
        Align.scaleToGameW(this.pauseButton, this.scale);
        this.grid.placeAtIndex(this.index, this.pauseButton);
        this.pauseButton.setScrollFactor(0);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', this.pause.bind(this));
        this.pauseButton.visible = true;        
    }
    playButton(){
        this.playButton = this.scene.add.image(0, 0, "play").setOrigin(this.xOrigin, this.yOrigin);
        Align.scaleToGameW(this.playButton, this.scale);
        this.grid.placeAtIndex(this.index, this.playButton);
        this.playButton.setScrollFactor(0);
        this.playButton.setInteractive();
        this.playButton.on('pointerdown', this.play.bind(this));
        this.playButton.visible = false;
    }

    // toggle pause/play buttons and dispatch events
    pause(){
        this.pauseButton.visible = false;
        this.playButton.visible = true;
        this.emitter.emit("CONTROL_PRESSED", "PAUSE");
    }
    play(){
        this.playButton.visible = false;
        this.pauseButton.visible = true;
        this.emitter.emit("CONTROL_PRESSED", "PLAY");
    }
}
