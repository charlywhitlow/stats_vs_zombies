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
        this.nameText = new GameText(this, {
            text : 'Login:',
            width : 16,
            height : 3,
            fontSize : 70,
            fontColor : 'white'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(8), this.nameText);
        Align.centerH(this.nameText);

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
}