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

        // add stats vs zombie title
        let titleConfig = {
            xIndex : 1,
            yIndex : 4,
            xWidth : 16,
            yWidth : 3,
            fontSize : '90px',
            fontStyle : 'bold',
            color: 'white',
        };
        let titleText = GameText.addText(this, this.grid, "Stats Vs Zombies", titleConfig);
        Align.centerH(titleText);

        // add buttons
        this.addButtons();

        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);
    }
    addButtons(){
        let newGameConfig = {
            xIndex : 1,
            yIndex : 11,
            xWidth : 10,
            yWidth : 2.5,
            backgroundColor: 'lightgrey',
            fontSize : '70px',
            color: 'black',
        };
        let newGameButton = GameText.addText(this, this.grid, "New Game", newGameConfig);
        Align.centerH(newGameButton);
        newGameButton.setInteractive().on('pointerdown', this.newGame.bind(this));

        let loadGameConfig = {
            xIndex : 1,
            yIndex : 15,
            xWidth : 10,
            yWidth : 2.5,
            backgroundColor: 'lightgrey',
            fontSize : '70px',
            color: 'black',
        };
        let loadGameButton = GameText.addText(this, this.grid, "Load Game", loadGameConfig);
        Align.centerH(loadGameButton);
        loadGameButton.setInteractive().on('pointerdown', this.loadGame.bind(this));

        let leaderboardConfig = {
            xIndex : 1,
            yIndex : 19,
            xWidth : 10,
            yWidth : 2.5,
            backgroundColor: 'lightgrey',
            fontSize : '70px',
            color: 'black',
        };
        let leaderboardButton = GameText.addText(this, this.grid, "Leaderboard", leaderboardConfig);
        Align.centerH(leaderboardButton);
        leaderboardButton.setInteractive().on('pointerdown', this.leaderboard.bind(this));

        let aboutConfig = {
            xIndex : 1,
            yIndex : 23,
            xWidth : 10,
            yWidth : 2.5,
            backgroundColor: 'lightgrey',
            fontSize : '70px',
            color: 'black',
        };
        let aboutButton = GameText.addText(this, this.grid, "About", aboutConfig);
        Align.centerH(aboutButton);
        aboutButton.setInteractive().on('pointerdown', this.about.bind(this));
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