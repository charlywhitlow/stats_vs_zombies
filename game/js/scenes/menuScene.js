class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
    }
    create() {
        // add title background
        this.bg = this.add.image(0, 0, 'menuBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);
        Align.scaleToGameH(this.bg, 1);

        // create box grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // title text
        this.titleText = new GameText(this, {
            text : 'Stats Vs Zombies',
            width : 16,
            height : 8,
            fontSize : 90,
            fontColor : 'white'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(4), this.titleText);
        Align.centerH(this.titleText);

        // add buttons
        this.addButtons();

        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);
    }
    addButtons(){
        // new game
        this.newGameButton = new MenuButton(this, "New Game");
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(11), this.newGameButton);
        Align.centerH(this.newGameButton);
        this.newGameButton.setInteractive().on('pointerdown', this.newGame.bind(this));

        // load game
        this.loadGameButton = new MenuButton(this, "Load Game");
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(15), this.loadGameButton);
        Align.centerH(this.loadGameButton);
        this.loadGameButton.setInteractive().on('pointerdown', this.loadGame.bind(this));

        // leaderboard
        this.leaderboardButton = new MenuButton(this, "Leaderboard");
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(19), this.leaderboardButton);
        Align.centerH(this.leaderboardButton);
        this.leaderboardButton.setInteractive().on('pointerdown', this.leaderboard.bind(this));

        // about
        this.aboutButton = new MenuButton(this, "About");
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(23), this.aboutButton);
        Align.centerH(this.aboutButton);
        this.aboutButton.setInteractive().on('pointerdown', this.about.bind(this));
    }
    newGame(){
        this.scene.start("NewGameScene");
    }
    loadGame(){
        this.scene.start("LoadGameScene");
    }
    leaderboard(){
        window.alert('This feature has not yet been implemented');
    }
    about(){
        this.scene.start("AboutScene");
    }
}