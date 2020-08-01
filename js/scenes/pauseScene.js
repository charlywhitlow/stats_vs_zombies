class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }
    init(data){
        this.returnScene = data;
    }
    preload(){
        this.load.image('invisible', 'assets/sprites/invisible.png');
    }
    create() {
        // create grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 16,
            cols: 9
        });

        // define scale
        this.scale = {
            backIndex : 0,
            playIndex : 7,
            scale : 2/9,
            xOrigin : 0.2,
            yOrigin : 0.2,
        }

        // add invisble button overlays
        this.playButtonOverlay();
        this.backButtonOverlay();
    }

    playButtonOverlay(){
        this.playButton = this.scene.scene.add.image(0, 0, "invisible").setOrigin(this.scale.xOrigin, this.scale.yOrigin); // change to invsible
        Align.scaleToGameW(this.playButton, this.scale.scale);
        this.grid.placeAtIndex(this.scale.playIndex, this.playButton);
        this.playButton.setInteractive().on('pointerdown', function () {
            this.playButton.visible = false;
            this.backButton.visible = false;
            // resume main scene and toggle play/pause icons
            this.scene.resume(this.returnScene.scene);
            this.returnScene.scene.pauseButton.playButton.visible = false;
            this.returnScene.scene.pauseButton.pauseButton.visible = true;
        }, this);
    }
    backButtonOverlay(){
        this.backButton = this.scene.scene.add.image(0, 0, "invisible").setOrigin(this.scale.xOrigin, this.scale.yOrigin); // change to invsible
        Align.scaleToGameW(this.backButton, this.scale.scale);
        this.grid.placeAtIndex(this.scale.backIndex, this.backButton);
        this.backButton.setInteractive().on('pointerdown', function () {
            // resume main scene
            let goBack = this.returnScene.scene.backButton.goBack();
            if (goBack) {
                this.backButton.visible = false;
                this.playButton.visible = false;
            }
        }, this);
    }
}
