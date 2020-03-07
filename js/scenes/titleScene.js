class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'title' })
    }
  
    preload() {
        this.load.image('titleBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image('logo', 'assets/logo_white.png');
        this.load.image('start', 'assets/buttons/start.png');
        this.load.audio('title_loop', ['assets/audio/title_loop.ogg', 'assets/audio/title_loop.mp3']);
    }
  
    create() {
        // add title background
        this.bg = this.add.image(0, 0, 'titleBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);

        // set up align grid for visible screen
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 16,
            cols: 9
        });
        // this.aGrid.showNumbers();

        // add logo
        this.logo = this.add.image(0, 0, 'logo').setOrigin(0,0);
        this.aGrid.placeAtIndex(10, this.logo);
        Align.scaleToGameW(this.logo, .8);
        Align.centerH(this.logo);

        // start button
        this.start = this.add.image(0, 0, 'start').setOrigin(0,0);
        this.aGrid.placeAtIndex(100, this.start);
        Align.scaleToGameW(this.start, 0.3);
        Align.centerH(this.start);
        this.start.setInteractive();
        this.start.on('pointerdown', this.startGame.bind(this));

        // play music
        this.titleMusic = this.sound.add("title_loop");
        this.titleMusic.play();
        this.titleMusic.stop();
    }

    startGame(){
        this.scene.start("SceneMain", "data from title scene");
        this.titleMusic.pause();

    }
}
