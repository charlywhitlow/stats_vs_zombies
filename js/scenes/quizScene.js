class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
    }
    init(data){
        this.returnScene = data.scene;
    }
    preload(){
        this.load.image("whiteBox", "assets/white_box.png");
        this.load.image("return", "assets/return.png");
    }
    create() {

        // create box grid
        this.boxGrid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });
        // this.boxGrid.showNumbers();

        // white box
        this.box = this.add.image(0, 0, "whiteBox").setOrigin(0, 0);
        Align.scaleToGameW(this.box, 0.9);
        this.boxGrid.placeAtIndex(20, this.box);
        Align.centerH(this.box);

        // retrun button
        this.returnButton = this.add.image(0, 0, 'return').setOrigin(0,0);
        this.boxGrid.placeAtIndex(300, this.returnButton);
        Align.scaleToGameW(this.returnButton, 0.2);
        this.returnButton.setInteractive();
        this.returnButton.on('pointerdown', this.returnToScene.bind(this));        
    }

    returnToScene(){
        this.scene.stop(this.scene.key);
        this.scene.resume(this.returnScene);
    }
}
