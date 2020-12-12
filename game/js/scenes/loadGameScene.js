class LoadGameScene extends Phaser.Scene {
    constructor() {
        super('LoadGameScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image('back', 'assets/buttons/back.png');
        this.load.html('loginForm', 'assets/html/loginForm.html');
        this.load.json('zone', 'assets/data/zone1.json');
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
        let nameText = this.addText(this.grid, "Login:", {
            xIndex : 1,
            yIndex : 8,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'white',
        });
        Align.centerH(nameText);

        // add html form
        this.form = this.add.dom(0, 0).createFromCache('loginForm');
        let index = this.grid.getFirstCellInRow(16);
        this.grid.placeAtIndex(index, this.form);
        Align.centerH(this.form);

        // handle login
        this.form.addListener('click');
        this.form.on('click', function (event) {
            if (event.target.name === 'goButton'){
                let scene = this.scene;
                let inputUsername = this.getChildByName('username').value.trim();
                let inputPassword = this.getChildByName('password').value.trim();

                if (inputUsername !== '' && inputPassword !== ''){
                    // post to login endpoint
                    $.ajax({
                        type: 'POST',
                        url: '/login',
                        data : {
                            "username": inputUsername, 
                            "password": inputPassword
                        },
                        success: function (data) {
                            let user = {
                                "username" : data.user.username,
                                "zone" : data.user.zone,
                                "level" : data.user.level,
                                "health" : data.user.health,
                                "gold" : data.user.gold,
                                "score" : data.user.score
                            };
                            scene.loadGame(user);
                        },
                        error: function (xhr) {
                            window.alert(JSON.parse(JSON.stringify(xhr.responseJSON.message))+", please try again.");
                        }
                    });
                }else{
                    window.alert('Please enter username and password to continue');
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
    loadGame(user){
        let questionDeck = this.cache.json.get('zone')["questionDeck"];
        user.questionQueue = new QuestionQueue(questionDeck);
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