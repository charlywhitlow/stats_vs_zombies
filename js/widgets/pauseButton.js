class PauseButton extends Phaser.Scene {
    constructor(config){
        super();
        this.scene = config.scene;
        this.grid = config.grid;

        // add buttons
        this.pauseButton();
        this.playButton();

        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();
    }

    // create buttons
    pauseButton(){
        this.pauseButton = this.scene.add.image(0, 0, "pause").setOrigin(0, 0);
        Align.scaleToGameW(this.pause, 0.18);
        this.pauseButton.setScrollFactor(0);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', this.pause.bind(this));
        this.pauseButton.visible = true;        
    }
    playButton(){
        this.playButton = this.scene.add.image(0, 0, "play").setOrigin(0, 0);
        Align.scaleToGameW(this.playButton, 0.2);
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
