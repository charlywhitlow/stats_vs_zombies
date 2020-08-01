class NewGameScene extends Phaser.Scene {
    constructor() {
        super('NewGameScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image("back", 'assets/buttons/back.png');
        this.load.html('createUserForm', 'assets/html/newUser.html');
    }
    create() {
        // add title background
        this.bg = this.add.image(0, 0, 'menuBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);
        Align.stretchToGameH(this.bg, 1);

        // create box grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // create user title
        let nameText = this.addText(this.grid, "Enter a name:", {
            xIndex : 1,
            yIndex : 8,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'white',
        });
        Align.centerH(nameText);

        // add html form
        this.form = this.add.dom(0, 0).createFromCache('createUserForm');
        let index = this.grid.getFirstCellInRow(14);
        this.grid.placeAtIndex(index, this.form);
        Align.centerH(this.form);
        this.form.addListener('click');
        this.form.on('click', function (event) {
            if (event.target.name === 'createButton'){
                let inputUsername = this.getChildByName('username').value.trim();
                // let inputPassword = this.getChildByName('password').value.trim();
                // launch new game if username not blank
                if (inputUsername !== ''){
                    this.scene.launchNewGame(inputUsername);
                }
                else{
                    window.alert('Please enter a username to continue');
                }
            }
        });

        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MenuScene",
            warning: null
        });

        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);
    }
    launchNewGame(username){
        // create new player and launch game
        let user = {
            "username" : username,
            "zone" : 1,
            "level" : 1,
            "gold" : 0,
            "score" : 0,
            "stars" : 0
        };
        this.scene.start("MapScene", user);
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