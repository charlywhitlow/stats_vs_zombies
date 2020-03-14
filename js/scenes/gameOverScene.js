class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }
    init(data){
        this.returnScene = data.scene;
    }
    create() {        
        // fade out
        let red = 107;
        let green = 33
        let blue = 28;
        this.cameras.main.fade(800, red, green, blue);

        // fade back in
        this.cameras.main.on('camerafadeoutcomplete', function () {
            this.cameras.main.fadeFrom(500, red, green, blue);
            this.cameras.main.setBackgroundColor('rgba('+red+','+green+','+blue+',0.7)');

            // display game over message and button
            this.gameOverMessage();
        }, this);
    }

    gameOverMessage(){

        // create box grid
        this.boxGrid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });
        // this.boxGrid.showNumbers();

        // game over text
        this.gameOverText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 32, y: 16 },
            text: 'Game Over',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
                backgroundColor: 'red',
            },
            add: true
        });
        Align.scaleToGameW(this.gameOverText, .8);
        this.boxGrid.placeAtIndex(200, this.gameOverText);
        Align.centerH(this.gameOverText);

        // retry button
        this.retryButton = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 32, y: 16 },
            text: 'Retry',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
                backgroundColor: 'lightgrey',
            },
            add: true
        });
        Align.scaleToGameW(this.retryButton, .3);
        this.boxGrid.placeAtIndex(300, this.retryButton);
        Align.centerH(this.retryButton);
        this.retryButton.setInteractive().on('pointerdown', this.restartLevel.bind(this));
    }
    restartLevel(){
        this.scene.stop(this.scene.key);
        this.returnScene.scene.restart();
    }
}