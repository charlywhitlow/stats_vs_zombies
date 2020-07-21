class NewGameScene extends Phaser.Scene {
    constructor() {
        super('NewGameScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
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

        // create user title
        let nameTextConfig = {
            xIndex : 1,
            yIndex : 10.5,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'white',
        };
        let nameText = this.addText(this.grid, "Enter a name:", nameTextConfig);
        Align.centerH(nameText);

        // add html form
        this.form = this.add.dom(0, 0).createFromCache('createUserForm');
        this.grid.placeAtIndex(320, this.form);
        Align.centerH(this.form);
        this.form.addListener('click');
        this.form.on('click', function (event) {
            if (event.target.name === 'createButton'){
                let inputUsername = this.getChildByName('username').value.trim();
                // let inputPassword = this.getChildByName('password').value.trim();
                // launch new game if username not blank
                if (inputUsername !== ''){
                    this.scene.newGame(inputUsername);
                }
                else{
                    window.alert('Please enter a username to continue');
                }
            }
        });
    }
    launchNewGame(username){
        // create new player and launch game
        let user = {
            "username" : username,
            "zone" : 1,
            "level" : 1,
            "gold" : 0,
            "score" : 0
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