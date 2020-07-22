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
        let titleText = this.addText(this.grid, "Stats Vs Zombies", titleConfig);
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
        let newGameButton = this.addText(this.grid, "New Game", newGameConfig);
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
        let loadGameButton = this.addText(this.grid, "Load Game", loadGameConfig);
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
        let leaderboardButton = this.addText(this.grid, "Leaderboard", leaderboardConfig);
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
        let aboutButton = this.addText(this.grid, "About", aboutConfig);
        Align.centerH(aboutButton);
        aboutButton.setInteractive().on('pointerdown', this.about.bind(this));
    }
    newGame(){
        this.scene.start("NewGameScene");
    }
    loadGame(){
        console.log('load game');
        // load player from database and pass to map scene:
        // this.scene.start("MapScene", user);
    }
    leaderboard(){
        console.log('leaderboard');
    }
    about(){
        this.scene.start("AboutScene");
    }
    addText(grid, text, config){
        // options: xIndex, yIndex, xWidth, yWidth, xPadding, yPadding
        // fontFamily, fontSize, fontStyle, color, align, backgroundColor

        // defaults
        if (!config.xIndex) {
            config.xIndex = 1;
        }
        if (!config.yIndex) {
            config.yIndex = 1;            
        }
        if (!config.xPadding) {
            config.xPadding = 25;
        }
        if (!config.yPadding) {
            config.yPadding = 25;            
        }
        if (!config.xWidth) {
            config.xWidth = 8;
        }
        if (!config.yWidth) {
            config.yWidth = 3;
        }

        // add question text
        let questionText = this.make.text({
            x: config.xIndex * grid.cellWidth,
            y: config.yIndex * grid.cellHeight,
            padding: { x: config.xPadding, y: config.yPadding },
            text: text,
            style: {
                fontFamily: (config.fontFamily ? config.fontFamily : 'Arial'),
                fontSize: (config.fontSize ? config.fontSize : '70px'),
                color: (config.color ? config.color : 'black'),
                align: (config.align ? config.align : 'center'),
                fixedWidth: config.xWidth * grid.cellWidth,
                fixedHeight: config.yWidth * grid.cellHeight,
                wordWrap: {
                    width: (config.xWidth * grid.cellWidth)-(config.xPadding*2),
                },
            },
        });
        if (config.backgroundColor) {
            questionText.setBackgroundColor(config.backgroundColor);
        }
        if (config.fontStyle) {
            questionText.setFontStyle(config.fontStyle);
        }
        return questionText;        
    }
}